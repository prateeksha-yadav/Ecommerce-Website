/**
 * @internal
 */
export declare function useAccount(): readonly [{
    readonly data: {
        address: string;
        connector: import("wagmi").Connector<any, any> | undefined;
        ens: {
            avatar: string | null | undefined;
            name: string;
        } | undefined;
    } | undefined;
    readonly error: Error | undefined;
    readonly loading: boolean;
}, () => void];
//# sourceMappingURL=useAccount.d.ts.map