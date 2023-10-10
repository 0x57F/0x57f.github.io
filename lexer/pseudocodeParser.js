// Generated from pseudocode.g4 by ANTLR 4.13.0
// jshint ignore: start
import antlr4 from 'antlr4';
import pseudocodeListener from './pseudocodeListener.js';
const serializedATN = [4,1,50,342,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,2,27,
7,27,2,28,7,28,2,29,7,29,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,71,
8,0,10,0,12,0,74,9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,86,8,1,
1,2,1,2,1,2,1,2,1,2,5,2,93,8,2,10,2,12,2,96,9,2,5,2,98,8,2,10,2,12,2,101,
9,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,3,5,3,112,8,3,10,3,12,3,115,9,3,1,
4,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,6,1,6,1,6,1,6,1,
6,1,6,1,7,1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,9,1,9,1,9,1,9,1,10,1,10,1,10,
1,10,1,10,1,11,1,11,1,11,1,11,1,11,1,11,1,12,1,12,1,12,1,12,1,12,1,12,1,
13,1,13,1,13,1,13,1,14,1,14,5,14,173,8,14,10,14,12,14,176,9,14,1,14,3,14,
179,8,14,1,14,1,14,1,14,1,15,1,15,1,15,1,15,1,15,1,16,1,16,1,16,1,16,1,16,
1,16,1,17,1,17,1,17,1,17,1,17,1,18,1,18,5,18,202,8,18,10,18,12,18,205,9,
18,1,18,3,18,208,8,18,1,18,1,18,1,18,1,19,1,19,1,19,1,19,1,19,1,19,1,19,
1,19,1,19,3,19,222,8,19,1,19,1,19,1,19,1,19,1,19,1,19,5,19,230,8,19,10,19,
12,19,233,9,19,1,20,1,20,1,20,3,20,238,8,20,1,21,1,21,1,21,1,21,1,21,5,21,
245,8,21,10,21,12,21,248,9,21,3,21,250,8,21,1,21,1,21,1,22,1,22,1,22,5,22,
257,8,22,10,22,12,22,260,9,22,1,23,1,23,1,23,5,23,265,8,23,10,23,12,23,268,
9,23,1,24,1,24,1,24,5,24,273,8,24,10,24,12,24,276,9,24,1,25,1,25,1,25,3,
25,281,8,25,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,3,26,291,8,26,1,27,1,
27,1,27,1,27,1,27,1,27,4,27,299,8,27,11,27,12,27,300,5,27,303,8,27,10,27,
12,27,306,9,27,1,28,1,28,5,28,310,8,28,10,28,12,28,313,9,28,1,28,1,28,1,
28,3,28,318,8,28,1,28,5,28,321,8,28,10,28,12,28,324,9,28,5,28,326,8,28,10,
28,12,28,329,9,28,1,29,1,29,1,29,1,29,5,29,335,8,29,10,29,12,29,338,9,29,
1,29,1,29,1,29,0,2,38,54,30,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,
34,36,38,40,42,44,46,48,50,52,54,56,58,0,4,1,0,15,16,1,0,17,18,1,0,31,32,
1,0,20,25,360,0,72,1,0,0,0,2,85,1,0,0,0,4,87,1,0,0,0,6,113,1,0,0,0,8,116,
1,0,0,0,10,122,1,0,0,0,12,130,1,0,0,0,14,136,1,0,0,0,16,140,1,0,0,0,18,145,
1,0,0,0,20,149,1,0,0,0,22,154,1,0,0,0,24,160,1,0,0,0,26,166,1,0,0,0,28,170,
1,0,0,0,30,183,1,0,0,0,32,188,1,0,0,0,34,194,1,0,0,0,36,199,1,0,0,0,38,221,
1,0,0,0,40,237,1,0,0,0,42,239,1,0,0,0,44,253,1,0,0,0,46,261,1,0,0,0,48,269,
1,0,0,0,50,277,1,0,0,0,52,290,1,0,0,0,54,292,1,0,0,0,56,307,1,0,0,0,58,330,
1,0,0,0,60,71,3,2,1,0,61,71,3,8,4,0,62,71,3,42,21,0,63,71,3,38,19,0,64,71,
3,12,6,0,65,71,3,16,8,0,66,71,3,28,14,0,67,71,3,20,10,0,68,71,3,36,18,0,
69,71,3,56,28,0,70,60,1,0,0,0,70,61,1,0,0,0,70,62,1,0,0,0,70,63,1,0,0,0,
70,64,1,0,0,0,70,65,1,0,0,0,70,66,1,0,0,0,70,67,1,0,0,0,70,68,1,0,0,0,70,
69,1,0,0,0,71,74,1,0,0,0,72,70,1,0,0,0,72,73,1,0,0,0,73,75,1,0,0,0,74,72,
1,0,0,0,75,76,5,0,0,1,76,1,1,0,0,0,77,78,3,56,28,0,78,79,5,4,0,0,79,80,3,
38,19,0,80,81,5,49,0,0,81,86,1,0,0,0,82,83,3,38,19,0,83,84,5,49,0,0,84,86,
1,0,0,0,85,77,1,0,0,0,85,82,1,0,0,0,86,3,1,0,0,0,87,88,5,48,0,0,88,99,5,
8,0,0,89,94,5,48,0,0,90,91,5,6,0,0,91,93,5,48,0,0,92,90,1,0,0,0,93,96,1,
0,0,0,94,92,1,0,0,0,94,95,1,0,0,0,95,98,1,0,0,0,96,94,1,0,0,0,97,89,1,0,
0,0,98,101,1,0,0,0,99,97,1,0,0,0,99,100,1,0,0,0,100,102,1,0,0,0,101,99,1,
0,0,0,102,103,5,9,0,0,103,104,5,49,0,0,104,5,1,0,0,0,105,112,3,2,1,0,106,
112,3,12,6,0,107,112,3,16,8,0,108,112,3,28,14,0,109,112,3,20,10,0,110,112,
3,36,18,0,111,105,1,0,0,0,111,106,1,0,0,0,111,107,1,0,0,0,111,108,1,0,0,
0,111,109,1,0,0,0,111,110,1,0,0,0,112,115,1,0,0,0,113,111,1,0,0,0,113,114,
1,0,0,0,114,7,1,0,0,0,115,113,1,0,0,0,116,117,5,26,0,0,117,118,3,4,2,0,118,
119,3,6,3,0,119,120,5,27,0,0,120,121,5,49,0,0,121,9,1,0,0,0,122,123,5,28,
0,0,123,124,3,56,28,0,124,125,5,4,0,0,125,126,3,38,19,0,126,127,5,29,0,0,
127,128,3,38,19,0,128,129,5,49,0,0,129,11,1,0,0,0,130,131,3,10,5,0,131,132,
3,6,3,0,132,133,5,30,0,0,133,134,3,56,28,0,134,135,5,49,0,0,135,13,1,0,0,
0,136,137,5,33,0,0,137,138,3,38,19,0,138,139,5,49,0,0,139,15,1,0,0,0,140,
141,3,14,7,0,141,142,3,6,3,0,142,143,5,34,0,0,143,144,5,49,0,0,144,17,1,
0,0,0,145,146,5,41,0,0,146,147,3,38,19,0,147,148,5,49,0,0,148,19,1,0,0,0,
149,150,5,40,0,0,150,151,5,49,0,0,151,152,3,6,3,0,152,153,3,18,9,0,153,21,
1,0,0,0,154,155,5,35,0,0,155,156,3,38,19,0,156,157,5,36,0,0,157,158,5,49,
0,0,158,159,3,6,3,0,159,23,1,0,0,0,160,161,5,37,0,0,161,162,3,38,19,0,162,
163,5,36,0,0,163,164,5,49,0,0,164,165,3,6,3,0,165,25,1,0,0,0,166,167,5,38,
0,0,167,168,5,49,0,0,168,169,3,6,3,0,169,27,1,0,0,0,170,174,3,22,11,0,171,
173,3,24,12,0,172,171,1,0,0,0,173,176,1,0,0,0,174,172,1,0,0,0,174,175,1,
0,0,0,175,178,1,0,0,0,176,174,1,0,0,0,177,179,3,26,13,0,178,177,1,0,0,0,
178,179,1,0,0,0,179,180,1,0,0,0,180,181,5,39,0,0,181,182,5,49,0,0,182,29,
1,0,0,0,183,184,5,42,0,0,184,185,3,56,28,0,185,186,5,14,0,0,186,187,5,49,
0,0,187,31,1,0,0,0,188,189,5,43,0,0,189,190,3,40,20,0,190,191,5,14,0,0,191,
192,5,49,0,0,192,193,3,6,3,0,193,33,1,0,0,0,194,195,5,44,0,0,195,196,5,14,
0,0,196,197,5,49,0,0,197,198,3,6,3,0,198,35,1,0,0,0,199,203,3,30,15,0,200,
202,3,32,16,0,201,200,1,0,0,0,202,205,1,0,0,0,203,201,1,0,0,0,203,204,1,
0,0,0,204,207,1,0,0,0,205,203,1,0,0,0,206,208,3,34,17,0,207,206,1,0,0,0,
207,208,1,0,0,0,208,209,1,0,0,0,209,210,5,45,0,0,210,211,5,49,0,0,211,37,
1,0,0,0,212,213,6,19,-1,0,213,222,3,40,20,0,214,222,5,48,0,0,215,222,3,44,
22,0,216,222,3,42,21,0,217,218,5,3,0,0,218,222,3,38,19,5,219,222,3,54,27,
0,220,222,3,56,28,0,221,212,1,0,0,0,221,214,1,0,0,0,221,215,1,0,0,0,221,
216,1,0,0,0,221,217,1,0,0,0,221,219,1,0,0,0,221,220,1,0,0,0,222,231,1,0,
0,0,223,224,10,4,0,0,224,225,5,1,0,0,225,230,3,38,19,5,226,227,10,3,0,0,
227,228,5,2,0,0,228,230,3,38,19,4,229,223,1,0,0,0,229,226,1,0,0,0,230,233,
1,0,0,0,231,229,1,0,0,0,231,232,1,0,0,0,232,39,1,0,0,0,233,231,1,0,0,0,234,
238,3,56,28,0,235,238,5,46,0,0,236,238,5,47,0,0,237,234,1,0,0,0,237,235,
1,0,0,0,237,236,1,0,0,0,238,41,1,0,0,0,239,240,5,48,0,0,240,249,5,8,0,0,
241,246,3,38,19,0,242,243,5,6,0,0,243,245,3,38,19,0,244,242,1,0,0,0,245,
248,1,0,0,0,246,244,1,0,0,0,246,247,1,0,0,0,247,250,1,0,0,0,248,246,1,0,
0,0,249,241,1,0,0,0,249,250,1,0,0,0,250,251,1,0,0,0,251,252,5,9,0,0,252,
43,1,0,0,0,253,258,3,46,23,0,254,255,7,0,0,0,255,257,3,46,23,0,256,254,1,
0,0,0,257,260,1,0,0,0,258,256,1,0,0,0,258,259,1,0,0,0,259,45,1,0,0,0,260,
258,1,0,0,0,261,266,3,48,24,0,262,263,7,1,0,0,263,265,3,48,24,0,264,262,
1,0,0,0,265,268,1,0,0,0,266,264,1,0,0,0,266,267,1,0,0,0,267,47,1,0,0,0,268,
266,1,0,0,0,269,274,3,50,25,0,270,271,7,2,0,0,271,273,3,50,25,0,272,270,
1,0,0,0,273,276,1,0,0,0,274,272,1,0,0,0,274,275,1,0,0,0,275,49,1,0,0,0,276,
274,1,0,0,0,277,280,3,52,26,0,278,279,5,19,0,0,279,281,3,50,25,0,280,278,
1,0,0,0,280,281,1,0,0,0,281,51,1,0,0,0,282,291,3,40,20,0,283,291,3,56,28,
0,284,285,5,8,0,0,285,286,3,44,22,0,286,287,5,9,0,0,287,291,1,0,0,0,288,
289,5,15,0,0,289,291,3,46,23,0,290,282,1,0,0,0,290,283,1,0,0,0,290,284,1,
0,0,0,290,288,1,0,0,0,291,53,1,0,0,0,292,293,6,27,-1,0,293,294,3,44,22,0,
294,304,1,0,0,0,295,298,10,2,0,0,296,297,7,3,0,0,297,299,3,54,27,0,298,296,
1,0,0,0,299,300,1,0,0,0,300,298,1,0,0,0,300,301,1,0,0,0,301,303,1,0,0,0,
302,295,1,0,0,0,303,306,1,0,0,0,304,302,1,0,0,0,304,305,1,0,0,0,305,55,1,
0,0,0,306,304,1,0,0,0,307,311,5,48,0,0,308,310,3,58,29,0,309,308,1,0,0,0,
310,313,1,0,0,0,311,309,1,0,0,0,311,312,1,0,0,0,312,327,1,0,0,0,313,311,
1,0,0,0,314,317,5,5,0,0,315,318,5,48,0,0,316,318,3,42,21,0,317,315,1,0,0,
0,317,316,1,0,0,0,318,322,1,0,0,0,319,321,3,58,29,0,320,319,1,0,0,0,321,
324,1,0,0,0,322,320,1,0,0,0,322,323,1,0,0,0,323,326,1,0,0,0,324,322,1,0,
0,0,325,314,1,0,0,0,326,329,1,0,0,0,327,325,1,0,0,0,327,328,1,0,0,0,328,
57,1,0,0,0,329,327,1,0,0,0,330,331,5,12,0,0,331,336,5,46,0,0,332,333,5,6,
0,0,333,335,5,46,0,0,334,332,1,0,0,0,335,338,1,0,0,0,336,334,1,0,0,0,336,
337,1,0,0,0,337,339,1,0,0,0,338,336,1,0,0,0,339,340,5,13,0,0,340,59,1,0,
0,0,29,70,72,85,94,99,111,113,174,178,203,207,221,229,231,237,246,249,258,
266,274,280,290,300,304,311,317,322,327,336];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class pseudocodeParser extends antlr4.Parser {

    static grammarFileName = "pseudocode.g4";
    static literalNames = [ null, "'AND'", "'OR'", "'NOT'", "'='", "'.'", 
                            "','", "';'", "'('", "')'", "'{'", "'}'", "'['", 
                            "']'", "':'", "'-'", "'+'", "'*'", "'/'", "'^'", 
                            "'<'", "'>'", "'<='", "'>='", "'=='", "'!='", 
                            null, null, "'for'", "'to'", "'next'", "'MOD'", 
                            "'DIV'", "'while'", "'endwhile'", "'if'", "'then'", 
                            "'elseif'", "'else'", "'endif'", "'do'", "'until'", 
                            "'switch'", "'case'", "'default'", "'endswitch'" ];
    static symbolicNames = [ null, "AND", "OR", "NOT", "EQ", "DOT", "COMMA", 
                             "SEMI", "LPAREN", "RPAREN", "LCURLY", "RCURLY", 
                             "LSQ", "RSQ", "COLON", "NEG", "PLUS", "MUL", 
                             "DIV", "POW", "LT", "GT", "LTE", "GTE", "EE", 
                             "NE", "FUNCKW", "ENDFUNCKW", "FOR", "TO", "NEXT", 
                             "MODKW", "DIVKW", "WHILE", "ENDWHILE", "IF", 
                             "THEN", "ELSEIF", "ELSE", "ENDIF", "DO", "UNTIL", 
                             "SWITCH", "CASE", "DEFAULT", "ENDSWITCH", "INT", 
                             "STRING", "ID", "NEWLINE", "WS" ];
    static ruleNames = [ "program", "stat", "def", "closure", "func_dec", 
                         "for_start", "for", "while_start", "while", "do_end", 
                         "do_while", "if_start", "if_continuation", "if_final", 
                         "if", "switch_start", "switch_mid", "switch_default", 
                         "switch_case", "expr", "literal", "func_call", 
                         "calc", "mul", "mod", "pow", "bracket", "comparison", 
                         "true_id", "index" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = pseudocodeParser.ruleNames;
        this.literalNames = pseudocodeParser.literalNames;
        this.symbolicNames = pseudocodeParser.symbolicNames;
    }

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 19:
    	    		return this.expr_sempred(localctx, predIndex);
    	case 27:
    	    		return this.comparison_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    expr_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 0:
    			return this.precpred(this._ctx, 4);
    		case 1:
    			return this.precpred(this._ctx, 3);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };

    comparison_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 2:
    			return this.precpred(this._ctx, 2);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };




	program() {
	    let localctx = new ProgramContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, pseudocodeParser.RULE_program);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 72;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 335577352) !== 0) || ((((_la - 33)) & ~0x1f) === 0 && ((1 << (_la - 33)) & 57989) !== 0)) {
	            this.state = 70;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	            switch(la_) {
	            case 1:
	                this.state = 60;
	                this.stat();
	                break;

	            case 2:
	                this.state = 61;
	                this.func_dec();
	                break;

	            case 3:
	                this.state = 62;
	                this.func_call();
	                break;

	            case 4:
	                this.state = 63;
	                this.expr(0);
	                break;

	            case 5:
	                this.state = 64;
	                this.for_();
	                break;

	            case 6:
	                this.state = 65;
	                this.while_();
	                break;

	            case 7:
	                this.state = 66;
	                this.if_();
	                break;

	            case 8:
	                this.state = 67;
	                this.do_while();
	                break;

	            case 9:
	                this.state = 68;
	                this.switch_case();
	                break;

	            case 10:
	                this.state = 69;
	                this.true_id();
	                break;

	            }
	            this.state = 74;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 75;
	        this.match(pseudocodeParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	stat() {
	    let localctx = new StatContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, pseudocodeParser.RULE_stat);
	    try {
	        this.state = 85;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 77;
	            this.true_id();
	            this.state = 78;
	            this.match(pseudocodeParser.EQ);
	            this.state = 79;
	            this.expr(0);
	            this.state = 80;
	            this.match(pseudocodeParser.NEWLINE);
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 82;
	            this.expr(0);
	            this.state = 83;
	            this.match(pseudocodeParser.NEWLINE);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	def() {
	    let localctx = new DefContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, pseudocodeParser.RULE_def);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 87;
	        this.match(pseudocodeParser.ID);
	        this.state = 88;
	        this.match(pseudocodeParser.LPAREN);
	        this.state = 99;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===48) {
	            this.state = 89;
	            this.match(pseudocodeParser.ID);
	            this.state = 94;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===6) {
	                this.state = 90;
	                this.match(pseudocodeParser.COMMA);
	                this.state = 91;
	                this.match(pseudocodeParser.ID);
	                this.state = 96;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 101;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 102;
	        this.match(pseudocodeParser.RPAREN);
	        this.state = 103;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	closure() {
	    let localctx = new ClosureContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, pseudocodeParser.RULE_closure);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 113;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 268468488) !== 0) || ((((_la - 33)) & ~0x1f) === 0 && ((1 << (_la - 33)) & 57989) !== 0)) {
	            this.state = 111;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 3:
	            case 8:
	            case 15:
	            case 46:
	            case 47:
	            case 48:
	                this.state = 105;
	                this.stat();
	                break;
	            case 28:
	                this.state = 106;
	                this.for_();
	                break;
	            case 33:
	                this.state = 107;
	                this.while_();
	                break;
	            case 35:
	                this.state = 108;
	                this.if_();
	                break;
	            case 40:
	                this.state = 109;
	                this.do_while();
	                break;
	            case 42:
	                this.state = 110;
	                this.switch_case();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 115;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	func_dec() {
	    let localctx = new Func_decContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, pseudocodeParser.RULE_func_dec);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 116;
	        this.match(pseudocodeParser.FUNCKW);
	        this.state = 117;
	        this.def();
	        this.state = 118;
	        this.closure();
	        this.state = 119;
	        this.match(pseudocodeParser.ENDFUNCKW);
	        this.state = 120;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	for_start() {
	    let localctx = new For_startContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, pseudocodeParser.RULE_for_start);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 122;
	        this.match(pseudocodeParser.FOR);
	        this.state = 123;
	        this.true_id();
	        this.state = 124;
	        this.match(pseudocodeParser.EQ);
	        this.state = 125;
	        this.expr(0);
	        this.state = 126;
	        this.match(pseudocodeParser.TO);
	        this.state = 127;
	        this.expr(0);
	        this.state = 128;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	for_() {
	    let localctx = new ForContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, pseudocodeParser.RULE_for);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 130;
	        this.for_start();
	        this.state = 131;
	        this.closure();
	        this.state = 132;
	        this.match(pseudocodeParser.NEXT);
	        this.state = 133;
	        this.true_id();
	        this.state = 134;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	while_start() {
	    let localctx = new While_startContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, pseudocodeParser.RULE_while_start);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 136;
	        this.match(pseudocodeParser.WHILE);
	        this.state = 137;
	        this.expr(0);
	        this.state = 138;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	while_() {
	    let localctx = new WhileContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, pseudocodeParser.RULE_while);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 140;
	        this.while_start();
	        this.state = 141;
	        this.closure();
	        this.state = 142;
	        this.match(pseudocodeParser.ENDWHILE);
	        this.state = 143;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	do_end() {
	    let localctx = new Do_endContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, pseudocodeParser.RULE_do_end);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 145;
	        this.match(pseudocodeParser.UNTIL);
	        this.state = 146;
	        this.expr(0);
	        this.state = 147;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	do_while() {
	    let localctx = new Do_whileContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, pseudocodeParser.RULE_do_while);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 149;
	        this.match(pseudocodeParser.DO);
	        this.state = 150;
	        this.match(pseudocodeParser.NEWLINE);
	        this.state = 151;
	        this.closure();
	        this.state = 152;
	        this.do_end();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	if_start() {
	    let localctx = new If_startContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, pseudocodeParser.RULE_if_start);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 154;
	        this.match(pseudocodeParser.IF);
	        this.state = 155;
	        this.expr(0);
	        this.state = 156;
	        this.match(pseudocodeParser.THEN);
	        this.state = 157;
	        this.match(pseudocodeParser.NEWLINE);
	        this.state = 158;
	        this.closure();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	if_continuation() {
	    let localctx = new If_continuationContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, pseudocodeParser.RULE_if_continuation);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 160;
	        this.match(pseudocodeParser.ELSEIF);
	        this.state = 161;
	        this.expr(0);
	        this.state = 162;
	        this.match(pseudocodeParser.THEN);
	        this.state = 163;
	        this.match(pseudocodeParser.NEWLINE);
	        this.state = 164;
	        this.closure();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	if_final() {
	    let localctx = new If_finalContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 26, pseudocodeParser.RULE_if_final);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 166;
	        this.match(pseudocodeParser.ELSE);
	        this.state = 167;
	        this.match(pseudocodeParser.NEWLINE);
	        this.state = 168;
	        this.closure();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	if_() {
	    let localctx = new IfContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 28, pseudocodeParser.RULE_if);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 170;
	        this.if_start();
	        this.state = 174;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===37) {
	            this.state = 171;
	            this.if_continuation();
	            this.state = 176;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 178;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===38) {
	            this.state = 177;
	            this.if_final();
	        }

	        this.state = 180;
	        this.match(pseudocodeParser.ENDIF);
	        this.state = 181;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	switch_start() {
	    let localctx = new Switch_startContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 30, pseudocodeParser.RULE_switch_start);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 183;
	        this.match(pseudocodeParser.SWITCH);
	        this.state = 184;
	        this.true_id();
	        this.state = 185;
	        this.match(pseudocodeParser.COLON);
	        this.state = 186;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	switch_mid() {
	    let localctx = new Switch_midContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 32, pseudocodeParser.RULE_switch_mid);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 188;
	        this.match(pseudocodeParser.CASE);
	        this.state = 189;
	        this.literal();
	        this.state = 190;
	        this.match(pseudocodeParser.COLON);
	        this.state = 191;
	        this.match(pseudocodeParser.NEWLINE);
	        this.state = 192;
	        this.closure();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	switch_default() {
	    let localctx = new Switch_defaultContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 34, pseudocodeParser.RULE_switch_default);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 194;
	        this.match(pseudocodeParser.DEFAULT);
	        this.state = 195;
	        this.match(pseudocodeParser.COLON);
	        this.state = 196;
	        this.match(pseudocodeParser.NEWLINE);
	        this.state = 197;
	        this.closure();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	switch_case() {
	    let localctx = new Switch_caseContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 36, pseudocodeParser.RULE_switch_case);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 199;
	        this.switch_start();
	        this.state = 203;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===43) {
	            this.state = 200;
	            this.switch_mid();
	            this.state = 205;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 207;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===44) {
	            this.state = 206;
	            this.switch_default();
	        }

	        this.state = 209;
	        this.match(pseudocodeParser.ENDSWITCH);
	        this.state = 210;
	        this.match(pseudocodeParser.NEWLINE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	expr(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new ExprContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 38;
	    this.enterRecursionRule(localctx, 38, pseudocodeParser.RULE_expr, _p);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 221;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,11,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 213;
	            this.literal();
	            break;

	        case 2:
	            this.state = 214;
	            this.match(pseudocodeParser.ID);
	            break;

	        case 3:
	            this.state = 215;
	            this.calc();
	            break;

	        case 4:
	            this.state = 216;
	            this.func_call();
	            break;

	        case 5:
	            this.state = 217;
	            this.match(pseudocodeParser.NOT);
	            this.state = 218;
	            this.expr(5);
	            break;

	        case 6:
	            this.state = 219;
	            this.comparison(0);
	            break;

	        case 7:
	            this.state = 220;
	            this.true_id();
	            break;

	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 231;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,13,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 229;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new ExprContext(this, _parentctx, _parentState);
	                    this.pushNewRecursionContext(localctx, _startState, pseudocodeParser.RULE_expr);
	                    this.state = 223;
	                    if (!( this.precpred(this._ctx, 4))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
	                    }
	                    this.state = 224;
	                    this.match(pseudocodeParser.AND);
	                    this.state = 225;
	                    this.expr(5);
	                    break;

	                case 2:
	                    localctx = new ExprContext(this, _parentctx, _parentState);
	                    this.pushNewRecursionContext(localctx, _startState, pseudocodeParser.RULE_expr);
	                    this.state = 226;
	                    if (!( this.precpred(this._ctx, 3))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
	                    }
	                    this.state = 227;
	                    this.match(pseudocodeParser.OR);
	                    this.state = 228;
	                    this.expr(4);
	                    break;

	                } 
	            }
	            this.state = 233;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,13,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}



	literal() {
	    let localctx = new LiteralContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 40, pseudocodeParser.RULE_literal);
	    try {
	        this.state = 237;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 48:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 234;
	            this.true_id();
	            break;
	        case 46:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 235;
	            this.match(pseudocodeParser.INT);
	            break;
	        case 47:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 236;
	            this.match(pseudocodeParser.STRING);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	func_call() {
	    let localctx = new Func_callContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 42, pseudocodeParser.RULE_func_call);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 239;
	        this.match(pseudocodeParser.ID);
	        this.state = 240;
	        this.match(pseudocodeParser.LPAREN);
	        this.state = 249;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 33032) !== 0) || ((((_la - 46)) & ~0x1f) === 0 && ((1 << (_la - 46)) & 7) !== 0)) {
	            this.state = 241;
	            this.expr(0);
	            this.state = 246;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===6) {
	                this.state = 242;
	                this.match(pseudocodeParser.COMMA);
	                this.state = 243;
	                this.expr(0);
	                this.state = 248;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 251;
	        this.match(pseudocodeParser.RPAREN);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	calc() {
	    let localctx = new CalcContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 44, pseudocodeParser.RULE_calc);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 253;
	        this.mul();
	        this.state = 258;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,17,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 254;
	                _la = this._input.LA(1);
	                if(!(_la===15 || _la===16)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 255;
	                this.mul(); 
	            }
	            this.state = 260;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,17,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	mul() {
	    let localctx = new MulContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 46, pseudocodeParser.RULE_mul);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 261;
	        this.mod();
	        this.state = 266;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,18,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 262;
	                _la = this._input.LA(1);
	                if(!(_la===17 || _la===18)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 263;
	                this.mod(); 
	            }
	            this.state = 268;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,18,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	mod() {
	    let localctx = new ModContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 48, pseudocodeParser.RULE_mod);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 269;
	        this.pow();
	        this.state = 274;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,19,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 270;
	                _la = this._input.LA(1);
	                if(!(_la===31 || _la===32)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 271;
	                this.pow(); 
	            }
	            this.state = 276;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,19,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	pow() {
	    let localctx = new PowContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 50, pseudocodeParser.RULE_pow);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 277;
	        this.bracket();
	        this.state = 280;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,20,this._ctx);
	        if(la_===1) {
	            this.state = 278;
	            this.match(pseudocodeParser.POW);
	            this.state = 279;
	            this.pow();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	bracket() {
	    let localctx = new BracketContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 52, pseudocodeParser.RULE_bracket);
	    try {
	        this.state = 290;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,21,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 282;
	            this.literal();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 283;
	            this.true_id();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 284;
	            this.match(pseudocodeParser.LPAREN);
	            this.state = 285;
	            this.calc();
	            this.state = 286;
	            this.match(pseudocodeParser.RPAREN);
	            break;

	        case 4:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 288;
	            this.match(pseudocodeParser.NEG);
	            this.state = 289;
	            this.mul();
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	comparison(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new ComparisonContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 54;
	    this.enterRecursionRule(localctx, 54, pseudocodeParser.RULE_comparison, _p);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 293;
	        this.calc();
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 304;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,23,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new ComparisonContext(this, _parentctx, _parentState);
	                this.pushNewRecursionContext(localctx, _startState, pseudocodeParser.RULE_comparison);
	                this.state = 295;
	                if (!( this.precpred(this._ctx, 2))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                }
	                this.state = 298; 
	                this._errHandler.sync(this);
	                var _alt = 1;
	                do {
	                	switch (_alt) {
	                	case 1:
	                		this.state = 296;
	                		_la = this._input.LA(1);
	                		if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 66060288) !== 0))) {
	                		this._errHandler.recoverInline(this);
	                		}
	                		else {
	                			this._errHandler.reportMatch(this);
	                		    this.consume();
	                		}
	                		this.state = 297;
	                		this.comparison(0);
	                		break;
	                	default:
	                		throw new antlr4.error.NoViableAltException(this);
	                	}
	                	this.state = 300; 
	                	this._errHandler.sync(this);
	                	_alt = this._interp.adaptivePredict(this._input,22, this._ctx);
	                } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER ); 
	            }
	            this.state = 306;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,23,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}



	true_id() {
	    let localctx = new True_idContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 56, pseudocodeParser.RULE_true_id);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 307;
	        this.match(pseudocodeParser.ID);
	        this.state = 311;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,24,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 308;
	                this.index(); 
	            }
	            this.state = 313;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,24,this._ctx);
	        }

	        this.state = 327;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,27,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 314;
	                this.match(pseudocodeParser.DOT);
	                this.state = 317;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,25,this._ctx);
	                switch(la_) {
	                case 1:
	                    this.state = 315;
	                    this.match(pseudocodeParser.ID);
	                    break;

	                case 2:
	                    this.state = 316;
	                    this.func_call();
	                    break;

	                }
	                this.state = 322;
	                this._errHandler.sync(this);
	                var _alt = this._interp.adaptivePredict(this._input,26,this._ctx)
	                while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	                    if(_alt===1) {
	                        this.state = 319;
	                        this.index(); 
	                    }
	                    this.state = 324;
	                    this._errHandler.sync(this);
	                    _alt = this._interp.adaptivePredict(this._input,26,this._ctx);
	                }
	         
	            }
	            this.state = 329;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,27,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	index() {
	    let localctx = new IndexContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 58, pseudocodeParser.RULE_index);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 330;
	        this.match(pseudocodeParser.LSQ);
	        this.state = 331;
	        this.match(pseudocodeParser.INT);
	        this.state = 336;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===6) {
	            this.state = 332;
	            this.match(pseudocodeParser.COMMA);
	            this.state = 333;
	            this.match(pseudocodeParser.INT);
	            this.state = 338;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 339;
	        this.match(pseudocodeParser.RSQ);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

pseudocodeParser.EOF = antlr4.Token.EOF;
pseudocodeParser.AND = 1;
pseudocodeParser.OR = 2;
pseudocodeParser.NOT = 3;
pseudocodeParser.EQ = 4;
pseudocodeParser.DOT = 5;
pseudocodeParser.COMMA = 6;
pseudocodeParser.SEMI = 7;
pseudocodeParser.LPAREN = 8;
pseudocodeParser.RPAREN = 9;
pseudocodeParser.LCURLY = 10;
pseudocodeParser.RCURLY = 11;
pseudocodeParser.LSQ = 12;
pseudocodeParser.RSQ = 13;
pseudocodeParser.COLON = 14;
pseudocodeParser.NEG = 15;
pseudocodeParser.PLUS = 16;
pseudocodeParser.MUL = 17;
pseudocodeParser.DIV = 18;
pseudocodeParser.POW = 19;
pseudocodeParser.LT = 20;
pseudocodeParser.GT = 21;
pseudocodeParser.LTE = 22;
pseudocodeParser.GTE = 23;
pseudocodeParser.EE = 24;
pseudocodeParser.NE = 25;
pseudocodeParser.FUNCKW = 26;
pseudocodeParser.ENDFUNCKW = 27;
pseudocodeParser.FOR = 28;
pseudocodeParser.TO = 29;
pseudocodeParser.NEXT = 30;
pseudocodeParser.MODKW = 31;
pseudocodeParser.DIVKW = 32;
pseudocodeParser.WHILE = 33;
pseudocodeParser.ENDWHILE = 34;
pseudocodeParser.IF = 35;
pseudocodeParser.THEN = 36;
pseudocodeParser.ELSEIF = 37;
pseudocodeParser.ELSE = 38;
pseudocodeParser.ENDIF = 39;
pseudocodeParser.DO = 40;
pseudocodeParser.UNTIL = 41;
pseudocodeParser.SWITCH = 42;
pseudocodeParser.CASE = 43;
pseudocodeParser.DEFAULT = 44;
pseudocodeParser.ENDSWITCH = 45;
pseudocodeParser.INT = 46;
pseudocodeParser.STRING = 47;
pseudocodeParser.ID = 48;
pseudocodeParser.NEWLINE = 49;
pseudocodeParser.WS = 50;

pseudocodeParser.RULE_program = 0;
pseudocodeParser.RULE_stat = 1;
pseudocodeParser.RULE_def = 2;
pseudocodeParser.RULE_closure = 3;
pseudocodeParser.RULE_func_dec = 4;
pseudocodeParser.RULE_for_start = 5;
pseudocodeParser.RULE_for = 6;
pseudocodeParser.RULE_while_start = 7;
pseudocodeParser.RULE_while = 8;
pseudocodeParser.RULE_do_end = 9;
pseudocodeParser.RULE_do_while = 10;
pseudocodeParser.RULE_if_start = 11;
pseudocodeParser.RULE_if_continuation = 12;
pseudocodeParser.RULE_if_final = 13;
pseudocodeParser.RULE_if = 14;
pseudocodeParser.RULE_switch_start = 15;
pseudocodeParser.RULE_switch_mid = 16;
pseudocodeParser.RULE_switch_default = 17;
pseudocodeParser.RULE_switch_case = 18;
pseudocodeParser.RULE_expr = 19;
pseudocodeParser.RULE_literal = 20;
pseudocodeParser.RULE_func_call = 21;
pseudocodeParser.RULE_calc = 22;
pseudocodeParser.RULE_mul = 23;
pseudocodeParser.RULE_mod = 24;
pseudocodeParser.RULE_pow = 25;
pseudocodeParser.RULE_bracket = 26;
pseudocodeParser.RULE_comparison = 27;
pseudocodeParser.RULE_true_id = 28;
pseudocodeParser.RULE_index = 29;

class ProgramContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_program;
    }

	EOF() {
	    return this.getToken(pseudocodeParser.EOF, 0);
	};

	stat = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatContext);
	    } else {
	        return this.getTypedRuleContext(StatContext,i);
	    }
	};

	func_dec = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Func_decContext);
	    } else {
	        return this.getTypedRuleContext(Func_decContext,i);
	    }
	};

	func_call = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Func_callContext);
	    } else {
	        return this.getTypedRuleContext(Func_callContext,i);
	    }
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	for_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ForContext);
	    } else {
	        return this.getTypedRuleContext(ForContext,i);
	    }
	};

	while_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(WhileContext);
	    } else {
	        return this.getTypedRuleContext(WhileContext,i);
	    }
	};

	if_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(IfContext);
	    } else {
	        return this.getTypedRuleContext(IfContext,i);
	    }
	};

	do_while = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Do_whileContext);
	    } else {
	        return this.getTypedRuleContext(Do_whileContext,i);
	    }
	};

	switch_case = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Switch_caseContext);
	    } else {
	        return this.getTypedRuleContext(Switch_caseContext,i);
	    }
	};

	true_id = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(True_idContext);
	    } else {
	        return this.getTypedRuleContext(True_idContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterProgram(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitProgram(this);
		}
	}


}



class StatContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_stat;
    }

	true_id() {
	    return this.getTypedRuleContext(True_idContext,0);
	};

	EQ() {
	    return this.getToken(pseudocodeParser.EQ, 0);
	};

	expr() {
	    return this.getTypedRuleContext(ExprContext,0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterStat(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitStat(this);
		}
	}


}



class DefContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_def;
    }

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.ID);
	    } else {
	        return this.getToken(pseudocodeParser.ID, i);
	    }
	};


	LPAREN() {
	    return this.getToken(pseudocodeParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(pseudocodeParser.RPAREN, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.COMMA);
	    } else {
	        return this.getToken(pseudocodeParser.COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterDef(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitDef(this);
		}
	}


}



class ClosureContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_closure;
    }

	stat = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatContext);
	    } else {
	        return this.getTypedRuleContext(StatContext,i);
	    }
	};

	for_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ForContext);
	    } else {
	        return this.getTypedRuleContext(ForContext,i);
	    }
	};

	while_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(WhileContext);
	    } else {
	        return this.getTypedRuleContext(WhileContext,i);
	    }
	};

	if_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(IfContext);
	    } else {
	        return this.getTypedRuleContext(IfContext,i);
	    }
	};

	do_while = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Do_whileContext);
	    } else {
	        return this.getTypedRuleContext(Do_whileContext,i);
	    }
	};

	switch_case = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Switch_caseContext);
	    } else {
	        return this.getTypedRuleContext(Switch_caseContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterClosure(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitClosure(this);
		}
	}


}



class Func_decContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_func_dec;
    }

	FUNCKW() {
	    return this.getToken(pseudocodeParser.FUNCKW, 0);
	};

	def() {
	    return this.getTypedRuleContext(DefContext,0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	ENDFUNCKW() {
	    return this.getToken(pseudocodeParser.ENDFUNCKW, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterFunc_dec(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitFunc_dec(this);
		}
	}


}



class For_startContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_for_start;
    }

	FOR() {
	    return this.getToken(pseudocodeParser.FOR, 0);
	};

	true_id() {
	    return this.getTypedRuleContext(True_idContext,0);
	};

	EQ() {
	    return this.getToken(pseudocodeParser.EQ, 0);
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	TO() {
	    return this.getToken(pseudocodeParser.TO, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterFor_start(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitFor_start(this);
		}
	}


}



class ForContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_for;
    }

	for_start() {
	    return this.getTypedRuleContext(For_startContext,0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	NEXT() {
	    return this.getToken(pseudocodeParser.NEXT, 0);
	};

	true_id() {
	    return this.getTypedRuleContext(True_idContext,0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterFor(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitFor(this);
		}
	}


}



class While_startContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_while_start;
    }

	WHILE() {
	    return this.getToken(pseudocodeParser.WHILE, 0);
	};

	expr() {
	    return this.getTypedRuleContext(ExprContext,0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterWhile_start(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitWhile_start(this);
		}
	}


}



class WhileContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_while;
    }

	while_start() {
	    return this.getTypedRuleContext(While_startContext,0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	ENDWHILE() {
	    return this.getToken(pseudocodeParser.ENDWHILE, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterWhile(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitWhile(this);
		}
	}


}



class Do_endContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_do_end;
    }

	UNTIL() {
	    return this.getToken(pseudocodeParser.UNTIL, 0);
	};

	expr() {
	    return this.getTypedRuleContext(ExprContext,0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterDo_end(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitDo_end(this);
		}
	}


}



class Do_whileContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_do_while;
    }

	DO() {
	    return this.getToken(pseudocodeParser.DO, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	do_end() {
	    return this.getTypedRuleContext(Do_endContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterDo_while(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitDo_while(this);
		}
	}


}



class If_startContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_if_start;
    }

	IF() {
	    return this.getToken(pseudocodeParser.IF, 0);
	};

	expr() {
	    return this.getTypedRuleContext(ExprContext,0);
	};

	THEN() {
	    return this.getToken(pseudocodeParser.THEN, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterIf_start(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitIf_start(this);
		}
	}


}



class If_continuationContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_if_continuation;
    }

	ELSEIF() {
	    return this.getToken(pseudocodeParser.ELSEIF, 0);
	};

	expr() {
	    return this.getTypedRuleContext(ExprContext,0);
	};

	THEN() {
	    return this.getToken(pseudocodeParser.THEN, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterIf_continuation(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitIf_continuation(this);
		}
	}


}



class If_finalContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_if_final;
    }

	ELSE() {
	    return this.getToken(pseudocodeParser.ELSE, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterIf_final(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitIf_final(this);
		}
	}


}



class IfContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_if;
    }

	if_start() {
	    return this.getTypedRuleContext(If_startContext,0);
	};

	ENDIF() {
	    return this.getToken(pseudocodeParser.ENDIF, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	if_continuation = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(If_continuationContext);
	    } else {
	        return this.getTypedRuleContext(If_continuationContext,i);
	    }
	};

	if_final() {
	    return this.getTypedRuleContext(If_finalContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterIf(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitIf(this);
		}
	}


}



class Switch_startContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_switch_start;
    }

	SWITCH() {
	    return this.getToken(pseudocodeParser.SWITCH, 0);
	};

	true_id() {
	    return this.getTypedRuleContext(True_idContext,0);
	};

	COLON() {
	    return this.getToken(pseudocodeParser.COLON, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterSwitch_start(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitSwitch_start(this);
		}
	}


}



class Switch_midContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_switch_mid;
    }

	CASE() {
	    return this.getToken(pseudocodeParser.CASE, 0);
	};

	literal() {
	    return this.getTypedRuleContext(LiteralContext,0);
	};

	COLON() {
	    return this.getToken(pseudocodeParser.COLON, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterSwitch_mid(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitSwitch_mid(this);
		}
	}


}



class Switch_defaultContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_switch_default;
    }

	DEFAULT() {
	    return this.getToken(pseudocodeParser.DEFAULT, 0);
	};

	COLON() {
	    return this.getToken(pseudocodeParser.COLON, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	closure() {
	    return this.getTypedRuleContext(ClosureContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterSwitch_default(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitSwitch_default(this);
		}
	}


}



class Switch_caseContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_switch_case;
    }

	switch_start() {
	    return this.getTypedRuleContext(Switch_startContext,0);
	};

	ENDSWITCH() {
	    return this.getToken(pseudocodeParser.ENDSWITCH, 0);
	};

	NEWLINE() {
	    return this.getToken(pseudocodeParser.NEWLINE, 0);
	};

	switch_mid = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Switch_midContext);
	    } else {
	        return this.getTypedRuleContext(Switch_midContext,i);
	    }
	};

	switch_default() {
	    return this.getTypedRuleContext(Switch_defaultContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterSwitch_case(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitSwitch_case(this);
		}
	}


}



class ExprContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_expr;
    }

	literal() {
	    return this.getTypedRuleContext(LiteralContext,0);
	};

	ID() {
	    return this.getToken(pseudocodeParser.ID, 0);
	};

	calc() {
	    return this.getTypedRuleContext(CalcContext,0);
	};

	func_call() {
	    return this.getTypedRuleContext(Func_callContext,0);
	};

	NOT() {
	    return this.getToken(pseudocodeParser.NOT, 0);
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	comparison() {
	    return this.getTypedRuleContext(ComparisonContext,0);
	};

	true_id() {
	    return this.getTypedRuleContext(True_idContext,0);
	};

	AND() {
	    return this.getToken(pseudocodeParser.AND, 0);
	};

	OR() {
	    return this.getToken(pseudocodeParser.OR, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitExpr(this);
		}
	}


}



class LiteralContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_literal;
    }

	true_id() {
	    return this.getTypedRuleContext(True_idContext,0);
	};

	INT() {
	    return this.getToken(pseudocodeParser.INT, 0);
	};

	STRING() {
	    return this.getToken(pseudocodeParser.STRING, 0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterLiteral(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitLiteral(this);
		}
	}


}



class Func_callContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_func_call;
    }

	ID() {
	    return this.getToken(pseudocodeParser.ID, 0);
	};

	LPAREN() {
	    return this.getToken(pseudocodeParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(pseudocodeParser.RPAREN, 0);
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.COMMA);
	    } else {
	        return this.getToken(pseudocodeParser.COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterFunc_call(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitFunc_call(this);
		}
	}


}



class CalcContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_calc;
    }

	mul = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(MulContext);
	    } else {
	        return this.getTypedRuleContext(MulContext,i);
	    }
	};

	PLUS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.PLUS);
	    } else {
	        return this.getToken(pseudocodeParser.PLUS, i);
	    }
	};


	NEG = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.NEG);
	    } else {
	        return this.getToken(pseudocodeParser.NEG, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterCalc(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitCalc(this);
		}
	}


}



class MulContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_mul;
    }

	mod = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ModContext);
	    } else {
	        return this.getTypedRuleContext(ModContext,i);
	    }
	};

	MUL = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.MUL);
	    } else {
	        return this.getToken(pseudocodeParser.MUL, i);
	    }
	};


	DIV = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.DIV);
	    } else {
	        return this.getToken(pseudocodeParser.DIV, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterMul(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitMul(this);
		}
	}


}



class ModContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_mod;
    }

	pow = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(PowContext);
	    } else {
	        return this.getTypedRuleContext(PowContext,i);
	    }
	};

	MODKW = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.MODKW);
	    } else {
	        return this.getToken(pseudocodeParser.MODKW, i);
	    }
	};


	DIVKW = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.DIVKW);
	    } else {
	        return this.getToken(pseudocodeParser.DIVKW, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterMod(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitMod(this);
		}
	}


}



class PowContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_pow;
    }

	bracket() {
	    return this.getTypedRuleContext(BracketContext,0);
	};

	POW() {
	    return this.getToken(pseudocodeParser.POW, 0);
	};

	pow() {
	    return this.getTypedRuleContext(PowContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterPow(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitPow(this);
		}
	}


}



class BracketContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_bracket;
    }

	literal() {
	    return this.getTypedRuleContext(LiteralContext,0);
	};

	true_id() {
	    return this.getTypedRuleContext(True_idContext,0);
	};

	LPAREN() {
	    return this.getToken(pseudocodeParser.LPAREN, 0);
	};

	calc() {
	    return this.getTypedRuleContext(CalcContext,0);
	};

	RPAREN() {
	    return this.getToken(pseudocodeParser.RPAREN, 0);
	};

	NEG() {
	    return this.getToken(pseudocodeParser.NEG, 0);
	};

	mul() {
	    return this.getTypedRuleContext(MulContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterBracket(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitBracket(this);
		}
	}


}



class ComparisonContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_comparison;
    }

	calc() {
	    return this.getTypedRuleContext(CalcContext,0);
	};

	comparison = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ComparisonContext);
	    } else {
	        return this.getTypedRuleContext(ComparisonContext,i);
	    }
	};

	LT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.LT);
	    } else {
	        return this.getToken(pseudocodeParser.LT, i);
	    }
	};


	GT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.GT);
	    } else {
	        return this.getToken(pseudocodeParser.GT, i);
	    }
	};


	LTE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.LTE);
	    } else {
	        return this.getToken(pseudocodeParser.LTE, i);
	    }
	};


	GTE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.GTE);
	    } else {
	        return this.getToken(pseudocodeParser.GTE, i);
	    }
	};


	EE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.EE);
	    } else {
	        return this.getToken(pseudocodeParser.EE, i);
	    }
	};


	NE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.NE);
	    } else {
	        return this.getToken(pseudocodeParser.NE, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterComparison(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitComparison(this);
		}
	}


}



class True_idContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_true_id;
    }

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.ID);
	    } else {
	        return this.getToken(pseudocodeParser.ID, i);
	    }
	};


	index = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(IndexContext);
	    } else {
	        return this.getTypedRuleContext(IndexContext,i);
	    }
	};

	DOT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.DOT);
	    } else {
	        return this.getToken(pseudocodeParser.DOT, i);
	    }
	};


	func_call = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Func_callContext);
	    } else {
	        return this.getTypedRuleContext(Func_callContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterTrue_id(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitTrue_id(this);
		}
	}


}



class IndexContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = pseudocodeParser.RULE_index;
    }

	LSQ() {
	    return this.getToken(pseudocodeParser.LSQ, 0);
	};

	INT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.INT);
	    } else {
	        return this.getToken(pseudocodeParser.INT, i);
	    }
	};


	RSQ() {
	    return this.getToken(pseudocodeParser.RSQ, 0);
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(pseudocodeParser.COMMA);
	    } else {
	        return this.getToken(pseudocodeParser.COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.enterIndex(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof pseudocodeListener ) {
	        listener.exitIndex(this);
		}
	}


}




pseudocodeParser.ProgramContext = ProgramContext; 
pseudocodeParser.StatContext = StatContext; 
pseudocodeParser.DefContext = DefContext; 
pseudocodeParser.ClosureContext = ClosureContext; 
pseudocodeParser.Func_decContext = Func_decContext; 
pseudocodeParser.For_startContext = For_startContext; 
pseudocodeParser.ForContext = ForContext; 
pseudocodeParser.While_startContext = While_startContext; 
pseudocodeParser.WhileContext = WhileContext; 
pseudocodeParser.Do_endContext = Do_endContext; 
pseudocodeParser.Do_whileContext = Do_whileContext; 
pseudocodeParser.If_startContext = If_startContext; 
pseudocodeParser.If_continuationContext = If_continuationContext; 
pseudocodeParser.If_finalContext = If_finalContext; 
pseudocodeParser.IfContext = IfContext; 
pseudocodeParser.Switch_startContext = Switch_startContext; 
pseudocodeParser.Switch_midContext = Switch_midContext; 
pseudocodeParser.Switch_defaultContext = Switch_defaultContext; 
pseudocodeParser.Switch_caseContext = Switch_caseContext; 
pseudocodeParser.ExprContext = ExprContext; 
pseudocodeParser.LiteralContext = LiteralContext; 
pseudocodeParser.Func_callContext = Func_callContext; 
pseudocodeParser.CalcContext = CalcContext; 
pseudocodeParser.MulContext = MulContext; 
pseudocodeParser.ModContext = ModContext; 
pseudocodeParser.PowContext = PowContext; 
pseudocodeParser.BracketContext = BracketContext; 
pseudocodeParser.ComparisonContext = ComparisonContext; 
pseudocodeParser.True_idContext = True_idContext; 
pseudocodeParser.IndexContext = IndexContext; 
