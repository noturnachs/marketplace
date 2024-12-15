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
import reminiHeader from "./assets/headers/remini.png";
import sheinHeader from "./assets/headers/shein.png";
import scribdHeader from "./assets/headers/scribd.png";
import numeradeHeader from "./assets/headers/numerade.png";
import studocuHeader from "./assets/headers/studocu.png";
import hboHeader from "./assets/headers/hbomax.png";
import picsartHeader from "./assets/headers/picsart.png";
import quizletHeader from "./assets/headers/quizlet.png";
import applemusicHeader from "./assets/headers/applemusic.png";
import globeHeader from "./assets/headers/globe.png";
import smartHeader from "./assets/headers/smart.png";
import tntHeader from "./assets/headers/tnt.png";
import tmHeader from "./assets/headers/tm.png";

export const listingHeaders = [
  {
    keyword: "gizmo",
    image: gizmoHeader,
    alt: "Gizmo Header",
  },
  {
    keyword: "tm",
    image: tmHeader,
    alt: "TM Header",
  },
  {
    keyword: "tnt",
    image: tntHeader,
    alt: "TNT Header",
  },
  {
    keyword: "smart",
    image: smartHeader,
    alt: "Smart Header",
  },
  {
    keyword: "globe",
    image: globeHeader,
    alt: "Globe Header",
  },
  {
    keyword: "applemusic",
    image: applemusicHeader,
    alt: "Apple Music Header",
  },
  {
    keyword: "picsart",
    image: picsartHeader,
    alt: "Picsart Header",
  },
  {
    keyword: "hbo",
    image: hboHeader,
    alt: "HBO Header",
  },
  {
    keyword: "studocu",
    image: studocuHeader,
    alt: "Studocu Header",
  },
  {
    keyword: "numerade",
    image: numeradeHeader,
    alt: "Numerade Header",
  },
  {
    keyword: "scribd",
    image: scribdHeader,
    alt: "Scribd Header",
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
    keyword: "shein",
    image: sheinHeader,
    alt: "Shein Header",
  },
  {
    keyword: "spotify",
    image: spotifyHeader,
    alt: "Spotify Header",
  },
  {
    keyword: "remini",
    image: reminiHeader,
    alt: "Remini Header",
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
    keyword: "quizlet",
    image: quizletHeader,
    alt: "Quizlet Header",
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
