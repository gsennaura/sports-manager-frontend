import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ListClubs } from "@application/use_cases/ListClubs";
import type { Club } from "@domain/entities/Club";

interface ClubsPageProps {
  listClubs: ListClubs;
}

export function ClubsPage({ listClubs }: ClubsPageProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listClubs.execute()
      .then((data) => { setClubs(data); setLoading(false); })
      .catch((err: unknown) => { setError(err instanceof Error ? err.message : "Erro desconhecido."); setLoading(false); });
  }, [listClubs]);

  const byCity = new Map<string, Club[]>();
  for (const c of clubs) {
    const city = c.city_name || "–";
    if (!byCity.has(city)) byCity.set(city, []);
    byCity.get(city)!.push(c);
  }
  const cities = [...byCity.keys()].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return (
    <main style={styles.page}>
      <Link to="/" style={styles.back}>← Início</Link>
      <h1 style={styles.title}>Clubes</h1>

      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        clubs.length === 0
          ? <p style={styles.status}>Nenhum clube encontrado.</p>
          : cities.map((city) => (
              <section key={city} style={styles.citySection}>
                <h2 style={styles.cityTitle}>{city}</h2>
                <div style={styles.clubsGrid}>
                  {byCity.get(city)!.map((club) => (
                    <Link key={club.id} to={`/clubes/${club.id}`} style={styles.clubCard}>
                      <span style={styles.clubName}>{club.name}</span>
                      {club.founded_at && (
                        <span style={styles.clubMeta}>Est. {club.founded_at.slice(0, 4)}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            ))
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "760px",
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
  citySection: {
    marginBottom: "2.5rem",
  },
  cityTitle: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#89b4fa",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "0.75rem",
    paddingBottom: "0.4rem",
    borderBottom: "1px solid #313244",
  },
  clubsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "0.6rem",
  },
  clubCard: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
    padding: "0.85rem 1rem",
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    textDecoration: "none",
  },
  clubName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  clubMeta: {
    fontSize: "0.7rem",
    color: "#6c7086",
  },
  status: { color: "#6c7086" },
  error: { color: "#f38ba8" },
};
