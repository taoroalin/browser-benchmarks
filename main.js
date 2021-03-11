const testsElement = document.getElementById("tests")

const resultTemplate = document.getElementById("result").content.firstElementChild
const testTemplate = document.getElementById("test").content.firstElementChild

// const formatNum = (num,sigfigs) => {
//   const log = Math.floor(Math.log10(num))
//   let str = "" + Math.round(num * Math.pow(10,sigfigs - 1 - log))
//   str += "0".repeat()
//   return  * Math.pow(10,log - sigfigs + 1)
// }

const testAll = () => {
  const results = []
  for (let test of tests) {
    const testResult = runTest(test)
    results.push(testResult)
    renderTest(testResult)
  }
  console.log(results)
  console.log(JSON.stringify(results))
}

const renderTest = (testResult) => {
  const el = testTemplate.cloneNode(true)
  el.children[0].innerText = testResult.name
  for (let result of testResult.results) {
    const resultEl = resultTemplate.cloneNode(true)
    resultEl.children[0].innerText = result.name
    resultEl.children[1].innerText = result.time.toPrecision(3)
    el.children[1].appendChild(resultEl)
  }
  testsElement.appendChild(el)
}

const runTest = (test) => {
  const results = test.cases.map((aCase) => {
    const returns = { name: aCase.name }
    const stime = performance.now()
    aCase.fn()
    returns.time = performance.now() - stime
    return returns
  })
  return { name: test.name,results }
}

const tests = [{
  name: "For vs While",cases: [{
    name: "For",fn: () => {
      for (let i = 0; i < 100000000; i++) {
        const x = 1
      }
    }
  },{
    name: "While",fn: () => {
      let i = 0
      while (i < 100000000) {
        const x = 1
        i++
      }
    }
  }]
},
{
  name: "Set vs {thing:true} vs {thing:1}",params: [{ name: "adds",min: 1,max: 10 },{ name: "deletes",min: 1,max: 10 },{ name: "gets",min: 1,max: 1000 }],cases: [{
    name: "{thing:true}",fn: () => {
      const obj = {}
      for (let i = 0; i < 1000000; i++) {
        obj[i] = true
      }
    }
  },{
    name: "Set",fn: () => {
      const st = new Set()
      for (let i = 0; i < 1000000; i++) {
        st.add(1)
        st.has(1)
      }
    }
  },{
    name: "{thing:1}",fn: () => {
      const obj = {}
      for (let i = 0; i < 1000000; i++) {
        obj[i] = 1
        obj[i]
      }
    }
  },]
},{
  name: "strlen vs Math.Log",cases: [{
    name: "strlen",fn: () => {
      for (let i = 0; i < 1000000; i++) {
        i.toString().length
      }
    }
  },{
    name: "log",fn: () => {
      for (let i = 0; i < 1000000; i++) {
        Math.floor(Math.log(i))
      }
    }
  }]
},{
  name: "''+ vs .toString",cases: [{
    name: "''+",fn: () => {
      for (let i = 0; i < 1000000; i++) {
        "" + i
      }
    }
  },{
    name: ".toString",fn: () => {
      for (let i = 0; i < 1000000; i++) {
        i.toString()
      }
    }
  }],
},{
  name: "Math.max vs if(_>_)_=_",cases: [{
    name: "Math.max",fn: () => {
      let z = 0
      for (let i = 0; i < 1000000; i++) {
        z = Math.max(i,z)
      }
    }
  },{
    name: "if",fn: () => {
      let z = 0
      for (let i = 0; i < 1000000; i++) {
        if (i > z) z = i
      }
    }
  }],
}]

testAll()