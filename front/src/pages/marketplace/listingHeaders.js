import gizmoHeader from "./assets/headers/gizmoai.png";
import netflixHeader from "./assets/headers/netflix.png";
import spotifyHeader from "./assets/headers/spotify.png";
import capcutHeader from "./assets/headers/capcut.png";
import discordHeader from "./assets/headers/discord.png";

import youtubeHeader from "./assets/headers/youtube.png";
import tiktokHeader from "./assets/headers/tiktok.png";
import twitchHeader from "./assets/headers/twitch.png";
import steamHeader from "./assets/headers/steam.png";
import robloxHeader from "./assets/headers/roblox.png";
import chatgptHeader from "./assets/headers/chatgpt.png";
import disneyHeader from "./assets/headers/disney.png";

// Import other headers here as needed

export const listingHeaders = [
  {
    keyword: "gizmo",
    image: gizmoHeader,
    alt: "Gizmo Header",
  },
  {
    keyword: "netflix",
    image: netflixHeader,
    alt: "Netflix Header",
  },
  {
    keyword: "spotify",
    image: spotifyHeader,
    alt: "Spotify Header",
  },
  {
    keyword: "capcut",
    image: capcutHeader,
    alt: "Capcut Header",
  },
  {
    keyword: "discord",
    image: discordHeader,
    alt: "Discord Header",
  },
  {
    keyword: "youtube",
    image: youtubeHeader,
    alt: "Youtube Header",
  },
  {
    keyword: "tiktok",
    image: tiktokHeader,
    alt: "Tiktok Header",
  },
  {
    keyword: "twitch",
    image: twitchHeader,
    alt: "Twitch Header",
  },
  {
    keyword: "steam",
    image: steamHeader,
    alt: "Steam Header",
  },
  {
    keyword: "roblox",
    image: robloxHeader,
    alt: "Roblox Header",
  },
  {
    keyword: "chatgpt",
    image: chatgptHeader,
    alt: "ChatGPT Header",
  },
  {
    keyword: "disney",
    image: disneyHeader,
    alt: "Disney Header",
  },
];

export const getListingHeader = (title) => {
  if (!title) return null;

  const lowerTitle = title.toLowerCase().replace(/\s+/g, ""); // Remove spaces
  return listingHeaders.find((header) => {
    const keyword = header.keyword.toLowerCase();
    // Check both with and without spaces
    return (
      lowerTitle.includes(keyword) || title.toLowerCase().includes(keyword)
    );
  });
};

export const hasCustomHeader = (title) => {
  return !!getListingHeader(title);
};
