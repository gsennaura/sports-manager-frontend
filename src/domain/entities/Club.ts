export interface Club {
  id: string;
  name: string;
  city_id: string;
  city_name: string;
  president: string | null;
  venue_id: string | null;
  venue_name: string | null;
  founded_at: string | null;
}
