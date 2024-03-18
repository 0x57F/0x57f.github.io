import LMC_Visualiser from "./lmc_visualiser.js";
import VirtualMachine from "./lmc_virtual_machine.js";
// Import ace, and throw away the import, as everything we need seems to be put out already.
import * as _ from "./lib/ace/ace.js";


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
