import React from 'react';
import { Lens, AttachEvent, Callback } from "@vovikilelik/lens-ts";

declare type Comparator<T> = (e: AttachEvent<T>) => any;

declare function useLensAttach<T>(lens: Lens<T>, callback?: Callback<T>): void;

declare function useLens<T>(lens: Lens<T>, comparator?: Comparator<T>): [T, (value: T) => void];

declare interface ModelVector<A, B = A> {
    name: string;
    mapper: (value: A) => B
}

declare interface Model<L, G, S> {
    getter: ModelVector<L, G>, // value
    setter: ModelVector<S, L>  // onChanged
}

declare function getHtmlLikeModel<T, G extends {target: {value: T}}>(): Model<T, T, G>

declare function createLensComponent<L, P = {}>(
    component: React.ReactElement<P>,
    model: Model<L, any, any>,
    comparator?: Comparator<L>
): React.FC<P & { lens: Lens<L> }>

declare class LensComponent<L, P, S = {}> extends React.Component<P & { lens: Lens<L> }, S & { value: L }> {}