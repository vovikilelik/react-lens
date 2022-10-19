import React from 'react';

import { Lens, Callback, AttachEvent } from "@vovikilelik/lens-ts";

declare function useAttach<T>(lens: Lens<T>, ...callback: Callback<T>[]): void;

declare type MatchFunction<T> = (event: AttachEvent<T>, node: Lens<T>) => any;
declare type MatchFunctionOrDirective<T> = MatchFunction<T> | Callback<T> | 'change' | 'strict' | 'before' | 'after';
declare interface TimeoutSet {
	read: number;
	write: number;
}

declare function useLens<T>(lens: Lens<T>, ...matches: MatchFunctionOrDirective<T>[]): [T, (value: T) => void];

declare function useDebounce<T>(lens: Lens<T>, timeout: number | TimeoutSet, ...matches: MatchFunctionOrDirective<T>[]): [T, (value: T) => void];

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

declare class LensComponent<L, P, S = {}> extends React.Component<P & { lens: Lens<L> }, S & { value: L }> {
    protected onLensChanged(event: AttachEvent<L>, lens: Lens<L>): void;
}