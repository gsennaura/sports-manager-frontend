import { ApiChampionshipRepository } from "./repositories/ApiChampionshipRepository";
import { ListChampionships } from "@application/use_cases/ListChampionships";
import { GetChampionshipDetail } from "@application/use_cases/GetChampionshipDetail";

import { ApiTeamRepository } from "./repositories/ApiTeamRepository";
import { ListTeams } from "@application/use_cases/ListTeams";
import { CreateTeam } from "@application/use_cases/CreateTeam";
import { GetTeamMatches } from "@application/use_cases/GetTeamMatches";

const championshipRepository = new ApiChampionshipRepository("/api");
const teamRepository = new ApiTeamRepository("/api");

export const listChampionships = new ListChampionships(championshipRepository);
export const getChampionshipDetail = new GetChampionshipDetail(championshipRepository);
export const listTeams = new ListTeams(teamRepository);
export const createTeam = new CreateTeam(teamRepository);
export const getTeamMatches = new GetTeamMatches(teamRepository);
