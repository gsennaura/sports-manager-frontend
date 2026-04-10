import type { League } from "@domain/entities/League";

export interface LeagueRepository {
  listAll(): Promise<League[]>;
  getById(id: string): Promise<League>;
}
