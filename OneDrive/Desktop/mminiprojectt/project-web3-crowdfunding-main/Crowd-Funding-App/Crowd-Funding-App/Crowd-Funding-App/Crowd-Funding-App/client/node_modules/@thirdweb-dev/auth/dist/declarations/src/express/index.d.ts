/// <reference types="qs" />
import { Json } from "../core";
import { ThirdwebAuthConfig } from "./types";
import express, { Request } from "express";
export * from "./types";
export declare function ThirdwebAuth<TData extends Json = Json, TSession extends Json = Json>(cfg: ThirdwebAuthConfig<TData, TSession>): {
    authRouter: import("express-serve-static-core").Router;
    authMiddleware: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    getUser: (req: Request) => Promise<import("./types").ThirdwebAuthUser<TData, TSession> | null>;
};
//# sourceMappingURL=index.d.ts.map