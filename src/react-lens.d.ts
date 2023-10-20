import React from 'react';

import { Lens, Callback, AttachEvent, Trigger, Instance, Store, Debounce } from "@vovikilelik/lens-js";

declare function useSubscribe<T>(lens: Lens<T>, ...callback: Callback<T>[]): void;

declare function useLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;
declare function useStaticLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;
declare function useDerivedLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

declare type DebounceType = {
    run: (func: (sync: () => boolean, stamp: number) => void, timeout?: number) => void;
    cancel: () => void;
};

declare function useDebounce(defaultTimeout?: number): DebounceType;

declare type MatchFunctionOrDirective<T> = Trigger<T> | 'object' | 'strict' | 'path' | 'subtree' | 'all';
declare interface TimeoutSet {
	read: number;
	write: number;
}

declare function useLens<T>(lens: Lens<T>, ...matches: MatchFunctionOrDirective<T>[]): [T, (value: T) => void];

declare function useLensDebounce<T>(lens: Lens<T>, timeout: number | TimeoutSet, ...matches: MatchFunctionOrDirective<T>[]): [T, (value: T) => void];

declare interface ModelVector<A, B = A> {
    name: string;
    mapper: (value: A) => B
}

declare class LensComponent<L, P, S = {}> extends React.Component<P & { lens: Lens<L> }, S & { value: L }> {
    protected onLensChanged(event: AttachEvent<L>, lens: Lens<L>): void;
}