import { ApiChampionshipRepository } from "./repositories/ApiChampionshipRepository";
import { ListChampionships } from "@application/use_cases/ListChampionships";

import { ApiTeamRepository } from "./repositories/ApiTeamRepository";
import { ListTeams } from "@application/use_cases/ListTeams";
import { CreateTeam } from "@application/use_cases/CreateTeam";

const championshipRepository = new ApiChampionshipRepository("/api");
const teamRepository = new ApiTeamRepository("/api");

export const listChampionships = new ListChampionships(championshipRepository);
export const listTeams = new ListTeams(teamRepository);
export const createTeam = new CreateTeam(teamRepository);
