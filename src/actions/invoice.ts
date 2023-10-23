const urlToFile = async (url: string, filename: string, type: string) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type });
};

const urlToFilePdf = async (url: string, filename: string) => {
  const file = await urlToFile(url, filename, 'application/pdf');
  return file;
};

export async function generatePublicInvoicePdf(invoice: any, receipt?: boolean) {
  const id = invoice.id;
  const domain = invoice.domain.emailDomain;

  const queryString = new URLSearchParams({
    invoice_token: invoice.invoiceToken
  }).toString();

  const fetchOptions: any = {
    method: 'GET',
    mode: 'cors'
  };
  const uri = receipt ? '/generate/receipt/pdf/' : '/generate/pdf/';
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}invoices/${id}${uri}?${queryString}`,
      fetchOptions
    );

    if (!response.ok) {
      throw new Error("Error fetching PDF.");
    }

    const r = await response.json();
    const pdf = await urlToFilePdf(
      `data:application/pdf;base64,${r.pdf}`,
      `${domain}-invoice-${id}.pdf`
    );

    const url = URL.createObjectURL(pdf);
    const doc = (document as any);
    const anchor = doc.createElement('a');
    anchor.href = url;
    anchor.download = pdf.name;

    // Append to the DOM
    doc.body.appendChild(anchor);

    // Trigger `click` event
    anchor.click();

    // Remove element from DOM
    doc.body.removeChild(anchor);

    return { success: true };
  } catch (e: any) {
    throw e;
  }
}
