"use client";

import { useFormContext } from "react-hook-form";
import { formSocialProfile } from "@/lib/schema";
import { z } from "zod";

type FormValues = z.infer<typeof formSocialProfile>;

export const UpdateProfilePictureForm = () => {
	const {
		register, // eslint-disable-line @typescript-eslint/no-unused-vars
		formState: { errors }, // eslint-disable-line @typescript-eslint/no-unused-vars
	} = useFormContext<FormValues>();

	return <div className="space-y-6"></div>;
};
