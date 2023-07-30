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
  LABEL: "LABBEL",
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
    // Lexical analysis stage

    let lexemed_program;
    // split the inputted program into chunks based on words.
    lexemed_program = program_string.split("\n");
    lexemed_program.forEach(
      (elem, index, array) =>
        array[index] = elem.split(" ")
    );

    lexemed_program.forEach((elem, index) => {
      if (elem.length > 3) {
        throw new Error(`Error on line ${index}: ${elem}\n More than three elements`);
      }

    })

    let tokens = new Array();

    for (let line in lexemed_program) {
      // if it isn't a keyword, and it doesn't start with a number or a - sign, it is a label
      for (let lexeme in line) {
        let token_type;
        if (lexeme in KEYWORDS) {
          token_type = TOKENS.OPERATION;
        }
        else if (lexeme in REGISTERS) {
          token_type = TOKENS.REGISTER;
        }
        else if (NaN(lexeme)) {
          token_type = TOKENS.LABEL;

        }
        else {
          token_type = TOKENS.NEW_INSTRUCTION;
        }
        tokens.push(new Token(token_type, lexeme));
      }
    }

    console.log(lexemed_program);
  }
}

VM = new VirtualMachine("there yay\nsplit time bois\naaa bbb ccc");