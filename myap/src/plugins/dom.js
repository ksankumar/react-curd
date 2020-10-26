/* eslint-disable no-undef */
/* eslint-disable no-throw-literal */
/* eslint-disable no-unused-vars */
(function (global, factory) {
  'use strict'
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = global.document
      ? factory(global, true)
      : function (w) {
        if (!w.document) {
          throw new Error('jQuery requires a window with a document')
        }
        return factory(w)
      }
  } else {
    factory(global)
  }

  // Pass this if window is not defined yet
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
  'use strict'
  console.log('called')
  var document = window.document
  var ep = Element.prototype
  var matchPrefixes = ['webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector']
  var fn = function () { }
  var wd = [('innerHeight' in window) ? window.innerHeight : document.documentElement.clientHeight, ('innerWidth' in window) ? window.innerWidth : document.documentElement.clientWidth]
  var bind = window.addEventListener ? 'addEventListener' : 'attachEvent'
  var unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent'
  var prefix = bind !== 'addEventListener' ? 'on' : ''
  var hasClass
  var addClass
  var removeClass
  var toggleClass

  var matchEx = {
    TAGS: 'body header section aside article nav address abbr area audio b base basefont bdi bdo blockquote button canvas center cite code col colgroup datalist dd delement details dfn dialog div dl dt em embed fielementdset figcaptain figure font footer form h1 h2 h3 h4 h5 h6 head hr i iframe img input lable legend li link main map mark menu menuitem meter object ol optgroup option output p param pre progress q rp rt s selementect small source span strong sub summary sup table thead tbody tr th td teatarea tfoot time title track u ul video wbr'.split(' '),
    ID: /^(?:#([\w-]*))dom/,
    CLASS: /^(?:#([\w-]*))dom/,
    TAG: /<([\w-]*)>/
  }
  var focusable = /^(?:input|select|textarea|button)$/i
  var Util = {
    isArray: function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]'
    },
    focus: function (el) {
      return (focusable.test(el.nodeName) && document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(el.type || el.href || ~el.tabIndex))
    }
  }
  function DOM (element, selector) {
    this.length = element ? element.length : 0
    selector = selector.length ? selector[0] : selector
    this.selector = selector || null
    return selector ? dom.extend(this, element) : this
  }
  DOM.prototype = {
    /**
     * loop through a NodeList and do something with each element
     * @method each
     * @param  {Method} callBack
     * @return {Array/Object}
     */
    each: function (callBack) {
      return dom.each(this, callBack)
    },
    /**
     * Attach an event handler function for one or more events to the selected elements
     * @method on
     * @param  {String} event   name of the event
     * @param  {Method} callBack
     * @return {Object}
     */
    on: function (event, callBack) {
      var l = this.length
      var selector = this.selector
      while (l--) {
        this[l][unbind](prefix + event, callBack, false)
        this[l][bind](prefix + event, callBack, false)
        Events.add(selector, this[l], event, callBack, l)
      }
      return this
    },
    html: function (value) {
      if (value === undefined) {
        return this.nodeType === 1 ? this.innerHTML.replace(/(?:null|\d+)/g, '') : this[0].innerHTML.replace(/(?:null|\d+)/g, '')
      }
      if (typeof value === 'string') {
        var i = 0
        var l = this.length
        for (; i < l; i++) {
          this[i].innerHTML = value
        }
      }
      return this
    },
    insertAfter: function (html) {
      this[0].parentNode.insertBefore(html, this[0].nextSibling)
    },
    insertBefore: function (html) {
      this[0].parentNode.insertBefore(html[0], this[0])
    },
    parent: function () {
      var parent = this[0].parentNode
      return (parent && parent.nodeType !== 11) ? dom(parent) : null
    },
    /**
     * Getting all parents DOM node of an element.
     * @method parents
     * @return {Object} DOM instance
     */
    parents: function () {
      var nodes = []
      var element = this[0]
      while (element.parentNode) {
        nodes.push(element.parentNode)
        element = element.parentNode
      }
      return dom(nodes)
    },
    focus: function (callBack) {
      if (Util.focus(this[0])) {
        if (dom.isFunction(callBack)) {
          this.on('focus', callBack)
        } else {
          this[0].focus()
          return false
        }
      }
    }
  }
  var dom = function (selector) {
    var match; var selectorActions = {
      '.': function () {
        match = selector.match(matchEx.CLASS)
        return (match && match[1]) ? document.getElementByClassName(match[1]) : document.querySelectorAll(selector)
      },
      '#': function () {
        match = selector.match(matchEx.ID)
        return (match && match[1]) ? [document.getElementById(match[1])] : document.querySelectorAll(selector)
      },
      '<': function () {
        var nodeName
        match = selector.match(matchEx.TAG)
        if (match === null || match === undefined) {
          const newLocal = 'Invalid selector / Node'
          throw newLocal
        }
        nodeName = match[0].replace('<', '').replace('>', '')
        return document.createElement(nodeName)
      }
    }
    var element; var token = selector[0]
    if (selector.nodeType) {
      element = [selector]
    } else if (typeof selectorActions[token] !== 'function') {
      element = (typeof selector === 'string') ? matchEx.TAGS.indexOf(selector) > -1 ? document.getElementsByTagName(selector) : document.querySelectorAll(selector) : selector
    } else {
      element = selectorActions[token]()
    }
    if (!element.length) { throw selector + ' Node not found in DOM.' }
    return new DOM(element, selector)
  }

  var Events = {
    events: {},
    add: function (selector, target, event, callBack, index) {
      this.events[selector + index + event] = {
        event: event,
        callBack: callBack || fn,
        target: target,
        exist: 1
      }
    },
    unbind: function (selector, target, event, callBack, index) {
      var bindedEvt; var eventName = selector + index + event
      bindedEvt = this.events[eventName] || { target: target, event: event, callBack: callBack || fn }
      if (bindedEvt.exist) {
        delete this.events[eventName]
      }
      return bindedEvt
    }
  }

  if ('classList' in document.documentElement) {
    hasClass = function (element, name) {
      return element.classList.contains(name)
    }
    addClass = function (element, name) {
      element.classList.add(name)
    }
    removeClass = function (element, name) {
      element.classList.remove(name)
    }
    toggleClass = function (element, name) {
      element.classList.toggle(name)
    }
  } else {
    hasClass = function (element, name) {
      return new RegExp('(^|\\s)' + name + '(\\s|dom)').test(element.className)
    }
    addClass = function (element, name) {
      if (!hasClass(element, name)) {
        element.className += (element.className ? ' ' : '') + name
      }
    }
    removeClass = function (element, name) {
      if (hasClass(element, name)) {
        element.className = element.className.replace(new RegExp('(^|\\s)*' + name + '(\\s|dom)*', 'g'), '')
      }
    }
    toggleClass = function (element, name) {
      (hasClass(element, name) ? removeClass : addClass)(element, name)
    }
  }

  dom.ready = dom.prototype.ready = function (callBack) {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      callBack()
    } else if (document.addEventListener) {
      // Use the handy event callBack
      document.addEventListener('DOMContentLoaded', callBack)
    } else {
      // Ensure firing before onload, maybe late but safe also for iframes
      document.attachEvent('onreadystatechange', callBack)
    }
  }
  /**
   * loop through a NodeList or  and do something with each element
   * @method each
   * @param  {Object} obj Object/Array for iterate
   * @param  {Method} callBack
   * @return {Array/Object}
   */
  dom.each = dom.prototype.each = function (iterableItem, callBack) {
    var length; var keyOrIndex = 0
    var retVal
    if (this.isArray(iterableItem)) {
      length = iterableItem.length
      for (; keyOrIndex < length; keyOrIndex++) {
        retVal = callBack(keyOrIndex, iterableItem[keyOrIndex])
        if (retVal === false) {
          break
        }
      }
    } else {
      for (keyOrIndex in iterableItem) {
        if (Object.prototype.hasOwnProperty.call(iterableItem, keyOrIndex)) {
          retVal = callBack(keyOrIndex, iterableItem[keyOrIndex])
          if (retVal === false) {
            break
          }
        }
      }
    }
    return iterableItem
  }
  /**
   * Extend or Merge a JavaScript object with the key/value pairs of another.
   * @method extend
   * @return {Object} DOM instance
   */
  dom.extend = dom.prototype.extend = function () {
    var target = {}
    var len = arguments.length
    var args
    var i = 0
    if (!len) { return target }
    for (; i < len; i++) {
      args = arguments[i]
      for (var key in args) {
        target[key] = args[key]
      }
    }
    args = null
    return target
  }

  dom.merge = dom.prototype.merge = function (first, second) {
    var len = +second.length
    var j = 0
    var i = first.length

    for (; j < len; j++) {
      first[i++] = second[j]
    }
    first.length = i
    return first
  }
  if (typeof define === 'function' && define.amd) {
    define('dom', [], function () {
      return dom
    })
  }

  window.dom = dom

  if (typeof noGlobal === 'undefined') {
    window.dom = dom
  }

  return dom
})
