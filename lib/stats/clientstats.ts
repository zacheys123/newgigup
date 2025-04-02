// // lib/stats/client.ts
// import { Gig } from "@/models/Gig";

// type ClientStats = {
//   activeGigs: number;
//   totalSpent: number;
//   upcomingBookings: number;
//   favoriteGenres: string[];
// };

// export async function getClientStats(userId: string): Promise<ClientStats> {
//   try {
//     const now = new Date();

//     // Get all gigs created by this client
//     const gigs = await Gig.find({
//       userId,
//       status: { $ne: "cancelled" },
//     }).lean();

//     // Calculate active gigs (not yet completed)
//     const activeGigs = gigs.filter(
//       (gig) => new Date(gig.eventDate) > now
//     ).length;

//     // Calculate total spent (sum of all booked gigs)
//     const totalSpent = gigs.reduce((sum, gig) => {
//       return (
//         sum +
//         (gig.bookings?.reduce((bookingSum, booking) => {
//           return (
//             bookingSum + (booking.status === "confirmed" ? booking.price : 0)
//           );
//         }, 0) || 0)
//       );
//     }, 0);

//     // Get upcoming bookings in next 30 days
//     const upcomingBookings = gigs.filter((gig) => {
//       const eventDate = new Date(gig.eventDate);
//       return (
//         eventDate > now &&
//         eventDate <= new Date(now.setDate(now.getDate() + 30))
//       );
//     }).length;

//     // Get most booked genres (for recommendations)
//     const genreCounts: Record<string, number> = {};
//     gigs.forEach((gig) => {
//       if (gig.genre) {
//         genreCounts[gig.genre] = (genreCounts[gig.genre] || 0) + 1;
//       }
//     });
//     const favoriteGenres = Object.entries(genreCounts)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([genre]) => genre);

//     return {
//       activeGigs,
//       totalSpent,
//       upcomingBookings,
//       favoriteGenres,
//     };
//   } catch (error) {
//     console.error("Error fetching client stats:", error);
//     return {
//       activeGigs: 0,
//       totalSpent: 0,
//       upcomingBookings: 0,
//       favoriteGenres: [],
//     };
//   }
// }
