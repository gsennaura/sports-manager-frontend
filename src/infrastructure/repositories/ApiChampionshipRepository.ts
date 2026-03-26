import type { Championship } from "@domain/entities/Championship";
import type { ChampionshipRepository } from "@domain/repositories/ChampionshipRepository";

export class ApiChampionshipRepository implements ChampionshipRepository {
  constructor(private readonly baseUrl: string) {}

  async listAll(): Promise<Championship[]> {
    const response = await fetch(`${this.baseUrl}/championships`);
    if (!response.ok) {
      throw new Error(`Falha ao buscar campeonatos: ${response.status}`);
    }
    return response.json() as Promise<Championship[]>;
  }
}
