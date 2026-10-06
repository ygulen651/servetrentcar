"use client";

import { Share2 } from "lucide-react";

export function SocialShare({ title }: { title: string }) {
  async function share() {
    if (navigator.share) await navigator.share({ title, url: window.location.href });
    else await navigator.clipboard.writeText(window.location.href);
  }
  return <button className="share-button" type="button" onClick={share}><Share2 /> Paylaş</button>;
}
