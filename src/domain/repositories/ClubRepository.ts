import type { Club } from "@domain/entities/Club";

export interface ClubRepository {
  listAll(): Promise<Club[]>;
  getById(id: string): Promise<Club>;
}
