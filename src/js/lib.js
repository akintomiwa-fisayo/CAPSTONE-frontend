const lib = {
  isEmpty: (str = '') => (!str.trim()),
  isElement: (o) => (
    typeof HTMLElement === 'object' ? o instanceof HTMLElement
      : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
  ),
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

};

export default lib;
