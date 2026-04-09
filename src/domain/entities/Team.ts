export interface Team {
  id: string;
  name: string;
  city_id: string;
  city_name: string;
  sport_id: string;
  venue_id: string | null;
  venue_name: string | null;
  president: string | null;
  founded_at: string | null;
}
