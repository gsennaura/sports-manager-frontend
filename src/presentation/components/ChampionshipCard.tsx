import { Link } from "react-router-dom";
import type { Championship } from "@domain/entities/Championship";

interface ChampionshipCardProps {
  championship: Championship;
}

export function ChampionshipCard({ championship }: ChampionshipCardProps) {
  return (
    <li style={styles.card}>
      <Link to={`/campeonatos/${championship.id}`} style={styles.link}>
        <span style={styles.name}>{championship.name}</span>
        <span style={styles.arrow}>→</span>
      </Link>
    </li>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    listStyle: "none",
    borderRadius: "8px",
    border: "1px solid #313244",
    overflow: "hidden",
  },
  link: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: "#1e1e2e",
    textDecoration: "none",
    color: "inherit",
  },
  name: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  arrow: {
    color: "#89b4fa",
    fontSize: "1.1rem",
  },
};
