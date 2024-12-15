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
import facebookHeader from "./assets/headers/facebook.png";
import instagramHeader from "./assets/headers/instagram.png";
import grammarlyHeader from "./assets/headers/grammarly.png";
import quillbotHeader from "./assets/headers/quillbot.png";
import zoomHeader from "./assets/headers/zoom.png";
import canvaHeader from "./assets/headers/canva.png";
import primeHeader from "./assets/headers/prime.png";
import defaultHeader from "./assets/headers/default.png";
import cheggHeader from "./assets/headers/chegg.png";
import courseheroHeader from "./assets/headers/coursehero.png";
import vivamaxHeader from "./assets/headers/vivamax.png";
import valorantHeader from "./assets/headers/valorant.png";
import vyprvpnHeader from "./assets/headers/vyprvpn.png";
import nordvpnHeader from "./assets/headers/nordvpn.png";
import viuHeader from "./assets/headers/viu.png";
import reminderHeader from "./assets/headers/reminder.png";
// Import other headers here as needed

export const listingHeaders = [
  {
    keyword: "gizmo",
    image: gizmoHeader,
    alt: "Gizmo Header",
  },
  {
    keyword: "viu",
    image: viuHeader,
    alt: "Viu Header",
  },
  {
    keyword: "nord",
    image: nordvpnHeader,
    alt: "NordVPN Header",
  },
  {
    keyword: "vypr",
    image: vyprvpnHeader,
    alt: "VyprVPN Header",
  },
  {
    keyword: "valorant",
    image: valorantHeader,
    alt: "Valorant Header",
  },
  {
    keyword: "vivamax",
    image: vivamaxHeader,
    alt: "Vivamax Header",
  },
  {
    keyword: "coursehero",
    image: courseheroHeader,
    alt: "Coursehero Header",
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
    keyword: "reminder",
    image: reminderHeader,
    alt: "Reminder Header",
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
  {
    keyword: "facebook",
    image: facebookHeader,
    alt: "Facebook Header",
  },
  {
    keyword: "instagram",
    image: instagramHeader,
    alt: "Instagram Header",
  },
  {
    keyword: "grammarly",
    image: grammarlyHeader,
    alt: "Grammarly Header",
  },
  {
    keyword: "quillbot",
    image: quillbotHeader,
    alt: "Quillbot Header",
  },
  {
    keyword: "zoom",
    image: zoomHeader,
    alt: "Zoom Header",
  },
  {
    keyword: "canva",
    image: canvaHeader,
    alt: "Canva Header",
  },
  {
    keyword: "prime",
    image: primeHeader,
    alt: "Prime Header",
  },
  {
    keyword: "chegg",
    image: cheggHeader,
    alt: "Chegg Header",
  },
];

export const getListingHeader = (title) => {
  if (!title)
    return {
      keyword: "default",
      image: defaultHeader,
      alt: "Default Header",
    };

  const lowerTitle = title.toLowerCase().replace(/\s+/g, ""); // Remove spaces
  const matchedHeader = listingHeaders.find((header) => {
    const keyword = header.keyword.toLowerCase();
    // Check both with and without spaces
    return (
      lowerTitle.includes(keyword) || title.toLowerCase().includes(keyword)
    );
  });

  // Return matched header or default header object
  return (
    matchedHeader || {
      keyword: "default",
      image: defaultHeader,
      alt: "Default Header",
    }
  );
};

export const hasCustomHeader = (title) => true;
