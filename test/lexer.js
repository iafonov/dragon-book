$(document).ready(function() {
	module("Lexer");

  test("Tokenize arithmetic expression", function() {
    same(new Lexer("20	 + 15").getTokensList().toString(), "[tag: NUM],[tag: +],[tag: NUM]", "It should return list of tokens");
  });

  test("Tokenize words expressions", function() {
    same(new Lexer("count = count + increment").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: +],[tag: ID]", "It should return list of tokens");
  });

  test("Tokenize bitwise & operator", function() {
    same(new Lexer("c = a & b").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: &],[tag: ID]", "It should return list of tokens");
    same(new Lexer("c = a&b").getTokensList().toString(),   "[tag: ID],[tag: =],[tag: ID],[tag: &],[tag: ID]", "It should return list of tokens");
    same(new Lexer("c=a&b").getTokensList().toString(),     "[tag: ID],[tag: =],[tag: ID],[tag: &],[tag: ID]", "It should return list of tokens");
  });

  test("Tokenize logic operators", function() {
    same(new Lexer("c = a && b").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: AND],[tag: ID]", "It should return list of tokens");
    same(new Lexer("c = a || b").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: OR],[tag: ID]", "It should return list of tokens");
    same(new Lexer("c = a == b").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: EQ],[tag: ID]", "It should return list of tokens");
    same(new Lexer("c = a != b").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: NE],[tag: ID]", "It should return list of tokens");
    same(new Lexer("c = a <= b").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: LE],[tag: ID]", "It should return list of tokens");
    same(new Lexer("c = a >= b").getTokensList().toString(), "[tag: ID],[tag: =],[tag: ID],[tag: GE],[tag: ID]", "It should return list of tokens");
  });

  test("Tokenize real and num types", function() {
    same(new Lexer("20	 + 3.1415").getTokensList().toString(), "[tag: NUM],[tag: +],[tag: REAL]", "It should return list of tokens");
  });

  test("Tokenize reserved words", function() {
    same(new Lexer("if (test == 10) {test = test + 1}").getTokensList().toString(), "[tag: IF],[tag: (],[tag: ID],[tag: EQ],[tag: NUM],[tag: )],[tag: {],[tag: ID],[tag: =],[tag: ID],[tag: +],[tag: NUM],[tag: }]", "It should return list of tokens");
    same(new Lexer("if(test !=10) {test   = test + 1 } ").getTokensList().toString(), "[tag: IF],[tag: (],[tag: ID],[tag: NE],[tag: NUM],[tag: )],[tag: {],[tag: ID],[tag: =],[tag: ID],[tag: +],[tag: NUM],[tag: }]", "It should return list of tokens");
  });

});
