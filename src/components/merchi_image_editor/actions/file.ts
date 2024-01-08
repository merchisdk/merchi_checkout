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

export async function uploadFileToServerAndChangeName(urlApi: string, file: File, fileName: string): Promise<Response> {
  const newFile = new File([file], fileName, { type: file.type });

  const formData = new FormData();
  formData.append('0', newFile);

  const response = await fetch(`${urlApi}public-upload-job-files/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
  }

  return response;
}

export async function uploadShapeBackgroundImage(urlApi: string, shapeObject: any): Promise<Response> {
  // Step 1: Fetch the blob from the blob URL
  const response = await fetch(shapeObject.backgroundImage);
  const blob = await response.blob();

  // If the blob type is empty, guess the MIME type (you can expand on this logic)
  let mimeType = blob.type;
  if (!mimeType) {
    const blobData = new Uint8Array(await blob.arrayBuffer());
    if (blobData[0] === 0xFF && blobData[1] === 0xD8) {
      mimeType = 'image/jpeg';
    } else if (blobData[0] === 0x89 && blobData[1] === 0x50 && blobData[2] === 0x4E && blobData[3] === 0x47) {
      mimeType = 'image/png';
    } else if (blobData[0] === 0x47 && blobData[1] === 0x49 && blobData[2] === 0x46 && (blobData[3] === 0x38) && (blobData[4] in {0x37: true, 0x39: true}) && blobData[5] === 0x61) {
      mimeType = 'image/gif';
    } else if (blobData[0] === 0x42 && blobData[1] === 0x4D) {
      mimeType = 'image/bmp';
    } else if ((blobData[0] === 0x49 && blobData[1] === 0x49) || (blobData[0] === 0x4D && blobData[1] === 0x4D)) {
      mimeType = 'image/tiff';
    }
    // ... you can expand on this with other file types as necessary ...
  }

  // Step 2: Convert the blob to a File object
  const file = new File([blob], `${shapeObject.id}.${mimeType.split('/')[1]}`, { type: mimeType });

  // Step 3: Upload the file using your uploadFileToServer function
  return uploadFileToServer(urlApi, file);
}
