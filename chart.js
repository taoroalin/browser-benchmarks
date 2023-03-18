  // data is column oriented
  
  const colorSchemeHSV = (idx, max) => {
    return `hsl(${Math.floor(idx / max * 255)},100%,70%)`
  }
  
  const CHART_DEFAULT_CONFIG = {
    colorScheme: colorSchemeHSV,
    fontSize: 16,
    lineWidth: 2,
    canvasScale: 5
  }
  
  const chart = (canvas, data, config) => {
    if (config === undefined) config = CHART_DEFAULT_CONFIG
    const ctx = canvas.getContext("2d")
    ctx.scale(1 / config.canvasScale, 1 / config.canvasScale)
    const canvasWidth = canvas.width * config.canvasScale
    const canvasHeight = canvas.height * config.canvasScale
    let xmax = 0
    let ymax = 0
    let ymin = 1000000000000
    ctx.lineWidth = config.lineWidth * config.canvasScale
    ctx.font = `${config.fontSize * config.canvasScale}px verdana`
  
    for (let col of data.results) {
      const times = col.times
      for (let i = 0; i < times.length; i++) {
        let num = times[i]
        if (num !== num || num === 0) {
          num = 0.005
          times[i] = num
        }
        if (num > ymax) ymax = num
        if (num < ymin) ymin = num
      }
      if (times.length > xmax) xmax = times.length
    }
  
  
    const pxPerX = canvasWidth / (xmax - 1)
    const ylogrange = (Math.log10(ymax) - Math.log10(ymin))
    const pxPerY = canvasHeight / ylogrange
    const yoffset = pxPerY * Math.log10(ymin)
  
    for (let i = 0; i < xmax; i++) {
      ctx.fillStyle = "#000000"
      ctx.strokeStyle = "#000000"
      const x = i * pxPerX
      if (i <= xmax * 0.5) {
        ctx.fillText(`e+${i + 1}`, x - config.fontSize * config.canvasScale * 2.05, (config.fontSize - 2) * config.canvasScale)
      } else {
        ctx.fillText(`e+${i + 1}`, x - config.fontSize * config.canvasScale * 2.05, canvasHeight - 5)
      }
      ctx.strokeStyle = "#666666"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    }
  
    for (let i = Math.ceil(Math.log10(ymin)); i < Math.floor(Math.log10(ymax)) + 1; i++) {
      ctx.fillStyle = "#000000"
      ctx.strokeStyle = "#000000"
      const y = yoffset + canvasHeight - i * pxPerY
      ctx.fillText(`e${i - 3}`, canvasWidth - 80, y)
      ctx.strokeStyle = "#666666"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }
  
    ctx.lineWidth = config.lineWidth * config.canvasScale
  
    for (let colNum = 0; colNum < data.results.length; colNum++) {
      const col = data.results[colNum]
      console.log(col)
      const maxThroughput = Math.round((Math.log10(col.times[col.times.length - 1]) + col.times.length) * 10) / 10
      const times = col.times
      const strokeStyle = config.colorScheme(colNum, data.results.length)
      ctx.strokeStyle = strokeStyle
      ctx.fillStyle = strokeStyle
      const printText = col.name + " " + maxThroughput
      ctx.fillText(printText, 5 * config.canvasScale, (config.fontSize * 1.15 * config.canvasScale) * (colNum + 1.8), 1000)
      let last = times[0]
      ctx.beginPath()
      ctx.moveTo(0, yoffset + canvasHeight - pxPerY * Math.log10(last))
      for (let i = 1; i < times.length; i++) {
        ctx.lineTo(pxPerX * i, yoffset + canvasHeight - pxPerY * Math.log10(times[i]))
      }
      ctx.stroke()
    }
  }