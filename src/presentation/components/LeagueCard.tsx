import { Link } from "react-router-dom";
import type { League } from "@domain/entities/League";

interface LeagueCardProps {
  league: League;
}

export function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Link to={`/ligas/${league.id}`} style={styles.card}>
      <div style={styles.header}>
        <div>
          <span style={styles.shortName}>{league.short_name}</span>
          <span style={styles.name}>{league.name}</span>
        </div>
        {league.is_federated && (
          <span style={styles.federatedBadge}>Federada</span>
        )}
      </div>
      <div style={styles.footer}>
        <span style={styles.city}>{league.city_name}</span>
        {league.founded_year && (
          <span style={styles.founded}>Est. {league.founded_year}</span>
        )}
      </div>
    </Link>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1.25rem 1.5rem",
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    textDecoration: "none",
    color: "inherit",
    transition: "border-color 0.15s",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "0.5rem",
  },
  shortName: {
    display: "inline-block",
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#89b4fa",
    backgroundColor: "#1a1f3a",
    border: "1px solid #2a3a6a",
    borderRadius: "4px",
    padding: "0.1rem 0.45rem",
    marginRight: "0.6rem",
    letterSpacing: "0.04em",
  },
  name: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  federatedBadge: {
    flexShrink: 0,
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#a6e3a1",
    backgroundColor: "#1a2e1f",
    border: "1px solid #2a4a2f",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap" as const,
  },
  footer: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  city: {
    fontSize: "0.8rem",
    color: "#6c7086",
  },
  founded: {
    fontSize: "0.75rem",
    color: "#45475a",
  },
};
