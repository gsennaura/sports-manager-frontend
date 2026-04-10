import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { GetLeague } from "@application/use_cases/ListLeagues";
import type { ListChampionships } from "@application/use_cases/ListChampionships";
import type { League } from "@domain/entities/League";
import type { Championship } from "@domain/entities/Championship";

interface LeagueDetailPageProps {
  getLeague: GetLeague;
  listChampionships: ListChampionships;
}

const levelLabel: Record<string, string> = {
  amador: "Amador",
  universitario: "Universitário",
  profissional: "Profissional",
};

const levelColor: Record<string, React.CSSProperties> = {
  amador: { color: "#a6e3a1", backgroundColor: "#1a2e1f", borderColor: "#2a4a2f" },
  universitario: { color: "#89b4fa", backgroundColor: "#1a1f3a", borderColor: "#2a3a6a" },
  profissional: { color: "#f9e2af", backgroundColor: "#2e2a1a", borderColor: "#4a3a2a" },
};

function LevelBadge({ level }: { level: string }) {
  const colorStyle = levelColor[level] ?? { color: "#6c7086", backgroundColor: "#1e1e2e", borderColor: "#313244" };
  return (
    <span style={{ ...styles.badge, ...colorStyle }}>
      {levelLabel[level] ?? level}
    </span>
  );
}

function ChampionshipRow({ c }: { c: Championship }) {
  const displayName = c.nickname ?? c.name;
  return (
    <Link to={`/campeonatos/${c.id}`} state={{ fromLeague: true }} style={styles.champRow}>
      <div style={styles.champName}>
        {displayName}
        {c.nickname && (
          <span style={styles.fullName}>{c.name}</span>
        )}
      </div>
      <div style={styles.champMeta}>
        {c.level && <LevelBadge level={c.level} />}
        <span style={styles.scopeBadge}>{c.scope}</span>
      </div>
    </Link>
  );
}

export function LeagueDetailPage({ getLeague, listChampionships }: LeagueDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getLeague.execute(id),
      listChampionships.execute(),
    ])
      .then(([lg, champs]) => {
        setLeague(lg);
        setChampionships(champs.filter((c) => c.league_id === id));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Group championships by year, sorted newest first
  const byYear = new Map<number, Championship[]>();
  for (const c of championships) {
    if (!byYear.has(c.year)) byYear.set(c.year, []);
    byYear.get(c.year)!.push(c);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <main style={styles.page}>
      <Link to="/ligas" style={styles.back}>← Ligas</Link>

      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {league && (
        <>
          <div style={styles.header}>
            <div style={styles.headerMain}>
              <span style={styles.shortName}>{league.short_name}</span>
              <h1 style={styles.title}>{league.name}</h1>
            </div>
            {league.is_federated && (
              <span style={styles.federatedBadge}>Federada</span>
            )}
          </div>

          <div style={styles.meta}>
            <span style={styles.metaItem}>📍 {league.city_name}</span>
            {league.president && (
              <span style={styles.metaItem}>👤 {league.president}</span>
            )}
            {league.founded_year && (
              <span style={styles.metaItem}>🗓 Fundada em {league.founded_year}</span>
            )}
            {league.website && (
              <a href={league.website} target="_blank" rel="noopener noreferrer" style={styles.metaLink}>
                🌐 Site oficial
              </a>
            )}
          </div>

          <div style={styles.divider} />

          <h2 style={styles.sectionTitle}>Campeonatos</h2>

          {championships.length === 0 && !loading ? (
            <p style={styles.status}>Nenhum campeonato cadastrado para esta liga.</p>
          ) : (
            years.map((year) => (
              <section key={year} style={styles.yearSection}>
                <h3 style={styles.yearTitle}>{year}</h3>
                <div style={styles.champList}>
                  {byYear.get(year)!.map((c) => (
                    <ChampionshipRow key={c.id} c={c} />
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "640px",
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
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "1rem",
  },
  headerMain: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
  },
  shortName: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#89b4fa",
    backgroundColor: "#1a1f3a",
    border: "1px solid #2a3a6a",
    borderRadius: "4px",
    padding: "0.1rem 0.45rem",
    letterSpacing: "0.04em",
    alignSelf: "flex-start" as const,
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#cdd6f4",
    margin: 0,
  },
  federatedBadge: {
    flexShrink: 0,
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#a6e3a1",
    backgroundColor: "#1a2e1f",
    border: "1px solid #2a4a2f",
    borderRadius: "4px",
    padding: "0.2rem 0.6rem",
    letterSpacing: "0.04em",
    marginTop: "0.25rem",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.75rem 1.5rem",
    marginBottom: "1.5rem",
  },
  metaItem: {
    fontSize: "0.85rem",
    color: "#6c7086",
  },
  metaLink: {
    fontSize: "0.85rem",
    color: "#89b4fa",
    textDecoration: "none",
  },
  divider: {
    borderBottom: "1px solid #313244",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#6c7086",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "1.25rem",
  },
  yearSection: {
    marginBottom: "2rem",
  },
  yearTitle: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#89b4fa",
    marginBottom: "0.5rem",
    paddingBottom: "0.35rem",
    borderBottom: "1px solid #313244",
  },
  champList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  champRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.9rem 1.25rem",
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    textDecoration: "none",
    color: "inherit",
    gap: "1rem",
  },
  champName: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.15rem",
  },
  champMain: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  fullName: {
    fontSize: "0.75rem",
    color: "#6c7086",
  },
  champMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    flexShrink: 0,
  },
  badge: {
    fontSize: "0.65rem",
    fontWeight: 700,
    border: "1px solid",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap" as const,
  },
  scopeBadge: {
    fontSize: "0.65rem",
    color: "#45475a",
    backgroundColor: "#181825",
    border: "1px solid #313244",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    whiteSpace: "nowrap" as const,
  },
  status: { color: "#6c7086" },
  error: { color: "#f38ba8" },
};
