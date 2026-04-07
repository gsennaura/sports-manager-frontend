import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Sports Manager</h1>
      <p style={styles.subtitle}>Gerencie seus campeonatos e times</p>

      <nav style={styles.nav}>
        <Link to="/campeonatos" style={styles.card}>
          <span style={styles.cardTitle}>Campeonatos</span>
          <span style={styles.cardDesc}>Ver e gerenciar campeonatos</span>
        </Link>

        <Link to="/times" style={styles.card}>
          <span style={styles.cardTitle}>Times</span>
          <span style={styles.cardDesc}>Ver e gerenciar times</span>
        </Link>
      </nav>
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
    fontSize: "2rem",
    fontWeight: 700,
    color: "#cdd6f4",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6c7086",
    marginBottom: "3rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    padding: "1.5rem",
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    textDecoration: "none",
    color: "inherit",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  cardDesc: {
    fontSize: "0.875rem",
    color: "#6c7086",
  },
};
