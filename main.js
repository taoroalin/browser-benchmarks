let timeToSpend = 20

let minReps = 10

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

const testsElement = document.getElementById("tests")

const resultTemplate = document.getElementById("result").content.firstElementChild
const testTemplate = document.getElementById("test").content.firstElementChild

const macroTest = `
(()=>{
  const stime = performance.now()
  ~setup~
  for(let i=0;i<~reps~;i++){
    ~body~
  }
  ~cleanup~
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


const rands = []
for (let i = 0; i < 10000000; i++) {
  rands.push(random())
}

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
  // for (let result of testResult.results) {
  //   const resultEl = resultTemplate.cloneNode(true)
  //   resultEl.children[0].innerText = result.name
  //   resultEl.children[1].innerText = result.times[result.times.length - 1].toPrecision(3)
  //   el.children[1].appendChild(resultEl)
  // }
  console.log(testResult)
  testsElement.appendChild(el)
  chart(el.children[2], testResult)
}

const runTest = (test) => {
  const results = test.cases.map((aCase) => {
    const result = { name: aCase.name, times: [] }
    let reps = minReps
    do {
      result.times.push(doMacro(macroTest, { ...aCase, reps }))
      reps *= 10
    } while (result.times[result.times.length - 1] < timeToSpend)
    return result
  })
  return { name: test.name, results }
}

// {
//   name: "For vs While",cases: [{
//     name: "For",fn: () => {
//       for (let i = 0; i < 100000000; i++) {
//         const x = 1
//       }
//     }
//   },{
//     name: "While",fn: () => {
//       let i = 0
//       while (i < 100000000) {
//         const x = 1
//         i++
//       }
//     }
//   }]
// },

const tests = [
  {
    name: "additional wrapper functions", cases: [{
      name: "0 wrappers", setup: 'const fn1 = ()=>{};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}', body: 'fn1()'
    }, {
      name: "1 wrappers", setup: 'const fn1 = ()=>{};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}', body: 'fn1(fn2())'
    }, {
      name: "2 wrappers", setup: 'const fn1 = ()=>{};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}', body: 'fn1(fn2(fn3()))'
    }, {
      name: "3 wrappers", setup: 'const fn1 = ()=>{};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}', body: 'fn1(fn2(fn3(fn4())))'
    }]
  }, {
    name: "Set vs {thing:true} vs {thing:1} adds and checks", cases: [{
      name: "{thing:true}", setup: 'const obj = {}', body: 'obj[i]=true;obj[i]'
    }, {
      name: "Set", setup: "const set = new Set()", body: 'set.add(i);set.has(i)'
    }, {
      name: "{thing:1}", setup: 'const obj = {}', body: 'obj[i]=1;obj[i]'
    },]
  }, {
    name: "Set vs {thing:true} vs {thing:1} adds and deletes", cases: [{
      name: "{thing:true}", setup: 'const obj = {}', body: 'obj[i]=true;delete obj[i]'
    }, {
      name: "Set", setup: "const set = new Set()", body: 'set.add(i);set.delete(i)'
    }, {
      name: "{thing:1}", setup: 'const obj = {}', body: 'obj[i]=1;delete obj[i]'
    },]
  }, {
    name: "strlen vs Math.Log", cases: [{
      name: "strlen", body: "i.toString().length"
    }, {
      name: "log", body: "Math.floor(Math.log(i))"
    }]
  }, {
    name: `""+ vs .toString`, cases: [{
      name: `""+`, body: `""+i`
    }, {
      name: ".toString", body: "i.toString()"
    }],
  }, {
    name: "x=Math.max(x,y) vs if(y>x)x=y", cases: [{
      name: "Math.max", setup: "let z=0", body: "z=Math.max(i,z)"
    }, {
      name: "if", setup: "let z=0", body: "if(i>z)z=i"
    }],
  }, {
    name: "function vs ()=>{}", cases: [
      {
        name: "function", setup: "function fn(){}", body: "fn()"
      }, {
        name: "()=>{}", setup: "let fn=()=>{}", body: "fn()"
      }
    ]
  }, {
    name: "setting attributes individually vs at once", cases: [
      { name: "individually", setup: `const arr = []`, body: `const obj = {};obj.a=i;obj.b=i;obj.c=1;obj[i]=i;arr.push(obj)` },
      { name: "at once", setup: `const arr = []`, body: `const obj = {a:i,b:i,c:1,[i]:i};arr.push(obj)` }
    ]
  }, {
    name: "calling method vs function", cases: [
      { name: "method", setup: `const obj = {fno:function(){this.data},data:3};const fng = (obj)=>obj.data;`, body: `obj.fno()` },
      { name: "function", setup: `const obj = {fno:function(){this.data},data:3};const fng = (obj)=>obj.data;`, body: `fng(obj)` }
    ]
  }, {
    name: "dom dataset attr vs raw attr vs setAttribute", cases: [
      { name: "dataset", body: `let dom = document.createElement("div");dom.dataset[i]=i;dom.dataset.a=1;dom.dataset.b=2` },
      { name: "attr", body: `let dom=document.createElement("div");dom[i]=i;dom.a=1;dom.b=1` },
      { name: "setAttr", body: `let dom=document.createElement("div");dom.setAttribute("h"+i,i);dom.setAttribute("a",1);dom.setAttribute("b",1);` }
    ]
  }, {
    name: "Sort build-in comparator vs custom comparator", cases: [
      { name: "built-in", setup: "let list = []", body: "list.push(random())", cleanup: `list.sort()` },
      { name: "built-in", setup: "let list = []", body: "list.push(random())", cleanup: `list.sort((a,b)=>a-b)` }
    ]
  }, {
    name: "Math.random vs lcg", cases: [
      { name: "Math.random", body: "Math.random()" },
      { name: "lcg", body: "random()" },
    ]
  }, {
    name: "includes vs regex", cases: [{
      name: "regex", body:
        `"You have an idea for a television show about a group of strangers who arrive in a mysterious place that plays by very different rules than our reality. You figure out exactly how this place works, plot everything meticulously, and lay out mysteries for the characters and viewers to uncover slowly over time. You use flashbacks that parallel events to examine and deepen the characters. Your production values are top notch and you produce great television. Your show is not a smash hit, and you know exactly where you are going with all this, so you don’t waste a minute, keeping your seasons short. In the end it all fits together, and the journey was still pretty great on second viewing.".match(/characters/)`
    }, { name: "includes", body: `"You have an idea for a television show about a group of strangers who arrive in a mysterious place that plays by very different rules than our reality. You figure out exactly how this place works, plot everything meticulously, and lay out mysteries for the characters and viewers to uncover slowly over time. You use flashbacks that parallel events to examine and deepen the characters. Your production values are top notch and you produce great television. Your show is not a smash hit, and you know exactly where you are going with all this, so you don’t waste a minute, keeping your seasons short. In the end it all fits together, and the journey was still pretty great on second viewing.".includes("characters")` }]
  }, {
    name: "handling errors", cases: [
      {
        name: "no name error", body: `try{
      imAFunction()
    }catch(e){
      
    }`}, {
        name: "Not an object error", setup: `const string = 1`, body: `try{
      string[i]
    }catch(e){
      
    }`}, {
        name: "Not a function", setup: `const string = "hello"`, body: `try{
      string()
    }catch(e){
      
    }`}
    ]
  }, {
    name: "switch vs if/else vs if/return", cases: [
      {
        name: "if/else", body: `let v = i%3;
    if (v===0){
      let t=v*2
    }else if (v===1){
      let t=v*3
    }else if (v===2){
      let t=v*4
    }`},
      {
        name: "if/break", body: `let v = i%3;
        switch(1){ // have switch here cuz need something to break/return out of?
          case 1:
            if (v===0){
              let t=v*2
              break
            }
            if (v===1){
              let t=v*5
              break
            }
            if (v===2){
              let t=v*4
              break
            }
        }
    `},
      {
        name: "switch", body: `let v = i%3;
        let t
    switch(v){
      case 0:
        t=v*2
        break
      case 1:
        t=v*3
        break
      case 2:
        t=v*4
        break
    }`}
    ]
  }
  // {
  //   name: "Accumulation",cases: [ // BIG bug here, need different loop counts
  //     {
  //       name: "1 accumulator",setup: `
  //         let z = 0
  //         let i = 0`,
  //       body: `
  //           z += rands[i]
  //           i++`
  //     },{
  //       name: "2 accumulators",setup: `
  //         let z = 0
  //         let z2 = 0
  //         let i1 = 0`,
  //       body: `
  //           z += rands[i1]
  //           z2 += rands[i1 + 1]
  //           i1 += 2`,
  //       cleanup: `z += z2`
  //     },{
  //       name: "3 accumulators",
  //       setup: `
  //         let z = 0
  //         let z2 = 0
  //         let z3 = 0
  //         let i1 = 0
  //         `,
  //       body: `
  //           z += rands[i1]
  //           z2 += rands[i1 + 1]
  //           z3 += rands[i1 + 2]
  //           i1 += 3`,
  //       cleanup: `z += z2 + z3`
  //     }],
  // }

]

testAll()
