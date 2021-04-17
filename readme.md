# Links
* For more help, please follow to [this repository](http://git.vovikilelik.com/Clu/lens-ts.git)
* Demo [react-lens-cat](http://git.vovikilelik.com/Clu/react-lens-cats)

# react-lens
It is the utils for easy implementation [`lens-ts`](https://www.npmjs.com/package/@vovikilelik/lens-ts) on react-apps.

# Creation own components
## FC
You can create Lens component with using `useLens()` hook, whitch use like `useState()`

```ts
import { useLens } from "@vovikilelik/react-lens";

const LensCounter: React.FC = ({ lens }) => {
    const [count, setCount] = useLens<number>(lens);
    return <button onClick={() => setCount(count + 1)}>{ count }</button>
}
```
## Class
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
```

# Covering
## Covering native components
Pattern of covering native components looks like:
```ts
import { createLensComponent, getHtmlLikeModel } from "@vovikilelik/react-lens";

const LensInput = createLensComponent<string>(
    <input />,
    getHtmlLikeModel()
);
```
## Covering custom components
Example of covering any component, like `<Input text='' onTextChanged={} />`
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
# Using lens-components

**Make store.ts**
```ts
interface Store {
	anInput: string;
}

const store: { lens: Store } = { lens: { anInput: '' } };

export lens = new Lens<Store>(
	() => store.lens,
	(data) => { store.lens = data; }
);
```

**Import and use**
```ts
import { lens } from './store';

const Application: React.FC = () => {
    const anInputLens = lens.go('anInput');

    return (
        <div>
            <div>Lens Component</div>
            <LensInput lens={anInputLens} />
        </div>
    )
}
```