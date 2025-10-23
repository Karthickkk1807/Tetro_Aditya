using iText.Kernel.Pdf;
using iText.Layout.Properties;
using iText.Layout;
using iText.Layout.Element;
using iText.IO.Image;
using iText.Layout.Borders;
using System.Data;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Pdf.Canvas;
using iText.IO.Font.Constants;
using System.Text;
using Newtonsoft.Json.Linq;
using iText.Barcodes;
using iText.IO.Font;
using iText.IO.Font.Otf;
using SkiaSharp;
using Svg.Skia;
using Microsoft.AspNetCore.Components;
using System.Xml.Linq;
using SKSvg = Svg.Skia.SKSvg;

namespace TetroONE.Models
{
    public class PDFEWayBill
    {
        public byte[] EWayBillPrint(PrintEInvoice EWayData)
        {
            string EWayBillNo = "5516 8545 2731";
            string Generated = "33AAP FT637 2H1ZS";
            string ValidFrom = "31/07/2024 07:14 PM [491Kms]";

            List<byte[]> pdfCopies = new List<byte[]>();

            string latoFontPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Font", "Lato", "Lato-Regular.ttf");
            PdfFont latoFont = PdfFontFactory.CreateFont(latoFontPath, PdfEncodings.WINANSI, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);

            string latoBoldFontPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Font", "Lato", "Lato-Bold.ttf");
            PdfFont latoBoldFont = PdfFontFactory.CreateFont(latoBoldFontPath, PdfEncodings.WINANSI, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);

            string notoSansFontPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Font", "NotoSans", "NotoSans-Regular.ttf");
            PdfFont notoSansFont = PdfFontFactory.CreateFont(notoSansFontPath, PdfEncodings.IDENTITY_H, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);

            string notoSansBoldFontPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Font", "NotoSans", "NotoSans-Bold.ttf");
            PdfFont notoSansBoldFont = PdfFontFactory.CreateFont(notoSansBoldFontPath, PdfEncodings.IDENTITY_H, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);

            string kabrioFontPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Font", "kabrio", "Kabrio-Book.ttf");
            PdfFont kabrioFont = PdfFontFactory.CreateFont(kabrioFontPath, PdfEncodings.IDENTITY_H, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);

            string kabrioBoldPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Font", "kabrio", "Kabrio-Bold.ttf");
            PdfFont kabrioBoldFont = PdfFontFactory.CreateFont(kabrioBoldPath, PdfEncodings.IDENTITY_H, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);
            for (int copyIndex = 0; copyIndex < 1; copyIndex++)
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    using (PdfWriter writer = new PdfWriter(stream))
                    {
                        using (PdfDocument pdf = new PdfDocument(writer))
                        {
                            Document document = new Document(pdf);

                            Table HeaderMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            HeaderMainTable.SetBorderRight(new SolidBorder(0));
                            HeaderMainTable.SetBorderLeft(new SolidBorder(0));
                            HeaderMainTable.SetBorderTop(new SolidBorder(0));
                            HeaderMainTable.SetBorderBottom(new SolidBorder(0));

                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("e-Way Bill").SetFont(kabrioBoldFont).SetFontSize(14).SetMarginBottom(-10).SetUnderline().SetTextAlignment(TextAlignment.CENTER)));

                            var EWayBillString = $"EWayBillNo - {EWayData.EWayBillNo} /  Generated - {EWayData.GeneratedBy} / ValidFrom - {EWayData.VaildFrom}";
                            BarcodeQRCode errorQrCode = new BarcodeQRCode(EWayBillString);

                            Image errorQrImage = new Image(errorQrCode.CreateFormXObject(pdf));

                            errorQrImage.SetHeight(100);
                            errorQrImage.SetWidth(100);
                            errorQrImage.SetHorizontalAlignment(HorizontalAlignment.CENTER);

                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(errorQrImage));

                            document.Add(HeaderMainTable);

                            Table EmptyTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            EmptyTable1.SetBorderRight(Border.NO_BORDER);
                            EmptyTable1.SetBorderLeft(Border.NO_BORDER);
                            EmptyTable1.SetBorderTop(Border.NO_BORDER);
                            EmptyTable1.SetBorderBottom(Border.NO_BORDER);
                            EmptyTable1.SetHeight(2);

                            document.Add(EmptyTable1);

                            Table Part1Table = new Table(UnitValue.CreatePercentArray(new float[] { 40, 60 })).UseAllAvailableWidth();
                            Part1Table.SetBorderRight(new SolidBorder(0));
                            Part1Table.SetBorderLeft(new SolidBorder(0));
                            Part1Table.SetBorderTop(new SolidBorder(0));
                            Part1Table.SetBorderBottom(new SolidBorder(0));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("E-Way Bill No").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.EWayBillNo).SetFont(kabrioBoldFont).SetFontSize(12).SetMarginTop(1).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("E-Way Bill Date").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.EWayBillDate).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Generated By").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.GeneratedBy).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Valid From").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.VaildFrom).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Valid Until").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.ValidUntil).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell(1, 2).SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(23).Add(new Paragraph("PART - A").SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(5).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("GSTIN of Supplier").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.GSTINofSupplier).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Place of Dispatch").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.PlaceofDispatch).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("GSTIN of Recipient").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.GSTINofRecipient).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Place of Delivery").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.PlaceofDelivery).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Document No").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.DocumentNo).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Document Date").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.DocumentDate).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Transaction Type").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.TransactionType).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Value of Goods").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.ValueofGoods).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("HSN Code").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.HSNCode).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Reason for Transportation").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.ReasonforTransportation).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).Add(new Paragraph("Transporter").SetFont(kabrioFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));
                            Part1Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(20).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.Transporter).SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            Part1Table.AddCell(new Cell(1, 2).SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetHeight(23).Add(new Paragraph("PART - B").SetFont(kabrioBoldFont).SetFontSize(9).SetMarginTop(5).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(Part1Table);

                            Table Part2Table = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            Part2Table.SetBorderRight(new SolidBorder(0));
                            Part2Table.SetBorderLeft(new SolidBorder(0));
                            Part2Table.SetBorderTop(new SolidBorder(0));
                            Part2Table.SetBorderBottom(new SolidBorder(0));

                            Table Part3Table = new Table(UnitValue.CreatePercentArray(new float[] { 5, 19, 10, 14, 13, 18, 22 })).UseAllAvailableWidth();
                            Part3Table.SetBorderRight(new SolidBorder(0));
                            Part3Table.SetBorderLeft(new SolidBorder(0));
                            Part3Table.SetBorderTop(new SolidBorder(0));
                            Part3Table.SetBorderBottom(new SolidBorder(0));
                            Part3Table.SetMarginTop(-4);
                            Part3Table.SetMarginBottom(-4);
                            Part3Table.SetMarginLeft(-6);
                            Part3Table.SetMarginRight(-6);

                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).Add(new Paragraph("Mode").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph("Vehicle / Trans Doc No & Dt").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph("From").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph("Entered Date").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph("Entered By").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph("CEWB No. (If any)").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph("Multi Veh.Info (If any)").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).Add(new Paragraph(EWayData.Mode).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.VehicleTransDocNoDt).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.From).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.EnteredDate).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.EnteredBy).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.CEWBNo).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            Part3Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).SetBorderLeft(new SolidBorder(0)).Add(new Paragraph(EWayData.MultiVeh).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));


                            Part2Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(10).Add(Part3Table));

                            document.Add(Part2Table);

                            Table Part4Table = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            Part2Table.SetBorderRight(new SolidBorder(0));
                            Part2Table.SetBorderLeft(new SolidBorder(0));
                            Part2Table.SetBorderTop(new SolidBorder(0));
                            Part2Table.SetBorderBottom(Border.NO_BORDER);

                            Barcode128 barcode = new Barcode128(pdf);
                            barcode.SetCode(EWayData.EWayBillNo);

                            Color foregroundColor = new DeviceRgb(0, 0, 0);
                            Color backgroundColor = new DeviceRgb(255, 255, 255);
                            Image barcodeImage = new Image(barcode.CreateFormXObject(foregroundColor, backgroundColor, pdf));

                            barcodeImage.SetMargins(10, 0, 0, 190);
                            barcodeImage.SetBorder(Border.NO_BORDER);
                            barcodeImage.SetWidth(130);
                            barcodeImage.SetHeight(50);

                            Cell cell = new Cell().Add(barcodeImage);
                            cell.SetBorderRight(new SolidBorder(0));
                            cell.SetBorderLeft(new SolidBorder(0));
                            cell.SetBorderTop(new SolidBorder(0));
                            cell.SetBorderBottom(new SolidBorder(0));

                            Part4Table.AddCell(cell);

                            Part4Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(Border.NO_BORDER).Add(new Paragraph(EWayData.EWayBillNo).SetFont(kabrioFont).SetFontSize(8).SetMarginTop(-15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(Part4Table);

                            Table Part5Table = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            Part5Table.SetBorderRight(new SolidBorder(0));
                            Part5Table.SetBorderLeft(new SolidBorder(0));
                            Part5Table.SetBorderTop(new SolidBorder(0));
                            Part5Table.SetBorderBottom(new SolidBorder(0));
                            Part5Table.SetMarginTop(-4);
                            Part5Table.SetHeight(25);

                            Part5Table.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(" Note*: If any discrepancy in information please try after sometime").SetFont(kabrioFont).SetFontSize(10).SetMarginTop(3).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(Part5Table);

                            document.Close();
                        }
                    }
                    pdfCopies.Add(stream.ToArray());
                }
            }
            byte[] combinedPdf = CombinePdfCopies(pdfCopies);
            return combinedPdf;
        }

        private byte[] CombinePdfCopies(List<byte[]> pdfCopies)
        {
            using (MemoryStream combinedStream = new MemoryStream())
            {
                using (PdfDocument combinedPdf = new PdfDocument(new PdfWriter(combinedStream)))
                {
                    foreach (byte[] pdfCopy in pdfCopies)
                    {
                        PdfDocument tempPdf = new PdfDocument(new PdfReader(new MemoryStream(pdfCopy)));
                        tempPdf.CopyPagesTo(1, tempPdf.GetNumberOfPages(), combinedPdf);
                        tempPdf.Close();
                    }
                }
                return combinedStream.ToArray();
            }
        }

        private static byte[] ConvertSvgToPng(string svgFilePath)
        {
            using (SKSvg svg = new SKSvg())
            {
                svg.Load(svgFilePath);
                using (SKBitmap bitmap = new SKBitmap((int)svg.Picture.CullRect.Width, (int)svg.Picture.CullRect.Height))
                {
                    using (SKCanvas canvas = new SKCanvas(bitmap))
                    {
                        canvas.Clear(SKColors.Transparent);
                        canvas.DrawPicture(svg.Picture);
                    }

                    using (SKImage image = SKImage.FromBitmap(bitmap))
                    {
                        using (SKData data = image.Encode(SKEncodedImageFormat.Png, 100))
                        {
                            return data.ToArray();
                        }
                    }
                }
            }
        }
    }
}
