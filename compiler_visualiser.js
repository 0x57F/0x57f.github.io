const { antlr4, TreeLexer, TreeParser, TreeVisitor } = self.parser.default;


class CompilerVisualiser {
    constructor(parent_div, ace_editor, mermaid) {
        this.parent_div = parent_div;
        this.ace_editor = ace_editor;
        this.mermaid = mermaid;
    }

    generate_tree(input) {
        this.chars = new antlr4.InputStream(input);
        this.lexer = new TreeLexer(this.chars);
        this.tokens = new antlr4.CommonTokenStream(this.lexer);
        this.parser = new TreeParser(this.tokens);
        this.tree = this.parser.program();

        this.visitor = new AstVisitor();
        this.tree.accept(this.visitor);
    }

    async visualise() {
        this.generate_tree(this.ace_editor.getValue());
        let graph = "flowchart TD \n" + this.visitor.program_tree;
        let svg = await this.mermaid.render("viewer", graph);
        console.log(svg.svg);
        this.parent_div.innerHTML = svg.svg;
    }
}

class AstVisitor extends TreeVisitor {
    constructor() {
        super()
        this.program_tree = "";
        this.box_counter = 0;
        this._visitChildren = this.visitChildren;
        this.visitChildren = (ctx) => {
            this._visitChildren(ctx);
        }
    }
    // Visit a parse tree produced by pseudocodeParser#program.
    visitProgram(ctx) {
        let box = this.box_counter++;
        this.program_tree += `${box}[program]\n`;

        ctx.box = box;

        this.visitChildren(ctx);
    }

    make_box(ctx, pass_through = true) {
        let box = this.box_counter++;
        if (pass_through) ctx.box = box;
        return box;
    }

    pass_through(ctx) {
        ctx.box = ctx.parentCtx.box;
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#if_start.
    visitIf_start(ctx) {
        return this.pass_through(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#if_continuation.
    visitIf_continuation(ctx) {
        return this.pass_through(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#if_final.
    visitIf_final(ctx) {
        return this.pass_through(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#if.
    visitIf(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[if]\n`;
        if (ctx.children.length <= 4) 
            this.visitChildren(ctx);
        else {
            for (let i = 0; i < ctx.children.length - 2; i += 2) {
                const sub = ctx.children.slice(i, i + 2);
                const old_box = ctx.box;
                const new_box = this.make_box(ctx);
                sub[0].accept(this); sub[1].accept(this);
                
                this.program_tree += `${old_box} --> ${new_box}[If branch ${Math.floor(i/ 2)+1}]\n`;
                ctx.box = old_box;
            }
        }

        return box;
    }


    // Visit a parse tree produced by pseudocodeParser#switch_start.
    visitSwitch_start(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#switch_mid.
    visitSwitch_mid(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#switch_default.
    visitSwitch_default(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#switch_case.
    visitSwitch_case(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#expr.
    visitExpr(ctx) {
        ctx.box = ctx.parentCtx.box;
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#literal.
    visitLiteral(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#calc.
    visitCalc(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#mul.
    visitMul(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#mod.
    visitMod(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#pow.
    visitPow(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#bracket.
    visitBracket(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#true_id.
    visitTrue_id(ctx) {
        return this.visitChildren(ctx);
    }


    // Visit a parse tree produced by pseudocodeParser#index.
    visitIndex(ctx) {
        return this.visitChildren(ctx);
    }

    visitComp_bracket(ctx) {
        return this.pass_through(ctx);
    }
    
    visitComp_calc(ctx) {
        return this.pass_through(ctx);
    }

    visitComp_bool(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Boolean: ${ctx.getText()}]\n`;
    }

    visitComp_call(ctx) {
        return this.pass_through(ctx);
    }

    visitFunc_call(ctx) {
        let box = this.make_box(ctx);
        let func_name = ctx.children[0].getText();
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Function Call: ${func_name}]\n`;
        for (let child of ctx.children.slice(1)) {child.accept(this)};
    }


    visitComp(ctx) {
        let box = this.make_box(ctx, true);
        ctx.children[0].accept(this);
        let operation = ctx.children[1].getText();
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Comparison: ${operation}]\n`;
        ctx.children[2].accept(this);
    }

    visitCalc_pm(ctx) {
        let box = this.make_box(ctx, true);
        ctx.children[0].accept(this);
        let operation = ctx.children[1].getText();
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Operation: ${operation}]\n`;
        ctx.children[2].accept(this);
    }

    visitMul_md(ctx) {
        let box = this.make_box(ctx, true);
        ctx.children[0].accept(this);
        let operation = ctx.children[1].getText();
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Operation: ${operation}]\n`;
        ctx.children[2].accept(this);
    }

    visitMod_md(ctx) {
        let box = this.make_box(ctx, true);
        ctx.children[0].accept(this);
        let operation = ctx.children[1].getText();
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Operation: ${operation}]\n`;
        ctx.children[2].accept(this);
    }

    visitCalc_recurse(ctx) {
        return this.pass_through(ctx);
    }

    visitCalc_bracket(ctx) {
        return this.pass_through(ctx);
    }

    visitMul_recurse(ctx) {
        return this.pass_through(ctx);
    }

    visitMod_recurse(ctx) {
        return this.pass_through(ctx);
    }

    visitPow(ctx) {
        if (ctx.children.length == 1) {
            return this.pass_through(ctx);
        }

        let box = this.make_box(ctx, true);
        ctx.children[0].accept(this);
        let operation = ctx.children[1].getText();
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Operation: ${operation}]\n`;
        ctx.children[2].accept(this);
    }

    visitCalc_lit(ctx) {
        return this.pass_through(ctx);
    }

    visitCalc_id(ctx) {
        return this.pass_through(ctx);
    }

    visitCalc_neg(ctx) {
        let box = this.make_box(ctx, true);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Operation: -]\n`;
        ctx.children[1].accept(this);
    }

    visitCalc_func(ctx) {
        return this.pass_through(ctx);
    }

    visitLiteral_name(ctx) {
        return this.pass_through(ctx);
    }

    visitLiteral_int(ctx) {
        let box = this.make_box(ctx, true);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[${ctx.children[0].getText()}]\n`;
    }

    visitTrue_id(ctx) {
        let box = this.make_box(ctx, true);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[${ctx.children[0].getText()}]\n`;
    }

    visitStat(ctx) {
        let box = this.make_box(ctx, true);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Assignment]\n`;
        this.visitChildren(ctx);
    }

    visitClosure(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Bloc]\n`;
        this.visitChildren(ctx);
    }

    visitBreak(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Break]\n`;
    }

    visitContinue(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Continue]\n`;
    }

    visitFor_start(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[For Start]\n`;
    }

    visitFor(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[For Loop]\n`;
        ctx.children[0].accept(this); ctx.children[1].accept(this);
        let sub_box = this.make_box(ctx);
        this.program_tree += `${box} --> ${sub_box}[Next]\n`;
        ctx.children[3].accept(this);
    }

    visitWhile(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[While Loop]\n`;
        this.visitChildren(ctx);
    }

    visitWhile_start(ctx) {
        return this.pass_through(ctx);
    }

    visitDo_while(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Do Until Loop]\n`;
        this.visitChildren(ctx);
    }

    visitDo_end(ctx) {
        let box = this.make_box(ctx);
        this.program_tree += `${ctx.parentCtx.box} --> ${box}[Until]\n`;
        this.visitChildren(ctx);
    }

}
let input = `
// 27
a = 5
assert(a == 5)
b = -10
assert(b == -10)

// 29
assert(a > b)
assert(-b == 10)
assert(-b > a)
// 32
if a > b then
    assert(true)
else
    assert(false)
endif

if a < b then
    assert(false)
endif

if a <= b then
    assert(false)
elseif true then
    assert(true)
endif
if a <= b then
    assert(false)
elseif false then
    assert(false)
else
    assert(true)
endif

for i = 0 to 10
    if i == 11 then
        assert(false)
    endif
next i

for i = 1 to 10
    if i == 0 then
        assert(false)
    endif
next i

i = 0
while i < 10
    if i == 5 then
        break
    elseif i > 5 then
        assert(false)
    endif
    i = i + 1
endwhile

i = 0
while i < 10
    j = 0
    while j < 10
        if j == 5 then
            break
        endif
        j = 1 + j
    endwhile
    assert(j == 5)
    i = i + 1
endwhile
assert(i == 10)

i = 0
do
    if i == 5 then
        break
    endif
    i = i + 1
until i == 10
assert(i == 5)

i = 0
print(i)
i = input()
print(i)
`

export default { CompilerVisualiser, AstVisitor };