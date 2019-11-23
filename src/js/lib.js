const lib = {
  isEmpty: (str) => (str ? !str.trim() : true),

  isElement: (o) => (
    typeof HTMLElement === 'object' ? o instanceof HTMLElement
      : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
  ),

  isEmail: (str) => (!((/[a-z0-9]+@+[a-z0-9]+\.+[a-z]{3,}/i.test(str) === false || /[^a-z0-9.@]/i.test(str) === true))),

  isDescendant: (e, query) => {
    const matches = typeof (query) === 'string' ? document.querySelectorAll(query) : query;
    let el = lib.isElement(e) ? e : document.querySelector(e);
    let matchesLen = 0;
    if (lib.isElement(matches)) {
      if (query.contains(el)) return query;
    } else if (matches) {
      matchesLen = matches.length;
      while (el && !(el.tagName === 'HTML')) {
        for (let i = 0; i < matchesLen; i += 1) {
          if (el === matches[i]) return el;
        }

        el = el.parentElement;
      }
    }
    return false;
  },

  isUpperCase: (v) => (!!(v.toUpperCase() !== v.toLowerCase() && v === v.toUpperCase())),

  isLowerCase: (v) => (!!(v.toUpperCase() !== v.toLowerCase() && v === v.toLowerCase())),

  sepCamelWord: (str) => {
    let i = str.length - 1;
    let newStr = '';
    for (i; i >= 0; i -= 1) newStr = lib.isUpperCase(str[i]) ? ` ${str[i].toLowerCase()}${newStr}` : `${str[i]}${newStr}`;
    return newStr;
  },
  popMessage: (m, timeout = 4500) => {
    const animationTime = 300; // <== value must be the same here and in general.less
    const showMsg = (msg) => {
      setTimeout(() => {
        msg.classList.add('show');
      }, 100);
    };
    let popMessage = document.querySelector('#popMessage');
    const msg = document.createElement('DIV');
    msg.classList = 'message';
    msg.innerHTML = m;

    if (!popMessage) {
      // alert('popMessage not created yet');
      popMessage = document.createElement('DIV');
      popMessage.id = 'popMessage';
      popMessage.appendChild(msg);
      document.querySelector('#root .App').appendChild(popMessage);
      showMsg(msg);
    } else {
      popMessage.appendChild(msg);
      showMsg(msg);
    }

    setTimeout(() => {
      msg.classList.remove('show');
      setTimeout(() => {
        popMessage.removeChild(msg);
        if (!popMessage.children[0]) {
          document.querySelector('#root .App').removeChild(popMessage);
        }
      }, animationTime);
    }, timeout);
  },

};

export default lib;
