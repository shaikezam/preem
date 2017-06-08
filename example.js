// Change './index' to 'preem' if you use this code outside of this package
var preem = require('./index');

console.log(preem("")); // true
console.log(preem(null)); // true
console.log(preem(undefined)); // true

console.log(preem("Hello World")); // false