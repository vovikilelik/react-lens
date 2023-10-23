import React from 'react';
import { useDebounce, useLocalStore, useSubscribe } from '../react-lens';

const Component: React.FC = () => {
	const store = useLocalStore({ foo: '1' });

	useSubscribe(store, (e, node) => {});

	const debounce = useDebounce(1223);

	return <></>;
}