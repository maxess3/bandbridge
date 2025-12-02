import prisma from "../src/db/db.config";
import { InstrumentCategory } from "../src/generated/client";

const instruments = [
  // Strings
  {
    name: "Classical Guitar",
    category: InstrumentCategory.STRINGS,
    profession: "Guitarist",
  },
  {
    name: "Acoustic Guitar",
    category: InstrumentCategory.STRINGS,
    profession: "Guitarist",
  },
  {
    name: "Electric Guitar",
    category: InstrumentCategory.STRINGS,
    profession: "Guitarist",
  },
  {
    name: "Bass Guitar",
    category: InstrumentCategory.STRINGS,
    profession: "Bassist",
  },
  {
    name: "Violin",
    category: InstrumentCategory.STRINGS,
    profession: "Violinist",
  },
  {
    name: "Cello",
    category: InstrumentCategory.STRINGS,
    profession: "Cellist",
  },
  {
    name: "Double Bass",
    category: InstrumentCategory.STRINGS,
    profession: "Double Bassist",
  },
  {
    name: "Ukulele",
    category: InstrumentCategory.STRINGS,
    profession: "Ukulele Player",
  },
  {
    name: "Mandolin",
    category: InstrumentCategory.STRINGS,
    profession: "Mandolinist",
  },
  {
    name: "Banjo",
    category: InstrumentCategory.STRINGS,
    profession: "Banjo Player",
  },
  { name: "Harp", category: InstrumentCategory.STRINGS, profession: "Harpist" },

  // Wind
  {
    name: "Saxophone",
    category: InstrumentCategory.WIND,
    profession: "Saxophonist",
  },
  {
    name: "Trumpet",
    category: InstrumentCategory.WIND,
    profession: "Trumpeter",
  },
  {
    name: "Trombone",
    category: InstrumentCategory.WIND,
    profession: "Trombonist",
  },
  { name: "Flute", category: InstrumentCategory.WIND, profession: "Flutist" },
  {
    name: "Clarinet",
    category: InstrumentCategory.WIND,
    profession: "Clarinetist",
  },
  { name: "Oboe", category: InstrumentCategory.WIND, profession: "Oboist" },
  {
    name: "Bassoon",
    category: InstrumentCategory.WIND,
    profession: "Bassoonist",
  },
  {
    name: "Harmonica",
    category: InstrumentCategory.WIND,
    profession: "Harmonica Player",
  },
  {
    name: "Accordion",
    category: InstrumentCategory.WIND,
    profession: "Accordionist",
  },
  { name: "Tuba", category: InstrumentCategory.WIND, profession: "Tubist" },

  // Percussion
  {
    name: "Drums",
    category: InstrumentCategory.PERCUSSION,
    profession: "Drummer",
  },
  {
    name: "Xylophone",
    category: InstrumentCategory.PERCUSSION,
    profession: "Xylophonist",
  },

  // Keyboard
  {
    name: "Piano",
    category: InstrumentCategory.KEYBOARD,
    profession: "Pianist",
  },
  {
    name: "Organ",
    category: InstrumentCategory.KEYBOARD,
    profession: "Organist",
  },
  {
    name: "Harpsichord",
    category: InstrumentCategory.KEYBOARD,
    profession: "Harpsichordist",
  },

  // Electronic
  {
    name: "Synthesizer",
    category: InstrumentCategory.ELECTRONIC,
    profession: "Synthesizer Player",
  },
  {
    name: "Workstation",
    category: InstrumentCategory.ELECTRONIC,
    profession: "Workstation Player",
  },
  {
    name: "Drum Machine",
    category: InstrumentCategory.ELECTRONIC,
    profession: "Drum Machine Operator",
  },
  {
    name: "Turntable",
    category: InstrumentCategory.ELECTRONIC,
    profession: "DJ",
  },

  // Other
  { name: "Voice", category: InstrumentCategory.OTHER, profession: "Singer" },
  {
    name: "Beatbox",
    category: InstrumentCategory.OTHER,
    profession: "Beatboxer",
  },
  {
    name: "Theremin",
    category: InstrumentCategory.OTHER,
    profession: "Thereminist",
  },
];

async function main() {
  console.log("🌱 Seeding instruments...");

  for (const instrument of instruments) {
    await prisma.instrumentType.upsert({
      where: { name: instrument.name },
      update: {
        profession: instrument.profession,
      },
      create: {
        name: instrument.name,
        category: instrument.category,
        profession: instrument.profession,
        isActive: true,
      },
    });
  }

  console.log("✅ Instruments seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding instruments:", e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
