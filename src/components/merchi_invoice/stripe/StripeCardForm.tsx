'use client';
import { useEffect, useState } from 'react';
import FormStripeCardFields from './StripeCardFields';
import {
  stripeCardFormSubmit,
  stripeInitPromise,
  stripePaymentButtonSubmit,
} from './actions';
import { PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import { companyStripePubKeyOrTestPubKey } from './utils';

const badgeTestMode = <div style={{color: 'red'}}>Test mode</div>;

interface Props {
  alertErrorShow: (message: string) => void;
  callbackStripePaymentSuccess: (invoiceJson: any) => void;
  invoice: any;
  PaymentButton?: any;
}

function StripeCardForm({
  alertErrorShow,
  callbackStripePaymentSuccess,
  invoice,
  PaymentButton,
}: Props) {
  const { domain } = invoice;
  const company = domain.company;
  const hasCompanyPubKey = Boolean(company.isStripeValid && companyStripePubKeyOrTestPubKey(company));
  const companyPubKey = hasCompanyPubKey ? companyStripePubKeyOrTestPubKey(company) : '';
  const canUseConnect = !!company.stripeAccountId;
  const [loadingStripePayment, setLoadingStripePayment] = useState(false);
  const [loadingStripePaymentButtons, setLoadingStripePaymentButtons] = useState(false);
  async function doStripePayment(r: any) {
    setLoadingStripePayment(true);
    try {
      const response = await stripeCardFormSubmit(r.stripe, r.card, invoice);
      callbackStripePaymentSuccess(response);
      setLoadingStripePayment(false);
    } catch (e: any) {
      setLoadingStripePayment(false);
      alertErrorShow(e.message);
    }
  }
  async function doStripePaymentRequestForButton(
    stripe: any, event: PaymentRequestPaymentMethodEvent
  ) {
    setLoadingStripePaymentButtons(true);
    try {
      const response = await stripePaymentButtonSubmit(stripe, invoice, event);
      callbackStripePaymentSuccess(response);
      setLoadingStripePaymentButtons(false);
    } catch (e: any) {
      setLoadingStripePaymentButtons(false);
      alertErrorShow(e.message);
    }
  }
  const [stripePublicKey, setStripePublicKey] = useState(companyPubKey);
  useEffect(() => {
    if (!stripePublicKey && canUseConnect) stripeInitPromise().then(setStripePublicKey)
  }, [stripePublicKey, canUseConnect]);
  return (
    <>
      {company.isTesting && badgeTestMode}
      <FormStripeCardFields
        doStripePayment={doStripePayment}
        doStripePaymentRequestForButton={doStripePaymentRequestForButton}
        invoice={invoice}
        loadingStripePayment={loadingStripePayment}
        loadingStripePaymentButtons={loadingStripePaymentButtons}
        PaymentButton={PaymentButton}
        setLoadingStripePayment={setLoadingStripePayment}
        stripePubKey={stripePublicKey}
      />
    </>
  );
}

export default StripeCardForm;
