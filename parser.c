struct Token {
  int type;
  char *value;
  int len;
};

struct ParseTree {
  struct Token *value;
  struct ParseTree *next;
};

char *parseCmdLn(int argc, char ** argv, int *stat) {
  if (argc != 2) {
    *stat = -1;
    return 0;
  }
  *stat = 1;
  return argv[1];
};

char *readFn(char* fname, int *stat) {
  const char * opentype  = "r";
  FILE *f = fopen(fname,openType);
  if (f == NULL) {
      *stat = -1;
      return NULL;
  }
  ssize_t n = BUFSIZE;
  ssize_t i = 0;
  char *fbuf = malloc(sizeof(char) * BUFSIZE);
  int status = fread(fbuf,BUFSIZE,1,f); 
  if (status == 0) {
    *stat = 1;
  }
  return fbuf;
};

struct Token *allocTokenChunk(struct Token *base, int num) {
  return realloc(base,(num*sizeof(struct Token)));
};

int lexIdent(char **l) {
    int n = 0;
    while (('a' <= **l) && ('Z' >= **l)) {
        n++;
        *l++;
    }
    return n;
};

int parseInt(char **l) {
    int n = 0;
    while (('0' <= **l) &* ('9' >= **l)) {
        n = ((n*10)+(**l-'0'));
        *l++;
    }
    return n;
};


struct Token *lex(char *fbuf) {
  char *l = fbuf;
  struct Token *tokenlist = NULL;
  int tokenListSize = 5;
  int tokenChunksize = 5;
  tokenList = allocTokenChunk(tokenList,tokenListSize);
  while (*l != '\0') {
    int i =0;
    int ii = tokenListSize;
    for (;i<tokenChunkSize;i++) {
      l = killwhite(l);
      if (*l == '.') {
          currentBase[i].type = DOT;
          currentBase[i].value = ".";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '[') {
          currentBase[i].type = LBRAK;
          currentBase[i].value = "[";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == ']') {
          currentBase[i].type = RBRAK;
          currentBase[i].value = "]";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '(') {
          currentBase[i].type = LPAREN;
          currentBase[i].value = "(";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == ')') {
          currentBase[i].type = RPAREN;
          currentBase[i].value = ")";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == ')') {
          currentBase[i].type = RPAREN;
          currentBase[i].value = ")";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '~') {
          currentBase[i].type = TILDE;
          currentBase[i].value = "~";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '*') {
          currentBase[i].type = STAR;
          currentBase[i].value = "*";
          currentBase[i].len = -1;
          l++;
      }
      else if (strcmp("DIV",l)) {
          l+=3;
          currentBase[i].type = DIV;
          currentBase[i].value = "DIV";
          currentBase[i].len = -1;
      }
      else if (strcmp("MOD",l)) {
          l+=3;
          currentBase[i].type = MOD;
          currentBase[i].value = "MOD";
          currentBase[i].len = -1;
      }
      else if (*l == '&') {
          currentBase[i].type = AMPERSAND;
          currentBase[i].value = "&";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '+') {
          currentBase[i].type = PLUS;
          currentBase[i].value = "+";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '-') {
          currentBase[i].type = MINUS;
          currentBase[i].value = "-";
          currentBase[i].len = -1;
          l++;
      }
      else if (strcmp("OR",l)) {
          currentBase[i].type = OR;
          currentBase[i].value = "OR";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '=') {
          currentBase[i].type = EQUALS;
          currentBase[i].value = "=";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '#') {
          currentBase[i].type = HASH;
          currentBase[i].value = "#";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '<') {
          currentBase[i].type = LT;
          currentBase[i].value = "<";
          currentBase[i].len = -1;
          l++;
      }
      else if (*l == '>') {
          currentBase[i].type = GT;
          currentBase[i].value = ">";
          currentBase[i].len = -1;
          l++;
      }
      else if (strcmp("<=",l)) {
          currentBase[i].type = LTE;
          currentBase[i].value = "<=";
          currentBase[i].len = -1;
          l++;
      }
      else if (strcmp(">=",l)) {
          currentBase[i].type = GTE;
          currentBase[i].value = ">=";
          currentBase[i].len = -1;
          l++;
      }
      else if (('a' <= *l) && ('Z' >= *l)) {
        currentBase[i].type = IDENT;
        currentBase[i].value = l;
        currentBase[i].len = lexIdent(&l);
      }
      else if (('0' <= *l) &* ('9' >= *l)) {
        currentBase[i].type = INTEGER;
        currentBase[i].value = parseInt(&l);
        currentBase[i].len = -1;
      }
    }
    tokenListSize += tokenChunkSize;
    tokenlist = allocTokenChunk(tokenlist,tokenListSize);
  }
}

int main(int argc, char**argv) {
  int status;
  int *stat = &status;
  char *fname = parseCmdLn(argc,argv,stat);
  if (status < 0) {
    return 1;
  }
  char *fnbuf = readFn(fname,stat);
  if (status < 0) {
    return 1;
  }
  struct Token *tokenList = lex(fnbuf,stat);
  if (status < 0) {
    return 1;
  }
  struct ParseTree *parseTree = parse(tokenList,status)
  if (status < 0) {
    return 1;
  }
  return 0;
}

