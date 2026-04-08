import { BrowserRouter, Routes, Route } from "react-router-dom";
import { listChampionships, getChampionshipDetail, listTeams, createTeam, getTeamMatches } from "./infrastructure/composition";
import { HomePage } from "@presentation/pages/HomePage";
import { ChampionshipsPage } from "@presentation/pages/ChampionshipsPage";
import { ChampionshipDetailPage } from "@presentation/pages/ChampionshipDetailPage";
import { TeamsPage } from "@presentation/pages/TeamsPage";
import { TeamDetailPage } from "@presentation/pages/TeamDetailPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/campeonatos" element={<ChampionshipsPage listChampionships={listChampionships} />} />
        <Route path="/campeonatos/:id" element={<ChampionshipDetailPage getChampionshipDetail={getChampionshipDetail} />} />
        <Route path="/times" element={<TeamsPage listTeams={listTeams} createTeam={createTeam} />} />
        <Route path="/times/:id" element={<TeamDetailPage getTeamMatches={getTeamMatches} />} />
      </Routes>
    </BrowserRouter>
  );
}
