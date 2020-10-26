/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-undef-init */
/* eslint-disable eqeqeq */
import XmlToJson from './XmlToJson'
// eslint-disable-next-line no-unexpected-multiline
(function () {
  var endScopeObj = {}
  window.obj2xmlsan = function (obj, opt) {
    if (!opt) opt = {}
    var rootName = opt.rootName || 'root'
    var declaration = opt.declaration === 'auto' ? '<?xml version="1.0" encoding="utf-8"?>' : opt.declaration
    var indentation = opt.indentation || 0
    var generateDtd = (opt.doctype === 'auto' || opt.doctype === 'generate') && declaration
    var useAttributes = opt.attributes !== false
    var scope_indent = 0
    if (generateDtd) {
      var dtdAttr = {}
      var dtdElem = {}
    }
    var ret = []
    var tagContent; var isArr; var curs; var _t; var _ti; var key; var innerKey; var name; var queue = [obj, rootName]
    while (queue.length > 0) {
      name = queue.pop()
      curs = queue.pop()
      if (generateDtd) { dtdElem[name] = dtdElem[name] || {} }
      if (curs === endScopeObj) {
        scope_indent--
        if (indentation > 0) ret.push('\n', ' '.repeat(indentation * scope_indent))
        ret.push('</', name, '>')
        continue
      }
      if (typeof curs === 'object') {
        queue.push(endScopeObj)
        queue.push(name)
        tagContent = [name]
        isArr = Array.isArray(curs)
        if (isArr && generateDtd) {
          dtdElem[name][name + 'Item*'] = true
        }
        for (key in curs) {
          if (curs.hasOwnProperty(key)) {
            if (isArr) {
              queue.push(curs[key])
              queue.push(name + 'Item')
            } else if (typeof curs[key] == 'object' || useAttributes === false) {
              queue.push(curs[key])
              queue.push(key)
              if (generateDtd) { dtdElem[name][key] = true }
            } else {
              if (generateDtd) {
                dtdAttr[name] = dtdAttr[name] || {}
                dtdAttr[name][key] = true
              }
              tagContent.push(key + '=' + '"' + curs[key] + '"')
            }
          }
        }
        if (indentation > 0) ret.push('\n', ' '.repeat(indentation * scope_indent))
        ret.push('<', tagContent.join(' '), '>')
        scope_indent++
      } else {
        if (generateDtd) { dtdElem[name]['#PCDATA'] = true }
        if (indentation > 0) ret.push('\n', ' '.repeat(indentation * scope_indent))
        ret.push('<')
        ret.push(name)
        ret.push('>')
        ret.push(curs)
        ret.push('</')
        ret.push(name)
        ret.push('>')
      }
    }
    if (generateDtd) {
      var dtd = ['<!DOCTYPE ', rootName, ' [']
      for (key in dtdAttr) {
        if (dtdAttr.hasOwnProperty(key)) {
          for (innerKey in dtdAttr[key]) {
            if (dtdAttr[key].hasOwnProperty(innerKey)) {
              if (indentation > 0) dtd.push('\n')
              dtd.push('<!ATTLIST ', key, ' ', innerKey, ' CDATA #IMPLIED>')
            }
          }
        }
      }
      for (key in dtdElem) {
        if (dtdElem.hasOwnProperty(key)) {
          innerKey = null
          _t = ['<!ELEMENT ', key, ' (']
          _ti = []
          for (innerKey in dtdElem[key]) {
            if (dtdElem[key].hasOwnProperty(innerKey)) {
              _ti.push(innerKey)
            }
          }
          if (indentation > 0) dtd.push('\n')
          if (innerKey === null) { dtd.push('<!ELEMENT ', key, ' EMPTY>') } else {
            _t.push(_ti.join(', '))
            _t.push(')>')
            dtd.push.apply(dtd, _t)
          }
        }
      }
      dtd.push(']>')
      ret.unshift.apply(ret, dtd)
    } else if (declaration) { ret.unshift(opt.doctype ? opt.doctype : '<!DOCTYPE ' + rootName + '>') }
    if (declaration) ret.unshift(declaration)
    return ret.join('')
  }

  window.xml2obj = function xml2obj (xml, opt) {
    if (typeof xml === 'string') {
      var dom = (new DOMParser()).parseFromString(xml, 'application/xml')
      xml = dom.childNodes[dom.childNodes.length - 1]
    }
    opt = opt || {}
    var attrPrefix = opt.attrPrefix || ''
    function toObj (xml) {
      var n; var o = {}
      if (xml.nodeType == 1) {
        if (xml.attributes.length) {
          for (var i = 0; i < xml.attributes.length; i++) {
            o[attrPrefix + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || '').toString()
          }
        }
        if (xml.firstChild) {
          var textChild = 0; var cdataChild = 0; var hasElementChild = false
          for (n = xml.firstChild; n; n = n.nextSibling) {
            if (n.nodeType == 1) {
              hasElementChild = true
            } else {
              if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
                textChild++
              } else {
                if (n.nodeType == 4) {
                  cdataChild++
                }
              }
            }
          }
          if (hasElementChild) {
            if (textChild < 2 && cdataChild < 2) {
              removeWhite(xml)
              for (n = xml.firstChild; n; n = n.nextSibling) {
                if (n.nodeType == 3) {
                  o['#text'] = escape(n.nodeValue)
                } else {
                  if (n.nodeType == 4) {
                    o['#cdata'] = escape(n.nodeValue)
                  } else {
                    if (o[n.nodeName]) {
                      if (o[n.nodeName] instanceof Array) {
                        o[n.nodeName][o[n.nodeName].length] = toObj(n)
                      } else {
                        o[n.nodeName] = [o[n.nodeName], toObj(n)]
                      }
                    } else {
                      o[n.nodeName] = toObj(n)
                    }
                  }
                }
              }
            } else {
              if (!xml.attributes.length) {
                o = escape(innerXml(xml))
              } else {
                o['#text'] = escape(innerXml(xml))
              }
            }
          } else {
            if (textChild) {
              if (!xml.attributes.length) {
                o = escape(innerXml(xml))
              } else {
                o['#text'] = escape(innerXml(xml))
              }
            } else {
              if (cdataChild) {
                if (cdataChild > 1) {
                  o = escape(innerXml(xml))
                } else {
                  for (n = xml.firstChild; n; n = n.nextSibling) {
                    o['#cdata'] = escape(n.nodeValue)
                  }
                }
              }
            }
          }
        }
        if (!xml.attributes.length && !xml.firstChild) {
          o = null
        }
      } else {
        if (xml.nodeType == 9) {
          o = toObj(xml.documentElement)
        } else {
          alert('unhandled node type: ' + xml.nodeType)
        }
      }
      return o
    }
    function innerXml (node) {
      var s = ''
      if ('innerHTML' in node) {
        s = node.innerHTML
      } else {
        var asXml = function (n) {
          var s = ''
          if (n.nodeType == 1) {
            s += '<' + n.nodeName
            for (var i = 0; i < n.attributes.length; i++) {
              s += ' ' + n.attributes[i].nodeName + '="' + (n.attributes[i].nodeValue || '').toString() + '"'
            }
            if (n.firstChild) {
              s += '>'
              for (var c = n.firstChild; c; c = c.nextSibling) {
                s += asXml(c)
              }
              s += '</' + n.nodeName + '>'
            } else {
              s += '/>'
            }
          } else {
            if (n.nodeType == 3) {
              s += n.nodeValue
            } else {
              if (n.nodeType == 4) {
                s += '<![CDATA[' + n.nodeValue + ']]\x3e'
              }
            }
          }
          return s
        }
        for (var c = node.firstChild; c; c = c.nextSibling) {
          s += asXml(c)
        }
      }
      return s
    }
    function escape (txt) {
      return txt.replace(/[\\]/g, '\\\\').replace(/["]/g, '\\"').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r')
    }
    function removeWhite (e) {
      e.normalize()
      for (var n = e.firstChild; n;) {
        if (n.nodeType == 3) {
          if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
            var nxt = n.nextSibling
            e.removeChild(n)
            n = nxt
          } else {
            n = n.nextSibling
          }
        } else {
          if (n.nodeType == 1) {
            removeWhite(n)
            n = n.nextSibling
          } else {
            n = n.nextSibling
          }
        }
      }
      return e
    }
    if (xml.nodeType == 9) {
      xml = xml.documentElement
    }
    var obj = toObj(removeWhite(xml))
    return obj
  }
})()
const JSON_VALUE_TYPES = ['object', 'array', 'number', 'string', 'boolean', 'null']
function xmlToJson1 (xml) {
  var obj = {}

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {}
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j)
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue
  }

  // do children
  // If all text nodes inside, get concatenated text from them.
  var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
    return node.nodeType === 3
  })
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
      return text + node.nodeValue
    }, '')
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i)
      var nodeName = item.nodeName
      if (typeof obj[nodeName] == 'undefined') {
        obj[nodeName] = xmlToJson1(item)
      } else {
        if (typeof obj[nodeName].push == 'undefined') {
          var old = obj[nodeName]
          obj[nodeName] = []
          obj[nodeName].push(old)
        }
        obj[nodeName].push(xmlToJson1(item))
      }
    }
  }
  return obj
}

function xml2obj (xml, opt) {
  if (typeof xml === 'string') {
    var dom = (new DOMParser()).parseFromString(xml, 'application/xml')
    xml = dom.childNodes[dom.childNodes.length - 1]
  }
  opt = opt || {}
  var attrPrefix = opt.attrPrefix || ''
  function toObj (xml) {
    var n; var o = {}
    if (xml.nodeType == 1) {
      if (xml.attributes.length) {
        for (var i = 0; i < xml.attributes.length; i++) {
          o[attrPrefix + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || '').toString()
        }
      }
      if (xml.firstChild) {
        var textChild = 0; var cdataChild = 0; var hasElementChild = false
        for (n = xml.firstChild; n; n = n.nextSibling) {
          if (n.nodeType == 1) {
            hasElementChild = true
          } else {
            if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
              textChild++
            } else {
              if (n.nodeType == 4) {
                cdataChild++
              }
            }
          }
        }
        if (hasElementChild) {
          if (textChild < 2 && cdataChild < 2) {
            removeWhite(xml)
            for (n = xml.firstChild; n; n = n.nextSibling) {
              if (n.nodeType == 3) {
                o['#text'] = escape(n.nodeValue)
              } else {
                if (n.nodeType == 4) {
                  o['#cdata'] = escape(n.nodeValue)
                } else {
                  if (o[n.nodeName]) {
                    if (o[n.nodeName] instanceof Array) {
                      o[n.nodeName][o[n.nodeName].length] = toObj(n)
                    } else {
                      o[n.nodeName] = [o[n.nodeName], toObj(n)]
                    }
                  } else {
                    o[n.nodeName] = toObj(n)
                  }
                }
              }
            }
          } else {
            if (!xml.attributes.length) {
              o = escape(innerXml(xml))
            } else {
              o['#text'] = escape(innerXml(xml))
            }
          }
        } else {
          if (textChild) {
            if (!xml.attributes.length) {
              o = escape(innerXml(xml))
            } else {
              o['#text'] = escape(innerXml(xml))
            }
          } else {
            if (cdataChild) {
              if (cdataChild > 1) {
                o = escape(innerXml(xml))
              } else {
                for (n = xml.firstChild; n; n = n.nextSibling) {
                  o['#cdata'] = escape(n.nodeValue)
                }
              }
            }
          }
        }
      }
      if (!xml.attributes.length && !xml.firstChild) {
        o = null
      }
    } else {
      if (xml.nodeType == 9) {
        o = toObj(xml.documentElement)
      } else {
        alert('unhandled node type: ' + xml.nodeType)
      }
    }
    return o
  }
  function innerXml (node) {
    var s = ''
    if ('innerHTML' in node) {
      s = node.innerHTML
    } else {
      var asXml = function (n) {
        var s = ''
        if (n.nodeType == 1) {
          s += '<' + n.nodeName
          for (var i = 0; i < n.attributes.length; i++) {
            s += ' ' + n.attributes[i].nodeName + '="' + (n.attributes[i].nodeValue || '').toString() + '"'
          }
          if (n.firstChild) {
            s += '>'
            for (var c = n.firstChild; c; c = c.nextSibling) {
              s += asXml(c)
            }
            s += '</' + n.nodeName + '>'
          } else {
            s += '/>'
          }
        } else {
          if (n.nodeType == 3) {
            s += n.nodeValue
          } else {
            if (n.nodeType == 4) {
              s += '<![CDATA[' + n.nodeValue + ']]\x3e'
            }
          }
        }
        return s
      }
      for (var c = node.firstChild; c; c = c.nextSibling) {
        s += asXml(c)
      }
    }
    return s
  }
  function escape (txt) {
    return txt.replace(/[\\]/g, '\\\\').replace(/["]/g, '\\"').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r')
  }
  function removeWhite (e) {
    e.normalize()
    for (var n = e.firstChild; n;) {
      if (n.nodeType == 3) {
        if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
          var nxt = n.nextSibling
          e.removeChild(n)
          n = nxt
        } else {
          n = n.nextSibling
        }
      } else {
        if (n.nodeType == 1) {
          removeWhite(n)
          n = n.nextSibling
        } else {
          n = n.nextSibling
        }
      }
    }
    return e
  }
  if (xml.nodeType == 9) {
    xml = xml.documentElement
  }
  var obj = toObj(removeWhite(xml))
  return obj
}
class JSONFormatter {
  constructor (options) {
    if (options == null) {
      options = {}
    }
    this.options = options
  }

  htmlEncode (html) {
    if (html !== null) {
      return html.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }
    return ''
  }

  jsString (s) {
    s = JSON.stringify(s).slice(1, -1)
    return this.htmlEncode(s)
  }

  decorateWithSpan (value, className) {
    return '<span class="' + className + '">' + (this.htmlEncode(value)) + '</span>'
  }

  valueToHTML (value, level) {
    if (level == null) {
      level = 0
    }
    const valueType = Object.prototype.toString.call(value).match(/\s(.+)]/)[1].toLowerCase()
    if (this.options.strict && valueType.indexOf(JSON_VALUE_TYPES) < 0) {
      throw new Error('' + valueType + ' is not a valid JSON value type')
    }
    // eslint-disable-next-line no-useless-call
    return this[`${valueType}ToHTML`].call(this, value, level)
  }

  nullToHTML () {
    return this.decorateWithSpan('null', 'null')
  }

  undefinedToHTML () {
    return this.decorateWithSpan('undefined', 'undefined')
  }

  numberToHTML (value) {
    return this.decorateWithSpan(value, 'num')
  }

  stringToHTML (value) {
    if (/^(http|https|file):\/\/[^\s]+$/i.test(value)) {
      return '<a href="' + (this.htmlEncode(value)) + '"><span class="q">"</span>' + (this.jsString(value)) + '<span class="q">"</span></a>'
    }
    let multilineClass = ''
    value = this.jsString(value)
    if (this.options.line_break) {
      const newLinePattern = /([^>\\r\\n]?)(\\r\\n|\\n\\r|\\r|\\n)/g
      if (newLinePattern.test(value)) {
        multilineClass = ' multiline'
        value = (value + '').replace(newLinePattern, '$1' + '<br />')
      }
    }
    return '<span class="string' + multilineClass + '">"' + value + '"</span>'
  }

  booleanToHTML (value) {
    return this.decorateWithSpan(value, 'bool')
  }

  arrayToHTML (array, level) {
    if (level === null) {
      level = 0
    }
    let hasContents = false
    let output = ''
    let numProps = array.length
    for (let index = 0, _i = 0, _len = array.length; _i < _len; index = ++_i) {
      hasContents = true
      output += '<li class="array">' + this.valueToHTML(array[index], level + 1)
      if (numProps > 1) {
        output += ','
      }
      output += '</li>'
      numProps--
    }
    if (hasContents) {
      const collapsible = level === 0 ? '' : ' collapsible'
      return '[<ul class="array level' + level + collapsible + '">' + output + '</ul>]'
    }
    return '[ ]'
  }

  objectToHTML (object, level) {
    if (level === null) {
      level = 0
    }
    let hasContents = false
    let output = ''
    let key
    let numProps = Object.getOwnPropertyNames(object).length || 0
    for (const prop in object) {
      hasContents = true
      key = this.options.escape ? this.jsString(prop) : prop
      output += '<li class="space"><a class="prop" href="javascript:;"><span class="q">"</span>' + key + '<span class="q">"</span></a>: ' + (this.valueToHTML(object[prop], level + 1))
      if (numProps > 1) {
        output += ','
      }
      output += '</li>'
      numProps--
    }
    if (hasContents) {
      const collapsible = level === 0 ? '' : ' collapsible'
      return '{<ul class="obj level' + level + collapsible + '">' + output + '</ul>}'
    }
    return '{ }'
  }

  jsonToHTML (json) {
    return this.valueToHTML(json)
  }
}

class Collapser {
  bindEvent (item, options) {
    console.log(item)
    item.firstChild.addEventListener('click', (function (_this) {
      return function (event) {
        return _this.toggle(event.target.parentNode.firstChild, options)
      }
    })(this))
    const collapser = document.createElement('i')
    collapser.className = options.collapsed ? 'collapser v-icon mdi-plus-box theme--light' : 'collapser v-icon mdi mdi-minus-box theme--light'
    collapser.addEventListener('click', (function (_this) {
      return function (event) {
        return _this.toggle(event.target, options)
      }
    })(this))
    item.insertBefore(collapser, item.firstChild)
    if (options.collapsed) {
      return this.collapse(collapser)
    }
  }

  expand (collapser) {
    const target = this.collapseTarget(collapser)
    if (target.style.display === '') {
      return
    }
    const ellipsis = target.parentNode.getElementsByClassName('ellipsis')[0]
    target.parentNode.removeChild(ellipsis)
    target.style.display = ''
    collapser.className = 'collapser v-icon mdi mdi-minus-box theme--light'
    return collapser
  }

  collapse (collapser) {
    const target = this.collapseTarget(collapser)
    if (target.style.display === 'none') {
      return
    }
    target.style.display = 'none'
    const ellipsis = document.createElement('span')
    ellipsis.className = 'ellipsis'
    ellipsis.innerHTML = ' &hellip; '
    target.parentNode.insertBefore(ellipsis, target)
    collapser.className = 'collapser v-icon mdi mdi-plus-box theme--light'
    return collapser
  }

  toggle (collapser, options) {
    if (options == null) {
      options = {}
    }
    const target = this.collapseTarget(collapser)
    const action = target.style.display === 'none' ? 'expand' : 'collapse'
    if (options.recursive_collapser) {
      const collapsers = collapser.parentNode.getElementsByClassName('collapser')
      const _results = []
      for (let _i = 0, _len = collapsers.length; _i < _len; _i++) {
        collapser = collapsers[_i]
        _results.push(this[action](collapser))
      }
      return _results
    }
    return this[action](collapser)
  }

  collapseTarget (collapser) {
    const targets = collapser.parentNode.getElementsByClassName('collapsible')
    if (!targets.length) {
      return
    }
    return targets[0]
  }
}

class ErrorHTML {
  constructor (error) {
    this.error = error
  }

  print (json) {
    const message = this.error.message
    const position = parseInt(message.match(/\d+$/)[0], 10)
    return this.replaceAt(json, position)
  }

  replaceAt (str, index) {
    const replacement = `<mark>${str.charAt(index)}</mark>`
    return str.substr(0, index) + replacement + str.substr(index + 1)
  }

  paint (element) {
    element.innerHTML = `<div role="alert" class="v-alert v-sheet theme--light v-alert--outlined v-alert--text error--text">
    <div class="v-alert__wrapper">
    <i aria-hidden="true" class="v-icon notranslate v-alert__icon mdi mdi-alert theme--light error--text"></i>
    <div class="v-alert__content">${this.error}</div></div></div>`
  }
}

class JSONtoXML {
  parseToXML (o) {
    if (typeof o == 'object' && o.constructor == Object && this.len(o) == 1) {
      for (var a in o) {
        return this.toXML(a, o[a])
      }
    }
  }

  len (o) {
    var n = 0
    for (var a in o) {
      n++
    }
    return n
  }

  toXML (tag, o) {
    var doc = '<' + tag
    if (typeof o === 'undefined' || o === null) {
      doc += '/>'
      return doc
    }
    if (typeof o !== 'object') {
      doc += '>' + this.safeXMLValue(o) + '</' + tag + '>'
      return doc
    }
    if (o.constructor == Object) {
      for (var a in o) {
        if (a.charAt(0) == '@') {
          if (typeof o[a] !== 'object') {
            doc += ' ' + a.substring(1) + '="' + o[a] + '"'
            delete o[a]
          } else {
            throw new Error((typeof o[a]) +
              ' being attribute is not supported.')
          }
        }
      }
      if (this.len(o) === 0) {
        doc += '/>'
        return doc
      } else {
        doc += '>'
      }
      if (typeof o['#text'] !== 'undefined') {
        if (typeof o['#text'] !== 'object') {
          doc += o['#text']
          delete o['#text']
        } else {
          throw new Error((typeof o['#text']) +
            ' being #text is not supported.')
        }
      }
      for (var b in o) {
        if (o[b].constructor == Array) {
          for (var i = 0; i < o[b].length; i++) {
            if (typeof o[b][i] !== 'object' ||
              o[b][i].constructor == Object) {
              doc += this.toXML(b, o[b][i])
            } else {
              throw new Error((typeof o[b][i]) +
                ' is not supported.')
            }
          }
        } else if (o[b].constructor == Object ||
          typeof o[b] !== 'object') {
          doc += this.toXML(b, o[b])
        } else {
          throw new Error((typeof o[b]) + ' is not supported.')
        }
      }
      doc += '</' + tag + '>'
      return doc
    }
  }

  safeXMLValue (value) {
    var s = value.toString()
    s = s.replace('/\\&/g', '&amp;')
    s = s.replace('/\\"/g', '&quot;')
    s = s.replace('/</g', '&lt;')
    s = s.replace('/>/g', '&gt;')
    return s
  }
}
export default {
  StringToJson: (element, json, options) => {
    try {
      const defaultOptions = {
        collapsed: false,
        line_break: true,
        recursive_collapser: false,
        escape: true,
        strict: false
      }
      options = options || {}
      options = Object.assign({}, defaultOptions, options)
      const formatter = new JSONFormatter(options)
      if (Object.prototype.toString.call(json) === '[object String]') {
        json = JSON.parse(json)
      }
      const formatedJSON = formatter.jsonToHTML(json)
      element.innerHTML = formatedJSON
      const items = element.getElementsByClassName('collapsible')
      const _results = []
      const collapser = new Collapser()
      let item
      for (let _i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i]
        if (item.parentNode.nodeName === 'LI') {
          _results.push(collapser.bindEvent(item.parentNode, options))
        }
      }
      return true
    } catch (err) {
      const error = new ErrorHTML(err)
      element.innerHTML = `<code class="full-width">${err.message}</code><pre>${error.print(json)}</pre>`
      return false
    }
  },
  MinifyJson: (element, json) => {
    try {
      const minifiedJson = JSON.stringify(JSON.parse(json))
      element.innerHTML = minifiedJson
      return true
    } catch (err) {
      const error = new ErrorHTML(err)
      element.innerHTML = `<code class="full-width">${err.message}</code><pre>${error.print(json)}</pre>`
      return false
    }
  },
  JSONtoXML: (element, json) => {
    if (Object.prototype.toString.call(json) === '[object String]') {
      json = JSON.parse(json)
    }
    var xml = window.obj2xmlsan(json)
    var formatted = ''; var indent = ''
    var tab = '\t'
    xml.split(/>\s*</).forEach(function (node) {
      if (node.match(/^\/\w/)) indent = indent.substring(tab.length) // decrease indent by one 'tab'
      formatted += indent + '<' + node + '>\r\n'
      if (node.match(/^<?\w[^>]*[^\\/]$/)) indent += tab // increase indent
    })
    element.innerText = formatted.substring(1, formatted.length - 3)
  },
  XMLtoJSON: (element, data) => {
    try {
      const xml2Json = new XmlToJson()
      const json = xml2Json.parse(data)
      // this.StringToJson(element, json)
      element.innerHTML = '<pre>' + JSON.stringify(json, null, 4) + '</pre>'
    } catch (err) {
      const error = new ErrorHTML(err)
      error.paint(element)
    }
  }
}
