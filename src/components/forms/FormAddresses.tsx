'use client';
import React from 'react';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import InputsAddress from './InputsAddress';
import CheckboxBillingAddressSameAsShippingAddress from './CheckboxBillingAddressSameAsShippingAddress';
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
  const { job, merchi, nextTab, setJob } = useMerchiCheckboutContext();
  const [
    billingAddressSameAsShippingAddress,
    setBillingAddressSameAsShippingAddress,
  ] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shipmentOptions, setShipmentOptions] = useState([]);
  const hookForm = useForm();
  const {
    getValues,
    handleSubmit,
    reset,
  } = hookForm;
  const debouncedFetchShippingOptions = debounce(async (address: any) => {
    onSelectShipment(null);
    setError(null);
    setLoading(true);
    try {
      const { product = {}, quantity = 0 } = job;
      const addressEnt = new merchi.Address()
        .fromJson(address, {makeDirty: true})
        .toFormData({_prefix: 'address-0'});
      const query: any[] = [['quantity', quantity.toString()]];
      const r = await merchi.authenticatedFetch(
        `/products/${(product as any).id}/shipment_options/`,
        {body: addressEnt, method: 'POST', query}
      );
      setShipmentOptions(r.shipments);
    } catch (e: any) {
      setError(e);
    } finally {
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
