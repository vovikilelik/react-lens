import React, { useState, useEffect } from 'react';
 
export const useLens = (lens, comparator = () => true) => {
    const [value, setValue] = useState();
    useEffect(() => {
        const callback = e => comparator(e) && setValue(lens.get());
        lens.attach(callback);
        return () => lens.detach(callback);
    }, [lens, comparator]);
    
    return [lens.get(), (value) => lens.set(value)];
};

export const getHtmlLikeModel = () => ({
    getter: {name: 'value', mapper: (v) => v},
    setter: {name: 'onChange', mapper: (e) => e.target.value}
});

export const createLensComponent = (component, model, comparator = () => true) =>
    ({lens, children, ...rest}) => {
        const [value, setValue] = useLens(lens, comparator);
        const {getter, setter} = model;
        const props = {
            [getter.name]: getter.mapper(value),
            [setter.name]: (e) => setValue(setter.mapper(e)),
            ...rest
        };
        return React.createElement(component.type || component.prototype, props, children);
    };
    
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