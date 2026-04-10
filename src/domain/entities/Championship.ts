export interface Championship {
  id: string;
  name: string;
  nickname: string | null;
  city_id: string;
  city_name: string;
  sport_id: string;
  year: number;
  scope: string;
  level: string | null;
  league_id: string | null;
}
