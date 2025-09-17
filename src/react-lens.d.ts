/**
 * MIT
 */

import React, { Context } from 'react';

import { Lens, Callback, AttachEvent, Trigger, Instance, Store, DebounceType, ChainFactory } from "@devstore/lens-js";

declare function useSubscribe<T>(lens: Lens<T>, ...callback: Callback<T>[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, deps: any[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, c2: Callback<T>, deps: any[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, c2: Callback<T>, c3: Callback<T>, deps: any[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, c2: Callback<T>, c3: Callback<T>, c4: Callback<T>, deps: any[]): void;

/** @deprecated use useLensStore instead */
declare function useLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

/** @deprecated use useLensStore instead */
declare function useStaticLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

declare function useLensStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(data: T, deps?: unknown[]): R;
declare function useLensStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(data: T, instance?: Instance<R, T>, deps?: unknown[]): R;

declare function useDerivedStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

declare function useChain<A extends Lens<T>, B extends Lens<any>, T>(lens: Lens<T>, factory: ChainFactory<A, B> | Instance<B, T>): B;

declare function useDebounce(defaultTimeout?: number): DebounceType;

declare type MatchFunctionOrDirective<T> = Trigger<T> | 'object' | 'objectDefined' | 'strict' | 'path' | 'subtree' | 'deep';
declare interface TimeoutSet {
	read: number;
	write: number;
}

declare type DescriptorType<T> = [T, (value: T | ((prev: T) => T)) => void];

declare function useLens<T>(lens: Lens<T> | undefined, ...matches: MatchFunctionOrDirective<T>[]): DescriptorType<T>;

declare function useLensMemo<R, T>(memo: (lens: Lens<T>) => R, lens: Lens<T>, ...matches: MatchFunctionOrDirective<T>[]): R;

declare function useLensDebounce<T>(lens: Lens<T> | undefined, timeout: number | TimeoutSet, ...matches: MatchFunctionOrDirective<T>[]): DescriptorType<T>;

declare type LensContext<T> = Context<{ value: Lens<T> }>;
declare function createLensContext<T>(value?: Lens<T>): LensContext<T>;
declare function useLensContext<T>(context: LensContext<T>, defaultLens?: Lens<T> | null, ...triggers: Trigger<T>[]): DescriptorType<T>;

declare class LensComponent<L, P, S = {}> extends React.Component<P & { lens: Lens<L> }, S & { value: L }> {
    protected onLensChanged(event: AttachEvent<L>, lens: Lens<L>): void;
}