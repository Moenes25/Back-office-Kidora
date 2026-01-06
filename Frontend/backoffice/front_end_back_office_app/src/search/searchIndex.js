// src/search/searchIndex.js
// 👇 adapte si tu changes les routes
import routes from "routes";

// transforme les routes -> items [{label, path, keywords}]
export function buildSearchIndex() {
  // ne pas indexer les entrées "secondaires" si tu ne veux pas
  const keep = (r) => !r.secondary && r.path && r.layout;

  const items = routes.filter(keep).map((r) => {
    const label = r.name || r.path;
    // path final (ex: /admin/default)
    const href = `${r.layout}/${r.path}`.replace(/\/+/, "/");
    // quelques mots-clés utiles pour la recherche
    const keywords = [
      label,
      r.path,
      r.layout.replace("/", ""),
      // ajoutes-en si besoin:
      label.normalize("NFD").replace(/\p{Diacritic}/gu, ""), // sans accents
    ]
      .filter(Boolean)
      .join(" ");

    return { label, href, keywords };
  });

  return items;
}

export const SEARCH_INDEX = buildSearchIndex();
