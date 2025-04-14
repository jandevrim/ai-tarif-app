// utils/storage.ts

export const getLikedRecipes = (): any[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("likedRecipes");
  return saved ? JSON.parse(saved) : [];
};

export const saveLikedRecipe = (recipe: any) => {
  if (typeof window === "undefined") return;
  const existing = getLikedRecipes();
  const updated = [...existing, recipe];
  localStorage.setItem("likedRecipes", JSON.stringify(updated));
};