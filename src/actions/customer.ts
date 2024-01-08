import { encodeMerchiApiData } from './helpers';

export async function tryReturningCustomerEmail(urlApi: string, emailAddress: string) {
  const queryString = new URLSearchParams({email_address: emailAddress}).toString();
  const fetchOptions: any = {method: 'POST'};

  return await fetch(
    `${urlApi}user-check-email/?${queryString}`,
    fetchOptions,
  );
}

export async function createNewCustomer(urlApi: string, customerJson: any) {
  const formData = encodeMerchiApiData(customerJson);
  const fetchOptions: any = {method: 'POST', body: formData}
  return await fetch(
    `${urlApi}public_user_create/`,
    fetchOptions,
  );
}
