import { z } from "zod";


export const SearchSchema = z.object({

    region: z.string().optional(),

    type: z.string().optional(),

    keywords: z.array(
        z.string()
    ).optional()

});