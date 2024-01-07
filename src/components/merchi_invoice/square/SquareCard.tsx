'use client';
import { useState } from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { currencyMap } from '../currency';

export async function actionSquarePaymentProcess(
  invoice: any,
  sourceId: string,
) {
  let invoiceJson = invoice;
  let url = `${process.env.NEXT_PUBLIC_API_URL}invoice/${invoiceJson.id}/square/payment/`;
  const fetchOptions: any = {
    method: 'GET',
    query: [['sourceId', sourceId]],
  };
  fetchOptions.query.push(['invoice_token', invoiceJson.invoiceToken]);
  return await fetch(url, fetchOptions);
}


declare const SQUARE_APPLICATION_ID: string;

interface Props {
  alertErrorShow: (message: string) => void;
  invoice: any;
  callbackPaymentSuccess: (invoiceJson: any) => void;
}

function SquareCard({
  alertErrorShow,
  invoice,
  callbackPaymentSuccess,
}: Props) {
  const [laoding, setLoading] = useState(false);
  const { currency, domain, totalCost } = invoice;
  const company = domain.company;
  function ButtonText() {
    return (
      <span>
        Pay {currencyMap[currency]}
        {totalCost}<small> / inc tax</small>
      </span>
    );
  }
  const squareWebLocationId = company.squareWebLocationId;
  async function submit(sourceId: any) {
    setLoading(true);
    try {
      const r =  await actionSquarePaymentProcess(invoice, sourceId);
      setLoading(false);
      callbackPaymentSuccess(r)
    } catch (e: any) {
      alertErrorShow(e.message);
      setLoading(false);
    }
  }
  return squareWebLocationId ?
    (
      <PaymentForm
        /**
         * Identifies the calling form with a verified application ID generated from
         * the Square Application Dashboard.
         */
        applicationId={SQUARE_APPLICATION_ID}
        /**
         * Invoked when payment form receives the result of a tokenize generation
         * request. The result will be a valid credit card or wallet token, or an error.
         */
        cardTokenizeResponseReceived={(token: any, buyer: any) =>
          submit(token.token)
        }
        /**
         * Identifies the location of the merchant that is taking the payment.
         * Obtained from the Square Application Dashboard - Locations tab.
         */
        locationId={squareWebLocationId}
      >
        <CreditCard>
          <ButtonText />
        </CreditCard>
      </PaymentForm>
    )
  :
    <></>;
}

export default SquareCard;
