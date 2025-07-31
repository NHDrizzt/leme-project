import { useState, useEffect } from "react";
import { Entity } from "@/mocks/data";

export type RecentSearch = {
  id: string;
  type: string;
  value: string;
  timestamp: string;
  entity?: Entity;
};

const RECENT_SEARCHES_KEY = "recentSearches";

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveSearches = (searches: RecentSearch[]) => {
    setRecentSearches(searches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  };

  const addSearch = (search: Omit<RecentSearch, "id">) => {
    const newSearch = {
      ...search,
      id: Date.now().toString(),
    };

    const updatedSearches = [newSearch, ...recentSearches].slice(0, 10);
    saveSearches(updatedSearches);
  };

  return {
    recentSearches,
    addSearch,
  };
};
