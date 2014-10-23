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
oberonTerminals.push(new Terminal("EQ",/^=/));
oberonTerminals.push(new Terminal("ASSN",/^:=/));
oberonTerminals.push(new Terminal("HASH",/^#/));
oberonTerminals.push(new Terminal("LT",/^</));
oberonTerminals.push(new Terminal("LTE",/^<=/));
oberonTerminals.push(new Terminal("GT",/^>/));
oberonTerminals.push(new Terminal("GTE",/^>=/));
oberonTerminals.push(new Terminal("DOT",/^\./));
oberonTerminals.push(new Terminal("COMMA",/^,/));
oberonTerminals.push(new Terminal("COLON",/^:/));
oberonTerminals.push(new Terminal("SEMI",/^;/));
oberonTerminals.push(new Terminal("RPAREN",/^\)/));
oberonTerminals.push(new Terminal("LPAREN",/^\(/));
oberonTerminals.push(new Terminal("RBRAK",/^\]/));
oberonTerminals.push(new Terminal("LBRAK",/^\[/));
oberonTerminals.push(new Terminal("OF",/^OF/));
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
  var syntax = {};
  var head = tokens[0];
  var rest = tokens.slice(1);
  var e = function (m) { throw new Error(m); };
  var c = function (t,tt) { return t.type == tt; };
  var ce = function (t,tt) { if (!c(t,tt)) e(tt); };
  var next = function () { tokens = rest; head = tokens[0]; rest=tokens.slice(1); console.log(head.type +": "+head.value); }
  var pm = function () {
    console.log("PM");
    ce(head,"MODULE");
    next();
    ce(head,"IDENT");
    next();
    ce(head,"SEMI");
    next();
    pd();
    if(c(head,"BEGIN")) {
      ps();
    }
    next();
    ce(head,"END");
    next();
    ce(head,"IDENT");
    next();
    ce(head,"DOT");
    return true;
  };
  var pd = function () {
    console.log("PD");
    if (c(head,"CONST")) {
      next();
      pdc();
    }
    if (c(head,"VAR")) {
      next();
      pdv();
    }
    if (c(head,"TYPE")) {
      next();
      pdt();
    }
    if (c(head,"PROCEDURE")) {
        pdp();
        next();
        ce(head,"SEMI");
        while(c(head,"PROCEDURE")){
          pdp();
          ce(head,"SEMI");
          next();
        }
    }
  };
  var pdc = function () {
    console.log("PDC");
    while(c(head,"IDENT")) {
      next();
      ce(head,"EQ");
      next();
      pe();
      ce(head,"SEMI");
      next();
    }
  };
  var pdt = function () {
    console.log("PDT");
    while (c(head,"IDENT")) {
      next();
      ce(head,"EQ");
      next();
      pt();
      ce(head,"SEMI");
      next();
    }
  };
  var pdv = function () {
    console.log("PDV");
    while (c(head,"IDENT")) {
      pidl();
      ce(head,"COLON");
      next();
      pt();
      ce(head,"SEMI");
      next();
    }
  };
  var pdp = function () {
    console.log("PDP");
    pph();
    ce(head,"SEMI");
    next();
    ppb();
    ce(head,"END");
    next();
    ce(head,"IDENT");
    next();
  }
  var ppb = function () {
    console.log("PPB");
    pd();
    if (c(head,"BEGIN")) {
      next();
      pss();
    }
    ce(head,"END");
    next();
    ce(head,"IDENT");
    next();
  };
  var pss = function () {
    console.log("PSS");
    ps();
    while (c(head,"SEMI")) {
      next();
      ps();
    }
  };
  var ps = function () {
    console.log("PS");
    if (c(head,"WHILE")) {
      pws();
    }
    else if (c(head,"IF")) {
      pis();
    }
    else if (c(head,"IDENT")) {
      next();
      pselect();
      if (c(head,"ASSN")) {
        next();
        pe();
      }
      else {
        pap();
      }
    }
    else {
      e("bad statement");
    }
  };

  var pws = function () {
    console.log("PWS");
    ce(head,"WHILE");
    next();
    pe();
    ce(head,"DO");
    next();
    pss();
    ce(head,"END");
    next();
  };
  var pis = function () {
    console.log("PIS");
    ce(head,"IF");
    next();
    pe();
    ce(head,"THEN");
    next();
    pss();
    while (c(head,"ELSIF")) {
      pe();
      ce(head,"THEN");
      next();
      pss();
    }
    ce(head,"END");
    next();
  };
  var pap = function () {
    console.log("PAP");
    ce(head,"LPAREN");
    next();
    // NB you MUST have an expression here, which deviates from the ebnf
    pe();
    while (c(head,"COMMA")) {
      next();
      pe();
    }
    ce(head,"RPAREN");
    next();
  };
  var pph = function () {
    console.log("PPH");
    ce(head,"PROCEDURE");
    next();
    ce(head,"IDENT");
    next();
    if (c(head,"LPAREN")) {
      while (c(head,"LPAREN")) {
        ppfp();
      }
    }
  };
  var ppfp = function () {
    console.log("PPFP");
    ce(head,"LPAREN");
    next();
    if (c(head,"RPAREN")) {
      next();
      return;
    }
    ppfpfps();
    while (!c(head,"RPAREN")) {
      ce(head,"SEMI");
      ppfpfps();
    }
    next();
    return;
  };
  var ppfpfps = function () {
    console.log("PPFPFPS");
    if (c(head,"VAR")) {
      next();
    }
    pidl();
    ce(head,"COLON");
    pt();
  };
  var pidl = function () {
    console.log("PIDL");
    ce(head,"IDENT");
    next();
    while (c(head,"COMMA")) {
      next();
      ce(head,"IDENT");
      next();
    }
  };
  var pt = function () {
    console.log("PT");
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
  };
  var pat = function () {
    console.log("PAT");
    ce(head,"ARRAY");
    next();
    pe();
    ce(head,"OF");
    next();
    pt();
  }
  var pe = function () {
    console.log("PE");
    pse();
    var cc = function (t) { return c(head,t); };
    if (cc("EQ") || cc("HASH") || cc("LT") || cc("LTE") || cc("GT") || cc("GTE")) {
      next();
      pse();
    }
  };
  var pse = function () {
    console.log("PSE");
    var cc = function (t) { return c(head,t); };
    if (cc("PLUS") || cc("MINUS")) {
      next();
    }
    pterm();
    while (cc("PLUS") || cc("MINUS") || cc("OR")) {
      next();
      pterm();
    }
  };
  var pterm = function () {
    console.log("PTERM");
    var cc = function (t) { return c(head,t); };
    pfactor();
    while (cc("ASTER") || cc("DIV") || cc("MOD") || cc("AND")) {
      next();
      pfactor();
    }
  };
  var pselect = function () {
    console.log("PSELECT");
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
  };
  var pfactor = function () {
    console.log("PFACTOR");
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
  };

  var prt = function () {
    console.log("PRT");
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
  };
  pm();
};

var fs = require('fs');
var sampleString = fs.readFileSync("./example.obn").toString();
var tokens = oberonScanner.scan(sampleString);
//console.log(tokens);
console.log(parse(tokens));
