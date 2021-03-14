// data is column oriented

const colorSchemeHSV = (idx,max) => {
  return `hsl(${Math.floor(idx / max * 255)},80%,30%)`
}

const CHART_DEFAULT_CONFIG = {
  colorScheme: colorSchemeHSV,
  fontSize: 16,
  lineWidth: 2,
  canvasScale: 3
}

const chart = (canvas,data,config) => {
  if (config === undefined) config = CHART_DEFAULT_CONFIG
  const ctx = canvas.getContext("2d")
  ctx.scale(1 / config.canvasScale,1 / config.canvasScale)
  const canvasWidth = canvas.width * config.canvasScale
  const canvasHeight = canvas.height * config.canvasScale
  let xmax = 0
  let ymax = 0
  let ymin = 1000000000000
  ctx.lineWidth = config.lineWidth * config.canvasScale
  ctx.font = `${config.fontSize * config.canvasScale}px verdana`

  for (let col of data.results) {
    console.log(col)
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
  const pxPerY = canvasHeight / (Math.log10(ymax) - Math.log10(ymin))
  const yoffset = pxPerY * Math.log10(ymin)

  for (let i = 0; i < xmax; i++) {
    ctx.fillStyle = "#000000"
    ctx.strokeStyle = "#000000"
    const x = i * pxPerX
    ctx.beginPath()
    if (i <= xmax * 0.5) {
      ctx.moveTo(x,0)
      ctx.lineTo(x,5 * config.canvasScale)
      ctx.stroke()
      ctx.fillText(`e+${i + 1}`,x - config.fontSize * config.canvasScale * 2.05,(config.fontSize - 2) * config.canvasScale)
    } else {
      ctx.moveTo(x,canvasHeight)
      ctx.lineTo(x,canvasHeight - 5 * config.canvasScale)
      ctx.stroke()
      ctx.fillText(`e+${i + 1}`,x - config.fontSize * config.canvasScale * 2.05,canvasHeight - 5)
    }
    ctx.strokeStyle = "#666666"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x,0)
    ctx.lineTo(x,canvasHeight)
    ctx.stroke()
  }

  // for(let i=0;i<4;i++){
  //   ctx.fillStyle = "#000000"
  //   ctx.strokeStyle = "#000000"
  //   const y = i * pxPerY
  //   ctx.beginPath()
  //   if (i <= xmax * 0.5) {
  //     ctx.moveTo(x,0)
  //     ctx.lineTo(x,5 * config.canvasScale)
  //     ctx.stroke()
  //     ctx.fillText(`e+${i + 1}`,x - config.fontSize * config.canvasScale * 2.05,(config.fontSize - 2) * config.canvasScale)
  //   } else {
  //     ctx.moveTo(x,canvasHeight)
  //     ctx.lineTo(x,canvasHeight - 5 * config.canvasScale)
  //     ctx.stroke()
  //     ctx.fillText(`e+${i + 1}`,x - config.fontSize * config.canvasScale * 2.05,canvasHeight - 5)
  //   }
  //   ctx.strokeStyle = "#666666"
  //   ctx.lineWidth = 1
  //   ctx.beginPath()
  //   ctx.moveTo(x,0)
  //   ctx.lineTo(x,canvasHeight)
  //   ctx.stroke()
  // }

  ctx.lineWidth = config.lineWidth * config.canvasScale


  for (let colNum = 0; colNum < data.results.length; colNum++) {
    const col = data.results[colNum]
    const times = col.times
    const strokeStyle = config.colorScheme(colNum,data.results.length)
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = strokeStyle
    ctx.fillText(col.name,5 * config.canvasScale,(config.fontSize * 1.15 * config.canvasScale) * (colNum + 2),1000)
    console.log(col.name)
    let last = times[0]
    ctx.beginPath()
    ctx.moveTo(0,yoffset + canvasHeight - pxPerY * Math.log10(last))
    for (let i = 1; i < times.length; i++) {
      ctx.lineTo(pxPerX * i,yoffset + canvasHeight - pxPerY * Math.log10(times[i]))
    }
    ctx.stroke()
  }

}
