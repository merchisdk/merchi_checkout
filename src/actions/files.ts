export async function uploadFileToServer(file: File): Promise<Response> {
  const formData = new FormData();
  formData.append('0', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}public-upload-job-files/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
  }

  return response;
}
