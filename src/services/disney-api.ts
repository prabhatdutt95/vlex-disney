import type { DisneyCharacter } from "../interfaces/DisneyCharacter";

const API_BASE = "https://api.disneyapi.dev";

export async function fetchCharacters(): Promise<DisneyCharacter[]> {
  try {
    const response = await fetch(`${API_BASE}/character`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.data as DisneyCharacter[];
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
}
