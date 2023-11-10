/**
 * LGPL-2.1-or-later 
 */

import React, { Context } from 'react';

import { Lens, Callback, AttachEvent, Trigger, Instance, Store, DebounceType, ChainFactory } from "@vovikilelik/lens-js";

declare function useSubscribe<T>(lens: Lens<T>, ...callback: Callback<T>[]): void;

declare function useLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;
declare function useStaticLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;
declare function useDerivedStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

declare function useChain<A extends Lens<T>, B extends Lens<any>, T>(lens: Lens<T>, factory: ChainFactory<A, B> | Instance<B, T>): B;

declare function useDebounce(defaultTimeout?: number): DebounceType;

declare type MatchFunctionOrDirective<T> = Trigger<T> | 'object' | 'strict' | 'path' | 'subtree' | 'all';
declare interface TimeoutSet {
	read: number;
	write: number;
}

declare type DescriptorType<T> = [T, (value: T) => void];

declare function useLens<T>(lens: Lens<T>, ...matches: MatchFunctionOrDirective<T>[]): DescriptorType<T>;

declare function useLensDebounce<T>(lens: Lens<T>, timeout: number | TimeoutSet, ...matches: MatchFunctionOrDirective<T>[]): DescriptorType<T>;

declare type LensContext<T> = Context<{ value: Lens<T> }>;
declare function createLensContext<T>(value?: Lens<T>): LensContext<T>;
declare function useLensContext<T>(context: LensContext<T>, defaultLens?: Lens<T>, ...triggers: Trigger<T>[]): DescriptorType<T>;

declare class LensComponent<L, P, S = {}> extends React.Component<P & { lens: Lens<L> }, S & { value: L }> {
    protected onLensChanged(event: AttachEvent<L>, lens: Lens<L>): void;
}