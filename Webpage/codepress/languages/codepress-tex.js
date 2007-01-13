/*
 * CodePress regular expressions for Tex syntax highlighting
 */
 
syntax =  [
	/(\\\\)/g,'<s>$1</s>',
	/(\\)(addcontentsline|addtocontents|addtocounter|address|addtolength|addvspace|alph|appendix|arabic|author|backslash|baselineskip|baselinestretch|begin|bf|bibitem|bigskip|boldmath|cal|caption|cdots|centering|chapter|circle|cite|cleardoublepage|clearpage|cline|closing|dashbox|date|ddots|documentclass|dotfill|em|end|ensuremath|fbox|flushbottom|fnsymbol|footnote|footnotemark|footnotesize|footnotetext|frac|frame|framebox|frenchspacing|hfill|hline|hrulefill|hspace|huge|Huge|hyphenation|include|includegraphics|includeonly|indent|input|it|item|kill|label|large|Large|LARGE|ldots|left|lefteqn|line|linebreak|linethickness|linewidth|location|makebox|maketitle|markboth|markright|mathcal|mathop|mbox|medskip|multicolumn|multiput|newcommand|newcounter|newenvironment|newfont|newlength|newline|newpage|newsavebox|newtheorem|nocite|noindent|nolinebreak|normalsize|nopagebreak|not|onecolumn|opening|oval|overbrace|overline|pagebreak|pagenumbering|pageref|pagestyle|par|parbox|parindent|parskip|phi|protect|providecommand|put|raggedbottom|raggedleft|raggedright|raisebox|ref|renewcommand|right|rm|roman|rule|savebox|sbox|sc|scriptsize|section|setcounter|setlength|settowidth|sf|shortstack|signature|sl|small|smallskip|sqrt|stackrel|tableofcontents|telephone|textwidth|textheight|thanks|thispagestyle|tiny|title|today|tt|twocolumn|typeout|typein|underbrace|underline|unitlength|usebox|usecounter|usepackage|value|vdots|vector|verb|vfill|vline|vphantom|vspace)/g,'<s>$1$2</s>', // commands (not complete)
	/(\\)(pm|mp|times|div|cdot|ast|star|dagger|ddagger|amalg|cap|cup|uplus|sqcap|sqcup|vee|wedge|oplus|ominus|otimes|circ|bullet|diamond|lhd|rhd|unlhd|unrhd|oslash|odot|bigcirc|triangleleft|Diamond|bigtriangleup|bigtriangledown|Box|triangleright|setminus|wr|le|ge|neq|sim|ll|gg|doteq|simeq|subset|supset|approx|asymp|subseteq|supseteq|cong|smile|sqsubset|sqsupset|equiv|frown|sqsubseteq|sqsupseteq|propto|bowtie|in|ni|prec|succ|vdash|dashv|preceq|succeq|models|perp|parallel||mid|nmid|nleq|ngeq|nsim|ncong|nparallel|not\<|not\>|not\=|not|le|not|ge|not|sim|nless|ngtr|lneq|gneq|lnsim|lneqq|gneqq|alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|pi|varpi|rho|varrho|sigma|varsigma|tau|upsilon|phi|varphi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|gets|to|leftarrow|Leftarrow|rightarrow|Rightarrow|leftrightarrow|Leftrightarrow|mapsto|hookleftarrow|leftharpoonup|leftharpoondown|rightleftharpoons|longleftarrow|Longleftarrow|longrightarrow|Longrightarrow|longleftrightarrow|Longleftrightarrow|longmapsto|hookrightarrow|rightharpoonup|rightharpoondown|leadsto|uparrow|Uparrow|downarrow|Downarrow|updownarrow|Updownarrow|nearrow|searrow|swarrow|nwarrow|ldots|vdots|cdots|ddots|hat|check|dot|breve|acute|ddot|grave|tilde|mathring|bar|vec|infty|triangle|angle|aleph|hbar|imath|jmath|ell|wp|Re|Im|mho|prime|emptyset|nabla|surd|partial|top|bot|vdash|dashv|forall|exists|neg|flat|natural|sharp|backslash|Box|Diamond|clubsuit|diamondsuit|heartsuit|spadesuit|Join|blacksquare|\{|\}|\||backslash|lfloor|rfloor|lceil|rceil|langle|rangle|left|right|uparrow|downarrow|updownarrow|Uparrow|Downarrow|Updownarrow|sum|int|oint|prod|coprod|bigcap|bigcup|bigsqcup|bigvee|bigwedge|bigodot|bigotimes|bigoplus|biguplus)/g,'<s>$1$2</s>', // math syntax (probably complete)
	/(\{)(.*)(\})/g,'<c>$1</c>$2<c>$3</c>',//curly brackets
	/(\[.*?\])/g,'<d>$1</d>',//brackets
	/(\$)/g,'<c>$1</c>',
	/(%.*)(\ )/g,'<d>$1</d>$2'//comments, ends with a space (has to be adapted)
	//Problem with first and last line.
];



CodePress.initialize();


