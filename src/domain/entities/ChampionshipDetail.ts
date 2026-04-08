export interface TeamEntry {
  id: string;
  name: string;
}

export interface MatchEntry {
  id: string;
  round_number: number;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
  home_penalty_score: number | null;
  away_penalty_score: number | null;
  match_date: string | null;
}

export interface StandingEntry {
  team_id: string;
  team_name: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface GroupDetail {
  id: string;
  name: string;
  teams: TeamEntry[];
  standings: StandingEntry[];
  matches: MatchEntry[];
}

export interface PhaseDetail {
  id: string;
  name: string;
  phase_type: string;
  groups: GroupDetail[];
}

export interface ChampionshipDetail {
  id: string;
  name: string;
  phases: PhaseDetail[];
}
