import type { Team } from "@domain/entities/Team";
import type { TeamMatch } from "@domain/entities/TeamMatch";

export interface TeamRepository {
  listAll(): Promise<Team[]>;
  create(name: string): Promise<Team>;
  getMatches(teamId: string): Promise<TeamMatch[]>;
  getDetail(id: string): Promise<Team>;
}
