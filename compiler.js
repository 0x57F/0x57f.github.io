import { Tokenizer } from './lexer.js';

// TODO: TESTS

// NOTE: found problems with group because of empty matches with an unescaped ^ (FIXED)

const LEXICAL_CATEGORIES = {
    NEWLINE: 0,
    COMMENT: 1,
    KEYWORD: 2,
    IDENTIFIER: 3,
    STRING_LITERAL: 4,
    INTEGER_LITERAL: 5,
    FLOAT_LITERAL: 6,
    OPERATOR: 7,
    DELIMETER: 8,
    WHITESPACE: 9
}

// TODO: Find a better name for this.
const STATEMENTS = {
    DECLARATION: [[LEXICAL_CATEGORIES.IDENTIFIER, () => {return true}], ]
}
/*
parser grammar comparisonParser;
options { tokenVocab=ExprLexer; }

program
    : ( stat
    | func_dec
    | func_call
    | expr
    | for
    | while
    | if
    | do_while
    | switch_case
    | true_id)* EOF;

stat: true_id '=' expr NEWLINE
    | expr NEWLINE
    ;

def :ID '(' ID (',' ID)* ')' NEWLINE;
closure : (stat | for | while | if | do_while | switch_case)*;
func_dec : FUNCKW def closure ENDFUNCKW NEWLINE;

for_start : FOR true_id '=' expr TO expr NEWLINE;
for : for_start closure NEXT true_id NEWLINE;

while_start : WHILE expr NEWLINE;
while       : while_start closure ENDWHILE NEWLINE;

do_end      : 'until' expr NEWLINE;
do_while    : DO NEWLINE closure do_end;

if_start: IF expr THEN NEWLINE closure;
if_continuation : ELSEIF expr THEN NEWLINE closure;
if_final: ELSE NEWLINE closure;
if: if_start
(if_continuation)*
(if_final)? 
ENDIF NEWLINE;

switch_start: SWITCH true_id COLON NEWLINE ;
switch_mid:   CASE literal COLON NEWLINE closure;
switch_default: DEFAULT COLON NEWLINE closure;
switch_case: switch_start (switch_mid)*
    switch_default? ENDSWITCH NEWLINE;

expr: literal
    | ID
    | calc
    | func_call
    | NOT expr
    | expr AND expr
    | expr OR expr
    | comparison
    | true_id
    ;

literal:
      true_id
    | INT
    | STRING;

func_call : ID '(' (expr (',' expr)*)? ')' ;

// Math parsing from
// https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm
calc: mul (('+' | '-') mul)*;
mul : mod (('*' | '/') mod)*;
mod : pow ((MODKW | DIVKW) pow)*;
pow : bracket ('^' pow)?;
bracket: literal | true_id | '(' calc ')' | '-' mul;

// MAY CAUSE BUGS LATER // HACKY BUT WORKS
comparison: comparison (('<' | '>' | '<=' | '>=' | '==' | '!=') comparison)+ | calc;

true_id: ID index* (DOT (ID | func_call) index*)*;

index: '[' INT ( ',' INT )* ']';

// CURRENT GRAMMAR
lexer grammar ExprLexer;

AND : 'AND' ;
OR : 'OR' ;
NOT : 'NOT' ;
EQ : '=' ;
DOT: '.';
COMMA : ',' ;
SEMI : ';' ;
LPAREN : '(' ;
RPAREN : ')' ;
LCURLY : '{' ;
RCURLY : '}' ;
LSQ    : '[' ;
RSQ    : ']' ;
COLON  : ':' ;
NEG    : '-' ;
PLUS   : '+' ;
MUL    : '*' ;
DIV    : '/' ;
POW    : '^' ;
LT     : '<' ;
GT     : '>' ;
LTE    : '<=';
GTE    : '>=';
EE     : '==';
NE     : '!=';
FUNCKW : 'function' | 'procedure';
ENDFUNCKW : 'endfunction' | 'endprocedure';
FOR    : 'for';
TO     : 'to' ;
NEXT   : 'next';
MODKW  : 'MOD';
DIVKW  : 'DIV';
WHILE  : 'while';
ENDWHILE: 'endwhile';
IF     : 'if' ;
THEN   : 'then' ;
ELSEIF : 'elseif';
ELSE   : 'else';
ENDIF  : 'endif';
DO     : 'do';
UNTIL  : 'until';
SWITCH : 'switch';
CASE   : 'case';
DEFAULT: 'default';
ENDSWITCH: 'endswitch';


INT : [0-9]+ ;
STRING : '"' (~["])+ '"';
ID: [a-zA-Z_][a-zA-Z_0-9]* ;
NEWLINE: [\n\r]+ ;
WS: [ \f\t]+ -> skip ;

*/
// One closing statement matches every openiong statement. list of both paris
const CLOSURES = {
    'do': ['until'],
    'for': ['next'],
    'while': ['endwhile'],
    'function': ['endfunction'],
    'procedure': ['endprocedure'],
    'class': ['endclass']
}
/**
 * [TODO:description]
 */
class Compiler {
    LEXICAL_RULES = {
        rules: [
            [/(\n|\r)/, _ => LEXICAL_CATEGORIES.NEWLINE],
            [/\/\/.*/, _ => LEXICAL_CATEGORIES.COMMENT],
            [/\s+/, _ => LEXICAL_CATEGORIES.WHITESPACE],
            [/(global|str|int|float|print|input|for|to|next|while|endwhile|do|until|AND|OR|NOT|if|elseif|else|endif|switch|case|default|endswitch|function|endfunction|procedure|endprocedure|array|openRead|openWrite|public|private|class|endclass|inherits|super|new)/, _ => LEXICAL_CATEGORIES.KEYWORD],
            [/\w+/, _ => LEXICAL_CATEGORIES.IDENTIFIER],
            [/('|")(.|\")*?\1/, _ => LEXICAL_CATEGORIES.STRING_LITERAL],
            [/(\+|-)[\d]*\b/, _ => LEXICAL_CATEGORIES.INTEGER_LITERAL],
            [/(\+|-)\d*.\d*\b/, _ => LEXICAL_CATEGORIES.FLOAT_LITERAL],
            [/(\+|-|\*|\*\*|\/|%|@|>>|<<|&|\||\^|~|:=|<|>|<=|>=|==|!=)/, _ => LEXICAL_CATEGORIES.OPERATOR],
            [/(\(|\)|\[|\]|{|}|,|:|\.|;|@|=|\+=|-=|\*=|\/=|%=|@=|&=|\|=|\^=|>>=|<<=|\*\*=)/, _ => LEXICAL_CATEGORIES.DELIMETER],

        ],
        options: {
            captureLocations: false,
        },
    };

    

    /**
     * [TODO:description]
     *
     */
    constructor() {
        console.log(this.LEXICAL_RULES);
        this.lexer = Tokenizer.fromSpec(this.LEXICAL_RULES);
    }

    /**
     * [TODO:description]
     *
     * @param {[TODO:type]} program - [TODO:description]
     * @returns {[TODO:type]} [TODO:description]
     */
    lexical_analysis(program) {
        program += '\n';
        this.lexer.init(program);
        let tokens = this.lexer.getAllTokens();
        
        let filtered_tokens = [];
        for (let token of tokens) {
            if (token.type == LEXICAL_CATEGORIES.WHITESPACE) {
                console.log("ELIMINATING");
                continue;
            }
            filtered_tokens.push(token);
        }

        return filtered_tokens;
    }

    syntax_analysis(tokens) {
        // Generate an AST for each line
    }

    split_into_closures(tokens) {

        for (let token_idx in tokens) {
            if (tokens[token_idx] in 
        }
    }
}

let compiler = new Compiler();
let tokens = compiler.lexical_analysis("" +
    "class Pet\n" +
    "// this is a comment\n" +
    "\tprivate name\n" +
    "\tpublic procedure new(givenName)\n" +
    "\t\tname=givenName\n" +
    "\tendprocedure\n" +
    "endclass\n" +
    "'STRING TEST BABY'")
console.log(tokens);
compiler.syntax_analysis(tokens);
