!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){function n(e,n){var t=e.getRange(l(n.line,n.ch-1),l(n.line,n.ch+1));return 2==t.length?t:null}function t(n,t,r){var i=n.getLine(t.line),o=n.getTokenAt(t);if(/\bstring2?\b/.test(o.type))return!1;var a=new e.StringStream(i.slice(0,t.ch)+r+i.slice(t.ch),4);for(a.pos=a.start=o.start;;){var s=n.getMode().token(a,o.state);if(a.pos>=t.ch+1)return/\bstring2?\b/.test(s);a.start=a.pos}}function r(r){for(var i={name:"autoCloseBrackets",Backspace:function(t){if(t.getOption("disableInput"))return e.Pass;for(var i=t.listSelections(),o=0;o<i.length;o++){if(!i[o].empty())return e.Pass;var a=n(t,i[o].head);if(!a||r.indexOf(a)%2!=0)return e.Pass}for(var o=i.length-1;o>=0;o--){var s=i[o].head;t.replaceRange("",l(s.line,s.ch-1),l(s.line,s.ch+1))}}},o="",a=0;a<r.length;a+=2)(function(n,r){n!=r&&(o+=r),i["'"+n+"'"]=function(i){if(i.getOption("disableInput"))return e.Pass;for(var a,c,f=i.listSelections(),u=0;u<f.length;u++){var h,g=f[u],d=g.head,c=i.getRange(d,l(d.line,d.ch+1));if(g.empty())if(n==r&&c==r)h=i.getRange(d,l(d.line,d.ch+3))==n+n+n?"skipThree":"skip";else if(n==r&&d.ch>1&&i.getRange(l(d.line,d.ch-2),d)==n+n&&(d.ch<=2||i.getRange(l(d.line,d.ch-3),l(d.line,d.ch-2))!=n))h="addFour";else if('"'==n||"'"==n){if(e.isWordChar(c)||!t(i,d,n))return e.Pass;h="both"}else{if(!(i.getLine(d.line).length==d.ch||o.indexOf(c)>=0||s.test(c)))return e.Pass;h="both"}else h="surround";if(a){if(a!=h)return e.Pass}else a=h}i.operation(function(){if("skip"==a)i.execCommand("goCharRight");else if("skipThree"==a)for(var e=0;3>e;e++)i.execCommand("goCharRight");else if("surround"==a){for(var t=i.getSelections(),e=0;e<t.length;e++)t[e]=n+t[e]+r;i.replaceSelections(t,"around")}else"both"==a?(i.replaceSelection(n+r,null),i.execCommand("goCharLeft")):"addFour"==a&&(i.replaceSelection(n+n+n+n,"before"),i.execCommand("goCharRight"))})},n!=r&&(i["'"+r+"'"]=function(n){for(var t=n.listSelections(),i=0;i<t.length;i++){var o=t[i];if(!o.empty()||n.getRange(o.head,l(o.head.line,o.head.ch+1))!=r)return e.Pass}n.execCommand("goCharRight")})})(r.charAt(a),r.charAt(a+1));return i}function i(t){return function(r){if(r.getOption("disableInput"))return e.Pass;for(var i=r.listSelections(),o=0;o<i.length;o++){if(!i[o].empty())return e.Pass;var a=n(r,i[o].head);if(!a||t.indexOf(a)%2!=0)return e.Pass}r.operation(function(){r.replaceSelection("\n\n",null),r.execCommand("goCharLeft"),i=r.listSelections();for(var e=0;e<i.length;e++){var n=i[e].head.line;r.indentLine(n,null,!0),r.indentLine(n+1,null,!0)}})}}var o="()[]{}''\"\"",a="[]{}",s=/\s/,l=e.Pos;e.defineOption("autoCloseBrackets",!1,function(n,t,s){if(s!=e.Init&&s&&n.removeKeyMap("autoCloseBrackets"),t){var l=o,c=a;"string"==typeof t?l=t:"object"==typeof t&&(null!=t.pairs&&(l=t.pairs),null!=t.explode&&(c=t.explode));var f=r(l);c&&(f.Enter=i(c)),n.addKeyMap(f)}})});