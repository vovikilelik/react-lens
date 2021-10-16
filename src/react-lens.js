import React, { useState, useEffect, useMemo } from 'react';
import { LensUtils } from '@vovikilelik/lens-js';

/**
 * Add listener to current lens.
 */
export const useLensAttach = (lens, callback) => {
	useEffect(() => {
		lens.attach(callback);
		return () => lens.detach(callback);
	}, [lens, callback]);
};

const defaultCallbackFactory = (resolve, lens) => () => resolve(lens.get());

const getCallbackFactoryByType = (type) => {
	switch(type) {
		case 'path':
			return (resolve, lens) => LensUtils.getPathCallback(() => resolve(lens.get()));
		case 'tree':
			return (resolve, lens) => LensUtils.getTreeCallback(() => resolve(lens.get()));
		case 'strict':
		default:
			return (resolve, lens) => LensUtils.getStrictCallback(() => resolve(lens.get()));
	}
};

const createCallbackFactory = (callbackFactory) => {
	switch(typeof callbackFactory) {
		case 'function':
			return callbackFactory;
		case 'string':
			return getCallbackFactoryByType(callbackFactory);
		default:
			return defaultCallbackFactory;
	}
};

/**
 * Like useState(), plus adding listener for render triggering.
 */
export const useLens = (lens, callbackFactory = 'strict') => {
	const [value, setValue] = useState();

	const attach = useMemo(() => {
		const factory = createCallbackFactory(callbackFactory);
		return factory(state => setValue(state), lens);
	}, [lens, callbackFactory]);
	useLensAttach(lens, attach);

	return [lens.get(), (value) => lens.set(value)];
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
export const useLensAsync = (lens, timeout = 0, callbackFactory = 'strict') => {
	const [value, setValue] = useState(lens.get());
	const debounce = useMemo(() => new LensUtils.Debounce(timeout), []);

	const { read, write } = getTimeoutSet(timeout);

	const attach = useMemo(() => {
		const factory = createCallbackFactory(callbackFactory);
		return factory(state => debounce.run(() => setValue(state), read), lens);
	}, [lens, read, callbackFactory]);
	useLensAttach(lens, attach);

	return [value, (v) => {
		setValue(v);
		debounce.run(() => lens.set(v), write);
	}];
};

/**
 * Detected node changes and return changes count
 */
export const useLensCatch = (lens) => {
	const [version, setVersion] = useState(0);
	useLensAttach(lens, () => setVersion(version + 1));
	return version;
};

/**
 * Like useState(), plus adding listener for render triggering.
 */
export const useDebounceLens = (lens, callbackFactory = defaultCallbackFactory) => {
	const [value, setValue] = useState();

	const attach = useMemo(() => {
		return callbackFactory(lens, (state) => setValue(state));
	}, [lens, callbackFactory]);
	useLensAttach(lens, attach);

	return [lens.get(), (value) => lens.set(value)];
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

		this._lensCallback = this._onLensChanged.bind(this);
	}

	_onLensChanged(e) {
		const {lens} = this.props;
		this.setState({value: lens.get()});
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