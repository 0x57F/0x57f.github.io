const { antlr4, Lexer, Parser, Visitor } = self.parser.default;


const SYMBOL_TYPES = {
    VARIABLE: 0,
    INTEGER_LITERAL: 1,
    FUNCTION_IDENTIFIER: 2,
    TEMP_CALC: 3,
    LOOP_LABEL: 4,
    IF_LABEL: 5,
}

// A table for holding symbols - defining when they are created. This is a top level one, it should contain other sub-tables for functions and scopes. To be sorted out later
class SymbolTable {
    constructor(scope_prefix="global", parent = undefined) {
        this.table = {};
        this.scope_prefix = scope_prefix;

        this.weak_scope_labels = new Array();
        this.parent = parent;

        this.sub_assemblies = [];
    }

    static temp_calc_id = 0;
    static loop_id = 0;
    static if_id = 0;

    init_from_parent(parent, scope_name) {
        this.parent = parent;
        this.scope_prefix = scope_name;
    }

    enter_weak_scope(scope_label) {
        this.weak_scope_labels.push(scope_label);
    }

    leave_weak_scope() {
        this.weak_scope_labels.pop();
    }

    add_symbol(name, type, starting_value) {
        //console.log(name, type, starting_value);
        switch (type) {
            case SYMBOL_TYPES.INTEGER_LITERAL:
            case SYMBOL_TYPES.TEMP_CALC:
            case SYMBOL_TYPES.IF_LABEL:
            case SYMBOL_TYPES.LOOP_LABEL:
                this.table[name] = new Symbol(name, type, starting_value);
                break;

            case SYMBOL_TYPES.VARIABLE:
                this.table[name] = new Symbol(name, type, 0);
                break;
            default:
                console.warn("Adding symbol of unhandled type");
                break;
        }
    }

    find_symbol(name) {
        return this.find_symbol_reference(name)?.name;
    }

    find_symbol_reference(name) {
        if (name === "literal_3") {
            console.trace("boop");
        }
        for (let key in this.table) {
            if (name == key) {
                return { name: this.table[name], ctx: this };
            }
        }
        if (this.parent) return this.parent.find_symbol_reference(name);
        
        return { name: undefined, ctx: undefined};
    }

    find_symbol_label(label_name) {
        let res = this.find_symbol_reference(label_name);
        let { name, ctx } = res;

        if (!name || !ctx) return undefined;

        return this.generate_scoped_label(ctx.scope_prefix, name);
    }

    already_exists(name) {
        return this.find_symbol(name) != undefined; 
    }

    generate_label(name, type) {
        switch (type) {
            case SYMBOL_TYPES.INTEGER_LITERAL:
                return `literal_${name}`;

            case SYMBOL_TYPES.FUNCTION_IDENTIFIER:
                return `func_${name}`;

            case SYMBOL_TYPES.VARIABLE:
                return `var_${name}`;

            case SYMBOL_TYPES.TEMP_CALC:
                return `temp_${SymbolTable.temp_calc_id++}`;

            case SYMBOL_TYPES.LOOP_LABEL:
                return `loop_${SymbolTable.loop_id++}`;

            case SYMBOL_TYPES.IF_LABEL:
                return `if_${SymbolTable.if_id++}`;

            default:
                return `unknown_${name}`;
        }
    }

    generate_scoped_label(scope, label) {
        if (!scope || !label) return;
        switch (label.type) {
            case SYMBOL_TYPES.VARIABLE:
                return `${scope}_${label.label}`;

            case SYMBOL_TYPES.TEMP_CALC:
            case SYMBOL_TYPES.IF_LABEL:
            case SYMBOL_TYPES.INTEGER_LITERAL:
            case SYMBOL_TYPES.LOOP_LABEL:
                return label.label;

            case SYMBOL_TYPES.FUNCTION_IDENTIFIER:
                alert("FUNCTION IDENTIFIER NOT IMPLEMENTED");
                return;
            
            default:
                console.warn("Trying to generate a scoped label with an unhandled type")
                return;
        }
    }

    generate_code() {
        let assembly = "";
        for (let sub_assembly of this.sub_assemblies) {
            assembly += sub_assembly; 
        }
        for (let symbol in this.table) {
            switch (this.table[symbol].type) {
                default:
                    console.warn("IMPLEMENT THIS");
                    assembly += `${this.generate_scoped_label(this.scope_prefix, this.table[symbol])} DAT ${this.table[symbol].starting_value}\n`;
            }
        }

        if (this.weak_scope_labels.length > 0) console.warn("Found weak scope leaking: ", this.weak_scope_labels);
        return assembly;
    }

    generate_symbol(initial_value, type) {
        switch (type) {
            case SYMBOL_TYPES.INTEGER_LITERAL:
                if (this.parent) return this.parent.generate_symbol(initial_value, type);
                else break;
        }

        let literal_name = this.generate_label(initial_value, type);

        if (!this.already_exists(literal_name)) {
            console.log(literal_name, initial_value, "did not exist", this);
            this.add_symbol(literal_name, type, initial_value);
        }
        let access = this.find_symbol_label(literal_name);
        return access;
    }
}

class Symbol {
    constructor(label, type = SYMBOL_TYPES.INTEGER_LITERAL, starting_value = 0) {
        this.label = label;
        this.type = type;
        this.starting_value = starting_value;
    }
}


let assembly = "";

class Compiler extends Visitor {
    constructor() {
        super();

        this._visitTerminal = this.visitTerminal;
        this.visitTerminal = ctx => {
            //console.log('TERMINAL', ctx)
            return this._visitTerminal(ctx);
        }
        this._visitChildren = this.visitChildren;
        this.visitChildren = ctx => {
            //console.log('CHILD', ctx);
            return this._visitChildren(ctx);
        }

        this.symbol_table = new SymbolTable();
        this.symbol_table_pool = [this.symbol_table];
    }

    visitProgram(ctx) {
        //console.log("PORGRAM", ctx);
        this.visitChildren(ctx);
        assembly += `HLT\n`;

        for (let table of this.symbol_table_pool) {
            assembly += table.generate_code();
        }
    }

    visitClosure(ctx) {
        //console.log("CLOSURE", ctx);
        if (!ctx) return;
        if (ctx.children.length == 0) return;

        for (let child of ctx.children) {
            //console.log(child);
            child.accept(this);
        }
    }

    visitStat(ctx) {
        //console.log("STAT", ctx);
        let left_label = ctx.stat_identifier.accept(this);

        let right_label = ctx.stat_value.accept(this);

        // Must recieve a label to store and another label to load
        assembly += `LDA ${right_label}\n`
        assembly += `STA ${left_label}\n`
        return;
    }

    visitTrue_id(ctx) {
        //console.log("TRUE_ID", ctx);
        // TODO: REVISIT
        if (!ctx) return this.visitChildren(ctx);

        let text = this.symbol_table.generate_symbol(ctx.start.text, SYMBOL_TYPES.VARIABLE);
        //console.log("adding to table");
        //console.log(this.symbol_table.table);

        // TODO: Will break on list indexes and .calls()
        return text;
    }

    visitExpr(ctx) {
        //console.log("EXPR", ctx);

        if (ctx == undefined) return;
        // An expresion should always return a value, so make sure it does that
        if (ctx.children.length < 2) return this.visitChildren(ctx);

        // If it has a length of more than one, it is a logical negation/and/or

        let left_operand = ctx.children[0].accept(this);

        let mid_operand = ctx.children[1].accept(this);

        let output_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        if (left_operand == 'NOT') {
            assembly +=
                `\n// NOT for ${mid_operand}\n` +
                `LDA ${mid_operand}\n` +
                `BRP ${output_label}_false\n` +
                `LDA ${one}\n` +
                `BRA ${output_label}_end\n` +
                `LDA ${zero}\n` +
                `${output_label}_end STA ${output_label}\n`;
        }
        else {
            let right_operand = ctx.children[2].accept(this);
            if (mid_operand == 'AND') {
                assembly +=
                    `\n// AND for ${left_operand} and ${right_operand}\n` +
                    `LDA ${left_operand}\n` +
                    `BRZ ${output_label}_false\n` +
                    `LDA ${right_operand}\n` +
                    `BRZ ${output_label}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${output_label}_end\n` +
                    `LDA ${zero}\n` +
                    `${output_label}_end STA ${output_label}\n\n`;
            }
            else if (mid_operand == 'OR') {
                assembly +=
                    `\n// OR for ${left_operand} and ${right_operand}\n` +
                    `LDA ${left_operand}\n` +
                    `ADD ${right_operand}\n` +
                    `BRZ ${output_label}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${output_label}_end\n` +
                    `${output_label}_false LDA ${zero}\n` +
                    `${output_label}_end STA ${output_label}\n`;
            }
        }
        return output_label;
    }

    visitLiteral(ctx) {
        //console.log("LITERAL", ctx);
        if (ctx == undefined) return;
        let children_read_value = this.visitChildren(ctx).toString();
        let literal_name;

        // If ctx.name exists then we got a literal
        if (ctx.name) {
            return this.visitChildren(ctx);
        }

        // switch on the value of the only child
        switch (ctx.children[0].symbol.type) {
            case Lexer.INT:
                literal_name = this.symbol_table.generate_symbol(children_read_value, SYMBOL_TYPES.INTEGER_LITERAL);
                break;

            // NOTE: Potential Bug for when working with scopes and variables
            default:
                console.warn("Unchecked type assumption");
                // We got an identifier
                literal_name = this.symbol_table.generate_symbol(children_read_value, SYMBOL_TYPES.VARIABLE);
        }

        return literal_name;
    }

    visitCalc(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_operand = ctx.children[0].accept(this);
        // right operand should be a label
        let right_operand = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        assembly += `LDA ${left_operand}\n`

        // TODO: NEEDS UPDATING - INCONSISTENT
        switch (ctx.children[1].symbol.type) {
            case Lexer.PLUS:
                assembly += `ADD ${right_operand}\n`;
                break;

            case Lexer.NEG:
                assembly += `SUB ${right_operand}\n`
                break;
        }

        assembly += `STA ${total_label}\n`

        return total_label;
    }


    visitMul(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Add the literal one to the symbol table for ocunting purposes
        let literal_one_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MUL:
                // copy the right operand to avoid mutation
                let right_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                assembly +=
                    `\n// Multiplying ${left_label} ${right_label}\n` +
                    `LDA ${right_label}\n` +
                    `STA ${right_label_temp}\n` +
                    `${loop_label}_start LDA ${total_label}\n` +
                    `ADD ${left_label}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${right_label_temp}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${right_label_temp}\n` +
                    `BRZ ${loop_label}_end\n` +
                    `BRA ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label}\n`;
                break;

            case Lexer.DIV:
                let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                assembly +=
                    `\n// DIV for ${left_label} and ${right_label}\n` +
                    `LDA ${left_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `${loop_label}_start LDA ${left_label_temp}\n` +
                    `SUB ${right_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${total_label}\n`;
                break;
        }

        return total_label;
    }

    visitMod(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Copy the left operands to avoid mutation
        let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        assembly += `LDA ${left_label}\n` +
            `STA ${left_label_temp}\n`;

        // Add the literal one to the symbol table for ocunting purposes
        let literal_one_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MODKW:
                assembly +=
                    `\n// MOD for ${left_label} and ${right_label}\n` +
                    `${loop_label}_start LDA ${left_label_temp}\n` +
                    `SUB ${right_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end ADD ${right_label}\n` +
                    `STA ${total_label}\n`;
                break;

            case Lexer.DIVKW:
                assembly +=
                    `\n// DIV for ${left_label} and ${right_label}\n` +
                    `${loop_label}_start LDA ${left_label_temp}\n` +
                    `SUB ${right_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${total_label}\n`;
                break;
        }
        return total_label;
    }

    visitPow(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let outer_loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);
        let inner_loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Add the literal one to the symbol table for counting purposes
        let literal_one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let literal_zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        // Copy the left and right operands to avoid mutation
        let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        assembly += `LDA ${left_label}\n` +
            `STA ${left_label_temp}\n`;

        // Copy the left and right operands to avoid mutation
        let right_operand_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        assembly += `LDA ${right_label}\n` +
            `STA ${right_operand_temp}\n`;

        assembly += '\n';
        switch (ctx.children[1].symbol.type) {
            case Lexer.POW:
                assembly +=
                    `\n// POW for ${left_label} and ${right_label}\n` +
                    // For explanation of pseudocode, see flowchart "LMC POW.drawio"
                    `LDA ${left_label_temp}\n` +
                    `STA ${left_label_temp}\n` +
                    `${outer_loop_label}_start BRA ${inner_loop_label}_start\n` +
                    // Create a copy of the left label, needs to be done every loop
                    `${inner_loop_label}_start LDA ${total_label}\n` +
                    `ADD ${left_label_temp}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `SUB ${literal_one}\n` +
                    `STA ${left_label_temp}\n` +
                    `BRZ ${inner_loop_label}_end\n` +
                    `BRA ${inner_loop_label}_start\n` +
                    `${inner_loop_label}_end LDA ${right_operand_temp}\n` +
                    `SUB ${literal_one}\n` +
                    `STA ${right_operand_temp}\n` +
                    `SUB ${literal_one}\n` +
                    `BRZ ${outer_loop_label}_end\n` +
                    `LDA ${total_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${literal_zero}\n` +
                    `STA ${total_label}\n` +
                    `BRA ${outer_loop_label}_start\n` +
                    `${outer_loop_label}_end LDA ${total_label}\n`;

                break;

            default:
                break;
        }
        return total_label;
    }

    visitBracket(ctx) {
        if (ctx.children.length == 1) return ctx.children[0].accept(this);
        if (ctx.children.length == 3) return ctx.children[1].accept(this);

        //console.log("NEG FOUND", ctx);
        let literal_zero_name = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let left_label = ctx.children[1].accept(this);

        assembly += `LDA ${literal_zero_name}\n` +
            `SUB ${left_label}\n` +
            `STA ${total_label}\n`;
        return total_label;
    }

    visitComparison(ctx) {
        //console.log("comparison", ctx);
        if (ctx.children.length < 3) return this.visitChildren(ctx);

        let left_label = ctx.children[0].accept(this);
        let right_label = ctx.children[2].accept(this);

        let result_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        //console.log(ctx.children[1].accept(this));
        assembly += `\n// Comparison\n`
        switch (ctx.children[1].accept(this)) {
            case '<':
                // A < B
                // IF A - B - 1 is negative
                // NOTE: tested with 4 and 20 < 10
                assembly +=
                    `LDA ${right_label}\n` +
                    `SUB ${left_label}\n` +
                    `SUB ${one}\n` +
                    `BRP ${result_label}_true\n` +
                    `LDA ${zero}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_true LDA ${one}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;

            case '>':
                // B < A
                // IF B - A - 1 is negative
                // NOTE: Tested with 10>4, 4 > 10, 4>4
                assembly +=
                    `LDA ${left_label}\n` +
                    `SUB ${right_label}\n` +
                    `SUB ${one}\n` +
                    `BRP ${result_label}_true\n` +
                    `LDA ${zero}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_true LDA ${one}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;

            case '==':
                // B == A
                // IF B - A is zero 
                // NOTE: Tested with 10 == 10, 4==4
                assembly +=
                    `LDA ${right_label}\n` +
                    `SUB ${left_label}\n` +
                    `BRZ ${result_label}_true\n` +
                    `LDA ${zero}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_true LDA ${one}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;

            case '>=':
                // B >= A
                // IF B - A is positive 
                // NOTE: TESTED WITH 10 >= 4, 4 >= 10, 10 >= 10
                assembly +=
                    `LDA ${left_label}\n` +
                    `SUB ${right_label}\n` +
                    `BRP ${result_label}_true\n` +
                    `LDA ${zero}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_true LDA ${one}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;

            case '<=':
                // B <= A
                // IF A - B is positive 
                // NOTE: TESTED WITH 4 <= 10, 10 <= 4, 10 <= 10
                assembly +=
                    `LDA ${right_label}\n` +
                    `SUB ${left_label}\n` +
                    `BRP ${result_label}_true\n` +
                    `LDA ${zero}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_true LDA ${one}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;

            case '!=':
                // B != A
                // IF A - B is not zero 
                // NOTE: Tested with 4 != 10, and 10 != 10
                assembly +=
                    `LDA ${left_label}\n` +
                    `SUB ${right_label}\n` +
                    `BRZ ${result_label}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_false LDA ${zero}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;
        }

        return result_label;
    }

    /**
    * WHILE LOOP FORMAT:
    * while COND
    *   do_stuff
    * endwhile
    *
    * IN ASSEMBLY:
    * WHILE_START
    * CHECK_CONDTION
    * IF False BRANCH TO END
    * do_stuff
    * END endwhile
    */

    visitWhile_start(ctx) {
        // We are interested in the label to the condition
        if (ctx == undefined) return;
        if (ctx.children.length < 3) return;

        return this.visitChildren(ctx);
    }

    visitWhile(ctx) {
        if (ctx == undefined) return;
        if (ctx.children.length < 4) return;

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);
        this.symbol_table.enter_weak_scope(loop_label);

        // set a starting label, and do some loopy stuff
        assembly += `\n// While loop condition\n${loop_label}_start NOP\n`;
        let while_condition = ctx.children[0].accept(this);
        assembly += `BRZ ${loop_label}_end\n`;

        assembly += `\n// While loop Body\n`;
        ctx.children[1].accept(this);

        assembly +=`\n// While loop end\n` +
            `BRA ${loop_label}_start\n` +
            `${loop_label}_end NOP\n`;


        this.symbol_table.leave_weak_scope();
        return;
    }

    visitDo_while(ctx) {
        if (ctx.children.length < 4) return;
        if (ctx == undefined) return;

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);
        this.symbol_table.enter_weak_scope(loop_label);

        assembly += `\n// Do Until loop start\n${loop_label}_start NOP\n`;
        assembly += `\n// Do Until Body\n`;
        ctx.children[2].accept(this);

        assembly += `\n// Do-Until loop condiiton\n`
        let while_condition = ctx.children[3].accept(this);
        assembly +=
            `\n// Do-Until loop end\n` +
            `LDA ${while_condition}\n` +
            `BRZ ${loop_label}_start\n` +
            `${loop_label}_end NOP\n`;

        this.symbol_table.leave_weak_scope(loop_label);
        return;
    }

    visitDo_end(ctx) {
        if (ctx.children.length < 3) return;
        if (ctx == undefined) return;

        return ctx.children[1].accept(this);
    }

    visitIf(ctx) {
        assembly += `\n// If Start\n`
        let if_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.IF_LABEL);
        let number_of_branches = ctx.children.length / 2 - 1;

        let else_found = false;

        let i;
        //console.log("if", ctx.children);
        for (i = 0; i < number_of_branches; i++) {
            let condition_label = ctx.children[i * 2].accept(this);
            if (condition_label !== 0) {
                assembly +=
                    `\n// If Branch\n` +
                    `${if_label}_${i} NOP\n` +
                    `LDA ${condition_label}\n` +
                    `BRZ ${if_label}_${i + 1}\n`;
            } else {
                assembly += `\n// If End\n` +
                    `${if_label}_${i} NOP\n`;
                else_found = true;
            }

            ctx.children[i * 2 + 1].accept(this);
        }

        if (!else_found) assembly += `${if_label}_${i} NOP\n`;
    }

    visitIf_start(ctx) {
        if (ctx.children.length < 4) return;
        if (ctx == undefined) return;

        return ctx.children[1].accept(this);
    }

    visitIf_continuation(ctx) {
        if (ctx.children.length < 4) return;
        if (ctx == undefined) return;

        return ctx.children[1].accept(this);
    }

    visitIf_final(ctx) {
        if (ctx.children.length < 2) return;
        if (ctx == undefined) return;

        return 0;
    }

    visitTerminal(ctx) {
        let current_scope = this.symbol_table.weak_scope_labels.at(-1);
        //console.log("terminal", ctx.symbol.text);
        switch (ctx.symbol.type) {
            case Lexer.BREAK:
                assembly += `BRA ${current_scope}_end\n`
                return undefined;

            case Lexer.CONTINUE:
                assembly += `BRA ${current_scope}_start\n`;
                return undefined;

            default:
                return ctx.symbol.text;
        }
    }

    visitFunc_dec(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 5) return;

        let { func_name, params } = ctx.children[1].accept(this);

        let new_scope = new SymbolTable(func_name, this.symbol_table);
        this.symbol_table = new_scope;

        this.symbol_table_pool.push(this.symbol_table);

        // NOTE: This will break at some point
        let assembly_temp = assembly;
        assembly = "";

        assembly += `${func_name}_start NOP\n`;

        for (let i = params.length - 1; i >= 0; i--) {
            let param = this.symbol_table.generate_symbol(params[i], SYMBOL_TYPES.VARIABLE)
            assembly += `POP\n` +
                        `STA ${param}\n`;
        }

        ctx.children[2].accept(this);
        
        assembly += `POP\n` +
                    `RET\n`;

        this.symbol_table.sub_assemblies.push(assembly);

        assembly = assembly_temp;

        
        this.symbol_table = this.symbol_table.parent;
    }

    visitDef(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 4) return;
        let func_name = ctx.children[0].accept(this);

        let params = []
        for (let i = 2; i < ctx.children.length - 2; i +=2) {
            let param = ctx.children[i].accept(this);
            params.push(param);
        }

        return { func_name, params };
    }

    visitReturn(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 2) return;
        if (ctx.children.length == 2) assembly += `POP\nRET\n`


        let result = ctx.children[1].accept(this);
        let temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        
        // swap the return address and return value on the stack
        assembly += `POP\n` +
                    `STA ${temp}\n` +
                    `LDA ${result}\n` +
                    `PSH\n` +
                    `LDA ${temp}\n` +
                    `RET\n`;
    }


    visitFunc_call(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 3) return;

        let func_to_call = ctx.children[0].accept(this);

        let offset_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let offset = 0;
        assembly += `LDAPC\n` +
                    `ADD ${offset_label}\n` +
                    `PSH\n`;
        offset += 2;

        for (let i = 2; i < ctx.children.length - 1; i += 2) {
            let label = ctx.children[i].accept(this);
            assembly += `LDA ${label}\n` +
                        `PSH\n`;
            offset += 2;
        }

        assembly += `BRA ${func_to_call}_start\n`;
        offset += 2;

        this.symbol_table.table[offset_label].starting_value = offset;

        let result_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        
        assembly += `POP\n` +
                    `STA ${result_label}\n`;

        return result_label;

        
    }
    /* FUNCITON CALLS HERE:
        if (this.symbol_table.parent.parent != undefined) {
            for (let symbol in this.symbol_table.parent.table) {

                symbol = this.symbol_table.parent.table[symbol];
                switch (symbol.type) {
                    case SYMBOL_TYPES.TEMP_CALC:
                    case SYMBOL_TYPES.VARIABLE:
                        assembly += `LDA ${this.symbol_table.find_symbol_label(symbol.label)}\n` +
                                    `PSH\n`;
                }
            }
        }
    */
}

// TODO: enforce that multiple variables of different types and the same name cannot be defined


//TODO: < is broken again

const input = `i = 2
if i < 3 then
    i = 1234
endif

function fib(n)
    if n < 3 then
        return 1
    endif
    return fib(n - 1) + fib(n - 2)
endfunction
i = fib(3)
`



const chars = new antlr4.InputStream(input);
const lexer = new Lexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new Parser(tokens);
const tree = parser.program();

let visitor = new Compiler();
tree.accept(visitor);

console.log(visitor.symbol_table_pool);

console.log(assembly);


export default { Compiler };
