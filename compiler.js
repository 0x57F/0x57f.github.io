const { antlr4, Lexer, Parser, Visitor } = self.parser.default;


const SYMBOL_TYPES = {
    VARIABLE: 0,
    INTEGER_LITERAL: 1,
    TEMP_CALC: 2,
    LOOP_LABEL: 3,
    IF_LABEL: 4,
}

// A table for holding symbols - defining when they are created. This is a top level one, it should contain other sub-tables for functions and scopes. To be sorted out later
class SymbolTable {
    constructor(scope_prefix="global", parent = undefined) {
        this.table = {};
        this.scope_prefix = scope_prefix;

        this.weak_scope_labels = new Array();
        this.parent = parent;
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

            default:
                console.warn("Trying to generate a scoped label with an unhandled type")
                return;
        }
    }

    generate_code() {
        let assembly = "";
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


class CompilerVisitor extends Visitor {
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

        this.assembly = "";
    }

    visitProgram(ctx) {
        //console.log("PORGRAM", ctx);
        this.visitChildren(ctx);
        this.assembly += `HLT\n`;
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
        this.assembly += `LDA ${right_label}\n`
        this.assembly += `STA ${left_label}\n`
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

            case Lexer.TRUE:
                literal_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

            case Lexer.FALSE:
                literal_name = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

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

        console.log(`Adding/Subbing ${left_operand} and ${right_operand}`);

        this.assembly += `LDA ${left_operand}\n`

        switch (ctx.children[1].symbol.type) {
            case Lexer.PLUS:
                this.assembly += `ADD ${right_operand}\n`;
                break;

            case Lexer.NEG:
                this.assembly += `SUB ${right_operand}\n`
                break;
        }

        this.assembly += `STA ${total_label}\n`

        return total_label;
    }


    // BUG: this does not resepect multiple values in a line e.g. 2/3*4
    // This is the same for all other maths operations, and potentially comparisons
    visitMul(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        console.log(`Mul/Div ${left_label} and ${right_label}`);
        // Add the literal one to the symbol table for ocunting purposes
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MUL:
                // copy the right operand to avoid mutation
                let right_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                this.assembly +=
                    `LDA ${right_label}\n` +
                    `STA ${right_label_temp}\n` +
                    `${loop_label}_start LDA ${total_label}\n` +
                    `ADD ${left_label}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${right_label_temp}\n` +
                    `SUB ${one}\n` +
                    `STA ${right_label_temp}\n` +
                    `BRZ ${loop_label}_end\n` +
                    `BRA ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label}\n`;
                break;

            case Lexer.DIV:
                let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                this.assembly +=
                    `LDA ${left_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `${loop_label}_start LDA ${left_label_temp}\n` +
                    `SUB ${right_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${one}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label}\n` +
                    `SUB ${one}\n` +
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
        console.log(`MOD/DIV ${left_label} and ${right_label}`);

        // Copy the left operands to avoid mutation
        let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        this.assembly += `LDA ${left_label}\n` +
            `STA ${left_label_temp}\n`;

        // Add the literal one to the symbol table for ocunting purposes
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MODKW:
                this.assembly +=
                    `${loop_label}_start LDA ${left_label_temp}\n` +
                    `SUB ${right_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${one}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end ADD ${right_label}\n` +
                    `STA ${total_label}\n`;
                break;

            case Lexer.DIVKW:
                this.assembly +=
                    `${loop_label}_start LDA ${left_label_temp}\n` +
                    `SUB ${right_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${one}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label}\n` +
                    `SUB ${one}\n` +
                    `STA ${total_label}\n`;
                break;
        }
        return total_label;
    }

    //BUG: Seems to do one less than required -- fixed, caused by an automatic refactor renaming an istance of left_label to left_label_temp
    visitPow(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        console.log(`POW ${left_label} and ${right_label}`);

        let outer_loop = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);
        let inner_loop = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Add the literal one to the symbol table for counting purposes
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        // Copy the left and right operands to avoid mutation
        let left_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        this.assembly += `LDA ${left_label}\n` +
            `STA ${left_label_temp}\n`;

        // Copy the left and right operands to avoid mutation
        let right_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        this.assembly += `LDA ${right_label}\n` +
            `STA ${right_label_temp}\n`;

        this.assembly += '\n';
        switch (ctx.children[1].symbol.type) {
            case Lexer.POW:
                this.assembly +=
                    // For explanation of pseudocode, see flowchart "LMC POW.drawio"
                    `${outer_loop}_start BRA ${inner_loop}_start\n` +
                    // Create a copy of the left label, needs to be done every loop
                    `${inner_loop}_start LDA ${total_label}\n` +
                    `ADD ${left_label}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_label_temp}\n` +
                    `SUB ${one}\n` +
                    `STA ${left_label_temp}\n` +
                    `BRZ ${inner_loop}_end\n` +
                    `BRA ${inner_loop}_start\n` +
                    `${inner_loop}_end LDA ${right_label_temp}\n` +
                    `SUB ${one}\n` +
                    `STA ${right_label_temp}\n` +
                    `SUB ${one}\n` +
                    `BRZ ${outer_loop}_end\n` +
                    `LDA ${total_label}\n` +
                    `STA ${left_label_temp}\n` +
                    `LDA ${zero}\n` +
                    `STA ${total_label}\n` +
                    `BRA ${outer_loop}_start\n` +
                    `${outer_loop}_end LDA ${total_label}\n`;

                break;

            default:
                console.warn("Unhandled power case");
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

        this.assembly += `LDA ${literal_zero_name}\n` +
            `SUB ${left_label}\n` +
            `STA ${total_label}\n`;
        return total_label;
    }

    visitComparison(ctx) {
        if (ctx.children.length == 2) {
            let mid_operand = ctx.children[1].accept(this);
            let result_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
            let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
            let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

            this.assembly += `LDA ${mid_operand}\n` +
                `SUB ${one}\n` +
                `BRP ${result_label}_false\n` +
                `LDA ${one}\n` +
                `BRA ${result_label}_end\n` +
                `${result_label}_false DAT ${zero}\n` +
                `${result_label}_end STA ${result_label}\n`;
            return result_label
        }
        if (ctx.children.length < 3) {

            if (!ctx.bool) return this.visitChildren(ctx);
            let result_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
            let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
            let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
            
            switch (ctx.bool.type) {
                case Lexer.TRUE:
                    this.assembly += `LDA ${one}\n` +
                                `STA ${result_label}\n`;
                    break;
                case Lexer.FALSE:
                    this.assembly += `LDA ${zero}\n` +
                                `STA ${result_label}\n`;
            }
            return result_label;
        }

        let left_label = ctx.children[0].accept(this);
        let right_label = ctx.children[2].accept(this);

        let result_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        //console.log(ctx.children[1].accept(this));
        switch (ctx.children[1].accept(this)) {
            case '<':
                // A < B
                // IF A - B - 1 is negative
                // NOTE: tested with 4 and 20 < 10
                this.assembly +=
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
                this.assembly +=
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
                this.assembly +=
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
                this.assembly +=
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
                this.assembly +=
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
                this.assembly +=
                    `LDA ${left_label}\n` +
                    `SUB ${right_label}\n` +
                    `BRZ ${result_label}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_false LDA ${zero}\n` +
                    `${result_label}_end STA ${result_label}\n`;
                break;

            case 'AND':
                this.assembly +=
                    `LDA ${left_label}\n` +
                    `BRZ ${result_label}_false\n` +
                    `LDA ${right_label}\n` +
                    `BRZ ${result_label}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${result_label}_end\n` +
                    `LDA ${zero}\n` +
                    `${result_label}_end STA ${result_label}\n\n`;
                break;

            case 'OR':
                this.assembly +=
                    `LDA ${left_label}\n` +
                    `ADD ${right_label}\n` +
                    `BRZ ${result_label}_false\n` +
                    `LDA ${one}\n` +
                    `BRA ${result_label}_end\n` +
                    `${result_label}_false LDA ${zero}\n` +
                    `${result_label}_end STA ${result_label}\n`;
        }

        return result_label;
    }

    visitFor(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 5) return;

        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let loop = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        let [ count_label, count_start, count_end ] = ctx.children[0].accept(this);

        this.assembly += `${loop}_start NOP\n`;

        let closure = ctx.children[1].accept(this);

        let end = ctx.children[3].accept(this);

        if (count_label != end) {
            throw new Error("Start and end for variable is not the same");
        }

        this.assembly += `LDA ${count_label}\n` +
                        `SUB ${count_end}\n` +
                        `BRZ ${loop}_end\n` +
                        `LDA ${count_label}\n` +
                        `ADD ${one}\n` +
                        `STA ${count_label}\n` +
                        `BRA ${loop}_start\n` +
                        `${loop}_end NOP\n`;

        return;
    }

    visitFor_start(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 6) return;

        let count_label = ctx.children[1].accept(this);
        
        let count_start = ctx.children[3].accept(this);

        this.assembly += `LDA ${count_start}\n` +
                        `STA ${count_label}\n`;

        let count_end = ctx.children[5].accept(this);


        return [ count_label, count_start, count_end ];
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
        this.assembly += `${loop_label}_start `;
        let while_condition = ctx.children[0].accept(this);
        this.assembly += `BRZ ${loop_label}_end\n`;

        ctx.children[1].accept(this);

        this.assembly +=`BRA ${loop_label}_start\n` +
            `${loop_label}_end NOP\n`;


        this.symbol_table.leave_weak_scope();
        return;
    }

    visitDo_while(ctx) {
        if (ctx.children.length < 4) return;
        if (ctx == undefined) return;

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);
        this.symbol_table.enter_weak_scope(loop_label);

        this.assembly += `${loop_label}_start `;
        ctx.children[2].accept(this);

        let while_condition = ctx.children[3].accept(this);
        this.assembly +=
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
        let if_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.IF_LABEL);
        let number_of_branches = ctx.children.length / 2 - 1;

        let else_found = false;

        let i;
        //console.log("if", ctx.children);
        for (i = 0; i < number_of_branches; i++) {
            let condition_label = ctx.children[i * 2].accept(this);
            if (condition_label !== 0) {
                this.assembly +=
                    `${if_label}_${i} ` +
                    `LDA ${condition_label}\n` +
                    `BRZ ${if_label}_${i + 1}\n`;
            } else {
                this.assembly += 
                    `${if_label}_${i} NOP\n`;
                else_found = true;
            }

            ctx.children[i * 2 + 1].accept(this);
            this.assembly += `BRA ${if_label}_end\n`;
        }

        this.assembly += `${if_label}_end NOP\n`;

        if (!else_found) this.assembly += `${if_label}_${i} NOP\n`;
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
                this.assembly += `BRA ${current_scope}_end\n`
                break;

            case Lexer.CONTINUE:
                this.assembly += `BRA ${current_scope}_start\n`;
                break;

            case Lexer.INT:
                this.symbol_table.generate_symbol(ctx.symbol.text, SYMBOL_TYPES.INTEGER_LITERAL);
                break;

            case Lexer.TRUE:
                this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
                break;

            case Lexer.FALSE:
                this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
                break;

            default:
                ctx.symbol.text;
                break;
        }
        return ctx.symbol.text;
    }

    visitFunc_dec(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 5) return;

        alert("Custom functions are not supported for this compiler due to generated code readablility issued");

        /*

        let { func_name, params } = ctx.children[1].accept(this);

        let new_scope = new SymbolTable(func_name, this.symbol_table);
        this.symbol_table = new_scope;

        this.symbol_table_pool.push(this.symbol_table);

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
        */
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
        if (ctx.children.length == 2) this.assembly += `POP\nRET\n`


        let result = ctx.children[1].accept(this);
        let temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        
        // swap the return address and return value on the stack
        this.assembly += `POP\n` +
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

        let params = [];

        for (let i = 2; i < ctx.children.length - 1; i += 2) {
            //console.log(ctx.children[i]);
            let label = ctx.children[i].accept(this);
            params.push(label);
        }
        //console.log(params);

        let result;

        switch (func_to_call) {
            case "print":
                for (let label of params) {
                    this.assembly += `LDA ${label}\n` +
                                `OUT\n`;
                }

                let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

                return zero;

            case "input":
                result = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                this.assembly += `INP\n` + 
                            `STA ${result}\n`;
                return result;

            case "assert":
                //console.log(ctx);
                result = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
                let loop = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                this.assembly += `SUB ${one}\n` +
                                `BRP ${loop}_end\n` +
                                `HLT\n` +
                                `${loop}_end NOP\n`;
                return result;
                
        }
    }

    visitSwtich_case(ctx) {

        throw new Error("Swtich case statements are not supported, please use if else's");
        return;
    }
}

class Compiler {
    compile(input) {
        this.chars = new antlr4.InputStream(input);
        this.lexer = new Lexer(this.chars);
        this.tokens = new antlr4.CommonTokenStream(this.lexer);
        this.parser = new Parser(this.tokens);
        this.tree = this.parser.program();

        this.visitor = new CompilerVisitor();
        this.tree.accept(this.visitor);
        this.visitor.assembly += this.visitor.symbol_table.generate_code();
        this.assembly = this.visitor.assembly;

        console.log("chars: ", this.chars);
        console.log("lexer:", this.lexer);
        console.log("tokens:", this.tokens);
        console.log("parser:", this.parser);
        console.log("tree:",this.tree);
        console.log("visitor:",this.visitor);
    }
}

// TODO: PROBLEM - repeated comparisons may break


// NOTE: at assert (10 != 10) we hit the memory limit for the machine, time to implement growing memory

// BUG: IF NOT BRANCHING TO THE END AND ALWAYS EXECUTING THE ELSE STATEMENT EVEN WHEN IT SHOULDN'T -- FIXED

// BUG: WHEN DEALING WITH VERY LARGE PROGRAMS, instrucions and memory addresses join together
const input = `
i = (4 / 2) * 3 + (4 + 6 * 2) + 18 / 3 ^ 2 - 8 
print((4 / 2) * 3)
print((4 + 6 * 2))
print(3 ^ 2)
print(18 / 3 ^ 2)
print(i)
assert(i == 16)

assert(true)
assert(NOT false)
assert(NOT false == true)

// 3
assert(5 < 10)
assert((15 < 10) == false)
assert(9 < 10)
assert((11 < 10) == false)
assert((10 < 10) == false)

// 8
assert((5 > 10) == false)
assert(15 > 10)
assert((9 > 10) == false)
assert(11 > 10)
assert((10 > 10) == false)

// 13
assert(5 <= 10)
assert((15 <= 10) == false)
assert(9 <= 10)
assert((11 <= 10) == false)
assert(10 <= 10)

// 18
assert((5 >= 10) == false)
assert(15 >= 10)
assert((9 >= 10) == false)
assert(11 >= 10)
assert(10 >= 10)

// 21
assert((5 == 10) == false)
assert((15 == 10) == false)
assert(10 == 10)

// 24
assert(5 != 10)
assert(15 != 10)
assert((10 != 10) == false)
`
let a = `

// 27
a = 5
assert(a == 5)
b = -10
assert(b == -10)

// 29
assert(a > b)
assert(-b == 10)
assert(-b > a)


`

const second_test = `
// 32
if a > b then
    assert(true)
else
    assert(false)
endif

if a < b then
    assert(false)
endif

if a <= b then
    assert(false)
elseif true then
    assert(true)
endif
if a <= b then
    assert(false)
elseif false then
    assert(false)
else
    assert(true)
endif

for i = 0 to 10
    if i == 11 then
        assert(false)
    endif
next i

for i = 1 to 10
    if i == 0 then
        assert(false)
    endif
next i

i = 0
while i < 10
    if i == 5 then
        break
    elseif i > 5 then
        assert(false)
    endif
    i = i + 1
endwhile

i = 0
while i < 10
    j = 0
    while j < 10
        if j == 5 then
            break
        endif
        j = 1 + i
    endwhile
    assert(j == 5)
    i = i + 1
endwhile
assert(i == 10)

i = 0
do
    if i == 5 then
        break
    endif
    i = i + 1
until i == 10
assert(i == 5)

i = 0
print(i)
i = input()
print(i)
`

const compiler = new Compiler();

compiler.compile(input);
let assembly = compiler.assembly;

/*
compiler.compile(second_test);
let assembly = compiler.assembly;
*/

console.log(assembly);

export default { CompilerVisitor: Compiler };
