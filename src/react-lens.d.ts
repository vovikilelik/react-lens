/**
 * MIT
 */

import React, { Context } from 'react';

import { Lens, Callback, AttachEvent, Trigger, Instance, Store, DebounceType, ChainFactory } from "@devstore/lens-js";

/**
 * Creates a subscription to lens changes and executes callbacks when the lens state changes.
 * @template T The type of data stored in the lens.
 * @param lens The lens instance to subscribe to.
 * @param callback Callback function(s) to execute when the lens changes.
 * @param deps Optional dependency array for the effect (similar to useEffect).
 * @example
 * ```ts
 * import React from 'react';
 * import { useSubscribe, useLensStore } from '@devstore/react-lens';
 * 
 * const Component: React.FC = () => {
 *   const localStore = useLensStore({ count: 0 });
 *   
 *   const callback = React.useCallback(() => {
 *     console.log('Store changed!');
 *   }, []);
 *   
 *   useSubscribe(localStore, callback);
 *   // ...
 * }
 * ```
 */
declare function useSubscribe<T>(lens: Lens<T>, ...callback: Callback<T>[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, deps: any[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, c2: Callback<T>, deps: any[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, c2: Callback<T>, c3: Callback<T>, deps: any[]): void;
declare function useSubscribe<T>(lens: Lens<T>, c1: Callback<T>, c2: Callback<T>, c3: Callback<T>, c4: Callback<T>, deps: any[]): void;

/**
 * @deprecated use useLensStore instead
 * @template T The type of data stored in the store.
 * @template X The type of lens instance (defaults to Store<T>).
 * @template R The return type (defaults to X).
 * @param key Initial data for the store.
 * @param instance Optional custom lens instance class.
 * @returns Created store instance.
 * @example
 * ```ts
 * // Simple store creation (deprecated, use useLensStore)
 * const store = useLocalStore({ name: 'John' });
 * ```
 */
declare function useLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

/**
 * @deprecated use useLensStore instead
 * @template T The type of data stored in the store.
 * @template X The type of lens instance (defaults to Store<T>).
 * @template R The return type (defaults to X).
 * @param key Initial data for the store (stable reference).
 * @param instance Optional custom lens instance class.
 * @returns Created store instance that won't be recreated when key changes.
 * @example
 * ```ts
 * // Static store (won't recreate when initData changes)
 * const initData = { message: 'Hello' };
 * const store = useStaticLocalStore(initData);
 * ```
 */
declare function useStaticLocalStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

/**
 * Creates a local store instance with useMemo for stable reference across renders.
 * @template T The type of data stored in the store.
 * @template X The type of lens instance (defaults to Store<T>).
 * @template R The return type (defaults to X).
 * @param data Initial data for the store.
 * @param deps Optional dependency array. When any dependency changes, the store will be recreated.
 * @returns Created store instance.
 * @example
 * ```ts
 * // Simple local store
 * const Component: React.FC = () => {
 *   const localStore = useLensStore({ message: 'Hello!' });
 *   const [value] = useLens(localStore);
 *   return <div>{value.message}</div>;
 * }
 * 
 * // Store that recreates when dependency changes
 * const Component: React.FC<{ foo: any }> = ({ foo }) => {
 *   const localStore = useLensStore({ message: foo }, [foo]);
 *   // ...
 * }
 * ```
 */
declare function useLensStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(data: T, deps?: unknown[]): R;
declare function useLensStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(data: T, instance?: Instance<R, T>, deps?: unknown[]): R;

/**
 * Creates a derived store that syncs with incoming data changes and updates when data changes.
 * @template T The type of data stored in the store.
 * @template X The type of lens instance (defaults to Store<T>).
 * @template R The return type (defaults to X).
 * @param key Initial data for the store.
 * @param instance Optional custom lens instance class.
 * @returns Created store instance that updates when key changes.
 * @example
 * ```ts
 * // Store that updates when parentValue changes
 * const Component: React.FC<{ parentValue: any }> = ({ parentValue }) => {
 *   const localStore = useDerivedStore(parentValue);
 *   // localStore will automatically update when parentValue changes
 *   const [value] = useLens(localStore);
 *   return <div>{value}</div>;
 * }
 * ```
 */
declare function useDerivedStore<T = unknown, X extends Lens<T> = Store<T>, R = X>(key: T, instance?: Instance<R, T>): R;

/**
 * Creates a chained lens instance derived from the parent lens.
 * @template A The type of the parent lens.
 * @template B The type of the chained lens.
 * @template T The type of data stored in the lens.
 * @param lens Parent lens to chain from.
 * @param factory Lens instance or chain factory to use for creating the chained lens.
 * @returns Chained lens instance.
 * @example
 * ```ts
 * // Creating a chained lens for nested data
 * const store = createStore({ user: { name: 'John', age: 30 } });
 * const userLens = useDelegate(store, 'user');
 * const [userName] = useLens(userLens.go('name'));
 * ```
 */
declare function useDelegate<A extends Lens<T>, B extends Lens<any>, T>(lens: Lens<T>, factory: ChainFactory<A, B> | Instance<B, T>): B;

/**
 * Creates a debounced function instance for delaying state updates.
 * @param defaultTimeout Default timeout value in milliseconds. Can also be an object with read/write properties.
 * @returns Debounce instance for managing delayed operations.
 * @example
 * ```ts
 * // Simple debounce
 * const debounce = useDebounce(500);
 * 
 * // Debounce with separate read/write timeouts
 * const debounce = useDebounce({ read: 200, write: 1000 });
 * ```
 */
declare function useDebounce(defaultTimeout?: number): DebounceType;

/**
 * Union type for lens change triggers.
 * @template T The type of data stored in the lens.
 * @type {(Trigger<T> | 'object' | 'objectDefined' | 'strict' | 'path' | 'subtree' | 'deep')[]}
 * @example
 * ```ts
 * // Using string triggers
 * useLens(lens, 'object', 'path');
 * 
 * // Using custom trigger function
 * const customTrigger: Trigger<number> = (event, node) => node.get() > 10;
 * useLens(lens, customTrigger);
 * ```
 */
declare type MatchFunctionOrDirective<T> = Trigger<T> | 'object' | 'objectDefined' | 'strict' | 'path' | 'subtree' | 'deep';

/**
 * Interface for separate read and write timeout values.
 */
declare interface TimeoutSet {
	/** Timeout for reading (update) operations in milliseconds. */
	read: number;
	/** Timeout for writing (set) operations in milliseconds. */
	write: number;
}

/**
 * Tuple type representing a value and its setter function.
 * @template T The type of the value.
 */
declare type DescriptorType<T> = [T, (value: T | ((prev: T) => T)) => void];

/**
 * Hook that provides lens state and setter with automatic render triggering.
 * @template T The type of data stored in the lens.
 * @param lens The lens instance to read from and write to.
 * @param matches Trigger conditions for when to update the component.
 * @returns Tuple of current value and setter function.
 * @example
 * ```ts
 * // Basic usage - updates on any object change
 * const [count, setCount] = useLens(store);
 * 
 * // With custom triggers
 * const [value] = useLens(store, 'object', (event, node) => node.get() > 5);
 * 
 * // Using with store
 * const Component: React.FC = () => {
 *   const store = useLensStore({ name: 'John' });
 *   const [data] = useLens(store);
 *   return <div>{data.name}</div>;
 * }
 * ```
 */
declare function useLens<T>(lens: Lens<T> | undefined, ...matches: MatchFunctionOrDirective<T>[]): DescriptorType<T>;

/**
 * Executes memo function with lens when value changes (no return value used).
 * @template R The return type of the memo function.
 * @template T The type of data stored in the lens.
 * @param memo Memo function to execute with lens.
 * @param lens Lens instance to pass to memo function.
 * @param matches Trigger conditions for when to execute the memo.
 * @returns Result of the memo function (but typically used for side effects).
 * @example
 * ```ts
 * // Using for side effects when data changes
 * useLensMemo((lens) => {
 *   console.log('Data changed:', lens.get());
 *   // Perform side effects like logging or event dispatching
 * }, store);
 * 
 * // With data transformation
 * const result = useLensMemo((lens) => {
 *   return expensiveCalculation(lens.get());
 * }, store);
 * ```
 */
declare function useLensMemo<R, T>(memo: (lens: Lens<T>) => R, lens: Lens<T>, ...matches: MatchFunctionOrDirective<T>[]): R;

/**
 * Hook with debounced state updates and throttled render triggering.
 * @template T The type of data stored in the lens.
 * @param lens The lens instance to read from and write to.
 * @param timeout Timeout value in milliseconds or object with separate read/write timeouts.
 * @param matches Trigger conditions for when to update the component.
 * @returns Tuple of current value and setter function.
 * @example
 * ```ts
 * // Debounced input for search
 * const DebounceInput: React.FC<{ lens: Lens<string> }> = ({ lens }) => {
 *   const [value, setValue] = useLensDebounce(lens, 1000);
 *   return <input value={value} onChange={e => setValue(e.target.value)} />;
 * }
 * 
 * // Separate read/write timeouts
 * const [value, setValue] = useLensDebounce(store, { read: 200, write: 500 });
 * ```
 */
declare function useLensDebounce<T>(lens: Lens<T> | undefined, timeout: number | TimeoutSet, ...matches: MatchFunctionOrDirective<T>[]): DescriptorType<T>;

/**
 * Type for lens context.
 * @template T The type of data stored in the lens.
 */
declare type LensContextType<T> = Context<Lens<T>>;

/**
 * Creates a context for lens instances.
 * @template T The type of data stored in the lens.
 * @param value Optional initial context value (lens instance).
 * @returns React context object for lens instances.
 * @example
 * ```ts
 * // Create context for authorization
 * const AuthorizeContext = createLensContext();
 * const authorizeStore = createStore({ username: 'Tom' });
 * 
 * // Use in component
 * const useAuthorize = () => useLensContext(AuthorizeContext);
 * ```
 */
declare function createLensContext<T>(value?: Lens<T>): LensContextType<T>;

/**
 * Hook that consumes lens from context with automatic subscription.
 * @template T The type of data stored in the lens.
 * @param context Context object created with createLensContext.
 * @param triggers Trigger conditions for when to update the component.
 * @returns Tuple of current value and setter function from the lens.
 * @example
 * ```ts
 * // Creating context-based hook
 * const AuthorizeContext = createLensContext();
 * 
 * const useAuthorize = () => {
 *   return useLensContext(AuthorizeContext, 'object');
 * }
 * 
 * // Using in component
 * const Form: React.FC = () => {
 *   const [auth] = useAuthorize();
 *   return <div>{auth.username}</div>;
 * }
 * 
 * // Testing with mock
 * const Test: React.FC = () => {
 *   const testStore = createStore({ username: 'TestUser' });
 *   return (
 *     <AuthorizeContext.Provider value={testStore}>
 *       <Form />
 *     </AuthorizeContext.Provider>
 *   );
 * }
 * ```
 */
declare function useLensContext<T>(context: LensContextType<T>, ...triggers: Trigger<T>[]): DescriptorType<T>;

/**
 * React component that subscribes to lens changes and re-renders on updates.
 * @template L The type of data stored in the lens.
 * @template P The props type for the component.
 * @template S The state type for the component (defaults to empty object).
 * @example
 * ```ts
 * // Creating a stateful component
 * export class Counter extends LensComponent {
 *   public render() {
 *     const {lens} = this.props;
 *     const {value} = this.state;
 *     return <button onClick={ () => lens.set(value + 1) }>{ value }</button>
 *   }
 * }
 * 
 * // Using the component
 * <Counter lens={counterLens} />
 * ```
 */
declare class LensComponent<L, P, S = {}> extends React.Component<P & { lens: Lens<L> }, S & { value: L }> {
    /**
     * Callback for lens change events.
     * @param event The attach event object.
     * @param lens The lens instance that changed.
     */
    protected onLensChanged(event: AttachEvent<L>, lens: Lens<L>): void;
}