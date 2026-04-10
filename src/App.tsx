import { BrowserRouter, Routes, Route } from "react-router-dom";
import { listChampionships, getChampionshipDetail, listTeams, getTeamMatches, getTeamDetail, listLeagues, getLeague } from "./infrastructure/composition";
import { HomePage } from "@presentation/pages/HomePage";
import { LeaguesPage } from "@presentation/pages/LeaguesPage";
import { LeagueDetailPage } from "@presentation/pages/LeagueDetailPage";
import { ChampionshipsPage } from "@presentation/pages/ChampionshipsPage";
import { ChampionshipDetailPage } from "@presentation/pages/ChampionshipDetailPage";
import { TeamsPage } from "@presentation/pages/TeamsPage";
import { TeamDetailPage } from "@presentation/pages/TeamDetailPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ligas" element={<LeaguesPage listLeagues={listLeagues} />} />
        <Route path="/ligas/:id" element={<LeagueDetailPage getLeague={getLeague} listChampionships={listChampionships} />} />
        <Route path="/campeonatos" element={<ChampionshipsPage listChampionships={listChampionships} />} />
        <Route path="/campeonatos/:id" element={<ChampionshipDetailPage getChampionshipDetail={getChampionshipDetail} />} />
        <Route path="/times" element={<TeamsPage listTeams={listTeams} />} />
        <Route path="/times/:id" element={<TeamDetailPage getTeamMatches={getTeamMatches} getTeamDetail={getTeamDetail} />} />
      </Routes>
    </BrowserRouter>
  );
}
