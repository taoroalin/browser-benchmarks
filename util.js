const deepCopy = (obj) => {
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      return obj.map(deepCopy)
    } else {
      const result = {}
      for (let key in obj) {
        result[key] = deepCopy(obj[key])
      }
      return result
    }
  } else {
    return obj
  }
}

const stringifyObjectSlow = (obj) => {
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      let result = "["
      for (let i = 0; i < obj.length - 1; i++) {
        result += stringifyObjectSlow(obj[i]) + ","
      }
      result += stringifyObjectSlow(obj[obj.length - 1]) + "]"
      return result
    } else {
      let result = "{"
      for (let key in obj) {
        result += '"' + key + '":' + stringifyObjectSlow(obj[key]) + ","
      }
      result = result.substring(0, result.length - 1) + "}"
      return result
    }
  } else if (typeof obj === "string") {
    return obj
  }
  return "" + obj
}

const stringifyObject = (obj, result) => {
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      result += "["
      for (let i = 0; i < obj.length - 1; i++) {
        result = stringifyObject(obj[i], result)
        result += ","
      }
      result = stringifyObject(obj[obj.length - 1], result)
      result += "]"
      return result
    } else {
      result += "{"
      const keys = Object.keys(obj)
      for (let i = 0; i < keys.length - 1; i++) {
        result += '"' + keys[i] + '":'
        result = stringifyObject(obj[keys[i]], result)
        result += ","
      }
      const temp = keys[keys.length - 1]
      result += '"' + temp + '":'
      result = stringifyObject(obj[temp], result)
      result += "}"
      return result
    }
  }
  result += obj
  return result
}

const stringifyObjectNoRecursion = (obj) => {
  let result = ""
  let valueStack = [obj]
  let keyStack = [Object.keys(obj)]
  let idxStack = []

  while (valueStack.length > 0) {

  }
  return result
}

const createEmptyPromise = () => new Promise((resolve, reject) => setTimeout(() => resolve(), 0))