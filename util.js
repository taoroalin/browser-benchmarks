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