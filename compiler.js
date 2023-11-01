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
    constructor(parent = undefined) {
        this.table = {};
        this.scope_prefix = "global";
        this.temp_calc_id = 0;

        this.weak_scope_labels = new Array();
        this.parent = parent;
    }

    static loop_id = 0;
    static if_id = 0;

    init_from_parent(parent, scope_name) {
        this.parent = parent;
        this.scope_prefix = scope_name;
    }

    enter_weak_scope(scope_label) {
        this.weak_scope_labels.push(scope_label);
        console.log(this.weak_scope_labels);
    }

    leave_weak_scope() {
        this.weak_scope_labels.pop();
    }

    add_symbol(name, type, starting_value) {
        //console.log(name, type, starting_value);
        switch (type) {
            case SYMBOL_TYPES.INTEGER_LITERAL:
            case SYMBOL_TYPES.TEMP_CALC:
                if (!this.already_exists(name)) {
                    // Add it to the symbol table with the read default value
                    this.table[name] = new Symbol(name, type, starting_value);
                }
                break;

            case SYMBOL_TYPES.IF_LABEL:
            case SYMBOL_TYPES.LOOP_LABEL:
                break;

            case SYMBOL_TYPES.FUNCTION_IDENTIFIER:
                console.error("Function Identifiers not implemented");

            default:
                if (!this.already_exists(name)) {
                    // Add it to the symbol table with the read default value
                    this.table[name] = new Symbol(name, SYMBOL_TYPES.VARIABLE);
                }
        }
    }

    find_symbol(name) {
        return this.find_symbol_reference(name)?.name;
    }

    find_symbol_reference(name) {
        for (let key in this.table) {
            if (name == key) {
                return { name: this.table[name], ctx: this };
            }
        }
        if (this.parent) return this.parent.find_symbol();
        
        return { name: undefined, ctx: undefined};
    }

    find_symbol_label(label_name) {
        let res = this.find_symbol_reference(label_name);
        let { name, ctx } = res;

        if (!name || !ctx) return undefined;

        return `${ctx.scope_prefix}_${name.label}`;
    }

    already_exists(name) {
        return this.find_symbol(name) == "";
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
                return `temp_${this.temp_calc_id++}`;

            case SYMBOL_TYPES.LOOP_LABEL:
                return `loop_${SymbolTable.loop_id++}`;

            case SYMBOL_TYPES.IF_LABEL:
                return `if_${SymbolTable.if_id++}`;

            default:
                return `unknown_${name}`;
        }
    }


    generate_code() {
        let assembly = "";
        for (let symbol in this.table) {
            switch (this.table[symbol].type) {
                case SYMBOL_TYPES.INTEGER_LITERAL:
                    // These do not depened on the scope, and will be visible across all things
                    assembly += `${symbol} DAT ${this.table[symbol].starting_value}\n`;
                    break;

                case SYMBOL_TYPES.TEMP_CALC:
                case SYMBOL_TYPES.VARIABLE:
                    // These are scope dependent, and so will be prefxed with the scope
                    assembly += `${this.scope_prefix}_${symbol} DAT ${this.table[symbol].starting_value}\n`;
                    break;

                case SYMBOL_TYPES.FUNCTION_IDENTIFIER:
                    alert("FUNCTION IDENTIFIER NOT IMPLEMENTED");
                    return;
            }
        }

        if (this.weak_scope_labels.length > 0) console.warn("Found weak scope leaking: ", this.weak_scope_labels);
        return assembly;
    }

    generate_symbol(initial_value, type) {
        let literal_name = this.generate_label(initial_value, type);
        if (!this.already_exists(literal_name)) {
            this.add_symbol(literal_name, type, initial_value);
        }
        return literal_name;
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
        let left_label_access = this.symbol_table.find_symbol_label(left_label)

        // Add it to the symbol table with the read default value
        this.symbol_table.add_symbol(left_label, SYMBOL_TYPES.VARIABLE);

        let right_label = ctx.stat_value.accept(this);
        let right_label_access = this.symbol_table.find_symbol_label(right_label)

        // Must recieve a label to store and another label to load
        assembly += `LDA ${right_label_access}\n`
        assembly += `STA ${left_label_access}\n`
        return undefined;
    }

    visitTrue_id(ctx) {
        //console.log("TRUE_ID", ctx);
        // TODO: REVISIT
        if (!ctx) return this.visitChildren(ctx);

        let text = this.symbol_table.generate_label(ctx.start.text, SYMBOL_TYPES.VARIABLE);
        //console.log("adding to table");
        this.symbol_table.add_symbol(text, SYMBOL_TYPES.VARIABLE, 0);
        //console.log(this.symbol_table.table);

        // TODO: Will break on list indexes and .calls()
        return text;
    }

    visitExpr(ctx) {
        //console.log("EXPR", ctx);
        // TODO: NEXT UP
        // NOTE: Started this at some point then moved on

        if (ctx == undefined) return;
        // An expresion should always return a value, so make sure it does that
        if (ctx.children.length < 2) return this.visitChildren(ctx);

        // If it has a length of more than one, it is a logical negation/and/or

        let left_operand = ctx.children[0].accept(this);
        let left_operand_access = this.symbol_table.find_symbol_label(left_operand );
        console.log(left_operand_access);

        let mid_operand = ctx.children[1].accept(this);
        let mid_operand_access = this.symbol_table.find_symbol_label(mid_operand );
        console.log(mid_operand_access);

        let output_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let output_label_access = this.symbol_table.find_symbol_label(output_label );
        console.log(output_label_access);

        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        if (left_operand_access == 'NOT') {
            assembly +=
                `\n// NOT for ${mid_operand_access}\n` +
                `LDA ${mid_operand_access}\n` +
                `BRP ${output_label_access}_false\n` +
                `LDA ${one}\n` +
                `BRA ${output_label_access}_end\n` +
                `LDA ${zero}\n` +
                `${output_label_access}_end STA ${output_label_access}\n`;
        }
        else {
            let right_operand = ctx.children[2].accept(this);
            if (mid_operand_access == 'AND') {
                // TODO:
                // return true if the results are both true
                assembly +=
                    `\n// AND for ${left_operand_access} and ${right_operand}\n` +
                    `LDA ${left_operand_access}\n` +
                    `BRZ ${output_label_access}_false\n` +
                    `LDA ${right_operand}\n` +
                    `BRZ ${output_label_access}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${output_label_access}_end\n` +
                    `LDA ${zero}\n` +
                    `${output_label_access}_end STA ${output_label_access}\n\n`;
            }
            else if (mid_operand_access == 'OR') {
                assembly +=
                    `\n// OR for ${left_operand_access} and ${right_operand}\n` +
                    `LDA ${left_operand_access}\n` +
                    `ADD ${right_operand}\n` +
                    `BRZ ${output_label_access}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${output_label_access}_end\n` +
                    `${output_label_access}_false LDA ${zero}\n` +
                    `${output_label_access}_end STA ${output_label_access}\n`;
            }
        }
        return this.visitChildren(ctx);
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

            case Lexer.STRING:
                literal_name = this.symbol_table.generate_symbol(children_read_value.slice(1, -1), SYMBOL_TYPES.STRING_LITERAL);
                break;


            // NOTE: Potential Bug for when working with scopes and variables
            default:
                // We got an identifier
                literal_name = this.symbol_table.generate_label(children_read_value, SYMBOL_TYPES.VARIABLE);
                if (!this.symbol_table.already_exists(literal_name)) {
                    // If it doesn't exist by now, we made a mistake, and should abort
                    console.error(`${literal_name} is not defined`);
                }
        }

        return literal_name;
    }

    visitCalc(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_operand = ctx.children[0].accept(this);
        let left_operand_access = this.symbol_table.find_symbol_label(left_operand);
        console.log(left_operand_access);
        // right operand should be a label
        let right_operand = ctx.children[2].accept(this);
        let right_operand_access = this.symbol_table.find_symbol_label(right_operand);
        console.log(right_operand_access);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let total_label_access = this.symbol_table.find_symbol_label(total_label);
        console.log(total_label_access);

        assembly += `LDA ${left_operand_access}\n`

        // TODO: NEEDS UPDATING - INCONSISTENT
        switch (ctx.children[1].symbol.type) {
            case Lexer.PLUS:
                assembly += `ADD ${right_operand_access}\n`;
                break;

            case Lexer.NEG:
                assembly += `SUB ${right_operand_access}\n`
                break;
        }

        assembly += `STA ${total_label_access}\n`

        return total_label;
    }


    visitMul(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        let left_label_access = this.symbol_table.find_symbol_label(left_label);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);
        let right_label_access = this.symbol_table.find_symbol_label(right_label);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let total_label_access = this.symbol_table.find_symbol_label(total_label);

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Add the literal one to the symbol table for ocunting purposes
        let literal_one_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MUL:
                // copy the right operand to avoid mutation
                let right_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                let right_label_temp_access = this.symbol_table.find_symbol_label(right_label_temp);
                assembly +=
                    `\n// Multiplying ${left_label_access} ${right_label_access}\n` +
                    `LDA ${right_label_access}\n` +
                    `STA ${right_label_temp_access}\n` +
                    `${loop_label}_start LDA ${total_label_access}\n` +
                    `ADD ${left_label_access}\n` +
                    `STA ${total_label_access}\n` +
                    `LDA ${right_label_temp_access}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${right_label_temp_access}\n` +
                    `BRZ ${loop_label}_end\n` +
                    `BRA ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label_access}\n`;
                break;

            case Lexer.DIV:
                let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                let left_label_temp_access = this.symbol_table.find_symbol_label(left_label_temp);
                assembly +=
                    `\n// DIV for ${left_label_access} and ${right_label_access}\n` +
                    `LDA ${left_label_access}\n` +
                    `STA ${left_label_temp_access}\n` +
                    `${loop_label}_start LDA ${left_label_temp_access}\n` +
                    `SUB ${right_label_access}\n` +
                    `STA ${left_label_temp_access}\n` +
                    `LDA ${total_label_access}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label_access}\n` +
                    `LDA ${left_label_temp_access}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label_access}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${total_label_access}\n`;
                break;
        }

        return total_label;
    }

    visitMod(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        let left_label_access = this.symbol_table.find_symbol_label(left_label);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);
        let right_label_access = this.symbol_table.find_symbol_label(right_label);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let total_label_access = this.symbol_table.find_symbol_label(total_label);

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Copy the left operands to avoid mutation
        let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let left_label_temp_access = this.symbol_table.find_symbol_label(left_label_temp);
        assembly += `LDA ${left_label_access}\n` +
            `STA ${left_label_temp_access}\n`;

        // Add the literal one to the symbol table for ocunting purposes
        let literal_one_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MODKW:
                assembly +=
                    `\n// MOD for ${left_label_access} and ${right_label_access}\n` +
                    `${loop_label}_start LDA ${left_label_temp_access}\n` +
                    `SUB ${right_label_access}\n` +
                    `STA ${left_label_temp_access}\n` +
                    `LDA ${total_label_access}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label_access}\n` +
                    `LDA ${left_label_temp_access}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end ADD ${right_label_access}\n` +
                    `STA ${total_label_access}\n`;
                break;

            case Lexer.DIVKW:
                assembly +=
                    `\n// DIV for ${left_label_access} and ${right_label_access}\n` +
                    `${loop_label}_start LDA ${left_label_temp_access}\n` +
                    `SUB ${right_label_access}\n` +
                    `STA ${left_label_temp_access}\n` +
                    `LDA ${total_label_access}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label_access}\n` +
                    `LDA ${left_label_temp_access}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label_access}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${total_label_access}\n`;
                break;
        }
        return total_label;
    }

    visitPow(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        let left_label_access = this.symbol_table.find_symbol_label(left_label);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);
        let right_label_access = this.symbol_table.find_symbol_label(right_label);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let total_label_access = this.symbol_table.find_symbol_label(total_label);

        let outer_loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);
        let inner_loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Add the literal one to the symbol table for counting purposes
        let literal_one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let literal_zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        // Create a place to store the copy of the left operand required to complete this calculation
        let left_operand_copy = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        // Copy the left and right operands to avoid mutation
        let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let left_label_temp_access = this.symbol_table.find_symbol_label(left_label_temp);
        assembly += `LDA ${left_label_access}\n` +
            `STA ${left_label_temp_access}\n`;

        // Copy the left and right operands to avoid mutation
        let right_operand_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        assembly += `LDA ${right_label_access}\n` +
            `STA ${right_operand_temp}\n`;

        assembly += '\n';
        switch (ctx.children[1].symbol.type) {
            case Lexer.POW:
                assembly +=
                    `\n// POW for ${left_label_access} and ${right_label_access}\n` +
                    // For explanation of pseudocode, see flowchart "LMC POW.drawio"
                    `LDA ${left_label_temp_access}\n` +
                    `STA ${left_label_temp_access}\n` +
                    `${outer_loop_label}_start BRA ${inner_loop_label}_start\n` +
                    // Create a copy of the left label, needs to be done every loop
                    `${inner_loop_label}_start LDA ${total_label_access}\n` +
                    `ADD ${left_label_temp_access}\n` +
                    `STA ${total_label_access}\n` +
                    `LDA ${left_label_temp_access}\n` +
                    `SUB ${literal_one}\n` +
                    `STA ${left_label_temp_access}\n` +
                    `BRZ ${inner_loop_label}_end\n` +
                    `BRA ${inner_loop_label}_start\n` +
                    `${inner_loop_label}_end LDA ${right_operand_temp}\n` +
                    `SUB ${literal_one}\n` +
                    `STA ${right_operand_temp}\n` +
                    `SUB ${literal_one}\n` +
                    `BRZ ${outer_loop_label}_end\n` +
                    `LDA ${total_label_access}\n` +
                    `STA ${left_label_temp_access}\n` +
                    `LDA ${literal_zero}\n` +
                    `STA ${total_label_access}\n` +
                    `BRA ${outer_loop_label}_start\n` +
                    `${outer_loop_label}_end LDA ${total_label_access}\n`;

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
        let left_label_access = this.symbol_table.find_symbol_label(left_label);

        assembly += `LDA ${literal_zero_name}\n` +
            `SUB ${left_label_access}\n` +
            `STA ${total_label}\n`;
        return total_label;
    }

    visitComparison(ctx) {
        //console.log("comparison", ctx);
        if (ctx.children.length < 3) return this.visitChildren(ctx);

        let left_label = ctx.children[0].accept(this);
        let left_label_access = this.symbol_table.find_symbol_label(left_label);
        let right_label = ctx.children[2].accept(this);
        let right_label_access = this.symbol_table.find_symbol_label(right_label);

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
                    `LDA ${left_label_access}\n` +
                    `SUB ${right_label_access}\n` +
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
                    `LDA ${right_label_access}\n` +
                    `SUB ${left_label_access}\n` +
                    `BRP ${result_label}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_false LDA ${zero}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;

            case '==':
                // B == A
                // IF B - A is zero 
                // NOTE: Tested with 10 == 10, 4==4
                assembly +=
                    `LDA ${right_label_access}\n` +
                    `SUB ${left_label_access}\n` +
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
                    `LDA ${left_label_access}\n` +
                    `SUB ${right_label_access}\n` +
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
                    `LDA ${right_label_access}\n` +
                    `SUB ${left_label_access}\n` +
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
                    `LDA ${left_label_access}\n` +
                    `SUB ${right_label_access}\n` +
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
        assembly += `BRZ loop_${loop_label}_end\n`;

        assembly += `\n// While loop Body\n`;
        ctx.children[1].accept(this);

        assembly +=
            `\n// While loop end\n`;
            `BRA loop_${loop_label}_start\n` +
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
            `BRZ loop_${loop_label}_start\n` +
            `loop_${loop_label}_end NOP\n`;

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
        //console.log("terminal", ctx.symbol.text);
        switch (ctx.symbol.type) {
            case Lexer.BREAK:
                let current_scope = this.symbol_table.weak_scope_labels.at(-1);
                //console.log("BREAK", this.symbol_table.weak_scope_labels);
                assembly += `BRA ${current_scope}_end\n`
                return undefined;

            case Lexer.CONTINUE:
                return undefined;

            default:
                return ctx.symbol.text;
        }
    }
}

const input = `i = 0
while i < 10
    i = i + 1
    if i == 5 then
        break
    endif
endwhile
`;

const chars = new antlr4.InputStream(input);
const lexer = new Lexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new Parser(tokens);
const tree = parser.program();

let visitor = new Compiler();
tree.accept(visitor);

console.log(visitor.symbol_table.table);

console.log(assembly);


export default { Compiler };
