import type { ListTeams } from "@application/use_cases/ListTeams";
import type { CreateTeam } from "@application/use_cases/CreateTeam";
import { TeamForm } from "@presentation/components/TeamForm";
import { TeamList } from "@presentation/components/TeamList";
import { useTeams } from "@presentation/hooks/useTeams";

interface TeamsPageProps {
  listTeams: ListTeams;
  createTeam: CreateTeam;
}

export function TeamsPage({ listTeams, createTeam }: TeamsPageProps) {
  const { teams, loading, error, refetch } = useTeams(listTeams);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Times</h1>
      <TeamForm createTeam={createTeam} onSuccess={refetch} />
      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && <TeamList teams={teams} />}
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
