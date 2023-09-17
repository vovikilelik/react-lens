It is the React implementation for [`lens-js`](https://www.npmjs.com/package/@vovikilelik/lens-js)

# Links
* [Wiki](http://wiki.dev-store.ru/react-lens/)
* [Repo](http://git.dev-store.xyz/Clu/react-lens/)

# Instalation
```
npm i @vovikilelik/react-lens
```

# Example
```ts
import { useLens } from "@vovikilelik/react-lens";
import { createLens } from "@vovikilelik/lens-js";

const store = createLens(0);

const Counter: React.FC = () => {
  const [count, setCount] = useLens(store);
	
  return (
    <button onClick={() => setCount(count + 1)}>
      { count }
    </button>
  );
}
```

# Features
* Static and dynamic state values
* Support tree structures
* Multplatform supporting
* Async changing and throttling
* Extending (Node as controller)

# Examples

## Lens as dynamic state

```ts
import { Lens, createLens } from "@vovikilelik/lens-js";
import { useLens } from "@vovikilelik/react-lens";

/* Component with lens prop as value */
const Counter: React.FC<{ value: Lens<number> }> = ({ value }) => {
  const [count, setCount] = useLens(lens);

  return (
    <button onClick={() => setCount(count + 1)}>
      { count }
    </button>
  );
}

/* uses */
const Form: React.FC = () => {
	/* Creation dynamic state */
	const localStore = useMemo(() => createLens(0), []);
	return <Counter value={localStore} />
}
```

## Tree state structure
```ts
/* Any deep static state (for example) */
const state = createLens({ basket: { apple: { color: 'red' } } });

/* Any Apple component */
const Apple: React.FC<{ lens: Lens<IApple> }> = ({ lens }) => {
	const [color] = useLens(lens.go('color'));
	return <>Apple is {color}</>
}

/* Any Basket component */
const Basket: React.FC<{ lens: Lens<IBasket> }> = ({ lens }) => {
	return <Apple lens={lens.go('apple')} />
}

/* Uses */
const Form: React.FC = () => {
	return <Basket lens={state.go('basket')} />
}
```
## Extending
```ts
import { Lens } from "@vovikilelik/lens-js";

/* Create child of Lens instance */
export class MyCar extends Lens<ICar> {
	public move() { ... }
}

/* Any component (for example) */
const Car: React.FC<{ lens: MyCar }> = () => {
	return <Button onClick={lens.move} />
}

/* Uses */
/* Create MyCar prototype */
const carState = createLens({ ... }, MyCar);

const Form: React.FC = () => {
	return <Car lens={carState} />
}
```

## Catching changes
```ts
import { useLens, useAttach } from "@vovikilelik/react-lens";
import { Lens, createLens } from "@vovikilelik/lens-js";

const Input: React.FC<{ lens: Lens<string> }> = ({ lens }) => {
	const [value, setValue] = useLens(lens);
	return <input value={value} onChange={e => setValue(e.target.value)} />
}

/* Uses */
const Form: React.FC = () => {
	const state = useMemo(() => createLens(''), []);
	
	/* Create standard callback */
	const callback = useCallback(() => { ... });
	
	/* Subscribe to lens changing with callback */
	useAttach(state, callback);
	
	return <Input lens={state} />
}
```

## Debounce
```ts
import { useDebounce, useAttach } from "@vovikilelik/react-lens";

/* Input with delay */
const DebounceInput: React.FC<{ lens: Lens<string> }> = ({ lens }) => {
	const [value, setValue] = useDebounce(lens, 1000);
	return <input value={value} onChange={e => setValue(e.target.value)} />
}

/* Uses */
const Form: React.FC = () => {
	const lensNode = useMemo(() => createLens(''), []);
	useAttach(lensNode, doRequestFunction);
	
	return <DebounceInput lens={lensNode} />
}
```

## Manual setting end getting values
Functional of [`lens-js`](https://www.npmjs.com/package/@vovikilelik/lens-js)
```ts
const state = createLens('Hello!');

const Form: React.FC = () => {
	useLens(state); // For triggering changes

	const callback = useCallback(() => {
		state.set('World!'); // Set value
	});
	
	return (
		<Button onClick={lensNode}>
			{/* Get value */}
			{state.get()}
		</Button>
	)
}
```

## Creation statefull components
You can create an own class component extending `LensComponent<L, P, S>`, like `React.Component<P, S>`, where `L` is type of `Lens` node.
```ts
import { LensComponent } from "@vovikilelik/react-lens";

interface Props {
    className?: string;
}

export class Counter extends LensComponent<number, Props> {
    public render() {
        const {lens} = this.props;
        const {value} = this.state;
        return <button onClick={ () => lens.set(value + 1) }>{ value }</button>
    }
}

/* uses */
<Counter lens={/* Your counter lens */} />
```

