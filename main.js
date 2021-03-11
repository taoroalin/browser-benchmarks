const testsElement = document.getElementById("tests")

const resultTemplate = document.getElementById("result").content.firstElementChild
const testTemplate = document.getElementById("test").content.firstElementChild

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
    resultEl.children[1].innerText = result.time
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
}]

testAll()