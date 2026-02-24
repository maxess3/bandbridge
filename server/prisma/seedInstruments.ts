import prisma from "../src/db/db.config";
import { InstrumentCategory } from "../src/generated/client";

const instruments: Array<{
  name: string;
  category: (typeof InstrumentCategory)[keyof typeof InstrumentCategory];
  roleName: string;
}> = [
  // Strings
  { name: "Classical Guitar", category: InstrumentCategory.STRINGS, roleName: "Guitarist" },
  { name: "Acoustic Guitar", category: InstrumentCategory.STRINGS, roleName: "Guitarist" },
  { name: "Electric Guitar", category: InstrumentCategory.STRINGS, roleName: "Guitarist" },
  { name: "Bass Guitar", category: InstrumentCategory.STRINGS, roleName: "Bassist" },
  { name: "Violin", category: InstrumentCategory.STRINGS, roleName: "Violinist" },
  { name: "Cello", category: InstrumentCategory.STRINGS, roleName: "Cellist" },
  { name: "Double Bass", category: InstrumentCategory.STRINGS, roleName: "Double Bassist" },
  { name: "Ukulele", category: InstrumentCategory.STRINGS, roleName: "Ukulele Player" },
  { name: "Mandolin", category: InstrumentCategory.STRINGS, roleName: "Mandolinist" },
  { name: "Banjo", category: InstrumentCategory.STRINGS, roleName: "Banjo Player" },
  { name: "Harp", category: InstrumentCategory.STRINGS, roleName: "Harpist" },

  // Wind
  { name: "Saxophone", category: InstrumentCategory.WIND, roleName: "Saxophonist" },
  { name: "Trumpet", category: InstrumentCategory.WIND, roleName: "Trumpeter" },
  { name: "Trombone", category: InstrumentCategory.WIND, roleName: "Trombonist" },
  { name: "Flute", category: InstrumentCategory.WIND, roleName: "Flutist" },
  { name: "Clarinet", category: InstrumentCategory.WIND, roleName: "Clarinetist" },
  { name: "Oboe", category: InstrumentCategory.WIND, roleName: "Oboist" },
  { name: "Bassoon", category: InstrumentCategory.WIND, roleName: "Bassoonist" },
  { name: "Harmonica", category: InstrumentCategory.WIND, roleName: "Harmonica Player" },
  { name: "Accordion", category: InstrumentCategory.WIND, roleName: "Accordionist" },
  { name: "Tuba", category: InstrumentCategory.WIND, roleName: "Tubist" },

  // Percussion
  { name: "Drums", category: InstrumentCategory.PERCUSSION, roleName: "Drummer" },
  { name: "Xylophone", category: InstrumentCategory.PERCUSSION, roleName: "Xylophonist" },

  // Keyboard
  { name: "Piano", category: InstrumentCategory.KEYBOARD, roleName: "Pianist" },
  { name: "Organ", category: InstrumentCategory.KEYBOARD, roleName: "Organist" },
  { name: "Harpsichord", category: InstrumentCategory.KEYBOARD, roleName: "Harpsichordist" },

  // Electronic
  { name: "Synthesizer", category: InstrumentCategory.ELECTRONIC, roleName: "Synthesizer Player" },
  { name: "Workstation", category: InstrumentCategory.ELECTRONIC, roleName: "Workstation Player" },
  { name: "Drum Machine", category: InstrumentCategory.ELECTRONIC, roleName: "Drum Machine Operator" },
  { name: "Turntable", category: InstrumentCategory.ELECTRONIC, roleName: "DJ" },

  // Other
  { name: "Voice", category: InstrumentCategory.OTHER, roleName: "Singer" },
  { name: "Beatbox", category: InstrumentCategory.OTHER, roleName: "Beatboxer" },
  { name: "Theremin", category: InstrumentCategory.OTHER, roleName: "Thereminist" },
];

async function main() {
  console.log("🌱 Seeding roles and instruments...");

  // Pass 1: Create or upsert Role for each distinct roleName
  const roleNames = [
    ...new Set(instruments.map((i) => i.roleName)),
  ];
  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Pass 2: Create or upsert InstrumentType with roleId
  for (const instrument of instruments) {
    const role = await prisma.role.findUnique({
      where: { name: instrument.roleName },
    });
    await prisma.instrumentType.upsert({
      where: { name: instrument.name },
      update: {
        roleId: role?.id ?? undefined,
      },
      create: {
        name: instrument.name,
        category: instrument.category,
        roleId: role?.id ?? undefined,
        isActive: true,
      },
    });
  }

  console.log("✅ Roles and instruments seeded successfully!");
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
