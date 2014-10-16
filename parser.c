struct Token {
  int type;
  char *value;
  int len;
  Token *next;
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

void allocTokenChunk(struct Token *base, int num) {
    struct Token *t = malloc(sizeof(struct Token)*num);
    while (num--) {
      base->next = t[num];
      base = base->next;
    }
}


struct Token *lex(char *fbuf) {
  char *l = fbuf;
  struct Token baseToken = malloc(sizeof(struct Token));
  struct Token *currentBase = &baseToken;
  int tokenChunkSize = 5;
  int i = 0;
  allocTokenChunk(baseToken,tokenChunkSize);
  while (*l != '\0') {
    for (;i<tokenChunkSize;i++) {
      l = killwhite(l);
      if (('a' <= *l) && ('Z' >= *l)) {
        currentBase[i].type = IDENT;
        currentBase[i].value = l;
        currentBase[i].len = lexIdent(l);
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

