import React from 'react';
import { useDerivedStore, useLens, useLensStore, useLocalStore, useStaticLocalStore, useSubscribe } from '../../react-lens';
import { Store } from '@vovikilelik/lens-js';

export const LocalStore: React.FC = () => {
	const store = useLocalStore('text');
	useLens(store);

	useSubscribe(store, (e, node) => {
		console.log(node.get());
	});

	return <button onClick={() => store.set(Math.random() + '')}>{'useLocalStore ' + store.get()}</button>;
}

export const LocalDerivedStorePeer: React.FC<{ value: any }> = ({ value }) => {
	const store = useDerivedStore(value);
	useLens(store);

	return <button onClick={() => store.set(Math.random() + '')}>{'owned store ' + store.get()}</button>;
}

export const LocalDerivedStore: React.FC = () => {
	const store = useLocalStore('text');
	useLens(store);

	return  (
		<div>
			<button onClick={() => store.set(Math.random() + '')}>{'LocalDerivedStore ' + store.get()}</button>;
			<LocalDerivedStorePeer value={store.get()} />
		</div>
	)
}

export const LensStore: React.FC = () => {
	const store = useLensStore({ foo: '' });
	useLens(store);

	const store1 = useLensStore({ foo: '' }, ['qwe']);
	const store2 = useLensStore({ foo: '' }, Store, ['qwe']);
	const store3 = useLensStore({ foo: '' }, Store);

	useSubscribe(store, (e, node) => {
		console.log(node.get());
	});

	return <button onClick={() => store.go('foo').set(Math.random() + '')}>{'LensStore ' + store.get()}</button>;
}
