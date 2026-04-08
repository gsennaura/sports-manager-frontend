import type { Championship } from "@domain/entities/Championship";
import type { ChampionshipDetail, GroupDetail, MatchEntry, PhaseDetail, StandingEntry } from "@domain/entities/ChampionshipDetail";
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

  async getDetail(id: string): Promise<ChampionshipDetail> {
    const [champResp, phasesResp, standingsResp] = await Promise.all([
      fetch(`${this.baseUrl}/championships/${id}`),
      fetch(`${this.baseUrl}/championships/${id}/phases`),
      fetch(`${this.baseUrl}/championships/${id}/standings`),
    ]);

    if (!champResp.ok) throw new Error(`Campeonato não encontrado: ${champResp.status}`);
    if (!phasesResp.ok) throw new Error(`Falha ao buscar fases: ${phasesResp.status}`);

    const champ = await champResp.json() as { id: string; name: string };
    const phases = await phasesResp.json() as Array<{ id: string; name: string; phase_type: string }>;

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
            const [teamsResp, matchesResp] = await Promise.all([
              fetch(`${this.baseUrl}/groups/${group.id}/teams`),
              fetch(`${this.baseUrl}/groups/${group.id}/matches`),
            ]);
            const teams = teamsResp.ok
              ? (await teamsResp.json() as Array<{ team_id: string; team_name: string }>).map((t) => ({ id: t.team_id, name: t.team_name }))
              : [];
            const matches: MatchEntry[] = matchesResp.ok
              ? (await matchesResp.json() as MatchEntry[])
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
