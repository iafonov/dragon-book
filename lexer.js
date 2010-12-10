(function(){
  var Tag = {
    enumerateTags: function() {
      var startIndex = 256;
      _(arguments).each(function(keyword) {
        Tag[keyword.toUpperCase()] = startIndex++;
      });
    },

    getTagById: function(id) {
      return _(Tag).keys()[_(Tag).values().indexOf(id)] || id;
    }
  };

  Tag.enumerateTags("and",   "basic", "break", "do",
                    "else",  "eq",    "false", "ge",
                    "id",    "if",    "index", "le",
                    "minus", "ne",    "num",   "or",
                    "real",  "temp",  "true",  "while");

  var token = function(spec) {
    var that = {};

    that.getTag = function() {
      return spec.tag;
    };

    that.toString = function() {
      return "[tag: " + Tag.getTagById(spec.tag) + "]";
    };

    return that;
  };

  var number = function(spec) {
    var that = token({tag: Tag.NUM});

    that.getNumber = function() {
      return spec.value;
    };

    return that;
  };

  var real = function(spec) {
    var that = token({tag: Tag.REAL});

    that.getNumber = function() {
      return spec.value;
    };

    return that;
  };

  var word = function(spec) {
    if (Word.reserved(spec.lexeme)) {
      return Word[spec.lexeme];
    }

    var that = token({tag: spec.tag});

    that.getLexeme = function() {
      return spec.lexeme;
    };

    return that;
  };

  var Word = {
    addOp : function(lexeme, name) {
      this[name] = word({ lexeme: lexeme, tag: Tag[name.toUpperCase()] });
    },

    reserve : function(lexeme) {
      this[lexeme] = word({ lexeme: lexeme, tag: Tag[lexeme.toUpperCase()] });
    },

    reserved : function(lexeme) {
      return this.hasOwnProperty(lexeme);
    }
  };

  Word.addOp("&&", "and");
  Word.addOp("||", "or");
  Word.addOp("==", "eq");
  Word.addOp("!=", "ne");
  Word.addOp("<=", "le");
  Word.addOp(">=", "ge");
  Word.addOp("minus", "minus");
  Word.addOp("true", "true");
  Word.addOp("false", "false");
  Word.addOp("t", "temp");

  Word.reserve("if");
  Word.reserve("else");
  Word.reserve("while");
  Word.reserve("do");
  Word.reserve("break");

  // types

  this.Lexer = function(text) {
    this.text = text;
    this.pos = 0;
  };

  _(this.Lexer.prototype).extend({
    getNextToken: function() {
      while (this.peek() === " " || this.peek() === "\t") { this.pos++; } // skip whitespaces

      // logic operations
      switch (this.peek()) {
        case "&": if (this.testNext("&")) { return Word.and; } break;
        case "|": if (this.testNext("|")) { return Word.or; } break;
        case "=": if (this.testNext("=")) { return Word.eq; } break;
        case "!": if (this.testNext("=")) { return Word.ne; } break;
        case "<": if (this.testNext("=")) { return Word.le; } break;
        case ">": if (this.testNext("=")) { return Word.ge; } break;
      }

      // numbers
      if (isDigit(this.peek())) {
        var v = 0;
        do {
          v = v * 10 + parseInt(this.peek(), 10);
          this.pos++;
        } while (isDigit(this.peek()));

        if (this.peek() != ".") {
          return number({value: v});
        }
        this.pos++;

        var digit = 10;
        do {
          v += parseInt(this.peek(), 10) / digit;
          digit *= 10;
          this.pos++;
        } while (isDigit(this.peek()));

        return real({value: v});
      }

      // identifiers & reserved words
      if (isAlpha(this.peek())) {
        var str = "";
        do {
          str += this.peekAndAdvance();
        } while (isAlpha(this.peek()) || isDigit(this.peek()));

        

        return word({tag: Tag.ID, lexeme: str});
      }

      if (this.peek() !== "") {
        return token({tag: this.peekAndAdvance()});
      }

      // EOF
    },

    getTokensList: function() {
      var tokens = [];
      while (t = this.getNextToken()) { tokens.push(t); }
      return tokens;
    },

    peekAndAdvance: function() {
      var peek = this.peek();
      this.pos++;
      return peek;
    },

    testNext: function(test) {
      if (this.text.charAt(this.pos + 1) === test) {
        this.pos += 2; // advance to position after tested character
        return true;
      }

      return false;
    },

    peek: function() {
      return this.text.charAt(this.pos);
    }
  });
})();

