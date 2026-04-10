import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import type { GetClub } from "@application/use_cases/GetClub";
import type { ListTeams } from "@application/use_cases/ListTeams";
import type { Club } from "@domain/entities/Club";
import type { Team } from "@domain/entities/Team";

interface ClubDetailPageProps {
  getClub: GetClub;
  listTeams: ListTeams;
}

const categoryLabel: Record<string, string> = {
  amador: "Amador",
  profissional: "Profissional",
  base: "Base",
  junior: "Júnior",
  juvenil: "Juvenil",
  infantil: "Infantil",
  mirim: "Mirim",
  "pre-mirim": "Pré-Mirim",
  master: "Master",
  universitaria: "Universitária",
};

const categoryColor: Record<string, string> = {
  amador: "#89b4fa",
  profissional: "#a6e3a1",
  base: "#f9e2af",
  junior: "#fab387",
  juvenil: "#cba6f7",
  infantil: "#89dceb",
  mirim: "#f38ba8",
  "pre-mirim": "#eba0ac",
  master: "#74c7ec",
  universitaria: "#94e2d5",
};

export function ClubDetailPage({ getClub, listTeams }: ClubDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getClub.execute(id),
      listTeams.execute(),
    ]).then(([clubData, allTeams]) => {
      setClub(clubData);
      setTeams(allTeams.filter((t) => t.club_id === id));
      setLoading(false);
    }).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
      setLoading(false);
    });
  }, [id, getClub, listTeams]);

  return (
    <main style={styles.page}>
      <Link to="/times" style={styles.back}>← Times</Link>

      {loading && <p style={styles.status}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && club && (
        <>
          <h1 style={styles.title}>{club.name}</h1>

          <div style={styles.infoCard}>
            <InfoRow label="Cidade" value={club.city_name} />
            {club.venue_name && <InfoRow label="Estádio / Arena" value={club.venue_name} />}
            {club.president && <InfoRow label="Presidente" value={club.president} />}
            {club.founded_at && <InfoRow label="Fundação" value={formatDate(club.founded_at)} />}
          </div>

          <h2 style={styles.sectionTitle}>Times do clube</h2>

          {teams.length === 0 ? (
            <p style={styles.empty}>Nenhum time cadastrado.</p>
          ) : (
            <div style={styles.teamsGrid}>
              {teams.map((t) => (
                <Link key={t.id} to={`/times/${t.id}`} style={styles.teamCard}>
                  <div style={styles.teamName}>{t.name}</div>
                  <div style={styles.teamMeta}>
                    {t.category && (
                      <span style={{
                        ...styles.categoryBadge,
                        backgroundColor: (categoryColor[t.category] ?? "#6c7086") + "22",
                        color: categoryColor[t.category] ?? "#6c7086",
                        borderColor: (categoryColor[t.category] ?? "#6c7086") + "44",
                      }}>
                        {categoryLabel[t.category] ?? t.category}
                      </span>
                    )}
                    {t.city_name && t.city_name !== club.city_name && (
                      <span style={styles.cityTag}>{t.city_name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = iso.slice(0, 10).split("-");
  if (d.length === 3) return `${d[2]}/${d[1]}/${d[0]}`;
  return iso;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "860px",
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
    marginBottom: "1rem",
  },
  infoCard: {
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    padding: "1rem 1.25rem",
    marginBottom: "2.5rem",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.75rem 2rem",
  },
  infoRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  infoLabel: {
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#6c7086",
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
  },
  infoValue: {
    fontSize: "0.9rem",
    color: "#cdd6f4",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#a6e3a1",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "1rem",
    borderBottom: "1px solid #313244",
    paddingBottom: "0.5rem",
  },
  teamsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "0.75rem",
  },
  teamCard: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    backgroundColor: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: "8px",
    padding: "1rem",
    textDecoration: "none",
    transition: "border-color 0.15s",
  },
  teamName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  teamMeta: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.35rem",
  },
  categoryBadge: {
    fontSize: "0.65rem",
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid transparent",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  cityTag: {
    fontSize: "0.7rem",
    color: "#6c7086",
    alignSelf: "center" as const,
  },
  status: { color: "#6c7086" },
  error: { color: "#f38ba8" },
  empty: { color: "#6c7086", textAlign: "center" as const, padding: "2rem 0" },
};
