import { z } from 'zod';

export const updateStatusSchema = z.object({
    status: z.enum(['pending', 'signed', 'expired', 'cancelled']),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
