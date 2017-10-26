# Changes
Unit tests around new "change" methods.
Implement fall back function for payable
Explicty set access modifiers
Change some methods to use safe math (must have been missed)

# Comments
Safe math now added
Good use of modifiers
Does gas price need to be public? [282]
Maybe use getRate or similar function in calculateTokenAmount [408] to calcuate the ranges.

## Concerns
1. changeTokenReward [332] could allow a change during a sale.
2. Not sure if we require setSold [339].  Does not seem to be called by the contract.
3. No unit test on calculateTokenAmount.  Seems to be a critical function.  

# Code coverage
Missing tests
1. changeTokenReward
2. getTokenBalance
3. getRate
4. calculateTokenAmount
