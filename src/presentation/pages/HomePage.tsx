import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Sports Manager</h1>
      <p style={styles.subtitle}>Gerencie seus campeonatos e times</p>

      <nav style={styles.nav}>
        <Link to="/ligas" style={{ ...styles.card, ...styles.cardHighlight }}>
          <span style={styles.cardEmoji}>🏆</span>
          <div>
            <span style={styles.cardTitle}>Ligas</span>
            <span style={styles.cardDesc}>Explore ligas e seus campeonatos por ano</span>
          </div>
        </Link>

        <Link to="/campeonatos" style={styles.card}>
          <span style={styles.cardEmoji}>📋</span>
          <div>
            <span style={styles.cardTitle}>Todos os Campeonatos</span>
            <span style={styles.cardDesc}>Listagem completa de todos os campeonatos</span>
          </div>
        </Link>

        <Link to="/times" style={styles.card}>
          <span style={styles.cardEmoji}>👕</span>
          <div>
            <span style={styles.cardTitle}>Times</span>
            <span style={styles.cardDesc}>Ver e gerenciar times</span>
          </div>
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
    gap: "0.75rem",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem 1.5rem",
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    textDecoration: "none",
    color: "inherit",
  },
  cardHighlight: {
    border: "1px solid #2a3a6a",
    backgroundColor: "#1a1f3a",
  },
  cardEmoji: {
    fontSize: "1.5rem",
    flexShrink: 0,
  },
  cardTitle: {
    display: "block",
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "#cdd6f4",
    marginBottom: "0.2rem",
  },
  cardDesc: {
    display: "block",
    fontSize: "0.825rem",
    color: "#6c7086",
  },
};
