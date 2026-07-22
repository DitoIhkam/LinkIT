import { z } from "zod";

export const createTransactionSchema = z.object({
    coffeeId: z.number({
        required_error: "coffeeId wajib diisi"
    }),

    qty: z.number({
        required_error: "qty wajib diisi"
    }).min(1, "qty minimal 1"),

    notes: z.string().optional()
});

export const updateTransactionSchema = z.object({
    qty: z.number().min(1, "qty minimal 1").optional(),

    notes: z.string().optional()
});
