It is the ReactJS implementation for [**`lens-js`**](https://www.npmjs.com/package/@vovikilelik/lens-js). See for more functionality.

# Abstract
`react-lens` is a functional state manager for ReactJS. The whole state is divided into separate models. Each model can be associated with a atom or part of a shared state. All models are inherited from the base model, which already has most of the necessary functions, but you can extend it if necessary.

At its core, the [`lens-js`](https://www.npmjs.com/package/@vovikilelik/lens-js) library is used, which can work on different frameworks in the same way. This means that some of your code can be transferred between frameworks.

## Links
* [Wiki](https://wiki.dev-store.xyz/react-lens/) for more information
* [GIT Repository](https://git.dev-store.xyz/Clu/react-lens/) for latest version

## Instalation
```
npm i @vovikilelik/react-lens
```

## Example
The `createStore()` utility Creates a model. The `useLens()` hook will create a subscription to changes in the model and guarantee that the component will be redrawn if the model has changed. It is used in the same way as the built-in ReactJS `useState()`.
```ts
const store = createStore(0);

const Counter: React.FC = () => {
  const [count, setCount] = useLens(store);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      { count }
    </button>
  );
}
```

# Owerview
`react-lens` depends of [**`lens-js`**](https://www.npmjs.com/package/@vovikilelik/lens-js). See it for more functionality.

## Main Futures
* Global state definition
* Local (Dynamic) state definition
* Nested state
* Dedouncing and throttling
* Extending
* Incapsulation
* Typings

# Uses

## State Definition Ways
`react-lens` allows you to create a global and local state. It will depend on your needs.

The global state is well suited for the shared state of the application. Local is suitable for implementing complex components or shared components distributed between your projects.

### Global State Definition
To create a global state, the `createStore()` method is used.
```ts
export const store = createStore({ /* Initial data */ });
```
>  This method has more functionality, see [**`lens-js`**](https://www.npmjs.com/package/@vovikilelik/lens-js)
#### Local State Definition
A local state can be created using the same method - `createStore()`. However, there is an easier way using hook `useLocalStore()`. It has the same functionality as the `createStore()` method.
```ts
cont initData = { message: 'Hello!' };

const Component: React.FC = () => {
  const localStore = useLocalStore(initData);
  ...
}
```
There are other hooks to simplify the development of components.
The `useStaticLocalStore()` hook will not be updated when the data used during creation changes.

```ts
const Component: React.FC = () => {
  const localStore = useStaticLocalStore({ message: 'No updating' });
  ...
}
```
Hook `useDerivedLocalStore` will monitor the change in the state of the parent component.
```ts
const Component: React.FC<{ parentValue: any }> = ({ parentValue }) => {
  const localStore = useDerivedLocalStore(parentValue);
  ...
}
```

##  Model Extending

The `react-lens` models can be extended with two approaches: functional and Object-oriented. These methods are slightly different, but in general they give an equivalent result.

### Functional Way
For expansion in the functional approach, the `extends()` method is used. It is passed either an object that will be transformed into state nodes or a function that will be combined with a common prototype.
```ts
const store = createStore({})
  .extends({ message: 'Hello' })
  .extends(node => {
    sayHello: name => `${node.message} ${name}`
  });

store.sayHello('Martin');  // Hello Martin!
```

### Nested Models Definition
The functional method makes it easy to embed child models. However, this is only a convenient conversion. Any nested models can still be accessed using the `go()` method.

```ts
const message = createStore('Hello!');

const store = createStore({})
  .extends({ message });

store.message.get();  // Hello!
store.go('message').get();  // Hello!
```

### Object-oriented Way
For expansion in the Object-oriented approach, class notation is used. A custom class can be inherited from `Lens`class or one of its heirs, like `Store`.
```ts
/* Create child of one of Lens instance */
class MyCar extends Store {
  public move() { ... }
}

/* Create store with MyCar prototype */
const carState = createStore({ ... }, MyCar);
carState.move();
```
The same can be done when declaring a local state.
```ts
class MyCar extends Store { ... }

const Component: React.FC = () => {
  const localStore = useLocalStore(initData, MyCar);
  localStore.move();
  ...
}
```
### Atoms
`react-lens` does not use the global scope. This allows you to create as many small states as you want. We recommend using this approach. This will simplify the work with data and improve the performance of the application.
```ts
export const options = createStore({ theme: 'white' });
export const auth = createStore({ username: 'Tom' });
...
```

## Catching changes

### Automatic catching
`react-lens` allows you to track changes in models. This happens automatically when you use the `useLens()` hook.

```ts
const Component: React.FC<{ lens: Lens<string> }> = ({ lens }) => {
  const [value, setValue] = useLens(lens);  // Automatic catching and rendering
  ...
}
```
It is worth noting that the hooks for creating a local state, like `useLocalStore()`, will not update the component if the state changes. In order for the component to respond to changes, you can use the `useLens()` hook.

```ts
const Component: React.FC = () => {
  const localStore = useLocalStore(initData);
  
  /* Needs for updating component when localStore changed */
  const [value, setValue] = useLens(localStore);
  ...
}
```

However, you can manage subscriptions manually using the built-in functions in the model. The `useSubscribe()` hook will create a subscription to changes in the model.

```ts
const Component: React.FC = () => {
  const localStore = useLocalStore(initData);
  
  const callback = useCallback(() => { /* You reaction on changes */ })
  useSubscribe(localStore, callback);
  ...
}
```

### Catching nested stores

It doesn't really matter how many child models you use. There is one rule - use `useLens()` where you need to update the component.
```ts
const Text: React.FC<{ lens: Lens<number> }> = ({ lens }) => {
  const [value] = useLens(lens);  // Child will be updated if store changed
  return <>{value}</>
}

const Random: React.FC = () => {
  const localStore = useLocalStore(0);  // Store don`t triggering update
  
  return (
    <button onClick={() => localStore.set(Math.random())}>
      <Text lens={localStore} />
    </button>
  );
}
```
> Note that it makes no sense for us to update the `Random` component.

### Custom Triggers

In cases where we don't need extra updates, we can set special triggers that will prevent unnecessary updates. This is the functionality of [**`lens-js`**](https://www.npmjs.com/package/@vovikilelik/lens-js), see it for more information.

Triggers are specified in the `useLens()` hook by the second and subsequent arguments like `useLens(lens, ...triggers)`.

A trigger is a listener-like function that returns 3 values: `true`, `false` or `undefined`.

```ts
const store = createStore(0);

const evenTrigger: Trigger<number> = (event, node) => node.get() % 2 === 0;

const Component: React.FC = () => {
  const [value] = useLens(store, evenTrigger);
  return <>{value}</>
}
```

It is worth noting that useLens() already uses Trigger.object by default. Don't forget to specify it if you need it.

```ts
const [value] = useLens(store, Triggers.object, evenTrigger);
```

Some system triggers have been replaced with their string counterparts: `object`, `path`, `subtree`, `strict` and `all`.

```ts
const [value] = useLens(store, 'object', evenTrigger);
```

The order of the tierggers matters. `react-lens` will stop processing all other triggers as soon as it encounters the first one, which returns `true` or `false`. If the trigger returns `false`, then `react-lens` considers that the component should not be updated and stops further processing. The `undefined` value will not update the component, but will transfer control to the next trigger.

```ts
useLens(store, () => { /* triggered */ }, () => true, () => { /* not triggered */ });
useLens(store, () => { /* triggered */ }, () => false, () => { /* not triggered */ });
```

All system triggers will return `undefined` if they failed validation and pass control to the next trigger.

## Utils

Some utilities are described in [**`lens-js`**](https://www.npmjs.com/package/@vovikilelik/lens-js), see it for more information.

### useLensDebounce()
The `useLensDebounce()` hook allows you to create a bidirectional listener that will update the state with a delay. It works the same way as `useLens()`.

Creating an input field for asynchronous search is simple!

```ts
const DebounceInput: React.FC<{ lens: Lens<string> }> = ({ lens }) => {
  const [value, setValue] = useLensDebounce(lens, 1000);
  return <input value={value} onChange={e => setValue(e.target.value)} />
}

const Form: React.FC = () => {
  const localStore = createStore('');
  
  const doResponse = useCallback(() => fetch(...));
  useSubscribe(lensNode, doResponse);
  
  return <DebounceInput lens={localStore} />
}
```

### useLensContext()
`useLensContext()` may be needed if you are developing hooks related to the external state, which should be integrated into the application in parallel with other models. This will help to better test the application on `react-lens`.

```ts
const AuthorizeContext = createLensContext();

const authorizeStore = createStore({ ... });

const useAuthorize = () => {
  ...
  return useLensContext(authorizeContext, authorizeStore);
}

const Form: React.FC = () => {
  const [auth] = useAuthorize();
  ...
}

const Prodaction: React.FC = () => {
  ...
  return <Form />;
}

const Test: React.FC = () => {
  const testStore = createStore({ ... });

  return (
    <AuthorizeContext.provider value={testStore}>
      <Form />
    </AuthorizeContext.Provider>
  );
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

---
For more documentation see [Wiki](https://wiki.dev-store.xyz/react-lens/) documentation.