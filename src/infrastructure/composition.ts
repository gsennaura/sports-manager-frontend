import { ApiChampionshipRepository } from "./repositories/ApiChampionshipRepository";
import { ListChampionships } from "@application/use_cases/ListChampionships";
import { GetChampionshipDetail } from "@application/use_cases/GetChampionshipDetail";

import { ApiTeamRepository } from "./repositories/ApiTeamRepository";
import { ListTeams } from "@application/use_cases/ListTeams";
import { CreateTeam } from "@application/use_cases/CreateTeam";
import { GetTeamMatches } from "@application/use_cases/GetTeamMatches";
import { GetTeamDetail } from "@application/use_cases/GetTeamDetail";

import { ApiLeagueRepository } from "./repositories/ApiLeagueRepository";
import { ListLeagues, GetLeague } from "@application/use_cases/ListLeagues";

import { ApiClubRepository } from "./repositories/ApiClubRepository";
import { GetClub } from "@application/use_cases/GetClub";
import { ListClubs } from "@application/use_cases/ListClubs";

const championshipRepository = new ApiChampionshipRepository("/api");
const teamRepository = new ApiTeamRepository("/api");
const leagueRepository = new ApiLeagueRepository("/api");
const clubRepository = new ApiClubRepository("/api");

export const listChampionships = new ListChampionships(championshipRepository);
export const getChampionshipDetail = new GetChampionshipDetail(championshipRepository);
export const listTeams = new ListTeams(teamRepository);
export const createTeam = new CreateTeam(teamRepository);
export const getTeamMatches = new GetTeamMatches(teamRepository);
export const getTeamDetail = new GetTeamDetail(teamRepository);
export const listLeagues = new ListLeagues(leagueRepository);
export const getLeague = new GetLeague(leagueRepository);
export const getClub = new GetClub(clubRepository);
export const listClubs = new ListClubs(clubRepository);
