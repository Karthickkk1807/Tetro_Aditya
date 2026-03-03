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
using iText.Kernel.Pdf.Xobject;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using iText.Layout.Layout;
using iText.Layout.Properties;
using iText.Layout.Renderer;
using Newtonsoft.Json.Linq;
using SkiaSharp;
using Svg.Skia;
using System.Collections;
using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TetroONE.Models
{
    public class GreyFabricStockPrint
    {
        public byte[] GreyFabricPrint(int numberOfCopies, GreyFabricPrint data)
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
                            document.SetMargins(20, 40, 20, 40);

                            var HeaderBackgroundColor = new DeviceRgb(204, 204, 204);
                            var HeaderFontColor = new DeviceRgb(0, 0, 0);
                            DeviceRgb backgroundColor = new DeviceRgb(221, 221, 221);

                            Table HeaderMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 10, 90 })).UseAllAvailableWidth();
                            HeaderMainTable.SetBorderRight(Border.NO_BORDER);
                            HeaderMainTable.SetBorderLeft(Border.NO_BORDER);
                            HeaderMainTable.SetBorderTop(Border.NO_BORDER);
                            HeaderMainTable.SetBorderBottom(Border.NO_BORDER);
                            //HeaderMainTable.SetBorder(Border.NO_BORDER);

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
                                    imageData = File.ReadAllBytes("wwwroot/assets/PreviewPDF/AdhithiyaLogo.png");
                                }
                            }
                            else
                            {
                                imageData = File.ReadAllBytes("wwwroot/assets/ModuleImages/PDFImages/AdhithiyaLogo.png");
                            }

                            iText.Layout.Element.Image img = new iText.Layout.Element.Image(ImageDataFactory.Create(imageData));
                            img.SetWidth(110);
                            img.SetHeight(100);

                            img.SetMargins(-20, 0, -25, -30);

                            Cell imageCell = new Cell().SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP).Add(img).SetPaddingTop(5);

                            CompanyLogo.AddCell(imageCell);

                            Table CompanyName = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyName).SetFont(kabrioBoldFont).SetMarginTop(10).SetMarginLeft(-35).SetFontColor(new DeviceRgb(255, 0, 0)).SetFontSize(18).SetFixedLeading(30).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyLogo));
                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyName));

                            document.Add(HeaderMainTable);

                            Table HeaderMainTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            HeaderMainTable1.SetBorderBottom(Border.NO_BORDER);
                            HeaderMainTable1.SetBorderLeft(Border.NO_BORDER);
                            HeaderMainTable1.SetBorderRight(Border.NO_BORDER);
                            HeaderMainTable1.SetBorderTop(Border.NO_BORDER);

                            HeaderMainTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Fabric Stock List From " + data.FromDate + " To " + data.ToDate).SetFont(kabrioBoldFont).SetFontSize(14).SetFixedLeading(15).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(HeaderMainTable1);

                            // ======================
                            // FABRIC STOCK TABLE
                            // ======================
                            float[] columnWidths = { 22, 12, 16, 14, 22, 8, 12 };

                            Table ProductItemTable = new Table(UnitValue.CreatePercentArray(columnWidths))
                                .UseAllAvailableWidth()
                                .SetMarginTop(10);

                            // ===== HEADER (Dotted Bottom Like Image) =====
                            string[] headers = {
    "Client",
    "Storage",
    "DC No",
    "Date",
    "Colour",
    "Rolls",
    "Weight"
};

                            foreach (var header in headers)
                            {
                                ProductItemTable.AddHeaderCell(
                                    new Cell()
                                    .Add(new Paragraph(header)
                                    .SetFont(kabrioBoldFont)
                                    .SetFontSize(10))
                                    .SetBorder(Border.NO_BORDER)
                                    .SetBorderBottom(new DottedBorder(1))
                                    .SetPaddingBottom(5)

                                );
                            }


                            // ===== BODY =====
                            foreach (DataRow row in data.DynamicItemData.Rows)
                            {
                                string client = row["ClientName"]?.ToString();
                                string storage = row["StorageLocationName"]?.ToString();
                                string dcNo = row["ClientDcNumber"]?.ToString();
                                string inward = row["InWardDate"] == DBNull.Value? "" : Convert.ToDateTime(row["InWardDate"]).ToString("dd-MM-yyyy");
                                string color = row["ColorName"]?.ToString();
                                string rolls = row["NoOfRolls"]?.ToString();
                                string qty = row["Qty"]?.ToString();

                                bool isTotalRow = dcNo == "TOTAL";

                                if (!isTotalRow)
                                {
                                    ProductItemTable.AddCell(
                                        new Cell().Add(new Paragraph(client ?? "")
                                        .SetFont(kabrioFont).SetFontSize(9))
                                        .SetBorder(Border.NO_BORDER));

                                    ProductItemTable.AddCell(
                                        new Cell().Add(new Paragraph(storage ?? "")
                                        .SetFont(kabrioFont).SetFontSize(9))
                                        .SetBorder(Border.NO_BORDER));

                                    ProductItemTable.AddCell(
                                        new Cell().Add(new Paragraph(dcNo ?? "")
                                        .SetFont(kabrioFont).SetFontSize(9))
                                        .SetBorder(Border.NO_BORDER));

                                    ProductItemTable.AddCell(
                                        new Cell().Add(new Paragraph(inward ?? "")
                                        .SetFont(kabrioFont).SetFontSize(9))
                                        .SetBorder(Border.NO_BORDER));

                                    ProductItemTable.AddCell(
                                        new Cell().Add(new Paragraph(color ?? "")
                                        .SetFont(kabrioFont).SetFontSize(9))
                                        .SetBorder(Border.NO_BORDER));

                                    ProductItemTable.AddCell(
                                        new Cell().Add(new Paragraph(rolls ?? "")
                                        .SetFont(kabrioFont).SetFontSize(9)
                                        .SetTextAlignment(TextAlignment.CENTER))
                                        .SetBorder(Border.NO_BORDER));

                                    ProductItemTable.AddCell(
                                        new Cell().Add(new Paragraph(qty ?? "")
                                        .SetFont(kabrioFont).SetFontSize(9)
                                        .SetTextAlignment(TextAlignment.RIGHT))
                                        .SetBorder(Border.NO_BORDER));
                                }
                                else
                                {
                                    // ===== SUB TOTAL ROW (Like Image) =====
                                    ProductItemTable.AddCell(
                                        new Cell(1, 5)
                                        .Add(new Paragraph("Sub Total  =>")
                                        .SetFont(kabrioBoldFont))
                                        .SetTextAlignment(TextAlignment.RIGHT)
                                        .SetBorderTop(new DottedBorder(1))
                                        .SetBorderLeft(Border.NO_BORDER)
                                        .SetBorderRight(Border.NO_BORDER)
                                        .SetBorderBottom(Border.NO_BORDER)
                                    );

                                    ProductItemTable.AddCell(
                                        new Cell()
                                        .Add(new Paragraph(rolls ?? "")
                                        .SetFont(kabrioBoldFont)
                                        .SetTextAlignment(TextAlignment.CENTER))
                                        .SetBorderTop(new DottedBorder(1))
                                        .SetBorder(Border.NO_BORDER)
                                    );

                                    ProductItemTable.AddCell(
                                        new Cell()
                                        .Add(new Paragraph(qty ?? "")
                                        .SetFont(kabrioBoldFont)
                                        .SetTextAlignment(TextAlignment.RIGHT))
                                        .SetBorderTop(new DottedBorder(1))
                                        .SetBorder(Border.NO_BORDER)
                                    );
                                }
                            }

                            document.Add(ProductItemTable);

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