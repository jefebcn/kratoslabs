import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Email non valida"),
  // Richiesto dal corriere e dal foglio ordini del fornitore. Accetta i
  // formati comuni (+39 333 123 4567, 0039-333…, (06) 1234567) purché ci
  // siano almeno 6 cifre.
  phone: z
    .string()
    .trim()
    .max(30, "Numero di telefono non valido")
    .refine(
      (v) => /^[+\d\s().\-/]+$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 6,
      "Numero di telefono non valido",
    ),
  firstName: z.string().min(1, "Campo obbligatorio"),
  lastName: z.string().min(1, "Campo obbligatorio"),
  address: z.string().min(1, "Campo obbligatorio"),
  city: z.string().min(1, "Campo obbligatorio"),
  postalCode: z.string().min(3, "CAP non valido"),
  country: z.string().min(1, "Campo obbligatorio"),
  paymentMethod: z.enum(["cards", "paypal", "bank", "crypto"]),
  notes: z.string().max(500).optional(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
