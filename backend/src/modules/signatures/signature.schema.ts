import { z } from 'zod';

export const placeSignatureSchema = z.object({
    document_id: z.string().uuid(),
    signer_email: z.string().email(),
    signer_name: z.string().optional(),
    position_x: z.number(),
    position_y: z.number(),
    width: z.number().default(150),
    height: z.number().default(50),
    page_number: z.number().int().positive().default(1),
    signature_image_url: z.string().url().optional(),
});

export const finalizeSignatureSchema = z.object({
    document_id: z.string().uuid(),
});

export type PlaceSignatureInput = z.infer<typeof placeSignatureSchema>;
export type FinalizeSignatureInput = z.infer<typeof finalizeSignatureSchema>;
