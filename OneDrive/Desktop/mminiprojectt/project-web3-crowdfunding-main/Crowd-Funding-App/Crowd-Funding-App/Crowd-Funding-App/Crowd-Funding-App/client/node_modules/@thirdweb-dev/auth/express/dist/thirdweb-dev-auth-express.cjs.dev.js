'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var auth = require('../../dist/auth-52247f73.cjs.dev.js');
var zod = require('zod');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var express = require('express');
require('ethers');
require('uuid');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var cookieParser__default = /*#__PURE__*/_interopDefault(cookieParser);
var express__default = /*#__PURE__*/_interopDefault(express);

function getToken(req) {
  if (req.headers["authorization"]) {
    const authorizationHeader = req.headers["authorization"].split(" ");
    if (authorizationHeader?.length === 2) {
      return authorizationHeader[1];
    }
    return undefined;
  }
  const cookie = !req.cookies ? undefined : typeof req.cookies.get === "function" ? req.cookies.get("thirdweb_auth_token") : req.cookies.thirdweb_auth_token;
  return cookie;
}
async function getUser(req, ctx) {
  const token = getToken(req);
  if (!token) {
    return null;
  }
  let authenticatedUser;
  try {
    authenticatedUser = await ctx.auth.authenticate(token, {
      validateTokenId: async tokenId => {
        if (ctx.authOptions?.validateTokenId) {
          await ctx.authOptions?.validateTokenId(tokenId);
        }
      }
    });
  } catch (err) {
    return null;
  }
  if (!ctx.callbacks?.onUser) {
    return authenticatedUser;
  }
  const data = await ctx.callbacks.onUser(authenticatedUser);
  if (!data) {
    return authenticatedUser;
  }
  return {
    ...authenticatedUser,
    data: data
  };
}

const LoginPayloadBodySchema = zod.z.object({
  payload: auth.LoginPayloadOutputSchema
});

async function handler$2(req, res, ctx) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }
  const parsedPayload = LoginPayloadBodySchema.safeParse(req.body);

  // Get signed login payload from the frontend
  if (!parsedPayload.success) {
    return res.status(400).json({
      error: "Invalid login payload"
    });
  }
  const payload = parsedPayload.data.payload;
  const validateNonce = async nonce => {
    if (ctx.authOptions?.validateNonce) {
      await ctx.authOptions?.validateNonce(nonce);
    }
  };
  const getSession = async address => {
    if (ctx.callbacks?.onLogin) {
      return ctx.callbacks.onLogin(address, req);
    }
  };
  const expirationTime = ctx.authOptions?.tokenDurationInSeconds ? new Date(Date.now() + 1000 * ctx.authOptions.tokenDurationInSeconds) : undefined;
  const generateOptions = {
    verifyOptions: {
      statement: ctx.authOptions?.statement,
      uri: ctx.authOptions?.uri,
      version: ctx.authOptions?.version,
      chainId: ctx.authOptions?.chainId,
      validateNonce,
      resources: ctx.authOptions?.resources
    },
    expirationTime,
    session: getSession
  };
  let token;
  try {
    // Generate an access token with the SDK using the signed payload
    token = await ctx.auth.generate(payload, generateOptions);
  } catch (err) {
    if (err.message) {
      return res.status(400).json({
        error: err.message
      });
    } else if (typeof err === "string") {
      return res.status(400).json({
        error: err
      });
    } else {
      return res.status(400).json({
        error: "Invalid login payload"
      });
    }
  }

  // Securely set httpOnly cookie on request to prevent XSS on frontend
  // And set path to / to enable thirdweb_auth_token usage on all endpoints
  res.setHeader("Set-Cookie", cookie.serialize("thirdweb_auth_token", token, {
    domain: ctx.cookieOptions?.domain,
    path: ctx.cookieOptions?.path || "/",
    sameSite: ctx.cookieOptions?.sameSite || "none",
    httpOnly: true,
    secure: true
  }));

  // Send token in body and as cookie for frontend and backend use cases
  return res.status(200).json({
    token
  });
}

async function handler$1(req, res, ctx) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Invalid method. Only POST supported."
    });
  }
  if (ctx.callbacks?.onLogout) {
    const user = await getUser(req, ctx);
    if (user) {
      await ctx.callbacks.onLogout(user, req);
    }
  }

  // Set the access token to 'none' and expire in 5 seconds
  res.setHeader("Set-Cookie", cookie.serialize("thirdweb_auth_token", "", {
    domain: ctx.cookieOptions?.domain,
    path: ctx.cookieOptions?.path || "/",
    expires: new Date(Date.now() + 5 * 1000)
  }));
  return res.status(200).json({
    message: "Successfully logged out"
  });
}

async function handler(req, res, ctx) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported."
    });
  }
  const user = await getUser(req, ctx);
  return res.status(200).json(user);
}

const asyncHandler = fn => function () {
  var _ref;
  const fnReturn = fn(...arguments);
  const next = (_ref = arguments.length - 1, _ref < 0 || arguments.length <= _ref ? undefined : arguments[_ref]);
  return Promise.resolve(fnReturn).catch(next);
};
function ThirdwebAuth(cfg) {
  const ctx = {
    ...cfg,
    auth: new auth.ThirdwebAuth(cfg.wallet, cfg.domain)
  };
  const router = express__default["default"].Router();
  const cookieMiddleware = cookieParser__default["default"]();
  router.use(express__default["default"].json());
  router.use(cookieMiddleware);
  router.post("/login", asyncHandler((req, res) => handler$2(req, res, ctx)));
  router.get("/user", asyncHandler((req, res) => handler(req, res, ctx)));
  router.post("/logout", asyncHandler((req, res) => handler$1(req, res, ctx)));
  return {
    authRouter: router,
    authMiddleware: cookieMiddleware,
    getUser: req => {
      return getUser(req, ctx);
    }
  };
}

exports.LoginPayloadBodySchema = LoginPayloadBodySchema;
exports.ThirdwebAuth = ThirdwebAuth;
