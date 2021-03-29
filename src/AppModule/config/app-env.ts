export const API_HOST = process.env.REACT_APP_API_HOST || "/api";
export const AUTH_TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || "token";
/**
 * @description This flag use to detect, what kind of response type is acceptable,
 * so based on that response transformers works
 */
export const ACCEPTABLE_RESPONSE = process.env.REACT_APP_ACCEPTABLE_RESPONSE || "JSON";