import { Context } from "https://edge.netlify.com";
import promos from "../../src/promos.json" assert { type: "json" };

export default async (request: Request, context: Context) => {
  const now = new Date();
  const origin = request.headers.get("origin") || "";
  
  // Extract hostname from origin (e.g., https://example.com -> example.com)
  let hostname = "";
  try {
    hostname = new URL(origin).hostname;
  } catch (e) {
    // If origin is null or invalid, we might be in a local test or direct curl
    hostname = "localhost"; 
  }

  // Filter promos
  const validPromos = promos.filter((promo) => {
    // 1. Check Date Range
    const startDate = new Date(promo.rules.startDate);
    const endDate = new Date(promo.rules.endDate);
    
    if (now < startDate || now > endDate) {
      return false;
    }

    // 2. Check Allowed Sites
    const allowedSites = promo.rules.allowedSites;
    if (allowedSites.includes("*")) {
      return true;
    }
    
    return allowedSites.includes(hostname);
  });

  // If no promos match, return 204 No Content
  if (validPromos.length === 0) {
    return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  // Random Selection
  const randomIndex = Math.floor(Math.random() * validPromos.length);
  const selectedPromo = validPromos[randomIndex];

  return new Response(JSON.stringify(selectedPromo), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*", // We will refine this in the next step if needed
    },
  });
};
