!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror"),require("./foldcode")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","./foldcode"],t):t(CodeMirror)}(function(t){"use strict";function o(t){this.options=t,this.from=this.to=0}function e(t){return t===!0&&(t={}),null==t.gutter&&(t.gutter="CodeMirror-foldgutter"),null==t.indicatorOpen&&(t.indicatorOpen="CodeMirror-foldgutter-open"),null==t.indicatorFolded&&(t.indicatorFolded="CodeMirror-foldgutter-folded"),t}function r(t,o){for(var e=t.findMarksAt(c(o)),r=0;r<e.length;++r)if(e[r].__isFold&&e[r].find().from.line==o)return!0}function n(t){if("string"==typeof t){var o=document.createElement("div");return o.className=t+" CodeMirror-guttermarker-subtle",o}return t.cloneNode(!0)}function i(o,e,i){var f=o.state.foldGutter.options,d=e;o.eachLine(e,i,function(e){var i=null;if(r(o,d))i=n(f.indicatorFolded);else{var u=c(d,0),a=f.rangeFinder||t.fold.auto,l=a&&a(o,u);l&&l.from.line+1<l.to.line&&(i=n(f.indicatorOpen))}o.setGutterMarker(e,f.gutter,i),++d})}function f(t){var o=t.getViewport(),e=t.state.foldGutter;e&&(t.operation(function(){i(t,o.from,o.to)}),e.from=o.from,e.to=o.to)}function d(t,o,e){var r=t.state.foldGutter.options;e==r.gutter&&t.foldCode(c(o,0),r.rangeFinder)}function u(t){var o=t.state.foldGutter,e=t.state.foldGutter.options;o.from=o.to=0,clearTimeout(o.changeUpdate),o.changeUpdate=setTimeout(function(){f(t)},e.foldOnChangeTimeSpan||600)}function a(t){var o=t.state.foldGutter,e=t.state.foldGutter.options;clearTimeout(o.changeUpdate),o.changeUpdate=setTimeout(function(){var e=t.getViewport();o.from==o.to||e.from-o.to>20||o.from-e.to>20?f(t):t.operation(function(){e.from<o.from&&(i(t,e.from,o.from),o.from=e.from),e.to>o.to&&(i(t,o.to,e.to),o.to=e.to)})},e.updateViewportTimeSpan||400)}function l(t,o){var e=t.state.foldGutter,r=o.line;r>=e.from&&r<e.to&&i(t,r,r+1)}t.defineOption("foldGutter",!1,function(r,n,i){i&&i!=t.Init&&(r.clearGutter(r.state.foldGutter.options.gutter),r.state.foldGutter=null,r.off("gutterClick",d),r.off("change",u),r.off("viewportChange",a),r.off("fold",l),r.off("unfold",l),r.off("swapDoc",f)),n&&(r.state.foldGutter=new o(e(n)),f(r),r.on("gutterClick",d),r.on("change",u),r.on("viewportChange",a),r.on("fold",l),r.on("unfold",l),r.on("swapDoc",f))});var c=t.Pos});