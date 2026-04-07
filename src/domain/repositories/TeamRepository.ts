import type { Team } from "@domain/entities/Team";

export interface TeamRepository {
  listAll(): Promise<Team[]>;
  create(name: string): Promise<Team>;
}
