export function companyStripePubKeyOrTestPubKey(company: any) {
  return company.isTesting ? company.stripePublishableTestKey :
    company.stripePublishableKey;
}

export const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      '::placeholder': {
        color: '#999',
        fontSize: '16px',
      },
      fontSize: '16px',
      lineHeight: '1.33',
      paddingTop: '4px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};
