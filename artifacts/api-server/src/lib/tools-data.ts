// Mirror of the static tool catalog used by the frontend.
// This file is the backend's source-of-truth for the search index.
// It is kept in sync manually with artifacts/duck-master/src/data/tools.ts.

export interface Category {
  id: string;
  label: string;
  links: string[];
}

// Import directly from the shared data source at build time.
// We re-export it so search.ts can import from one place.
export { CATEGORIES } from "../../../../artifacts/duck-master/src/data/tools";
