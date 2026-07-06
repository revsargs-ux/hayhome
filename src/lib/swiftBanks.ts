export interface SwiftBank {
  name: string;
  country: string; // ISO 2-letter
  countryName: string;
}

// Starter dataset — public BIC codes from official sources.
// Extend as needed; BIC lookup supplements this with live data.
export const SWIFT_BANKS: Record<string, SwiftBank> = {
  // ── Armenia ──────────────────────────────────────────────────────────────
  ARMIAM22: { name: "Ameriabank", country: "AM", countryName: "Armenia" },
  ARDSAM22: { name: "Ardshinbank", country: "AM", countryName: "Armenia" },
  AGBAAM22: { name: "ACBA Bank", country: "AM", countryName: "Armenia" },
  COVBAM22: { name: "Converse Bank", country: "AM", countryName: "Armenia" },
  EVOCAM22: { name: "Evocabank", country: "AM", countryName: "Armenia" },
  UNIBAM22: { name: "Unibank", country: "AM", countryName: "Armenia" },
  VTBAAM22: { name: "VTB Bank Armenia", country: "AM", countryName: "Armenia" },
  IDBAAM22: { name: "IDBank", country: "AM", countryName: "Armenia" },
  FASAAMMX: { name: "Fast Bank", country: "AM", countryName: "Armenia" },
  MOSHAMMX: { name: "Byblos Bank Armenia", country: "AM", countryName: "Armenia" },
  INEAAM22: { name: "Inecobank", country: "AM", countryName: "Armenia" },
  AKBAAM22: { name: "Akba Bank", country: "AM", countryName: "Armenia" },
  ARENAM22: { name: "Arenadata Bank", country: "AM", countryName: "Armenia" },
  HCBAAM22: { name: "HayPost Bank", country: "AM", countryName: "Armenia" },
  ARTSAM22: { name: "Araratbank", country: "AM", countryName: "Armenia" },
  ACBAAM22: { name: "Armeconombank", country: "AM", countryName: "Armenia" },

  // ── Russia ───────────────────────────────────────────────────────────────
  SABRRUMM: { name: "Сбербанк", country: "RU", countryName: "Russia" },
  VTBRRUMM: { name: "ВТБ", country: "RU", countryName: "Russia" },
  GAZPRUMM: { name: "Газпромбанк", country: "RU", countryName: "Russia" },
  ALFARUMM: { name: "Альфа-Банк", country: "RU", countryName: "Russia" },
  ROSBRUMM: { name: "Росбанк", country: "RU", countryName: "Russia" },
  OTKRRUM1: { name: "Банк Открытие", country: "RU", countryName: "Russia" },
  RZBTRUMM: { name: "Райффайзенбанк", country: "RU", countryName: "Russia" },
  TICSRUMM: { name: "Т-Банк (Тинькофф)", country: "RU", countryName: "Russia" },
  POIMRUMM: { name: "Почта Банк", country: "RU", countryName: "Russia" },
  MRBKRUM1: { name: "МТС Банк", country: "RU", countryName: "Russia" },
  SMPBRUMM: { name: "СМП Банк", country: "RU", countryName: "Russia" },
  CITVRUM1: { name: "Ситибанк Россия", country: "RU", countryName: "Russia" },

  // ── Germany ──────────────────────────────────────────────────────────────
  DEUTDEDB: { name: "Deutsche Bank", country: "DE", countryName: "Germany" },
  COBADEFF: { name: "Commerzbank", country: "DE", countryName: "Germany" },
  HYVEDEMM: { name: "HypoVereinsbank (UniCredit)", country: "DE", countryName: "Germany" },
  PBNKDEFF: { name: "Postbank", country: "DE", countryName: "Germany" },
  INGDDEFF: { name: "ING Germany", country: "DE", countryName: "Germany" },
  NORSDE51: { name: "Norddeutsche Landesbank", country: "DE", countryName: "Germany" },
  DRESDEFF: { name: "Dresdner Bank", country: "DE", countryName: "Germany" },

  // ── France ───────────────────────────────────────────────────────────────
  BNPAFRPP: { name: "BNP Paribas", country: "FR", countryName: "France" },
  SOGEFRPP: { name: "Société Générale", country: "FR", countryName: "France" },
  CRLYFRPP: { name: "LCL (Crédit Lyonnais)", country: "FR", countryName: "France" },
  AGRIFRPP: { name: "Crédit Agricole", country: "FR", countryName: "France" },
  CEPAFRPP: { name: "Caisse d'Épargne", country: "FR", countryName: "France" },
  BOUSFRPP: { name: "Crédit Mutuel", country: "FR", countryName: "France" },
  CCFRFRPP: { name: "HSBC France", country: "FR", countryName: "France" },

  // ── United Kingdom ───────────────────────────────────────────────────────
  BARCGB22: { name: "Barclays", country: "GB", countryName: "United Kingdom" },
  HBUKGB4B: { name: "HSBC UK", country: "GB", countryName: "United Kingdom" },
  LOYDGB2L: { name: "Lloyds Bank", country: "GB", countryName: "United Kingdom" },
  NWBKGB2L: { name: "NatWest", country: "GB", countryName: "United Kingdom" },
  RBSSGB2L: { name: "Royal Bank of Scotland", country: "GB", countryName: "United Kingdom" },
  SRLGGB2L: { name: "Starling Bank", country: "GB", countryName: "United Kingdom" },
  MONZGB2L: { name: "Monzo", country: "GB", countryName: "United Kingdom" },

  // ── USA ──────────────────────────────────────────────────────────────────
  CHASUS33: { name: "JPMorgan Chase", country: "US", countryName: "USA" },
  BOFAUS3N: { name: "Bank of America", country: "US", countryName: "USA" },
  WFBIUS6S: { name: "Wells Fargo", country: "US", countryName: "USA" },
  CITIUS33: { name: "Citibank", country: "US", countryName: "USA" },
  USBKUS44: { name: "U.S. Bank", country: "US", countryName: "USA" },
  MRMDUS33: { name: "TD Bank USA", country: "US", countryName: "USA" },

  // ── Switzerland ──────────────────────────────────────────────────────────
  UBSWCHZH: { name: "UBS", country: "CH", countryName: "Switzerland" },
  CRESCHZZ: { name: "Credit Suisse", country: "CH", countryName: "Switzerland" },
  ZKBKCHZZ: { name: "Zürcher Kantonalbank (ZKB)", country: "CH", countryName: "Switzerland" },
  RABOCHGG: { name: "Raiffeisen Switzerland", country: "CH", countryName: "Switzerland" },

  // ── Netherlands ──────────────────────────────────────────────────────────
  INGBNL2A: { name: "ING Bank", country: "NL", countryName: "Netherlands" },
  RABONL2U: { name: "Rabobank", country: "NL", countryName: "Netherlands" },
  ABNANL2A: { name: "ABN AMRO", country: "NL", countryName: "Netherlands" },

  // ── Italy ────────────────────────────────────────────────────────────────
  BCITITMM: { name: "UniCredit Italy", country: "IT", countryName: "Italy" },
  BNLIITRR: { name: "BNL (BNP Paribas Italy)", country: "IT", countryName: "Italy" },
  UNCRITMM: { name: "UniCredit", country: "IT", countryName: "Italy" },
  BPIIITRR: { name: "Banco BPM", country: "IT", countryName: "Italy" },

  // ── Spain ────────────────────────────────────────────────────────────────
  BBVAESMM: { name: "BBVA", country: "ES", countryName: "Spain" },
  CAIXESBB: { name: "CaixaBank", country: "ES", countryName: "Spain" },
  BSCHESMM: { name: "Banco Santander", country: "ES", countryName: "Spain" },
  SABDESBB: { name: "Banco Sabadell", country: "ES", countryName: "Spain" },

  // ── Austria ──────────────────────────────────────────────────────────────
  BKAUATWW: { name: "Bank Austria (UniCredit)", country: "AT", countryName: "Austria" },
  RZOOAT2L: { name: "Raiffeisen Bank Austria", country: "AT", countryName: "Austria" },
  GIBAATWG: { name: "Erste Bank", country: "AT", countryName: "Austria" },

  // ── Georgia ──────────────────────────────────────────────────────────────
  TBCBGE22: { name: "TBC Bank", country: "GE", countryName: "Georgia" },
  BAGAGE22: { name: "Bank of Georgia", country: "GE", countryName: "Georgia" },
  LBRTGE22: { name: "Liberty Bank", country: "GE", countryName: "Georgia" },
  CRSIGE22: { name: "Credo Bank", country: "GE", countryName: "Georgia" },

  // ── Turkey ───────────────────────────────────────────────────────────────
  TCZBTR2A: { name: "Ziraat Bankası", country: "TR", countryName: "Turkey" },
  TRHBTR2A: { name: "Halkbank", country: "TR", countryName: "Turkey" },
  ISBKTRIS: { name: "İş Bankası", country: "TR", countryName: "Turkey" },
  AKBKTRIS: { name: "Akbank", country: "TR", countryName: "Turkey" },
  YAPITRIS: { name: "Yapı Kredi", country: "TR", countryName: "Turkey" },
  GARANTI:  { name: "Garanti BBVA", country: "TR", countryName: "Turkey" },

  // ── UAE ──────────────────────────────────────────────────────────────────
  EBILAEAD: { name: "Emirates NBD", country: "AE", countryName: "UAE" },
  FABAEAAD: { name: "First Abu Dhabi Bank", country: "AE", countryName: "UAE" },
  ADCBAEAA: { name: "Abu Dhabi Commercial Bank (ADCB)", country: "AE", countryName: "UAE" },
  MASQAEAA: { name: "Mashreq Bank", country: "AE", countryName: "UAE" },
  ARABAEAA: { name: "Arab Bank UAE", country: "AE", countryName: "UAE" },

  // ── China ────────────────────────────────────────────────────────────────
  ICBKCNBJ: { name: "ICBC 工商银行", country: "CN", countryName: "China" },
  BKCHCNBJ: { name: "Bank of China 中国银行", country: "CN", countryName: "China" },
  PCBCCNBJ: { name: "China Construction Bank 建设银行", country: "CN", countryName: "China" },
  ABOCCNBJ: { name: "Agricultural Bank of China 农业银行", country: "CN", countryName: "China" },
  CMBCCNBS: { name: "China Merchants Bank 招商银行", country: "CN", countryName: "China" },
  BOSHCNSH: { name: "Bank of Shanghai 上海银行", country: "CN", countryName: "China" },

  // ── Iran ─────────────────────────────────────────────────────────────────
  MELIIRTH: { name: "Bank Melli Iran ملی", country: "IR", countryName: "Iran" },
  MELLIRTH: { name: "Mellat Bank ملت", country: "IR", countryName: "Iran" },
  SADAIRTH: { name: "Bank Saderat ایران صادرات", country: "IR", countryName: "Iran" },
  PARSIRTH: { name: "Parsian Bank پارسیان", country: "IR", countryName: "Iran" },

  // ── Kazakhstan ───────────────────────────────────────────────────────────
  HSBKKZKX: { name: "Halyk Bank", country: "KZ", countryName: "Kazakhstan" },
  KCJBKZKX: { name: "Kaspi Bank", country: "KZ", countryName: "Kazakhstan" },
  BRKEKZKX: { name: "Bereke Bank", country: "KZ", countryName: "Kazakhstan" },
  JSRCKZKX: { name: "Jusan Bank", country: "KZ", countryName: "Kazakhstan" },

  // ── Poland ───────────────────────────────────────────────────────────────
  PKOPPLPW: { name: "PKO Bank Polski", country: "PL", countryName: "Poland" },
  PEKAPLPK: { name: "Bank Pekao", country: "PL", countryName: "Poland" },
  MRELPLPW: { name: "mBank", country: "PL", countryName: "Poland" },

  // ── Japan ────────────────────────────────────────────────────────────────
  MHCBJPJT: { name: "Mizuho Bank みずほ", country: "JP", countryName: "Japan" },
  SMBCJPJT: { name: "SMBC 三井住友", country: "JP", countryName: "Japan" },
  BOTKJPJT: { name: "MUFG Bank 三菱UFJ", country: "JP", countryName: "Japan" },
};

/** Search SWIFT_BANKS by partial BIC or bank name (case-insensitive). Returns up to `limit` matches. */
export function searchBanks(query: string, limit = 8): Array<{ bic: string } & SwiftBank> {
  const q = query.trim().toUpperCase();
  if (q.length < 2) return [];
  const results: Array<{ bic: string } & SwiftBank> = [];
  for (const [bic, bank] of Object.entries(SWIFT_BANKS)) {
    if (bic.startsWith(q) || bank.name.toUpperCase().includes(q) || bank.countryName.toUpperCase().includes(q)) {
      results.push({ bic, ...bank });
      if (results.length >= limit) break;
    }
  }
  return results;
}
