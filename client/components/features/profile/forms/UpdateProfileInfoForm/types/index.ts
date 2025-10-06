import { z } from "zod";
import { formInfoProfile } from "@/lib/zod";

export type FormValues = z.infer<typeof formInfoProfile>;
