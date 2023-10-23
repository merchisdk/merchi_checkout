import { encodeMerchiApiData } from './helpers';

export async function fetchShippingOptions(addressJson: any, job: any) {
  const { product = {}, quantity = 0 } = job;
  const formData = encodeMerchiApiData(addressJson);
  const fetchOptions: any = {method: 'POST', body: formData}
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}products/${product.id}/shipment_options/?quantity=${quantity}`,
    fetchOptions,
  );
}
