import { db } from "./db";
import { spiritualTasks, products } from "@shared/schema";

export async function seedInitialData() {
  // Check if data already exists
  const existingTasks = await db.select().from(spiritualTasks);
  const existingProducts = await db.select().from(products);
  
  if (existingTasks.length === 0) {
    // Seed spiritual tasks
    await db.insert(spiritualTasks).values([
      {
        title: "Chant Hare Krishna Maha-mantra",
        description: "Chant the holy names of the Lord for spiritual purification",
        category: "chanting",
        defaultTarget: 16,
        unit: "rounds",
      },
      {
        title: "Read Bhagavad Gita",
        description: "Study Krishna's teachings in the Bhagavad Gita",
        category: "reading",
        defaultTarget: 1,
        unit: "chapters",
      },
      {
        title: "Morning Meditation",
        description: "Start your day with peaceful meditation and prayer",
        category: "meditation",
        defaultTarget: 20,
        unit: "minutes",
      },
      {
        title: "Visit Temple",
        description: "Participate in temple darshan and community worship",
        category: "service",
        defaultTarget: 1,
        unit: "times",
      },
      {
        title: "Offer Food to Krishna",
        description: "Prepare and offer meals to the Supreme Lord",
        category: "service",
        defaultTarget: 3,
        unit: "times",
      },
      {
        title: "Evening Prayers",
        description: "End your day with gratitude and spiritual reflection",
        category: "meditation",
        defaultTarget: 15,
        unit: "minutes",
      },
    ]);
    console.log("Spiritual tasks seeded successfully!");
  }
  
  if (existingProducts.length === 0) {
    // Seed products
    await db.insert(products).values([
      {
        tier: "tier1",
        title: "Divine Essentials",
        description: "Perfect for beginners starting their spiritual journey",
        price: "1299.00",
        originalPrice: "1699.00",
        features: [
          { name: "Sacred Brass Diya", included: true },
          { name: "Tulsi Mala (108 beads)", included: true },
          { name: "Pocket Bhagavad Gita", included: true },
          { name: "Sandalwood Incense (10 sticks)", included: true },
          { name: "Kumkum & Chandan", included: true },
          { name: "Temple Prasadam", included: false },
          { name: "Course Access", included: false },
        ],
        popular: false,
        active: true,
      },
      {
        tier: "tier2",
        title: "Premium Blessings",
        description: "Enhanced collection for deeper devotional practice",
        price: "2499.00",
        originalPrice: "3299.00",
        features: [
          { name: "Sacred Brass Diya", included: true },
          { name: "Tulsi Mala (108 beads)", included: true },
          { name: "Complete Bhagavad Gita", included: true },
          { name: "Sandalwood Incense (25 sticks)", included: true },
          { name: "Kumkum & Chandan", included: true },
          { name: "Rudraksha Beads", included: true },
          { name: "Temple Prasadam", included: true },
          { name: "Basic Course Access", included: false },
        ],
        popular: true,
        active: true,
      },
      {
        tier: "tier3",
        title: "Exclusive Grace",
        description: "Complete devotional package for serious practitioners",
        price: "4999.00",
        originalPrice: "6999.00",
        features: [
          { name: "Sacred Brass Diya Set", included: true },
          { name: "Premium Tulsi Mala", included: true },
          { name: "Illustrated Bhagavad Gita", included: true },
          { name: "Sandalwood Incense (50 sticks)", included: true },
          { name: "Premium Kumkum & Chandan", included: true },
          { name: "Rudraksha Mala", included: true },
          { name: "Temple Prasadam", included: true },
          { name: "Full Course Access", included: true },
          { name: "Monthly Spiritual Guidance", included: true },
        ],
        popular: false,
        active: true,
      },
    ]);
    console.log("Products seeded successfully!");
  }
}