import type { ListChampionships } from "@application/use_cases/ListChampionships";
import { ChampionshipList } from "@presentation/components/ChampionshipList";
import { useChampionships } from "@presentation/hooks/useChampionships";

interface ChampionshipsPageProps {
  listChampionships: ListChampionships;
}

export function ChampionshipsPage({ listChampionships }: ChampionshipsPageProps) {
  const { championships, loading, error } = useChampionships(listChampionships);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Campeonatos</h1>
      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && <ChampionshipList championships={championships} />}
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
    marginBottom: "2rem",
  },
  status: {
    color: "#6c7086",
  },
  error: {
    color: "#f38ba8",
  },
};
