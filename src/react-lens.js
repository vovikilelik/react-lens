import { Debounce, Store, Triggers, createStore } from '@vovikilelik/lens-js';
import React, { useState, useEffect, useMemo, useCallback } from 'react';


/**
 * Add listener to current lens.
 */
export const useSubscribe = (lens, ...callbacks) => {
	useEffect(() => {
		const unsubscribers = callbacks.map(callback => lens.subscribe(callback));
		return  () => unsubscribers.forEach(unsubscriber => unsubscriber());
	}, [lens, ...callbacks]);
};

export const useLocalStore = (initData, instance = Store) => {
	return useMemo(() => createStore(initData, instance), [initData, instance]);
};

export const useStaticLocalStore = (initData, instance) => {
	const localData = useMemo(() => initData, []);
	return useLocalStore(localData, instance);
};

export const useDerivedLocalStore = (initData, instance) => {
	const store = useStaticLocalStore(initData, instance);

	useEffect(() => {
		store.set(initData);
	}, [store, initData]);

	return store;
};

const _createMatches = (triggersOrDirectives) =>
	triggersOrDirectives
		.map(t => {
			switch (typeof t) {
				case 'string':
					if (t === 'all') {
						return (() => true);
					} else {
						return Triggers[t] || (() => undefined);
					}
				case 'function':
					return t;
			}
		})
		.filter(t => t);

const _match = (matches, ...args) => {
	for (let i = 0; i < matches.length; i++) {
		const result = matches[i](...args);
		if (result !== undefined)
			return result;
	}
};

/**
 * Like useState(), plus adding listener for render triggering.
 */
export const useLens = (lens, trigger = 'object', ...triggers) => {
	const [value, setValue] = useState(lens.get());
	
	useEffect(() => {
		setValue(lens.get());

		const matches = _createMatches([trigger, ...triggers]);

		const callback = (...args) => {
			if (_match(matches, ...args)) {
				setValue(lens.get());
				return;
			}
		};

		return lens.subscribe(callback);
	}, [lens, trigger, ...triggers]);
	
	const setter = useCallback(value => {
		setValue(value); /* Need for react sync for input fields (caret jump bug) */
		lens.set(value);
	}, [lens]);

	return [value, setter];
};

const getTimeoutSet = (timeout = 0) => {
	switch (typeof timeout) {
		case 'object':
			return timeout;
		default:
			return {read: timeout, write: timeout};
	}
};

export const useDebounce = (timeout) => {
	return useMemo(() => new Debounce(timeout), [timeout]);
};

/**
 * Like useLens(), plus adding throttling.
 */
export const useLensDebounce = (lens, timeout = 0, trigger = 'object', ...triggers) => {
	const [value, setValue] = useState(lens.get());
	
	const debounce = useDebounce(timeout);

	const { read, write } = getTimeoutSet(timeout);

	useEffect(() => {
		setValue(lens.get());

		const matches = _createMatches([trigger, ...triggers]);

		const callback = (...args) => {
			if (_match(matches, ...args)) {
				debounce.run(() => setValue(lens.get()), read);
				return;
			}
		};

		const unsubscriber = lens.subscribe(callback);

		return () => {
			unsubscriber();
			debounce.cancel();
		};
	}, [lens, debounce, trigger, ...triggers]);
	
	const setter = useCallback(value => {
		setValue(value); /* Need for react sync for input fields (caret jump bug) */
		debounce.run(() => lens.set(value), write);
	}, [debounce, lens]);

	return [value, setter];
};

export const createLensContext = value => createContext({ value });

export const useLensContext = (context, defaultLens, trigger = 'object', ...triggers) => {
	const current = useContext(context);
	return useLens(current.value || defaultLens, trigger, ...triggers);
};

/**
 * Implementation lens connection over React.Component.
 */
export class LensComponent extends React.Component {

	constructor(props) {
		super(props);

		const {lens} = this.props;
		this.state = {value: lens.get()};

		this._lensCallback = this.onLensChanged.bind(this);
	}

	onLensChanged(event, lens) {
		this.setState({ value: this.props.lens.get() });
	}

	componentDidMount() {
		const {lens} = this.props;
		lens.subscribe(this._lensCallback);
	}

	componentWillUnmount() {
		const {lens} = this.props;
		lens.unsubscribe(this._lensCallback);
	}
}