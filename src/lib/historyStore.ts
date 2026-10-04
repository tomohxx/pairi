import type { HistoryEntry, WinProbResponse } from "./types";

type Listener = () => void;
const listeners = new Set<Listener>();

export const getSnapshot = () => window.sessionStorage.getItem("historyStore");

const setHistory = (history: HistoryEntry[]) => {
  window.sessionStorage.setItem("historyStore", JSON.stringify(history));
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const addHistoryEntry = (
  entry: Omit<Extract<HistoryEntry, { status: "pending" }>, "id" | "createdAt" | "status">,
) => {
  const id = crypto.randomUUID();
  const snapshot = getSnapshot();
  const history: HistoryEntry[] = snapshot ? JSON.parse(snapshot) : [];
  const createdAt = new Date().toISOString();

  setHistory([...history, { ...entry, id, createdAt, status: "pending" }]);
  return id;
};

export const succeedHistoryEntry = (id: string, result: WinProbResponse) => {
  const snapshot = getSnapshot();
  const history: HistoryEntry[] = snapshot ? JSON.parse(snapshot) : [];
  const completedAt = new Date().toISOString();

  setHistory(history.map((entry) => (entry.id === id ? { ...entry, status: "success", completedAt, result } : entry)));
};

export const failHistoryEntry = (id: string) => {
  const snapshot = getSnapshot();
  const history: HistoryEntry[] = snapshot ? JSON.parse(snapshot) : [];
  const completedAt = new Date().toISOString();

  setHistory(history.map((entry) => (entry.id === id ? { ...entry, status: "error", completedAt } : entry)));
};

export const initializeHistory = () => {
  const snapshot = getSnapshot();
  const history: HistoryEntry[] = snapshot ? JSON.parse(snapshot) : [];

  setHistory(history.filter((entry) => entry.status !== "pending"));
};
