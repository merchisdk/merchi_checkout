import { encodeMerchiApiData } from './helpers';
import { ProductType } from '../types';
import { appendClientToOwnDraft, cleanClientFiles } from '../utils';

export async function submitBuyNow(urlApi: string, jobJson: any) {
  const clientFiles = cleanClientFiles(jobJson.clientFiles || []);
  const job = appendClientToOwnDraft({...jobJson, clientFiles});
  const itmes = job?.items || [];
  delete job.billing;
  const invoice = {
    client: job.client,
    shipping: job.billing,
    itmes,
    jobs: [job],
    shipments: job.shipment ? [job.shipment] : undefined,
  };
  const formData = encodeMerchiApiData(invoice);
  const fetchOptions: any = {method: 'POST', mode: 'cors', body: formData};
  return await fetch(
    `${urlApi}public-supplier-buy/`,
    fetchOptions,
  );
}

export async function submitQuoteRequest(urlApi: string, jobJson: any) {
  const clientFiles = cleanClientFiles(jobJson.clientFiles || []);
  const job = appendClientToOwnDraft({...jobJson, clientFiles});
  const viewAttr = jobJson.product.productType === ProductType.SUPPLIER_MOD ?
    'mod' : 'supplier';
  const formData = encodeMerchiApiData(job);
  const fetchOptions: any = {method: 'POST', mode: 'cors', body: formData};
  return await fetch(
    `${urlApi}public-${viewAttr}-quote/`,
    fetchOptions,
  );
}
