import React from "react";
import { LensComponent } from "../react-lens";

interface Props {
    className?: string;
}

export class ClassComponent extends LensComponent<number, Props> {
    public render() {
        const {lens} = this.props;
        const {value} = this.state;
        return <button onClick={ () => lens.set(value + 1) }>{ value }</button>
    }
}

const Counter = ({ value }) => {
	return <div>{ value }</div>;
};

const Counter2 = ({ value, digit }) => {
	return <div>{ `${value} ${digit}` }</div>
};//`

const Counter3 = ({ value, digit, type }) => {
	const text = type ? `(${digit})` : digit;
	return <div>{ `${value} ${text}` }</div>
};//`

const getCoveredDigits = (digits) => `(${digits})`;

<Counter
  value={value}
  digits={getCoveredDigits(digits)}
/>