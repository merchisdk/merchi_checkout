import { Merchi } from 'merchi_sdk_ts';

const merchi = new Merchi();

export async function fetchShippingOptions(addressJson: any, job: any) {
  const { product = {}, quantity = 0 } = job;
  const addressEnt = new merchi.Address()
    .fromJson(addressJson, {makeDirty: true})
    .toFormData({_prefix: 'address-0'});
  const query: any[] = [['quantity', quantity.toString()]];
  return await merchi.authenticatedFetch(
    `/products/${(product as any).id}/shipment_options/`,
    {body: addressEnt, method: 'POST', query}
  );
}
