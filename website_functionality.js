import VirtualMachine from "./lmc_virtual_machine.js";

const assembly = `LDA literal_0
STA identifier_global_i

// If Start

// Comparison
LDA literal_10
SUB identifier_global_i
BRP temp_calc_0_false
LDA literal_1
BRA temp_calc_0_end
temp_calc_0_false LDA literal_0
temp_calc_0_end STA temp_calc_0

// If Branch
if_0_0 NOP
LDA temp_calc_0
BRZ if_0_1
LDA identifier_global_i
ADD literal_1
STA temp_calc_1
LDA temp_calc_1
STA identifier_global_i

// Comparison
LDA identifier_global_i
SUB literal_10
BRP temp_calc_2_true
LDA literal_0
BRA temp_calc_2_end
temp_calc_2_true LDA literal_1
temp_calc_2_end STA temp_calc_2

// If Branch
if_0_1 NOP
LDA temp_calc_2
BRZ if_0_2
LDA identifier_global_i
SUB literal_2
STA temp_calc_3
LDA temp_calc_3
STA identifier_global_i

// If End
if_0_2 NOP
LDA literal_0
STA identifier_global_i
HLT
identifier_global_i DAT 0
literal_0 DAT 0
if_0 DAT 0
literal_10 DAT 10
temp_calc_0 DAT 0
literal_1 DAT 1
temp_calc_1 DAT 0
temp_calc_2 DAT 0
literal_2 DAT 2
temp_calc_3 DAT 0`;


let vm = new VirtualMachine.VirtualMachine(assembly);

class LMC_Visualiser {
    constructor(parent_div, virtual_machine) {
        parent_div.innerHTML =
        `<div class="horiz1">
            <div class="memory">
            </div>
            <div class="io">
                <div class="output"></div>
                <div class="input">
                    <input type="text" id="inputbox" style="position: absolute; top:0%; left: 2.5%; width:90%;">
                    <button type="button" id="inputbutton" style="position: absolute; bottom:0%; width:100%;">Submit</button>
                </div>
            </div>
        </div>
        <div class="horiz2">
            <div class="register">
                <h4>Registers</h4>
                Program Counter: <label class="pc_label">0000</label> <br>
                Accumulator: <label class="acc_label">0000</label>
            </div>
            <div class="stack">
                <h4>Stack</h4>
                <div class="stack view"></div>
            </div>
            <div class="controls">
                <h4>Program Controls</h4>
                <button id="start">⏮️</button> <button id="back">◀️</button> <button id="stopstart">⏯️</button> <button id="step">▶️</button> <button id="end">⏭️</button>
            </div>
        </div>`

        this.parent_div = parent_div;
        this.virtual_machine = virtual_machine;
        this.memory_size = 200;
        this.displayed_memory = 0;
    }

    async init() {
        this.init_memory();
    }
    // This takes a while, so make it async to allow multiple things to happen at once
    init_memory() {
        let div_element = this.parent_div.getElementsByClassName("memory")[0];
        let html_to_update = `<h3 style="text-align: center;">Main Memory view</h3>`;
        for (let i=0; i < this.memory_size; i++) {
            html_to_update += `<label class="memorycell">0000</label>`;
        }
        this.displayed_memory = this.memory_size;
        div_element.innerHTML = html_to_update;
    }

    show_memory() {
        let memory_cells = this.parent_div.getElementsByClassName("memorycell");
        for (let i = 0; i < this.virtual_machine.ram.length; i++) {
            memory_cells[i].innerHTML = this.virtual_machine.ram[i].toString().padStart(4, "0");
        }
    }

    show_registers() {
        this.parent_div.getElementsByClassName("pc_label")[0].innerhtml = this.virtual_machine.pc;
        this.parent_div.getElementsByClassName("acc_label")[0].innerhtml = this.virtual_machine.accumulator;
    }

    show_stack() {
        this.parent_div.getelementsbyclassname("pc_label")[0].innerhtml = this.virtual_machine.pc;
    }
}

const vis = new LMC_Visualiser(document.getElementsByClassName("class1")[0], vm)
vis.init();
vis.show_memory();
vis.show_registers();
vm.run();
vis.show_memory();
vis.show_registers();
