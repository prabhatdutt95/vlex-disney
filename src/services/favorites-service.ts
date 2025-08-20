const FAVORITES_KEY = "disney_favorites";

export class FavoritesService {
  static getFavorites(): string[] {
    const stored = localStorage.getItem(FAVORITES_KEY);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      return [];
    }
  }

  static isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  }

  static addFavorite(id: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  static removeFavorite(id: string): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter((favId) => favId !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  static toggleFavorite(id: string): void {
    if (this.isFavorite(id)) {
      this.removeFavorite(id);
    } else {
      this.addFavorite(id);
    }
  }

  static clear(): void {
    localStorage.removeItem(FAVORITES_KEY);
  }
}
