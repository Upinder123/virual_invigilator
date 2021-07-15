import { useEffect, useState, useRef } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

const { CancelToken } = axios;
const source = CancelToken.source();

const cancel = () => source.cancel('Operation canceled by the user.');

const useFetch = (url: string) => {
  const isCurrent = useRef(true);
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    return () => {
      // called when the component is going to unmount
      isCurrent.current = false;
    };
  }, []);

  useEffect(() => {
    setState(state => ({ data: state.data, loading: true, error: false }));

    axios
      .get(url)
      .then(res => {
        console.log('res in useFetch', res);
        console.log('isCurrent.current', isCurrent.current);

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
  }, [url]);

  return {
    ...state,
    cancel,
  };
};

export default useFetch;
