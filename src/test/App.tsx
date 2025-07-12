import React, { Component, useRef, useState } from "react";

import { useLens, useLensDebounce, useLensStore, useSubscribe } from "../react-lens";
import { ClassComponent } from "./ClassComponent";
import { Lens } from '@devstore/lens-js';

import { LensStore, LocalDerivedStore, LocalStore } from './modules';

const LensInput: React.FC<{ lens: Lens<string> }> = ({ lens }) => {
	const [value, setValue] = useLens(lens);

	return (
		<input value={value} onChange={e => setValue(e.target.value)} />
	);
}

interface State {
    name: string;
	multi: { path: { strict: string, tree: { value: string } } };
    counter: number;
}

const store = { lens: { name: '123', counter: 0, multi: { path: { strict: 'strict', tree: { value: 'tree' } } } } };

const lens = new Lens<State>(
  () => store.lens,
  (value) => {
      store.lens = value;
  }
);

lens.go('name').subscribe(e => console.log(JSON.stringify(lens.get())));

const DebounceInput: React.FC<{lens: Lens<string>}> = ({ lens }) => {
    const [value, setValue] = useLensDebounce(lens, 1000);
    return <input value={value} onChange={e => setValue(e.target.value)} />
}

const C: React.FC<any> = ({ title }) => {
	const ref = useRef({ counter: 0 });
	
	return (
		<div>
			<span>{ title }&nbsp;</span>
			<span>{ ref.current.counter++ }</span>
		</div>
	);
}

const Flow: React.FC<any> = ({ lens, func, title }) => {
	const [path] = useLens(lens, func || title);
	
	return <C title={title} />;
}

const SubscribeTest: React.FC = () => {
	const store = useLensStore(-1);
	useLens(store);

	const [trigger, setTrigger] = useState(0);
	const [count, setCount] = useState(0);
	const [text, setText] = useState(0);

	useSubscribe(store, () => setText(prev => prev + count), [trigger]);

	return (
		<div>
			<div>Subscribe test</div>
			<button onClick={() => setTrigger(trigger + 1)}>trigger: {trigger}</button>
			<button onClick={() => setCount(count + 1)}>const: {count}</button>
			<button onClick={() => store.set(prev => prev + 1)}>Check: [{store.get()}] Count is {text}</button>

		</div>
	);
}

class App extends Component {
    render() {
      const name = lens.go('name');
			const path = lens.go('multi').go('path');
			const node = lens.go('multi').go('path').go('strict');
			const tree = lens.go('multi').go('path').go('tree').go('value');

      return (
        <div>
					<div>
						<h1>Set</h1>
						<ClassComponent lens={lens.go('counter')} />
						<ClassComponent lens={lens.go('counter')} />
					</div>
					<div>
						<h1>Debounce</h1>
						<LensInput 
							lens={name}
						/>
						<LensInput 
							lens={name}
						/>
						<DebounceInput 
							lens={name}
						/>
					</div>
					<div>
						<h1>Multi attach</h1>
						<button onClick={() => path.set({ strict: Math.random() + '', tree: { value: Math.random() + '' } })}>Path</button>
						<button onClick={() => node.set(Math.random() + '')}>Strict</button>
						<button onClick={() => tree.set(Math.random() + '')}>Tree</button>
						<div>===path===</div>
						<Flow lens={path} title='after' />
						<Flow lens={node} title='after' />
						<Flow lens={tree} title='after' />
						<div>===strict===</div>
						<Flow lens={path} title='strict' />
						<Flow lens={node} title='strict' />
						<Flow lens={tree} title='strict' />
						<div>===tree===</div>
						<Flow lens={path} title='before' />
						<Flow lens={node} title='before' />
						<Flow lens={tree} title='before' />
					</div>
					<div>
						<h1>Callbacks</h1>
						<button onClick={() => name.set(Math.floor(Math.random() * 5) + '')}>Random</button>
						<Flow lens={name} func={() => false} title='false' />
						<Flow lens={name} func={() => true} title='true' />
						<Flow lens={name} func={() => name.get() === '2'} title='===2' />
					</div>
					<LocalStore />
					<LocalDerivedStore />
					<LensStore />
					<SubscribeTest />
        </div>
      );
    }
}

export default App;