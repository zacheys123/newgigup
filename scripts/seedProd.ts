// scripts/seedProdInitial.ts

import connectDb from "@/lib/connectDb";
import { ALL_GAME_CONFIGS } from "./sharedConfigs";
import { Game } from "@/models/game";

async function seedProd() {
  // 1. Verify production environment
  if (process.env.NODE_ENV !== "production") {
    throw new Error("This script can only run in production");
  }

  // 2. Connect using production credentials
  await connectDb;

  // 3. Prepare bulk operations
  const operations = Object.values(ALL_GAME_CONFIGS)
    .flat()
    .map((game) => ({
      updateOne: {
        filter: { slug: game.slug },
        update: {
          $setOnInsert: {
            ...game,
            createdAt: new Date(),
            isInitialSeed: true,
          },
        },
        upsert: true,
      },
    }));

  // 4. Execute as single atomic operation
  const result = await Game.bulkWrite(operations);

  console.log(`
    Production seeding complete:
    - Games seeded: ${result.upsertedCount}
    - Existing games preserved: ${result.matchedCount}
  `);
}

// Execute with error handling
seedProd()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Initial seeding failed:", err);
    process.exit(1);
  });
