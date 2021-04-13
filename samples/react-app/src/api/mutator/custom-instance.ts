import axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = axios.create({ baseURL: '' });

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE(config).then(({ data }) => data);
};

export default customInstance;
