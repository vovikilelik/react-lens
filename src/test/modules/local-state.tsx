import React from 'react';
import { useDerivedStore, useLens, useLocalStore, useStaticLocalStore, useSubscribe } from '../../react-lens';

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
