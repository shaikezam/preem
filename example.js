// Change './index' to 'preem' if you use this code outside of this package
let preem = require('./preem');

let s1 = "Hello",
    s2 = "World",
    n1 = 1,
    n2 = 1,
    c1 = '3',
    c3 = 'f';
preem.when("Test primitive types").equal(s1, s2, "Strings are equal", "Strings aren't equal").equal(n1, n2, "Numbers are equal", "Numbers aren't equal").equal(c1, c3, "Character are equal", "Character aren't equal");