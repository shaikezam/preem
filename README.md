# preem

Lightweight, easy-to-use JavaScript test library

## Usage

First, install the package using npm:

    npm install preem --save

Then, require the package and use it like so:

    let preem = require('preem');

    let s1 = "Hello",
        s2 = "World";
    preem.checkIf(s1).isNotEqualTo(s2, "Strings aren't equal", "Strings are equal"); // Strings aren't equal
    
Or, you can use with isEqualTo:

    let n1 = 1,
        n2 = 1,
    preem.checkIf(n1).isEqualTo(n2, "Numbers are equal", "Numbers aren't equal"); // Numbers are equal
    
For testing Arrays:

    let s1 = "Hello",
        arr = ['Hello', 'World', 'foo'];
    // same goes for strings includes
    preem.checkIf(arr).isIncludes(s1, arr + " includes 'World'", "Array isn't includes 'World'"); // Hello,World,foo includes 'World' 

## License

MIT
