import { useEffect, useState } from "react";
import type { ChampionshipDetail } from "@domain/entities/ChampionshipDetail";
import type { GetChampionshipDetail } from "@application/use_cases/GetChampionshipDetail";

interface UseChampionshipDetailResult {
  detail: ChampionshipDetail | null;
  loading: boolean;
  error: string | null;
}

export function useChampionshipDetail(
  useCase: GetChampionshipDetail,
  id: string
): UseChampionshipDetailResult {
  const [detail, setDetail] = useState<ChampionshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    useCase
      .execute(id)
      .then(setDetail)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { detail, loading, error };
}
