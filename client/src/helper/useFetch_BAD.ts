import { useEffect, useState, useRef } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

const { CancelToken } = axios;
const source = CancelToken.source();

const cancel = () => source.cancel('Operation canceled by the user.');

const useFetch = (urlOrConfig: string | AxiosRequestConfig) => {
  const isCurrent = useRef(true);
  const [start, setStart] = useState(false);
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    // called when the component is going to unmount
    isCurrent.current = false;
  }, []);

  useEffect(() => {
    console.log('start has changed, start:', start);

    if (!start) return;
    // eslint-disable-next-line no-return-await
    (async () => await (await fetch('https://www.google.com/')).text())();
  }, [start]);

  useEffect(() => {
    if (!start) return;
    setState(state => ({ data: state.data, loading: true, error: false }));
    const axiosConfig: AxiosRequestConfig =
      typeof urlOrConfig === 'string'
        ? {
            method: 'GET',
            url: urlOrConfig,
          }
        : urlOrConfig;

    axios({
      ...axiosConfig,
      cancelToken: source.token,
    })
      .then(res => {
        setState(prevState =>
          isCurrent.current
            ? { ...prevState, data: res.data, loading: false, error: false }
            : prevState
        );
        if (!isCurrent.current)
          console.warn(
            'Trying to update state on unmounted component, it has been saved by `useFetch` hook, but you should check your code!'
          );
      })
      .catch(err => {
        console.log(err);
        setState({ data: null, loading: false, error: true });
      });
  }, [urlOrConfig, start]);

  return {
    ...state,
    cancel,
    start: () => setStart(true),
  };
};

export default useFetch;
