# preem

A lightwhight, easy-to-use library for unit and integration testing javascript code.

## Usage

First, install the package using npm:

    npm install preem --save

Then, require the package and use it like so:

    let preem = require('preem');

    let s1 = "Hello",
        s2 = "World",
        n1 = 1,
        n2 = 1,
        c1 = '3',
        c3 = 'f';
    preem.when("Test primitive types").equal(s1, s2, "Strings are equal", "Strings aren't equal").equal(n1, n2, "Numbers are equal", "Numbers aren't equal").equal(c1, c3, "Character are equal", "Character aren't equal");

## License

MIT
