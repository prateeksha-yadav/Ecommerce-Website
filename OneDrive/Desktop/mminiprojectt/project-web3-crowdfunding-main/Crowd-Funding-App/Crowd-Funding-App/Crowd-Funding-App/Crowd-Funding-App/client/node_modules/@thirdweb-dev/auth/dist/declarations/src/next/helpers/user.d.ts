import { Json } from "../../core/schema";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";
export declare function getUser<TData extends Json = Json, TSession extends Json = Json>(req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest, ctx: ThirdwebAuthContext<TData, TSession>): Promise<ThirdwebAuthUser<TData, TSession> | null>;
//# sourceMappingURL=user.d.ts.map