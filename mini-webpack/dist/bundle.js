(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    const module = {
      exports: {},
    };
    fn(localRequire, module, module.exports);

    return modules.exports;

    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }
  }

  require(0);
})({
  0: [
    function (require, module, exports) {
      'use strict';

      var _foo = require('./foo.js');

      var _foo2 = _interopRequireDefault(_foo);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      (0, _foo2.default)();
      console.log('main.js');
    },
    { './foo.js': 1 },
  ],

  1: [
    function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.foo = foo;

      function foo() {
        console.log('foo');
      }
    },
    {},
  ],
});
