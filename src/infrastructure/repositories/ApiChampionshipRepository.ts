import type { Championship } from "@domain/entities/Championship";
import type { ChampionshipDetail, GroupDetail, MatchEntry, PhaseDetail, StandingEntry } from "@domain/entities/ChampionshipDetail";
import type { ChampionshipRepository } from "@domain/repositories/ChampionshipRepository";

export class ApiChampionshipRepository implements ChampionshipRepository {
  constructor(private readonly baseUrl: string) {}

  async listAll(): Promise<Championship[]> {
    const [champsResp, citiesResp] = await Promise.all([
      fetch(`${this.baseUrl}/championships`),
      fetch(`${this.baseUrl}/cities`),
    ]);
    if (!champsResp.ok) {
      throw new Error(`Falha ao buscar campeonatos: ${champsResp.status}`);
    }
    const champs = await champsResp.json() as Array<{ id: string; name: string; city_id: string }>;
    const cityMap = new Map<string, string>();
    if (citiesResp.ok) {
      const cities = await citiesResp.json() as Array<{ id: string; name: string }>;
      for (const c of cities) cityMap.set(c.id, c.name);
    }
    return champs.map((c) => ({ ...c, city_name: cityMap.get(c.city_id) ?? "–" }));
  }

  async getDetail(id: string): Promise<ChampionshipDetail> {
    const [champResp, phasesResp, standingsResp, teamsResp, venuesResp] = await Promise.all([
      fetch(`${this.baseUrl}/championships/${id}`),
      fetch(`${this.baseUrl}/championships/${id}/phases`),
      fetch(`${this.baseUrl}/championships/${id}/standings`),
      fetch(`${this.baseUrl}/teams`),
      fetch(`${this.baseUrl}/venues`),
    ]);

    if (!champResp.ok) throw new Error(`Campeonato não encontrado: ${champResp.status}`);
    if (!phasesResp.ok) throw new Error(`Falha ao buscar fases: ${phasesResp.status}`);

    const champ = await champResp.json() as { id: string; name: string };
    const phases = await phasesResp.json() as Array<{ id: string; name: string; phase_type: string }>;

    // team_id → venue_id and venue_id → venue_name maps for resolving match venues
    const teamVenueMap = new Map<string, string | null>();
    if (teamsResp.ok) {
      const tList = await teamsResp.json() as Array<{ id: string; venue_id: string | null }>;
      for (const t of tList) teamVenueMap.set(t.id, t.venue_id);
    }
    const venueNameMap = new Map<string, string>();
    if (venuesResp.ok) {
      const vList = await venuesResp.json() as Array<{ id: string; name: string }>;
      for (const v of vList) venueNameMap.set(v.id, v.name);
    }

    // Monta índice group_id → standings a partir do endpoint de classificação
    type ApiStandingEntry = { team_id: string; team_name: string; matches_played: number; wins: number; draws: number; losses: number; goals_for: number; goals_against: number; goal_difference: number; points: number };
    type ApiStandingsResponse = Array<{ phase: { id: string }; groups: Array<{ group: { id: string }; standings: ApiStandingEntry[] }> }>;
    const standingsByGroupId = new Map<string, StandingEntry[]>();
    if (standingsResp.ok) {
      const standingsData = await standingsResp.json() as ApiStandingsResponse;
      for (const phaseStandings of standingsData) {
        for (const gs of phaseStandings.groups) {
          standingsByGroupId.set(gs.group.id, gs.standings);
        }
      }
    }

    const phasesWithGroups: PhaseDetail[] = await Promise.all(
      phases.map(async (phase) => {
        const groupsResp = await fetch(`${this.baseUrl}/phases/${phase.id}/groups`);
        if (!groupsResp.ok) return { id: phase.id, name: phase.name, phase_type: phase.phase_type, groups: [] };
        const groups = await groupsResp.json() as Array<{ id: string; name: string }>;

        const groupsWithData: GroupDetail[] = await Promise.all(
          groups.map(async (group) => {
            const [teamsRespG, matchesResp] = await Promise.all([
              fetch(`${this.baseUrl}/groups/${group.id}/teams`),
              fetch(`${this.baseUrl}/groups/${group.id}/matches`),
            ]);
            const teams = teamsRespG.ok
              ? (await teamsRespG.json() as Array<{ team_id: string; team_name: string }>).map((t) => ({ id: t.team_id, name: t.team_name }))
              : [];
            type RawMatch = { id: string; round_number: number; home_team_id: string; away_team_id: string; home_score: number | null; away_score: number | null; home_penalty_score: number | null; away_penalty_score: number | null; match_date: string | null };
            const matches: MatchEntry[] = matchesResp.ok
              ? (await matchesResp.json() as RawMatch[]).map((m) => {
                  const venueId = teamVenueMap.get(m.home_team_id) ?? null;
                  const venue_name = venueId ? (venueNameMap.get(venueId) ?? null) : null;
                  return { ...m, venue_name };
                })
              : [];
            return {
              id: group.id,
              name: group.name,
              teams,
              standings: standingsByGroupId.get(group.id) ?? [],
              matches,
            };
          })
        );

        return { id: phase.id, name: phase.name, phase_type: phase.phase_type, groups: groupsWithData };
      })
    );

    return { id: champ.id, name: champ.name, phases: phasesWithGroups };
  }
}
