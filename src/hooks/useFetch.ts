"use client";

import { useEffect, useState } from "react";

export function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string;
  }>({ data: null, loading: true, error: "" });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    fn()
      .then((data) => alive && setState({ data, loading: false, error: "" }))
      .catch(
        (e: Error) =>
          alive && setState({ data: null, loading: false, error: e.message }),
      );
    return () => {
      alive = false;
    };
  }, [tick, ...deps]);
  return { ...state, reload: () => setTick((t) => t + 1) };
}
