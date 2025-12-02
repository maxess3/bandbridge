import prisma from "../src/db/db.config";
import {
  Gender,
  ProfileRole,
  MusicGenre,
  ConcertCount,
  RehearsalFrequency,
  PracticeType,
  InstrumentLevel,
  Platform,
} from "../src/generated/client";

// Données pour générer des profils variés
const firstNames = [
  "Alex",
  "Jordan",
  "Sam",
  "Taylor",
  "Casey",
  "Riley",
  "Quinn",
  "Avery",
  "Morgan",
  "Blake",
  "Cameron",
  "Drew",
  "Emery",
  "Finley",
  "Gray",
  "Harper",
  "Indigo",
  "Jules",
  "Kai",
  "Lane",
  "Mika",
  "Noah",
  "Ocean",
  "Parker",
  "River",
  "Sage",
  "Teagan",
  "Winter",
  "Xander",
  "Zion",
  "Adrian",
  "Bella",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "Gabriel",
  "Hannah",
  "Isaac",
  "Julia",
  "Kevin",
  "Luna",
  "Marcus",
  "Nora",
  "Oliver",
  "Penny",
  "Quentin",
  "Ruby",
  "Sebastian",
  "Tara",
];

const lastNames = [
  "Anderson",
  "Brown",
  "Chen",
  "Davis",
  "Evans",
  "Foster",
  "Garcia",
  "Harris",
  "Ivanov",
  "Johnson",
  "Kim",
  "Lee",
  "Martinez",
  "Nguyen",
  "O'Connor",
  "Patel",
  "Quinn",
  "Rodriguez",
  "Smith",
  "Taylor",
  "Upton",
  "Vargas",
  "Wilson",
  "Xu",
  "Young",
  "Zhang",
  "Adams",
  "Baker",
  "Clark",
  "Edwards",
  "Fisher",
  "Green",
  "Hall",
  "Jackson",
  "King",
  "Lewis",
  "Miller",
  "Nelson",
  "Parker",
  "Roberts",
  "Scott",
  "Thompson",
  "Walker",
  "White",
  "Wood",
  "Allen",
  "Carter",
  "Cooper",
  "Cox",
  "Dixon",
];

const pseudonymes = [
  "JazzMaster",
  "RockStar",
  "BluesSoul",
  "FunkMaster",
  "MetalHead",
  "PopSensation",
  "FolkTale",
  "RapKing",
  "ElectroBeats",
  "ClassicalVirtuoso",
  "GuitarHero",
  "BassSlayer",
  "DrumThunder",
  "PianoMagic",
  "SaxSmooth",
  "TrumpetBlaze",
  "FluteWhisper",
  "ViolinElegance",
  "CelloDeep",
  "HarmonicaBlues",
  "BeatBoxer",
  "VocalPower",
  "SynthWizard",
  "TurntableMaster",
  "AccordionJoy",
  "UkuleleHappiness",
  "MandolinDreams",
  "BanjoRoots",
  "HarpAngelic",
  "TubaBass",
  "RhythmKing",
  "MelodyMaker",
  "HarmonySeeker",
  "GrooveMaster",
  "SoulSinger",
  "RockLegend",
  "JazzCat",
  "BluesMan",
  "FunkBrother",
  "MetalWarrior",
  "PopPrincess",
  "FolkSage",
  "RapQueen",
  "ElectroPrince",
  "ClassicalGenius",
  "GuitarGoddess",
  "BassQueen",
  "DrumGoddess",
  "PianoPrince",
  "SaxGoddess",
];

const cities = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
  "Saint-Étienne",
  "Toulon",
  "Le Havre",
  "Grenoble",
  "Dijon",
  "Angers",
  "Villeurbanne",
  "Le Mans",
  "Aix-en-Provence",
  "Brest",
  "Nîmes",
  "Limoges",
  "Clermont-Ferrand",
  "Tours",
  "Villejuif",
  "Amiens",
  "Perpignan",
  "Metz",
  "Besançon",
  "Boulogne-Billancourt",
  "Orléans",
  "Mulhouse",
  "Rouen",
  "Saint-Denis",
  "Caen",
  "Argenteuil",
  "Saint-Paul",
  "Montreuil",
  "Nancy",
  "Roubaix",
  "Tourcoing",
  "Nanterre",
  "Avignon",
  "Vitry-sur-Seine",
  "Créteil",
  "Dunkerque",
  "Poitiers",
  "Asnières-sur-Seine",
];

const departmentNames = [
  "Ain",
  "Aisne",
  "Allier",
  "Alpes-de-Haute-Provence",
  "Hautes-Alpes",
  "Alpes-Maritimes",
  "Ardèche",
  "Ardennes",
  "Ariège",
  "Aube",
  "Aveyron",
  "Bouches-du-Rhône",
  "Calvados",
  "Cantal",
  "Charente",
  "Charente-Maritime",
  "Cher",
  "Corrèze",
  "Corse-du-Sud",
  "Creuse",
  "Côte-d'Or",
  "Côtes-d'Armor",
  "Doubs",
  "Drôme",
];

const countries = ["France"];

const descriptions = [
  "Passionné de musique depuis mon plus jeune âge, je cherche à créer des connexions musicales authentiques.",
  "Musicien expérimenté avec une approche moderne et innovante de la composition.",
  "Amoureux du jazz et du blues, je cherche des collaborations créatives et stimulantes.",
  "Guitariste autodidacte avec un style unique mélangeant rock et folk.",
  "Batteur énergique cherchant à rejoindre un groupe avec une vision artistique claire.",
  "Pianiste classique avec une passion pour la musique contemporaine.",
  "Bassiste groove qui aime créer des lignes de basse mémorables.",
  "Saxophoniste jazz avec une approche mélodique et harmonique sophistiquée.",
  "Chanteur pop avec une voix distinctive et un sens de la mélodie développé.",
  "Violoniste classique ouvert aux collaborations cross-genres.",
  "DJ électronique spécialisé dans la house et la techno.",
  "Harmoniciste blues avec une approche traditionnelle et authentique.",
  "Accordéoniste folk avec une passion pour la musique traditionnelle.",
  "Ukuléléiste cherchant à apporter de la joie et de la bonne humeur.",
  "Mandoliniste bluegrass avec une technique virtuose.",
  "Banjoïste country avec un style old-time authentique.",
  "Harpiste classique avec une approche contemporaine.",
  "Tubiste orchestral avec une passion pour la musique de chambre.",
  "Flûtiste jazz avec une approche moderne et expérimentale.",
  "Clarinettiste classique ouvert aux collaborations contemporaines.",
];

const socialLinks = [
  { platform: Platform.YOUTUBE, url: "https://youtube.com/@musician" },
  { platform: Platform.INSTAGRAM, url: "https://instagram.com/musician" },
  { platform: Platform.SOUNDCLOUD, url: "https://soundcloud.com/musician" },
  { platform: Platform.TWITTER, url: "https://twitter.com/musician" },
  { platform: Platform.TIKTOK, url: "https://tiktok.com/@musician" },
];

// Fonction pour obtenir un élément aléatoire d'un tableau
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Fonction pour obtenir plusieurs éléments aléatoires d'un tableau
function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Fonction pour générer un profil
async function generateProfile(index: number) {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const pseudonyme =
    pseudonymes[index] ||
    `${firstName}${lastName}${Math.floor(Math.random() * 1000)}`;

  const user = await prisma.user.create({
    data: {
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`,
      firstName,
      lastName,
      username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${index}`,
      gender: getRandomElement([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
      birthDate: new Date(
        1980 + Math.floor(Math.random() * 30),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ),
      password: "$2a$10$dummy.hash.for.seeding", // Hash factice pour le seeding
      verified: Math.random() > 0.3, // 70% des utilisateurs sont vérifiés
    },
  });

  const profile = await prisma.profile.create({
    data: {
      pseudonyme,
      role: getRandomElement([ProfileRole.MUSICIAN, ProfileRole.PROFESSIONAL]),
      description: getRandomElement(descriptions),
      concertsPlayed: getRandomElement([
        ConcertCount.LESS_THAN_10,
        ConcertCount.TEN_TO_FIFTY,
        ConcertCount.FIFTY_TO_HUNDRED,
        ConcertCount.MORE_THAN_HUNDRED,
      ]),
      rehearsalsPerWeek: getRandomElement([
        RehearsalFrequency.ONCE_PER_WEEK,
        RehearsalFrequency.TWO_TO_THREE_PER_WEEK,
        RehearsalFrequency.MORE_THAN_THREE_PER_WEEK,
      ]),
      practiceType: getRandomElement([PracticeType.HOBBY, PracticeType.ACTIVE]),
      isLookingForBand: Math.random() > 0.4, // 60% cherchent un groupe
      country: getRandomElement(countries),
      city: getRandomElement(cities),
      departmentName: getRandomElement(departmentNames),
      zipCode: `${Math.floor(Math.random() * 9) + 1}${
        Math.floor(Math.random() * 9) + 1
      }${Math.floor(Math.random() * 9) + 1}${
        Math.floor(Math.random() * 9) + 1
      }${Math.floor(Math.random() * 9) + 1}`,
      lastActiveAt: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ), // Actif dans les 30 derniers jours
      userId: user.id,
      genres: getRandomElements(
        [
          MusicGenre.ROCK,
          MusicGenre.JAZZ,
          MusicGenre.ELECTRO,
          MusicGenre.POP,
          MusicGenre.FOLK,
          MusicGenre.BLUES,
          MusicGenre.HIP_HOP,
          MusicGenre.RAP,
          MusicGenre.R_AND_B,
          MusicGenre.METAL,
          MusicGenre.PUNK,
          MusicGenre.COUNTRY,
          MusicGenre.REGGAE,
          MusicGenre.FUNK,
          MusicGenre.SOUL,
          MusicGenre.ALTERNATIVE,
          MusicGenre.INDIE,
          MusicGenre.ACOUSTIC,
          MusicGenre.LATINO,
          MusicGenre.CLASSICAL,
          MusicGenre.CELTIC,
          MusicGenre.SKA,
          MusicGenre.LOUNGE,
          MusicGenre.RELIGIOUS,
          MusicGenre.OTHER,
        ],
        Math.floor(Math.random() * 4) + 1
      ),
    },
  });

  // Ajouter des instruments au profil
  const instrumentTypes = await prisma.instrumentType.findMany();
  const selectedInstruments = getRandomElements(
    instrumentTypes,
    Math.floor(Math.random() * 3) + 1
  );

  for (let i = 0; i < selectedInstruments.length; i++) {
    await prisma.instrument.create({
      data: {
        level: getRandomElement([
          InstrumentLevel.BEGINNER,
          InstrumentLevel.INTERMEDIATE,
          InstrumentLevel.ADVANCED,
          InstrumentLevel.EXPERT,
        ]),
        order: i,
        profileId: profile.id,
        instrumentTypeId: selectedInstruments[i].id,
      },
    });
  }

  // Ajouter des liens sociaux
  const selectedSocialLinks = getRandomElements(
    socialLinks,
    Math.floor(Math.random() * 3) + 1
  );
  for (const socialLink of selectedSocialLinks) {
    await prisma.socialLink.create({
      data: {
        platform: socialLink.platform,
        url: socialLink.url.replace(
          "musician",
          `${firstName.toLowerCase()}${lastName.toLowerCase()}${index}`
        ),
        profileId: profile.id,
      },
    });
  }

  // Faire suivre maxess3 par ce profil
  try {
    const maxess3User = await prisma.user.findUnique({
      where: { username: "maxess3" },
      include: { Profile: true },
    });

    if (maxess3User?.Profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          following: {
            connect: { id: maxess3User.Profile.id },
          },
        },
      });
    }
  } catch (error) {
    console.log(
      `⚠️ Could not follow maxess3 for profile ${profile.pseudonyme}: ${error}`
    );
  }

  return { user, profile };
}

async function main() {
  console.log("🌱 Seeding profiles...");

  const numberOfProfiles = 50;
  const createdProfiles: Array<{ user: string; profile: string }> = [];

  for (let i = 0; i < numberOfProfiles; i++) {
    try {
      const { user, profile } = await generateProfile(i);
      createdProfiles.push({
        user: user.username || `user${i}`,
        profile: profile.pseudonyme,
      });
      console.log(
        `✅ Created profile ${i + 1}/${numberOfProfiles}: ${user.username} (${
          profile.pseudonyme
        })`
      );
    } catch (error) {
      console.error(`❌ Error creating profile ${i + 1}:`, error);
    }
  }

  console.log(`\n🎉 Successfully created ${createdProfiles.length} profiles!`);
  console.log("📋 Created profiles:");
  createdProfiles.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.user} (${p.profile})`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding profiles:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
