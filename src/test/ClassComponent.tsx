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