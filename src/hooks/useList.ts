"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Paginated } from "@/lib/types";

interface ListState<T> {
  data: Paginated<T> | null;
  loading: boolean;
  error: string;
}

export function useList<T>(path: string, deps: unknown[] = []) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<ListState<T>>({
    data: null,
    loading: true,
    error: "",
  });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(deps);

  useEffect(() => {
    setPage(1);
  }, [key, path]);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    api
      .get<Paginated<T>>(`${path}?page=${page}&size=10`)
      .then((data) => alive && setState({ data, loading: false, error: "" }))
      .catch(
        (e: Error) =>
          alive && setState({ data: null, loading: false, error: e.message }),
      );
    return () => {
      alive = false;
    };
  }, [path, page, tick, key]);

  return { ...state, page, setPage, reload: () => setTick((t) => t + 1) };
}

export type ListResult<T> = ReturnType<typeof useList<T>>;
