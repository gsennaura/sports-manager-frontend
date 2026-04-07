import type { Team } from "@domain/entities/Team";
import type { TeamRepository } from "@domain/repositories/TeamRepository";

export class ApiTeamRepository implements TeamRepository {
  constructor(private readonly baseUrl: string) {}

  async listAll(): Promise<Team[]> {
    const response = await fetch(`${this.baseUrl}/teams`);
    if (!response.ok) {
      throw new Error(`Falha ao buscar times: ${response.status}`);
    }
    return response.json() as Promise<Team[]>;
  }

  async create(name: string): Promise<Team> {
    const response = await fetch(`${this.baseUrl}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({})) as { detail?: string };
      throw new Error(data.detail ?? `Falha ao cadastrar time: ${response.status}`);
    }
    return response.json() as Promise<Team>;
  }
}
