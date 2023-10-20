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
}

export const useStaticLocalStore = (initData, instance) => {
	const localData = useMemo(() => initData, []);
	return useLocalStore(localData, instance);
}

export const useDerivedLocalStore = (initData, instance) => {
	const store = useStaticLocalStore(initData, instance);

	useEffect(() => {
		store.set(initData);
	}, [store, initData]);

	return store
}

const _createMatches = (triggersOrDirectives) =>
	triggersOrDirectives
		.map(t => {
			switch (typeof t) {
				case 'string':
					if (!Triggers[t])
						return (() => true);

					return (...args) => {
						const result = Triggers[t](...args);

						if (!result)
							return undefined;

						return result;
					}
				case 'function':
					return t;
			}
		})
		.filter(t => t);

/**
 * Like useState(), plus adding listener for render triggering.
 */
export const useLens = (lens, trigger = 'object', ...triggers) => {
	const [value, setValue] = useState(lens.get());
	
	useEffect(() => {
		setValue(lens.get());
	}, [lens]);
	
	const attach = useMemo(() => {
		const matches = _createMatches([trigger, ...triggers]);

		return (...args) => {
			if (matches.some(m => m(...args))) {
				setValue(lens.get());
				return;
			}
		};
	}, [lens, trigger, ...triggers]);

	useSubscribe(lens, attach);
	
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
	return useMemo(() => new Debounce(timeout), []);
}

/**
 * Like useLens(), plus adding throttling.
 */
export const useLensDebounce = (lens, timeout = 0, trigger = 'object', ...triggers) => {
	const [value, setValue] = useState(lens.get());
	
	useEffect(() => {
		setValue(lens.get());
	}, [lens]);
	
	const debounce = useDebounce(timeout);

	const { read, write } = getTimeoutSet(timeout);
	
	const attach = useMemo(() => {
		const matches = _createMatches([trigger, ...triggers]);

		return (...args) => {
			if (matches.some(m => m(...args))) {
				debounce.run(() => setValue(lens.get()), read);
				return;
			}
		};
	}, [lens, trigger, ...triggers]);

	useSubscribe(lens, attach);
	
	const setter = useCallback(value => {
		setValue(value); /* Need for react sync for input fields (caret jump bug) */
		debounce.run(() => lens.set(value), write);
	}, [debounce, lens]);

	return [value, setter];
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