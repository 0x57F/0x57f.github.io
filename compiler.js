import { Tokenizer } from './lexer.js';

// TODO: TESTS

// NOTE: found problems with group because of empty matches with an unescaped ^

// whitespace is not significant 
const SPEC = {
    rules: [
        [/(\n|\r)/, v => 'NEWLINE'],
        [/\/\/.*/, v => 'COMMENT'],
        [/\s+/, v => 'WHITESPACE'],
        [/\d+/, v => 'NUMBER'],
        [/(global|str|int|float|print|input|for|to|next|while|endwhile|do|until|AND|OR|NOT|if|elseif|else|endif|switch|case|default|endswitch|function|endfunction|procedure|endprocedure|array|openRead|openWrite|public|private|class|endclass|inherits|super|new)/, v => 'KEYWORD'],
        [/\w+/, v => 'IDENTIFIER'],
        [/('|")(.|\")*?\1/, v => 'STRING_LITERAL'],
        [/(\+|-)[\d]*\b/, v => 'INTEGER_LITERAL'],
        [/\d*.\d*\b/, v => 'FLOAT_LITERAL'],
        [/(\+|-|\*|\*\*|\/|%|@|>>|<<|&|\||\^|~|:=|<|>|<=|>=|==|!=)/, v => 'OPERATOR'],
        [/(\(|\)|\[|\]|{|}|,|:|\.|;|@|=|\+=|-=|\*=|\/=|%=|@=|&=|\|=|\^=|>>=|<<=|\*\*=)/, v => 'DELIMETER'],

    ],
    options: {
        captureLocations: false,
    },
};

let lexer = Tokenizer.fromSpec(SPEC);

lexer.init("" +
    "class Pet\n" +
    "// this is a comment\n" +
    "private name\n" +
    "public procedure new(givenName)\n" +
    "name=givenName\n" +
    "endprocedure\n" +
    "endclass\n" +
    "")

while (lexer.hasMoreTokens()) {
    console.log(lexer.getNextToken());
}
