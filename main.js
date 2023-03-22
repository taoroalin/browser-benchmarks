let timeToSpend = 20
let stime

let minReps = 10

const CHARS_64 = "-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ"
const CHARS_16 = "0123456789ABCDEF"

// faster, looser random
// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const randomConstantA = 65793
const randomConstantC = 4282663
const randomConstantM = 8388608 // 2^23
let randomSeed = Math.floor(Math.random() * randomConstantM)
const random = () => {
  randomSeed = (randomConstantA * randomSeed + randomConstantC) % randomConstantM
  return randomSeed / randomConstantM
}

const randomChar = () => {
  randomSeed = (randomConstantA * randomSeed + randomConstantC) % randomConstantM
  return CHARS_64[randomSeed % 64]
}

const testsElement = document.getElementById("tests")

const resultTemplate = document.getElementById("result").content.firstElementChild
const testTemplate = document.getElementById("test").content.firstElementChild

const macroTest = `
(()=>{
  const stime = performance.now()
  const reps = ~reps~;
  ~setup~
  for(let i=0;i<reps;i++){
    ~body~
  }
  ~cleanup~
  const duration = performance.now()-stime;
  return duration
})()
`

const macroTestManual = `
(()=>{
  const stime = performance.now()
  const reps = ~reps~;
  ~program~
  const duration = performance.now()-stime
  return duration
})()
`

const macroTextPretty = `
~setup~
for(let i=0;i<A_LOT;i++){
  ~body~
}
~cleanup~
`

stime = performance.now()
const rands = []
for (let i = 0; i < 10000000; i++) {
  rands.push(random())
}
console.log(`rands took ${performance.now() - stime}`)

stime = performance.now()
const repsLengthLists = {}
const mx = Math.pow(10, 8)
for (let i = minReps; i < mx; i *= 10) {
  repsLengthLists[i] = [...Array(i)]
}
console.log(`repslengths took ${performance.now() - stime}`)

const rsstime = performance.now()
let randstring = ""
for (let i = 0; i < 1000; i++) {
  randstring = randstring + randomChar()
}
console.log(`rstring took ${performance.now() - rsstime}`)

const doMacro = (template, map) => {
  let string = template
  const matches = template.matchAll(/~([a-zA-Z0-9_]+)~/g)
  for (let match of matches) {
    string = string.replace(match[0], map[match[1]] || "")
  }
  return eval(string)
}

const testAll = async () => {
  const results = []
  for (let test of tests) {
    const testResult = runTest(test)
    results.push(testResult)
    renderTest(testResult)
    await emptyPromise()
  }
  console.log(results)
  console.log(JSON.stringify(results))
}

const renderTest = (testResult) => {
  const el = testTemplate.cloneNode(true)
  el.children[0].innerText = testResult.name
  testsElement.appendChild(el)
  chart(el.children[3], testResult)
}

const runTest = (test) => {
  const timeToSpendHere = test.timeToSpend || timeToSpend
  const results = test.cases.map((aCase) => {
    const result = { name: aCase.name, times: [] }
    let reps = minReps
    do {
      if (aCase.program) {
        result.times.push(doMacro(macroTestManual, { ...aCase, reps }))
      } else {
        result.times.push(doMacro(macroTest, { ...aCase, reps }))
      }
      reps *= 10
    } while (result.times[result.times.length - 1] < timeToSpendHere)
    return result
  })
  return { name: test.name, results }
}

const canvas2dTextBenchmark = {
  name: "Canvas2D Text Writing",
  cases: [
    {
      name: "Font size 10px",
      setup: `const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              ctx.font = '10px Arial';`,
      body: `ctx.fillText('Hello, world!', 0, 10);`
    },
    {
      name: "Font size 20px",
      setup: `const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              ctx.font = '20px Arial';`,
      body: `ctx.fillText('Hello, world!', 0, 20);`
    },
    {
      name: "Font size 30px",
      setup: `const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              ctx.font = '30px Arial';`,
      body: `ctx.fillText('Hello, world!', 0, 30);`
    },
    {
      name: "Font size 40px",
      setup: `const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              ctx.font = '40px Arial';`,
      body: `ctx.fillText('Hello, world!', 0, 40);`
    },
  ],
};

tests.push(canvas2dTextBenchmark);

testAll();