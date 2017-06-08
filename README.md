# preem

A Node.js package that checks whether a given string is null or empty. A basic package for an npm publish tutorial.

## Usage

First, install the package using npm:

    npm install preem --save

Then, require the package and use it like so:

    var myPreem = require('is-null-or-empty');

    console.log(myPreem("")); // true
    console.log(myPreem(null)); // true
    console.log(myPreem(undefined)); // true

    console.log(myPreem("Hello World")); // false

## License

MIT