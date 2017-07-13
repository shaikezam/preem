// Change './preem' to 'preem' if you use this code outside of this package

let Preem = require('./preem');

let preem = new Preem({
    testType: Preem.CONSTANTS.TESTTYPE.SYNC
});

let s1 = "Hello",
    s2 = "World",
    n1 = 1,
    n2 = 1,
    arr = ['Hello', 'World', 'foo'];

preem.checkIf(s1).isNotEqualTo(s2, "Strings aren't equal", "Strings are equal"); // Strings aren't equal

preem.checkIf(n1).isEqualTo(n2, "Numbers are equal", "Numbers aren't equal"); // Numbers are equal

preem.checkIf(arr).isIncludes(s1, arr + " includes " + s1, arr + " isn't includes " + s1); // Hello,World,foo includes Hello 

preem.start();