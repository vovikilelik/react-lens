import React, { useState, useEffect } from 'react';
 
 /**
  * Add listener to current lens.
  */
 export const useLensAttach = (lens, callback) => {
    useEffect(() => {
        lens.attach(callback);
        return () => lens.detach(callback);
    }, [lens, callback]);
}

/**
 * Like useState(), plus adding listener for render triggering.
 */
export const useLens = (lens) => {
    const [value, setValue] = useState();
    useLensAttach(lens, () => setValue(lens.get()));
    return [lens.get(), (value) => lens.set(value)];
};

/**
 * Detected node changes and return changes count
 */
export const useLensCatch = (lens) => {
    const [version, setVersion] = useState(0);
    useLensAttach(lens, () => setVersion(version + 1));
    return version;
}

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
    ({lens, children, ...rest}) => {
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
        this.state = { value: lens.get() };

        this._lensCallback = this._onLensChanged.bind(this);
    }
    
    _onLensChanged(e) {
        const {lens} = this.props;
        this.setState({ value: lens.get() });
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