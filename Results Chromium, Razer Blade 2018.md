# Results on Chromium on my machine

""+ is faster than .toString by 3us or 10%. Follows general trend that operators are generally faster than functions that do comparable things.

Multiple accumulators actually matters for LARGE accumulations. 1 is faster for normal sizes, 2 is fastest for 1 million, 3+ is fastest for 100 million


