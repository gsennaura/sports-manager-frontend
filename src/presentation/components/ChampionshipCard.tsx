import type { Championship } from "@domain/entities/Championship";

interface ChampionshipCardProps {
  championship: Championship;
}

export function ChampionshipCard({ championship }: ChampionshipCardProps) {
  return (
    <li style={styles.card}>
      <span style={styles.name}>{championship.name}</span>
      <span style={styles.id}>#{championship.id.slice(0, 8)}</span>
    </li>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: "#1e1e2e",
    borderRadius: "8px",
    border: "1px solid #313244",
    listStyle: "none",
  },
  name: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  id: {
    fontSize: "0.75rem",
    color: "#6c7086",
    fontFamily: "monospace",
  },
};
