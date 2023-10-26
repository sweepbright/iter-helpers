## Filter

```ts
chain(["🐍", "🦔", "🐍", "🐍", "🦔"]).filter((i) => i === "🦔");
```

```mermaid
graph TD
    in(( )) -->|"🐍🦔🐍🐍🦔"| F["filter(i => i===🦔)"]
    F -->|"🦔🦔"| out(( ))
```

## Map

```ts
chain([1, 2, 3]).map((i) => i * 2);
```

```mermaid
graph TD
    in(( )) -->|"1 2 3"| M["map(i => i*2)"]
    M -->|"2 4 6"| out(( ))
```

## Take

```ts
chain(["🍎", "🍌", "🍇", "☕"]).take(2);
```

```mermaid
graph TD
    in(( )) -->|"🍎🍌🍇☕️"| T["take(2)"]
    T -->|"🍎🍌"| out(( ))
```

## Skip

```ts
chain(["🍎", "🍌", "🍇", "☕"]).skip(2);
```

```mermaid
graph TD
    in(( )) -->|🍎🍌🍇☕️| S["skip(2)"]
    S -->|🍇☕️| out(( ))
```

## Batch

```ts
chain(["🍎", "🍎", "🍎", "🍎", "🍎"]).batch(2);
```

```mermaid
graph TD
    in(( )) -->|"🍎🍎🍎🍎🍎"| B["batch(2)"]
    B -->|"[🍎🍎] [🍎🍎] [🍎]"| out(( ))
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
