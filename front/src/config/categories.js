import { HiSparkles } from "react-icons/hi2";
import {
  HiMusicalNote,
  HiFilm,
  HiAcademicCap,
  HiCommandLine,
} from "react-icons/hi2";
import {
  HiPhoto,
  HiGlobeAlt,
  HiLockClosed,
  HiDevicePhoneMobile,
  HiSignal,
} from "react-icons/hi2";

export const categories = [
  {
    id: "ai_apps",
    name: "AI Sites/Apps",
    icon: HiSparkles,
    color: "text-purple-500",
  },
  {
    id: "music",
    name: "Music Prems",
    icon: HiMusicalNote,
    color: "text-green-500",
  },
  {
    id: "entertainment",
    name: "Ent. Prems",
    icon: HiFilm,
    color: "text-red-500",
  },
  {
    id: "education",
    name: "Educational/Office Prems",
    icon: HiAcademicCap,
    color: "text-blue-500",
  },
  {
    id: "productivity",
    name: "Productivity Prems",
    icon: HiCommandLine,
    color: "text-yellow-500",
  },
  {
    id: "photo",
    name: "Photo Editing Prems",
    icon: HiPhoto,
    color: "text-pink-500",
  },
  {
    id: "vpn",
    name: "VPN Prems",
    icon: HiGlobeAlt,
    color: "text-cyan-500",
  },
  {
    id: "unlocks",
    name: "Unlocks",
    icon: HiLockClosed,
    color: "text-orange-500",
  },
  {
    id: "otp",
    name: "OTP Services",
    icon: HiDevicePhoneMobile,
    color: "text-indigo-500",
  },
  {
    id: "data",
    name: "Smart/Globe GB",
    icon: HiSignal,
    color: "text-emerald-500",
  },
];

export const getCategoryById = (id) => categories.find((cat) => cat.id === id);
export const getCategoryByName = (name) =>
  categories.find((cat) => cat.name === name);
