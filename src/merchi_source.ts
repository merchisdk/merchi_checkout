function cleanIds(raw: any[]) {
  return raw.map(id => id.trim())            // Trim each ID entry to remove whitespace
    .filter(id => /^\d+$/.test(id))  // Use a regular expression to ensure the ID is entirely numeric.
    .map(id => Number(id));          // Convert the remaining, valid ID entries into numbers
}

export function getMerchiSourceJobTagEntities(): any[] {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    const merchiSource = localStorage.getItem('merchi_source');

    if (merchiSource) {
      const ids = cleanIds(merchiSource.split(','));
      return ids.map((id: number) => ({ id }));
    }
    // If "merchi_source" is not found in localStorage, return an empty array.
    return [];
  }
  return [];
}

export function clearMerchiSource() {
  localStorage.removeItem('merchi_source');
}
