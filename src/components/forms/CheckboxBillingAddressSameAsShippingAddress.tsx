'use client';

interface Props {
  billingAddressSameAsShippingAddress: boolean;
  setBillingAddressSameAsShippingAddress: (value: boolean) => void;
}

export default function CheckboxBillingAddressSameAsShippingAddress({
  billingAddressSameAsShippingAddress,
  setBillingAddressSameAsShippingAddress
}: Props) {
  function toggleBillingAddressSameAsShippingAddress() {
    setBillingAddressSameAsShippingAddress(!billingAddressSameAsShippingAddress);
  }
  return (
    <div className='checkbox cursor-pointer mb-4'>
      <label>
        <input
          className='mr-2 me-2'
          type='checkbox'
          defaultChecked={billingAddressSameAsShippingAddress}
          onChange={toggleBillingAddressSameAsShippingAddress}
        />
        Billing address is the same as delivery address
      </label>
    </div>
  );
}
