import { urlSearchParams } from "./helpers";

export async function fetchCurrentUser(sessionToken: string) {
  const params: any = urlSearchParams({
    session_token: sessionToken,
    embed: {
      user: {
        emailAddresses: {},
        profilePicture: {},
        userCompanies: {company: {}},
        enrolledDomains: {domain: {}}
      }
    }
  });

  const url = `${process.env.NEXT_PUBLIC_API_URL}sessions/${sessionToken}/?${params}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      return null;
    }
    const session = await response.json();
    return session && session.user ? session.user : null;
  } catch (e: any) {
    return null;
  }
}
