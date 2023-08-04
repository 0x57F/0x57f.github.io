// first digit is opcode, next 3 are operands

const OPCODES_TO_NUMERIC = {
	ADD: 1,
	SUB: 2,
	STA: 3,
	POP: 4, //MODIFIED
	PSH: 4, //MODIFIED
	PSHPC: 4, //MODIFIED
	LDA: 5,
	BRA: 6,
	BRZ: 7,
	BRP: 8,
	INP: 9,
	OUT: 9,
	OUTC: 9,
	HLT: 0,
	DAT: -1,
}

const OPCODES_TO_EXTRA_NUMERIC = {
	POP: 1,
	PSH: 2,
	PSHPC: 3,
	INP: 1,
	OUT: 2,
	OUTC: 3
}

const TOKENS = {
	LABEL: "LABEL",
	OPERATION: "OPERATION",
	LITERAL: "LITERAL",
	NEW_INSTRUCTION: "NEW INSTRUCTION"
}

const KEYWORDS = Object.keys(OPCODES_TO_NUMERIC);

class Token {
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

	toString() {
		return `[(${this.type}),${this.value}]`
	}
}

class Instruction {
	constructor(opcode, operand = 0, label = undefined) {
		this.label = label;
		this.opcode = opcode;
		this.operand = operand;
	}

	to_numeric() {
		switch (this.opcode) {
			case OPCODES_TO_NUMERIC.DAT:
				return this.operand;
			default:
				return this.opcode * 1000 + this.operand;
		}
	}

	static from_numeric(number) {
		let operand = number % 1000;
		let opcode = (number - operand) / 1000;
		return new Instruction(opcode, operand);
	}
}

class VirtualMachine {
	constructor(program_string) {
		this.ram = [];
		this.stack = [];
		this.input_stack = [];
		this.stack_pointer = 0;
		this.accumulator = 0;
		this.pc = 0;

		let tokens = this.lexical_analysis(program_string);
		let instructions, symbol_table;
		[instructions, symbol_table] = this.syntax_analysis(tokens);
		this.assemble(instructions, symbol_table);
	}

	// TODO: make symbol table more prevalent

	/**
	 * 
	 * @param {String} program_string the string that the program will be made up of. one program per line
	 * @returns {Array[Token]} A list of tokens with a type and value assigned to them.
	 */
	lexical_analysis(program_string) {
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

				let token = new Token(undefined, lexeme);

				switch (lexeme) {
					case (KEYWORDS.find(value => value == lexeme)):
						token.type = TOKENS.OPERATION;
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

		return tokens;
	}

	/**
	 * 
	 * @param {Array[Token]} tokens An arrray of tokens dictating the structure of the program.
	 * @returns A list of instructions, with labels setup, and a symbol table
	 */
	syntax_analysis(tokens) {
		// list of instructions
		let instructions = [];
		// individual instruction (temp for collation)
		let instruction = new Instruction();


		for (let token_index in tokens) {
			let token = tokens[token_index];
			if (token.type == TOKENS.NEW_INSTRUCTION) {

				// filter out empty lines
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

	assemble(instructions, symbol_table) {
		// expand on the labels, and conver everything to it's numeric value
		for (let instruction_index in instructions) {
			let instruction = instructions[instruction_index];

			if (symbol_table.hasOwnProperty(instruction.operand)) {
				instruction.operand = Number(symbol_table[instruction.operand]);
			}

			this.ram[instruction_index] = instruction.to_numeric();
		}
	}

	preprocess(text) {
		// TODO: clear trailing + leading spaces, clear lines with only a space
		text = text.replaceAll('\t', ' ');
		let output = "";
		for (let i in text) {
			if (i != 0)
				output = output.concat((text[i - 1] == ' ' && text[i] == ' ') ? "" : text[i]);
			else
				output = output.concat(text[i]);
		}
		return output;
	}

	step() {
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
				if (this.accumulator > 0)
					this.pc = instruction.operand;
				break;

			case OPCODES_TO_NUMERIC.HLT:
				done = true;
				break;

			case OPCODES_TO_NUMERIC.INP:
			case OPCODES_TO_NUMERIC.OUT:
			case OPCODES_TO_NUMERIC.OUTC:
				switch (instruction.operand) {
					case OPCODES_TO_EXTRA_NUMERIC.INP:
						console.warn("Input not fully implemented, using a predetermined stack");
						this.accumulator = this.input_stack.pop();
						break;

					case OPCODES_TO_EXTRA_NUMERIC.OUT:
						console.log(this.accumulator);
						break;

					case OPCODES_TO_EXTRA_NUMERIC.OUTC:
						console.log(String.fromCharCode(this.accumulator));
						break;

				}
				break;

			case OPCODES_TO_NUMERIC.POP:
			case OPCODES_TO_NUMERIC.PSH:
			case OPCODES_TO_NUMERIC.PSHPC:
				switch (instruction.operand) {
					case OPCODES_TO_EXTRA_NUMERIC.POP:
						this.accumulator = this.stack.pop();
						break;

					case OPCODES_TO_EXTRA_NUMERIC.PSH:
						this.stack.push(this.accumulator);
						break;

					case OPCODES_TO_EXTRA_NUMERIC.PSHPC:
						this.stack.push(this.pc);
						break;
				}
				break;

			default:
				throw new Error(`How on earth did you get here?`);
		}
		return done;
	}

	run() {
		this.pc = 0;
		let done = false;
		console.log(this.ram);
		while (!done) {
			done = this.step();
		}
	}
}
let code = "" +
	"LDA ONE\n" +
	"ADD TWO\n" +
	"OUT\n" +
	"PSHPC\n" +
	"LDA TWO\n" +
	"POP\n" +
	"OUT\n" +
	"HLT\n" +
	"ONE DAT 1\n" +
	"TWO DAT 2\n"


let VM = new VirtualMachine(code);
VM.input_stack = [10, 2];
VM.run();

