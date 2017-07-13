# preem

Lightweight, easy-to-use JavaScript test library

## Usage

First, install the package using npm:

    npm install preem --save

Then, require the package and use it like so:

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

    preem.checkIf(arr).isIncludes(s1, arr + " includes 'World'", "Array isn't includes 'World'"); // Hello,World,foo includes 'World' 

    preem.start();

## License

MIT
