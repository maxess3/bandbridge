import z from "zod";

export const formCreateBandSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du groupe est requis")
    .max(60, "Le nom du groupe ne doit pas dépasser 60 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\-' ]+$/,
      "Le nom du groupe ne doit contenir que des lettres, chiffres, tirets et espaces"
    ),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .max(20, "Le slug ne doit pas dépasser 20 caractères"),
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
      }
    ),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(255, "La description ne doit pas dépasser 255 caractères"),
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
      "La ville ne doit contenir que des lettres et tirets"
    ),
});
