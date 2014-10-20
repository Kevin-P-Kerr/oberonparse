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

oberonTerminals.push(new Terminal("ASTERIX",/^\*/));
oberonTerminals.push(new Terminal("DIV",/^DIV/));
oberonTerminals.push(new Terminal("MOD",/^MOD/));
oberonTerminals.push(new Terminal("AND",/^&/));
oberonTerminals.push(new Terminal("PLUS",/^\+/));
oberonTerminals.push(new Terminal("MINUS",/^-/));
oberonTerminals.push(new Terminal("OR",/^OR/));
oberonTerminals.push(new Terminal("EQ",/^=/));
oberonTerminals.push(new Terminal("HASH",/^#/));
oberonTerminals.push(new Terminal("LT",/^</));
oberonTerminals.push(new Terminal("LTE",/^<=/));
oberonTerminals.push(new Terminal("GT",/^>/));
oberonTerminals.push(new Terminal("GTE",/^>=/));
oberonTerminals.push(new Terminal("DOT",/^\./));
oberonTerminals.push(new Terminal("COMMA",/^,/));
oberonTerminals.push(new Terminal("COLON",/^:/));
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
oberonTerminals.push(new Terminal("IF",/^WHILE/));
oberonTerminals.push(new Terminal("ARRAY",/^ARRAY/));
oberonTerminals.push(new Terminal("RECORD",/^RECORD/));
oberonTerminals.push(new Terminal("CONST",/^CONST/));
oberonTerminals.push(new Terminal("TYPE",/^TYPE/));
oberonTerminals.push(new Terminal("VAR",/^VAR/));
oberonTerminals.push(new Terminal("PROCEDURE",/^PROCEDURE/));
oberonTerminals.push(new Terminal("BEGIN",/^BEGIN/));
oberonTerminals.push(new Terminal("MODULE",/^MODULE/));
oberonTerminals.push(new Terminal("IDENT",/^[A-Za-z][A-za-z0-9]+/));
oberonTerminals.push(new Terminal("INT",/^[0-9]+/));

oberonScanner = new Scanner(oberonTerminals);

var OberonEvaluator = function (oberonScanner) {
    this.eval = function (input,env) {
        var tokens = oberonScanner.scan(input);
        var lead = tokens[i];
        switch (lead.type) {
            case "INT" :
                return parseInt(lead.value);
                break;
            case "IDENT" : 
                return lookup(lead.value,env);
                break;
            case "MODULE":
                return makeModule(input.slice(1),env);
                break;
            case "PROCEDURE":
                return makeProcedure(input.slice(1),env);
                break;
            case "VAR":
                return makeVar(input.slice(1),env);
                break;
            case "TYPE":
                return makeType(input.slice(1),env);
                break;
            case "CONST":
                return makeConst(input.slice(1),env);
                break;
            case "RECORD":
                return makeRecord(input.slice(1),env);
                break;
            case "ARRAY":
                return makeArray(input.slice(1),env);
            case 

