import { Json } from "../../core/schema";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { Request } from "express";
export declare function getUser<TData extends Json = Json, TSession extends Json = Json>(req: Request, ctx: ThirdwebAuthContext<TData, TSession>): Promise<ThirdwebAuthUser<TData, TSession> | null>;
//# sourceMappingURL=user.d.ts.map