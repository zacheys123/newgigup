// app/dashboard/[userId]/favorites/page.tsx

import FavouritesList from "@/components/gig/dashboard/FavouriteList";
import { getFavoriteGigs } from "@/lib/actions/dashboard.actions";

export default async function FavoritesPage({
  params,
}: {
  params: { userId: string };
}) {
  const favoriteGigs = await getFavoriteGigs(params.userId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Favorite Gigs</h1>
      <FavouritesList gigs={favoriteGigs} />
    </div>
  );
}
