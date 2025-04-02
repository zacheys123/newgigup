// // lib/stats/musician.ts
// import { Gig } from "@/models/Gig";
// import { Booking } from "@/models/Booking";

// type MusicianStats = {
//   gigsBooked: number;
//   earnings: number;
//   acceptanceRate: number;
//   topClients: Array<{ name: string; bookings: number }>;
//   responseTime: number; // in hours
// };

// export async function getMusicianStats(userId: string): Promise<MusicianStats> {
//   try {
//     const now = new Date();
//     const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

//     // Get all bookings for this musician
//     const bookings = await Booking.find({
//       musicianId: userId,
//       status: { $in: ["confirmed", "completed"] },
//     })
//       .populate("gigId")
//       .lean();

//     // Calculate stats
//     const gigsBooked = bookings.length;

//     const earnings = bookings.reduce((sum, booking) => {
//       return sum + (booking.price || 0);
//     }, 0);

//     // Get all applications to calculate acceptance rate
//     const totalApplications = await Booking.countDocuments({
//       musicianId: userId,
//     });
//     const acceptanceRate =
//       totalApplications > 0
//         ? Math.round((gigsBooked / totalApplications) * 100)
//         : 0;

//     // Calculate top clients
//     const clientStats: Record<string, { name: string; bookings: number }> = {};
//     bookings.forEach((booking) => {
//       const clientId = booking.gigId.userId;
//       if (clientId) {
//         if (!clientStats[clientId]) {
//           clientStats[clientId] = {
//             name: booking.gigId.clientName || `Client ${clientId.slice(0, 5)}`,
//             bookings: 0,
//           };
//         }
//         clientStats[clientId].bookings++;
//       }
//     });

//     const topClients = Object.values(clientStats)
//       .sort((a, b) => b.bookings - a.bookings)
//       .slice(0, 3);

//     // Calculate average response time (hours)
//     let responseTime = 0;
//     if (bookings.length > 0) {
//       const totalResponseTime = bookings.reduce((sum, booking) => {
//         const appliedAt = new Date(booking.createdAt);
//         const respondedAt =
//           booking.status === "confirmed"
//             ? new Date(booking.updatedAt)
//             : new Date();
//         return sum + (respondedAt.getTime() - appliedAt.getTime());
//       }, 0);
//       responseTime = Math.round(
//         totalResponseTime / bookings.length / (1000 * 60 * 60)
//       );
//     }

//     return {
//       gigsBooked,
//       earnings,
//       acceptanceRate,
//       topClients,
//       responseTime,
//     };
//   } catch (error) {
//     console.error("Error fetching musician stats:", error);
//     return {
//       gigsBooked: 0,
//       earnings: 0,
//       acceptanceRate: 0,
//       topClients: [],
//       responseTime: 0,
//     };
//   }
// }
