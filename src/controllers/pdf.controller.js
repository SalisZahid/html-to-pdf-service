import { catchAsync } from "../utils/catchAsync.js";
import { pdfService } from "../services/pdf.service.js";

// Note: returns raw PDF buffer, not wrapped in JSON
export const htmlToPdf = catchAsync(async (req, res) => {
  const pdfData = await pdfService.generatePdf(req.body);
  // Puppeteer returns a Uint8Array in this setup; convert to Buffer so Express streams raw bytes.
  const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=form.pdf");
  res.setHeader("Content-Length", pdfBuffer.byteLength);
  return res.send(pdfBuffer);
});

