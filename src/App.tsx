import { BrowserRouter, Routes, Route } from "react-router-dom";
import { listChampionships, listTeams, createTeam } from "./infrastructure/composition";
import { HomePage } from "@presentation/pages/HomePage";
import { ChampionshipsPage } from "@presentation/pages/ChampionshipsPage";
import { TeamsPage } from "@presentation/pages/TeamsPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/campeonatos" element={<ChampionshipsPage listChampionships={listChampionships} />} />
        <Route path="/times" element={<TeamsPage listTeams={listTeams} createTeam={createTeam} />} />
      </Routes>
    </BrowserRouter>
  );
}
