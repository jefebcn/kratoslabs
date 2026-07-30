import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Email non valida"),
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
