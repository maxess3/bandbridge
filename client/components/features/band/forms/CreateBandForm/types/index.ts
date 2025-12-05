import { z } from "zod";
import { formCreateBandSchema } from "@/lib/zod";

export type CreateBandFormValues = z.infer<typeof formCreateBandSchema>;
