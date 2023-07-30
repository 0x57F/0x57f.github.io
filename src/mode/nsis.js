/*
  THIS FILE WAS AUTOGENERATED BY mode.tmpl.js
*/

"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var NSISHighlightRules = require("./nsis_highlight_rules").NSISHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = NSISHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = [";", "#"];
    this.blockComment = {start: "/*", end: "*/"};
    this.$id = "ace/mode/nsis";
}).call(Mode.prototype);

exports.Mode = Mode;
