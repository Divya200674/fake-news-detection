const TIER_1 = [
  ".gov",
  ".nic.in",
  "india.gov.in",
  "eci.gov.in",
  "rbi.org.in"
];

const TIER_2 = [
  "reuters.com",
  "bbc.com",
  "thehindu.com",
  "indianexpress.com",
  "livemint.com"
];

function scoreSource(url) {
  url = (url || "").toLowerCase();

  if (TIER_1.some(d => url.includes(d))) return 50;
  if (TIER_2.some(d => url.includes(d))) return 30;
  return 10;
}

module.exports = { scoreSource };