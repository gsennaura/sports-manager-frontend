import { BrowserRouter, Routes, Route } from "react-router-dom";
import { listChampionships, getChampionshipDetail, listTeams, getTeamMatches, getTeamDetail, listLeagues, getLeague, getClub, listClubs } from "./infrastructure/composition";
import { LeaguesPage } from "@presentation/pages/LeaguesPage";
import { LeagueDetailPage } from "@presentation/pages/LeagueDetailPage";
import { ChampionshipsPage } from "@presentation/pages/ChampionshipsPage";
import { ChampionshipDetailPage } from "@presentation/pages/ChampionshipDetailPage";
import { TeamsPage } from "@presentation/pages/TeamsPage";
import { TeamDetailPage } from "@presentation/pages/TeamDetailPage";
import { ClubDetailPage } from "@presentation/pages/ClubDetailPage";
import { ClubsPage } from "@presentation/pages/ClubsPage";

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LeaguesPage listLeagues={listLeagues} />} />
        <Route path="/ligas/:id" element={<LeagueDetailPage getLeague={getLeague} listChampionships={listChampionships} />} />
        <Route path="/campeonatos" element={<ChampionshipsPage listChampionships={listChampionships} />} />
        <Route path="/campeonatos/:id" element={<ChampionshipDetailPage getChampionshipDetail={getChampionshipDetail} />} />
        <Route path="/clubes" element={<ClubsPage listClubs={listClubs} />} />
        <Route path="/clubes/:id" element={<ClubDetailPage getClub={getClub} listTeams={listTeams} />} />
        <Route path="/times" element={<TeamsPage listTeams={listTeams} />} />
        <Route path="/times/:id" element={<TeamDetailPage getTeamMatches={getTeamMatches} getTeamDetail={getTeamDetail} />} />
      </Routes>
    </BrowserRouter>
  );
}
