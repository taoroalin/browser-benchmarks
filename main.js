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

// stime = performance.now()
// const maybeUndefineds = []
// for (let i = 0; i < 1000000; i++) {
//   rands.push(random() > 0.5 ? undefined : true)
// }
// console.log(`maybe undefs took ${performance.now() - stime}`)

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
  // for (let result of testResult.results) {
  //   const resultEl = resultTemplate.cloneNode(true)
  //   resultEl.children[0].innerText = result.name
  //   resultEl.children[1].innerText = result.times[result.times.length - 1].toPrecision(3)
  //   el.children[1].appendChild(resultEl)
  // }
  console.log(testResult)
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

const mask = [""]

const tests = [
  {
    name: "efficient substring?", cases: [{ name: "subs len 100", setup: `const str = "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm"`, body: `str.substring(1,1+i%100);` },
    { name: "subs len 1000", setup: `const str = "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm"`, body: `str.substring(1,1+i%1000);` }]
  },
  {
    name: "Math.min", cases: [{ name: "Math.min", body: `Math.min(i,0)` },
    { name: "2 arg min", setup: `const min = (a,b)=>{if(a<b)return a;return b}`, body: `min(i,0)` },
    {
      name: "many arg min", setup: `const min = (...args)=>{
        if(args.length===0)return
      let result = args[0];
      for(let i=1;i<args.length;i++){
        const arg = args[0]
        if(arg<result)result=arg
      }
      return result
    }`, body: `min(i,0)`
    }]
  },
  {
    name: "reduce styles", timeToSpend: 10, cases: [
      { name: "c style for", program: `let thwab = 0;for(let i=0;i<reps;i++){thwab+=rands[i]}` },
      { name: "while", program: `let thwab = 0;let i=0;while(i<reps){i++;thwab+=rands[i]}` },
      { name: "forEach", program: `let thwab = 0;repsLengthLists[reps].forEach((thing)=>{thwab+=thing})` },
      { name: "for of", program: `let thwab = 0;const ls = repsLengthLists[reps];for(let thing of ls){thwab+=thing}` },
      { name: "reduce", program: `repsLengthLists[reps].reduce((a,n)=>a+n, 0)` },
    ]
  },
  {
    name: "constant object in loop", cases: [
      { name: "outside loop", setup: `const obj = {1:2,3:4,5:6,7:8,9:10}`, body: `obj[1]` },
      { name: "inside loop", setup: ``, body: `const obj = {1:2,3:4,5:6,7:8,9:10};obj[1]` },
    ]
  },
  {
    name: "Pointless Await", cases: [

      {
        name: "Empty Promise", setup: `
      const f1 = async (i)=>{
        return await f2(true)
      }
      const f2 = async (bool)=>{
        return await emptyPromise()
      }`, body: `f1()`
      },
      {
        name: "Pointless Await", setup: `
      const f1 = async (i)=>{
        return await f2(true)
      }
      const f2 = async (bool)=>{
        return 1
      }`, body: `f1()`
      },
      {
        name: "Pointless async, not await", setup: `
      const f1 = async (i)=>{
        return f2(true)
      }
      const f2 = async (bool)=>{
        return 1
      }`, body: `f1()`
      },
      {
        name: "No pointless await", setup: `
      const f1 = (i)=>{
        return f2(true)
      }
      const f2 = (bool)=>{
        return 1
      }`, body: `f1()`
      }]
  },
  {
    name: "additional wrapper functions", cases: [{
      name: "0 wrappers", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{fn1()};const fn3=()=>{fn2()};fn4=()=>{fn3()};let mut = 0', body: 'mut+=1'
    }, {
      name: "1 wrapper", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{};let mut = 0;', body: 'fn1()'
    }, {
      name: "2 wrappers", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{};let mut = 0;', body: 'fn2()'
    }, {
      name: "3 wrappers", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}; let mut = 0', body: 'fn3()'
    }, {
      name: "4 wrappers", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}; let mut = 0', body: 'fn4()'
    }]
  },
  // {
  //   name: "===undefined vs coerce", cases: [
  //     { name: "void 0", body: `if(maybeUndefineds[i]===void 0){}` },
  //     { name: "undefined", body: `if(maybeUndefineds[i]===undefined){}` }, { name: "coerce", body: `if(maybeUndefineds[i]){}` }]
  // },
  {
    name: "destructured return vs multiple functions", cases: [{ name: "destructured return", setup: `const fn = (a)=>({low:a-1,high:a+1})`, body: `const {low,high}=fn(i)` }, { name: "multiple functions", setup: `const fn1=(a)=>a-1;const fn2=(a)=>a+1`, body: `const low = fn1(i);const high = fn2(i)` }]
  }, { name: "if inside vs outside loop", cases: [{ name: "outside", setup: `if (true){`, body: `i+1`, cleanup: `}` }, { name: "inside", body: `if(true)i+1` }] }, {
    name: "substring equality vs individual char equality", cases: [{
      name: "substring", body: `randstring.substring(0,2)==="or"`
    }, { name: "individual char", body: `randstring[0]==='o' && randstring[1]==='r'` }]
  }, {
    name: "additional empty functions", cases: [{
      name: "0 functions", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{};let mut = 0', body: 'mut+=1'
    }, {
      name: "1 function", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{};let mut = 0;', body: 'fn1()'
    }, {
      name: "2 functions", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{};let mut = 0;', body: 'fn1(fn2())'
    }, {
      name: "3 functions", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}; let mut = 0', body: 'fn1(fn2(fn3()))'
    }, {
      name: "4 functions", setup: 'const fn1 = ()=>{mut+=1};const fn2 = ()=>{};const fn3=()=>{};fn4=()=>{}; let mut = 0', body: 'fn1(fn2(fn3(fn4())))'
    }]
  }, {
    name: "destructuring", cases: [{ name: "no destructuring", body: `let arr = [1,2,3,4];arr[0]+arr[1]+arr[2]+arr[3]` }, { name: "destructuring", body: `let arr=[1,2,3,4];let [a,b,c,d]=arr;a+b+c+d` }]
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
      { name: "custom", setup: "let list = []", body: "list.push(random())", cleanup: `list.sort((a,b)=>a-b)` }
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
      iTotallyHaveBeenDeclared
    }catch(e){
      
    }`}, {
        name: "Not an object error", setup: `const totallyAnObject = null`, body: `try{
      totallyAnObject[i]
    }catch(e){
      
    }`}, {
        name: "Not a function error", setup: `const totallyAFunction = "hello"`, body: `try{
      totallyAFunction()
    }catch(e){
      
    }`}
    ]
  }, {
    name: "catch with no error", cases: [{
      name: "try/catch with no error", setup: `const totallyAFunction = "hello"`, body: `try{
      totallyAFunction
    }catch(e){
      
    }`}, {
      name: "No try/catch", setup: `const totallyAFunction = "hello"`, body: `
      totallyAFunction
    `}]
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
  }, { name: "<< vs *", cases: [{ name: "<<3", body: "i<<3" }, { name: "*8", body: "i*8" }, { name: "*7", body: "i*7" }, { name: "i*i", body: "i*i", }, { name: "empty", body: "" }] },
  { name: ">> vs /", cases: [{ name: ">>3", body: "i>>3" }, { name: "/8", body: "i/8" }, { name: "i/i", body: "i/i" }] },
  {
    name: "pre-sized array", cases: [
      { name: "no pre-sizing", setup: `let arr = []`, body: `arr[i]=1` },
      { name: "pre-sizing", setup: `let arr=Array(reps)`, body: `arr[i]=1` },
      { name: "pre-accessing", setup: `let arr=[];arr[reps]=1`, body: `arr[i]=1` }
    ]
  },
  // {name:"2d array vs strided array", cases:[{name:"2d", setup:`let arr = []`},{name:"strided"}]},

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
