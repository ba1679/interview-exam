import { useState } from 'react';

const useStorage = <T>(key: string, initialValue: any): [T, (v: T) => void, () => void] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const set = (val: T) => {
    try {
      setValue(val);
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch (error) {
      console.log(error);
    }
  };
  const remove = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return [value, set, remove];
};

export default useStorage;
