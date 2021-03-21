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
    //config.headers.origin="http://localhost:3000"
    // ACCEPT==SPECIFIC==> Header then we will be able to send (otherwise cors issue will be kicked in)
    return config;
  }
  // We receive  hydra==> logic==> convert it to ==> json ==>
  // json / hydra ?

  // it it is a hydra response.
  // { jsonResponse: [] }
  //



  // client[]    { results: [{},{},{}], totalCount:23   }
  const onResponseSuccess = (response:AxiosResponse) => response;
  const onResponseError = (err: { status: any; response: { status: any; }; })   => {
    console.log(err);
    console.log(err.response);
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