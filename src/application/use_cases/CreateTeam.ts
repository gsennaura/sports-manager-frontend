import type { Team } from "@domain/entities/Team";
import type { TeamRepository } from "@domain/repositories/TeamRepository";

export class CreateTeam {
  constructor(private readonly repository: TeamRepository) {}

  execute(name: string): Promise<Team> {
    return this.repository.create(name);
  }
}
