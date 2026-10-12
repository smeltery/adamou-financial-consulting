export const regions = [
  ["United States", "en-US", "USD"],
  ["Canada", "en-CA", "CAD"],
  ["United Kingdom", "en-GB", "GBP"],
  ["Ireland", "en-IE", "EUR"],
  ["Australia", "en-AU", "AUD"],
  ["New Zealand", "en-NZ", "NZD"],
  ["Denmark", "da-DK", "DKK"],
  ["Sweden", "sv-SE", "SEK"],
  ["Norway", "nb-NO", "NOK"],
  ["Germany", "de-DE", "EUR"],
  ["France", "fr-FR", "EUR"],
  ["Italy", "it-IT", "EUR"],
  ["Spain", "es-ES", "EUR"],
  ["Netherlands", "nl-NL", "EUR"],
  ["Switzerland", "de-CH", "CHF"],
  ["India", "en-IN", "INR"],
  ["Japan", "ja-JP", "JPY"],
  ["Singapore", "en-SG", "SGD"],
  ["South Africa", "en-ZA", "ZAR"],
  ["Brazil", "pt-BR", "BRL"],
  ["Mexico", "es-MX", "MXN"],
];
export function moneyFormat(region = "en-US") {
  const [, locale, currency] =
    regions.find(([, locale]) => locale === region) || regions[0];
  return new Intl.NumberFormat(locale, { style: "currency", currency });
}
