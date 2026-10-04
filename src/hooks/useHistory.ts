import { useSyncExternalStore } from "react";
import { addHistoryEntry, succeedHistoryEntry, failHistoryEntry, getSnapshot, subscribe } from "../lib/historyStore";
import type { HistoryEntry } from "../lib/types";

export function useHistory() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const history: HistoryEntry[] = snapshot ? JSON.parse(snapshot) : [];

  return [history, addHistoryEntry, succeedHistoryEntry, failHistoryEntry] as const;
}
