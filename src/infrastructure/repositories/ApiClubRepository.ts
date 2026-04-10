import type { Club } from "@domain/entities/Club";
import type { ClubRepository } from "@domain/repositories/ClubRepository";

type RawClub = {
  id: string;
  name: string;
  city_id: string;
  president: string | null;
  venue_id: string | null;
  founded_at: string | null;
};

export class ApiClubRepository implements ClubRepository {
  constructor(private readonly baseUrl: string) {}

  async listAll(): Promise<Club[]> {
    const [clubsResp, citiesResp, venuesResp] = await Promise.all([
      fetch(`${this.baseUrl}/clubs/`),
      fetch(`${this.baseUrl}/cities`),
      fetch(`${this.baseUrl}/venues`),
    ]);
    if (!clubsResp.ok) throw new Error(`Falha ao buscar clubes: ${clubsResp.status}`);
    const clubs = await clubsResp.json() as RawClub[];
    const cityMap = new Map<string, string>();
    if (citiesResp.ok) {
      const cities = await citiesResp.json() as Array<{ id: string; name: string }>;
      for (const c of cities) cityMap.set(c.id, c.name);
    }
    const venueMap = new Map<string, string>();
    if (venuesResp.ok) {
      const venues = await venuesResp.json() as Array<{ id: string; name: string }>;
      for (const v of venues) venueMap.set(v.id, v.name);
    }
    return clubs.map((c) => ({
      ...c,
      city_name: cityMap.get(c.city_id) ?? "–",
      venue_name: c.venue_id ? (venueMap.get(c.venue_id) ?? null) : null,
    }));
  }

  async getById(id: string): Promise<Club> {
    const [clubResp, citiesResp, venuesResp] = await Promise.all([
      fetch(`${this.baseUrl}/clubs/${id}`),
      fetch(`${this.baseUrl}/cities`),
      fetch(`${this.baseUrl}/venues`),
    ]);
    if (!clubResp.ok) throw new Error(`Clube não encontrado: ${clubResp.status}`);
    const club = await clubResp.json() as RawClub;
    const cityMap = new Map<string, string>();
    if (citiesResp.ok) {
      const cities = await citiesResp.json() as Array<{ id: string; name: string }>;
      for (const c of cities) cityMap.set(c.id, c.name);
    }
    const venueMap = new Map<string, string>();
    if (venuesResp.ok) {
      const venues = await venuesResp.json() as Array<{ id: string; name: string }>;
      for (const v of venues) venueMap.set(v.id, v.name);
    }
    return {
      ...club,
      city_name: cityMap.get(club.city_id) ?? "–",
      venue_name: club.venue_id ? (venueMap.get(club.venue_id) ?? null) : null,
    };
  }
}
