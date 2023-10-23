import { encodeMerchiApiData } from './helpers';

export async function tryReturningCustomerEmail(emailAddress: string) {
  const queryString = new URLSearchParams({email_address: emailAddress}).toString();
  const fetchOptions: any = {method: 'POST'};

  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}user-check-email/?${queryString}`,
    fetchOptions,
  );
}

export async function createNewCustomer(customerJson: any) {
  const formData = encodeMerchiApiData(customerJson);
  const fetchOptions: any = {method: 'POST', body: formData}
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}public_user_create/`,
    fetchOptions,
  );
}
