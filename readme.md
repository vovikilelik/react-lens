It is the React implementation for [`lens-js`](https://www.npmjs.com/package/@vovikilelik/lens-js)

# Wiki
* [React-Lens](http://git.vovikilelik.com/Clu/react-lens/wiki/Home-en)
* [Demo project](http://git.vovikilelik.com/Clu/react-lens-cats)

# Start
```ts
/* Lens core */
import { Lens, ... } from '@vovikilelik/lens-ts';

/* React implementation */
import { useLens, ...and more } from '@vovikilelik/react-lens';
```

# Creation stateless components
You can create Lens component with using `useLens()` hook, whitch use like `useState()`

```ts
import { Lens } from "@vovikilelik/lens-ts";
import { useLens } from "@vovikilelik/react-lens";

const Counter: React.FC<{ lens: Lens<number> }> = ({ lens }) => {
    const [count, setCount] = useLens(lens);
    return <button onClick={() => setCount(count + 1)}>{ count }</button>
}

`useLens` will automatically re-render component if lens node has been changed externally.

/* uses */
<Counter lens={/* Your counter lens */} />
```
`useLens` haves able to customize render trigger
```ts
/* Simple, means: 'path', 'strict' or 'tree' stage */
const [value, setValue] = useLens(lens, 'path', 'strict');

/* Functional */
const [value, setValue] = useLens(lens, () => /* condition */);

/* Or mixed */
const [value, setValue] = useLens(lens, () => true, 'tree');
```
> For more information about event model see [lens-js](https://www.npmjs.com/package/@vovikilelik/lens-js) repository

# Creation statefull components
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
