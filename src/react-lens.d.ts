import React from 'react';
import { Lens, Callback, AttachEvent } from "@vovikilelik/lens-ts";

declare function useLensAttach<T>(lens: Lens<T>, callback: Callback<T>): void;

declare interface CallbackFactory<T> {
    (resolve: (value: T) => void, lens: Lens<T>): Callback<T>;
}

declare type TimeoutSet = { read: number, write: number };

declare function useLens<T>(lens: Lens<T>, factory: CallbackFactory<T>): [T, (value: T) => void];
declare function useLens<T>(lens: Lens<T>, factoryType?: 'path' | 'strict' | 'tree'): [T, (value: T) => void];

declare function useLensAsync<T>(lens: Lens<T>, timeout: number | TimeoutSet, callbackFactory?: CallbackFactory<T>): [T, (value: T) => void];
declare function useLensAsync<T>(lens: Lens<T>, timeout: number | TimeoutSet, factoryType?: 'path' | 'strict' | 'tree'): [T, (value: T) => void];

declare function useLensCatch<T>(lens: Lens<T>): number;

declare interface ModelVector<A, B = A> {
    name: string;
    mapper: (value: A) => B
}

declare interface Model<L, G, S> {
    getter: ModelVector<L, G>, // value
    setter: ModelVector<S, L>  // onChanged
}

declare function getHtmlLikeModel<T, G extends { target: { value: T } }>(): Model<T, T, G>

declare function createLensComponent<L, P = {}>(
    component: React.ReactElement<P>,
    model: Model<L, any, any>
): React.FC<P & { lens: Lens<L> }>

declare class LensComponent<L, P, S = {}> extends React.Component<P & { lens: Lens<L> }, S & { value: L }> { }