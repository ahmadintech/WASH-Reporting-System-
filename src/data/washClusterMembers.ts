export interface WashClusterMember {
  name: string;
  logo: string;
  category?: "UN Agency" | "International NGO" | "National NGO" | "Standing Observer";
}

/**
 * Top accredited UN and international NGO operational partners in North East Nigeria WASH Sector.
 * Locally hosted assets in /images/partners/ for guaranteed high-speed rendering with zero CORS/hotlinking issues.
 */
export const WASH_CLUSTER_MEMBERS: WashClusterMember[] = [
  {
    name: "UNICEF",
    logo: "/images/partners/unicef.png",
    category: "UN Agency",
  },
  {
    name: "World Health Organization",
    logo: "/images/partners/who.svg",
    category: "UN Agency",
  },
  {
    name: "International Organization for Migration",
    logo: "/images/partners/iom.svg",
    category: "UN Agency",
  },
  {
    name: "Action Against Hunger",
    logo: "/images/partners/action_against_hunger.png",
    category: "International NGO",
  },
  {
    name: "Save the Children",
    logo: "/images/partners/save_the_children.png",
    category: "International NGO",
  },
  {
    name: "International Rescue Committee",
    logo: "/images/partners/irc.svg",
    category: "International NGO",
  },
  {
    name: "Norwegian Refugee Council",
    logo: "/images/partners/nrc.svg",
    category: "International NGO",
  },
  {
    name: "Oxfam",
    logo: "/images/partners/oxfam.svg",
    category: "International NGO",
  },
  {
    name: "Mercy Corps",
    logo: "/images/partners/mercy_corps.png",
    category: "International NGO",
  },
  {
    name: "Norwegian Church Aid",
    logo: "/images/partners/nca.svg",
    category: "International NGO",
  },
];
