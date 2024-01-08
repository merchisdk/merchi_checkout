'use client';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import InputsAddress from './InputsAddress';
import CheckboxBillingAddressSameAsShippingAddress from './CheckboxBillingAddressSameAsShippingAddress';
import { fetchShippingOptions } from '../../actions/shipping';
import InputError from './InputError';
import { ListShipmentQuoteOptions } from '../lists';

interface PropsAddress {
  defaultAddress?: any;
  labelGeoSuggest?: string;
  hookForm: any;
  name?: string;
  placeholder?: string;
  updateAddress: (address: any) => void;
}

const ShippingAddressInputs = (props: PropsAddress) => (
  <InputsAddress {...props} name='shippingAddress' />
);
const BillingAddressInputs = (props: PropsAddress) => (
  <InputsAddress {...props} name='billingAddress' />
);

interface Props {
  formId: string;
}

function FormAddresses({ formId }: Props) {
  const { job, nextTab, setJob, urlApi } = useMerchiCheckboutContext();
  const [
    billingAddressSameAsShippingAddress,
    setBillingAddressSameAsShippingAddress,
  ] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shipmentOptions, setShipmentOptions] = useState([]);
  const hookForm = useForm();
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
  } = hookForm;
  const debouncedFetchShippingOptions = debounce(async (address: any) => {
    try {
      onSelectShipment(null);
      setError(null);
      setLoading(true);
      const r = await fetchShippingOptions((urlApi as string), address, job);
      if (r.ok) {
        const shipmentsJson = await r.json();
        setShipmentOptions(shipmentsJson.shipments);
      } else {
        setError({ message: 'Unable to fetch shipment options' } as any);
      }
      setLoading(false);
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }, 1000);
  async function updateAddress(name: string, fetch: boolean, address: any) {
    const values = getValues();
    values[name] = address;
    reset(values);
    if (fetch) {
      debouncedFetchShippingOptions(address);
    }
  }
  function onSelectShipment(shipment: any) {
    setJob({ ...job, shipment });
  }
  async function onSubmit(values: any) {
    const address = values.shippingAddress;
    const newJob = { ...job };
    newJob.shipping = address;
    newJob.billing = billingAddressSameAsShippingAddress
      ? address
      : values.billingAddress;
    setJob(newJob);
    nextTab();
  }
  return (
    <>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <ShippingAddressInputs
          defaultAddress={job.shipping}
          hookForm={hookForm}
          name='shippingAddress'
          updateAddress={(addr: any) =>
            updateAddress('shippingAddress', true, addr)
          }
        />
        <CheckboxBillingAddressSameAsShippingAddress
          billingAddressSameAsShippingAddress={
            billingAddressSameAsShippingAddress
          }
          setBillingAddressSameAsShippingAddress={
            setBillingAddressSameAsShippingAddress
          }
        />
        {!billingAddressSameAsShippingAddress && (
          <BillingAddressInputs
            defaultAddress={job.billing}
            hookForm={hookForm}
            labelGeoSuggest='Billing Address'
            name='billingAddress'
            updateAddress={(addr: any) =>
              updateAddress('billingAddress', false, addr)
            }
          />
        )}
        <InputError error={error || {}} />
        <ListShipmentQuoteOptions
          doSelectShipmentOption={onSelectShipment}
          loading={loading}
          selectedOption={job.shipment}
          shipmentOptions={shipmentOptions}
        />
      </form>
    </>
  );
}

export default FormAddresses;
