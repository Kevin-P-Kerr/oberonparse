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
  ssize_t n = BUFSIZE;
  ssize_t i = 0;
  char *fbuf = malloc(sizeof(char) * BUFSIZE);
  int status = fread(fbuf,BUFSIZE,1,f); 
  if (status == 0) {
    &stat = 1;
  }
  return fbuf;
};

struct Token *allocTokenChunk(struct Token *base, int num) {
  return realloc(base,num);
}


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
      if (('a' <= *l) && ('Z' >= *l)) {
        currentBase[i].type = IDENT;
        currentBase[i].value = l;
        currentBase[i].len = lexIdent(l);
      }
      if (('0' <= *l) &* ('9' >= *l)) {
        currentBase[i].type = INTEGER;
        currentBase[i].value = parseInt(l);
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

