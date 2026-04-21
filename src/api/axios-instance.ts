import axios, { type AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = axios.create({
  baseURL: "/",
  withCredentials: true,
});

let identityToken: string | null = null;

export function setIdentityToken(token: string | null) {
  identityToken = token;
}

export function getIdentityToken() {
  return identityToken;
}

AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (identityToken) {
    config.headers.Authorization = `Bearer ${identityToken}`;
  }
  return config;
});

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data as T);

  // @ts-expect-error Orval expects a cancellable promise shape.
  promise.cancel = () => {
    source.cancel("Request cancelled");
  };

  return promise;
};
