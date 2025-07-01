"use client";

import { useFormContext } from "react-hook-form";
import { formInfoProfile } from "@/lib/schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";

type FormValues = z.infer<typeof formInfoProfile>;

export const UpdateProfileInfoForm = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<FormValues>();

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label
					htmlFor="description"
					className="opacity-80 flex items-center text-sm"
				>
					Vous pouvez évoquer votre expérience, votre domaine d’activité ou vos
					compétences.
				</Label>
				<Textarea
					id="description"
					{...register("description")}
					className={`bg-transparent text-base md:text-base min-h-[220px] ${
						errors.description && "border-red-500"
					}`}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description.message}</p>
				)}
			</div>
			<h4 className="font-semibold text-2xl mb-2">Liens sociaux</h4>
			<div className="space-y-2">
				<Label htmlFor="youtube" className="opacity-80 flex items-center">
					<AiOutlineYoutube className="text-xl mr-1.5" />
					Youtube
				</Label>
				<div className="relative">
					<Input
						id="youtube"
						className={`relative bg-transparent h-9 ${
							errors.youtube && "border-red-500"
						}`}
						placeholder="https://www.youtube.com/@username"
						{...register("youtube")}
					/>
				</div>
				{errors.youtube && (
					<p className="text-red-500 text-sm">
						{errors.youtube.message?.toString()}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="instagram" className="opacity-80 flex items-center">
					<FaInstagram className="text-xl mr-1.5" />
					Instagram
				</Label>
				<div className="relative">
					<Input
						id="instagram"
						className={`relative bg-transparent h-9 ${
							errors.instagram && "border-red-500"
						}`}
						placeholder="https://www.instagram.com/username"
						{...register("instagram")}
					/>
				</div>
				{errors.instagram && (
					<p className="text-red-500 text-sm">
						{errors.instagram.message?.toString()}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="tiktok" className="opacity-80 flex items-center">
					<FaTiktok className="text-lg mr-1.5" />
					TikTok
				</Label>
				<div className="relative">
					<Input
						id="tiktok"
						className={`relative bg-transparent h-9 ${
							errors.tiktok && "border-red-500"
						}`}
						placeholder="https://www.tiktok.com/@username"
						{...register("tiktok")}
					/>
				</div>
				{errors.tiktok && (
					<p className="text-red-500 text-sm">
						{errors.tiktok.message?.toString()}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="twitter" className="opacity-80 flex items-center">
					<FaXTwitter className="text-lg mr-1.5" />
					Twitter
				</Label>
				<div className="relative">
					<Input
						id="twitter"
						className={`relative bg-transparent h-9 ${
							errors.twitter && "border-red-500"
						}`}
						placeholder="https://x.com/username"
						{...register("twitter")}
					/>
				</div>
				{errors.twitter && (
					<p className="text-red-500 text-sm">
						{errors.twitter.message?.toString()}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="soundcloud" className="opacity-80 flex items-center">
					<RiSoundcloudFill className="text-xl mr-1.5" />
					SoundCloud
				</Label>
				<div className="relative">
					<Input
						id="soundcloud"
						className={`relative bg-transparent h-9 ${
							errors.soundcloud && "border-red-500"
						}`}
						placeholder="https://www.instagram.com/_maxess"
						{...register("soundcloud")}
					/>
				</div>
				{errors.soundcloud && (
					<p className="text-red-500 text-sm">
						{errors.soundcloud.message?.toString()}
					</p>
				)}
			</div>
		</div>
	);
};
