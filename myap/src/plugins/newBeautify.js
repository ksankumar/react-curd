/* eslint-disable no-unused-vars */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/* eslint-disable no-eval */
/* eslint-disable no-prototype-builtins */
window.SINGLE_TAB = '  '
window.ImgCollapsed = 'http://bodurov.com/jsonformatter/images/Collapsed.gif'
window.ImgExpanded = 'http://bodurov.com/jsonformatter/images/Expanded.gif'
window.PropertyColors = ['PropertyName1', 'PropertyName2', 'PropertyName3', 'PropertyName4']
const collapse = '<i class="v-icon notranslate mdi mdi-minus-box theme--light"></i>'
const expand = '<i class="v-icon notranslate mdi mdi-plus-box theme--light"></i>'

window.QuoteKeys = true
function $id (id) { return document.getElementById(id) }
function IsArray (obj) {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.length === 'number' &&
    !(obj.propertyIsEnumerable('length'))
}
function Process (json) {
  SetTab()
  window.IsCollapsible = true // $id('CollapsibleView').checked
  var html = ''
  try {
    if (json == '') json = '""'
    var obj = eval('[' + json + ']')
    html = ProcessObject(obj[0], 0, 0, false, false, false)
    return "<PRE class='CodeContainer'>" + html + '</PRE>'
  } catch (e) {
    alert('JSON is not well formated:\n' + e.message)
    // $id('Canvas').innerHTML = ''
  }
}
function Destringify () {
  $id('RawJson').value = $id('RawJson').value.trim().replace(/^["]+|["]+$/g, '').replace(/\\"/g, '"')
}
window._dateObj = new Date()
window._regexpObj = new RegExp()
window.ExpImgClicked = function (img) {
  console.log('called')
  var container = img.parentNode.nextSibling
  if (!container) return
  var disp = 'none'
  var src = window.ImgCollapsed
  if (container.style.display == 'none') {
    disp = 'inline'
    src = window.ImgExpanded
  }
  container.style.display = disp
  img.src = src
}
function ProcessObject (obj, indent, color, addComma, isArray, isPropertyContent) {
  var html = ''
  var comma = (addComma) ? "<span class='Comma'>,</span> " : ''
  var type = typeof obj
  var clpsHtml = ''
  if (IsArray(obj)) {
    if (obj.length == 0) {
      html += GetRow(indent, "<span class='ArrayBrace'>[ ]</span>" + comma, isPropertyContent)
    } else {
      clpsHtml = window.IsCollapsible ? '<span><img src="' + window.ImgExpanded + "\" onClick=\"ExpImgClicked(this)\" /></span><span class='collapsible'>" : ''
      html += GetRow(indent, "<span class='ArrayBrace'>[</span>" + clpsHtml, isPropertyContent)
      for (var i = 0; i < obj.length; i++) {
        html += ProcessObject(obj[i], indent + 1, color, i < (obj.length - 1), true, false)
      }
      clpsHtml = window.IsCollapsible ? '</span>' : ''
      html += GetRow(indent, clpsHtml + "<span class='ArrayBrace'>]</span>" + comma)
    }
  } else if (type == 'object') {
    if (obj == null) {
      html += FormatLiteral('null', '', comma, indent, isArray, 'Null')
    } else if (obj.constructor == window._dateObj.constructor) {
      html += FormatLiteral('new Date(' + obj.getTime() + ') /*' + obj.toLocaleString() + '*/', '', comma, indent, isArray, 'Date')
    } else if (obj.constructor == window._regexpObj.constructor) {
      html += FormatLiteral('new RegExp(' + obj + ')', '', comma, indent, isArray, 'RegExp')
    } else {
      var numProps = 0
      for (var prop in obj) numProps++
      if (numProps == 0) {
        html += GetRow(indent, "<span class='ObjectBrace'>{ }</span>" + comma, isPropertyContent)
      } else {
        clpsHtml = window.IsCollapsible ? '<span><img src="' + window.ImgExpanded + "\" onClick=\"ExpImgClicked(this)\" /></span><span class='collapsible'>" : ''
        html += GetRow(indent, "<span class='ObjectBrace'>{</span>" + clpsHtml, isPropertyContent)
        var j = 0
        for (var prop in obj) {
          var quote = window.QuoteKeys ? '"' : ''
          var propClass = window.PropertyColors[color % window.PropertyColors.length]
          html += GetRow(indent + 1, "<span class='" + propClass + "'>" + quote + prop + quote + '</span>: ' + ProcessObject(obj[prop], indent + 1, color + 1, ++j < numProps, false, true))
        }
        clpsHtml = window.IsCollapsible ? '</span>' : ''
        html += GetRow(indent, clpsHtml + "<span class='ObjectBrace'>}</span>" + comma)
      }
    }
  } else if (type == 'number') {
    html += FormatLiteral(obj, '', comma, indent, isArray, 'Number')
  } else if (type == 'boolean') {
    html += FormatLiteral(obj, '', comma, indent, isArray, 'Boolean')
  } else if (type == 'function') {
    if (obj.constructor == window._regexpObj.constructor) {
      html += FormatLiteral('new RegExp(' + obj + ')', '', comma, indent, isArray, 'RegExp')
    } else {
      obj = FormatFunction(indent, obj)
      html += FormatLiteral(obj, '', comma, indent, isArray, 'Function')
    }
  } else if (type == 'undefined') {
    html += FormatLiteral('undefined', '', comma, indent, isArray, 'Null')
  } else {
    html += FormatLiteral(obj.toString().split('\\').join('\\\\').split('"').join('\\"'), '"', comma, indent, isArray, 'String')
  }
  return html
}
function FormatLiteral (literal, quote, comma, indent, isArray, style) {
  if (typeof literal == 'string') { literal = literal.split('<').join('&lt;').split('>').join('&gt;') }
  var str = "<span class='" + style + "'>" + quote + literal + quote + comma + '</span>'
  if (isArray) str = GetRow(indent, str)
  return str
}
function FormatFunction (indent, obj) {
  var tabs = ''
  for (var i = 0; i < indent; i++) tabs += window.TAB
  var funcStrArray = obj.toString().split('\n')
  var str = ''
  for (var i = 0; i < funcStrArray.length; i++) {
    str += ((i == 0) ? '' : tabs) + funcStrArray[i] + '\n'
  }
  return str
}
function GetRow (indent, data, isPropertyContent) {
  var tabs = ''
  for (var i = 0; i < indent && !isPropertyContent; i++) tabs += window.TAB
  if (data != null && data.length > 0 && data.charAt(data.length - 1) != '\n') { data = data + '\n' }
  return tabs + data
}
function CollapsibleViewClicked () {
  // $id('CollapsibleViewDetail').style.visibility = $id('CollapsibleView').checked ? 'visible' : 'hidden'
  Process()
}

function QuoteKeysClicked () {
  window.QuoteKeys = true // $id('QuoteKeys').checked
  Process()
}

function CollapseAllClicked () {
  // EnsureIsPopulated()
  TraverseChildren($id('Canvas'), function (element) {
    if (element.className == 'collapsible') {
      MakeContentVisible(element, false)
    }
  }, 0)
}
function ExpandAllClicked () {
  // EnsureIsPopulated()
  TraverseChildren($id('Canvas'), function (element) {
    if (element.className == 'collapsible') {
      MakeContentVisible(element, true)
    }
  }, 0)
}
function MakeContentVisible (element, visible) {
  var img = element.previousSibling.firstChild
  if (!!img.tagName && img.tagName.toLowerCase() == 'img') {
    element.style.display = visible ? 'inline' : 'none'
    element.previousSibling.firstChild.src = visible ? window.ImgExpanded : window.ImgCollapsed
  }
}
function TraverseChildren (element, func, depth) {
  for (var i = 0; i < element.childNodes.length; i++) {
    TraverseChildren(element.childNodes[i], func, depth + 1)
  }
  func(element, depth)
}
function CollapseLevel (level) {
  EnsureIsPopulated()
  TraverseChildren($id('Canvas'), function (element, depth) {
    if (element.className == 'collapsible') {
      if (depth >= level) {
        MakeContentVisible(element, false)
      } else {
        MakeContentVisible(element, true)
      }
    }
  }, 0)
}
function TabSizeChanged () {
  Process()
}
function SetTab () {
  var select = $id('TabSize')
  window.TAB = MultiplyString(1, window.SINGLE_TAB)
}
function EnsureIsPopulated () {
  if (!$id('Canvas').innerHTML && !!$id('RawJson').value) Process()
}
function MultiplyString (num, str) {
  var sb = []
  for (var i = 0; i < num; i++) {
    sb.push(str)
  }
  return sb.join('')
}
function SelectAllClicked () {
  if (!!document.selection && !!document.selection.empty) {
    document.selection.empty()
  } else if (window.getSelection) {
    var sel = window.getSelection()
    if (sel.removeAllRanges) {
      window.getSelection().removeAllRanges()
    }
  }

  var range =
    (!!document.body && !!document.body.createTextRange)
      ? document.body.createTextRange()
      : document.createRange()

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!range.selectNode) { range.selectNode($id('Canvas')) } else if (range.moveToElementText) { range.moveToElementText($id('Canvas')) }

  if (range.select) { range.select($id('Canvas')) } else { window.getSelection().addRange(range) }
}

export default {
  Process: (json) => Process(json)
}
