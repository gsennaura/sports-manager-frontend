import type { ListChampionships } from "@application/use_cases/ListChampionships";
import { ChampionshipList } from "@presentation/components/ChampionshipList";
import { useChampionships } from "@presentation/hooks/useChampionships";

interface ChampionshipsPageProps {
  listChampionships: ListChampionships;
}

export function ChampionshipsPage({ listChampionships }: ChampionshipsPageProps) {
  const { championships, loading, error } = useChampionships(listChampionships);

  const byCity = new Map<string, typeof championships>();
  for (const c of championships) {
    const city = c.city_name || "–";
    if (!byCity.has(city)) byCity.set(city, []);
    byCity.get(city)!.push(c);
  }
  const cities = [...byCity.keys()].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Campeonatos</h1>
      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && (
        cities.length === 0
          ? <p style={styles.status}>Nenhum campeonato encontrado.</p>
          : cities.map((city) => (
              <section key={city} style={styles.citySection}>
                <h2 style={styles.cityTitle}>{city}</h2>
                <ChampionshipList championships={byCity.get(city)!} />
              </section>
            ))
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
    marginBottom: "2rem",
  },
  citySection: {
    marginBottom: "2.5rem",
  },
  cityTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#89b4fa",
    marginBottom: "0.75rem",
    paddingBottom: "0.4rem",
    borderBottom: "1px solid #313244",
  },
  status: {
    color: "#6c7086",
  },
  error: {
    color: "#f38ba8",
  },
};
