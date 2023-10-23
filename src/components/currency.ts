export const currencyMap: any =
  {ALL: 'L',
    AFN: '؋',
    ARS: '$',
    AWG: 'ƒ',
    AUD: '$',
    AZN: '₼',
    BSD: '$',
    BBD: '$',
    BYR: 'p.',
    BZD: 'BZ$',
    BMD: '$',
    BOB: 'Bs.',
    BAM: 'KM',
    BWP: 'P',
    BGN: 'лв',
    BRL: 'R$',
    BND: '$',
    KHR: '៛',
    CAD: '$',
    KYD: '$',
    CLP: '$',
    CNY: '¥',
    COP: '$',
    CRC: '₡',
    HRK: 'kn',
    CUP: '₱',
    CZK: 'Kč',
    DKK: 'kr',
    DOP: 'RD$',
    XCD: '$',
    EGP: '£',
    SVC: '$',
    EEK: 'kr',
    EUR: '€',
    FKP: '£',
    FJD: '$',
    GHC: '₵',
    GIP: '£',
    GTQ: 'Q',
    GGP: '£',
    GYD: '$',
    HNL: 'L',
    HKD: '$',
    HUF: 'Ft',
    ISK: 'kr',
    INR: '₹',
    IDR: 'Rp',
    IRR: '﷼',
    IMP: '£',
    ILS: '₪',
    JMD: '`J$',
    JPY: '¥',
    JEP: '£',
    KES: 'KSh',
    KZT: 'лв',
    KPW: '₩',
    KRW: '₩',
    KGS: 'лв',
    LAK: '₭',
    LVL: 'Ls',
    LBP: '£',
    LRD: '$',
    LTL: 'Lt',
    MKD: 'ден',
    MYR: 'RM',
    MUR: '₨',
    MXN: '$',
    MNT: '₮',
    MZN: 'MT',
    NAD: '$',
    NPR: '₨',
    ANG: 'ƒ',
    NZD: '$',
    NIO: 'C$',
    NGN: '₦',
    NOK: 'kr',
    OMR: '﷼',
    PKR: '₨',
    PAB: 'B/.',
    PYG: 'Gs',
    PEN: 'S/.',
    PHP: '₱',
    PLN: 'zł',
    QAR: '﷼',
    RON: 'lei',
    RUB: '₽',
    RMB: '￥',
    SHP: '£',
    SAR: '﷼',
    RSD: 'Дин.',
    SCR: '₨',
    SGD: '$',
    SBD: '$',
    SOS: 'S',
    ZAR: 'R',
    LKR: '₨',
    SEK: 'kr',
    CHF: 'CHF',
    SRD: '$',
    SYP: '£',
    TZS: 'TSh',
    TWD: 'NT$',
    THB: '฿',
    TTD: 'TT$',
    TRY: '₺',
    TRL: '₤',
    TVD: '$',
    UGX: 'USh',
    UAH: '₴',
    GBP: '£',
    USD: '$',
    UYU: '$U',
    UZS: 'лв',
    VEF: 'Bs',
    VND: '₫',
    YER: '﷼',
    ZWD: 'Z$'};

export function formatCurrency(amount: any, options: any) {
  /*
    *   Example usage:

            formatCurrency(-222.123456, {currency: 'EGP',
                                         showCodeIfNoSymbol: true,
                                         financialNegative: true,
                                         decimalPlaces: 3})

            --> '(£222.123)'
    */

  let symbol;
  let negative = false;
  let result;
  options = options || {};
  options.currency = options.currency || 'AUD';
  options.showCodeIfNoSymbol = options.showCodeIfNoSymbol || true;
  options.symbolAfterAmount = options.symbolAfterAmount || false;
  options.financialNegative = options.financialNegative || false;
  options.codeAfterSymbol = options.codeAfterSymbol || false;
  options.codeBeforeSymbol = options.codeBeforeSymbol || false;
  options.spaceBetweenSymbol = options.spaceBetweenSymbol || false;
  options.decimalPlaces = options.decimalPlaces || 2;
  options.decimalSeperator = options.decimalSeperator || '.';
  options.codeAfterAmount = options.codeAfterAmount || false;
  if (amount < 0.0) {
    negative = true;
        amount *= -1.0; // eslint-disable-line
  }
  if (Object.prototype.hasOwnProperty.call(currencyMap, options.currency)) {
    symbol = currencyMap[options.currency];
    if (options.codeAfterSymbol) {
      symbol += '(' + options.currency + ') ';
    }
    if (options.codeBeforeSymbol) {
      symbol = `(${options.currency}) ${symbol}`;
    }
  } else if (options.showCodeIfNoSymbol) {
    symbol = options.currency;
  } else {
    symbol = '';
  }
    amount = amount.toFixed(options.decimalPlaces);
    amount = amount.replace('.', options.decimalSeperator);
  if (options.symbolAfterAmount) {
    result = amount;
    if (options.spaceBetweenSymbol) {
      result += ' ';
    }
    result += symbol;
  } else {
    result = symbol;
    if (options.spaceBetweenSymbol) {
      result += ' ';
    }
    result += amount;
  }
  if (negative) {
    if (options.financialNegative) {
      result = `(${result})`;
    } else {
      result = `-${result}`;
    }
  }
  if (options.codeAfterAmount === true) {
    result += ` (${options.currency})`;
  }
  return result;
}

function taxPercent(tax: any) {
  return tax ? `(${tax.taxPercent}%)` : '';
}

function includesTax(tax: any) {
  return tax && tax.taxPercent > 0 ?
    ` inc ${tax.taxName} ${taxPercent(tax)}` : '';
}

export function calculateTotalWithTax(total: number, tax: any) {
  let taxMultiplier = 1.0;
  if (tax && tax.taxPercent > 0) {
    taxMultiplier += tax.taxPercent / 100;
    taxMultiplier = parseFloat(taxMultiplier.toFixed(2));
  }
  let grandTotal = total * taxMultiplier;
  return parseFloat(grandTotal.toFixed(2));
}

export function currencyTaxAndCost(currency: string, tax: any, theCost: number) {
  const currencyOptions = {currency: currency, showCodeIfNoSymbol: false};
  const totalCost = calculateTotalWithTax(theCost, tax);
  const withCurrency = formatCurrency(totalCost, currencyOptions);
  return `${currency} ${withCurrency} ${includesTax(tax)}`;
}

export function currencyTotalCostShowIncTax(job: any) {
  const { currency, taxType, totalCost } = job;
  const currencyOptions = {currency, showCodeIfNoSymbol: false};
  const withCurrency = formatCurrency(
    totalCost ? totalCost : 0,
    currencyOptions
  );
  return `${currency} ${withCurrency} ${includesTax(taxType)}`;
}
