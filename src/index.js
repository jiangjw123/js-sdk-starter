import { add } from 'common/tool.js'
import './style/index.css'
function tracelog (target, name, descriptor) {
  var oldValue = descriptor.value;
  descriptor.value = function () {
    let argString = '';
    for (let i = 0; i < arguments.length; i++) {
      if (argString) {
        argString += ', ' + JSON.stringify(arguments[i])
      } else {
        argString += JSON.stringify(arguments[i])
      }
    }

    if (argString) {
      console.log(`${name}: ` + argString);
    } else {
      console.log(`'${name}'`);
    }
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}
add()
console.log(1111)
class Demo {
  @tracelog
  getDemo () {
  }
}
export default Demo
