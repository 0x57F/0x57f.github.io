// first digit is opcode, next 3 are operands

const OPCODES_TO_NUMERIC = {
    ADD: 1,
    SUB: 2,
    STA: 3,
    POP: 4, //MODIFIED
    PSH: 4, //MODIFIED
    LDAPC: 4, //MODIFIED
    LDACC: 4,
    LDA: 5,
    BRA: 6,
    BRZ: 7,
    BRP: 8,
    INP: 9,
    INPC: 9,
    OUT: 9,
    OUTC: 9,
    NOP: 9,
    HLT: 0,
    RET: 0,
    DAT: -1,
}

const OPCODES_TO_EXTRA_NUMERIC = {
    POP: 1,
    PSH: 2,
    LDAPC: 3,
    LDACC: 4,

    INP: 1,
    INPC: 4,
    OUT: 2,
    OUTC: 3,

    NOP: 999,
    HLT: 0,
    RET: 1
}

const TOKENS = {
    LABEL: "LABEL",
    OPERATION: "OPERATION",
    LITERAL: "LITERAL",
    NEW_INSTRUCTION: "NEW INSTRUCTION"
}

const KEYWORDS = Object.keys(OPCODES_TO_NUMERIC);

/**
 * A class representing a token. Has a type and a value
 */
class Token {

    /**
     * Construct a token with type type and value value
     *
     * @param {String} type - a token from TOKENS
     * @param {String} value - a value for the token to have
     */
    constructor(type, value) {
        this.type = type;

        switch (type) {
            case TOKENS.LITERAL:
                this.value = Number(value);
                break;

            default:
                this.value = value;
                break;
        }
    }
}

/**
 * A class representing a LMC instruction
 */
class Instruction {
    constructor(opcode, operand = 0, label = undefined) {
        this.label = label;
        this.opcode = opcode;
        this.operand = operand;
    }

    /**
     * Convert an instruction to it's numeric format
     *
     * @returns {Number} the numeric value of the instruction
     */
    to_numeric() {
        switch (this.opcode) {
            case OPCODES_TO_NUMERIC.DAT:
                return this.operand;

            default:
                if (this.operand >= 1000) throw new Error(`Illegal operand length: ${this.operand} ${this.opcode}`);
                return this.opcode * 1000 + this.operand;
        }
    }

    /**
     * Make an instruction from an integer, like one found in the memory of a virtual machine
     *
     * @static
     * @param {Number} number - The value to generate the instruction from
     * @returns {Instruction} The instruction generated from number
     */
    static from_numeric(number) {
        if (!number) return new Instruction(0, 0);
        let operand = number % 1000;
        let opcode = (number - operand) / 1000;
        return new Instruction(opcode, operand);
    }
}

// TODO: split into an assembler class and a virtual machine class

/**
 * A class to represent a Virtual Machine running a modified Little Man Computer architecture
 */
class VirtualMachine {
    /**
     * initialise and setup the vitual machine based on the ggiven code input
     *
     * @param {String} program_string - The program to compile
     */
    constructor() {
        this.ram = [];
        this.stack = [];
        this.input_stack = [];
        this.accumulator = 0;
        this.pc = 0;

        this.print_command = console.log;
        this.request_input = async () => this.input_stack.pop();
    }

    assemble(program_string) {
        let tokens = this.lexical_analysis(program_string);
        console.log(tokens);
        let instructions, symbol_table;
        [instructions, symbol_table] = this.syntax_analysis(tokens);
        return this.generate_code(instructions, symbol_table);
    }

    assemble_into_ram(program_string) {
        this.ram = this.assemble(program_string);
    }

    reset_state() {
        this.stack = [];
        this.ram = [];
        this.pc = 0;
        this.accumulator = 0;
        this.input_stack = [];
    }

    /**
     * Split the string into tokens
     *
     * @param {String} program_string - The program in string form
     * @throws {Error} - A line that is too long
     * @returns {Array<Token>} An array of tokens representing the program
     */
    lexical_analysis(program_string) {
        let lexemed_program;
        // split the inputted program into chunks based on words.
        lexemed_program = program_string.split("\n");

        lexemed_program.forEach(
            (elem, index, array) => {
                elem = this.preprocess(elem);
                elem = elem.split(" ");
                if (!elem) return;

                let comment_index = elem.findIndex(item => item.match(/\/\/\w*/))

                if (comment_index != -1) {
                    array[index] = elem.slice(0, comment_index);
                }
                else array[index] = elem;
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

                let token = new Token(undefined, lexeme);

                switch (lexeme) {
                case (KEYWORDS.find(value => value == lexeme.toUpperCase())):
                    token.type = TOKENS.OPERATION;
                    break;

                case "\n":
                    token.type = TOKENS.NEW_INSTRUCTION;
                    break;

                case !isNaN(lexeme) || lexeme:
                    token.type = TOKENS.LABEL;
                    break;

                case "":
                    break;

                default:
                    token.type = TOKENS.LITERAL;
                    token.value = Number(lexeme);
                }
                tokens.push(token);
            }
        }

        return tokens;
    }

    /**
     * Generates a list of instructionf from the given tokens.
     *
     * @param {Array<Token>} tokens - A list of tokens representing the programm
     * @throws {Error} - Multiple defenitions of a label throws an error
     * @returns {Array<Instruction>, Object} An array of generated instructions, and a symbol table
     */
    syntax_analysis(tokens) {
        // list of instructions
        let instructions = [];
        // individual instruction (temp for collation)
        let instruction = new Instruction();


        for (let token_index in tokens) {
            let token = tokens[token_index];
            if (token.type == TOKENS.NEW_INSTRUCTION) {

                // prevent empty lines being pushed into instructions
                if (instruction.label != undefined || instruction.opcode != undefined || instruction.operand != 0) {
                    instructions.push(instruction);
                    instruction = new Instruction();
                }
            }

            // Some logic dictating what the typ must be, based on what is in the instrction already.
            if ((token.type == TOKENS.OPERATION) && (instruction.opcode == undefined)) {
                instruction.opcode = OPCODES_TO_NUMERIC[token.value];
                if (OPCODES_TO_EXTRA_NUMERIC.hasOwnProperty(token.value))
                    instruction.operand = OPCODES_TO_EXTRA_NUMERIC[token.value];
            }
            else if ((token.type == TOKENS.LABEL) && (instruction.opcode == undefined)) {
                instruction.label = token.value;
            }
            else if ((token.type == TOKENS.LABEL || token.type == TOKENS.LITERAL) && instruction.opcode != undefined) {
                instruction.operand = token.value;
            }
        }


        // first pass to collect labels
        let symbol_table = {};

        for (let instruction_index in instructions) {
            let instruction = instructions[instruction_index];
            if (instruction.label == undefined) continue;
            else if (symbol_table.hasOwnProperty(instruction.label)) {
                throw new Error(`Multiple defenitions of label ${instruction.label}, latest at ${instruction_index}`)
            }
            else {
                symbol_table[instruction.label] = instruction_index;
            }
        }

        return [instructions, symbol_table];
    }

    /**
     * Assembles the given instructions and symbol table into ram.
     *
     * @param {Array<Instruction>} instructions - An array of instructions with labels left as strings
     * @param {Object} symbol_table - Contains the keys and locations of all labels
     * @throws {Error} - If a label has not been found, panic
     */
    generate_code(instructions, symbol_table) {
        let ram = [];
        
        // expand on the labels, and conver everything to it's numeric value
        for (let instruction_index in instructions) {
            let instruction = instructions[instruction_index];

            if (symbol_table.hasOwnProperty(instruction.operand)) {
                instruction.operand = Number(symbol_table[instruction.operand]);
            }
            else if (isNaN(instruction.operand)) {
                throw new Error(`Undefined symbol: ${instruction.operand}`)
            }

            ram[instruction_index] = instruction.to_numeric();
        }

        return ram;
    }

    /**
     * Preprocess a single line of text, removing repeated characters and replacing tabs with spaces
     *
     * @param {String} text - The input line of text to be parsed
     * @returns {String} the processed string
     */
    preprocess(text) {
        text = text.replaceAll('\t', ' ').trimRight();
        let output = "";
        // flatten spaces
        for (let i in text) {
            if (i != 0)
                output = output.concat((text[i - 1] == ' ' && text[i] == ' ') ? "" : text[i]);
            else
                output = output.concat(text[i]);
        }
        
        return output;
    }

    /**
     * Step the virtual machine a single clock cycle, returning wether the program is done or not
     *
     * @throws {Error} - Unhandled Instruction, used in case something goes very wrong indeed
     * @returns {Boolean} A boodlean stating wether the program is still running
     */
    async step() {
        let instruction = Instruction.from_numeric(this.ram[this.pc]);
        this.pc += 1;

        let done = false;
        switch (instruction.opcode) {
            case OPCODES_TO_NUMERIC.ADD:
                this.accumulator += this.ram[instruction.operand];
                break;

            case OPCODES_TO_NUMERIC.SUB:
                this.accumulator -= this.ram[instruction.operand];
                break;

            case OPCODES_TO_NUMERIC.STA:
                this.ram[instruction.operand] = this.accumulator;
                break;

            case OPCODES_TO_NUMERIC.LDA:
                this.accumulator = this.ram[instruction.operand];
                break;

            case OPCODES_TO_NUMERIC.BRA:
                this.pc = instruction.operand;
                break;

            case OPCODES_TO_NUMERIC.BRZ:
                if (this.accumulator == 0)
                    this.pc = instruction.operand;
                break;

            case OPCODES_TO_NUMERIC.BRP:
                if (this.accumulator >= 0)
                    this.pc = instruction.operand;
                break;

            case OPCODES_TO_NUMERIC.HLT:
            case OPCODES_TO_NUMERIC.RET:
                switch (instruction.operand) {
                    case OPCODES_TO_EXTRA_NUMERIC.HLT:
                        done = true;
                        break;
                    case OPCODES_TO_EXTRA_NUMERIC.RET:
                        this.pc = this.accumulator;
                        break;
                }
                break;

            case OPCODES_TO_NUMERIC.INP:
            case OPCODES_TO_NUMERIC.INPC:
            case OPCODES_TO_NUMERIC.OUT:
            case OPCODES_TO_NUMERIC.OUTC:
            case OPCODES_TO_NUMERIC.NOP:
                switch (instruction.operand) {
                    case OPCODES_TO_EXTRA_NUMERIC.INP:
                        console.warn("Input not fully implemented, using a predetermined stack");
                        let input = await this.request_input()
                        this.accumulator = parseInt(input);
                        break;

                    case OPCODES_TO_EXTRA_NUMERIC.INPC:
                        console.warn("Input not fully implemented, using a predetermined stack");
                        this.accumulator = (await this.request_input()).charCodeAt(0);
                        break;

                    case OPCODES_TO_EXTRA_NUMERIC.OUT:
                        this.print_command(this.accumulator);
                        break;

                    case OPCODES_TO_EXTRA_NUMERIC.OUTC:
                        this.print_command(String.fromCharCode(this.accumulator));
                        break;

                    case OPCODES_TO_EXTRA_NUMERIC.NOP:
                        break;

                    default:
                        console.error("Unrecognised instruction", instruction);
                        return false;
                }
                break;

            case OPCODES_TO_NUMERIC.POP:
            case OPCODES_TO_NUMERIC.PSH:
            case OPCODES_TO_NUMERIC.LDAPC:
            case OPCODES_TO_NUMERIC.LDACC:
                switch (instruction.operand) {
                    case OPCODES_TO_EXTRA_NUMERIC.POP:
                        this.accumulator = this.stack.pop();
                        break;

                    case OPCODES_TO_EXTRA_NUMERIC.PSH:
                        this.stack.push(this.accumulator);
                        break;

                    case OPCODES_TO_EXTRA_NUMERIC.LDAPC:
                        this.accumulator = this.pc;
                        break;

                    case OPCODES_TO_EXTRA_NUMERIC.LDACC:
                        this.accumulator = this.ram[this.accumulator];
                }
                break;

            default:
                console.log(this.pc, this.accumulator, this.ram, this.stack);
                throw new Error(`How on earth did you get here?`);
        }
        return done;
    }

    /**
     * Run the program in ram by repeatedly calling the step function until the program is done
     *
     */
    async run() {
        let done = false;

        while (!done) {
            // await delay(100);
            done = await this.step();
        }
    }


    snapshot() {
        return {
            ram: Array.from(this.ram),
            registers: {accumulator: this.accumulator, pc: this.pc},
            stack: Array.from(this.stack)
        }
    }

    restore(snapshot) {
        this.ram = Array.from(snapshot.ram);
        this.stack = Array.from(snapshot.stack);
        this.pc = snapshot.registers.pc;
        this.accumulator= snapshot.registers.accumulator;
    }
}

let vm = new VirtualMachine();
vm.reset_state();
vm.input_stack = [123, 123];
vm.assemble_into_ram(`        INP
        STA NUM1
        INP 
        STA NUM2
LOOP    LDA TOTAL
        ADD NUM1
        STA TOTAL
        LDA NUM2
        SUB ONE
        STA NUM2
        BRP LOOP
        LDA TOTAL
        SUB NUM1
        STA TOTAL
        OUT
        HLT
NUM1    DAT
NUM2    DAT
ONE     DAT 1
TOTAL   DAT 0`);

console.log(vm.ram);

export default { VirtualMachine };
