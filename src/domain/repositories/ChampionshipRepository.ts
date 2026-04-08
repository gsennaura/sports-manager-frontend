import type { Championship } from "@domain/entities/Championship";
import type { ChampionshipDetail } from "@domain/entities/ChampionshipDetail";

export interface ChampionshipRepository {
  listAll(): Promise<Championship[]>;
  getDetail(id: string): Promise<ChampionshipDetail>;
}
