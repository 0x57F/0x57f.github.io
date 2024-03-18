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

    // Variables to ensure all things get unique names
    static temp_calc_id = 0;
    static loop_id = 0;
    static if_id = 0;

    // Make a new symbol table from a given parent
    init_from_parent(parent, scope_name) {
        this.parent = parent;
        this.scope_prefix = scope_name;
    }

    // enter the weak scope of a loop or such
    enter_weak_scope(scope_label) {
        this.weak_scope_labels.push(scope_label);
    }

    // leave the weak scope of a loop or such
    leave_weak_scope() {
        this.weak_scope_labels.pop();
    }

    // Add a symbol of name, type and starting value to the table
    add_symbol(name, type, starting_value) {
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

    // Find the original symbol for the label
    find_symbol(name) {
        return this.find_symbol_reference(name)?.name;
    }

    // Find the name and context of a given symbol name
    find_symbol_reference(name) {
        for (let key in this.table) {
            if (name == key) {
                return { name: this.table[name], ctx: this };
            }
        }
        if (this.parent) return this.parent.find_symbol_reference(name);
        
        return { name: undefined, ctx: undefined};
    }

    // Generate an appropriate label for a symbol based on it's scope
    find_symbol_label(label_name) {
        let res = this.find_symbol_reference(label_name);
        let { name, ctx } = res;

        if (!name || !ctx) return undefined;

        return this.generate_scoped_label(ctx.scope_prefix, name);
    }

    // Does the symbol exist?
    already_exists(name) {
        return this.find_symbol(name) != undefined; 
    }

    // Make a label based on the name and type
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

    // add a scope prefix to the label
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

    // Generate the code for the symbol table
    generate_code() {
        let assembly = "";
        for (let symbol in this.table) {
            switch (this.table[symbol].type) {
                default:
                    assembly += `${this.generate_scoped_label(this.scope_prefix, this.table[symbol])} DAT ${this.table[symbol].starting_value}\n`;
            }
        }

        if (this.weak_scope_labels.length > 0) console.warn("Found weak scope leaking: ", this.weak_scope_labels);
        return assembly;
    }

    // Generate the name for a symbol based on its type and value
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

/*  *
    * A symbol is an object that we need to be defined using a DAT or something similar, but need collected and put at the end of the program
    *
    */
class Symbol {
    constructor(label, type = SYMBOL_TYPES.INTEGER_LITERAL, starting_value = 0) {
        this.label = label;
        this.type = type;
        this.starting_value = starting_value;
    }
}

/**
    * This is the compiler class. It takes the form of a Visitor (a class that visits nodes), and does actions based on the type of node that has been found
    * As it hits a node, it will add a assembly onto our compiled program, with each part being modular (returning the label that shows what hppened in that stage).
    */
class CompilerVisitor extends Visitor {
    constructor() {
        super();

        // For debugging purposes
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

        // Create the symbol table and the assembly.
        this.symbol_table = new SymbolTable();
        this.assembly = "";
    }

    // The entrypoint rule.
    visitProgram(ctx) {
        this.visitChildren(ctx);
        // make sure the progmram always halts at the end.
        this.assembly += `HLT\n`;
    }

    // A general block of statements and things that need to be compiled.
    visitClosure(ctx) {
        if (!ctx) return;
        if (ctx.children.length == 0) return;

        // Pass through to the children
        for (let child of ctx.children) {
            child.accept(this);
        }
    }

    // An assignment
    visitStat(ctx) {
        // Visit and get the return values of the left and right parts
        let left_label = ctx.stat_identifier.accept(this);
        let right_label = ctx.stat_value.accept(this);

        // Must recieve a label to store and another label to load
        this.assembly += `LDA ${right_label}\n`
        this.assembly += `STA ${left_label}\n`
        return;
    }

    // A name, we just need the value, and to make sure it exists in the symbol table
    visitTrue_id(ctx) {
        if (!ctx) return this.visitChildren(ctx);

        let text = this.symbol_table.generate_symbol(ctx.start.text, SYMBOL_TYPES.VARIABLE);
        return text;
    }

    // An expression, anything that returns a value is collated here
    visitExpr(ctx) {
        if (ctx == undefined) return;
        // An expresion should always return a value, so make sure it does that
        return this.visitChildren(ctx);
    }

    // An integer / boolean or somesuch
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

            case Lexer.TRUE:
                literal_name = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);

            case Lexer.FALSE:
                literal_name = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

            default:
                // Make sure that if we get one of these, we know it might be sketchy
                console.warn("Unchecked type assumption");
                // We got an identifier
                literal_name = this.symbol_table.generate_symbol(children_read_value, SYMBOL_TYPES.VARIABLE);
        }

        return literal_name;
    }

    // The entrypoint to all calculation rules, passes through recursively to lower rules to create order of operation
    // This one deals with Addition / Subtraction
    visitCalc(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Left operand should aready be loaded into memory
        let left_operand = ctx.children[0].accept(this);
        // right operand should be a label
        let right_operand = ctx.children[2].accept(this);

        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

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


    // The multiplication / division calculation
    visitMul(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        // Init our labels
        // Left operand should aready be loaded into memory
        let left_label = ctx.children[0].accept(this);
        // right operand should be a label
        let right_label = ctx.children[2].accept(this);
        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        // Add the literal one to the symbol table for ocunting purposes
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MUL:
                let right_label_temp = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
                this.assembly +=
                    `LDA ${right_label}\n` +
                    `STA ${right_label_temp}\n` +
                    `LDA ${zero}\n` +
                    `STA ${total_label}\n` +
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
                    `LDA ${zero}\n` +
                    `STA ${total_label}\n` +
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

    // The MOD / DIV rule, NB DIV is functionaly identical to /
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
        this.assembly += `LDA ${left_label}\n` +
            `STA ${left_label_temp}\n`;

        // Add the literal one to the symbol table for ocunting purposes
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
            let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);

        switch (ctx.children[1].symbol.type) {
            case Lexer.MODKW:
                this.assembly +=
                    `LDA ${zero}\n` +
                    `STA ${total_label}\n` +
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
                    `LDA ${zero}\n` +
                    `STA ${total_label}\n` +
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

    // Power calculations - done using repeated multiplication
    visitPow(ctx) {
        if (ctx.children.length < 3) return ctx.children[0].accept(this);

        let left_label = ctx.children[0].accept(this);
        let right_label = ctx.children[2].accept(this);
        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);
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

        switch (ctx.children[1].symbol.type) {
            case Lexer.POW:
                this.assembly +=
                    `LDA ${zero}\n` +
                    `STA ${total_label}\n` +
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

    // End calculation rule, responsible for brackets and the unary operation negation.
    visitBracket(ctx) {
        if (ctx.children.length == 1) return ctx.children[0].accept(this);
        if (ctx.children.length == 3) return ctx.children[1].accept(this);

        let literal_zero_name = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
        let total_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let left_label = ctx.children[1].accept(this);

        this.assembly += `LDA ${literal_zero_name}\n` +
            `SUB ${left_label}\n` +
            `STA ${total_label}\n`;
        return total_label;
    }

    // Checks 2 values, to compare their magnitude. Always returns 1 if true, and zero if false. Assumes that zero is the only 'false' value, so negative numbers will be evaluated as true
    visitComparison(ctx) {
        if (ctx.children.length == 2) {
            // If we have 2 children, we must have a negation operation
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
        // We have a boolean
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

        // We have any other comparison

        let left_label = ctx.children[0].accept(this);
        let right_label = ctx.children[2].accept(this);

        let result_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.TEMP_CALC);

        let zero = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.INTEGER_LITERAL);
        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
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
                    `${result_label}_end STA ${result_label}\n`;
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

    // For loop, has a very fixed structure
    visitFor(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 5) return;

        let one = this.symbol_table.generate_symbol(1, SYMBOL_TYPES.INTEGER_LITERAL);
        let loop = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);

        this.symbol_table.enter_weak_scope(loop);
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

    // Start rule for a for loop - gets the initial label
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

    // While loops
    visitWhile_start(ctx) {
        // We are interested in the label to the condition
        if (ctx == undefined) return;
        if (ctx.children.length < 3) return;

        return this.visitChildren(ctx);
    }

    // Main while loop body
    visitWhile(ctx) {
        if (ctx == undefined) return;
        if (ctx.children.length < 4) return;

        let loop_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.LOOP_LABEL);
        
        // Enter the weak scope of this loop, so break and continue wr=ork correctly
        this.symbol_table.enter_weak_scope(loop_label);

        // set a starting label, and do some loopy stuff

        this.assembly += `${loop_label}_start NOP\n`;
        let while_condition = ctx.children[0].accept(this);
        this.assembly += `BRZ ${loop_label}_end\n`;

        ctx.children[1].accept(this);

        this.assembly +=`BRA ${loop_label}_start\n` +
            `${loop_label}_end NOP\n`;


        this.symbol_table.leave_weak_scope();
        return;
    }

    // Like a while loop but reversed slightly
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

    // An if statement. Has many branches, which need to be tracked
    visitIf(ctx) {
        let if_label = this.symbol_table.generate_symbol(0, SYMBOL_TYPES.IF_LABEL);
        let number_of_branches = ctx.children.length / 2 - 1;

        let else_found = false;

        let i;
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

    // Visit some kind of Terminal symbol
    visitTerminal(ctx) {
        let current_scope = this.symbol_table.weak_scope_labels.at(-1);
        switch (ctx.symbol.type) {
            case Lexer.BREAK:
                // Go to the end of the loop
                this.assembly += `BRA ${current_scope}_end\n`
                break;

            case Lexer.CONTINUE:
                // go to the start of the loop
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

        alert("Custom functions are not recommended for this compiler due to generated code being basically unreadable. They may also be broken due to lack of testing. Use at own risk");


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
    }

    // visit a function defenition -- Depreceated
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

    // Visit a return statement -- depreceated
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


    // Call a function
    visitFunc_call(ctx) {
        if (!ctx) return;
        if (ctx.children.length < 3) return;

        let func_to_call = ctx.children[0].accept(this);

        let params = [];

        for (let i = 2; i < ctx.children.length - 1; i += 2) {
            let label = ctx.children[i].accept(this);
            params.push(label);
        }

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

        throw new Error("Swtich case statements are not supported, please use if/else's");
    }
}

// A way to automate the compilation of a program.
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
    }
}


// Some tests asserting everything works
const first_tests = `

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

i = (4 / 2) * 3 + (4 + 6 * 2) + 18 / 3 ^ 2 - 8 
print((4 / 2) * 3)
print((4 + 6 * 2))
print(3 ^ 2)
print(18 / 3 ^ 2)
print(i)
assert(i == 16)
`

const second_test = `
// 27
a = 5
assert(a == 5)
b = -10
assert(b == -10)

// 29
assert(a > b)
assert(-b == 10)
assert(-b > a)
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
        j = 1 + j
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

let code = `
i = 6
print(i)
`;

const compiler = new Compiler();

compiler.compile(first_tests);
let assembly = compiler.assembly;


export default { CompilerVisitor: Compiler };
