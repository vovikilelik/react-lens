It is the React implementation for [`lens-js`](https://www.npmjs.com/package/@vovikilelik/lens-js)

# Wiki
* [React-Lens](http://git.vovikilelik.com/Clu/react-lens/wiki/Home-en)
* [Demo project](http://git.vovikilelik.com/Clu/react-lens-cats)

# Initialize
```ts
/* Lens core */
import { Lens, ... } from '@vovikilelik/lens-ts';

/* React implementation */
import { useLens, ...and more } from '@vovikilelik/react-lens';
```

# Creation stateless components
You can create Lens component with using `useLens()` hook, whitch use like `useState()`

```ts
import { useLens } from "@vovikilelik/react-lens";

const Counter: React.FC = ({ lens }) => {
    const [count, setCount] = useLens<number>(lens);
    return <button onClick={() => setCount(count + 1)}>{ count }</button>
}

/* uses */
<Counter lens={lens.go('counter')} />
```
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
<Counter lens={lens.go('counter')} />
```

# Third-patry components
Pattern of covering native components looks like:
```ts
import { createLensComponent, getHtmlLikeModel } from "@vovikilelik/react-lens";

const LensInput = createLensComponent<string>(
    <input />,
    getHtmlLikeModel()
);
```
Example of covering user component, like `<Input text='' onTextChanged={} />`
```ts
/* Any component */
interface Props {
    text: string;
    onTextChanged: (text: string) => void;
}
const Input: React.FC<Props> = (props) => { /* implementation */ }

/* Covering */
const inputModel = {
    getter: {name: 'text', mapper: v => v},
    setter: {name: 'onTextChanged', mapper: v => v}
}
const LensInput = createLensComponent<string, Props>(Input, inputModel);

/* Uses */
<LensInput lens={anyLens} />
```
# Example

**Make store.ts**
```ts
import { LensUtils } from '@vovikilelik/lens-ts';

interface Store {
	counter: number;
}

export const lens = LensUtils.createLens<Store>({ counter: 0 });
```

**Import and use**
```ts
import { lens } from './store';
import { Counter } from './Counter';

const Application: React.FC = () => {
    const counterLens = lens.go('counter');

    return (
        <div>
            <div>Lens Component</div>
            <Counter lens={counterLens} />
        </div>
    )
}
```
