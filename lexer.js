(function(){
  this.Translator = {};

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

        token = v;
        this.pos++;
        return token;
      }

      var token = this.peek();
      this.pos++;
      return token;
    },

    getTokensList: function() {
      var tokens = [];
      while (token = this.getNextToken()) { tokens.push(token); }
      return tokens;
    },

    peek: function() {
      return this.text.charAt(this.pos);
    }
  });

  function isDigit(ch) {
     return (ch >= '0' && ch <= '9');
  };
})();

