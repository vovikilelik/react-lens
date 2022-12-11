import { Callbacks, Debounce } from '@vovikilelik/lens-js';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Add listener to current lens.
 */
export const useAttach = (lens, ...callback) => {
	useEffect(() => {
		callback.forEach(c => lens.attach(c));
		return () => callback.forEach(c => lens.detach(c));
	}, [lens, ...callback]);
};

const getDirectiveMapper = (callback) => (directive) => {
	return Callbacks[directive](callback);
};

/**
 * Like useState(), plus adding listener for render triggering.
 */
export const useLens = (lens, callback = 'change', ...callbacks) => {
	const [value, setValue] = useState();
	
	const all = [callback, ...callbacks];

	const attach = useMemo(() => {

		const matches = all.filter(c => typeof c === 'function');
		const directives = all.filter(c => typeof c === 'string')
			.map(getDirectiveMapper(() => setValue(lens.get())));

		return (...args) => {
			if (matches.some(m => m(...args))) {
				setValue(lens.get());
				return;
			}

			directives.forEach(d => d(...args));
		};
	}, [lens, ...all]);

	useAttach(lens, attach);
	
	const setter = useCallback(value => lens.set(value), [lens]);

	return [lens.get(), setter];
};

const getTimeoutSet = (timeout = 0) => {
	switch (typeof timeout) {
		case 'object':
			return timeout;
		default:
			return {read: timeout, write: timeout};
	}
};

/**
 * Like useLens(), plus adding throttling.
 */
export const useDebounce = (lens, timeout = 0, callback = 'change', ...callbacks) => {
	const [value, setValue] = useState(lens.get());
	const debounce = useMemo(() => new Debounce(timeout), []);

	const { read, write } = getTimeoutSet(timeout);
	
	const all = [callback, ...callbacks];
	
	const attach = useMemo(() => {

		const matches = all.filter(c => typeof c === 'function');
		const directives = all.filter(c => typeof c === 'string')
			.map(getDirectiveMapper(() => debounce.run(() => setValue(lens.get()), read)));

		return (...args) => {
			if (matches.some(m => m(...args))) {
				debounce.run(() => setValue(lens.get()), read);
				return;
			}

			directives.forEach(d => d(...args));
		};
	}, [lens, ...all]);

	useAttach(lens, attach);

	return [value, (v) => {
		setValue(v);
		debounce.run(() => lens.set(v), write);
	}];
};

/**
 * Gettig default get-set mapper for standart Html components.
 */
export const getHtmlLikeModel = () => ({
		getter: {name: 'value', mapper: (v) => v},
		setter: {name: 'onChange', mapper: (e) => e.target.value}
	});

const _defaultMapper = (value) => value;

/**
 * Covering custom component
 */
export const createLensComponent = (component, model) =>
	({ lens, children, ...rest }) => {
		const [value, setValue] = useLens(lens);
		const {getter, setter} = model;

		const prevProps = (component.props && typeof component.props === 'object') ? component.props : {};
		const props = {
			...prevProps,
			[getter.name]: getter.mapper ? getter.mapper(value) : _defaultMapper(value),
			[setter.name]: (e) => setValue(setter.mapper ? setter.mapper(e) : _defaultMapper(e)),
			...rest
		};

		return React.createElement(component.type || component.prototype, props, children);
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
		lens.attach(this._lensCallback);
	}

	componentWillUnmount() {
		const {lens} = this.props;
		lens.detach(this._lensCallback);
	}
}