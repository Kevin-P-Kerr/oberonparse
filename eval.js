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

oberonTerminals.push(new Terminal("ASTER",/^\*/));
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

var OberonParser = function (oberonScanner) {
    this.parser = function (input,env) {
        var tokens = oberonScanner.scan(input);
        return evalModule(tokens);
    };
    var TreeNode = function (val) {
        this.car = val;
        this.cdr;
    };
    var error = function (type,token) {
        throw new Error(type + token);
    }
    var parseModule = function (tokens) {
        //(MODULE IDENT (DECLS) (STATEMENTS))
        var lead = tokens[i];
        var rest = tokens.slice(1);
        if (lead.type != 'MODULE') {
            error("expected token Module", lead);
        }
        var baseNode = new TreeNode(lead);
        if (rest[0].type != 'IDENT') {
            error("expected token Ident",rest[0]);
        }
        baseNode.cdr = new TreeNode(rest[0]);
        rest = rest.slice(1);
        if (rest[0].type != "SEMI") {
            error("expected token Semi", rest[0]);
        }
        rest = rest.slice(1);
        var externTokens = {tokens:rest}
        baseNode.cdr.car = new TreeNode(parseDecls(externTokens));
        rest = externTokens.tokens;
        if (rest[0].type == 'BEGIN') {
            baseNode.cdr.cdr = new TreeNode(evalStatementSeq(rest.slice(1),env,results));
        }
        if (rest[0].type != 'END') {
            error("expected token END", rest[0]);
        }
        rest = rest.slice(1);
        if (rest[0].type != 'IDENT' && rest[0].value != moduleName) {
            error("bad end");
        }
        rest = rest.slice(1);
        if (rest[0].type != 'DOT') {
            error("expected dot",rest[0]);
        }
        rest = rest.slice(1);
        if (rest.length) {
            error("too many tokens");
        }
        return baseNode;
    };
    var parseDecls = function (tokens, modEnv) {
        //(((CONSTPART CONST STUFF)(VARPART VAR STUFF)(TYPEPART TYPE STUFF))((PROCEDURE PART STUFF)))
        var lead = tokens[0];
        var rest = tokens.slice(1);
        var progress = function () {
            lead = rest[0];
            rest = rest.slice(1);
        }
        var baseNode = new TreeNode();
        baseNode.car = new TreeNode();
        baseNode.car.car = new TreeNode();
        if (lead.type == 'CONST') {
            rest = makeConst(rest,modEnv);
            progress();
        }
        if (lead.type == 'TYPE') {
            rest = makeType(rest,modEnv);
            progress();
        }
        if (lead.type == 'VAR') {
            rest = makeVar(rest,modEnv);
            progress();
        }
        while (lead.type == 'PROCEDURE') {
            rest = makeProcedure(rest,modEnv);
            if (rest[0].type != "SEMI") {
                error("expected semi",rest[0]);
            }
            progress();
            progress();
        }
        return rest;
    };
    var evalStatementSeq = function (tokens,env,results) {
        var lead = tokens[0];
        var rest = tokens.slice(1);
        var progress = function () {
            lead = rest[0];
            rest = rest.slice(1);
        }
        if (lead.type == 'IDENT') {
            var ident = lookUp(lead.value,env);
            if (ident.type == 'PROCEDURE') {
                rest = invokeProcedure(ident,rest,env,results);
            }
            else {
                evalAssignments(ident,rest,env,results);
            }
        }
        else if (lead.type == 'IF') {
            var bool = [];
            rest = evalExpr(rest,env,bool);
            if (bool[0]) {
                progress();
                if (lead.type != "THEN") {
                    error("expected THEN",lead);
                }
                rest = evalStatementSeq(rest,env,results);
            }
            else {
                progress();
                if (lead.type != "THEN") {
                    error("expected THEN",lead);
                }
                rest = evalStatementSeq(rest,env,[]); // just to push the evaluator to the right token
                progress();
                var test = false;
                while (lead.type == 'ELSIF') {
                    bool = [];
                    rest = evalExpr(rest,env,bool);
                    if (bool[0]) {
                        progress();
                        if (lead.type != "THEN") {
                            error("expected THEN",lead);
                        }
                        rest = evalStatementSeq(rest,env,results);
                        progress();
                        test = true;
                        break;
                    }
                    progress();
                    if (lead.type != "THEN") {
                        error("expected THEN",lead);
                    }
                    rest = evalStatementSeq(rest,env,[]);
                    progress();
                }
                if (!test) {
                    if (lead.type == 'ELSE') {
                        rest = evalStatmentSeq(rest,env,results);
                    }
                }
                if (lead.type == 'ELSE') {
                    rest = evalStatmentSeq(rest,env,results);
                }







        
            

        
        
        
                         

                 
