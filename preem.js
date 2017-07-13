require('colors');
module.exports = {
    when: function(sDescription) {
        console.log(sDescription);
        return {
            equal: function(expected, actual, sPassString, sFailsString) {
                expected === actual ? console.log(sPassString.green) : console.log(sFailsString.red);
                return this;
            }
        }
    }
};