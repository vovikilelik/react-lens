import { Lens, LensUtils } from "@vovikilelik/lens-ts";
import React, { Component, useCallback, useState } from "react";
import { useLens, useLensAsync, createLensComponent, getHtmlLikeModel, useLensAttach, CallbackFactory } from "../react-lens";
import { ClassComponent } from "./ClassComponent";

function Throttling(defaultTimeout) {
    let sync = 0;
    this.run = (func, timeout = defaultTimeout) => {
        const stamp = ++sync;
        setTimeout(() => {
            (sync === stamp) && func();
        }, timeout);
    };
}

const LensInput = createLensComponent<string>(<input />, getHtmlLikeModel());

interface State {
    name: string;
    counter: number;
}

const store = { lens: { name: '123', counter: 0 } };

const lens = new Lens<State>(
  () => store.lens,
  (value) => {
      store.lens = value;
  }
);

lens.go('name').attach(e => console.log(JSON.stringify(lens.get())));

const TestInput: React.FC<{lens: Lens<string>}> = ({ lens }) => {
    //const [value, setValue] = useLens(lens, (lens, resolve) => LensUtils.getDebounceCallback(() => resolve(lens.get()), 1000));

    //const [value, setValue] = useLensDebounce(lens, 1000, (resolve, lens) => LensUtils.getDebounceCallback(() => resolve(lens.get()), 1000));
    const [value, setValue] = useLensAsync(lens, 1000);

    return <input value={value} onChange={e => setValue(e.target.value)} />
}

class App extends Component {
    render() {
        const name = lens.go('name');

        return (
            <div>
                <h1>My React App!</h1>
                <LensInput 
                   lens={name}
                />
                <LensInput 
                   lens={name}
                />
                <TestInput 
                   lens={name}
                />
                <ClassComponent lens={lens.go('counter')} />
                <ClassComponent lens={lens.go('counter')} />
            </div>
        );
    }
}

export default App;