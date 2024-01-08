import { PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';

export async function stripeInitPromise(urlApi: string) {
  return await fetch(
    `${urlApi}stripe/master_publishable_key/`,
    { method: 'GET', mode: 'cors' }
  ).then((response: any) => response.key);
}

async function createPaymentIntent(urlApi: string, invoice: any, paymentMethodType?: string) {
  const { id, invoiceToken } = invoice;
  const fetchOptions: any = {
    method: 'GET',
    mode: 'cors',
  };
  const queryParams: any[] = [['invoice_token', invoiceToken]];

  if (paymentMethodType) {
    queryParams.push(['payment_method_types', paymentMethodType]);
  }

  const queryString = new URLSearchParams(queryParams).toString();
  const uri = `stripe/payment_intent/invoice/${id}/`
  const url = `${urlApi}${uri}?${queryString}`;

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error("Failed to create payment intent.");
  }

  return await response.json();
}

async function checkPaymentIntnetIsComplete(urlApi: string, invoice: any) {
  const url = `stripe/payment_intent/invoice/complete/${invoice.id}/`;
  const fetchOptions: any = {
    method: 'GET',
    mode: 'cors',
  };
  const queryString = new URLSearchParams({
    invoice_token: invoice.invoiceToken,
  }).toString();

  const response = await fetch(`${urlApi}${url}?${queryString}`, fetchOptions);
  
  if (!response.ok) {
    throw new Error("Failed to check if payment intent is complete.");
  }

  return await response.json();
}

export async function stripeCardFormSubmit(urlApi: string, stripe: any, card: any, invoice: any) {
  try {
    const intent = await createPaymentIntent(urlApi, invoice);
    const stripePayment = await stripe.confirmCardPayment(intent.stripeClientSecret, { payment_method: { card } });

    if (stripePayment.error) {
      throw new Error(stripePayment.error.message || 'Stripe connect unknown error');
    }

    return await checkPaymentIntnetIsComplete(urlApi, invoice);
  } catch (e) {
    throw e;
  }
}

export async function stripePaymentButtonSubmit(
  urlApi: string,
  stripe: any,
  invoice: any,
  paymentMethodEvent: PaymentRequestPaymentMethodEvent
) {
  const { complete, paymentMethod } = paymentMethodEvent;

  try {
    const intent = await createPaymentIntent(urlApi, invoice);
    const stripePayment = await stripe.confirmCardPayment(
      intent.stripeClientSecret,
      { payment_method: paymentMethod.id },
      { handleActions: false }
    );

    if (stripePayment.error) {
      throw new Error(stripePayment.error.message || 'Stripe unknown error');
    }

    complete('success');
    return await checkPaymentIntnetIsComplete(urlApi, invoice);

  } catch (e) {
    complete('fail');
    throw e;
  }
}
