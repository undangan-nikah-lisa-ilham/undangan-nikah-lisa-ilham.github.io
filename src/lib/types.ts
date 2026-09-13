export const RSVP_STATUSES = ["Hadir", "Tidak Hadir", "Ragu"] as const;

export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export type WishItem = {
  id: string;
  uid: string;
  name: string;
  msg: string;
  status: string;
  createdAt: number;
};

export type WishStats = {
  total: number;
  hadir: number;
  tidak: number;
  ragu: number;
};

export function computeStats(entries: WishItem[]): WishStats {
  return entries.reduce<WishStats>(
    (acc, item) => {
      acc.total += 1;
      if (item.status === "Hadir") acc.hadir += 1;
      else if (item.status === "Tidak Hadir") acc.tidak += 1;
      else if (item.status === "Ragu") acc.ragu += 1;
      return acc;
    },
    { total: 0, hadir: 0, tidak: 0, ragu: 0 },
  );
}