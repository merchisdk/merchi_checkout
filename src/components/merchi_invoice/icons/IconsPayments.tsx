'use client';
import pngStripe from '../images/tile-stripe.png';

export default function IconsPayments() {
  return (
    <img
      src={pngStripe.src}
      title='pay with credit card'
      alt='checkout with Stripe'
      style={{ width: '100%' }}
    />
  );
}
