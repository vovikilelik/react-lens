/**
 * MIT
 */

import { Debounce, Store, Triggers, createStore } from '@devstore/lens-js';
import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';

/**
 * Creates a hook that subscribes to lens changes and triggers callbacks.
 * @param {Object} lens - The lens instance to subscribe to.
 * @param {...Function} callbacks - Callback functions to be called on lens changes.
 * @param {Array} [callbacks...] - Optional dependency array for the effect.
 * @returns {void}
 */
export const useSubscribe = (lens, ...callbacks) => {
	const last = callbacks[callbacks.length - 1];
	const deps = Array.isArray(last) ? last : undefined;
	
	useEffect(() => {
		const unsubscribers = callbacks.map(callback => lens.subscribe(callback));
		return () => unsubscribers.forEach(unsubscriber => unsubscriber && unsubscriber());
	}, [lens, ...(deps || callbacks)]);
};

/**
 * Creates a local store instance with the provided initial data.
 * @param {*} initData - Initial data for the store.
 * @param {Function} [instance=Store] - Store class to use for creation.
 * @returns {Object} Created store instance.
 */
export const useLocalStore = (initData, instance = Store) => {
	return useMemo(() => createStore(initData, instance), [initData, instance]);
};

/**
 * Creates a static local store that doesn't recreate when initData changes.
 * @param {*} initData - Initial data for the store (stable reference).
 * @param {Function} [instance] - Store class to use for creation.
 * @returns {Object} Created store instance.
 */
export const useStaticLocalStore = (initData, instance) => {
	const localData = useMemo(() => initData, []);
	return useLocalStore(localData, instance);
};

/**
 * Creates a store instance with flexible dependency management.
 * @param {*} initData - Initial data for the store.
 * @param {Function|Array} [instanceOrDeps=Store] - Store class or dependency array.
 * @param {Array} [deps] - Additional dependencies when instance is provided.
 * @returns {Object} Created store instance.
 */
export const useLensStore = (initData, instanceOrDeps = Store, deps) => {
	const instanceIsDeps = Array.isArray(instanceOrDeps);

	const currentInstance = instanceIsDeps
		? Store
		: instanceOrDeps;

	const currentDeps = instanceIsDeps
		? instanceOrDeps
		: (deps ? [...deps, currentInstance] : [currentInstance]);

	return useMemo(() => createStore(initData, currentInstance), currentDeps);
};

/**
 * Creates a derived store that syncs with incoming data changes.
 * @param {*} initData - Initial data for the store.
 * @param {Function} [instance] - Store class to use for creation.
 * @returns {Object} Created store instance that updates when initData changes.
 */
export const useDerivedStore = (initData, instance) => {
	const store = useStaticLocalStore(initData, instance);

	useEffect(() => {
		store.set(initData);
	}, [store, initData]);

	return store;
};

/**
 * Creates a chained lens instance derived from the parent lens.
 * @param {Object} lens - Parent lens to chain from.
 * @param {Object} instance - Lens instance to use for chaining.
 * @returns {Object} Chained lens instance.
 */
export const useDelegate = (lens, instance) => {
	return useMemo(() => lens.delegate(instance), [lens, instance]);
};

/**
 * Creates an array of match functions from triggers or directives.
 * @param {Array} triggersOrDirectives - Array of trigger strings or functions.
 * @returns {Array} Array of match functions.
 */
const _createMatches = (triggersOrDirectives) =>
	triggersOrDirectives
		.map(t => {
			switch (typeof t) {
				case 'string':
					if (t === 'deep') {
						return (() => true);
					} else {
						return Triggers[t] || (() => undefined);
					}
				case 'function':
					return t;
			}
		})
		.filter(t => t);

/**
 * Executes match functions until one returns a non-undefined value.
 * @param {Array} matches - Array of match functions to execute.
 * @param {...*} args - Arguments to pass to each match function.
 * @returns {*} First non-undefined result from match functions, or undefined.
 */
const _match = (matches, ...args) => {
	for (let i = 0; i < matches.length; i++) {
		const result = matches[i](...args);
		if (result !== undefined)
			return result;
	}
};

/**
 * Hook that provides lens state and setter with automatic render triggering.
 * @param {Object} lens - The lens instance to read from and write to.
 * @param {string|Function} [trigger='object'] - Trigger condition for updates.
 * @param {...(string|Function)} triggers - Additional trigger conditions.
 * @returns {[*, Function]} Current value and setter function.
 */
export const useLens = (lens, trigger = 'object', ...triggers) => {
	const [value, setValue] = useState(lens?.get());
	
	useEffect(() => {
		if (!lens) return;

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
		lens?.set(value);
	}, [lens]);

	return [value, setter];
};

/**
 * Converts timeout value to object with read/write properties.
 * @param {number|Object} timeout - Timeout value or object.
 * @returns {Object} Object with read and write timeout properties.
 */
const getTimeoutSet = (timeout = 0) => {
	switch (typeof timeout) {
		case 'object':
			return timeout;
		default:
			return {read: timeout, write: timeout};
	}
};

/**
 * Creates a debounced function instance.
 * @param {number|Object} timeout - Timeout value or object with read/write properties.
 * @returns {Debounce} Debounce instance.
 */
export const useDebounce = (timeout) => {
	return useMemo(() => new Debounce(timeout), [timeout]);
};

/**
 * Executes memo function with lens when value changes (no return value).
 * @param {Function} memo - Memo function to execute with lens.
 * @param {Object} lens - Lens instance to pass to memo function.
 * @param {string|Function} [trigger='object'] - Trigger condition.
 * @param {...(string|Function)} triggers - Additional trigger conditions.
 * @returns {void}
 */
export const useLensMemo = (memo, lens, trigger = 'object', ...triggers) => {
	const [value] = useLens(lens, trigger, ...triggers);
	useMemo(() => memo(lens), [value, lens]);
}

/**
 * Hook with debounced state updates and throttled render triggering.
 * @param {Object} lens - The lens instance to read from and write to.
 * @param {number|Object} [timeout=0] - Timeout value or object with read/write properties.
 * @param {string|Function} [trigger='object'] - Trigger condition for updates.
 * @param {...(string|Function)} triggers - Additional trigger conditions.
 * @returns {[*, Function]} Current value and setter function.
 */
export const useLensDebounce = (lens, timeout = 0, trigger = 'object', ...triggers) => {
	const [value, setValue] = useState(lens?.get());
	
	const debounce = useDebounce(timeout);

	const { read, write } = getTimeoutSet(timeout);

	useEffect(() => {
		if (!lens) return;

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
		debounce.run(() => lens?.set(value), write);
	}, [debounce, lens]);

	return [value, setter];
};

/**
 * Creates a context for lens instances.
 * @param {*} value - Initial context value.
 * @returns {Object} React context object.
 */
export const createLensContext = value => createContext(value);

/**
 * Hook that consumes lens from context with automatic subscription.
 * @param {Object} context - Context object created with createLensContext.
 * @param {string|Function} [trigger='object'] - Trigger condition for updates.
 * @param {...(string|Function)} triggers - Additional trigger conditions.
 * @returns {[*, Function]} Current value and setter function from the lens.
 */
export const useLensContext = (context, trigger = 'object', ...triggers) => {
	const current = useContext(context);
	return useLens(current, trigger, ...triggers);
};

/**
 * React component that subscribes to lens changes and re-renders on updates.
 * @param {Object} props - Component props.
 * @param {Object} props.lens - Lens instance to subscribe to.
 */
export class LensComponent extends React.Component {

	/**
	 * @param {Object} props - Component props containing lens.
	 */
	constructor(props) {
		super(props);

		const {lens} = this.props;
		this.state = {value: lens.get()};

		this._lensCallback = this.onLensChanged.bind(this);
	}

	/**
	 * Callback for lens change events.
	 * @param {Object} event - Change event object.
	 * @param {Object} lens - Lens instance that changed.
	 */
	onLensChanged(event, lens) {
		this.setState({ value: this.props.lens.get() });
	}

	/**
	 * Subscribes to lens on component mount.
	 */
	componentDidMount() {
		const {lens} = this.props;
		lens.subscribe(this._lensCallback);
	}

	/**
	 * Unsubscribes from lens on component unmount.
	 */
	componentWillUnmount() {
		const {lens} = this.props;
		lens.unsubscribe(this._lensCallback);
	}
}