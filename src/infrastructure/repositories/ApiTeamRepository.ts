import type { Team } from "@domain/entities/Team";
import type { TeamMatch } from "@domain/entities/TeamMatch";
import type { TeamRepository } from "@domain/repositories/TeamRepository";

type RawTeam = {
  id: string;
  name: string;
  city_id: string;
  sport_id: string;
  venue_id: string | null;
  president: string | null;
  founded_at: string | null;
  club_id: string | null;
  category: string | null;
};

type RawClub = { id: string; name: string };

export class ApiTeamRepository implements TeamRepository {
  constructor(private readonly baseUrl: string) {}

  async listAll(): Promise<Team[]> {
    const [teamsResp, citiesResp, venuesResp, clubsResp] = await Promise.all([
      fetch(`${this.baseUrl}/teams`),
      fetch(`${this.baseUrl}/cities`),
      fetch(`${this.baseUrl}/venues`),
      fetch(`${this.baseUrl}/clubs/`),
    ]);
    if (!teamsResp.ok) {
      throw new Error(`Falha ao buscar times: ${teamsResp.status}`);
    }
    const teams = await teamsResp.json() as RawTeam[];
    const cityMap = new Map<string, string>();
    if (citiesResp.ok) {
      const cities = await citiesResp.json() as Array<{ id: string; name: string }>;
      for (const c of cities) cityMap.set(c.id, c.name);
    }
    const venueMap = new Map<string, string>();
    if (venuesResp.ok) {
      const venues = await venuesResp.json() as Array<{ id: string; name: string }>;
      for (const v of venues) venueMap.set(v.id, v.name);
    }
    const clubMap = new Map<string, string>();
    if (clubsResp.ok) {
      const clubs = await clubsResp.json() as RawClub[];
      for (const c of clubs) clubMap.set(c.id, c.name);
    }
    return teams.map((t) => ({
      ...t,
      city_name: cityMap.get(t.city_id) ?? "–",
      venue_name: t.venue_id ? (venueMap.get(t.venue_id) ?? null) : null,
      club_name: t.club_id ? (clubMap.get(t.club_id) ?? null) : null,
    }));
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

  async getMatches(teamId: string): Promise<TeamMatch[]> {
    const response = await fetch(`${this.baseUrl}/teams/${teamId}/matches`);
    if (!response.ok) throw new Error(`Falha ao buscar partidas do time: ${response.status}`);
    return response.json() as Promise<TeamMatch[]>;
  }

  async getDetail(id: string): Promise<Team> {
    const [teamResp, citiesResp, venuesResp, clubsResp] = await Promise.all([
      fetch(`${this.baseUrl}/teams/${id}`),
      fetch(`${this.baseUrl}/cities`),
      fetch(`${this.baseUrl}/venues`),
      fetch(`${this.baseUrl}/clubs/`),
    ]);
    if (!teamResp.ok) throw new Error(`Time não encontrado: ${teamResp.status}`);
    const team = await teamResp.json() as RawTeam;
    const cityMap = new Map<string, string>();
    if (citiesResp.ok) {
      const cities = await citiesResp.json() as Array<{ id: string; name: string }>;
      for (const c of cities) cityMap.set(c.id, c.name);
    }
    const venueMap = new Map<string, string>();
    if (venuesResp.ok) {
      const venues = await venuesResp.json() as Array<{ id: string; name: string }>;
      for (const v of venues) venueMap.set(v.id, v.name);
    }
    const clubMap = new Map<string, string>();
    if (clubsResp.ok) {
      const clubs = await clubsResp.json() as RawClub[];
      for (const c of clubs) clubMap.set(c.id, c.name);
    }
    return {
      ...team,
      city_name: cityMap.get(team.city_id) ?? "–",
      venue_name: team.venue_id ? (venueMap.get(team.venue_id) ?? null) : null,
      club_name: team.club_id ? (clubMap.get(team.club_id) ?? null) : null,
    };
  }
}
