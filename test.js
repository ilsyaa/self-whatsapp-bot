const currency = require('./src/utils/currency.js');

console.log(currency.subtract(10, 9))
console.log(currency.subtract(10, 10))
console.log(currency.subtract(10, 11))

if(currency.subtract(10, 9)) {
    console.log('Uang Cukup')
} else {
    console.log('Uang Kurang')
}