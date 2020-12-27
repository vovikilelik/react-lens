# react-lens
It is the utils for easy implementation `lens` on react-apps.
# Creation own components
### FC
```ts
import { useLens } from "@vovikilelik/react-lens";

const MyLensComponent: React.FC = ({lens}) => {
    const [value, setValue] = useLens<number>(lens);
    return <button onClick={() => setValue(value + 1)}>{ value }</button>
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
```ts
const Application: React.FC = (props) => {
    return (
        <div>
            <div>Lens Component</div>
            <LensInput lens={anInputLens}/>
        </div>
    )
}
```