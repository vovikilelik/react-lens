import { Lens } from "@vovikilelik/lens-ts";
import React, { Component } from "react";
import { createLensComponent, getHtmlLikeModel } from "../react-lens";

const LensInput = createLensComponent<string>(<input />, getHtmlLikeModel());

interface State {
    name: string;
}

const store = { lens: { name: '123' } };

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
            </div>
        );
    }
}

export default App;