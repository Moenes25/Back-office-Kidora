// src/search/useGlobalSearch.js
import { useMemo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_INDEX } from "./searchIndex";

// normalise une chaîne (accents/espaces/casse)
const norm = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

// score naïf: priorité au "startsWith", sinon "includes"
function score(query, item) {
  const q = norm(query);
  if (!q) return 0;
  const hay = norm(item.keywords);
  if (hay.startsWith(q)) return 100 - q.length; // plus la requête est longue, meilleur
  if (hay.includes(q)) return 50 - q.length / 2;
  return 0;
}

export function useGlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Cmd/Ctrl + K => ouvre l’overlay
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const search = useCallback((query, limit = 7) => {
    const q = norm(query);
    if (!q) return [];
    return SEARCH_INDEX
      .map((it) => ({ ...it, _score: score(q, it) }))
      .filter((it) => it._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, limit);
  }, []);

  const go = useCallback(
    (href) => {
      if (!href) return;
      navigate(href);
      setOpen(false);
    },
    [navigate]
  );

  return { search, go, open, setOpen, index: SEARCH_INDEX };
}
