import axios, {  AxiosRequestConfig, AxiosResponse } from "axios";


import { AUTH_TOKEN_KEY, REACT_APP_REST_RESOURCE_BASE_END_POINT } from "./constants";

const TIMEOUT = 60 * 1000;
axios.defaults.timeout=TIMEOUT;
axios.defaults.baseURL=REACT_APP_REST_RESOURCE_BASE_END_POINT;

const setupAxiosInterceptors=(onUnauthenticated: () => void)=> {
  const onRequestSuccess = (config:AxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.accept = "application/json";
    return config;
  }
  const onResponseSuccess = (response:AxiosResponse) => response;
  const onResponseError = (err: { status: any; response: { status: any; }; })   => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 403 || status === 401) {
      onUnauthenticated();
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
}

export default setupAxiosInterceptors;