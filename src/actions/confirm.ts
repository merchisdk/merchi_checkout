import { encodeMerchiApiData } from './helpers';
import { ProductType } from '../types';
import { appendClientToOwnDraft, cleanClientFiles } from '../utils';
import { getMerchiSourceJobTagEntities } from '../merchi_source';
import { jobSourceFieldsForApi } from '../job_source';

export async function submitBuyNow(urlApi: string, jobJson: any) {
  const clientFiles = cleanClientFiles(jobJson.clientFiles || []);
  const tags = getMerchiSourceJobTagEntities() || [];
  const billing = jobJson.billing;
  const shipping = jobJson.shipping || billing;
  const job = appendClientToOwnDraft({
    ...jobJson,
    ...jobSourceFieldsForApi(),
    clientFiles,
    tags,
    shipping,
  });
  const items = job?.items || [];
  delete job.billing;
  const invoice = {
    client: job.client,
    shipping: billing || shipping,
    items,
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
  const tags = getMerchiSourceJobTagEntities() || [];
  const job = appendClientToOwnDraft({...jobJson, ...jobSourceFieldsForApi(), clientFiles, tags});
  const viewAttr = jobJson.product.productType === ProductType.SUPPLIER_MOD ?
    'mod' : 'supplier';
  const formData = encodeMerchiApiData(job);
  const fetchOptions: any = {method: 'POST', mode: 'cors', body: formData};
  return await fetch(
    `${urlApi}public-${viewAttr}-quote/`,
    fetchOptions,
  );
}
