// Traductions des instruments de musique
export const instrumentTranslations: Record<string, string> = {
	// Cordes (Strings)
	Guitar: "Guitare",
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
	"Snare Drum": "Caisse claire",
	"Bass Drum": "Grosse caisse",
	Cymbals: "Cymbales",
	"Tom-toms": "Toms",
	Congas: "Congas",
	Bongos: "Bongos",
	Djembe: "Djembe",
	Tambourine: "Tambourin",
	Xylophone: "Xylophone",
	Marimba: "Marimba",

	// Claviers (Keyboard)
	Piano: "Piano",
	"Electric Piano": "Piano électrique",
	Keyboard: "Clavier",
	Organ: "Orgue",
	Harpsichord: "Clavecin",

	// Électroniques (Electronic)
	Synthesizer: "Synthétiseur",
	Workstation: "Workstation",
	"Drum Machine": "Boîte à rythmes",
	Sampler: "Échantillonneur",
	"MIDI Controller": "Contrôleur MIDI",

	// Autres (Other)
	Voice: "Voix",
	Beatbox: "Beatbox",
	Theremin: "Thérémine",
	"Ondes Martenot": "Ondes Martenot",
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

// Fonction utilitaire pour traduire une catégorie
export const translateCategory = (category: string): string => {
	return categoryTranslations[category] || category;
};
