# Links
* For more help, please follow to [this repository](http://git.vovikilelik.com/Clu/lens-ts.git)
* Demo [react-lens-cat](http://git.vovikilelik.com/Clu/react-lens-cats)

# react-lens
It is the utils for easy implementation `lens` on react-apps.
# Creation own components
### FC
```ts
import { useLens } from "@vovikilelik/react-lens";

const LensCounter: React.FC = ({lens}) => {
    const [count, setCount] = useLens<number>(lens);
    return <button onClick={() => setCount(count + 1)}>{ count }</button>
}
```
### Class
```ts
import { LensComponent } from "@vovikilelik/react-lens";

interface Props {
    className?: string;
}

export class ClassComponent extends LensComponent<number, Props> {
    public render() {
        const {lens} = this.props;
        const {value} = this.state;
        return <button onClick={ () => lens.set(value + 1) }>{ value }</button>
    }
}
```
# Inherit
### Inherit native components
```ts
import { createLensComponent, getHtmlLikeModel } from "@vovikilelik/react-lens";

const LensInput = createLensComponent<string>(
    <input />,
    getHtmlLikeModel()
);
```
### Inherit custom components
```ts
interface Props {
    text: string;
    onTextChanged: (text: string) => void;
    className?: string;
}
const Input: React.FC<Props> = (props) => { /* implementation */ }

const inputModel = {
    getter: {name: 'text', mapper: v => v},
    setter: {name: 'onTextChanged', mapper: v => v}
}
const LensInput = createLensComponent<string, Props>(Input, inputModel);
```
### Using lens-components

**Make store.ts**
```ts
interface Store {
	anInput: string;
}

const store: { lens: Store } = { lens: { anInput: '' } };

export lens = new Lens<Store>(
	() => store.lens,
	(data, effect) => {
		store.lens = data;
		effect();
	}
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