import { LoginPayload, VerifyOptions } from "../core/schema";
export declare function verifyLogin(domain: string, payload: LoginPayload, options?: Omit<VerifyOptions, "domain">): Promise<{
    address: string;
    error: undefined;
} | {
    address: undefined;
    error: any;
}>;
//# sourceMappingURL=auth.d.ts.map