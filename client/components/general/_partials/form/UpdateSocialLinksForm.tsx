"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const UpdateSocialLinksForm = () => {
  return (
    <div>
      <div className="space-y-1">
        <div className="space-y-3">
          <div className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="youtube" className="opacity-80">
                Youtube: URL
              </Label>
              <Input
                id="youtube"
                className="h-9"
                placeholder="https://www.youtube.com/shorts/l6NpmX6KVqY"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="instagram" className="opacity-80">
                Instagram: username
              </Label>
              <Input id="instagram" className="h-9" placeholder="@username" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="soundcloud" className="opacity-80">
                SoundCloud: username
              </Label>
              <Input id="soundcloud" className="h-9" placeholder="@username" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tiktok" className="opacity-80">
                TikTok: username
              </Label>
              <Input id="tiktok" className="h-9" placeholder="@username" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
