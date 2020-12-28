import { Lens } from "@vovikilelik/lens-ts";
import React, { Component } from "react";
import { createLensComponent, getHtmlLikeModel } from "../react-lens";
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
  (value, effect) => {
      store.lens = value;
      effect();
  }
);

lens.go('name').attach(e => console.log(JSON.stringify(lens.get())));

class App extends Component {
    render() {
        return (
            <div>
                <h1>My React App!</h1>
                <LensInput 
                   lens={lens.go('name')}
                />
                <LensInput 
                   lens={lens.go('name')}
                />
                <ClassComponent lens={lens.go('counter')} />
                <ClassComponent lens={lens.go('counter')} />
            </div>
        );
    }
}

export default App;