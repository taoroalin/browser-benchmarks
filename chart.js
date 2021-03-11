// data is column oriented

const CHART_DEFAULT_CONFIG = { width: 500,height: 400 }
const chart = (canvas,data,config) => {
  const ctx = canvas.getContext("2d")
  if (config === undefined) config = CHART_DEFAULT_CONFIG
  canvas.width = config.width
  canvas.height = config.height
  let xmax = 0
  let ymax = 0
  for (let colName in data.data) {
    const col = data.data[colName]
    for (let num of col) {
      if (num > ymax) ymax = num
    }
    if (col.length > xmax) xmax = col.length
  }

}

const canvasTestElement = document.getElementById("canvas-test")

const testData = { name: "testdata",data: { a: [1,2,3,4,5,6,7,8],b: [0,1,4,9,16,35,36,49] } }
chart(canvasTestElement,testData)