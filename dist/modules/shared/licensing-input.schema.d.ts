import { z } from 'zod';
export declare const licensingInputSchema: z.ZodObject<{
    business: z.ZodString;
    location: z.ZodString;
}, "strip", z.ZodTypeAny, {
    business: string;
    location: string;
}, {
    business: string;
    location: string;
}>;
export type LicensingInput = z.infer<typeof licensingInputSchema>;
//# sourceMappingURL=licensing-input.schema.d.ts.map