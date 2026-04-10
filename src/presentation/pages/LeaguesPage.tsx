import type { ListLeagues } from "@application/use_cases/ListLeagues";
import { LeagueCard } from "@presentation/components/LeagueCard";
import { useLeagues } from "@presentation/hooks/useLeagues";

interface LeaguesPageProps {
  listLeagues: ListLeagues;
}

export function LeaguesPage({ listLeagues }: LeaguesPageProps) {
  const { leagues, loading, error } = useLeagues(listLeagues);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Sports Manager</h1>
      <p style={styles.subtitle}>Selecione uma liga para ver seus campeonatos</p>

      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        leagues.length === 0 ? (
          <p style={styles.status}>Nenhuma liga encontrada.</p>
        ) : (
          <div style={styles.list}>
            {leagues.map((lg) => (
              <LeagueCard key={lg.id} league={lg} />
            ))}
          </div>
        )
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
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#cdd6f4",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6c7086",
    fontSize: "0.9rem",
    marginBottom: "2rem",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  status: { color: "#6c7086" },
  error: { color: "#f38ba8" },
};
