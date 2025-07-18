import { Game } from "@/models/game";
import connectDb from "@/lib/connectDb";
import { ALL_GAME_CONFIGS } from "./sharedConfigs";

async function seedDev() {
  // Safety check
  if (process.env.NODE_ENV !== "development") {
    console.warn("❌ Dev seeds should only run in development");
    process.exit(1);
  }

  console.log("🚀 Seeding development games...");
  await connectDb();

  try {
    let created = 0;
    let updated = 0;

    // Process all game categories
    for (const [category, games] of Object.entries(ALL_GAME_CONFIGS)) {
      console.log(`\n📁 Processing ${category} games:`);

      for (const game of games) {
        // Add DEV suffix to names
        const devGame = {
          ...game,
          name: `${game.name} (DEV)`,
          description: `${game.description} - Development Version`,
        };

        const result = await Game.updateOne(
          { slug: game.slug },
          {
            $set: {
              name: devGame.name,
              description: devGame.description,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              ...devGame,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );

        if (result.upsertedCount) {
          console.log(`   🆕 Created: ${devGame.slug}`);
          created++;
        } else if (result.modifiedCount) {
          console.log(`   🔄 Updated: ${devGame.slug}`);
          updated++;
        } else {
          console.log(`   ⏩ No changes: ${devGame.slug}`);
        }
      }
    }

    console.log(`\n✅ Done! Created ${created}, Updated ${updated} games`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

await seedDev();
