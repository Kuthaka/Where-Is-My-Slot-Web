import { z } from 'zod';

export const SetLocationDtoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  latitude: z.number(),
  longitude: z.number(),
});

export type SetLocationDto = z.infer<typeof SetLocationDtoSchema>;
