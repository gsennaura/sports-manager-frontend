import type { Championship } from "@domain/entities/Championship";

export interface ChampionshipRepository {
  listAll(): Promise<Championship[]>;
}
