// Change './index' to 'preem' if you use this code outside of this package

let Preem = require('./preem');

let preem = new Preem({
    testType: Preem.CONSTANTS.TESTTYPE.SYNC
});

let s1 = "Hello",
    s2 = "World",
    n1 = 1,
    n2 = 1;

preem.explain("Test string equality").equal(s1, s2, "Strings are equal", "Strings aren't equal");
preem.explain("Test number equality").equal(n1, n2, "Numbers are equal", "Numbers aren't equal");

preem.start();