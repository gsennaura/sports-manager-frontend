import { useState } from "react";
import type { CreateTeam } from "@application/use_cases/CreateTeam";

interface TeamFormProps {
  createTeam: CreateTeam;
  onSuccess: () => void;
}

export function TeamForm({ createTeam, onSuccess }: TeamFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createTeam.execute(name.trim());
      setName("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar time.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do time"
          disabled={submitting}
          style={styles.input}
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          style={styles.button}
        >
          {submitting ? "Salvando..." : "Cadastrar"}
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    marginBottom: "2rem",
  },
  row: {
    display: "flex",
    gap: "0.75rem",
  },
  input: {
    flex: 1,
    padding: "0.6rem 0.875rem",
    borderRadius: "6px",
    border: "1px solid #313244",
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    fontSize: "0.95rem",
  },
  button: {
    padding: "0.6rem 1.25rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#89b4fa",
    color: "#1e1e2e",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  error: {
    marginTop: "0.5rem",
    color: "#f38ba8",
    fontSize: "0.875rem",
  },
};
