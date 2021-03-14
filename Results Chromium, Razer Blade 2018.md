# Results on Chromium on my machine

""+ is faster than .toString by 3us or 10%. Follows general trend that operators are generally faster than functions that do comparable things.

Multiple accumulators actually matters for LARGE accumulations. 1 is faster for normal sizes, 2 is fastest for 1 million, 3+ is fastest for 100 million

Very surprising that setting attributes individually is faster than setting attributes in one {...}. I know it's still using the pre-allocated space. would have thought it creates new maps, but perhaps JIT looks ahead and puts it all into 1 map

I thought I saw a speedup from using LCG instead of Math.random, but now Math.random's faster! they track very closely, could be using the same thing? I tried reducing the numbers to below 2^32 because V8 ints are 31 bit signed. looks like that helped maybe? lcg does have an advantage at 100, but not worth using. LCG does work a lot better when you have normal twos complement wrapping

wrapper functions: it seems like 2 get inlined, and the 3rd one just isn't? so many discontinuities!!!