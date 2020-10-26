/* eslint-disable eqeqeq */
class XmlToJson {
  // constructor (xml) {
  //   if (xml) {
  //     return this.parse(xml)
  //   }
  // }
  addToParent (parent, nodeName, obj) {
    if (!parent[nodeName]) {
      parent[nodeName] = obj
    } else {
      if (!Array.isArray(parent[nodeName])) {
        const tmp = parent[nodeName]
        parent[nodeName] = []
        parent[nodeName].push(tmp)
      }
      parent[nodeName].push(obj)
    }
  }

  isXML (data) {
    const documentElement = (data ? data.ownerDocument || data : 0).documentElement
    return documentElement ? documentElement.nodeName.toLowerCase() !== 'html' : false
  }

  convertXMLStringToDoc (str) {
    let xml = null
    if (str && typeof str === 'string') {
      const parser = new DOMParser()
      xml = parser.parseFromString(str, 'application/xml')
      if (xml.documentElement.getElementsByTagName('parsererror').length) {
        throw xml.documentElement.getElementsByTagName('parsererror')[0].innerHTML || 'In-Valid XML'
      }
    }
    return xml
  }

  parse (xml) {
    try {
      if (xml && typeof xml === 'string') {
        xml = this.convertXMLStringToDoc(xml)
      }
      return (xml && this.isXML(xml)) ? this.parseNode({}, xml.firstChild) : null
    } catch (e) {
      throw new Error(e)
    }
  }

  parseAttributes (node) {
    const attributes = node.attributes
    const obj = {}

    if (node.hasAttributes()) {
      for (let i = 0; i < attributes.length; i++) {
        obj[attributes[i].name] = this.parseValue(attributes[i].value)
      }
    }
    return obj
  }

  parseChildren (parent, childNodes) {
    if (childNodes.length > 0) {
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === 1) {
          this.parseNode(parent, childNodes[i])
        }
      }
    }
  }

  parseNode (parent, node) {
    const nodeName = node.nodeName
    let obj = Object.assign({}, this.parseAttributes(node))
    if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
      if (node.hasAttributes()) {
        obj.text = this.parseValue(node.childNodes[0].nodeValue)
      } else {
        obj = this.parseValue(node.childNodes[0].nodeValue)
      }
    } else {
      this.parseChildren(obj, node.childNodes)
    }
    this.addToParent(parent, nodeName, obj)
    return parent
  }

  isBoolean (val) {
    return /^(true|false)$/i.test(val)
  }

  parseValue (val) {
    if (this.isBoolean(val)) {
      return /^true$/i.test(val)
    }
    const num = Number(val)
    return (isNaN(num)) ? val : (val.length === 0) ? null : num
  }
}

export default XmlToJson
