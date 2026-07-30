import { z } from "zod";

/**
 * Schema del form prodotto dell'admin. Include i campi tecnici richiesti dal
 * dominio integratori: dosaggio dichiarato, porzioni, principio attivo, brand.
 */
export const productFormSchema = z.object({
  title: z.string().min(2, "Minimo 2 caratteri"),
  brand: z.string().min(1, "Campo obbligatorio"),
  slug: z.string().min(1, "Campo obbligatorio"),
  // Slug categoria libero: permette anche categorie create dall'admin.
  category: z.string().min(1, "Categoria obbligatoria"),
  shortDescription: z.string().min(1, "Campo obbligatorio").max(160),
  description: z.string().min(1, "Campo obbligatorio"),
  priceCents: z.coerce.number().int().positive("Prezzo non valido"),
  compareAtPriceCents: z.coerce.number().int().nonnegative().optional(),
  costCents: z.coerce.number().int().nonnegative("Costo non valido").optional(),
  stock: z.coerce.number().int().nonnegative("Stock non valido"),
  // Campi tecnici (opzionali: non tutti i prodotti hanno "porzioni").
  activeName: z.string().optional(),
  activePerServingG: z.coerce.number().nonnegative("Valore non valido").optional(),
  servingSizeG: z.coerce.number().nonnegative("Valore non valido").optional(),
  servingsPerContainer: z.coerce
    .number()
    .int()
    .nonnegative("Valore non valido")
    .optional(),
  netWeightG: z.coerce.number().nonnegative("Valore non valido").optional(),
  featured: z.coerce.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
