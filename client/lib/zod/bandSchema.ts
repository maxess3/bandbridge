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
  country: z
    .string()
    .min(1, "Le pays est requis")
    .max(60, "Le pays ne doit pas dépasser 60 caractères"),
  city: z
    .string()
    .min(1, "La ville est requise")
    .max(60, "La ville ne doit pas dépasser 60 caractères"),
  zipCode: z
    .string()
    .min(1, "Le code postal est requis")
    .max(10, "Le code postal ne doit pas dépasser 10 caractères"),
  departmentName: z
    .string()
    .min(1, "Le département est requise")
    .max(60, "Le département ne doit pas dépasser 60 caractères"),
});
