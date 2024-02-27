import imports from "./compiler_visualiser.js";
const {CompilerVisualiser, AstVisitor} = imports;
import * as _ from "./lib/ace/ace.js";
import LMC_Visualiser from "./lmc_visualiser.js";
import VirtualMachine from "./lmc_virtual_machine.js";
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'

class StateMachine {
    states = {};
}

class LeftPane extends StateMachine {
    constructor(div, right_pane) {
        super()
        this.div = div;
        this.right_pane = right_pane;
        this.states = {
            UNINITIALISED: 0,
            PSEUDOCODEINPUT: 1,
            ASSEMBLYVIEWER: 2
        };

        this.state = this.states.UNINITIALISED;
    }

    uninitialised_to_pseudocode_input() {
        if (this.state != this.states.UNINITIALISED) return;

        this.div.innerHTML = `<div id="visualiser-editor"></div>
<button id="visualise-button">Visualise</button>
<button id="assemble-button-pseudo">Assemble</button>`;

        this.pseudocode_editor = ace.edit("visualiser-editor");
        this.pseudocode_editor.session.setMode("ace/mode/python");

        document.getElementById("visualise-button").onclick = () => {
            console.log("visualise-button pressed");
            this.right_pane.assemblyview_to_compilervisualiser();
        }
        document.getElementById("assemble-button-pseudo").onclick = () => {
            console.log("Assemble Button Pressed");
            this.right_pane.assemblyview_to_assemblyinput();
        }
        this.state = this.states.PSEUDOCODEINPUT;
    }

    pseudocode_input_to_assemblyviewer() {
        if (this.state != this.states.PSEUDOCODEINPUT) return;

        // unbind the onclick of the visualise button
        document.getElementById("visualise-button").onclick = undefined;

        this.div.innerHTML = `<div id="virtual-mchine-viewer"></div><button id=visualiser-to-input>Enter Pseudocode</button>`;

        // First we need to store the state of the ace editor
        // Try leaving it to see what happens

        // Set up the VM and visualiser, using the ace editor from the other pane
        this.vm = new VirtualMachine.VirtualMachine();
        this.lmc_visualiser = new LMC_Visualiser(this.div, this.vm, this.right_pane.assembly_editor);

        this.lmc_visualiser.init()
        visualiser.visualise();

        // Assemble Button must use this transition function, and then call the visualise after
        
        document.getElementById("visualiser-to-input").onclick = () => {
            console.log("cisualiser to input");
            this.assemblyviewer_to_pseudocode_input();
        }
        this.state = this.states.ASSEMBLYVIEWER;
    }

    assemblyviewer_to_pseudocode_input() {
        if (this.state != this.states.ASSEMBLYVIEWER) return;

        this.div.innerHTML = `<div id="visualiser-editor"></div>
<button id="visualise-button">Visualise</button>`;

        document.getElementById("visualise-button").onclick = () => {
            console.log("cisualiser button");
            this.right_pane.assemblyview_to_compilervisualiser();
        }
        this.state = this.states.PSEUDOCODEINPUT;
    }
}

class RightPane extends StateMachine {
    constructor(div, left_pane) {
        super()
        this.div = div;
        this.left_pane = left_pane;
        this.states = {
            UNINITIALISED: 0,
            ASSEMBLYVIEW: 1,
            COMPILERVISUALISER: 2,
            ASSEMBLYINPUT: 3
        };
        this.state = this.states.UNINITIALISED;
    }

    uninitialised_to_assemblyview() {
        if (this.state != this.states.UNINITIALISED) return;
        this.div.innerHTML = `<div id="assembly-view-editor"></div>
<button id="run-button-ass">Run</button>`;

        this.assembly_view = ace.edit("assembly-view-editor");
        this.assembly_view_div = document.getElementById("assembly-view-editor");

        document.getElementById("run-button-ass").onclick = () => {
            console.log("run-button-ass");
            this.assemblyview_to_assemblyinput();
        }
        this.state = this.states.ASSEMBLYVIEW;
    }

    assemblyview_to_compilervisualiser() {
        if (this.state != this.states.ASSEMBLYVIEW) return;

        this.div.innerHTML = `<div id="mermaid-div"></div><button id="compiler-to-assemblyview">Back</button><button id="compiler-to-assemblyinput">Run</button>`;

        this.compiler_visualiser = new CompilerVisualiser(document.getElementById("mermaid-div"), this.left_pane.pseudocode_editor, mermaid);
        this.compiler_visualiser.visualise();

        document.getElementById("visualise-button").onclick = () => {
            console.log("visualise-button");
            this.compiler_visualiser.visualise();
        }

        document.getElementById("compiler-to-assemblyview").onclick = () => {
            console.log("compiler to assemblyview");
            this.compilervisualiser_to_assemblyview();
        }

        document.getElementById("compiler-to-assemblyinput").onclick = () => {
            console.log("compiler-to-assemblyinput");
            this.compilervisualiser_to_assemblyinput();
        }
        this.state = this.states.COMPILERVISUALISER;
    }

    compilervisualiser_to_assemblyinput() {
        if (this.state != this.states.COMPILERVISUALISER) return;

        console.log(this.assembly_view_div);
        this.div = this.assembly_view_div;
        this.div.innerHTML += `<button id="assemble-button">Assemble Button</button>`;

        document.getElementById("assemble-button").onclick = () => {
            let code = this.assembly_view.getValue();

            this.left_pane.vm.reset_state();
            this.left_pane.assemble_into_ram(code);
            this.left_pane.lmc_visualiser.init();
            this.left_pane.lmc_visualiser.visualise();
        }
        this.state = this.states.ASSEMBLYINPUT;
    }

    assemblyview_to_assemblyinput() {
        if (this.state != this.states.ASSEMBLYVIEW) return;
        this.state = this.states.ASSEMBLYINPUT;
    }

    assemblyinput_to_assemblyview() {
        if (this.state != this.states.ASSEMBLYINPUT) return;
        this.state = this.states.ASSEMBLYVIEW;
    }

    compilervisualiser_to_assemblyview() {
        if (this.state != this.states.COMPILERVISUALISER) return;
        this.state = this.states.ASSEMBLYVIEW;
        // TODO:
    }
}

class WebsiteState {
    constructor(left_div, right_div) {
        this.left_pane = new LeftPane(left_div, undefined);
        this.right_pane = new RightPane(right_div, this.left_pane);
        this.left_pane.right_pane = this.right_pane;

        this.left_pane.uninitialised_to_pseudocode_input();
        this.right_pane.uninitialised_to_assemblyview();
    }
}

let sm = new WebsiteState(document.getElementsByClassName("class1")[0], document.getElementsByClassName("class2")[0]);
