## Filter

```ts
chain(["🐍", "🦔", "🐍", "🐍", "🦔"]).filter((i) => i === "🦔");
```

```mermaid
graph TD
    in(( )) -->|🐍🦔🐍🐍🦔| filter["filter(i => i===🦔)"]
    filter -->|🦔🦔| out(( ))
```

## Map

```ts
chain([1, 2, 3]).map((i) => i * 2);
```

```mermaid
graph TD
    in(( )) -->|1 2 3| map["map(i => i*2)"]
    map -->|2 4 6| out(( ))

```

## Take

```ts
chain(["🍎", "🍌", "🍇", "☕"]).take(2);
```

```mermaid
graph TD
    in(( )) -->|🍎🍌🍇☕️| take["take(2)"]
    take -->|🍎🍌| out(( ))
```

## Skip

```ts
chain(["🍎", "🍌", "🍇", "☕"]).skip(2);
```

```mermaid
graph TD
    in(( )) -->|🍎🍌🍇☕️| skip["skip(2)"]
    skip -->|🍇☕️| out(( ))
```

## Batch

```ts
chain(["🍎", "🍎", "🍎", "🍎", "🍎"]).batch(2);
```

```mermaid
graph TD
    in(( )) -->|🍎🍎🍎🍎🍎| batch["batch(2)"]
    batch -->|"[🍎🍎] [🍎🍎] [🍎]"| out(( ))
```

## Flatten

```ts
chain([["🍎", "🍎"], ["🍎", "🍎"], ["🍎"]]).flatten();
```

```mermaid
graph TD
    in(( )) -->|"[🍎🍎] [🍎🍎] [🍎]"| flatten["flatten"]
    flatten -->|🍎🍎🍎🍎🍎| out(( ))
```

## Mux

```ts
chain(
    mux([
        ["🍎", "🍎", "🍎", "🍎", "🍎"],
        ["🐦", "🐦", "🐦", "🐦", "🐦"],
    ]),
);
```

```mermaid
graph TD
    in1(( )) -->|🍎🍎🍎🍎🍎| mux["mux"]
    in2(( )) -->|🐦🐦🐦🐦🐦| mux["mux"]
    mux -->|🍎🐦🍎🐦🍎🐦🍎🐦🍎🐦| out(( ))
```
