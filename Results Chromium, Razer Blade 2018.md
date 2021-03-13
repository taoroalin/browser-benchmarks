# Results on Chromium on my machine

""+ is faster than .toString by 3us or 10%. Follows general trend that operators are generally faster than functions that do comparable things.

Multiple accumulators actually matters for LARGE accumulations. 1 is faster for normal sizes, 2 is fastest for 1 million, 3+ is fastest for 100 million

Very surprising that setting attributes individually is faster than setting attributes in one {...}. I know it's still using the pre-allocated space. would have thought it creates new maps, but perhaps JIT looks ahead and puts it all into 1 map
