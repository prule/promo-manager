import { Context } from "https://edge.netlify.com";
import promos from "../promos.json" assert { type: "json" };

export default async (request: Request, context: Context) => {
  const origin = request.headers.get("origin") || "";
  const now = new Date();
  
  // Extract hostname from origin for filtering
  let hostname = "";
  try {
    hostname = new URL(origin).hostname;
  } catch (e) {
    hostname = "localhost"; 
  }

  // Get Country Code from Netlify Context
  const countryCode = context.geo?.country?.code || "XX";

  console.log(`[Request] Origin: ${origin}, Hostname: ${hostname}, Country: ${countryCode}`);

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
    if (hostname && allAllowedSites.has(hostname)) {
      corsHeader = origin;
    }
  }

  // Handle OPTIONS request (Preflight)
  if (request.method === "OPTIONS") {
    console.log(`[CORS] Preflight request handled. Header: ${corsHeader || "null"}`);
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": corsHeader || "null",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  // Filter promos
  const validPromos = promos.filter((promo) => {
    // 1. Check Date Range
    const startDate = new Date(promo.rules.startDate);
    const endDate = new Date(promo.rules.endDate);
    
    if (now < startDate || now > endDate) {
      // console.log(`[Filter] Promo ${promo.id} excluded by date.`);
      return false;
    }

    // 2. Check Allowed Sites
    const allowedSites = promo.rules.allowedSites;
    if (!allowedSites.includes("*") && !allowedSites.includes(hostname)) {
      // console.log(`[Filter] Promo ${promo.id} excluded by site.`);
      return false;
    }

    // 3. Check Allowed Countries
    const allowedCountries = promo.rules.allowedCountries || ["*"];
    if (!allowedCountries.includes("*") && !allowedCountries.includes(countryCode)) {
      // console.log(`[Filter] Promo ${promo.id} excluded by country.`);
      return false;
    }

    return true;
  });

  console.log(`[Selection] Found ${validPromos.length} valid promos out of ${promos.length}.`);

  // If no promos match, return 204 No Content
  if (validPromos.length === 0) {
    console.log("[Response] No content (204).");
    return new Response(null, { 
      status: 204, 
      headers: { 
        "Access-Control-Allow-Origin": corsHeader || "null" 
      } 
    });
  }

  // Weighted Random Selection
  let totalWeight = 0;
  for (const promo of validPromos) {
    totalWeight += (promo.rules.weight || 1);
  }

  let randomValue = Math.random() * totalWeight;
  let selectedPromo = validPromos[0];

  for (const promo of validPromos) {
    randomValue -= (promo.rules.weight || 1);
    if (randomValue <= 0) {
      selectedPromo = promo;
      break;
    }
  }

  // Basic Analytics Logging (Console for now)
  console.log(JSON.stringify({
    event: "impression",
    promoId: selectedPromo.id,
    timestamp: now.toISOString(),
    country: countryCode,
    site: hostname
  }));

  return new Response(JSON.stringify(selectedPromo), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": corsHeader || "null",
    },
  });
};
