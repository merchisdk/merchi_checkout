import { ProductType, Role } from './types';

export const isoCountries: any = {
  AF: "Afghanistan",
  AX: "Aland Islands",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua And Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia And Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brazil",
  IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo",
  CD: "Congo, Democratic Republic",
  CK: "Cook Islands",
  CR: "Costa Rica",
  CI: "Cote D'Ivoire",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Falkland Islands (Malvinas)",
  FO: "Faroe Islands",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island & Mcdonald Islands",
  VA: "Holy See (Vatican City State)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran, Islamic Republic Of",
  IQ: "Iraq",
  IE: "Ireland",
  IM: "Isle Of Man",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JE: "Jersey",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KR: "Korea",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libyan Arab Jamahiriya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MK: "Macedonia",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia, Federated States Of",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  AN: "Netherlands Antilles",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MP: "Northern Mariana Islands",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestinian Territory, Occupied",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RU: "Russian Federation",
  RW: "Rwanda",
  BL: "Saint Barthelemy",
  SH: "Saint Helena",
  KN: "Saint Kitts And Nevis",
  LC: "Saint Lucia",
  MF: "Saint Martin",
  PM: "Saint Pierre And Miquelon",
  VC: "Saint Vincent And Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome And Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia And Sandwich Isl.",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard And Jan Mayen",
  SZ: "Swaziland",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad And Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TC: "Turks And Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UM: "United States Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Viet Nam",
  VG: "Virgin Islands, British",
  VI: "Virgin Islands, U.S.",
  WF: "Wallis And Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};

export function userDomainsByRoles(user: any, roles: Array<number>) {
  const eD = user && user.enrolledDomains ? user.enrolledDomains : [];
  const domains: any[] = [];
  let i = 0;
  for (i; i < eD.length; i++) {
    const e = eD[i];
    if (roles.includes(e.role)) {
      domains.push((e as any).domain);
    }
  }
  return domains;
}

export function userAdminDomains(user: any) {
  return userDomainsByRoles(user, [Role.ADMIN, Role.MANAGER]);
}

export function isProductSupplierMOD(product: any) {
  const productType = product && product.productType
  return product && [
    String(ProductType.SUPPLIER_MOD),
    String(ProductType.SUPPLIER_RESELL_MOD)
  ].includes(String(productType));
}

export function isUserRegistered(user: any) {
  const id = user ? user.id : null;
  return id !== undefined && id !== null && id > 0;
}

export function isRegisteredAndHasStore(user: any) {
  const id = user ? user.id : null;
  return id !== undefined && id !== null && id > 0 && user.hasStore;
}

const supportedNumbers: any = {
  AU: 'Australia (+61)',
  AE: 'United Arab Emirates (+971)',
  BH: 'Bahrain (+973)',
  CN: 'China (+86)',
  DK: 'Denmark (+45)',
  ES: 'Spain (+34)',
  FR: 'France (+33)',
  GB: 'United Kingdom (+44)',
  HK: 'Hong Kong (+852)',
  ID: 'Indonesia (+62)',
  IN: 'India (+91)',
  IT: 'Italy (+39)',
  KR: 'South Korea (+82)',
  NC: 'New Caledonia (+687)',
  NZ: 'New Zealand (+64)',
  OM: 'Oman (+968)',
  PH: 'Philippines (+63)',
  PT: 'Portugal (+351)',
  QA: 'Qatar (+974)',
  SE: 'Sweden (+46)',
  SG: 'Singapore (+65)',
  TH: 'Thailand (+66)',
  US: 'United States (+1)',
  ZA: 'South Africa (+27)',
};

export const phoneOptions = Object.keys(supportedNumbers).map((key) => ({
  value: key,
  label: supportedNumbers[key],
}));

export const addressComponentsSettingsBackend: any = {
  administrative_area_level_1: 'shortName',
  administrative_area_level_2: 'shortName',
  country: 'shortName',
  establishment: 'longName',
  floor: 'shortName',
  locality: 'longName',
  postal_code: 'shortName',
  premise: 'shortName',
  room: 'longName',
  route: 'shortName',
  street_number: 'shortName',
  sublocality: 'longName',
  subpremise: 'shortName',
};

export function googlePlacesResultAsNewAddress(placeDetails: any) {
  const addressComponents = placeDetails?.addressComponents || [];
  const name = placeDetails?.name || '';
  const address = {
    city: '',
    country: '',
    lineOne: name ? name : '',
    lineTwo: '',
    postcode: '',
    state: '',
  };

  if (addressComponents && addressComponents.length > 0) {
    for (let i = 0; i < addressComponents.length; i++) {
      const addrComponent = addressComponents[i];
      const addrTypes = addrComponent.types;
      
      // Find the first relevant type that we have a setting for
      let addrType = null;
      let componentSetting = null;
      
      for (const type of addrTypes) {
        if (addressComponentsSettingsBackend[type]) {
          addrType = type;
          componentSetting = addressComponentsSettingsBackend[type];
          break;
        }
      }

      if (componentSetting && addrType) {
        const addressVal = addrComponent[componentSetting];
        switch (addrType) {
          case 'establishment':
          case 'room':
          case 'floor':
          case 'street_number':
          case 'premise':
          case 'subpremise':
          case 'route':
            const oldLineOne = address.lineOne;
            address.lineOne = oldLineOne.includes(addressVal) ?
              oldLineOne : `${oldLineOne} ${addressVal}`.trim();
            break;
          case 'locality':
          case 'sublocality':
            const oldCity = address.city ? `${address.city} ` : '';
            address.city = (oldCity + addressVal).trim();
            break;
          case 'administrative_area_level_1':

            address.state = addressVal;
            break;
          case 'administrative_area_level_2':
            break;
          case 'country':

            address.country = addressVal;
            break;
          case 'postal_code':
            address.postcode = addressVal;
            break;
          default:
            break;
        }
      }
    }

    // Clean up line one if it's empty and we have a formatted address
    if (!address.lineOne.trim() && placeDetails?.formattedAddress) {
      // Try to extract street address from formatted address
      const parts = placeDetails.formattedAddress.split(',');
      if (parts.length > 0) {
        address.lineOne = parts[0].trim();
      }
    }

    return address;
  }

  return null;
}

export function addressInOneLine(address: any) {
  const a = address ? address : {};
  const {
    city,
    country,
    lineOne,
    lineTwo,
    postcode,
    state
  } = a;
  const l1 = lineOne ? `${lineOne} ` : '';
  const l2 = lineTwo ? `${lineTwo} ` : '';
  const c = city ? `${city} ` : '';
  const s = state ? `${state} ` : '';
  const p = postcode ? `${postcode} ` : '';
  const countryFull = country ? isoCountries[country] : '';
  return l1 + l2 + c + s + p + countryFull;
}

export enum FieldType {
  TEXT_INPUT = 1,
  SELECT = 2,
  FILE_UPLOAD = 3,
  TEXT_AREA = 4,
  NUMBER_INPUT = 5,
  CHECKBOX = 6,
  RADIO = 7,
  FIELD_INSTRUCTIONS = 8,
  IMAGE_SELECT = 9,
  COLOUR_PICKER = 10,
  COLOUR_SELECT = 11,
}

export function isSelectable(fieldType: number) {
  return [
    FieldType.SELECT,
    FieldType.CHECKBOX,
    FieldType.RADIO,
    FieldType.IMAGE_SELECT,
    FieldType.COLOUR_SELECT
  ].includes(fieldType);
}

export function isInstructionsType(fieldType: number) {
  return String(FieldType.FIELD_INSTRUCTIONS) === String(fieldType);
}

export const countryDefaultDict = (currency: string) => {
  return {currency: currency};
};
  
export const supportedCountryDefaults: any = {
  AE: countryDefaultDict('USD'),
  AU: countryDefaultDict('AUD'),
  BH: countryDefaultDict('USD'),
  CH: countryDefaultDict('CNY'),
  DK: countryDefaultDict('EUR'),
  ES: countryDefaultDict('EUR'),
  FR: countryDefaultDict('EUR'),
  GB: countryDefaultDict('GBP'),
  HK: countryDefaultDict('HKD'),
  ID: countryDefaultDict('USD'),
  IN: countryDefaultDict('INR'),
  IT: countryDefaultDict('EUR'),
  KR: countryDefaultDict('USD'),
  NC: countryDefaultDict('USD'),
  NZ: countryDefaultDict('NZD'),
  OM: countryDefaultDict('USD'),
  PH: countryDefaultDict('USD'),
  PT: countryDefaultDict('EUR'),
  QA: countryDefaultDict('USD'),
  SE: countryDefaultDict('USD'),
  SG: countryDefaultDict('SGD'),
  TH: countryDefaultDict('USD'),
  US: countryDefaultDict('USD'),
  ZA: countryDefaultDict('USD'),
};
  
export const supportedCountryDefaultsWithDefault = (countryCode: any) => {
  const defaultCountryValues = supportedCountryDefaults[countryCode];
  return defaultCountryValues ? defaultCountryValues : supportedCountryDefaults.AU;
};

interface ClientFileAndObjectId {
  file: any;
  objectId: string;
}

export function cleanClientFiles(clientFiles: ClientFileAndObjectId[]) {
  return clientFiles.map((clientFile: ClientFileAndObjectId) => clientFile.file);
}

export function appendClientToOwnDraft(job: any) {
  const { ownDrafts } = job;
  if (job.ownDrafts && job.ownDrafts.length) {
    job.ownDrafts[0].designer = job.client;
  }
  return job;
}

export function redirectOnSuccess(
  url: string, redirectWithValue?: boolean, value?: any) {
  let cleanUrl = url.
    replace('%27', '').
    replace('%91', '').
    replace('%92', '').
    replace('%93', '').
    replace('%94', '');
  window.location.href = decodeURI(
    redirectWithValue ? `${cleanUrl}merchiValue=${value}` : cleanUrl
  );
}
