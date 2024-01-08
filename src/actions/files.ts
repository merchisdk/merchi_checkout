export async function uploadFileToServer(urlApi: string, file: File): Promise<Response> {
  const formData = new FormData();
  formData.append('0', file);

  const response = await fetch(`${urlApi}public-upload-job-files/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
  }

  return response;
}
