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
  stock: z.coerce.number().int().nonnegative("Stock non valido"),
  // Campi tecnici specifici del dominio.
  activeName: z.string().min(1, "Campo obbligatorio"),
  activePerServingG: z.coerce.number().positive("Dosaggio non valido"),
  servingSizeG: z.coerce.number().positive("Valore non valido"),
  servingsPerContainer: z.coerce.number().int().positive("Valore non valido"),
  netWeightG: z.coerce.number().positive("Valore non valido"),
  featured: z.coerce.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  trackingId: z.string().optional(),
});
