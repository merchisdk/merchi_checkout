export async function checkStoreName(name: string) {
  const formData = new FormData();
  formData.append('subDomain', name);

  const fetchOptions: any = {
    method: 'POST',
    body: formData,
  };

  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}subdomain_check/`,
    fetchOptions
  );
}

export async function createDomainStore(signUpFormValues: any, user: any) {
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
      `${process.env.NEXT_PUBLIC_API_URL}stores/fast_create/?${queryString}`,
      fetchOptions,
    );
  } catch(e) {
    throw e;
  }
}
