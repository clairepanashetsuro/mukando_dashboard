import type { Amount } from "./types";

export const money = (value: Amount | null | undefined) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const today = () => new Date().toISOString().slice(0, 10);
