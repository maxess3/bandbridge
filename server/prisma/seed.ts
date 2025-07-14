import { PrismaClient, InstrumentCategory } from "@prisma/client";

const prisma = new PrismaClient();

const instruments = [
	// Strings
	{ name: "Guitar", category: InstrumentCategory.STRINGS },
	{ name: "Electric Guitar", category: InstrumentCategory.STRINGS },
	{ name: "Bass Guitar", category: InstrumentCategory.STRINGS },
	{ name: "Violin", category: InstrumentCategory.STRINGS },
	{ name: "Cello", category: InstrumentCategory.STRINGS },
	{ name: "Double Bass", category: InstrumentCategory.STRINGS },
	{ name: "Ukulele", category: InstrumentCategory.STRINGS },
	{ name: "Mandolin", category: InstrumentCategory.STRINGS },
	{ name: "Banjo", category: InstrumentCategory.STRINGS },
	{ name: "Harp", category: InstrumentCategory.STRINGS },

	// Wind
	{ name: "Saxophone", category: InstrumentCategory.WIND },
	{ name: "Trumpet", category: InstrumentCategory.WIND },
	{ name: "Trombone", category: InstrumentCategory.WIND },
	{ name: "Flute", category: InstrumentCategory.WIND },
	{ name: "Clarinet", category: InstrumentCategory.WIND },
	{ name: "Oboe", category: InstrumentCategory.WIND },
	{ name: "Bassoon", category: InstrumentCategory.WIND },
	{ name: "Harmonica", category: InstrumentCategory.WIND },
	{ name: "Accordion", category: InstrumentCategory.WIND },
	{ name: "Tuba", category: InstrumentCategory.WIND },

	// Percussion
	{ name: "Drums", category: InstrumentCategory.PERCUSSION },
	{ name: "Snare Drum", category: InstrumentCategory.PERCUSSION },
	{ name: "Bass Drum", category: InstrumentCategory.PERCUSSION },
	{ name: "Cymbals", category: InstrumentCategory.PERCUSSION },
	{ name: "Tom-toms", category: InstrumentCategory.PERCUSSION },
	{ name: "Congas", category: InstrumentCategory.PERCUSSION },
	{ name: "Bongos", category: InstrumentCategory.PERCUSSION },
	{ name: "Djembe", category: InstrumentCategory.PERCUSSION },
	{ name: "Tambourine", category: InstrumentCategory.PERCUSSION },
	{ name: "Xylophone", category: InstrumentCategory.PERCUSSION },
	{ name: "Marimba", category: InstrumentCategory.PERCUSSION },

	// Keyboard
	{ name: "Piano", category: InstrumentCategory.KEYBOARD },
	{ name: "Electric Piano", category: InstrumentCategory.KEYBOARD },
	{ name: "Keyboard", category: InstrumentCategory.KEYBOARD },
	{ name: "Organ", category: InstrumentCategory.KEYBOARD },
	{ name: "Harpsichord", category: InstrumentCategory.KEYBOARD },

	// Electronic
	{ name: "Synthesizer", category: InstrumentCategory.ELECTRONIC },
	{ name: "Workstation", category: InstrumentCategory.ELECTRONIC },
	{ name: "Drum Machine", category: InstrumentCategory.ELECTRONIC },
	{ name: "Sampler", category: InstrumentCategory.ELECTRONIC },
	{ name: "MIDI Controller", category: InstrumentCategory.ELECTRONIC },

	// Other
	{ name: "Voice", category: InstrumentCategory.OTHER },
	{ name: "Beatbox", category: InstrumentCategory.OTHER },
	{ name: "Theremin", category: InstrumentCategory.OTHER },
	{ name: "Ondes Martenot", category: InstrumentCategory.OTHER },
];

async function main() {
	console.log("🌱 Seeding instruments...");

	for (const instrument of instruments) {
		await prisma.instrumentType.upsert({
			where: { name: instrument.name },
			update: {},
			create: {
				name: instrument.name,
				category: instrument.category,
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
