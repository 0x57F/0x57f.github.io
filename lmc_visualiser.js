class LMC_Visualiser {
    constructor(parent_div, virtual_machine, ace_editor) {
        parent_div.innerHTML =
        `<div class="horiz1">
            <div class="memory">
            </div>
            <div class="io">
                <p class="output"></p>
                <div class="input">
                    <input type="text" class="inputbox">
                    <button type="button" class="inputbutton">Submit</button>
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
                <p class="stack_view"></p>
            </div>
            <div class="controls">
                <h4>Program Controls</h4>
                <button id="start" onClick="">⏮️</button> <button id="back">◀️</button> <button id="stopstart">⏯️</button> <button id="step">▶️</button> <button id="end">⏭️</button> <br>
            Run speed:<br>
            <input type="range" min="10" max="1000" value="1000" class="slider" class="timing_slider">
            </div>
        </div>`

        this.parent_div = parent_div;
        this.virtual_machine = virtual_machine;
        this.editor = ace_editor;
        this.memory_size = 200;
        this.displayed_memory = 0;
        this.vm_states = [];
        this.vm_index = 0; 

        this.run_state = false;

        this.vm_states.push(this.virtual_machine.snapshot());
        this.vm_slow_run_task();

        this.virtual_machine.print_command = this.output_text.bind(this);
        this.virtual_machine.request_input = this.get_input.bind(this);
        this.input = "";
    }

    init() {
        this.init_memory();
        this.init_buttons();
        this.init_io();
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

    init_buttons() {
        document.getElementById("start").onclick = () => this.restart_vm();
        document.getElementById("back").onclick = () => this.step_back_vm();
        document.getElementById("stopstart").onclick = () => this.toggle_vm_state();
        document.getElementById("step").onclick = () => this.step_vm();
        document.getElementById("end").onclick = () => this.run_vm();
    }

    init_io() {
        document.getElementsByClassName("inputbutton")[0].onclick = () => {
            this.input = this.parent_div.getElementsByClassName("inputbox")[0].value;
        }
    }

    last_marker_id = undefined;
    show_memory() {
        var Range = ace.require('ace/range').Range;
        if (!this.last_marker_id) {
            this.last_marker_id = this.editor.session.addMarker(new Range(this.virtual_machine.pc, 0, this.virtual_machine.pc, 1), "marker", "fullLine");
        }
        else {
            this.editor.session.removeMarker(this.last_marker_id);
            this.last_marker_id = this.editor.session.addMarker(new Range(this.virtual_machine.pc, 0, this.virtual_machine.pc, 1), "marker", "fullLine");
        }
        let memory_cells = this.parent_div.getElementsByClassName("memorycell");
        for (let i = 0; i < this.virtual_machine.ram.length; i++) {
            memory_cells[i].innerHTML = this.virtual_machine.ram[i].toString().padStart(4, "0");
            memory_cells[i].style = (this.virtual_machine.pc === i) ? 'background-color: #FF0000AA' : '';
        }
    }

    show_registers() {
        this.parent_div.getElementsByClassName("pc_label")[0].innerHTML = this.virtual_machine.pc;
        this.parent_div.getElementsByClassName("acc_label")[0].innerHTML = this.virtual_machine.accumulator;
    }

    show_stack() {
        this.parent_div.getElementsByClassName("stack_view")[0].innerHTML = this.virtual_machine.stack.join(', ');
    }

    async step_vm() {
        let done = await this.virtual_machine.step();
        this.vm_states.push(this.virtual_machine.snapshot());
        this.visualise();
        return done;
    }

    async run_vm() {
        await this.virtual_machine.run();
        this.visualise();
    }

    toggle_vm_state() {
        this.run_state = !this.run_state;
    }

    async vm_slow_run_task() {
        if (this.run_state === true) {
            if (await this.step_vm()) this.run_state = false;
        }
        setTimeout(() => this.vm_slow_run_task(), this.read_delay());
    }

    read_delay() {
        return this.parent_div.getElementsByClassName("slider")[0].value;
    }

    step_back_vm() {
        //NOTE: was a bug here with a minus 1 instead of minus 2
        let index = this.vm_states.length - 2;
        if (index < 0) return;

        this.virtual_machine.restore(this.vm_states[index]);
        this.vm_states.pop();
        this.visualise();
    }

    restart_vm() {
        if (this.vm_states.length == 0) return;
        this.virtual_machine.restore(this.vm_states[0]);
        this.vm_states = [];
        this.visualise();
    }

    visualise() {
        this.show_memory();
        this.show_registers();
        this.show_stack();
    }

    output_text(text) {
        this.parent_div.getElementsByClassName("output")[0].innerText += text + "\n";
    }

    async get_input() {
        this.parent_div.getElementsByClassName("inputbox")[0].style = "background-color: red;";

        console.log(this.input);
        const delay = (delayInms) => {return new Promise(resolve => setTimeout(resolve, delayInms));};

        while (this.input == "") {
            await delay(100);
            continue;
        }
        // new value to be entered into the input box.
        this.parent_div.getElementsByClassName("inputbox")[0].style = "";

        let temp = this.input;
        this.input = "";
        console.log(this.input, temp);
        return temp;
    }
}


export default LMC_Visualiser;
