"use client";

import { DescriptionSection } from "./components/DescriptionSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { SocialLinksSection } from "./components/SocialLinksSection";

export const UpdateProfileInfoForm = () => {
  return (
    <div className="space-y-6 pb-12">
      <DescriptionSection />
      <ExperienceSection />
      <SocialLinksSection />
    </div>
  );
};
