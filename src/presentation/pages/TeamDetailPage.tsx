import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import type { GetTeamMatches } from "@application/use_cases/GetTeamMatches";
import type { TeamMatch } from "@domain/entities/TeamMatch";

interface TeamDetailPageProps {
  getTeamMatches: GetTeamMatches;
}

interface SeasonStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export function TeamDetailPage({ getTeamMatches }: TeamDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [matches, setMatches] = useState<TeamMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getTeamMatches.execute(id).then((data) => {
      setMatches(data);
      if (data.length > 0) {
        const first = data[0];
        setTeamName(
          first.home_team_id === id ? first.home_team_name : first.away_team_name
        );
      }
      setLoading(false);
    }).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
      setLoading(false);
    });
  }, [id, getTeamMatches]);

  // Group by season (year from match_date), unknown dates go to "Sem data"
  const bySeason = new Map<string, TeamMatch[]>();
  for (const m of matches) {
    const season = m.match_date ? m.match_date.slice(0, 4) : "Sem data";
    if (!bySeason.has(season)) bySeason.set(season, []);
    bySeason.get(season)!.push(m);
  }
  const seasons = [...bySeason.keys()].sort((a, b) => b.localeCompare(a));

  return (
    <main style={styles.page}>
      <Link to="/times" style={styles.back}>← Times</Link>

      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <h1 style={styles.title}>{teamName || "Time"}</h1>

          {matches.length === 0 && (
            <p style={styles.empty}>Nenhuma partida encontrada.</p>
          )}

          {seasons.map((season) => {
            const seasonMatches = bySeason.get(season)!;
            const stats = computeStats(seasonMatches, id!);
            return (
              <section key={season} style={styles.season}>
                <h2 style={styles.seasonTitle}>Temporada {season}</h2>

                {/* Group matches by championship within a season */}
                {groupByChampionship(seasonMatches).map(([champName, champMatches]) => (
                  <div key={champName} style={styles.champBlock}>
                    <div style={styles.champHeader}>{champName}</div>
                    {champMatches.map((m) => (
                      <MatchRow key={m.match_id} match={m} teamId={id!} />
                    ))}
                  </div>
                ))}

                <SeasonSummary stats={stats} />
              </section>
            );
          })}
        </>
      )}
    </main>
  );
}

function MatchRow({ match: m, teamId }: { match: TeamMatch; teamId: string }) {
  const hasScore = m.home_score !== null && m.away_score !== null;
  const hasPenalty = hasScore && m.home_penalty_score !== null && m.away_penalty_score !== null;

  let outcome: "win" | "draw" | "loss" | null = null;
  if (hasScore) {
    const isHome = m.home_team_id === teamId;
    const myGoals = isHome ? m.home_score! : m.away_score!;
    const oppGoals = isHome ? m.away_score! : m.home_score!;
    if (hasPenalty) {
      const myPen = isHome ? m.home_penalty_score! : m.away_penalty_score!;
      const oppPen = isHome ? m.away_penalty_score! : m.home_penalty_score!;
      outcome = myPen > oppPen ? "win" : "loss";
    } else {
      outcome = myGoals > oppGoals ? "win" : myGoals === oppGoals ? "draw" : "loss";
    }
  }

  const dateStr = m.match_date
    ? `${m.match_date.slice(8, 10)}/${m.match_date.slice(5, 7)}`
    : "–";

  const outcomeColor = outcome === "win" ? "#a6e3a1" : outcome === "loss" ? "#f38ba8" : "#f9e2af";
  const outcomeLetter = outcome === "win" ? "V" : outcome === "loss" ? "D" : outcome === "draw" ? "E" : "–";

  return (
    <div style={styles.matchRow}>
      <span style={styles.matchDate}>{dateStr}</span>
      <span style={{ ...styles.outcomeBadge, backgroundColor: outcomeColor + "22", color: outcomeColor, borderColor: outcomeColor + "44" }}>
        {outcomeLetter}
      </span>
      <span style={styles.teamHome}>{m.home_team_name}</span>
      <div style={styles.scoreBlock}>
        <span style={hasScore ? styles.score : styles.scorePending}>
          {hasScore ? `${m.home_score} × ${m.away_score}` : "– × –"}
        </span>
        {hasPenalty && (
          <span style={styles.penalty}>pên: {m.home_penalty_score} × {m.away_penalty_score}</span>
        )}
      </div>
      <span style={styles.teamAway}>{m.away_team_name}</span>
      <span style={styles.phaseBadge}>{m.phase_name}</span>
    </div>
  );
}

function SeasonSummary({ stats }: { stats: SeasonStats }) {
  const gd = stats.goalsFor - stats.goalsAgainst;
  return (
    <div style={styles.summary}>
      <span style={styles.summaryTitle}>Resumo da temporada</span>
      <div style={styles.summaryStats}>
        <Stat label="J" value={stats.played} />
        <Stat label="V" value={stats.wins} color="#a6e3a1" />
        <Stat label="E" value={stats.draws} color="#f9e2af" />
        <Stat label="D" value={stats.losses} color="#f38ba8" />
        <Stat label="GM" value={stats.goalsFor} />
        <Stat label="GS" value={stats.goalsAgainst} />
        <Stat label="SG" value={gd >= 0 ? `+${gd}` : `${gd}`} color={gd >= 0 ? "#a6e3a1" : "#f38ba8"} />
        <Stat label="Pts" value={stats.wins * 3 + stats.draws} color="#89b4fa" bold />
      </div>
    </div>
  );
}

function Stat({ label, value, color, bold }: { label: string; value: string | number; color?: string; bold?: boolean }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statLabel}>{label}</span>
      <span style={{ ...styles.statValue, ...(color ? { color } : {}), ...(bold ? { fontWeight: 700 } : {}) }}>
        {value}
      </span>
    </div>
  );
}

function computeStats(matches: TeamMatch[], teamId: string): SeasonStats {
  let played = 0, wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
  for (const m of matches) {
    if (m.home_score === null || m.away_score === null) continue;
    played++;
    const isHome = m.home_team_id === teamId;
    const myGoals = isHome ? m.home_score : m.away_score;
    const oppGoals = isHome ? m.away_score : m.home_score;
    goalsFor += myGoals;
    goalsAgainst += oppGoals;

    const hasPenalty = m.home_penalty_score !== null && m.away_penalty_score !== null;
    if (hasPenalty) {
      const myPen = isHome ? m.home_penalty_score! : m.away_penalty_score!;
      const oppPen = isHome ? m.away_penalty_score! : m.home_penalty_score!;
      if (myPen > oppPen) wins++;
      else losses++;
    } else {
      if (myGoals > oppGoals) wins++;
      else if (myGoals === oppGoals) draws++;
      else losses++;
    }
  }
  return { played, wins, draws, losses, goalsFor, goalsAgainst };
}

function groupByChampionship(matches: TeamMatch[]): [string, TeamMatch[]][] {
  const map = new Map<string, TeamMatch[]>();
  for (const m of matches) {
    if (!map.has(m.championship_name)) map.set(m.championship_name, []);
    map.get(m.championship_name)!.push(m);
  }
  return [...map.entries()];
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "3rem 1.5rem",
  },
  back: {
    display: "inline-block",
    color: "#89b4fa",
    textDecoration: "none",
    fontSize: "0.9rem",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#cdd6f4",
    marginBottom: "2rem",
  },
  status: { color: "#6c7086" },
  error: { color: "#f38ba8" },
  empty: { color: "#6c7086", textAlign: "center", padding: "2rem 0" },
  season: {
    marginBottom: "3rem",
  },
  seasonTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#f9e2af",
    marginBottom: "1rem",
    borderBottom: "1px solid #313244",
    paddingBottom: "0.5rem",
  },
  champBlock: {
    marginBottom: "1rem",
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    overflow: "hidden",
  },
  champHeader: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#a6e3a1",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    padding: "0.5rem 1rem",
    backgroundColor: "#181825",
    borderBottom: "1px solid #313244",
  },
  matchRow: {
    display: "grid",
    gridTemplateColumns: "44px 28px 1fr 88px 1fr auto",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.4rem 1rem",
    borderBottom: "1px solid #181825",
  },
  matchDate: {
    fontSize: "0.7rem",
    color: "#45475a",
    whiteSpace: "nowrap" as const,
  },
  outcomeBadge: {
    fontSize: "0.65rem",
    fontWeight: 700,
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    border: "1px solid transparent",
    textAlign: "center" as const,
  },
  teamHome: {
    fontSize: "0.875rem",
    color: "#cdd6f4",
    textAlign: "right" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  teamAway: {
    fontSize: "0.875rem",
    color: "#cdd6f4",
    textAlign: "left" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  scoreBlock: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  score: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#f5c2e7",
    textAlign: "center" as const,
    whiteSpace: "nowrap" as const,
  },
  scorePending: {
    fontSize: "0.875rem",
    color: "#45475a",
    textAlign: "center" as const,
  },
  penalty: {
    fontSize: "0.65rem",
    color: "#fab387",
    textAlign: "center" as const,
    whiteSpace: "nowrap" as const,
  },
  phaseBadge: {
    fontSize: "0.65rem",
    color: "#6c7086",
    whiteSpace: "nowrap" as const,
    textAlign: "right" as const,
  },
  summary: {
    backgroundColor: "#181825",
    border: "1px solid #313244",
    borderRadius: "8px",
    padding: "1rem 1.25rem",
    marginTop: "0.75rem",
  },
  summaryTitle: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#6c7086",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "0.75rem",
  },
  summaryStats: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap" as const,
  },
  stat: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: "32px",
  },
  statLabel: {
    fontSize: "0.65rem",
    color: "#6c7086",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  statValue: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#cdd6f4",
    marginTop: "2px",
  },
};
