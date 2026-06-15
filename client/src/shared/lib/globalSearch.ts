export type SearchRoute = {
  path: string;
  params?: Record<string, string | undefined>;
};

export type SearchTargetKind = "category" | "item";

export type SearchTarget = {
  id: string;
  label: string;
  kind: SearchTargetKind;
  category: "project" | "research" | "experience" | "certificate" | "achievement" | "api-key";
  keywords: string[];
  route: SearchRoute;
  focusId?: string;
};

export function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesSearchText(haystack: string, query: string) {
  const normalizedHaystack = normalizeSearchText(haystack);
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  return normalizedHaystack.includes(normalizedQuery);
}

export function scoreSearchTarget(query: string, target: SearchTarget) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const label = normalizeSearchText(target.label);
  const keywordHaystack = normalizeSearchText(
    [target.label, target.category, ...target.keywords].join(" ")
  );

  let score = 0;

  if (label === normalizedQuery) {
    score += 120;
  }

  if (keywordHaystack === normalizedQuery) {
    score += 110;
  }

  if (keywordHaystack.includes(normalizedQuery)) {
    score += 80;
  }

  if (normalizedQuery.includes(label)) {
    score += 70;
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const haystackTokens = keywordHaystack.split(" ").filter(Boolean);

  queryTokens.forEach((token) => {
    if (haystackTokens.includes(token)) {
      score += 12;
    }
  });

  if (target.kind === "category" && normalizedQuery === target.category) {
    score += 40;
  }

  return score;
}

export function buildSearchHref(target: SearchTarget) {
  const params = new URLSearchParams();

  Object.entries(target.route.params || {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `${target.route.path}?${query}` : target.route.path;
}

export function getSearchTargetCategories(query: string) {
  const normalized = normalizeSearchText(query);

  const categories: Array<{
    match: RegExp;
    value: SearchTarget["category"];
  }> = [
    { match: /\bproject(s)?\b/, value: "project" },
    { match: /\bresearch\b/, value: "research" },
    { match: /\bexperience\b|\bcareer\b|\bwork\b/, value: "experience" },
    { match: /\bachievement(s)?\b|\baward(s)?\b/, value: "achievement" },
    { match: /\bcertificate(s)?\b|\bcertification(s)?\b|\bcredential(s)?\b/, value: "certificate" },
    { match: /\bapi\s*key(s)?\b|\bapikey(s)?\b/, value: "api-key" },
  ];

  return categories.find((item) => item.match.test(normalized))?.value;
}
