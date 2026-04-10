import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import type { GetChampionshipDetail } from "@application/use_cases/GetChampionshipDetail";
import type { ChampionshipDetail, GroupDetail, MatchEntry, StandingEntry } from "@domain/entities/ChampionshipDetail";
import { useChampionshipDetail } from "@presentation/hooks/useChampionshipDetail";

interface ChampionshipDetailPageProps {
  getChampionshipDetail: GetChampionshipDetail;
}

export function ChampionshipDetailPage({ getChampionshipDetail }: ChampionshipDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const fromLeague = (location.state as { fromLeague?: boolean } | null)?.fromLeague;
  const { detail, loading, error } = useChampionshipDetail(getChampionshipDetail, id!);

  const backLink = fromLeague && detail?.league_id
    ? `/ligas/${detail.league_id}`
    : "/campeonatos";
  const backLabel = fromLeague && detail?.league_id ? "← Liga" : "← Campeonatos";

  const levelLabel: Record<string, string> = {
    amador: "Amador",
    universitario: "Universitário",
    profissional: "Profissional",
  };
  const levelColor: Record<string, React.CSSProperties> = {
    amador: { color: "#a6e3a1", backgroundColor: "#1a2e1f", border: "1px solid #2a4a2f" },
    universitario: { color: "#89b4fa", backgroundColor: "#1a1f3a", border: "1px solid #2a3a6a" },
    profissional: { color: "#f9e2af", backgroundColor: "#2e2a1a", border: "1px solid #4a3a2a" },
  };

  return (
    <main style={styles.page}>
      <Link to={backLink} style={styles.back}>{backLabel}</Link>

      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {detail && (
        <>
          <div style={styles.champHeader}>
            <div>
              <h1 style={styles.title}>
                {detail.nickname ?? detail.name}
              </h1>
              {detail.nickname && (
                <p style={styles.champFullName}>{detail.name}</p>
              )}
            </div>
            <div style={styles.champBadges}>
              {detail.level && (
                <span style={{ ...styles.badge, ...levelColor[detail.level] }}>
                  {levelLabel[detail.level] ?? detail.level}
                </span>
              )}
              <span style={styles.yearBadge}>{detail.year}</span>
              <span style={styles.scopeBadge}>{detail.scope}</span>
            </div>
          </div>

          {[...detail.phases].sort((a, b) => b.order - a.order).map((phase) => (
            <section key={phase.id} style={styles.phase}>
              <h2 style={styles.phaseTitle}>{phase.name}</h2>
              <div style={styles.groupsGrid}>
                {phase.phase_type === "knockout"
                  ? phase.groups.map((group) => (
                      <KnockoutGroupCard key={group.id} group={group} />
                    ))
                  : phase.groups.map((group) => (
                      <GroupCard key={group.id} group={group} />
                    ))}
              </div>
            </section>
          ))}

          <OverallStandings detail={detail} />
        </>
      )}
    </main>
  );
}

function KnockoutGroupCard({ group }: { group: GroupDetail }) {
  return (
    <div style={styles.groupCard}>
      <div style={styles.groupHeader}>
        <h3 style={styles.groupTitle}>{group.name}</h3>
        <span style={styles.knockoutBadge}>Mata-a-mata</span>
      </div>
      <MatchRoundList matches={group.matches} teams={group.teams} knockout />
    </div>
  );
}

function GroupCard({ group }: { group: GroupDetail }) {
  const [tab, setTab] = useState<"standings" | "matches">("standings");
  return (
    <div style={styles.groupCard}>
      <div style={styles.groupHeader}>
        <h3 style={styles.groupTitle}>{group.name}</h3>
        <div style={styles.tabs}>
          <button
            style={tab === "standings" ? styles.tabActive : styles.tabInactive}
            onClick={() => setTab("standings")}
          >
            Classificação
          </button>
          <button
            style={tab === "matches" ? styles.tabActive : styles.tabInactive}
            onClick={() => setTab("matches")}
          >
            Partidas ({group.matches.length})
          </button>
        </div>
      </div>
      {tab === "standings" && (
        <StandingsTable standings={group.standings} teams={group.teams} />
      )}
      {tab === "matches" && (
        <MatchRoundList matches={group.matches} teams={group.teams} />
      )}
    </div>
  );
}

function MatchRoundList({
  matches,
  teams,
  knockout = false,
}: {
  matches: MatchEntry[];
  teams: GroupDetail["teams"];
  knockout?: boolean;
}) {
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));

  const rounds = new Map<number, MatchEntry[]>();
  for (const m of [...matches].sort((a, b) => a.round_number - b.round_number)) {
    if (!rounds.has(m.round_number)) rounds.set(m.round_number, []);
    rounds.get(m.round_number)!.push(m);
  }

  if (rounds.size === 0) {
    return <p style={styles.noMatches}>Nenhuma partida registrada.</p>;
  }

  const legLabel = (round: number) =>
    knockout ? (round === 1 ? "Jogo de ida" : round === 2 ? "Jogo de volta" : `Jogo ${round}`) : `Rodada ${round}`;

  return (
    <div style={styles.rounds}>
      {[...rounds.entries()].map(([round, roundMatches]) => {
        const roundDate = roundMatches[0]?.match_date;
        const dateStr = roundDate ? ` · ${roundDate.slice(8, 10)}/${roundDate.slice(5, 7)}` : "";
        return (
        <div key={round} style={styles.round}>
          <div style={styles.roundHeader}>{legLabel(round)}<span style={styles.roundDate}>{dateStr}</span></div>
          {roundMatches.map((m) => {
            const home = teamMap.get(m.home_team_id) ?? m.home_team_id.slice(0, 8);
            const away = teamMap.get(m.away_team_id) ?? m.away_team_id.slice(0, 8);
            const hasScore = m.home_score !== null && m.away_score !== null;
            const hasPenalty = hasScore && m.home_penalty_score !== null && m.away_penalty_score !== null;
            return (
              <div key={m.id}>
                <div style={styles.matchRow}>
                  <Link to={`/times/${m.home_team_id}`} style={{ ...styles.teamHome, ...styles.teamLink }}>{home}</Link>
                  <div style={styles.scoreBlock}>
                    <span style={hasScore ? styles.score : styles.scorePending}>
                      {hasScore ? `${m.home_score} × ${m.away_score}` : "– × –"}
                    </span>
                    {hasPenalty && (
                      <span style={styles.penalty}>
                        pên: {m.home_penalty_score} × {m.away_penalty_score}
                      </span>
                    )}
                  </div>
                  <Link to={`/times/${m.away_team_id}`} style={{ ...styles.teamAway, ...styles.teamLink }}>{away}</Link>
                </div>
                {m.venue_name && (
                  <div style={styles.venueTag}>📍 {m.venue_name}</div>
                )}
              </div>
            );
          })}
        </div>
        );
      })}
    </div>
  );
}

function StandingsTable({ standings, teams }: { standings: StandingEntry[]; teams: GroupDetail["teams"] }) {
  const rows: StandingEntry[] = standings.length > 0
    ? standings
    : teams.map((t) => ({
        team_id: t.id,
        team_name: t.name,
        matches_played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        points: 0,
      }));

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, textAlign: "left" }}>Time</th>
            <th style={styles.th} title="Partidas">J</th>
            <th style={styles.th} title="Vitórias">V</th>
            <th style={styles.th} title="Empates">E</th>
            <th style={styles.th} title="Derrotas">D</th>
            <th style={styles.th} title="Gols Marcados">GM</th>
            <th style={styles.th} title="Gols Sofridos">GS</th>
            <th style={{ ...styles.th, color: "#89b4fa" }} title="Pontos">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={s.team_id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={{ ...styles.td, textAlign: "left" }}>
                <Link to={`/times/${s.team_id}`} style={styles.teamLink}>{s.team_name}</Link>
              </td>
              <td style={styles.td}>{s.matches_played}</td>
              <td style={styles.td}>{s.wins}</td>
              <td style={styles.td}>{s.draws}</td>
              <td style={styles.td}>{s.losses}</td>
              <td style={styles.td}>{s.goals_for}</td>
              <td style={styles.td}>{s.goals_against}</td>
              <td style={{ ...styles.td, fontWeight: 700, color: "#89b4fa" }}>{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverallStandings({ detail }: { detail: ChampionshipDetail }) {
  const totals = new Map<string, StandingEntry>();

  for (const phase of detail.phases) {
    for (const group of phase.groups) {
      for (const s of group.standings) {
        const existing = totals.get(s.team_id);
        if (!existing) {
          totals.set(s.team_id, { ...s });
        } else {
          existing.matches_played += s.matches_played;
          existing.wins += s.wins;
          existing.draws += s.draws;
          existing.losses += s.losses;
          existing.goals_for += s.goals_for;
          existing.goals_against += s.goals_against;
          existing.goal_difference += s.goal_difference;
          existing.points += s.points;
        }
      }
    }
  }

  const rows = [...totals.values()].sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference || b.goals_for - a.goals_for);

  if (rows.length === 0) return null;

  return (
    <section style={{ ...styles.phase, marginTop: "3rem" }}>
      <h2 style={{ ...styles.phaseTitle, color: "#f9e2af" }}>Classificação Geral</h2>
      <div style={styles.groupCard}>
        <StandingsTable standings={rows} teams={[]} />
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "900px",
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
  champHeader: {
    marginBottom: "2rem",
  },
  champFullName: {
    fontSize: "0.85rem",
    color: "#6c7086",
    margin: "0.25rem 0 0 0",
  },
  champBadges: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.4rem",
    marginTop: "0.75rem",
  },
  badge: {
    fontSize: "0.7rem",
    fontWeight: 700,
    borderRadius: "4px",
    padding: "0.2rem 0.6rem",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap" as const,
  },
  yearBadge: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#cdd6f4",
    backgroundColor: "#313244",
    borderRadius: "4px",
    padding: "0.2rem 0.6rem",
    whiteSpace: "nowrap" as const,
  },
  scopeBadge: {
    fontSize: "0.7rem",
    color: "#45475a",
    backgroundColor: "#181825",
    border: "1px solid #313244",
    borderRadius: "4px",
    padding: "0.2rem 0.6rem",
    whiteSpace: "nowrap" as const,
  },
  phase: {
    marginBottom: "2.5rem",
  },
  phaseTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#a6e3a1",
    marginBottom: "1rem",
    borderBottom: "1px solid #313244",
    paddingBottom: "0.5rem",
  },
  groupsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  groupCard: {
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    padding: "1.25rem 1.5rem",
  },
  groupHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  },
  groupTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#89b4fa",
    margin: 0,
  },
  tabs: {
    display: "flex",
    gap: "0.25rem",
    backgroundColor: "#181825",
    borderRadius: "6px",
    padding: "3px",
  },
  tabActive: {
    background: "#313244",
    border: "none",
    borderRadius: "4px",
    color: "#cdd6f4",
    padding: "0.3rem 0.75rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.8rem",
  },
  tabInactive: {
    background: "none",
    border: "none",
    color: "#6c7086",
    padding: "0.3rem 0.75rem",
    cursor: "pointer",
    fontSize: "0.8rem",
    borderRadius: "4px",
  },
  rounds: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  },
  round: {},
  roundHeader: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#6c7086",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "0.375rem",
  },
  roundDate: {
    fontWeight: 400,
    textTransform: "none" as const,
    letterSpacing: "normal",
    color: "#45475a",
    marginLeft: "0.25rem",
  },
  matchRow: {
    display: "grid",
    gridTemplateColumns: "1fr 96px 1fr",
    alignItems: "center",
    padding: "0.3rem 0",
    borderBottom: "1px solid #181825",
  },
  teamLink: {
    textDecoration: "none",
    color: "inherit",
    transition: "color 0.15s",
  } as React.CSSProperties,
  teamHome: {
    fontSize: "0.875rem",
    color: "#cdd6f4",
    textAlign: "right" as const,
    paddingRight: "0.5rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  teamAway: {
    fontSize: "0.875rem",
    color: "#cdd6f4",
    textAlign: "left" as const,
    paddingLeft: "0.5rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
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
  noMatches: {
    color: "#6c7086",
    fontSize: "0.875rem",
    textAlign: "center" as const,
    padding: "1rem 0",
    margin: 0,
  },
  penalty: {
    fontSize: "0.7rem",
    color: "#fab387",
    textAlign: "center" as const,
    whiteSpace: "nowrap" as const,
    display: "block",
    marginTop: "1px",
  },
  venueTag: {
    fontSize: "0.7rem",
    color: "#45475a",
    textAlign: "center" as const,
    paddingBottom: "0.3rem",
  },
  scoreBlock: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  knockoutBadge: {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#fab387",
    backgroundColor: "#2a1f1a",
    border: "1px solid #45352a",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    whiteSpace: "nowrap" as const,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
  },
  th: {
    padding: "0.5rem 0.75rem",
    textAlign: "center",
    color: "#6c7086",
    fontWeight: 600,
    borderBottom: "1px solid #313244",
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "0.5rem 0.75rem",
    textAlign: "center",
    color: "#cdd6f4",
  },
  rowEven: {
    backgroundColor: "transparent",
  },
  rowOdd: {
    backgroundColor: "#181825",
  },
};
