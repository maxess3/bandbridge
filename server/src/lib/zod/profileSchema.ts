import z from "zod";

/**
 * Profile-related schemas for instruments, profile editing, and search.
 */

/**
 * Schema for instrument selection in profile.
 */
export const instrumentSchema = z.object({
  instrumentTypeId: z.string().min(1, "L'instrument est requis"),
  level: z
    .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"], {
      error: () => "Merci de sélectionner un niveau",
    })
    .nullable(),
  order: z.number().min(0, "L'ordre doit être d'au moins 0").optional(),
});

/**
 * Schema for general profile information (pseudonyme, location, instruments, genres).
 * Validates that instruments and genres don't have duplicates.
 */
export const formGeneralProfile = z.object({
  pseudonyme: z
    .string()
    .min(1, "Le pseudonyme est requis")
    .max(60, "Le pseudonyme ne doit pas dépasser 60 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\-' ]+$/,
      "Le pseudonyme ne doit contenir que des lettres, chiffres, tirets et espaces",
    ),
  country: z.enum(["France"], {
      error: () => "L'application est disponible en france uniquement",
    }),
  zipcode: z
    .string()
    .min(1, "Le code postal est requis")
    .regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres"),
  city: z
    .string()
    .min(1, "La ville est requise")
    .max(50, "La ville ne doit pas dépasser 50 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ\-']+$/,
      "La ville ne doit contenir que des lettres et tirets",
    ),
  instruments: z
    .array(instrumentSchema)
    .min(0, "Le nombre d'instruments ne peut pas être négatif")
    .max(10, "Vous ne pouvez pas ajouter plus de 10 instruments")
    .refine(
      (instruments) => {
        // Check for duplicate instruments
        const instrumentIds = instruments
          .filter((instrument) => instrument.instrumentTypeId) // Filter empty instruments
          .map((instrument) => instrument.instrumentTypeId);
        const uniqueIds = new Set(instrumentIds);
        return uniqueIds.size === instrumentIds.length;
      },
      {
        error: "Vous ne pouvez pas ajouter le même instrument plusieurs fois",
      },
    ),
  genres: z
    .array(z.string())
    .min(0, "Le nombre de genres ne peut pas être négatif")
    .max(10, "Vous ne pouvez pas ajouter plus de 10 genres")
    .refine(
      (genres) => {
        // Check for duplicate genres
        const uniqueGenres = new Set(genres);
        return uniqueGenres.size === genres.length;
      },
      {
        error: "Vous ne pouvez pas ajouter le même genre plusieurs fois",
      },
    ),
});

/**
 * Schema for profile information (description, concerts, rehearsals, practice type, social links).
 */
export const formInfoProfile = z.object({
  description: z
    .string()
    .max(2600, "La description ne doit pas dépasser 2600 caractères")
    .transform((val) => {
      // Clean multiple line breaks (2 or more) into a single line break
      return val ? val.replace(/\n{3,}/g, "\n") : val;
    })
    .optional(),
  concertsPlayed: z.enum(
    [
      "NOT_SPECIFIED",
      "LESS_THAN_10",
      "TEN_TO_FIFTY",
      "FIFTY_TO_HUNDRED",
      "MORE_THAN_HUNDRED",
    ],
    {
      error: () => "Merci de sélectionner une option",
    },
  ),
  rehearsalsPerWeek: z.enum(
    [
      "NOT_SPECIFIED",
      "ONCE_PER_WEEK",
      "TWO_TO_THREE_PER_WEEK",
      "MORE_THAN_THREE_PER_WEEK",
    ],
    {
      error: () => "Merci de sélectionner une option",
    },
  ),
  practiceType: z.enum(["NOT_SPECIFIED", "HOBBY", "ACTIVE"], {
    error: () => "Merci de sélectionner une option",
  }),
  isLookingForBand: z.boolean(),
  youtube: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.startsWith("https://www.youtube.com/"),
      'L\'URL doit commencer par "https://www.youtube.com/"',
    ),
  instagram: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.startsWith("https://www.instagram.com/"),
      'L\'URL doit commencer par "https://www.instagram.com/"',
    ),
  tiktok: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.startsWith("https://www.tiktok.com/"),
      'L\'URL doit commencer par "https://www.tiktok.com/"',
    ),
  twitter: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.startsWith("https://x.com/"),
      'L\'URL doit commencer par "https://x.com/"',
    ),
  soundcloud: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.startsWith("https://soundcloud.com/"),
      'L\'URL doit commencer par "https://soundcloud.com/"',
    ),
});

/**
 * Schema for profile picture upload.
 * Validates that the file is an image and is less than 5MB.
 */
export const formProfilePicture = z.object({
  profilePicture: z
    .instanceof(File, {
      error: "Le fichier est requis",
    })
    .refine((file) => file.type.startsWith("image/"), {
      error: "Le fichier doit être une image",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      error: "L'image ne doit pas dépasser 5 Mo",
    })
    .refine(
      (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        return allowedTypes.includes(file.type);
      },
      {
        error: "Format d'image non supporté (JPEG, PNG, WebP uniquement)",
      },
    ),
});

/**
 * Schema for autocomplete search query parameters.
 */
export const searchAutocompleteSchema = z.object({
  q: z
    .string()
    .min(1, "La recherche doit contenir au moins 1 caractère")
    .max(100, "La recherche ne doit pas dépasser 100 caractères")
    .trim(),
});

/**
 * Schema for search query parameters with pagination support.
 * Note: limit is fixed at 24 on the server side and cannot be modified by users.
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, "La recherche doit contenir au moins 1 caractère")
    .max(100, "La recherche ne doit pas dépasser 100 caractères")
    .trim(),
  page: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 1;
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1) return 1;
      return num > 100 ? 100 : num;
    }),
});

/**
 * Schema for all profiles query parameters with pagination support.
 * Used for the public route GET /api/profile/all (no search query required).
 * Note: limit is fixed at 24 on the server side and cannot be modified by users.
 */
export const allProfilesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 1;
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1) return 1;
      return num > 100 ? 100 : num;
    }),
});
