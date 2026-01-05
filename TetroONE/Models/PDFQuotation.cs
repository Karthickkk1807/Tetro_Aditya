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
    public class PDFQuotation
    {
        public byte[] QuotationPrintPDF(int numberOfCopies, QuotationPrint data)
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
                            DetailsTable1.SetBorderRight(Border.NO_BORDER);
                            DetailsTable1.SetBorderTop(Border.NO_BORDER);

                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("To : ").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ClientName).SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                             
                            Table DetailsTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DetailsTable2.SetBorderBottom(Border.NO_BORDER);
                            DetailsTable2.SetBorderLeft(new SolidBorder(1));
                            DetailsTable2.SetBorderRight(Border.NO_BORDER);
                            DetailsTable2.SetBorderTop(Border.NO_BORDER);

                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Rate Quotation").SetFont(kabrioBoldFont).SetFontSize(14).SetFixedLeading(19).SetTextAlignment(TextAlignment.CENTER)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Quotation No : " + data.QuotationNo).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date                 : " + data.QuotationDate).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Validity            : " + data.Validity).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));

                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable1));
                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable2));

                            document.Add(DetailsMainTable);


                            Table DearMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DearMainTable.SetBorderRight(new SolidBorder(1));
                            DearMainTable.SetBorderLeft(new SolidBorder(1));
                            DearMainTable.SetBorderTop(new SolidBorder(1));
                            DearMainTable.SetBorder(Border.NO_BORDER);

                            DearMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Sir).SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DearMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.SirContent).SetMarginLeft(39).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(DearMainTable);
                              
                            float[] columnWidths = new float[] { 5, 55, 20, 20 };
                            
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

                                    //TextAlignment align = (i == 1) ? TextAlignment.LEFT : TextAlignment.CENTER;
                                    Paragraph p = new Paragraph(cellValue).SetFont(kabrioFont).SetFontSize(11).SetTextAlignment(TextAlignment.CENTER);
                                    Cell cell = new Cell().Add(p).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetFontSize(15).SetPaddingLeft(i == 1 ? 6 : 0);

                                    ProductItemTable.AddCell(cell);
                                }
                            }
                            int minRowCount = 18;
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

                            Table ExtraTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            ExtraTable.SetBorderBottom(new SolidBorder(1));
                            ExtraTable.SetBorderLeft(new SolidBorder(1));
                            ExtraTable.SetBorderRight(new SolidBorder(1));
                            ExtraTable.SetBorderTop(new SolidBorder(1));

                            ExtraTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.FooterContent).SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(ExtraTable);
                             
                            Table FooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
                            FooterTable.SetBorderBottom(new SolidBorder(1));
                            FooterTable.SetBorderLeft(new SolidBorder(1));
                            FooterTable.SetBorderRight(new SolidBorder(1));
                            FooterTable.SetBorderTop(Border.NO_BORDER);

                            Table FooterTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterTable1.SetMarginBottom(60);

                            FooterTable1.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph("Thanking You,").SetFixedLeading(10).SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            FooterTable1.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph("For").Add(new Text(" Adhithiya Textiles Process").SetFontColor(new DeviceRgb(255, 0, 0))).SetFixedLeading(10).SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            Table FooterTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

                            FooterTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Receivers Sign with Seal").SetFont(kabrioBoldFont).SetFontSize(9).SetMarginRight(60).SetFixedLeading(10).SetTextAlignment(TextAlignment.RIGHT)));
                            
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
