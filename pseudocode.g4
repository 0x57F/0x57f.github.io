grammar pseudocode;

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

def :ID '(' (ID (',' ID)*)* ')' NEWLINE;
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
