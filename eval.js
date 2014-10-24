/* abstract description of the scanner */
var Scanner = function (terminals) {
    var killwhite = function (input) {
        while (input[0] == ' ' || input[0] == '\t' || input[0] == '\n') {
            input = input.slice(1);
        }
        return input;
    };

    this.scan = function (input) {
        var i = 0;
        var ii = terminals.length;
        var tokens = [];
        var match;
        var terminal;
        while (input.length) {
            input = killwhite(input);
            for (i=0; i<ii; i++) {
                terminal = terminals[i];
                if ((match = input.match(terminal.reg))) {
                    tokens.push(new Token(terminal,match));
                    input = input.slice(match[0].length);
                    break;
                }
            }
        }
        return tokens;
    };
};

var Terminal = function (type,reg) {
    this.type = type;
    this.reg = reg;
};

var Token = function (terminal,match) {
    this.type = terminal.type;
    this.value = match[0];
};

var oberonTerminals = [];

oberonTerminals.push(new Terminal("MODULE",/^MODULE/));
oberonTerminals.push(new Terminal("ASTER",/^\*/));
oberonTerminals.push(new Terminal("TILDE",/^~/));
oberonTerminals.push(new Terminal("DIV",/^DIV/));
oberonTerminals.push(new Terminal("MOD",/^MOD/));
oberonTerminals.push(new Terminal("AND",/^&/));
oberonTerminals.push(new Terminal("PLUS",/^\+/));
oberonTerminals.push(new Terminal("MINUS",/^-/));
oberonTerminals.push(new Terminal("OR",/^OR/));
oberonTerminals.push(new Terminal("ASSN",/^:=/));
oberonTerminals.push(new Terminal("HASH",/^#/));
oberonTerminals.push(new Terminal("GTE",/^>=/));
oberonTerminals.push(new Terminal("LTE",/^<=/));
oberonTerminals.push(new Terminal("LT",/^</));
oberonTerminals.push(new Terminal("GT",/^>/));
oberonTerminals.push(new Terminal("DOT",/^\./));
oberonTerminals.push(new Terminal("COMMA",/^,/));
oberonTerminals.push(new Terminal("COLON",/^:/));
oberonTerminals.push(new Terminal("SEMI",/^;/));
oberonTerminals.push(new Terminal("RPAREN",/^\)/));
oberonTerminals.push(new Terminal("LPAREN",/^\(/));
oberonTerminals.push(new Terminal("RBRAK",/^\]/));
oberonTerminals.push(new Terminal("LBRAK",/^\[/));
oberonTerminals.push(new Terminal("OF",/^OF/));
oberonTerminals.push(new Terminal("EQ",/^=/));
oberonTerminals.push(new Terminal("THEN",/^THEN/));
oberonTerminals.push(new Terminal("DO",/^DO/));
oberonTerminals.push(new Terminal("END",/^END/));
oberonTerminals.push(new Terminal("ELSE",/^ELSE/));
oberonTerminals.push(new Terminal("ELSIF",/^ELSIF/));
oberonTerminals.push(new Terminal("IF",/^IF/));
oberonTerminals.push(new Terminal("WHILE",/^WHILE/));
oberonTerminals.push(new Terminal("ARRAY",/^ARRAY/));
oberonTerminals.push(new Terminal("RECORD",/^RECORD/));
oberonTerminals.push(new Terminal("CONST",/^CONST/));
oberonTerminals.push(new Terminal("TYPE",/^TYPE/));
oberonTerminals.push(new Terminal("VAR",/^VAR/));
oberonTerminals.push(new Terminal("PROCEDURE",/^PROCEDURE/));
oberonTerminals.push(new Terminal("BEGIN",/^BEGIN/));
oberonTerminals.push(new Terminal("IDENT",/^[A-Za-z][A-za-z0-9]*/));
oberonTerminals.push(new Terminal("INT",/^[0-9]+/));

oberonScanner = new Scanner(oberonTerminals);
var test = "MODULE foo; x,y,z:INTEGER; x := 2; y := 3; z := x + y; print(z); END foo."
/*
var i = function (t) {
    var e = function (m) { throw new Error(m); }, c = function (t,test) { if (t.type != tst) return false; return true; }, ce = function (t,tst) { if (!c(t,tst)) {  e(tst);  }, th,tr,tp = function () { th = t[0]; t = s.slice(1); }, p = console.log;
    var im = function () { ce(th,tnm); var ev = {}; tp(); tp(); tp(); id(ev); is(ev); };
    var id = function (ev) { idv(ev); idp(ev); };
    var idv = function (ev) { if(c(th,tnv)) { var v = []; tp(); while(c(th,tni) { v.push(th); tp(); ce(th,tnc); tp(); } ce(th,tncl); tp(); ce(th,tni); v.forEach(function (v) { ev[v.value] = {t:th.value} }); }};
    var idp = function (ev) { }
    var is = function(ev) {  }
*/

var parse = function (tokens) {
  var head = tokens[0];
  var rest = tokens.slice(1);
  var e = function (m) { throw new Error(m); };
  var c = function (t,tt) { return t.type == tt; };
  var ce = function (t,tt) { if (!c(t,tt)) e(tt); };
  var next = function () { tokens = rest; head = tokens[0]; rest=tokens.slice(1); log(head.type +": "+head.value); }
  var log = (function () {
      var indentLevel = 0;
      return function (message,level,autodec) {
          if (autodec) {
              indentLevel--;
          }
          var il = indentLevel;
          while (il--) {
              message = ' '+message;
          }
          console.log(message);
          if (level) { indentLevel += level }
      };
  })();
  var dec = function (name,fn) {
    return function() {
        log(name,1);
        var ret = fn.apply(this,arguments);
        log("/"+name,false,true);
        if (ret != undefined) { return ret; }
    };
  };
  
  var pm = dec("pm", function () {
    var syntax = {};
    syntax.modulePart = {};
    ce(head,"MODULE");
    next();
    ce(head,"IDENT");
    syntax.modulePart.identPart = head;
    next();
    ce(head,"SEMI");
    next();
    syntax.modulePart.declarationsPart = {};
    pd(syntax.modulePart.declarationsPart);
    if(c(head,"BEGIN")) {
      syntax.modulePart.statementPart = {};
      ps(syntax.modulePart.statementsPart);
    }
    ce(head,"END");
    next();
    ce(head,"IDENT");
    next();
    ce(head,"DOT");
    return syntax;
  });
  var pd = dec("pd", function (syntax) {
    if (c(head,"CONST")) {
      syntax.constPart = {};
      next();
      pdc(syntax.constPart);
    }
    if (c(head,"VAR")) {
      syntax.variablePart = {};
      next();
      pdv(syntax.variablePart);
    }
    if (c(head,"TYPE")) {
      syntax.typePart = {};
      next();
      pdt(syntax.typePart);
    }
    if (c(head,"PROCEDURE")) {
        syntax.procedureParts = [];
        var firstProcedure = {};
        pdp(firstProcedure);
        syntax.procedureParts.push(firstProcedure);
        ce(head,"SEMI");
        next();
        while(c(head,"PROCEDURE")){
          pdp(syntax.procedureParts);
          ce(head,"SEMI");
          next();
        }
    }
  });
  var pdc= dec("pdc", function (syntax) {
    syntax.decls = [];
    while(c(head,"IDENT")) {
      (function () {
        var decl = {ident:head};
        next();
        ce(head,"EQ");
        next();
        pe(decl);
        ce(head,"SEMI");
        next();
        syntax.decls.push(decl);
      })();
    }
  });
  var pdt =dec("pdt", function (syntax) {
    syntax.decls = [];
    while (c(head,"IDENT")) {
      (function () {
        var decl = {ident:head};
        next();
        ce(head,"EQ");
        next();
        pt(decl);
        ce(head,"SEMI");
        next();
        syntax.decls.push(decl);
      })();
    }
  });
  var pdv = dec("pdv",function (syntax) {
    syntax.decls = [];
    while (c(head,"IDENT")) {
      (function () {
        var decl = {idents:[]};
        pidl(decl.idents);
        ce(head,"COLON");
        next();
        pt(decl);
        ce(head,"SEMI");
        next();
      })();
    }
  });
  var pdp = dec("pdp",function (syntax) {
    syntax.headerPart = {};
    pph(syntax.headerPart);
    ce(head,"SEMI");
    next();
    syntax.bodyPart = {};
    ppb(syntax.bodyPart);
  });
  var ppb = dec("ppb",function (syntax) {
    syntax.declartionsPart = {};
    pd(syntax.declartionsPart);
    if (c(head,"BEGIN")) {
      next();
      syntax.statementSequence = {};
      pss(syntax.statementSequence);
    }
    ce(head,"END");
    next();
    ce(head,"IDENT");
    next();
  });
  var pss =dec("pss", function (syntax) {
    syntax.statements = [];
    var firstStatement = {};
    ps(firstStatement);
    syntax.statements.push(firstStatement);
    while (c(head,"SEMI")) {
      (function () {
        var nextStatement = {};
        next();
        ps(nextStatement);
        syntax.statements.push(nextStatement);
      })();
    }
  });
  var ps =dec("ps", function (syntax) {
    if (c(head,"WHILE")) {
      syntax.whileStatement = {};
      pws(syntax.whileStatement);
    }
    else if (c(head,"IF")) {
      syntax.ifStatement = {};
      pis(syntax.ifStatement);
    }
    else if (c(head,"IDENT")) {
      var waitAndSee = {};
      waitAndSee.ident = head;
      next();
      pselect(waitAndSee);
      if (c(head,"ASSN")) {
        waitAndSee.equalsPart = {};
        next();
        pe(waitAndSee.equalsPart);
        syntax.assignmentPart = waitAndSee;
      }
      else {
        waitAndSee.argumentsPart = {};
        pap(waitAndSee.argumentsPart);
        syntax.procedureCall = waitAndSee;
      }
    }
    else {
      e("bad statement");
    }
  });
  var pws = dec("pws",function (syntax) {
    ce(head,"WHILE");
    next();
    syntax.test = {};
    pe(syntax.test);
    ce(head,"DO");
    next();
    syntax.loop = {};
    pss(syntax.loop);
    ce(head,"END");
    next();
  });
  var pis = dec("pis",function (syntax) {
    ce(head,"IF");
    next();
    syntax.test = {};
    pe(syntax.test);
    ce(head,"THEN");
    next();
    syntax.thenPart = {};
    pss(syntax.thenPart);
    syntax.elselif = [];
    while (c(head,"ELSIF")) {
    (function () {
      var elseif = {};
      elseif.test ={};
      pe(elseif.test);
      ce(head,"THEN");
      next();
      elseif.thenPart = {};
      pss(elseif.thenPart);
      syntax.elseif.push(elseif);
    })();
    }
    if (c(head,"ELSE")) {
        syntax.elsePart = {};
        next();
        pss(syntax.elsePart);
    }
    ce(head,"END");
    next();
  });
  var pap = dec("pap",function (syntax) {
    if(c(head,"LPAREN")) {
        var args = [];
        var firstArg = {};
        next();
        // NB you MUST have an expression here, which deviates from the ebnf
        pe(firstArg);
        syntax.args = args;
        args.push(firstArg);
        while (c(head,"COMMA")) {
        (function () {
          var arg = {};
          next();
          pe(arg);
          args.push(arg);
        });
        }
        ce(head,"RPAREN");
        next();
    }
  });
  var pph = ("pph",function (syntax) {
    ce(head,"PROCEDURE");
    next();
    ce(head,"IDENT");
    syntax.ident = {};
    next();
    if (c(head,"LPAREN")) {
      while (c(head,"LPAREN")) {
        syntax.formalParams = [];
        ppfp(syntax.formalParams);
      }
    }
  });
  var ppfp =dec("ppfp", function (foramlParamArray) {
    ce(head,"LPAREN");
    next();
    if (c(head,"RPAREN")) {
      next();
      return;
    }
    var param = {};
    ppfpfps(param);
    formalParamArray.push(param);
    while (!c(head,"RPAREN")) {
    (function () {
      var param = {};
      ce(head,"SEMI");
      ppfpfps(param);
      formalParamArray.push(param);
    })();
    }
    next();
    return;
  });
  var ppfpfps =dec("ppfpfps", function () {
    if (c(head,"VAR")) {
      next();
    }
    pidl();
    ce(head,"COLON");
    pt();
  });
  var pidl = dec("pidl",function () {
    ce(head,"IDENT");
    next();
    while (c(head,"COMMA")) {
      next();
      ce(head,"IDENT");
      next();
    }
  });
  var pt = dec("pt",function () {
    if (c(head,"IDENT")) {
      next();
      return;
    }
    else if (c(head,"ARRAY")) {
      pat();
      return;
    }
    else if (c(head,"RECORD")) {
      prt();
      return;
    }
    else {
      e("bad type decl: "+ head.type);
    }
  });
  var pat =dec("pat", function () {
    ce(head,"ARRAY");
    next();
    pe();
    ce(head,"OF");
    next();
    pt();
  });
  var pe = dec("pe",function () {
    pse();
    var cc = function (t) { return c(head,t); };
    if (cc("EQ") || cc("HASH") || cc("LT") || cc("LTE") || cc("GT") || cc("GTE")) {
      next();
      pse();
    }
  });
  var pse = dec("pse",function () {
    var cc = function (t) { return c(head,t); };
    if (cc("PLUS") || cc("MINUS")) {
      next();
    }
    pterm();
    while (cc("PLUS") || cc("MINUS") || cc("OR")) {
      next();
      pterm();
    }
  });
  var pterm = dec("pterm",function () {
    var cc = function (t) { return c(head,t); };
    pfactor();
    while (cc("ASTER") || cc("DIV") || cc("MOD") || cc("AND")) {
      next();
      pfactor();
    }
  });
  var pselect =dec("pselect", function () {
    if (c(head,"DOT")) {
      next();
      ce(head,"IDENT");
      next();
    }
    else if (c(head,"LBRAK")) {
      next();
      pe();
      ce(head,"RBRAK");
      next();
    }
  });
  var pfactor = dec("pfactor",function () {
    if (c(head,"IDENT")) {
      next();
      pselect();
    }
    else if (c(head,"INT")) {
      next();
    }
    else if (c(head,"LPAREN")) {
      next();
      pe();
      ce(head,"RPAREN");
      next();
    }
    else if (c(head,"TILDE")) {
      next();
      pfactor();
    }
    else {
      e("bad factor:"+head.type);
    }
  });

  var prt = dec("prt",function () {
    ce(head,"RECORD");
    next();
    pfl();
    if (c(head,"SEMI")) {
      while (c(head,"SEMI")) {
        pfl();
      }
    }
    ce(head,"END");
    next();
  });
  return pm();
};

var fs = require('fs');
var sampleString = fs.readFileSync("./example.obn").toString();
var tokens = oberonScanner.scan(sampleString);
//console.log(tokens);
console.log(JSON.stringify(parse(tokens)));
