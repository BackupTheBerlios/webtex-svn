/*
Real Time Syntax Highlighting JS - RTSHJS v0.83

You can use and modify this code as you want. 
Just keep my credits somewhere around. Thanks.

Fernando M.A.d.S. - fermads@gmail.com

http://syntaxhighlighting.blogspot.com/2006/08/real-time-syntax-highlighting.html
*/

RTSH = {
	range : null,
	language : null,
	maxSuggest : 0,
	suggest : 0,
	suggVisible : false,
		
	// set initial vars and start sh
	initialize : function() {
		this.detect();
		chars = '|13|32|191|57|48|187|188|'; // charcodes that trigger syntax highlighting
		cc = '&shy;'; // control char
		if(browser.ff) {
			editor = document.getElementById('ffedt');
			document.designMode = 'on';
			document.addEventListener('keydown', this.keyHandler, true);
			document.addEventListener('keypress', this.keySuperHandler, true);
			document.addEventListener('mousedown', this.mouseClick, true);
			document.body.focus();
		}
		else if(browser.ie) {
			editor = document.getElementById('ieedt');
			editor.contentEditable = 'true';
			document.onkeydown = this.keyHandler;
		}
		else {
			// TODO: textarea without syntax highlighting for non supported browsers
			alert('your browser is not supported at the moment');
			return;
		}
		this.syntaxHighlight(1);
		window.scroll(0,0);
	},
	
	mouseClick : function(evt) {
		if (RTSH.suggVisible) {
			var newSelect = false;
			var suggest = document.getElementById("suggest");
			var boxY = suggest.offsetTop;
			var boxX = suggest.offsetLeft;
			var boxWidth = suggest.offsetWidth - 18;
			var boxEnd = boxX + suggest.offsetWidth;
			var boxEndShort = boxEnd - 18;
			var mouseX = evt.pageX - boxX;
			var mouseY = evt.pageY - boxY;
			if (mouseX >= 0 && mouseX <= boxWidth && mouseY >= 0 && mouseY <= suggest.offsetHeight) {
				for (var i = 0; i < RTSH.maxSuggest; i++) {
					var sug = document.getElementById("sug_" + i);
					var sugY = sug.offsetTop;
					var sugYTop = sugY + sug.offsetHeight;
					if (mouseY >= sugY && mouseY < sugYTop) {
						document.getElementById("sug_" + i).className = "sug";
						RTSH.suggest = i;
						newSelect = true;
					} else {
						document.getElementById("sug_" + i).className = "nonsug";
					}
				}
			}
			if (newSelect) {
				if (evt.preventDefault) { 
				  evt.preventDefault(); 
				  evt.stopPropagation(); 
				} else {
				  evt.returnValue = false;
				  evt.cancelBubble = true;
				}
			} else if ((mouseX < 0 || mouseX > boxWidth + 18) || (mouseY < 0 || mouseY > suggest.offsetHeight))  {
				//RTSH.hideSuggestion();
			}
		}
	},

	// detect browser, for now IE and FF
	detect : function() {
		browser = { ie:false, ff:false };
		if(navigator.appName.indexOf("Microsoft") != -1) browser.ie = true;
		else if (navigator.appName == "Netscape") browser.ff = true;
	},
	
	wordbefore : function(innerHtml, caret_pos) {
		var str = "";
		caret_pos--;
		c = innerHtml.charAt(caret_pos);
		while (caret_pos >= 0
				&& c != '>'
				&& c != ' '
				&& c != '\n'
				&& c != '('
				&& c != ')'
				&& c != '<'
				&& c != '+'
				&& c != '-'
				&& c != '*') {
			str = c + str;
			caret_pos--;
			c = innerHtml.charAt(caret_pos);
		}
		return str;
	},
	
	getNewLines : function(str) {
		var nl = 0;
		while(str.indexOf("</P>") >= 0){
			nl++;
			i = str.indexOf("</P>");
			str = str.substring(i + 4, str.length);
		}
		return nl;
	},
	
	getSubWord : function() {	
		var innerHtml, caret_pos, top, left;
		if (document.selection) {
			editor = document.getElementById('ieedt');
			var range = document.selection.createRange();
			var insText = range.text;
			range.text = "$bla$";
			top = range.offsetTop+13;
			left = range.offsetLeft-42;
			var text = editor.innerText;
			var html = editor.innerHTML;
			var text_pos = text.indexOf("$bla$");
			caret_pos = html.indexOf("$bla$");	
			var newLines = RTSH.getNewLines(html.substring(0, caret_pos));
			innerHtml = html.replace("$bla$","");
			editor.innerHTML = innerHtml;
			range.move("character", text_pos + newLines); 
			range.select();
			inWidth = document.documentElement.clientWidth - 4;
		} else {
			editor = document.getElementById('ffedt');
			var newNode = document.createElement("caret");
			newNode.innerHTML = "";
			window.getSelection().getRangeAt(0).insertNode(newNode);
			top = newNode.offsetTop + 15;
			left = newNode.offsetLeft;
			var html = editor.innerHTML;
			caret_pos = html.indexOf("<caret></caret>");
			var range = document.createRange();
			range.selectNode(newNode);
			range.deleteContents();
			innerHtml = editor.innerHTML;
			inWidth = window.innerWidth - 25;
		}
		suggestt = document.getElementById('suggest');
		suggestt.style.top = top + "px";
		if (left > inWidth - 300) {
			suggestt.style.left = (inWidth - 300) + "px";
		} else {
			suggestt.style.left = left + "px";
		}
		suggestt.innerHTML = RTSH.findOptions(RTSH.wordbefore(innerHtml, caret_pos));
		RTSH.maxSuggest = 10;
		RTSH.suggest = 0;
		document.getElementById('sug_0').className = "sug";
		suggestt.style.visibility = "visible";
		RTSH.suggVisible = true;
	},
	
	/*hideSuggestion : function() {
		var sug = document.getElementById('suggest');
		sug.style.left = "-400px";
		sug.style.visibility = "hidden";
		RTSH.suggVisible = false;	
	},*/
	
	createSuggestion : function() {
		RTSH.getSubWord();
	},
	
	sugDown : function() {
		if (RTSH.suggVisible) {
			document.getElementById("sug_" + RTSH.suggest).className = "nonsug";
			RTSH.suggest++;
			if (RTSH.suggest > RTSH.maxSuggest) {
				RTSH.suggest = 0;	
			}
			document.getElementById("sug_" + RTSH.suggest).className = "sug";
		}
	},
	
	sugUp : function() {
		if (RTSH.suggVisible) {
			document.getElementById("sug_" + RTSH.suggest).className = "nonsug";
			RTSH.suggest--;
			if (RTSH.suggest < 0) {
				RTSH.suggest = RTSH.maxSuggest;	
			}
			document.getElementById("sug_" + RTSH.suggest).className = "sug";
		}
	},
	
	keySuperHandler : function(evt) {
		charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
		if ((charCode == 40 || charCode == 38) && RTSH.suggVisible) {
			if (evt.preventDefault) { 
			  evt.preventDefault(); 
			  evt.stopPropagation(); 
			} 
			else {
			  evt.returnValue = false;
			  evt.cancelBubble = true;
			}
		}
	},

	// treat key bindings
	keyHandler : function(evt) {
		evt = (evt) ? evt : (window.event) ? event : null;
	  	if(evt) {
	    	charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
			if (charCode == 40) {
				RTSH.sugDown();
				return true;
			} else if (charCode == 38) {
				RTSH.sugUp();
				return false;
			} else if (charCode == 32 && evt.ctrlKey) {
				RTSH.createSuggestion();	
			} else {
				//RTSH.hideSuggestion();
			}
		    if((chars.indexOf('|'+charCode+'|')!=-1) && (!evt.ctrlKey && !evt.altKey)) { // syntax highlighting
			 	RTSH.syntaxHighlight();
			  	RTSH.findString();
			}
			else if(charCode==46||charCode==8) { // save to history when delete or backspace pressed
			 	RTSH.actions.history[RTSH.actions.next()] = editor.innerHTML;
			}
			else if((charCode==90||charCode==89) && evt.ctrlKey) { // undo and redo
				(charCode==89||evt.shiftKey) ? RTSH.actions.redo() : RTSH.actions.undo() ;
				evt.returnValue = false;
				if(browser.ff)evt.preventDefault();
			}
			else if(charCode==86 && evt.ctrlKey)  { // paste
				// TODO: pasted text should be parsed and highlighted
			}
		}
	},

	// put cursor back to its original position after every parsing
	findString : function() {
		if(browser.ff) {
			if(self.find(cc))
				window.getSelection().getRangeAt(0).deleteContents();
		}
		else if(browser.ie) {
		    range = self.document.body.createTextRange();
			if(range.findText(cc)){
				range.select();
				range.text = '';
			}
		}
	},
	
	// syntax highlighting parser
	syntaxHighlight : function() {
		if(browser.ff) {
			//document.execCommand("inserthtml", false, cc); // crash firefox+linux?
			if(!arguments[0]) window.getSelection().getRangeAt(0).insertNode(document.createTextNode(cc));
			x = editor.innerHTML;
			i = x.indexOf("</div>") + 6;
			xdiv = x.substring(0,i);
			x = x.substr(i);
			x = x.replace(/<br>/g,'\n');
			x = x.replace(/<.*?>|<\/.*?>/g,''); 	
			x = x.replace(/\n/g,'<br>');			
		}
		else if(browser.ie) {
			xdiv = "";
			if(!arguments[0]) document.selection.createRange().text = cc;
			x = editor.innerHTML;
			x = x.replace(/<P>/g,'\n');
			x = x.replace(/<\/P>/g,'\r');
			x = x.replace(/<\/?.*?>/g,'');
			x = '<P>'+x;
			x = x.replace(/\n/g,'<P>');
			x = x.replace(/\r/g,'<\/P>');
			x = x.replace(/(<P>)+/,'<P>');
			x = x.replace(/<P><\/P>/g,'<P>&nbsp;<\/P>');			
		}

		for(i=0;i<languages[this.language].length;i++) 
			x = x.replace(languages[this.language][i],languages[this.language][i+1]);
		
		newInner = this.actions.history[this.actions.next()] = (browser.ff) ? x : '<pre>'+x+'</pre>' ;
		editor.innerHTML = xdiv + newInner;
	},

	// undo and redo methods
	actions : {
		pos : -1, // actual history position
		history : [], // history vector
		
		undo : function() {
			if(editor.innerHTML.indexOf(cc)==-1){
				if(browser.ff) window.getSelection().getRangeAt(0).insertNode(document.createTextNode(cc));
				else document.selection.createRange().text = cc;
			 	this.history[this.pos] = editor.innerHTML;
			}
			this.pos--;
			if(typeof(this.history[this.pos])=='undefined') this.pos++;
			editor.innerHTML = this.history[this.pos];
			RTSH.findString();
		},
		
		redo : function() {
			this.pos++;
			if(typeof(this.history[this.pos])=='undefined') this.pos--;
			editor.innerHTML = this.history[this.pos];
			RTSH.findString();
		},
		
		next : function() { // get next vector position and clean old ones
			if(this.pos>20) this.history[this.pos-21] = undefined;
			return ++this.pos;
		}
	},	
	
	// transform syntax highlighted code to original code
	plainText : function() {
		code = editor.innerHTML;
		code = code.replace(/<br>/gi,'\n');
		code = code.replace(/<\/p>/gi,'\r');
		code = code.replace(/<p>/gi,'\n');
		code = code.replace(/&nbsp;/gi,'');
		code = code.replace(/&shy;/gi,'');
		code = code.replace(/<.*?>/g,'');
		code = code.replace(/&lt;/g,'<');
		code = code.replace(/&gt;/g,'>');
		return code;
	},
	
	
	findOptions: function(wordPart){
		var innerDiv = "";
		var found = 0;
		for (var i = 0; i < commands.length; i++) {
			if (commands[i].indexOf(wordPart) == 0) {
				innerDiv += "<span id=\"sug_" + found + "\" class=\"nonsug\" >" + commands[i] + "</span><br/>";
				found++;
				}
			}
		return innerDiv;
	}
}

commands = [ //(not complete, e.g. subsection, ...)
"addcontentsline","addtocontents","addtocounter","address","addtolength","addvspace","alph","appendix","arabic","author",
"backslash","baselineskip","baselinestretch","begin","bf","bibitem","bigskip","boldmath",
"cal","caption","cdots","centering","chapter","circle","cite","cleardoublepage","clearpage","cline","closing",
"dashbox","date","ddots","documentclass","dotfill",
"em","end","ensuremath",
"fbox","flushbottom","fnsymbol","footnote","footnotemark","footnotesize","footnotetext","frac","frame","framebox","frenchspacing",
"hfill","hline","hrulefill","hspace","huge","Huge","hyphenation",
"include","includegraphics","includeonly","indent","input","it","item",
"kill",
"label","large","Large","LARGE","ldots","left","lefteqn","line","linebreak","linethickness","linewidth","location",
"makebox","maketitle","markboth","markright","mathcal","mathop","mbox","medskip","multicolumn","multiput",
"newcommand","newcounter","newenvironment","newfont","newlength","newline","newpage","newsavebox","newtheorem","nocite","noindent","nolinebreak","normalsize","nopagebreak","not",
"onecolumn","opening","oval","overbrace","overline",
"pagebreak","pagenumbering","pageref","pagestyle","par","parbox","parindent","parskip","phi","protect","providecommand","put",
"raggedbottom","raggedleft","raggedright","raisebox","ref","renewcommand","right","rm","roman","rule",
"savebox","section","sbox","sc","scriptsize","setcounter","setlength","settowidth","sf","shortstack","signature","sl","small","smallskip","sqrt","stackrel",
"tableofcontents","telephone","textwidth","textheight","thanks","thispagestyle","tiny","title","today","tt","twocolumn","typeout","typein",
"underbrace","underline","unitlength","usebox","usecounter","usepackage",
"value","vdots","vector","verb","vfill","vline","vphantom","vspace"]

// language specific regular expressions
// TODO: distribute languages into specific [language].js files
languages = { 
	java : [
	/([\"\'].*?[\"\'])/g,'<s>$1</s>', // strings
	/(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)([ \.\"\'\{\(;&<])/g,'<b>$1</b>$2', // reserved words
	/([^:])\/\/(.*?)(<br>|<\/P>)/g,'$1<i>//$2</i>$3', // comments
	/\/\*(.*?)\*\//g,'<i>/*$1*/</i>' // comments
],
	javascript : [
	/([\"\'].*?[\"\'])/g,'<s>$1</s>', // strings
	/(break|continue|do|for|new|this|void|case|default|else|function|return|typeof|while|if|label|switch|var|with|catch|boolean|int|try|false|throws|null|true|goto)([ \.\"\'\{\(\);,&<])/g,'<b>$1</b>$2', // reserved words
	/(alert|isNaN|parent|Array|parseFloat|parseInt|blur|clearTimeout|prompt|prototype|close|confirm|length|Date|location|scroll|Math|document|element|name|self|elements|setTimeout|navigator|status| String|escape|Number|submit|eval|Object|event|onblur|focus|onerror|onfocus|top|onload|toString|onunload|unescape|open|opener|valueOf|window)([ \.\"\'\{\(\);,&<])/g,'<u>$1</u>$2', // special words
//	/([&\|\\\/=!\[\]\(\)])([ \.\"\'\{\(;\xad&<])/g,'<em>$1</em>$2', // special chars;
	/([\(\){}\?\[\]])/g,'<em>$1</em>', // special chars;
	/([^:])\/\/(.*?)(<br>|<\/P>)/g,'$1<i>//$2</i>$3', // comments
	/\/\*(.*?)\*\//g,'<i>/*$1*/</i>' // comments
],
	php : [
	/(&lt;[^!\?]*?&gt;)/g,'<b>$1</b>', // all tags
	/(&lt;style.*?&gt;)(.*?)(&lt;\/style&gt;)/g,'<em>$1</em><em>$2</em><em>$3</em>', // style tags
	/(&lt;script.*?&gt;)(.*?)(&lt;\/script&gt;)/g,'<u>$1</u><u>$2</u><u>$3</u>', // script tags
	/([\"\'].*?[\"\'])/g,'<s>$1</s>', // strings
	/(&lt;\?.*?\?&gt;)/g,'<strong>$1</strong>', // bgcolor inside php tags	
	/(&lt;\?php|\?&gt;)/g,'<cite>$1</cite>', // php tags		
	/(\$.*?)([ \)\(\[\{\+\-\*\/&!\|%=;])/g,'<var>$1</var>$2',
	/(and|or|xor|__FILE__|exception|__LINE__|array|as|break|case|class|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|for|foreach|function|global|if|include|include_once|isset|list|new|print|require|require_once|return|static|switch|unset|use|var|while|__FUNCTION__|__CLASS__|__METHOD__|final|php_user_filter|interface|implements|extends|public|private|protected|abstract|clone|try|catch|throw|this)([ \.\"\'\{\(;&<])/g,'<ins>$1</ins>$2', // reserved words
	/([^:])\/\/(.*?)(<br>|<\/P>)/g,'$1<i>//$2</i>$3', // php comments
	/\/\*(.*?)\*\//g,'<i>/*$1*/</i>', // php comments
	/(&lt;!--.*?--&gt.)/g,'<big>$1</big>' // html comments 
],
	html : [
	/(&lt;[^!]*?&gt;)/g,'<b>$1</b>', // all tags
	/(&lt;style.*?&gt;)(.*?)(&lt;\/style&gt;)/g,'<em>$1</em><em>$2</em><em>$3</em>', // style tags
	/(&lt;script.*?&gt;)(.*?)(&lt;\/script&gt;)/g,'<u>$1</u><u>$2</u><u>$3</u>', // script tags
	/=(["'].*?["'])/g,'=<s>$1</s>', // atributes
	/(&lt;!--.*?--&gt.)/g,'<i>$1</i>' // comments 
],
	css : [
	/(\}|^)(.*?)(\{)/g,'$1<b>$2</b>$3', // tags, ids, classes, etc
	/([\{;])(.*?):/g,'$1<em>$2</em>:', // keys
//	/([\{\}:;])/g,'<u>$1</u>', // dividers // SHY BUG HERE !!!!!!!!!
	/([\"\'].*?[\"\'])/g,'<s>$1</s>', // strings
	/\/\*(.*?)\*\//g,'<i>/*$1*/</i>', // comments
],


tex : [
	/(\\)(addcontentsline|addtocontents|addtocounter|address|addtolength|addvspace|alph|appendix|arabic|author|backslash|baselineskip|baselinestretch|begin|bf|bibitem|bigskip|boldmath|cal|caption|cdots|centering|chapter|circle|cite|cleardoublepage|clearpage|cline|closing|dashbox|date|ddots|documentclass|dotfill|em|end|ensuremath|fbox|flushbottom|fnsymbol|footnote|footnotemark|footnotesize|footnotetext|frac|frame|framebox|frenchspacing|hfill|hline|hrulefill|hspace|huge|Huge|hyphenation|include|includegraphics|includeonly|indent|input|it|item|kill|label|large|Large|LARGE|ldots|left|lefteqn|line|linebreak|linethickness|linewidth|location|makebox|maketitle|markboth|markright|mathcal|mathop|mbox|medskip|multicolumn|multiput|newcommand|newcounter|newenvironment|newfont|newlength|newline|newpage|newsavebox|newtheorem|nocite|noindent|nolinebreak|normalsize|nopagebreak|not|onecolumn|opening|oval|overbrace|overline|pagebreak|pagenumbering|pageref|pagestyle|par|parbox|parindent|parskip|phi|protect|providecommand|put|raggedbottom|raggedleft|raggedright|raisebox|ref|renewcommand|right|rm|roman|rule|savebox|sbox|sc|scriptsize|section|setcounter|setlength|settowidth|sf|shortstack|signature|sl|small|smallskip|sqrt|stackrel|tableofcontents|telephone|textwidth|textheight|thanks|thispagestyle|tiny|title|today|tt|twocolumn|typeout|typein|underbrace|underline|unitlength|usebox|usecounter|usepackage|value|vdots|vector|verb|vfill|vline|vphantom|vspace)/g,'<s>$1$2</s>', // commands (not complete)
	/(\\)(pm|mp|times|div|cdot|ast|star|dagger|ddagger|amalg|cap|cup|uplus|sqcap|sqcup|vee|wedge|oplus|ominus|otimes|circ|bullet|diamond|lhd|rhd|unlhd|unrhd|oslash|odot|bigcirc|triangleleft|Diamond|bigtriangleup|bigtriangledown|Box|triangleright|setminus|wr|le|ge|neq|sim|ll|gg|doteq|simeq|subset|supset|approx|asymp|subseteq|supseteq|cong|smile|sqsubset|sqsupset|equiv|frown|sqsubseteq|sqsupseteq|propto|bowtie|in|ni|prec|succ|vdash|dashv|preceq|succeq|models|perp|parallel||mid|nmid|nleq|ngeq|nsim|ncong|nparallel|not\<|not\>|not\=|not|le|not|ge|not|sim|nless|ngtr|lneq|gneq|lnsim|lneqq|gneqq|alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|pi|varpi|rho|varrho|sigma|varsigma|tau|upsilon|phi|varphi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|gets|to|leftarrow|Leftarrow|rightarrow|Rightarrow|leftrightarrow|Leftrightarrow|mapsto|hookleftarrow|leftharpoonup|leftharpoondown|rightleftharpoons|longleftarrow|Longleftarrow|longrightarrow|Longrightarrow|longleftrightarrow|Longleftrightarrow|longmapsto|hookrightarrow|rightharpoonup|rightharpoondown|leadsto|uparrow|Uparrow|downarrow|Downarrow|updownarrow|Updownarrow|nearrow|searrow|swarrow|nwarrow|ldots|vdots|cdots|ddots|hat|check|dot|breve|acute|ddot|grave|tilde|mathring|bar|vec|infty|triangle|angle|aleph|hbar|imath|jmath|ell|wp|Re|Im|mho|prime|emptyset|nabla|surd|partial|top|bot|vdash|dashv|forall|exists|neg|flat|natural|sharp|backslash|Box|Diamond|clubsuit|diamondsuit|heartsuit|spadesuit|Join|blacksquare|\{|\}|\||backslash|lfloor|rfloor|lceil|rceil|langle|rangle|left|right|uparrow|downarrow|updownarrow|Uparrow|Downarrow|Updownarrow|sum|int|oint|prod|coprod|bigcap|bigcup|bigsqcup|bigvee|bigwedge|bigodot|bigotimes|bigoplus|biguplus)/g,'<s>$1$2</s>', // math syntax (probably complete)
	/(\{)(.*?)(\})/g,'<c>$1</c>$2<c>$3</c>',//curly brackets
	/(\[.*?\])/g,'<d>$1</d>',//brackets
	/(\$)/g,'<c>$1</c>',
	/(\\)/g,'<s>$1</s>',
	/(%.*?)(\ )/g,'<d>$1</d>$2'//comments
],
	text : [
	// do nothing, as expected
] }

onload = function() {
	RTSH.initialize();
}
