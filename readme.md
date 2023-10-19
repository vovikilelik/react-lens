It is the React implementation for [`lens-js`](https://www.npmjs.com/package/@vovikilelik/lens-js)

# Owerview
`react-lens` is a functional state manager for ReactJS. The whole state is divided into separate models. Each model can be associated with a atom or part of a shared state. All models are inherited from the base model, which already has most of the necessary functions, but you can extend it if necessary.

At its core, the [`lens-js`](https://www.npmjs.com/package/@vovikilelik/lens-js) library is used, which can work on different frameworks in the same way. This means that some of your code can be transferred between frameworks.

## Links
* [Wiki](http://wiki.dev-store.ru/react-lens/)
* [Repo](http://git.dev-store.xyz/Clu/react-lens/)

## Instalation
```
npm i @vovikilelik/react-lens
```

# Example
The `createLens()` utility Creates a model. The `useLens()` hook will create a subscription to changes in the model and guarantee that the component will be redrawn if the model has changed. It is used in the same way as the built-in ReactJS `useState()`.
```ts
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

# Main Features
* Global state definition
* Local (Dynamic) state definition
* Nested state
* Dedouncing and throttling
* Extending
* Incapsulation
* Typings

# Uses

## Extending
The `react-lens` model can be extended with two approaches: functional and OOP.

### Functional Way
For expansion in the functional approach, the `extends()` method is used. It is passed either an object that will be transformed into state nodes or a function that will be combined with a common prototype.
```ts
const store = createLens({})
  .extends({ message: 'Hello' })
  .extends(node => {
	  sayHello: name => `${node.message} ${name}`
  });

store.sayHello('Martin');  // Hello Martin!
```

### OOP Way
For expansion in the OOP approach, class notation is used.
```ts
/* Create child of Lens instance */
export class MyCar extends Lens<ICar> {
	public move() { ... }
}

/* Uses */
/* Create MyCar prototype */
const carState = createLens({ ... }, MyCar);
carState.move();
```

## Global And Local State
State models can be global and accessible from anywhere, or relate only to certain components.

### Global state
```ts
export const global = createLens({ ... });
```
You can split one state into several parts and export them separately. This will not lead to an error because each model is a `singleton`.

```ts
const global = createLens({ form: {}, auth: {} });

export const form = global.go('form');
export const auth = global.go('auth');
```
But we recommend just using multiple states for different logical parts of programs. This will increase the performance of the application.

### Local (Dynamic) State
`react-lens` does not use the global scope. Models can be declared directly in components.
```ts
const Form: React.FC = () => {
  const localStore = useMemo(() => createLens({}), []);
	
  ...
}
```
Also, models can be passed to other components as parameters. To do this, you also need to use the `useLens` hook.

```ts
const Person: React.FC<{ value: Lens }> = ({ value }) => {
  const [person] = useLens(value);
  return <>{person.name}</>;
}

const Form: React.FC = () => {
  const localStore = useMemo(() => createLens({ name: 'Tom' }), []);
  return <Person value={localStore.go('name')} />;
}
```

### Nested State
Each model has standard methods for accessing nested objects - this is the `go()` method. However, there is another way to define nested models as object fields. This can be done using the `extends` method by passing a simple object there, which will be converted into nested models.

#### Default way
```ts
const state = createLens({ basket: { apple: { color: 'red' } } });

const Apple: React.FC<{ lens: Lens }> = ({ lens }) => {
	const [color] = useLens(lens.go('color'));
	return <>Apple is {color}</>
}

const Basket: React.FC<{ lens: Lens }> = ({ lens }) => {
	return <Apple lens={lens.go('apple')} />
}

const Form: React.FC = () => {
	return <Basket lens={state.go('basket')} />
}
```

#### Field-style Way
```ts
const state = createLens({})
  .extends({ field: 'Hello!' });

const Form: React.FC = () => {
  return <>{state.field}</>
}
```

## Catching changes
react-lens allows you to track changes in models. This happens automatically when you use the `useLens()` hook. However, you can manage subscriptions manually using the built-in functions in the model. The `useAttach()` hook will create a subscription to changes in the model.

```ts
const Input: React.FC<{ lens: Lens<string> }> = ({ lens }) => {
	const [value, setValue] = useLens(lens);  // Automatic catching and rendering
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
Creating an input field for asynchronous search is simple!
```ts
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
export class Counter extends LensComponent {

    public render() {
        const {lens} = this.props;
        const {value} = this.state;
        return <button onClick={ () => lens.set(value + 1) }>{ value }</button>
    }
}

/* uses */
<Counter lens={/* Your counter lens */} />
```
