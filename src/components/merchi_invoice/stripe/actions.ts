import { PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';

export async function stripeInitPromise() {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}stripe/master_publishable_key/`,
    { method: 'GET', mode: 'cors' }
  ).then((response: any) => response.key);
}

async function createPaymentIntent(invoice: any, paymentMethodType?: string) {
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
  const url = `${process.env.NEXT_PUBLIC_API_URL}${uri}?${queryString}`;

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error("Failed to create payment intent.");
  }

  return await response.json();
}

async function checkPaymentIntnetIsComplete(invoice: any) {
  const url = `stripe/payment_intent/invoice/complete/${invoice.id}/`;
  const fetchOptions: any = {
    method: 'GET',
    mode: 'cors',
  };
  const queryString = new URLSearchParams({
    invoice_token: invoice.invoiceToken,
  }).toString();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}?${queryString}`, fetchOptions);
  
  if (!response.ok) {
    throw new Error("Failed to check if payment intent is complete.");
  }

  return await response.json();
}

export async function stripeCardFormSubmit(stripe: any, card: any, invoice: any) {
  try {
    const intent = await createPaymentIntent(invoice);
    const stripePayment = await stripe.confirmCardPayment(intent.stripeClientSecret, { payment_method: { card } });

    if (stripePayment.error) {
      throw new Error(stripePayment.error.message || 'Stripe connect unknown error');
    }

    return await checkPaymentIntnetIsComplete(invoice);
  } catch (e) {
    throw e;
  }
}

export async function stripePaymentButtonSubmit(
  stripe: any,
  invoice: any,
  paymentMethodEvent: PaymentRequestPaymentMethodEvent
) {
  const { complete, paymentMethod } = paymentMethodEvent;

  try {
    const intent = await createPaymentIntent(invoice);
    const stripePayment = await stripe.confirmCardPayment(
      intent.stripeClientSecret,
      { payment_method: paymentMethod.id },
      { handleActions: false }
    );

    if (stripePayment.error) {
      throw new Error(stripePayment.error.message || 'Stripe unknown error');
    }

    complete('success');
    return await checkPaymentIntnetIsComplete(invoice);

  } catch (e) {
    complete('fail');
    throw e;
  }
}
