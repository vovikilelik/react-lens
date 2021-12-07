import React, { useState, useEffect, useMemo } from 'react';
import { LensUtils } from '@vovikilelik/lens-js';

/**
 * Add listener to current lens.
 */
export const useLensAttach = (lens, ...callback) => {
	useEffect(() => {
		callback.forEach(c => lens.attach(c));
		return () => callback.forEach(c => lens.detach(c));
	}, [lens, ...callback]);
};

const getCallbackByDirective = (directive) => {
	switch (directive) {
		case 'path':
			return ({ current, diffs }) => current || diffs.length > 0;
		case 'tree':
			return ({ current, diffs }) => current || diffs.length === 0;
		default: // strict
			return ({ current }) => current;
	}
};

const matchMapper = (callbackOrDirective) => {
	switch (typeof callbackOrDirective) {
		case 'function':
			return callbackOrDirective;
		case 'string':
			return getCallbackByDirective(callbackOrDirective);
	}
};

/**
 * Like useState(), plus adding listener for render triggering.
 */
export const useLens = (lens, callback = 'strict', ...callbacks) => {
	const [value, setValue] = useState();
	
	const all = [callback, ...callbacks];
	
	const attach = useMemo(() => {
		const matches = all.map(matchMapper);
		return (...args) => {
			if (matches.some(m => m(...args))) {
				setValue(lens.get());
			}
		};
	}, [lens, ...all]);
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
export const useLensDebounce = (lens, timeout = 0, callback = 'strict', ...callbacks) => {
	const [value, setValue] = useState(lens.get());
	const debounce = useMemo(() => new LensUtils.Debounce(timeout), []);

	const { read, write } = getTimeoutSet(timeout);
	
	const all = [callback, ...callbacks];
	
	const attach = useMemo(() => {
		const matches = all.map(matchMapper);
		return (...args) => {
			if (matches.some(m => m(...args))) {
				debounce.run(() => setValue(lens.get()), read);
			}
		};
	}, [lens, read, ...all]);
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