/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-useless-escape */
/* eslint no-useless-escape: "error" */

var TAB = '   '
var dateObj = new Date()
var regexpObj = new RegExp()
var rules = {
  def: 'color:black',
  defKey: function (match) {
    return '<strong>' + match + '</strong>'
  },
  types: [
    {
      name: 'True',
      regex: /true/,
      type: 'boolean',
      style: 'color:lightgreen'
    },

    {
      name: 'False',
      regex: /false/,
      type: 'boolean',
      style: 'color:lightred'
    },

    {
      name: 'Unicode',
      regex: /"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?/,
      type: 'string',
      style: 'color:green'
    },

    {
      name: 'Null',
      regex: /null/,
      type: 'nil',
      style: 'color:magenta'
    },

    {
      name: 'Number',
      regex: /-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/,
      type: 'number',
      style: 'color:darkorange'
    },

    {
      name: 'Whitespace',
      regex: /\s+/,
      type: 'whitespace',
      style: function (match) {
        return '&nbsp'
      }
    }
  ]
}

function IsArray (obj) {
  return obj && typeof obj === 'object' && typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'))
}

function ProcessObject (obj, indent, addComma, isArray, isPropertyContent) {
  var html = ''

  var comma = (addComma) ? "<span class='Comma'>,</span> " : ''

  var type = typeof obj

  var clpsHtml = ''

  if (IsArray(obj)) {
    if (obj.length === 0) {
      html += GetRow(indent, "<span class='ArrayBrace'>[ ]</span>" + comma, isPropertyContent)
    } else {
      clpsHtml = "<span><i class='minus square outline icon' onClick='ExpImgClicked(this)'></i></span><span class='collapsible'>"

      html += GetRow(indent, "<span class='ArrayBrace'>[</span>" + clpsHtml, isPropertyContent)

      for (var i = 0; i < obj.length; i++) {
        html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false)
      }

      clpsHtml = '</span>'

      html += GetRow(indent, clpsHtml + "<span class='ArrayBrace'>]</span>" + comma)
    }
  } else if (type === 'object') {
    if (obj === null) {
      html += FormatLiteral('null', '', comma, indent, isArray, 'Null')
    } else if (obj.constructor == dateObj.constructor) {
      html += FormatLiteral('new Date(' + obj.getTime() + ') /*' + obj.toLocaleString() + '*/', '', comma, indent, isArray, 'Date')
    } else if (obj.constructor == regexpObj.constructor) {
      html += FormatLiteral('new RegExp(' + obj + ')', '', comma, indent, isArray, 'RegExp')
    } else {
      var numProps = 0

      var prop

      for (prop in obj) { numProps++ }

      if (numProps === 0) {
        html += GetRow(indent, "<span class='ObjectBrace'>{ }</span>" + comma, isPropertyContent)
      } else {
        clpsHtml = "<span><i class='minus square outline icon' onClick='ExpImgClicked(this)'></i></span><span class='collapsible'>"

        html += GetRow(indent, "<span class='ObjectBrace'>{</span>" + clpsHtml, isPropertyContent)

        var j = 0

        for (prop in obj) {
          html += GetRow(indent + 1, "<span class='PropertyName'>\"" + prop + '"</span>: ' + ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true))
        }
        clpsHtml = '</span>'
        html += GetRow(indent, clpsHtml + "<span class='ObjectBrace'>}</span>" + comma)
      }
    }
  } else if (type === 'number') {
    html += FormatLiteral(obj, '', comma, indent, isArray, 'Number')
  } else if (type === 'boolean') {
    html += FormatLiteral(obj, '', comma, indent, isArray, 'Boolean')
  } else if (type === 'function') {
    if (obj.constructor == regexpObj.constructor) {
      html += FormatLiteral('new RegExp(' + obj + ')', '', comma, indent, isArray, 'RegExp')
    } else {
      obj = FormatFunction(indent, obj)

      html += FormatLiteral(obj, '', comma, indent, isArray, 'Function')
    }
  } else if (type === 'undefined') {
    html += FormatLiteral('undefined', '', comma, indent, isArray, 'Null')
  } else {
    html += FormatLiteral(obj.toString().split('\\').join('\\\\').split('"').join('\\"'), '"', comma, indent, isArray, 'String')
  }

  return html
}

function FormatLiteral (literal, quote, comma, indent, isArray, style) {
  const styles = {
    Function: 'color:green',
    Number: 'color:darkorange',
    Boolean: 'color:blue',
    Null: 'color:magenta',
    RegExp: 'color:red'
  }

  if (typeof literal === 'string') { literal = literal.split('<').join('&lt;').split('>').join('&gt;') }

  var str = "<span style='" + styles[style] + "' class='" + style + "'>" + quote + literal + quote + comma + '</span>'

  if (isArray) str = GetRow(indent, str)

  return str
}

function FormatFunction (indent, obj) {
  var tabs = ''

  var i = 0

  for (; i < indent; i++) { tabs += TAB }

  var funcStrArray = obj.toString().split('\n')

  var str = ''

  for (i = 0; i < funcStrArray.length; i++) {
    str += ((i === 0) ? '' : tabs) + funcStrArray[i] + '\n'
  }

  return str
}

function GetRow (indent, data, isPropertyContent) {
  var tabs = ''

  for (var i = 0; i < indent && !isPropertyContent; i++) tabs += TAB

  if (data !== null && data.length > 0 && data.charAt(data.length - 1) !== '\n') { data = data + '\n' }

  return tabs + data
}

function ExpImgClicked (collapsible) {
  var container = collapsible.parentNode.nextSibling

  if (!container) return

  var display = 'none'

  var collapsibleClassname = 'plus square outline icon'

  if (container.style.display === 'none') {
    display = 'inline'

    collapsibleClassname = 'minus square outline icon'
  }

  container.style.display = display

  collapsible.className = collapsibleClassname
}

export default {
  neatJSON: (value, opts) => {
    opts = opts || {}
    if (!('wrap' in opts)) opts.wrap = 80
    if (opts.wrap === true) opts.wrap = -1
    if (!('indent' in opts)) opts.indent = '  '
    if (!('arrayPadding' in opts)) opts.arrayPadding = ('padding' in opts) ? opts.padding : 0
    if (!('objectPadding' in opts)) opts.objectPadding = ('padding' in opts) ? opts.padding : 0
    if (!('afterComma' in opts)) opts.afterComma = ('aroundComma' in opts) ? opts.aroundComma : 0
    if (!('beforeComma' in opts)) opts.beforeComma = ('aroundComma' in opts) ? opts.aroundComma : 0
    if (!('afterColon' in opts)) opts.afterColon = ('aroundColon' in opts) ? opts.aroundColon : 0
    if (!('beforeColon' in opts)) opts.beforeColon = ('aroundColon' in opts) ? opts.aroundColon : 0

    var apad = repeat(' ', opts.arrayPadding)
    var opad = repeat(' ', opts.objectPadding)
    var comma = repeat(' ', opts.beforeComma) + ',' + repeat(' ', opts.afterComma)
    var colon = repeat(' ', opts.beforeColon) + ':' + repeat(' ', opts.afterColon)

    return build(value, '')

    function build (o, indent) {
      if (o === null || o === undefined) return indent + 'null'
      else {
        switch (o.constructor) {
          case Number:
            var isFloat = (o === +o && o !== (o | 0))
            return indent + ((isFloat && ('decimals' in opts)) ? o.toFixed(opts.decimals) : (o + ''))

          case Array:
            var pieces = o.map(function (v) { return build(v, '') })
            var oneLine = indent + '[' + apad + pieces.join(comma) + apad + ']'
            if (opts.wrap === false || oneLine.length <= opts.wrap) return oneLine
            if (opts.short) {
              var indent2 = indent + ' ' + apad
              pieces = o.map(function (v) { return build(v, indent2) })
              pieces[0] = pieces[0].replace(indent2, indent + '[' + apad)
              pieces[pieces.length - 1] = pieces[pieces.length - 1] + apad + ']'
              return pieces.join(',\n')
            } else {
              // eslint-disable-next-line no-redeclare
              var indent2 = indent + opts.indent
              return indent + '[\n' + o.map(function (v) { return build(v, indent2) }).join(',\n') + '\n' + indent + ']'
            }

          case Object:
            var keyvals = []; var i = 0
            for (var k in o) keyvals[i++] = [JSON.stringify(k), build(o[k], '')]
            if (opts.sorted) keyvals = keyvals.sort(function (kv1, kv2) { kv1 = kv1[0]; kv2 = kv2[0]; return kv1 < kv2 ? -1 : kv1 > kv2 ? 1 : 0 })
            keyvals = keyvals.map(function (kv) { return kv.join(colon) }).join(comma)
            // eslint-disable-next-line no-redeclare
            var oneLine = indent + '{' + opad + keyvals + opad + '}'
            if (opts.wrap === false || oneLine.length < opts.wrap) return oneLine
            if (opts.short) {
              var keyvals = []; var i = 0
              for (var k in o) keyvals[i++] = [indent + ' ' + opad + JSON.stringify(k), o[k]]
              if (opts.sorted) keyvals = keyvals.sort(function (kv1, kv2) { kv1 = kv1[0]; kv2 = kv2[0]; return kv1 < kv2 ? -1 : kv1 > kv2 ? 1 : 0 })
              keyvals[0][0] = keyvals[0][0].replace(indent + ' ', indent + '{')
              if (opts.aligned) {
                var longest = 0
                for (var i = keyvals.length; i--;) if (keyvals[i][0].length > longest) longest = keyvals[i][0].length
                var padding = repeat(' ', longest)
                for (var i = keyvals.length; i--;) keyvals[i][0] = padRight(padding, keyvals[i][0])
              }
              for (var i = keyvals.length; i--;) {
                var k = keyvals[i][0]; var v = keyvals[i][1]
                var indent2 = repeat(' ', (k + colon).length)
                var oneLine = k + colon + build(v, '')
                keyvals[i] = (opts.wrap === false || oneLine.length <= opts.wrap || !v || typeof v !== 'object') ? oneLine : (k + colon + build(v, indent2).replace(/^\s+/, ''))
              }
              return keyvals.join(',\n') + opad + '}'
            } else {
              var keyvals = []; var i = 0
              for (var k in o) keyvals[i++] = [indent + opts.indent + JSON.stringify(k), o[k]]
              if (opts.sorted) keyvals = keyvals.sort(function (kv1, kv2) { kv1 = kv1[0]; kv2 = kv2[0]; return kv1 < kv2 ? -1 : kv1 > kv2 ? 1 : 0 })
              if (opts.aligned) {
                var longest = 0
                for (var i = keyvals.length; i--;) if (keyvals[i][0].length > longest) longest = keyvals[i][0].length
                var padding = repeat(' ', longest)
                for (var i = keyvals.length; i--;) keyvals[i][0] = padRight(padding, keyvals[i][0])
              }
              var indent2 = indent + opts.indent
              for (var i = keyvals.length; i--;) {
                var k = keyvals[i][0]; var v = keyvals[i][1]
                var oneLine = k + colon + build(v, '')
                keyvals[i] = (opts.wrap === false || oneLine.length <= opts.wrap || !v || typeof v !== 'object') ? oneLine : (k + colon + build(v, indent2).replace(/^\s+/, ''))
              }
              return indent + '{\n' + keyvals.join(',\n') + '\n' + indent + '}'
            }

          default:
            return indent + JSON.stringify(o)
        }
      }
    }

    function repeat (str, times) { // http://stackoverflow.com/a/17800645/405017
      var result = ''
      while (true) {
        if (times & 1) result += str
        times >>= 1
        if (times) str += str
        else break
      }
      return result
    }
    function padRight (pad, str) {
      return (str + pad).substring(0, pad.length)
    }
  },
  JSONstringify: (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, '\t')
    }

    var arr = []
    var _string = 'color:green'
    var _number = 'color:darkorange'
    var _boolean = 'color:blue'
    var _null = 'color:magenta'
    var _key = 'color:red'

    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var style = _number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          style = _key
        } else {
          style = _string
        }
      } else if (/true|false/.test(match)) {
        style = _boolean
      } else if (/null/.test(match)) {
        style = _null
      }
      arr.push(style)
      arr.push('')
      return '%c' + match + '%c'
    })

    arr.unshift(json)
    console.log.apply(console, arr)
    return arr
  },
  renderJSON: (json, rr, code, pre) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, '\t')
    }
    var rules = {
      def: 'color:black',
      defKey: function (match) {
        return '<strong>' + match + '</strong>'
      },
      types: [
        {
          name: 'True',
          regex: /true/,
          type: 'boolean',
          style: 'color:lightgreen'
        },

        {
          name: 'False',
          regex: /false/,
          type: 'boolean',
          style: 'color:lightred'
        },

        {
          name: 'Unicode',
          regex: /"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?/,
          type: 'string',
          style: 'color:green'
        },

        {
          name: 'Null',
          regex: /null/,
          type: 'nil',
          style: 'color:magenta'
        },

        {
          name: 'Number',
          regex: /-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/,
          type: 'number',
          style: 'color:darkorange'
        },

        {
          name: 'Whitespace',
          regex: /\s+/,
          type: 'whitespace',
          style: function (match) {
            return '&nbsp'
          }
        }

      ],

      keys: [
        {
          name: 'Testkey',
          regex: /("testkey")/,
          type: 'key',
          style: function (match) {
            return '<h1>' + match + '</h1>'
          }
        }
      ],

      punctuation: {
        name: 'Punctuation',
        regex: /([\,\.\}\{\[\]])/,
        type: 'punctuation',
        style: function (match) {
          return '<p>________</p>'
        }
      }

    }

    // for (var k in rr) {
    //   rules[k] = rr[k]
    // }

    var str = json.replace(/([\,\.\}\{\[\]]|"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let i = 0
      let p
      if (rules.punctuation.regex.test(match)) {
        if (typeof rules.punctuation.style === 'string') {
          return '<span style="' + rules.punctuation.style + '">' + match + '</span>'
        } else if (typeof rules.punctuation.style === 'function') {
          return rules.punctuation.style(match)
        } else {
          return match
        }
      }

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          for (i = 0; i < rules.keys.length; i++) {
            p = rules.keys[i]
            if (p.regex.test(match)) {
              if (typeof p.style === 'string') {
                return '<span style="' + p.style + '">' + match + '</span>'
              } else if (typeof p.style === 'function') {
                return p.style(match)
              } else {
                return match
              }
            }
          }
          return (typeof rules.defKey === 'function') ? rules.defKey(match) : '<span style="' + rules.defKey + '">' + match + '</span>'
        } else {
          return (typeof rules.def === 'function') ? rules.def(match) : '<span style="' + rules.def + '">' + match + '</span>'
        }
      } else {
        for (i = 0; i < rules.types.length; i++) {
          p = rules.types[i]
          if (p.regex.test(match)) {
            if (typeof p.style === 'string') {
              return '<span style="' + p.style + '">' + match + '</span>'
            } else if (typeof p.style === 'function') {
              return p.style(match)
            } else {
              return match
            }
          }
        }
      }
    })

    if (pre === true) str = '<pre>' + str + '</pre>'
    if (code === true) str = '<code>' + str + '</code>'
    return str
  },
  process: (json) => {
    json = JSON.parse(json)
    try {
      var html = ProcessObject(json, 0, false, false, false)
      return "<PRE class='CodeContainer'>" + html + '</PRE>'
    } catch (e) {
      return e.message
    }
  }
}
/*
function output(inp) {
    document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

var obj = {a:1, 'b':'foo', c:[false,'false',null, 'null', {d:{e:1.3e5,f:'1.3e5'}}]};
var str = JSON.stringify(obj, undefined, 4);

output(str);
output(syntaxHighlight(str));
white-space: pre;
pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
.string { color: green; }
.number { color: darkorange; }
.boolean { color: blue; }
.null { color: magenta; }
.key { color: red; }

******

function JSONstringify(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, '\t');
    }

    var
        arr = [],
        _string = 'color:green',
        _number = 'color:darkorange',
        _boolean = 'color:blue',
        _null = 'color:magenta',
        _key = 'color:red';

    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var style = _number;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                style = _key;
            } else {
                style = _string;
            }
        } else if (/true|false/.test(match)) {
            style = _boolean;
        } else if (/null/.test(match)) {
            style = _null;
        }
        arr.push(style);
        arr.push('');
        return '%c' + match + '%c';
    });

    arr.unshift(json);

    console.log.apply(console, arr);
}
*/
