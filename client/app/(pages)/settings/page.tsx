"use client";

import React from "react";
import SettingsForm from "@/components/features/settings/SettingsForm";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
	// Récupérer les informations actuelles de l'utilisateur
	const { data: userData, isLoading } = useSettings();

	if (isLoading) {
		return (
			<div className="animate-pulse space-y-6 py-6">
				<div className="h-8 bg-gray-200 rounded w-1/3"></div>
				<div className="space-y-4">
					<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					<div className="h-10 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 py-6">
			<div>
				<h1 className="text-3xl font-semibold">Paramètres</h1>
				<p className="mt-2 opacity-80">
					Gérez vos informations personnelles et vos préférences
				</p>
			</div>

			{userData && <SettingsForm userData={userData} />}
		</div>
	);
}
