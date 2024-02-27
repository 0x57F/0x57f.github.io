import LMC_Visualiser from "./lmc_visualiser.js";
import VirtualMachine from "./lmc_virtual_machine.js";
// Import ace, and throw away the import, as everything we need seems to be put out already.
import * as _ from "./lib/ace/ace.js";


const assembly = `LDA literal_0
STA identifier_global_i
OUT
// If Start
INPC
OUT
// Comparison
LDA literal_10
SUB identifier_global_i
BRP temp_calc_0_false
LDA literal_1
BRA temp_calc_0_end
temp_calc_0_false LDA literal_0
temp_calc_0_end STA temp_calc_0
PSH

OUT
// If Branch
if_0_0 NOP
LDA temp_calc_0
BRZ if_0_1
LDA identifier_global_i
ADD literal_1
STA temp_calc_1
LDA temp_calc_1
STA identifier_global_i
PSH
OUT

// Comparison
LDA identifier_global_i
SUB literal_10
BRP temp_calc_2_true
LDA literal_0
BRA temp_calc_2_end
temp_calc_2_true LDA literal_1
temp_calc_2_end STA temp_calc_2
PSH
OUT

// If Branch
if_0_1 NOP
LDA temp_calc_2
BRZ if_0_2
LDA identifier_global_i
SUB literal_2
STA temp_calc_3
LDA temp_calc_3
STA identifier_global_i
PSH
OUT

// If End
if_0_2 NOP
LDA literal_0
STA identifier_global_i
PSH
OUT
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

let vm = new VirtualMachine.VirtualMachine();

var editor = ace.edit("editor");
editor.session.setMode("ace/mode/python");

const visualiser = new LMC_Visualiser(document.getElementsByClassName("class1")[0], vm, editor);

visualiser.init(visualiser);
visualiser.visualise();


document.getElementById("assemble button").onclick = () => {
    let code = editor.getValue();

    vm.reset_state();
    vm.assemble_into_ram(code);
    visualiser.init();
    visualiser.visualise();
}
