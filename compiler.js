const { antlr4, Lexer, Parser, Visitor } = self.parser.default;

const input = "a=\"Over 90000\"\n";
const chars = new antlr4.InputStream(input);
const lexer = new Lexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new Parser(tokens);
const tree = parser.stat();

const SYMBOL_TYPES = {
    VARIABLE: 0,
    INTEGER_LITERAL: 1,
    STRING_LITERAL: 2,
    FUNCTION_IDENTIFIER: 3,
}

class Symbol {
    constructor(label, type = SYMBOL_TYPES.INTEGER_LITERAL, starting_value = 0) {
        this.label = label;
        this.type = type;
        this.starting_value = starting_value;
    }
}

console.log(tree);
// A table for holding symbols - defining when they are created. This is a top level one, it should contain other sub-tables for functions and scopes. To be sorted out later
let symbol_table = {
}

let assembly = "";
let current_scope_prefix = "global";
let string_count = 0;

class MyVisitor extends Visitor {

    constructor() {
        super();

        this._visitTerminal = this.visitTerminal;
        this.visitTerminal = ctx => {
            console.log('TERMINAL', ctx)
            return this._visitTerminal(ctx);
        }
        this._visitChildren = this.visitChildren;
        this.visitChildren = ctx => {
            console.log('CHILD', ctx);
            return this._visitChildren(ctx);
        }
    }

    visitStat(ctx) {
        console.log("stat");
        console.log(ctx.stat_identifier);

        let left_label = ctx.stat_identifier.accept(this);
        // This is one of the only ways to bring a variable into existence, so lets add it to the symbol table here
        if (!Object.keys(symbol_table).includes(left_label)) {
            // Add it to the symbol table with the read default value
            symbol_table[left_label] = new Symbol(left_label, SYMBOL_TYPES.VARIABLE);
        }

        let right_label = ctx.stat_value.accept(this);

        // Must recieve a label to store and another label to load
        assembly += `LDA ${right_label}\n`
        assembly += `STA ${left_label}\n`
        return undefined;
    }

    visitTrue_id(ctx) {
        if (!ctx) return this.visitChildren(ctx);
        console.log("visisting true_Id");
        console.log(ctx);

        let text;

        switch (ctx.start.type) {
            case Lexer.ID:
                console.log("Encountered an ID");
                text = ctx.start.text;
                text = "identifier_" + current_scope_prefix + "_" + text;
                break;
            default:
                console.log("Encountered a Not an ID: PANIC");
                alert("Illegal Token");
                break;
        }

        // TODO: Will break on list indexes and .calls()
        return text;
    }

    visitExpr(ctx) {
        // TODO: THIS ONLY WORKS FOR INTEGER LITERAL SO FAR
        console.log("EXPR", ctx);
        return this.visitChildren(ctx);
    }

    visitLiteral(ctx) {
        console.log("LITERAL", ctx, ctx.children[0]?.symbol?.type);

        let children_read_value = this.visitChildren(ctx).toString();
        console.log(children_read_value);
        let literal_name;

        // switch on the value of the only child
        switch (ctx.children[0]?.symbol?.type) {
            case Lexer.INT:
                literal_name = "literal_" + current_scope_prefix + "_" + children_read_value;
                if (!Object.keys(symbol_table).includes(literal_name)) {
                    // Add it to the symbol table with the read default value
                    symbol_table[literal_name] = new Symbol(literal_name, SYMBOL_TYPES.INTEGER_LITERAL, children_read_value);
                }
                break;

            case Lexer.STRING:
                literal_name = "string_" + (string_count++);
                if (!Object.keys(symbol_table).includes(literal_name)) {
                    // Add it to the symbol table with the read default value
                    symbol_table[literal_name] = new Symbol(literal_name, SYMBOL_TYPES.STRING_LITERAL, children_read_value.slice(1, -1)); 
                }
                break;

            default:
                // We got an identifier
                literal_name = "identifier_" + current_scope_prefix + "_" + children_read_value;
                if (!Object.keys(symbol_table).includes(literal_name)) {
                    // If it doesn't exist by now, we made a mistake, and should abort
                    console.error(`${literal_name} is not defined`);
                }
        }

        console.log(literal_name);
        return literal_name;
    }

    visitTerminal(ctx) {
        return ctx.symbol.text;
    }
}

tree.accept(new MyVisitor());

for (let symbol in symbol_table) {
    switch (symbol_table[symbol].type) {
        case SYMBOL_TYPES.INTEGER_LITERAL:
        case SYMBOL_TYPES.VARIABLE:
            assembly += `${symbol} DAT ${symbol_table[symbol].starting_value}\n`;
            break;
        // If we get a string do some other stuff
        case SYMBOL_TYPES.STRING_LITERAL:
            // slap the pointer in there
            let string_ptr_start = (assembly.match(/\n/g) || []).length;
            assembly += `${symbol} DAT ${string_ptr_start}\n`;

            let c = 0;
            for (c in symbol_table[symbol].starting_value) {
                assembly += `${symbol}_${c} DAT ${symbol_table[symbol].starting_value.charCodeAt(c)}\n`;
            }
            // insert Null character at the end of the string
            assembly += `${symbol}_${++c} DAT 0\n`;
            break;
        case SYMBOL_TYPES.FUNCTION_IDENTIFIER:
            alert("FUNCTION IDENTIFIER NOT IMPLEMENTED");
    }
}

console.log(assembly);
console.log(symbol_table);
