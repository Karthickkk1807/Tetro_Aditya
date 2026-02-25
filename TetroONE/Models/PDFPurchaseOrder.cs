using DocumentFormat.OpenXml.Drawing.Charts;
using iText.Barcodes;
using iText.IO.Font;
using iText.IO.Font.Constants;
using iText.IO.Font.Otf;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using iText.Layout.Properties;
using Newtonsoft.Json.Linq;
using SkiaSharp;
using Svg.Skia;
using System.Collections;
using System.Data;
using System.Globalization;
using System.IO;
using System.Text;

namespace TetroONE.Models
{
    public class PDFPurchaseOrder
    {
        //public static DeviceRgb HexToRgb(string hexColor)
        //{
        //    if (hexColor.StartsWith("#"))
        //        hexColor = hexColor.Substring(1);

        //    int r = int.Parse(hexColor.Substring(0, 2), System.Globalization.NumberStyles.HexNumber);
        //    int g = int.Parse(hexColor.Substring(2, 2), System.Globalization.NumberStyles.HexNumber);
        //    int b = int.Parse(hexColor.Substring(4, 2), System.Globalization.NumberStyles.HexNumber);

        //    return new DeviceRgb(r, g, b);
        //}	

        public byte[] PurchaseOrderPrint(int numberOfCopies, PurchaseOrderPrint data)
        {
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

            //DeviceRgb HeaderBackgroundColor = HexToRgb(data.BackroundColour);
            //DeviceRgb HeaderFontColor = HexToRgb(data.TextColour);

            for (int copyIndex = 0; copyIndex < numberOfCopies; copyIndex++)
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    using (PdfWriter writer = new PdfWriter(stream))
                    {
                        using (PdfDocument pdf = new PdfDocument(writer))
                        {
                            Document document = new Document(pdf);

                            var HeaderBackgroundColor = new DeviceRgb(204, 204, 204);
                            var HeaderFontColor = new DeviceRgb(0, 0, 0);
                            DeviceRgb backgroundColor = new DeviceRgb(221, 221, 221);

                            Table HeaderMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 25, 75 })).UseAllAvailableWidth();
                            HeaderMainTable.SetBorderRight(new SolidBorder(1));
                            HeaderMainTable.SetBorderLeft(new SolidBorder(1));
                            HeaderMainTable.SetBorderTop(new SolidBorder(1));
                            HeaderMainTable.SetBorder(Border.NO_BORDER);

                            Table CompanyLogo = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

                            var CompanyLogo1 = "";
                            // Load and prepare the image
                            string imgFolderPath = "wwwroot/assets/PreviewPDF";
                            string imgFileName = CompanyLogo1;
                            string imgPath = System.IO.Path.Combine(imgFolderPath, imgFileName);
                            string fullPath = System.IO.Path.GetFullPath(imgPath);
                            byte[] imageData = null;

                            if (File.Exists(fullPath))
                            {
                                string extension = System.IO.Path.GetExtension(fullPath)?.ToLower();
                                if (extension == ".png" || extension == ".jpg" || extension == ".jpeg" || extension == ".gif")
                                {
                                    imageData = File.ReadAllBytes(fullPath);
                                }
                                else if (extension == ".svg")
                                {
                                    imageData = ConvertSvgToPng(fullPath);
                                }
                                else
                                {
                                    imageData = File.ReadAllBytes("wwwroot/assets/PreviewPDF/KaalaiyanPDFLogo.png");
                                }
                            }
                            else
                            {
                                imageData = File.ReadAllBytes("wwwroot/assets/ModuleImages/PDFImages/AdhithiyaTextilesProcessLogo.png");
                            }

                            iText.Layout.Element.Image img = new iText.Layout.Element.Image(ImageDataFactory.Create(imageData));
                            img.SetWidth(120);
                            img.SetHeight(120);

                            img.SetMargins(-30, 0, 0, 0);

                            Cell imageCell = new Cell().SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP).Add(img).SetPaddingTop(5);

                            CompanyLogo.AddCell(imageCell);

                            Table CompanyName = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyName).SetFont(kabrioBoldFont).SetFontColor(new DeviceRgb(255, 0, 0)).SetFontSize(20).SetFixedLeading(30).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Address1).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Address2).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Phone : " + data.Phone).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("PF Code No. 1: " + data.PFCodeNo).SetFont(kabrioFont)).Add(new Text("            ")).Add(new Text("ESI Code No : " + data.ESICodeNo).SetFont(kabrioFont)).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Email : " + data.Email).SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("GSTin : " + data.GSTin).SetFont(kabrioBoldFont)).Add(new Text("            ")).Add(new Text("MSME Registration No : " + data.MSMERegistrationNo).SetFont(kabrioBoldFont)).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyLogo));
                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyName));

                            document.Add(HeaderMainTable);

                            Table DetailsMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 65, 35 })).UseAllAvailableWidth();
                            DetailsMainTable.SetBorderRight(new SolidBorder(1));
                            DetailsMainTable.SetBorderLeft(new SolidBorder(1));
                            DetailsMainTable.SetBorderTop(new SolidBorder(1));
                            DetailsMainTable.SetBorder(Border.NO_BORDER);

                            Table DetailsTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DetailsTable1.SetBorderBottom(Border.NO_BORDER);
                            DetailsTable1.SetBorderLeft(Border.NO_BORDER);
                            DetailsTable1.SetBorderRight(new SolidBorder(1));
                            DetailsTable1.SetBorderTop(Border.NO_BORDER);

                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("To : ").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ToName).SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ToAddress1).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ToAddress2).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GST" + data.GST).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            Table DetailsTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DetailsTable2.SetBorderBottom(Border.NO_BORDER);
                            DetailsTable2.SetBorderLeft(Border.NO_BORDER);
                            DetailsTable2.SetBorderRight(Border.NO_BORDER);
                            DetailsTable2.SetBorderTop(Border.NO_BORDER);

                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Purchase Order").SetFont(kabrioBoldFont).SetFontSize(14).SetFixedLeading(19).SetTextAlignment(TextAlignment.CENTER)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PO No                     : " + data.PONo).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PO Date                  : " + data.PODate).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Exp Delivery Date : " + data.ExpDeliveryDate).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));

                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable1));
                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable2));

                            document.Add(DetailsMainTable);

                            float[] columnWidths = null;

                            if (data.ProductItemData.Columns.Count == 8)
                            {
                                //for This Width will 8 Column
                                columnWidths = new float[] { 5, 30, 15, 10, 15, 10, 10, 15 };
                            }
                            else if (data.ProductItemData.Columns.Count == 7)
                            {
                                //for This Width will 7 Column
                                columnWidths = new float[] { 5, 40, 15, 10, 15, 10, 15 };
                            }
                             
                            Table ProductItemTable = new Table(UnitValue.CreatePercentArray(columnWidths)).UseAllAvailableWidth();

                            foreach (DataColumn col in data.ProductItemData.Columns)
                            {
                                Paragraph p = new Paragraph(col.ColumnName).SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER);
                                Cell cell = new Cell().Add(p).SetBorderTop(new SolidBorder(1)).SetBorderBottom(new SolidBorder(1)).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetHeight(18);

                                ProductItemTable.AddHeaderCell(cell);
                            }
                            foreach (DataRow row in data.ProductItemData.Rows)
                            {
                                for (int i = 0; i < data.ProductItemData.Columns.Count; i++)
                                {
                                    string cellValue = row[i]?.ToString() ?? "";

                                    TextAlignment align = (i == 1) ? TextAlignment.LEFT : TextAlignment.CENTER;
                                    Paragraph p = new Paragraph(cellValue).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(align);
                                    Cell cell = new Cell().Add(p).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetHeight(18).SetPaddingLeft(i == 1 ? 6 : 0);

                                    ProductItemTable.AddCell(cell);
                                }
                            }
                            int minRowCount = 15;
                            int currentRows = data.ProductItemData.Rows.Count;

                            if (currentRows < minRowCount)
                            {
                                int emptyRows = minRowCount - currentRows;

                                for (int r = 0; r < emptyRows; r++)
                                {
                                    for (int c = 0; c < data.ProductItemData.Columns.Count; c++)
                                    {
                                        Cell emptyCell = new Cell().Add(new Paragraph("")).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetHeight(18);
                                        ProductItemTable.AddCell(emptyCell);
                                    }
                                }
                            }

                            document.Add(ProductItemTable);

                            Table BankAmountTable = new Table(UnitValue.CreatePercentArray(new float[] { 70, 30 })).UseAllAvailableWidth();
                            BankAmountTable.SetBorderBottom(new SolidBorder(1));
                            BankAmountTable.SetBorderLeft(new SolidBorder(1));
                            BankAmountTable.SetBorderRight(new SolidBorder(1));
                            BankAmountTable.SetBorderTop(new SolidBorder(1));

                            Table BankAmountSubTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            BankAmountSubTable1.SetBorder(Border.NO_BORDER);

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Terms & Conditions  :-").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT).SetUnderline()));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.TermsConditions).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            Table BankAmountSubTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 70, 12, 15, 3 })).UseAllAvailableWidth();
                            BankAmountSubTable2.SetBorder(Border.NO_BORDER);

                            if (data.IGSTPer != null)
                            {
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("IGST ( " + data.IGSTPer + "%" + " )").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.IGSTValue).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }
                            if (data.CGSTPer != null)
                            {
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("CGST ( " + data.CGSTPer + " % " + " )").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.CGSTValue).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }
                            if (data.SGSTPer != null)
                            {
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("SGST ( " + data.SGSTPer + " % " + " )").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.SGSTValue).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                                BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Round Off").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.RoundOff).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("NET AMOUNT").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(1)).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph().Add(new Text(data.NetAmount).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable1));
                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable2));

                            document.Add(BankAmountTable);
                             
                            Table AmountTextTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AmountTextTable.SetBorderBottom(new SolidBorder(1));
                            AmountTextTable.SetBorderLeft(new SolidBorder(1));
                            AmountTextTable.SetBorderRight(new SolidBorder(1));
                            AmountTextTable.SetBorderTop(Border.NO_BORDER);

                            AmountTextTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.RupeesInWords).SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(AmountTextTable);

                            Table FooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterTable.SetBorderBottom(new SolidBorder(1));
                            FooterTable.SetBorderLeft(new SolidBorder(1));
                            FooterTable.SetBorderRight(new SolidBorder(1));
                            FooterTable.SetBorderTop(Border.NO_BORDER);

                            Table FooterTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 33, 33, 33 })).UseAllAvailableWidth();
                            FooterTable1.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph("For ").Add(new Text(data.CompanyName).SetFontColor(new DeviceRgb(255, 0, 0))).SetFixedLeading(10).SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.RIGHT)));

                            Table FooterTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 70, 30 })).UseAllAvailableWidth();
                            FooterTable2.SetMarginTop(40);

                            FooterTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Received (Seal With Sign)").SetFont(kabrioFont).SetFontSize(9).SetMarginRight(60).SetFixedLeading(10).SetTextAlignment(TextAlignment.RIGHT)));
                            FooterTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Authorised Signatory").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));

                            FooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterTable1));
                            FooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterTable2));

                            document.Add(FooterTable);


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
            using (Svg.Skia.SKSvg svg = new Svg.Skia.SKSvg())
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

        private string CapitalizeWords(string input)
        {
            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
            return textInfo.ToTitleCase(input);
        }

    }
}
