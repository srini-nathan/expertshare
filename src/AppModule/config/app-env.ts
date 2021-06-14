export const API_HOST = process.env.REACT_APP_API_HOST || "/api";
export const AUTH_TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || "es_token";
export const AUTH_USER_KEY = process.env.REACT_APP_AUTH_USER_KEY|| "es_user";
export const AUTH_CHOSEN_CONTAINER = process.env.REACT_APP_AUTH_CHOSEN_CONTAINER|| "es_chosen_container";
/**
 * @description This flag use to detect, what kind of response type is acceptable,
 * so based on that response transformers works
 */
export const ACCEPTABLE_RESPONSE = process.env.REACT_APP_ACCEPTABLE_RESPONSE || "JSON";
export const USER_LOCALE = process.env.REACT_APP_USER_LOCALE || "es_locale";
export const CONTAINER_LOCALE = "es_container_locale";
