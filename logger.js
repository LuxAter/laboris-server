String.prototype.format = function(arguments) {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

const __log = (type, msg, opts) => {
  const currentDate = new Date();
  opts = {
    hour: currentDate.getHours().toString().padStart(2, '0'),
    minute: currentDate.getMinutes().toString().padStart(2, '0'),
    second: currentDate.getSeconds().toString().padStart(2, '0'),
    ...opts
  }
  msg = msg.format(opts);
  console.log(this.format[type].color + this.format[type].fmt.format({
    msg: msg,
    ...opts
  }) + '\033[0m');
}

module.exports.format = {
  express: {
    fmt: '<{hour}:{minute}:{second}> [express] {msg}',
    color: '\033[1;36m'
  },
  lowdb: {
    fmt: '<{hour}:{minute}:{second}> [lowdb  ] {msg}',
    color: '\033[1;35m'
  },
  error: {
    fmt: '<{hour}:{minute}:{second}> [error  ] {msg}',
    color: '\033[1;31m'
  },
  warning: {
    fmt: '<{hour}:{minute}:{second}> [warning] {msg}',
    color: '\033[1;33m'
  }
}

module.exports.express = (msg, opts = {}) => __log('express', msg, opts);
module.exports.lowdb = (msg, opts = {}) => __log('lowdb', msg, opts);
module.exports.error = (msg, opts = {}) => __log('error', msg, opts);
module.exports.warning = (msg, opts = {}) => __log('warning', msg, opts);
