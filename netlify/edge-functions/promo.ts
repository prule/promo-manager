import { Context } from "https://edge.netlify.com";
import promos from "../../src/promos.json" assert { type: "json" };

export default async (request: Request, context: Context) => {
  const origin = request.headers.get("origin") || "";
  
  // CORS Logic
  let allowAll = false;
  const allAllowedSites = new Set<string>();
  
  for (const promo of promos) {
    if (promo.rules.allowedSites.includes("*")) {
      allowAll = true;
      break;
    }
    promo.rules.allowedSites.forEach(site => allAllowedSites.add(site));
  }

  let corsHeader = "";
  if (allowAll) {
    corsHeader = "*";
  } else {
    let hostname = "";
    try {
      hostname = new URL(origin).hostname;
    } catch (e) {
      // If origin is null or invalid (e.g. curl), we might treat it as allowed or not.
      // For now, let's assume empty origin (direct request) is allowed for debugging, 
      // or strictly enforce origin.
    }
    
    if (hostname && allAllowedSites.has(hostname)) {
      corsHeader = origin;
    }
  }

  // Handle OPTIONS request (Preflight)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": corsHeader || "null",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  // If strict CORS is required and no header matches, we could return 403 here.
  // But standard behavior is just not to send the ACAO header.

  const now = new Date();
  
  // Extract hostname from origin for filtering
  let hostname = "";
  try {
    hostname = new URL(origin).hostname;
  } catch (e) {
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
    return new Response(null, { 
      status: 204, 
      headers: { 
        "Access-Control-Allow-Origin": corsHeader || "null" 
      } 
    });
  }

  // Random Selection
  const randomIndex = Math.floor(Math.random() * validPromos.length);
  const selectedPromo = validPromos[randomIndex];

  return new Response(JSON.stringify(selectedPromo), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": corsHeader || "null",
    },
  });
};
