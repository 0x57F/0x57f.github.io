import vis from "./compiler_visualiser.js";
const {CompilerVisualiser, AstVisitor} = vis;
import imports from "./compiler.js";
const {CompilerVisitor: Compiler} = imports;
import * as _ from "./lib/ace/ace.js";
import LMC_Visualiser from "./lmc_visualiser.js";
import VirtualMachine from "./lmc_virtual_machine.js";
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'

class StateMachine {
    constructor() {
        this.states = {};
        this.transitions = {};
    }

    transition(state) {
        if (this.transitions[this.state][state]) {
            this.transitions[this.state][state]();
        }
    }
}

class LeftPane extends StateMachine {
    constructor(div, right_pane) {
        super();
        this.states = {
            UNINITIALISED: 0,
            PSEUDOCODE_INPUT: 1,
            LMC_VIEW: 2
        };

        this.div = div;
        this.right_pane = right_pane;
        this.state = this.states.UNINITIALISED;
        this.transitions = {
            [this.states.UNINITIALISED]: {

                [this.states.PSEUDOCODE_INPUT]: (() => {
                    this.div.innerHTML = `<p>Pseudocode Area</p>
                        <div id="visualiser-editor"></div>
<button id="visualise-button-left">Visualise</button>
<button id="assemble-button-left">Assemble</button>`;

                    this.pseudocode_editor = ace.edit("visualiser-editor");
                    this.pseudocode_editor.session.setMode("ace/mode/python");
                    this.pseudocode_div = document.getElementById("visualiser-editor");

                    document.getElementById("visualise-button-left").onclick = () => {
                        this.right_pane.transition(this.right_pane.states.COMPILER_VISUALISE);
                    }
                    document.getElementById("assemble-button-left").onclick = () => {
                        this.right_pane.transition(this.right_pane.states.ASSEMBLY_VIEW);
                    }
                    this.state = this.states.PSEUDOCODE_INPUT;
                }).bind(this)

            },
            [this.states.PSEUDOCODE_INPUT]: {

                [this.states.LMC_VIEW]: (() => {
                    this.div.innerHTML = `<div id="LMC" style="display:relative"></div><br><button style="position:fixed; z-index:9999" id="return">Return</button>`;
                    if (!this.VM) {
                        this.vm = new VirtualMachine.VirtualMachine();
                    }
                    this.vm_visualiser = new LMC_Visualiser(document.getElementById("LMC"), this.vm, this.right_pane.assembly_view);
                    this.vm.assemble_into_ram(this.right_pane.assembly_view.getValue());
                    this.vm_visualiser.init();
                    this.vm_visualiser.visualise();

                    this.state = this.states.LMC_VIEW;
                    
                    document.getElementById("return").onclick = () => {
                        this.transition(this.states.PSEUDOCODE_INPUT);
                        this.vm_visualiser.run_state = false;
                    }
                }
                ).bind(this),

            },
            [this.states.LMC_VIEW]: {

                [this.states.LMC_VIEW]: (() => {
                    this.div.innerHTML = `<div id="LMC" style="display:relative"></div><br><button style="position:fixed; z-index:9999" id="return">Return</button>`;
                    if (!this.VM) {
                        this.vm = new VirtualMachine.VirtualMachine();
                    }
                    this.vm_visualiser = new LMC_Visualiser(document.getElementById("LMC"), this.vm, this.right_pane.assembly_view);
                    this.vm.assemble_into_ram(this.right_pane.assembly_view.getValue());
                    this.vm_visualiser.init();
                    this.vm_visualiser.visualise();

                    this.state = this.states.LMC_VIEW;
                    
                    document.getElementById("return").onclick = () => {
                        this.transition(this.states.PSEUDOCODE_INPUT);
                        this.vm_visualiser.run_state = false;
                    }
                }
                ).bind(this),

                [this.states.PSEUDOCODE_INPUT]: (() => {
                    this.div.innerHTML = `<p>Pseudocode Area</p>
                        <div id="visualiser-editor"></div>
<button id="visualise-button-left">Visualise</button>
<button id="assemble-button-left">Assemble</button>`;

                    this.div.replaceChild(this.pseudocode_div, document.getElementById("visualiser-editor"));

                    document.getElementById("visualise-button-left").onclick = () => {
                        this.right_pane.transition(this.right_pane.states.COMPILER_VISUALISE);
                    }
                    document.getElementById("assemble-button-left").onclick = () => {
                        this.right_pane.transition(this.right_pane.states.ASSEMBLY_VIEW);
                    }
                    this.state = this.states.PSEUDOCODE_INPUT;
                }).bind(this),

            }
        };

    }
}

class RightPane extends StateMachine {
    constructor(div, left_pane) {
        super();
        this.states = {
            UNINITIALISED: 0,
            ASSEMBLY_VIEW: 1,
            COMPILER_VISUALISE: 2
        };

        this.div = div;
        this.left_pane = left_pane;
        this.state = this.states.UNINITIALISED;
        this.transitions = {
            [this.states.UNINITIALISED]: {

                [this.states.ASSEMBLY_VIEW]: (() => {
                    this.div.innerHTML = `<p>Assembly Area</p><div id="assembly-view-editor"></div>
            <button id="run-button-right">Run</button>`;

                    this.assembly_view = ace.edit("assembly-view-editor");
                    this.assembly_view_div = document.getElementById("assembly-view-editor");

                    document.getElementById("run-button-right").onclick = () => {
                        this.left_pane.transition(this.left_pane.states.LMC_VIEW);
                    }
                    this.state = this.states.ASSEMBLY_VIEW;
                }).bind(this),

            },
            [this.states.ASSEMBLY_VIEW]: {

                [this.states.ASSEMBLY_VIEW]: (() => {
                    this.compiler = new Compiler();
                    let input = this.left_pane.pseudocode_editor.getValue();
                    this.compiler.compile(input);
                    this.assembly_view.session.setValue(this.compiler.assembly);
                }).bind(this),

                [this.states.COMPILER_VISUALISE]: (() => {
                    this.div.innerHTML = `<p>Syntax Tree View</p>
                        <div id="mermaid-div"></div>`;
                    this.compiler_visualiser = new CompilerVisualiser(document.getElementById("mermaid-div"), this.left_pane.pseudocode_editor, mermaid);
                    this.compiler_visualiser.visualise();
                    this.state = this.states.COMPILER_VISUALISE;
                }).bind(this),

            },
            [this.states.COMPILER_VISUALISE]: {

                [this.states.COMPILER_VISUALISE]: (() => {
                    this.div.innerHTML = `<p>Syntax Tree View</p>
                        <div id="mermaid-div"></div>`;
                    this.compiler_visualiser = new CompilerVisualiser(document.getElementById("mermaid-div"), this.left_pane.pseudocode_editor, mermaid);
                    this.compiler_visualiser.visualise();
                    this.state = this.states.COMPILER_VISUALISE;
                }).bind(this),

                [this.states.ASSEMBLY_VIEW]: (() => {
                    this.div.innerHTML = `<p>Assembly Area</p><div id="assembly-view-editor"></div>
            <button id="run-button-right">Run</button>`;
                    document.getElementById("run-button-right").onclick = () => {
                        this.left_pane.transition(this.left_pane.states.LMC_VIEW);
                    }
                    this.div.replaceChild(this.assembly_view_div, document.getElementById("assembly-view-editor"));
                    this.state = this.states.ASSEMBLY_VIEW;
                    this.transition(this.states.ASSEMBLY_VIEW);
                }).bind(this),
            }
        }
    }
}

/*
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

        this.div.innerHTML = `<div id="visualiser-editor"></div>
<button id="visualise-button">Visualise</button>
<button id="assemble-button">Assemble</button>`;

        this.pseudocode_editor = ace.edit("visualiser-editor");
        this.pseudocode_editor.session.setMode("ace/mode/python");

        document.getElementById("visualise-button").onclick = () => {
            this.right_pane.assemblyview_to_compilervisualiser();
        }
        document.getElementById("assemble-button").onclick = () => {
            this.right_pane.assemblyview_to_assemblyinput();
        }
        this.state = this.states.PSEUDOCODEINPUT;
    }

    pseudocode_input_to_assemblyviewer() {

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
        console.log("compiler vis entered")

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

        console.log(this.assembly_view_div);
        this.div = this.assembly_view_div;
        this.div.innerHTML += `<button id="assemble-button">Assemble Button</button>`;

        document.getElementById("assemble-button").onclick = () => {
            this.left_pane.pseudocode_input_to_assemblyviewer();
            let code = this.assembly_view.getValue();

            this.left_pane.vm.reset_state();
            this.left_pane.assemble_into_ram(code);
            this.left_pane.lmc_visualiser.init();
            this.left_pane.lmc_visualiser.visualise();
        }
        this.state = this.states.ASSEMBLYINPUT;
    }

    assemblyview_to_assemblyinput() {
        console.log("assemble input entered");
        this.state = this.states.ASSEMBLYINPUT;
    }

    assemblyinput_to_assemblyview() {
        this.state = this.states.ASSEMBLYVIEW;
    }

    compilervisualiser_to_assemblyview() {
        this.state = this.states.ASSEMBLYVIEW;
        // TODO:
    }
}

*/
class WebsiteState {
    constructor(left_div, right_div) {
        this.left_pane = new LeftPane(left_div, undefined);
        this.right_pane = new RightPane(right_div, this.left_pane);
        this.left_pane.right_pane = this.right_pane;

        this.left_pane.transition(this.left_pane.states.PSEUDOCODE_INPUT);
        this.right_pane.transition(this.right_pane.states.ASSEMBLY_VIEW);

    }
}
let sm = new WebsiteState(document.getElementsByClassName("class1")[0], document.getElementsByClassName("class2")[0]);
