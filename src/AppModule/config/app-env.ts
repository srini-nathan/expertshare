export const API_HOST = process.env.REACT_APP_API_HOST || "/api";
export const AUTH_TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || "es_token";
export const AUTH_USER_KEY = process.env.REACT_APP_AUTH_USER_KEY|| "es_user";
export const AUTH_CHOSEN_CONTAINER = process.env.REACT_APP_AUTH_CHOSEN_CONTAINER|| "es_chosen_container";
export const AUTH_SKIP_ONBOARDING = process.env.AUTH_SKIP_ONBOARDING|| "es_skip_onboarding";
/**
 * @description This flag use to detect, what kind of response type is acceptable,
 * so based on that response transformers works
 */
export const ACCEPTABLE_RESPONSE = process.env.REACT_APP_ACCEPTABLE_RESPONSE || "JSON";
export const USER_LOCALE = process.env.REACT_APP_USER_LOCALE || "es_locale";
export const LANGUAGES = process.env.REACT_APP_LANGUAGES || "es_languages";
export const CONTAINER_LOCALE = "es_container_locale";
export const APP_ENV = process.env.NODE_ENV;
export const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || "/socket.io";
