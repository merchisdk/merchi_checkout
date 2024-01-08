export async function checkStoreName(urlApi: string, name: string) {
  const formData = new FormData();
  formData.append('subDomain', name);

  const fetchOptions: any = {
    method: 'POST',
    body: formData,
  };

  return await fetch(`${urlApi}subdomain_check/`, fetchOptions);
}

export async function createDomainStore(urlApi: string, signUpFormValues: any, user: any) {
  const {
    country,
    logo,
    subDomain,
  } = signUpFormValues;
  const queryObj = {
    country_code: country,
    logo_id: logo.id,
    store_name: subDomain,
    user_id: user.id,
  };
  const fetchOptions: any = {method: 'POST'};
  const queryString = new URLSearchParams(queryObj).toString();
  try { 
    return await fetch(
      `${urlApi}stores/fast_create/?${queryString}`,
      fetchOptions,
    );
  } catch(e) {
    throw e;
  }
}
