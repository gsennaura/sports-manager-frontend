import type { League } from "@domain/entities/League";
import type { LeagueRepository } from "@domain/repositories/LeagueRepository";

type RawLeague = {
  id: string;
  name: string;
  short_name: string;
  city_id: string;
  is_federated: boolean;
  address: string | null;
  president: string | null;
  website: string | null;
  founded_year: number | null;
  parent_league_id: string | null;
};

export class ApiLeagueRepository implements LeagueRepository {
  constructor(private readonly baseUrl: string) {}

  async listAll(): Promise<League[]> {
    const [leaguesResp, citiesResp] = await Promise.all([
      fetch(`${this.baseUrl}/leagues/`),
      fetch(`${this.baseUrl}/cities`),
    ]);
    if (!leaguesResp.ok) throw new Error(`Falha ao buscar ligas: ${leaguesResp.status}`);

    const leagues = (await leaguesResp.json()) as RawLeague[];
    const cityMap = new Map<string, string>();
    if (citiesResp.ok) {
      const cities = (await citiesResp.json()) as Array<{ id: string; name: string }>;
      for (const c of cities) cityMap.set(c.id, c.name);
    }
    return leagues.map((lg) => ({ ...lg, city_name: cityMap.get(lg.city_id) ?? "–" }));
  }

  async getById(id: string): Promise<League> {
    const [leagueResp, citiesResp] = await Promise.all([
      fetch(`${this.baseUrl}/leagues/${id}`),
      fetch(`${this.baseUrl}/cities`),
    ]);
    if (!leagueResp.ok) throw new Error(`Liga não encontrada: ${leagueResp.status}`);

    const league = (await leagueResp.json()) as RawLeague;
    const cityMap = new Map<string, string>();
    if (citiesResp.ok) {
      const cities = (await citiesResp.json()) as Array<{ id: string; name: string }>;
      for (const c of cities) cityMap.set(c.id, c.name);
    }
    return { ...league, city_name: cityMap.get(league.city_id) ?? "–" };
  }
}
