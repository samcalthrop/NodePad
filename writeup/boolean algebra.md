## Operators

### NOT (*negation*)

written as ¬A; 'not A'

### AND (*conjunction*)

written as A⋀B; 'A and B'

### OR (*disjunction*)

written as A⋁B; 'A and B'

### XOR

written as A⊻B; 'A XOR B'

Examples:

* A and B: A⋀B
* A and NOT C: A⋀¬C
* B or NOT D and C: B⋁¬C⋀D
* B or C and D: B⋁C⋀D
* NOT B and NOT C: ¬C⋀¬D
* A or B or C or D: A⋁B⋁C⋁D
* B or (A and NOT C): B⋁(A⋀¬C)

Use the order of: NOT -> AND -> OR ( ¬ -> ⋀ -> ⋁ )

Therefore, resolve B⋁¬C⋀D in the order:

* ¬C, then,
* ¬C⋀D, then,
* B⋁(¬C⋀D),
* or B⋁((¬C)⋀D) working from innermost bracket outwards

## General Rules:

* X⋀0  = 0
* X⋀1  = X
* X⋀X  = X
* X⋀¬X = 0
* X⋁0  = X
* X⋁1  = 1
* X⋁X  = X
* X⋁¬X = 1
* ¬¬X  = X *(double negation)*

### DeMorgan's Laws

1. ¬(A⋁B) = ¬A⋀¬B
2. ¬(A⋀B) = ¬A⋁¬B

### Commutation Laws

> the order in which we write it doesn't matter

1. X⋁Y = Y⋁X
2. X⋀Y = Y⋀X

### Association Laws

> the order in which we evaluate it doesn't matter, **if the same operator used**

1. X⋀(Y⋀Z) = (X⋀Y)⋀Z
2. X⋁(Y⋁Z) = (X⋁Y)⋁Z

### Distribution Laws&#x20;

> treat '⋀' as '\*' and '⋁' as '+' and expand

1. X⋀(Y⋁Z) = (X⋀Y)⋁(X⋀Z)
2. (X⋁Y)⋀(W⋁Z) = (X⋀W)⋁(X⋀Z)⋁(Y⋀W)⋁(Y⋀Z)