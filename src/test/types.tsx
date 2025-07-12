import React from 'react';
import { useChain, useDebounce, useLens, useLensStore, useLocalStore, useSubscribe } from '../react-lens';
import { Lens, createStore, transform } from '@devstore/lens-js';

const Component: React.FC = () => {
	const store = useLocalStore({ foo: '1' });

	useSubscribe(store, (e, node) => {});

	const debounce = useDebounce(1223);

	return <></>;
}

const xstore = createStore(0);

const colorTransformer = transform<number, string>(
  v => `#${v.toString(16)}`,
  v => parseInt(v.substring(1), 16)
);

class XLens<T> extends Lens<T> {
	xtest() {};
}

const Component2: React.FC = () => {
	const store = useChain(xstore, current => {
		return new XLens(xstore.getter, xstore.setter);
	});

	const v = store.get();

	useSubscribe(store, (e, node) => {});

	const debounce = useDebounce(1223);

	const [x, setX] = useLens(xstore);

	setX(v => v + 1);

	return <></>;
}

interface Foo {
	foo: string;
}

const Component3: React.FC = () => {
	const store = useLensStore<Foo>({ foo: '' }, [true]);

	store.get().foo

	return <></>;
}