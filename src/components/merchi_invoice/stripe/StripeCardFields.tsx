'use client';
import StripePaymentButtons from './StripePaymentButtons';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  loadStripe,
  PaymentRequestPaymentMethodEvent,
} from '@stripe/stripe-js';
import { CARD_ELEMENT_OPTIONS } from './utils';

type DoStripePaymentRequestForButton = (
  stripe: any,
  event: PaymentRequestPaymentMethodEvent
) => void;

interface FormProps {
  doStripePayment: (values: any) => void;
  doStripePaymentRequestForButton?: DoStripePaymentRequestForButton;
  invoice: any;
  loadingStripePayment: boolean;
  loadingStripePaymentButtons: boolean;
  PaymentButton?: any;
  setLoadingStripePayment: (loading: boolean) => void;
}

function InnerForm({
  doStripePayment,
  doStripePaymentRequestForButton,
  invoice,
  loadingStripePayment,
  loadingStripePaymentButtons,
  PaymentButton,
  setLoadingStripePayment,
}: FormProps) {
  const inputClass = 'form-control p-t-8 stripe-form-control';
  const stripe = useStripe();
  const elements = useElements();
  function paymentStart(e: any) {
    const card = (elements as any).getElement(CardNumberElement) as any;
    setLoadingStripePayment(true);
    e.preventDefault();
    if (!stripe || !elements) {
      setLoadingStripePayment(false);
      return;
    }
    doStripePayment({ card, invoice, stripe });
  }
  return (
    <>
      {loadingStripePaymentButtons ? (
        <div style={{ alignItems: 'center' }}>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            <div className='spinner-merchi-small' />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
            Processing payment
          </p>
        </div>
      ) : (
        <>
          {!!(invoice && doStripePaymentRequestForButton) && (
            <StripePaymentButtons
              doPaymentRequest={(event: PaymentRequestPaymentMethodEvent) =>
                (
                  doStripePaymentRequestForButton as DoStripePaymentRequestForButton
                )(stripe, event)
              }
              invoice={invoice}
            />
          )}
          <form onSubmit={paymentStart}>
            <label>
              <strong>Card details</strong>
            </label>
            <div className='d-flex flex-column gap-1'>
              <CardNumberElement
                className={inputClass}
                {...CARD_ELEMENT_OPTIONS}
              />
              <CardExpiryElement
                className={inputClass}
                {...CARD_ELEMENT_OPTIONS}
              />
              <CardCvcElement
                className={inputClass}
                {...CARD_ELEMENT_OPTIONS}
              />
              <PaymentButton loading={loadingStripePayment} />
            </div>
          </form>
        </>
      )}
    </>
  );
}

interface Props {
  doStripePayment: (values: any) => void;
  doStripePaymentRequestForButton?: (
    stripe: any,
    event: PaymentRequestPaymentMethodEvent
  ) => void;
  invoice: any;
  loadingStripePayment: boolean;
  loadingStripePaymentButtons: boolean;
  PaymentButton?: any;
  setLoadingStripePayment: (loading: boolean) => void;
  stripePubKey: string;
}

function FormStripeCardFields({
  doStripePayment,
  doStripePaymentRequestForButton,
  invoice,
  loadingStripePayment,
  loadingStripePaymentButtons,
  PaymentButton,
  setLoadingStripePayment,
  stripePubKey,
}: Props) {
  return stripePubKey ? (
    <Elements stripe={loadStripe(stripePubKey)}>
      <InnerForm
        doStripePayment={doStripePayment}
        doStripePaymentRequestForButton={doStripePaymentRequestForButton}
        invoice={invoice}
        loadingStripePayment={loadingStripePayment}
        loadingStripePaymentButtons={loadingStripePaymentButtons}
        setLoadingStripePayment={setLoadingStripePayment}
        PaymentButton={PaymentButton}
      />
    </Elements>
  ) : (
    <div style={{ alignItems: 'center' }}>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        <div className='spinner-merchi-small' />
      </div>
    </div>
  );
}

export default FormStripeCardFields;
