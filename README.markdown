# tsa

**Guard your REST API with a touch of fascism.**

## Installation

```bash
$ npm install tsa
```

## Usage

Create a guard:

```javascript
var tsa = require('tsa');
var guard = tsa({
    property1: tsa.required()
  , property2: tsa.optional()
});
```

Validate input against guard:

```javascript
var input = {
    property1: 'foo'
  , property3: 'bar'
};
guard.frisk(input, function(err, result){
  // err is null
  // result.property1 === 'foo'
  // result.property2 === undefined
  // there is no key result.property3
});
```

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))
