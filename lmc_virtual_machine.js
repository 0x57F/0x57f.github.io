const OPERANDS = {
  ADD: 1,
  SUB: 2,
  STA: 3,
  UNUSED: 4,
  LDA: 5,
  BRA: 6,
  BRZ: 7,
  BRP: 8,
  IO: 9,
  HLT: 0
}

const TOKENS = {
  LABEL: "LABEL",
  OPERATION: "OPERATION",
  REGISTER: "REGISTER",
  LITERAL: "LITERAL",
  NEW_INSTRUCTION: "NEW INSTRUCTION"
}

const KEYWORDS = [
  "ADD", "SUB", "STA", "LDA", "BRA", "BRZ", "BRP", "INP", "OUT", "HLT", "DAT"
]
const REGISTERS = [
  "ACC", "PC"
]

class Token {
  type = undefined;
  value = undefined;

  constructor(type, value) {
    this.type = type;

    switch (type) {
      case TOKENS.LITERAL:
        this.value = Number(value);
        break;

      case TOKENS.OPERATION:

      default:
        this.value = value;
        break;
    }
  }

  toString() {
    return `[(${this.type}),${this.value}]`
  }
}

class VirtualMachine {
  ram = new Array(1024);
  stack = new Array(1024);
  stack_pointer = 0;
  accumulator = 0;
  pc = 0;

  constructor(program_string) {
    this.assemble(program_string);
  }

  /**
   * 
   * @param {string} program_string 
   */
  assemble(program_string) {
    // ===================================================================================
    //                            Lexical analysis stage
    // ===================================================================================

    let lexemed_program;
    // split the inputted program into chunks based on words.
    lexemed_program = program_string.split("\n");

    lexemed_program.forEach(
      (elem, index, array) => {
        elem = this.preprocess(elem);
        array[index] = elem.split(" ");
        array[index].push("\n");
      }
    );

    lexemed_program.forEach((elem, index) => {
      if (elem.length > 4) {
        throw new Error(`Error on line ${index}: ${elem}\n More than three elements (four with newline)`);
      }

    })

    let tokens = new Array();

    for (let line_index in lexemed_program) {
      let line = lexemed_program[line_index];
      // if it isn't a keyword, and it doesn't start with a number or a - sign, it is a label
      for (let lexeme_index in line) {
        let lexeme = line[lexeme_index]

        let token = new Token(TOKENS.OPERATION, lexeme);

        switch (lexeme) {
          case (KEYWORDS.find(value => value == lexeme)):
            token.type = TOKENS.OPERATION;
            break;

          case (REGISTERS.find(value => value == lexeme)):
            token.type = TOKENS.REGISTER;
            break;

          case "\n":
            token.type = TOKENS.NEW_INSTRUCTION;
            break;

          case !isNaN(lexeme) || lexeme:
            token.type = TOKENS.LABEL;
            break;

          default:
            token.type = TOKENS.LITERAL;
            token.value = Number(lexeme);
        }
        tokens.push(token);
      }
    }
    console.log(tokens);

    // ===================================================================================
    //                           Syntax analysis stage 
    // ===================================================================================

  }

  preprocess(text) {
    // TODO: clear trailing + leading spaces, clear lines with only a space
    text = text.replaceAll('\t', ' ');
    let output = "";
    for (let i in text) {
      if (i != 0)
        output = output.concat((text[i-1] == ' ' && text[i] == ' ') ? "" : text[i]);
      else
        output = output.concat(text[i]);
    }
    return output;
  }
}
code = "" +
"INP\n" +
"STA x\n" +
"INP\n" +
"STA y\n" +
"INP\n" +
"STA   lmt\n" +
"LDA x\n" +
"OUT\n" +
"LDA y\n" +
"OUT\n" +
"loop    LDA lmt\n" +
"BRZ end\n" +
"SUB one\n" +
"STA lmt\n" +
"LDA x\n" +
"ADD y\n" +
"STA z\n" +
"OUT\n" +
"LDA y\n" +
"STA x\n" +
"LDA z\n" +
"STA y\n" +
"BRA loop\n" +
"end   LDA z\n" +
"SUB z\n" +
"HLT\n" +
"x    DAT\n" +
"y    DAT\n" +
"z    DAT\n" +
"lmt   DAT\n" +
"one   DAT 1\n"

VM = new VirtualMachine(code);