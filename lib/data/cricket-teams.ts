export type CricketTeam = {
  name: string;
  code: string;
  league: string;
  country: string;
};

export const ALL_CRICKET_TEAMS: CricketTeam[] = [
  // ── ICC Full Members (Men's International) ──
  { name: "India", code: "IND", league: "ICC", country: "India" },
  { name: "Australia", code: "AUS", league: "ICC", country: "Australia" },
  { name: "England", code: "ENG", league: "ICC", country: "England" },
  { name: "South Africa", code: "SA", league: "ICC", country: "South Africa" },
  { name: "New Zealand", code: "NZ", league: "ICC", country: "New Zealand" },
  { name: "Pakistan", code: "PAK", league: "ICC", country: "Pakistan" },
  { name: "Sri Lanka", code: "SL", league: "ICC", country: "Sri Lanka" },
  { name: "West Indies", code: "WI", league: "ICC", country: "West Indies" },
  { name: "Bangladesh", code: "BAN", league: "ICC", country: "Bangladesh" },
  { name: "Afghanistan", code: "AFG", league: "ICC", country: "Afghanistan" },
  { name: "Zimbabwe", code: "ZIM", league: "ICC", country: "Zimbabwe" },
  { name: "Ireland", code: "IRE", league: "ICC", country: "Ireland" },

  // ── ICC Associate Members ──
  { name: "Netherlands", code: "NED", league: "ICC", country: "Netherlands" },
  { name: "Scotland", code: "SCO", league: "ICC", country: "Scotland" },
  { name: "Namibia", code: "NAM", league: "ICC", country: "Namibia" },
  { name: "Nepal", code: "NEP", league: "ICC", country: "Nepal" },
  { name: "Oman", code: "OMA", league: "ICC", country: "Oman" },
  { name: "UAE", code: "UAE", league: "ICC", country: "UAE" },
  { name: "USA", code: "USA", league: "ICC", country: "USA" },
  { name: "Canada", code: "CAN", league: "ICC", country: "Canada" },
  { name: "Papua New Guinea", code: "PNG", league: "ICC", country: "Papua New Guinea" },
  { name: "Hong Kong", code: "HK", league: "ICC", country: "Hong Kong" },
  { name: "Uganda", code: "UGA", league: "ICC", country: "Uganda" },
  { name: "Kenya", code: "KEN", league: "ICC", country: "Kenya" },

  // ── IPL (Indian Premier League) ──
  { name: "Mumbai Indians", code: "MI", league: "IPL", country: "India" },
  { name: "Chennai Super Kings", code: "CSK", league: "IPL", country: "India" },
  { name: "Royal Challengers Bengaluru", code: "RCB", league: "IPL", country: "India" },
  { name: "Kolkata Knight Riders", code: "KKR", league: "IPL", country: "India" },
  { name: "Delhi Capitals", code: "DC", league: "IPL", country: "India" },
  { name: "Rajasthan Royals", code: "RR", league: "IPL", country: "India" },
  { name: "Sunrisers Hyderabad", code: "SRH", league: "IPL", country: "India" },
  { name: "Punjab Kings", code: "PBKS", league: "IPL", country: "India" },
  { name: "Gujarat Titans", code: "GT", league: "IPL", country: "India" },
  { name: "Lucknow Super Giants", code: "LSG", league: "IPL", country: "India" },

  // ── PSL (Pakistan Super League) ──
  { name: "Islamabad United", code: "ISU", league: "PSL", country: "Pakistan" },
  { name: "Karachi Kings", code: "KK", league: "PSL", country: "Pakistan" },
  { name: "Lahore Qalandars", code: "LQ", league: "PSL", country: "Pakistan" },
  { name: "Multan Sultans", code: "MS", league: "PSL", country: "Pakistan" },
  { name: "Peshawar Zalmi", code: "PZ", league: "PSL", country: "Pakistan" },
  { name: "Quetta Gladiators", code: "QG", league: "PSL", country: "Pakistan" },

  // ── BBL (Big Bash League) ──
  { name: "Adelaide Strikers", code: "ADS", league: "BBL", country: "Australia" },
  { name: "Brisbane Heat", code: "BRH", league: "BBL", country: "Australia" },
  { name: "Hobart Hurricanes", code: "HBH", league: "BBL", country: "Australia" },
  { name: "Melbourne Renegades", code: "MLR", league: "BBL", country: "Australia" },
  { name: "Melbourne Stars", code: "MLS", league: "BBL", country: "Australia" },
  { name: "Perth Scorchers", code: "PRS", league: "BBL", country: "Australia" },
  { name: "Sydney Sixers", code: "SYS", league: "BBL", country: "Australia" },
  { name: "Sydney Thunder", code: "SYT", league: "BBL", country: "Australia" },

  // ── CPL (Caribbean Premier League) ──
  { name: "Trinbago Knight Riders", code: "TKR", league: "CPL", country: "Trinidad" },
  { name: "Jamaica Tallawahs", code: "JT", league: "CPL", country: "Jamaica" },
  { name: "Barbados Royals", code: "BR", league: "CPL", country: "Barbados" },
  { name: "Guyana Amazon Warriors", code: "GAW", league: "CPL", country: "Guyana" },
  { name: "St Kitts & Nevis Patriots", code: "SNP", league: "CPL", country: "St Kitts" },
  { name: "St Lucia Kings", code: "SLK", league: "CPL", country: "St Lucia" },
  { name: "Antigua & Barbuda Falcons", code: "ABF", league: "CPL", country: "Antigua" },

  // ── SA20 (South Africa) ──
  { name: "Sunrisers Eastern Cape", code: "SEC", league: "SA20", country: "South Africa" },
  { name: "MI Cape Town", code: "MICT", league: "SA20", country: "South Africa" },
  { name: "Durban Super Giants", code: "DSG", league: "SA20", country: "South Africa" },
  { name: "Joburg Super Kings", code: "JSK", league: "SA20", country: "South Africa" },
  { name: "Paarl Royals", code: "PR", league: "SA20", country: "South Africa" },
  { name: "Pretoria Capitals", code: "PC", league: "SA20", country: "South Africa" },

  // ── The Hundred ──
  { name: "Oval Invincibles", code: "OVI", league: "The Hundred", country: "England" },
  { name: "Trent Rockets", code: "TRK", league: "The Hundred", country: "England" },
  { name: "Southern Brave", code: "SBR", league: "The Hundred", country: "England" },
  { name: "Birmingham Phoenix", code: "BPH", league: "The Hundred", country: "England" },
  { name: "London Spirit", code: "LSP", league: "The Hundred", country: "England" },
  { name: "Manchester Originals", code: "MNO", league: "The Hundred", country: "England" },
  { name: "Northern Superchargers", code: "NSC", league: "The Hundred", country: "England" },
  { name: "Welsh Fire", code: "WFI", league: "The Hundred", country: "Wales" },

  // ── LPL (Lanka Premier League) ──
  { name: "Colombo Strikers", code: "COS", league: "LPL", country: "Sri Lanka" },
  { name: "Jaffna Kings", code: "JFK", league: "LPL", country: "Sri Lanka" },
  { name: "Kandy Falcons", code: "KF", league: "LPL", country: "Sri Lanka" },
  { name: "Dambulla Aura", code: "DA", league: "LPL", country: "Sri Lanka" },
  { name: "Galle Marvels", code: "GM", league: "LPL", country: "Sri Lanka" },

  // ── BPL (Bangladesh Premier League) ──
  { name: "Comilla Victorians", code: "CV", league: "BPL", country: "Bangladesh" },
  { name: "Dhaka Dominators", code: "DD", league: "BPL", country: "Bangladesh" },
  { name: "Fortune Barishal", code: "FB", league: "BPL", country: "Bangladesh" },
  { name: "Khulna Tigers", code: "KT", league: "BPL", country: "Bangladesh" },
  { name: "Rangpur Riders", code: "RPR", league: "BPL", country: "Bangladesh" },
  { name: "Sylhet Strikers", code: "SS", league: "BPL", country: "Bangladesh" },
  { name: "Chattogram Challengers", code: "CC", league: "BPL", country: "Bangladesh" },

  // ── ILT20 (International League T20 - UAE) ──
  { name: "Gulf Giants", code: "GG", league: "ILT20", country: "UAE" },
  { name: "Desert Vipers", code: "DV", league: "ILT20", country: "UAE" },
  { name: "Dubai Capitals", code: "DUC", league: "ILT20", country: "UAE" },
  { name: "Abu Dhabi Knight Riders", code: "ADKR", league: "ILT20", country: "UAE" },
  { name: "MI Emirates", code: "MIE", league: "ILT20", country: "UAE" },
  { name: "Sharjah Warriorz", code: "SW", league: "ILT20", country: "UAE" },

  // ── MLC (Major League Cricket - USA) ──
  { name: "MI New York", code: "MINY", league: "MLC", country: "USA" },
  { name: "Los Angeles Knight Riders", code: "LAKR", league: "MLC", country: "USA" },
  { name: "San Francisco Unicorns", code: "SFU", league: "MLC", country: "USA" },
  { name: "Seattle Orcas", code: "SEO", league: "MLC", country: "USA" },
  { name: "Texas Super Kings", code: "TSK", league: "MLC", country: "USA" },
  { name: "Washington Freedom", code: "WF", league: "MLC", country: "USA" },

  // ── Super Smash (New Zealand) ──
  { name: "Auckland Aces", code: "AA", league: "Super Smash", country: "New Zealand" },
  { name: "Canterbury Kings", code: "CK", league: "Super Smash", country: "New Zealand" },
  { name: "Central Stags", code: "CS", league: "Super Smash", country: "New Zealand" },
  { name: "Northern Brave", code: "NB", league: "Super Smash", country: "New Zealand" },
  { name: "Otago Volts", code: "OV", league: "Super Smash", country: "New Zealand" },
  { name: "Wellington Firebirds", code: "WB", league: "Super Smash", country: "New Zealand" },
];
