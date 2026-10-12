import type { PledgeId } from "../game/types";

// 文章だけでは選びにくい政策を、子どもも見分けやすい小さな目印で補う。
export const actionIcons: Record<string, string> = {
  "child-support": "📚", "clean-energy": "☀️", "local-business": "🏪",
  "community-bus": "🚌", "road-investment": "🛣️", "walking-city": "🚲",
  "work-balance": "🌈", automation: "🤖", "job-training": "🧠",
  "cool-shelters": "🧊", "water-renewal": "💧", "green-roofs": "🌳",
  "maintain-services": "🛠️", "innovation-fund": "💡", "reserve-fund": "🧰",
  "inclusive-evacuation": "🧭", "drainage-upgrade": "🌧️", "evacuation-app": "📱",
  "community-kitchen": "🍲", "shared-workshop": "🔧", "temporary-market": "🍅",
  "mass-tourism": "🎪", "slow-tourism": "🗺️", "resident-first": "🏘️",
  "citizen-assembly": "🗣️", "visible-projects": "🏗️", "neighborhood-grants": "🤝",
  "care-worker-pay": "🧸", "childcare-digital": "🖥️", "neighborhood-childcare": "👪",
  "single-use-rule": "♻️", "container-deposit": "🥤", "cleanup-days": "🏖️",
  "school-air-conditioning": "❄️", "cool-school-retrofit": "🏫", "summer-schedule": "⏰",
  "open-city-data": "🗺️", "predictive-support": "🔎", "privacy-audit": "🔐",
  "home-care-workforce": "🩺", "care-technology": "🦾", "mutual-aid-visits": "🏠",
  "community-energy": "🔆", "renewable-purchase": "⚡", "efficiency-retrofit": "💡",
  "multilingual-services": "💬", "worker-recruitment": "🌍", "intercultural-neighborhood": "🧩",
  "emergency-stockpiles": "📦", "public-health-network": "🫶", "decade-reserve": "🐷",
};

export const pledgeIcons: Record<PledgeId, string> = {
  inclusive: "🫶",
  innovative: "🚀",
  resilient: "🌱",
};

export const actionIcon = (id: string) => actionIcons[id] ?? "✨";
