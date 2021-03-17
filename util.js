const cpy = (obj) => {
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      return obj.map(cpy)
    } else {
      const result = {}
      for (let key in obj) {
        result[key] = cpy(obj[key])
      }
      return result
    }
  } else {
    return obj
  }
}

const stringifyJSSlow = (obj) => {
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      let result = "["
      for (let i = 0; i < obj.length - 1; i++) {
        result += stringifyJSSlow(obj[i]) + ","
      }
      result += stringifyJSSlow(obj[obj.length - 1]) + "]"
      return result
    } else {
      let result = "{"
      for (let key in obj) {
        result += '"' + key + '":' + stringifyJSSlow(obj[key]) + ","
      }
      result = result.substring(0, result.length - 1) + "}"
      return result
    }
  } else if (typeof obj === "string") {
    return obj
  }
  return "" + obj
}

const stringifyJS = (obj, result) => {
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      result += "["
      for (let i = 0; i < obj.length - 1; i++) {
        result = stringifyJS(obj[i], result)
        result += ","
      }
      result = stringifyJS(obj[obj.length - 1], result)
      result += "]"
      return result
    } else {
      result += "{"
      const keys = Object.keys(obj)
      for (let i = 0; i < keys.length - 1; i++) {
        result += '"' + keys[i] + '":'
        result = stringifyJS(obj[keys[i]], result)
        result += ","
      }
      const temp = keys[keys.length - 1]
      result += '"' + temp + '":'
      result = stringifyJS(obj[temp], result)
      result += "}"
      return result
    }
  }
  result += obj
  return result
}

const stringifyJSNorec = (obj) => {
  let result = ""
  let valueStack = [obj]
  let keyStack = [Object.keys(obj)]
  let idxStack = []

  while (valueStack.length > 0) {

  }
  return result
}

const emptyPromise = () => new Promise((resolve, reject) => setTimeout(() => resolve(), 0))