import { z } from "zod";
import { formGeneralProfile } from "@/lib/zod";

export type FormValues = z.infer<typeof formGeneralProfile>;

export interface UpdateProfileGeneralFormProps {
  instrumentTypes: import("@/types/Instrument").GroupedInstruments;
  musicGenres: string[];
  isLoadingInstruments: boolean;
  isLoadingGenres: boolean;
}
