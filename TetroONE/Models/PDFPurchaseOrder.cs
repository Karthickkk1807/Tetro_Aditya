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

        public byte[] PurchaseOrderPrintNew(int numberOfCopies)
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

                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Adhithiya Textiles Process").SetFont(kabrioBoldFont).SetFontColor(new DeviceRgb(255, 0, 0)).SetFontSize(20).SetFixedLeading(30).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("SF.No.456/1,453/2, AVARAPALAYAM,").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("KARAI PUDUR VILLAGE, PALLADAM TK, VEERAPANDI, TIRUPUR-641605.").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Phone : 9489880088, 9943308018,9443959088").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("PF Code No. 1: CB/CBE/0033761/000").SetFont(kabrioFont)).Add(new Text("            ")).Add(new Text("ESI Code No : 56/62609-19").SetFont(kabrioFont)).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Email : adhithiyatextiles@gmail.com").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("GSTin : 33AAAFF3819NIZE").SetFont(kabrioBoldFont)).Add(new Text("            ")).Add(new Text("MSME Registration No : Udyam-TN-28-0022932").SetFont(kabrioBoldFont)).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

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
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("M/s. SK PROCESS").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("D.NO.7/142/8A, SAMBAVAYAL THOTTAM,").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("VETTUVAPALAYAM, MANGALAM-641663, TIRUPUR").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GST 33AFQFS4949K1Z8").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            Table DetailsTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DetailsTable2.SetBorderBottom(Border.NO_BORDER);
                            DetailsTable2.SetBorderLeft(Border.NO_BORDER);
                            DetailsTable2.SetBorderRight(Border.NO_BORDER);
                            DetailsTable2.SetBorderTop(Border.NO_BORDER);

                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Purchase Order").SetFont(kabrioBoldFont).SetFontSize(14).SetFixedLeading(19).SetTextAlignment(TextAlignment.CENTER)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PO No                     : PO/NO/2025-01").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PO Date                  : 15-11-2025").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Exp Delivery Date : 21-11-2025").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));

                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable1));
                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable2));

                            document.Add(DetailsMainTable);

                            Table MainTableBinding = new Table(UnitValue.CreatePercentArray(new float[] { 5, 30, 15, 10, 15, 10, 10, 15 })).UseAllAvailableWidth();
                            MainTableBinding.SetBorderRight(new SolidBorder(1));
                            MainTableBinding.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding.SetBorderTop(new SolidBorder(1));
                            MainTableBinding.SetBorder(Border.NO_BORDER);

                            Table MainTableBinding1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("SNo").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("3").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("4").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("5").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("7").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("8").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("9").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("10").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("11").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("12").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            
                            Table MainTableBinding2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding2.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding2.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding2.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding2.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding2.SetBorder(Border.NO_BORDER);
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Product").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Hydrogen Peroxide").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Remazol Brilliant Blue").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Sulphur Dye").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Reactive Dye").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Procion MX Yellow").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Caustic Soda (NaOH)").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Soda Ash Light").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Wetting Agent").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Leveling Agent").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Sequestering Agent").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Glacial Acetic Acid").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding3 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding3.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding3.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding3.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding3.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding3.SetBorder(Border.NO_BORDER);
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Qty").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("69.000 - LTR").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("4.00 - KG").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("56.00 - KG").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14.00 - KG").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("16.67 - KG").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("15.00 - KG").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("40.00 - KG").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("25.00 - LTR").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("15.00 - LTR").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("30.00 - KG").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("20.00 - LTR").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding4 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding4.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding4.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding4.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding4.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding4.SetBorder(Border.NO_BORDER);
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Rate").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("370.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("334.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("45.33").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("50.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("166.67").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("150.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("180.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("550.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("750.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("220.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("480.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            
                            Table MainTableBinding5 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding5.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding5.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding5.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding5.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding5.SetBorder(Border.NO_BORDER);
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("SubTotal").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("25530.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1336.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2538.48").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("700.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2778.39").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2250.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("7200.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("13750.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("11250.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("6600.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("9600.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding6 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding6.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding6.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding6.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding6.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding6.SetBorder(Border.NO_BORDER);
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("IGST").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("255.30").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("20.04").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("50.77").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("7.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("27.78").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("33.75").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("72.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("206.25").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("225.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("66.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("96.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding7 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding7.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding7.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding7.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding7.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding7.SetBorder(Border.NO_BORDER);
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("CESS").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("127.65").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("6.68").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("50.77").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("7.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("13.89").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("45.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("36.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("68.75").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("112.50").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("66.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("48.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding8 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding8.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding8.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding8.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding8.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding8.SetBorder(Border.NO_BORDER);
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Total").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("25912.95").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1362.72").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2640.02").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("714.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2820.06").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2328.75").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("7308.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14025.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14025.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("6732.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("9744.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding1));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding2));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding3));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding4));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding5));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding6));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding7));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding8));

                            document.Add(MainTableBinding);


                            Table BankAmountTable = new Table(UnitValue.CreatePercentArray(new float[] { 70, 30 })).UseAllAvailableWidth();
                            BankAmountTable.SetBorderBottom(new SolidBorder(1));
                            BankAmountTable.SetBorderLeft(new SolidBorder(1));
                            BankAmountTable.SetBorderRight(new SolidBorder(1));
                            BankAmountTable.SetBorderTop(new SolidBorder(1));

                            Table BankAmountSubTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            BankAmountSubTable1.SetBorder(Border.NO_BORDER);
                             
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Terms & Conditions  :-").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT).SetUnderline()));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("All items ordered are subject to inspection upon receipt, and the supplier must ensure that goods conform to the specifications mentioned in this purchase order. Delivery must be made within the agreed timeframe, and any delays or discrepancies should be promptly communicated. Payment will be made as per the agreed terms, and the buyer reserves the right to reject or return goods that are damaged, defective, or do not meet the specified quality standards.").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            Table BankAmountSubTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 70, 12, 15, 3 })).UseAllAvailableWidth();
                            BankAmountSubTable2.SetBorder(Border.NO_BORDER);
                             
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("IGST @ 2.50%").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("2,190.31").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("CESS @ 2.50%").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("2,190.31").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Round Off").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("0.12").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("NET AMOUNT").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(1)).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph().Add(new Text("91,993.00").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable1));
                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable2));

                            document.Add(BankAmountTable);


                            Table AmountTextTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AmountTextTable.SetBorderBottom(new SolidBorder(1));
                            AmountTextTable.SetBorderLeft(new SolidBorder(1));
                            AmountTextTable.SetBorderRight(new SolidBorder(1));
                            AmountTextTable.SetBorderTop(Border.NO_BORDER);

                            AmountTextTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("Rupees Two Thousand Nine Hundred Seventy Four Only").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(AmountTextTable);
                             
                            Table FooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterTable.SetBorderBottom(new SolidBorder(1));
                            FooterTable.SetBorderLeft(new SolidBorder(1));
                            FooterTable.SetBorderRight(new SolidBorder(1));
                            FooterTable.SetBorderTop(Border.NO_BORDER);

                            Table FooterTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 33, 33, 33 })).UseAllAvailableWidth();
                            FooterTable1.AddCell(new Cell(1,3).SetBorder(Border.NO_BORDER).Add(new Paragraph("For").Add(new Text(" Adhithiya Textiles Process").SetFontColor(new DeviceRgb(255, 0, 0))).SetFixedLeading(10).SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.RIGHT)));
                             
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
