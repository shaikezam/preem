// Change './index' to 'preem' if you use this code outside of this package
var myPreem = require('./index');

console.log(myPreem("")); // true
console.log(myPreem(null)); // true
console.log(myPreem(undefined)); // true

console.log(myPreem("Hello World")); // false