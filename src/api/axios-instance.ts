import axios, { type AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = axios.create({
  baseURL: "/",
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
