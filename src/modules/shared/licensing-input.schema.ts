import { z } from 'zod';

export const licensingInputSchema = z.object({
  business: z.string().describe(
    'Type of business (any sector), e.g. "restaurant", "pharmacy", "hotel", "school", "manufacturing unit", "retail shop", "IT startup", "salon", "gym"'
  ),
  location: z.string().describe('City or district in Kerala, e.g. "Kochi", "Kozhikode", "Thiruvananthapuram"')
});

export type LicensingInput = z.infer<typeof licensingInputSchema>;
