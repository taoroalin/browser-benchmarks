const testsElement = document.getElementById("tests")

const resultTemplate = document.getElementById("result").content.firstElementChild
const testTemplate = document.getElementById("test").content.firstElementChild

const macroTest = `
()=>{
  ~setup~
  const stime = performance.now()
  for(let i=0;i<~reps~;i++){
    ~body~
  }
  const duration = performance.now()-stime
  return {duration}
}()
`

const rands = []
for (let i = 0; i < 10000000; i++) {
  rands.push(Math.random())
}

const doMacro = (stringMap,template) => {
  let string = template
  for (let key in stringMap) {
    string = string.replace('~' + key + '~',stringMap[key])
  }
  return eval(string)
}

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
  name: "x=Math.max(x,y) vs if(y>x)x=y",cases: [{
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
},{
  name: "Multiple Accumulators",cases: [{
    name: "1 accumulator",fn: () => {
      let z = 0
      let i = 0
      while (i < 100000000) {
        z += rands[i]
        i++
      }
    }
  },{
    name: "2 accumulators",fn: () => {
      let z = 0
      let z2 = 0
      let i1 = 0
      while (i1 < 50000000) {
        z += rands[i1]
        z2 += rands[i1 + 1]
        i1 += 2
      }
      z += z2
    }
  },{
    name: "3 accumulators",fn: () => {
      let z = 0
      let z2 = 0
      let z3 = 0
      let i1 = 0
      while (i1 < 33333333) {
        z += rands[i1]
        z2 += rands[i1 + 1]
        z3 += rands[i1 + 2]
        i1 += 3
      }
      z += z2 + z3
    }
  }],
}
  // todo measure domnode.thing= vs domnode.dataset.thing= vs domnode.setAttribute(thing)

]

testAll()

const mtp = {
  name: "x=Math.max(x,y) vs if(y>x)x=y",reps: 1000000,cases: [{
    name: "Math.max",setup: `let z = 0`,body: `z = Math.max(i,z)`
  },{
    name: "if",setup: `let z = 0`,body: `if(i>z)z=i`
  }],
}

const runTestM = (test) => {
  const results = test.cases.map((aCase) => {
    const returns = { name: aCase.name }
    const stime = performance.now()
    aCase.fn()
    returns.time = performance.now() - stime
    return returns
  })
  return { name: test.name,results }
}

runTestM(mtp)