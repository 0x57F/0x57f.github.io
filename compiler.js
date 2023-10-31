const { antlr4, Lexer, Parser, Visitor } = self.parser.default;
import VirtualMachine from './lmc_virtual_machine.js';


const SYMBOL_TYPES = {
    VARIABLE: 0,
    INTEGER_LITERAL: 1,
    STRING_LITERAL: 2,
    FUNCTION_IDENTIFIER: 3,
    POINTER: 4,
    TEMP_CALC: 5,
    LOOP_LABEL: 6,
    IF_LABEL: 7,
}

class SymbolTable {
    constructor() {
        this.table = {};
        this.scope_prefix = "global_"
        this.temp_calc_id = 0;
        this.loop_id = 0;
        this.if_id = 0;
    }

    add_symbol(name, type, starting_value) {
        //console.log(name, type, starting_value);
        switch (type) {
            case SYMBOL_TYPES.INTEGER_LITERAL:
                if (!this.already_exists(name)) {
                    // Add it to the symbol table with the read default value
                    this.table[name] = new Symbol(name, SYMBOL_TYPES.INTEGER_LITERAL, starting_value);
                }
                break;

            case SYMBOL_TYPES.STRING_LITERAL:
                if (!this.already_exists(name)) {
                    // Add it to the symbol table with the read default value
                    this.table[name] = new Symbol(name, SYMBOL_TYPES.STRING_LITERAL, starting_value);
                }
                break;

            case SYMBOL_TYPES.TEMP_CALC:
                if (!this.already_exists(name)) {
                    // Add it to the symbol table with the read default value
                    this.table[name] = new Symbol(name, SYMBOL_TYPES.TEMP_CALC, starting_value);
                }
                break;

            default:
                if (!this.already_exists(name)) {
                    // Add it to the symbol table with the read default value
                    this.table[name] = new Symbol(name, SYMBOL_TYPES.VARIABLE);
                }
        }
    }

    // TODO: make stuff use this.
    generate_label(name, type) {
        switch (type) {
            case SYMBOL_TYPES.INTEGER_LITERAL:
                return `literal_${name}`;

            case SYMBOL_TYPES.STRING_LITERAL:
                return `string_${string_count++}`;

            case SYMBOL_TYPES.POINTER:
                return `${this.scope_prefix}pointer_${name}`;

            case SYMBOL_TYPES.FUNCTION_IDENTIFIER:
                return `${this.scope_prefix}func_${name}`;

            case SYMBOL_TYPES.VARIABLE:
                return `${this.scope_prefix}identifier_${name}`;

            case SYMBOL_TYPES.TEMP_CALC:
                return `temp_calc_${this.temp_calc_id++}`;

            case SYMBOL_TYPES.LOOP_LABEL:
                return `loop_${this.loop_id++}`;

            case SYMBOL_TYPES.IF_LABEL:
                return `if_${this.if_id++}`;

            default:
                return `${this.scope_prefix}unknown_${name}`;
        }
    }

    already_exists(name) {
        return Object.keys(this.table).includes(name);
    }

    generate_code(assembly) {
        for (let symbol in this.table) {
            switch (this.table[symbol].type) {

                case SYMBOL_TYPES.INTEGER_LITERAL:
                case SYMBOL_TYPES.TEMP_CALC:
                case SYMBOL_TYPES.VARIABLE:
                    //console.log(`${symbol} DAT ${this.table[symbol].starting_value}\n`);
                    assembly += `${symbol} DAT ${this.table[symbol].starting_value}\n`;
                    break;

                // If we get a string do some other stuff
                case SYMBOL_TYPES.STRING_LITERAL:
                    // slap the pointer in there
                    let string_ptr_start = (assembly.match(/\n/g) || []).length;
                    assembly += `${symbol} DAT ${string_ptr_start}\n`;

                    let c = 0;
                    for (c in this.table[symbol].starting_value) {
                        assembly += `${symbol}_${c} DAT ${this.table[symbol].starting_value.charCodeAt(c)}\n`;
                    }
                    // insert Null character at the end of the string
                    assembly += `${symbol}_${++c} DAT 0\n`;
                    break;

                case SYMBOL_TYPES.FUNCTION_IDENTIFIER:
                    alert("FUNCTION IDENTIFIER NOT IMPLEMENTED");
            }
        }
        return assembly;
    }

    generate_symbol(initial_value, type) {
        let literal_name = this.generate_label(initial_value, type);
        //console.log("Generating", literal_name);
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

// A table for holding symbols - defining when they are created. This is a top level one, it should contain other sub-tables for functions and scopes. To be sorted out later

// TODO: Big refactor to get rid of these variables
let assembly = "";
let current_scope_prefix = "global";
let string_count = 0;

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

        this.loop_id = 0;
        this.symbol_table = new SymbolTable();
    }

    visitProgram(ctx) {
        this.visitChildren(ctx);
        assembly += `HLT\n`;
    }

    visitStat(ctx) {
        //console.log("stat");
        //console.log(ctx.stat_identifier);

        let left_label = ctx.stat_identifier.accept(this);
        // This is one of the only ways to bring a variable into existence, so lets add it to the symbol table here
        if (!this.symbol_table.already_exists(left_label)) {
            // Add it to the symbol table with the read default value
            this.symbol_table.add_symbol(left_label, SYMBOL_TYPES.VARIABLE);
        }

        let right_label = ctx.stat_value.accept(this);

        // Must recieve a label to store and another label to load
        assembly += `LDA ${right_label}\n`
        assembly += `STA ${left_label}\n`
        return undefined;
    }

    visitTrue_id(ctx) {
        // TODO: REVISIT
        if (!ctx) return this.visitChildren(ctx);
        //console.log("visisting true_Id");
        //console.log(ctx);

        let text;

        switch (ctx.start.type) {
            case Lexer.ID:
                //console.log("Encountered an ID");
                text = ctx.start.text;
                text = "identifier_" + current_scope_prefix + "_" + text;
                break;
            default:
                //console.log("Encountered a Not an ID: PANIC");
                alert("Illegal Token");
                break;
        }

        // TODO: Will break on list indexes and .calls()
        return text;
    }

    visitExpr(ctx) {
        // TODO: NEXT UP
        // NOTE: Started this at some point then moved on

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
                // TODO:
                // return true if the results are both true
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
        return this.visitChildren(ctx);
    }

    visitLiteral(ctx) {
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
        let left_operand = ctx.children[0].accept(this);
        // right operand should be a label
        let right_operand = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let loop_label = `loop_${this.loop_id++}`;

        // Add the literal one to the symbol table for ocunting purposes
        let literal_one_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MUL:
                // copy the right operand to avoid mutation
                let right_operand_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                assembly +=
                    `\n// Multiplying ${left_operand} ${right_operand}\n` +
                    `LDA ${right_operand}\n` +
                    `STA ${right_operand_temp}\n` +
                    `${loop_label}_start LDA ${total_label}\n` +
                    `ADD ${left_operand}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${right_operand_temp}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${right_operand_temp}\n` +
                    `BRZ ${loop_label}_end\n` +
                    `BRA ${loop_label}_start\n` +
                    `${loop_label}_end LDA ${total_label}\n`;
                break;

            case Lexer.DIV:
                let left_operand_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                assembly +=
                    `\n// DIV for ${left_operand} and ${right_operand}\n` +
                    `LDA ${left_operand}\n` +
                    `STA ${left_operand_temp}\n` +
                    `${loop_label}_start LDA ${left_operand_temp}\n` +
                    `SUB ${right_operand}\n` +
                    `STA ${left_operand_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_operand_temp}\n` +
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
        let left_operand = ctx.children[0].accept(this);
        // right operand should be a label
        let right_operand = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let loop_label = `loop_${this.loop_id++}`;

        // Copy the left operands to avoid mutation
        let left_operand_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        assembly += `LDA ${left_operand}\n` +
            `STA ${left_operand_temp}\n`;

        // Add the literal one to the symbol table for ocunting purposes
        let literal_one_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MODKW:
                assembly +=
                    `\n// MOD for ${left_operand} and ${right_operand}\n` +
                    `${loop_label}_start LDA ${left_operand_temp}\n` +
                    `SUB ${right_operand}\n` +
                    `STA ${left_operand_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_operand_temp}\n` +
                    `BRP ${loop_label}_start\n` +
                    `${loop_label}_end ADD ${right_operand}\n` +
                    `STA ${total_label}\n`;
                break;

            case Lexer.DIVKW:
                assembly +=
                    `\n// DIV for ${left_operand} and ${right_operand}\n` +
                    `${loop_label}_start LDA ${left_operand_temp}\n` +
                    `SUB ${right_operand}\n` +
                    `STA ${left_operand_temp}\n` +
                    `LDA ${total_label}\n` +
                    `ADD ${literal_one_name}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_operand_temp}\n` +
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

        let left_operand = ctx.children[0].accept(this).toString();
        let right_operand = ctx.children[2].accept(this).toString();
        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let outer_loop_label = `loop_${this.loop_id++}`;
        let inner_loop_label = `loop_${this.loop_id++}`;

        // Add the literal one to the symbol table for ocunting purposes
        let literal_one_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let literal_zero_name = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        // Create a place to store the copy of the left operand required to complete this calculation
        let left_operand_copy = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        // Copy the left and right operands to avoid mutation
        let left_operand_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        assembly += `LDA ${left_operand}\n` +
            `STA ${left_operand_temp}\n`;

        // Copy the left and right operands to avoid mutation
        let right_operand_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        assembly += `LDA ${right_operand}\n` +
            `STA ${right_operand_temp}\n`;

        assembly += '\n';
        switch (ctx.children[1].symbol.type) {
            case Lexer.POW:
                assembly +=
                    `\n// POW for ${left_operand} and ${right_operand}\n` +
                    // For explanation of pseudocode, see flowchart "LMC POW.drawio"
                    `LDA ${left_operand_temp}\n` +
                    `STA ${left_operand_copy}\n` +
                    `${outer_loop_label}_start BRA ${inner_loop_label}_start\n` +
                    // Create a copy of the left label, needs to be done every loop
                    `${inner_loop_label}_start LDA ${total_label}\n` +
                    `ADD ${left_operand_temp}\n` +
                    `STA ${total_label}\n` +
                    `LDA ${left_operand_copy}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${left_operand_copy}\n` +
                    `BRZ ${inner_loop_label}_end\n` +
                    `BRA ${inner_loop_label}_start\n` +
                    `${inner_loop_label}_end LDA ${right_operand_temp}\n` +
                    `SUB ${literal_one_name}\n` +
                    `STA ${right_operand_temp}\n` +
                    `SUB ${literal_one_name}\n` +
                    `BRZ ${outer_loop_label}_end\n` +
                    `LDA ${total_label}\n` +
                    `STA ${left_operand_copy}\n` +
                    `LDA ${literal_zero_name}\n` +
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
        return left_label;
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
                    `LDA ${left_label}\n` +
                    `SUB ${right_label}\n` +
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
                    `LDA ${right_label}\n` +
                    `SUB ${left_label}\n` +
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

        let loop_id = this.loop_id++;

        // set a starting label, and do some loopy stuff
        assembly += `\n// While loop condition\nloop_${loop_id}_start NOP\n`;
        let while_condition = ctx.children[0].accept(this);
        assembly += `BRZ loop_${loop_id}_end\n`;

        assembly += `\n// While loop Body\n`;
        ctx.children[1].accept(this);

        assembly +=
            `\n// While loop end\n`;
        `BRA loop_${loop_id}_start\n` +
            `loop_${loop_id}_end NOP\n`;
        return;
    }

    visitDo_while(ctx) {
        if (ctx.children.length < 4) return;
        if (ctx == undefined) return;

        let loop_id = this.loop_id++;

        assembly += `\n// Do Until loop start\nloop_${loop_id}_start NOP\n`;
        assembly += `\n// Do Until Body\n`;
        ctx.children[2].accept(this);

        assembly += `\n// Do-Until loop condiiton\n`
        let while_condition = ctx.children[3].accept(this);
        assembly +=
            `\n// Do-Until loop end\n` +
            `LDA ${while_condition}\n` +
            `BRZ loop_${loop_id}_start\n` +
            `loop_${loop_id}_end NOP\n`;

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
        return ctx.symbol.text;
    }
}

/*

const input = `i = 0
if i > 10 then
    i = i + 1
elseif i < 10 then
    i = i - 2
else
    i = 0
endif
`;

const chars = new antlr4.InputStream(input);
const lexer = new Lexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new Parser(tokens);
const tree = parser.program();

let visitor = new Compiler();
tree.accept(visitor);

assembly = visitor.symbol_table.generate_code(assembly);
console.log(assembly);

let vm = new VirtualMachine.VirtualMachine();
vm.reset_state();
vm.assemble_into_ram(assembly);
await vm.run();
console.log(vm.ram);

*/

export default { Compiler };
