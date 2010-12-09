(function(){
  var Tag = { NUM: 256, ID: 257, TRUE: 258, FALSE: 259 };

  var token = function(spec) {
    var that = {};

    that.getTag = function() {
      return spec.tag;
    };

    that.toString = function() {
      return "<tag: " + spec.tag + ">";
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

  var word = function(spec) {
    var that = token({tag: spec.tag});

    that.getLexeme = function() {
      return spec.lexeme;
    };

    return that;
  };

  var Words = {};
  var reserve = function(keywords) {
    var tagByKeyWord = function(keyword) {
      return; // Placeholder
    };

    _(keywords).each(function(keyword) { Words.push(word({lexeme: keyword, tag: TAG_BY_KEYWORD})); });
  };

  reserve("if", "else");

  this.Lexer = function(text) {
    this.text = text;
    this.pos = 0;
  };

  _(this.Lexer.prototype).extend({
    getNextToken: function() {
      while (this.peek() === " " || this.peek() === "\t") { this.pos++; } // skip whitespaces

      if (isDigit(this.peek())) {
        var v = 0;

        do {
          v = v * 10 + parseInt(this.peek(), 10);
          this.pos++;
        } while (isDigit(this.peek()));

        var t = number({value: v});
        this.pos++;
        return t;
      }

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

    peek: function() {
      return this.text.charAt(this.pos);
    }
  });
})();

