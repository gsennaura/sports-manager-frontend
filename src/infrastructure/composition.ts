import { ApiChampionshipRepository } from "./repositories/ApiChampionshipRepository";
import { ListChampionships } from "@application/use_cases/ListChampionships";

const championshipRepository = new ApiChampionshipRepository("/api");

export const listChampionships = new ListChampionships(championshipRepository);
