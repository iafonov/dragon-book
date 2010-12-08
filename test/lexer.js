$(document).ready(function() {
	module("Lexer");

  test("Tokenize arithmetic expression", function() {    
    var lexer = new Lexer("20	 + 15");
    same(lexer.getTokensList(), [20, "+", 15], "It should return list of tokens");
  });

});
