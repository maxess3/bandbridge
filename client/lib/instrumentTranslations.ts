// Traductions des instruments de musique
export const instrumentTranslations: Record<string, string> = {
  // Cordes (Strings)
  "Classical Guitar": "Guitare classique",
  "Acoustic Guitar": "Guitare acoustique",
  "Electric Guitar": "Guitare électrique",
  "Bass Guitar": "Guitare basse",
  Violin: "Violon",
  Cello: "Violoncelle",
  "Double Bass": "Contrebasse",
  Ukulele: "Ukulélé",
  Mandolin: "Mandoline",
  Banjo: "Banjo",
  Harp: "Harpe",

  // Vents (Wind)
  Saxophone: "Saxophone",
  Trumpet: "Trompette",
  Trombone: "Trombone",
  Flute: "Flûte",
  Clarinet: "Clarinette",
  Oboe: "Hautbois",
  Bassoon: "Basson",
  Harmonica: "Harmonica",
  Accordion: "Accordéon",
  Tuba: "Tuba",

  // Percussions (Percussion)
  Drums: "Batterie",
  Xylophone: "Xylophone",

  // Claviers (Keyboard)
  Piano: "Piano",
  Organ: "Orgue",
  Harpsichord: "Clavecin",

  // Électroniques (Electronic)
  Synthesizer: "Synthétiseur",
  Workstation: "Workstation",
  "Drum Machine": "Boîte à rythmes",
  Turntable: "Platine de DJ",

  // Autres (Other)
  Voice: "Voix",
  Beatbox: "Beatbox",
  Theremin: "Thérémine",
};

// Traductions des professions liées aux instruments
export const professionTranslations: Record<string, string> = {
  // Cordes (Strings)
  Guitarist: "Guitariste",
  "Acoustic Guitarist": "Guitariste",
  "Electric Guitarist": "Guitariste",
  Bassist: "Bassiste",
  Violinist: "Violoniste",
  Cellist: "Violoncelliste",
  "Double Bassist": "Contrebassiste",
  "Ukulele Player": "Joueur de ukulélé",
  Mandolinist: "Mandoliniste",
  "Banjo Player": "Joueur de banjo",
  Harpist: "Harpiste",

  // Vents (Wind)
  Saxophonist: "Saxophoniste",
  Trumpeter: "Trompettiste",
  Trombonist: "Tromboniste",
  Flutist: "Flûtiste",
  Clarinetist: "Clarinettiste",
  Oboist: "Hautboïste",
  Bassoonist: "Bassoniste",
  "Harmonica Player": "Joueur d'harmonica",
  Accordionist: "Accordéoniste",
  Tubist: "Tubiste",

  // Percussions (Percussion)
  Drummer: "Batteur",
  Xylophonist: "Xylophoniste",

  // Claviers (Keyboard)
  Pianist: "Pianiste",
  Organist: "Organiste",
  Harpsichordist: "Claveciniste",

  // Électroniques (Electronic)
  "Synthesizer Player": "Joueur de synthétiseur",
  "Workstation Player": "Joueur de workstation",
  "Drum Machine Operator": "Opérateur de boîte à rythmes",
  DJ: "DJ",

  // Autres (Other)
  Singer: "Chanteur",
  Beatboxer: "Beatboxeur",
  Thereminist: "Théréministe",
};

// Traductions des catégories d'instruments
export const categoryTranslations: Record<string, string> = {
  STRINGS: "Cordes",
  WIND: "Vents",
  PERCUSSION: "Percussions",
  KEYBOARD: "Claviers",
  ELECTRONIC: "Électroniques",
  OTHER: "Autres",
};

// Fonction utilitaire pour traduire un nom d'instrument
export const translateInstrument = (name: string): string => {
  return instrumentTranslations[name] || name;
};

// Fonction utilitaire pour traduire une profession
export const translateProfession = (profession: string): string => {
  return professionTranslations[profession] || profession;
};

// Fonction utilitaire pour traduire une catégorie
export const translateCategory = (category: string): string => {
  return categoryTranslations[category] || category;
};
