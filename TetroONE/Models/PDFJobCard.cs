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
    public class PDFJobCard
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

        public byte[] JobOrderPrint(int numberOfCopies, JobCardPrint data, string URL)
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
                            document.SetMargins(30, 30, 30, 30);

                            var HeaderBackgroundColor = new DeviceRgb(204, 204, 204);
                            var HeaderFontColor = new DeviceRgb(0, 0, 0);
                            DeviceRgb backgroundColor = new DeviceRgb(221, 221, 221);

                            Table HeaderMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 10, 50, 20, 20 })).UseAllAvailableWidth();
                            HeaderMainTable.SetBorderRight(new SolidBorder(1));
                            HeaderMainTable.SetBorderLeft(new SolidBorder(1));
                            HeaderMainTable.SetBorderTop(new SolidBorder(1));
                            //HeaderMainTable.SetBorderBottom(new SolidBorder(1));
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

                            img.SetMargins(-25, 0, -25, -30);

                            Cell imageCell = new Cell().SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP).Add(img).SetPaddingTop(5);

                            CompanyLogo.AddCell(imageCell);

                            Table CompanyName = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyName).SetFont(kabrioBoldFont).SetMarginTop(10).SetMarginLeft(-35).SetFontColor(new DeviceRgb(255, 0, 0)).SetFontSize(18).SetFixedLeading(30).SetTextAlignment(TextAlignment.LEFT)));

                            Table JobCardTextTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            JobCardTextTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Job Card").SetFont(kabrioBoldFont).SetMarginTop(10).SetMarginRight(10).SetFontColor(new DeviceRgb(255, 0, 0)).SetFontSize(18).SetFixedLeading(30).SetTextAlignment(TextAlignment.RIGHT)));

                            BarcodeQRCode qrCode = new BarcodeQRCode(URL);
                            PdfFormXObject qrObject = qrCode.CreateFormXObject(ColorConstants.BLACK, pdf);
                            Image qrImage = new Image(qrObject).SetWidth(70).SetHeight(70).SetHorizontalAlignment(HorizontalAlignment.CENTER);

                            Table QRTable = new Table(1).UseAllAvailableWidth();
                            QRTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetTextAlignment(TextAlignment.CENTER).Add(qrImage));

                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyLogo));
                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyName));
                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(JobCardTextTable));
                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(QRTable));

                            document.Add(HeaderMainTable);

                            Table HeaderInfoTable = new Table(UnitValue.CreatePercentArray(new float[] { 55, 45 })).UseAllAvailableWidth();
                            HeaderInfoTable.SetBorderRight(new SolidBorder(1));
                            HeaderInfoTable.SetBorderLeft(new SolidBorder(1));
                            HeaderInfoTable.SetBorderTop(Border.NO_BORDER);
                            HeaderInfoTable.SetBorderBottom(Border.NO_BORDER);

                            Table HeaderInfoLeftTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 5, 75 })).UseAllAvailableWidth();
                            HeaderInfoLeftTable.SetBorderRight(Border.NO_BORDER);
                            HeaderInfoLeftTable.SetBorderLeft(Border.NO_BORDER);
                            HeaderInfoLeftTable.SetBorderTop(Border.NO_BORDER);
                            HeaderInfoLeftTable.SetBorderBottom(Border.NO_BORDER);

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("SF.NO").SetFont(kabrioFont).SetMarginTop(10).SetMarginLeft(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PLN_ATP2526/0004").SetFont(kabrioFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Company").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ClientName).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Colour").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Colour).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Fabric").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Fabric).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Qty").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("500.000 KG, 1000.000 KG").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Rolls").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Rolls).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Machine").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Sample 1000.000 – 1500.000 KG").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Weight").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("500.00 KG").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("NoOfChamber").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.NoOfChamber).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            Table HeaderInfoRightTable = new Table(UnitValue.CreatePercentArray(new float[] { 34, 4, 62 })).UseAllAvailableWidth();
                            HeaderInfoRightTable.SetBorderRight(Border.NO_BORDER);
                            HeaderInfoRightTable.SetBorderLeft(Border.NO_BORDER);
                            HeaderInfoRightTable.SetBorderTop(Border.NO_BORDER);
                            HeaderInfoRightTable.SetBorderBottom(Border.NO_BORDER);

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date").SetFont(kabrioFont).SetMarginTop(10).SetMarginLeft(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Date).SetFont(kabrioFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GSM").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.GSM).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Width").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Tubler").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Lot No").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("INW_ATP2526/0001").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DC No").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.DCNo).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Order No").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Water").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Water).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Water PPM").SetFont(kabrioFont).SetMarginLeft(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.WaterPPM).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(HeaderInfoLeftTable));
                            HeaderInfoTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(HeaderInfoRightTable));

                            document.Add(HeaderInfoTable);

                            Table PreTreatmentHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            PreTreatmentHeadingTable.SetBorderRight(new SolidBorder(1));
                            PreTreatmentHeadingTable.SetBorderLeft(new SolidBorder(1));
                            PreTreatmentHeadingTable.SetBorderTop(new SolidBorder(1));
                            PreTreatmentHeadingTable.SetBorderBottom(new SolidBorder(0));

                            PreTreatmentHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PRE TREATMENT").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(PreTreatmentHeadingTable);

                            Table PreTreatmentMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.33f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            PreTreatmentMainTable.SetBorderRight(new SolidBorder(1));
                            PreTreatmentMainTable.SetBorderLeft(new SolidBorder(1));
                            PreTreatmentMainTable.SetBorderTop(new SolidBorder(1));
                            PreTreatmentMainTable.SetBorderBottom(new SolidBorder(1));

                            Table PreTreatmentFirstColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            PreTreatmentFirstColumnTable.SetBorderRight(new SolidBorder(0));
                            PreTreatmentFirstColumnTable.SetBorderLeft(new SolidBorder(1));
                            PreTreatmentFirstColumnTable.SetBorderTop(new SolidBorder(0));
                            PreTreatmentFirstColumnTable.SetBorderBottom(new SolidBorder(1));

                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Wetting Oil").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bio-Scour").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Caustic").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Peroxide").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Acetic").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Killer").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bio-Enzyme").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table PreTreatmentSecondColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            PreTreatmentSecondColumnTable.SetBorderRight(new SolidBorder(0));
                            PreTreatmentSecondColumnTable.SetBorderLeft(new SolidBorder(0));
                            PreTreatmentSecondColumnTable.SetBorderTop(new SolidBorder(0));
                            PreTreatmentSecondColumnTable.SetBorderBottom(new SolidBorder(1));

                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Unit Value").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("0.5").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("0.8").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("0.2").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table PreTreatmentThirdColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            PreTreatmentThirdColumnTable.SetBorderRight(new SolidBorder(1));
                            PreTreatmentThirdColumnTable.SetBorderLeft(new SolidBorder(0));
                            PreTreatmentThirdColumnTable.SetBorderTop(new SolidBorder(0));
                            PreTreatmentThirdColumnTable.SetBorderBottom(new SolidBorder(1));

                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Amount Of Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("28.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("7.0000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("10.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2.6000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            PreTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            PreTreatmentMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(PreTreatmentFirstColumnTable));
                            PreTreatmentMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(PreTreatmentSecondColumnTable));
                            PreTreatmentMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(PreTreatmentThirdColumnTable));

                            document.Add(PreTreatmentMainTable);

                            Table DyeHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeHeadingTable.SetBorderRight(new SolidBorder(1));
                            DyeHeadingTable.SetBorderLeft(new SolidBorder(1));
                            DyeHeadingTable.SetBorderTop(new SolidBorder(0));
                            DyeHeadingTable.SetBorderBottom(new SolidBorder(0));

                            DyeHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DYE").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(DyeHeadingTable);

                            Table DyeMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.33f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            DyeMainTable.SetBorderRight(new SolidBorder(1));
                            DyeMainTable.SetBorderLeft(new SolidBorder(1));
                            DyeMainTable.SetBorderTop(new SolidBorder(1));
                            DyeMainTable.SetBorderBottom(new SolidBorder(1));

                            Table DyeFirstColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeFirstColumnTable.SetBorderRight(new SolidBorder(0));
                            DyeFirstColumnTable.SetBorderLeft(new SolidBorder(1));
                            DyeFirstColumnTable.SetBorderTop(new SolidBorder(0));
                            DyeFirstColumnTable.SetBorderBottom(new SolidBorder(1));

                            DyeFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Caustic").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Stablizer").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Lubricant").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table DyeSecondColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeSecondColumnTable.SetBorderRight(new SolidBorder(0));
                            DyeSecondColumnTable.SetBorderLeft(new SolidBorder(0));
                            DyeSecondColumnTable.SetBorderTop(new SolidBorder(0));
                            DyeSecondColumnTable.SetBorderBottom(new SolidBorder(1));

                            DyeSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Unit Value").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("6.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("8.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("05.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table DyeThirdColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeThirdColumnTable.SetBorderRight(new SolidBorder(1));
                            DyeThirdColumnTable.SetBorderLeft(new SolidBorder(0));
                            DyeThirdColumnTable.SetBorderTop(new SolidBorder(0));
                            DyeThirdColumnTable.SetBorderBottom(new SolidBorder(1));

                            DyeThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Amount Of Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("15.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("98.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("25.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            DyeMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DyeFirstColumnTable));
                            DyeMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DyeSecondColumnTable));
                            DyeMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DyeThirdColumnTable));

                            document.Add(DyeMainTable);

                            Table DyeBathHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeBathHeadingTable.SetBorderRight(new SolidBorder(1));
                            DyeBathHeadingTable.SetBorderLeft(new SolidBorder(1));
                            DyeBathHeadingTable.SetBorderTop(new SolidBorder(0));
                            DyeBathHeadingTable.SetBorderBottom(new SolidBorder(0));

                            DyeBathHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DYE BATH").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(DyeBathHeadingTable);

                            Table DyeBathMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.33f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            DyeBathMainTable.SetBorderRight(new SolidBorder(1));
                            DyeBathMainTable.SetBorderLeft(new SolidBorder(1));
                            DyeBathMainTable.SetBorderTop(new SolidBorder(1));
                            DyeBathMainTable.SetBorderBottom(new SolidBorder(1));

                            Table DyeBathFirstColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeBathFirstColumnTable.SetBorderRight(new SolidBorder(0));
                            DyeBathFirstColumnTable.SetBorderLeft(new SolidBorder(1));
                            DyeBathFirstColumnTable.SetBorderTop(new SolidBorder(0));
                            DyeBathFirstColumnTable.SetBorderBottom(new SolidBorder(1));

                            DyeBathFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeBathFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Rol").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeBathFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Sequestering").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table DyeBathSecondColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeBathSecondColumnTable.SetBorderRight(new SolidBorder(0));
                            DyeBathSecondColumnTable.SetBorderLeft(new SolidBorder(0));
                            DyeBathSecondColumnTable.SetBorderTop(new SolidBorder(0));
                            DyeBathSecondColumnTable.SetBorderBottom(new SolidBorder(1));

                            DyeBathSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Unit Value").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeBathSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeBathSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table DyeBathThirdColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeBathThirdColumnTable.SetBorderRight(new SolidBorder(1));
                            DyeBathThirdColumnTable.SetBorderLeft(new SolidBorder(0));
                            DyeBathThirdColumnTable.SetBorderTop(new SolidBorder(0));
                            DyeBathThirdColumnTable.SetBorderBottom(new SolidBorder(1));

                            DyeBathThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Amount Of Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeBathThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            DyeBathThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            DyeBathMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DyeBathFirstColumnTable));
                            DyeBathMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DyeBathSecondColumnTable));
                            DyeBathMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DyeBathThirdColumnTable));

                            document.Add(DyeBathMainTable);

                            Table AfterTreatmentHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AfterTreatmentHeadingTable.SetBorderRight(new SolidBorder(1));
                            AfterTreatmentHeadingTable.SetBorderLeft(new SolidBorder(1));
                            AfterTreatmentHeadingTable.SetBorderTop(new SolidBorder(0));
                            AfterTreatmentHeadingTable.SetBorderBottom(new SolidBorder(0));

                            AfterTreatmentHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("AFTER TREATMENT").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(AfterTreatmentHeadingTable);

                            Table AfterTreatmentMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.33f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            AfterTreatmentMainTable.SetBorderRight(new SolidBorder(1));
                            AfterTreatmentMainTable.SetBorderLeft(new SolidBorder(1));
                            AfterTreatmentMainTable.SetBorderTop(new SolidBorder(1));
                            AfterTreatmentMainTable.SetBorderBottom(new SolidBorder(1));

                            Table AfterTreatmentFirstColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AfterTreatmentFirstColumnTable.SetBorderRight(new SolidBorder(0));
                            AfterTreatmentFirstColumnTable.SetBorderLeft(new SolidBorder(1));
                            AfterTreatmentFirstColumnTable.SetBorderTop(new SolidBorder(0));
                            AfterTreatmentFirstColumnTable.SetBorderBottom(new SolidBorder(1));

                            AfterTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            AfterTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Final Acetic Acid").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            AfterTreatmentFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Soaping").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table AfterTreatmentSecondColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AfterTreatmentSecondColumnTable.SetBorderRight(new SolidBorder(0));
                            AfterTreatmentSecondColumnTable.SetBorderLeft(new SolidBorder(0));
                            AfterTreatmentSecondColumnTable.SetBorderTop(new SolidBorder(0));
                            AfterTreatmentSecondColumnTable.SetBorderBottom(new SolidBorder(1));

                            AfterTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Unit Value").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            AfterTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            AfterTreatmentSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("4.5").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table AfterTreatmentThirdColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AfterTreatmentThirdColumnTable.SetBorderRight(new SolidBorder(1));
                            AfterTreatmentThirdColumnTable.SetBorderLeft(new SolidBorder(0));
                            AfterTreatmentThirdColumnTable.SetBorderTop(new SolidBorder(0));
                            AfterTreatmentThirdColumnTable.SetBorderBottom(new SolidBorder(1));

                            AfterTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Amount Of Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            AfterTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            AfterTreatmentThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            AfterTreatmentMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(AfterTreatmentFirstColumnTable));
                            AfterTreatmentMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(AfterTreatmentSecondColumnTable));
                            AfterTreatmentMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(AfterTreatmentThirdColumnTable));

                            document.Add(AfterTreatmentMainTable);

                            Table FinishingHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FinishingHeadingTable.SetBorderRight(new SolidBorder(1));
                            FinishingHeadingTable.SetBorderLeft(new SolidBorder(1));
                            FinishingHeadingTable.SetBorderTop(new SolidBorder(1));
                            FinishingHeadingTable.SetBorderBottom(new SolidBorder(0));

                            FinishingHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("FINISHING").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(FinishingHeadingTable);

                            Table FinishingMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.33f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            FinishingMainTable.SetBorderRight(new SolidBorder(0));
                            FinishingMainTable.SetBorderLeft(new SolidBorder(0));
                            FinishingMainTable.SetBorderTop(new SolidBorder(0));
                            FinishingMainTable.SetBorderBottom(new SolidBorder(0));

                            Table FinishingFirstColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FinishingFirstColumnTable.SetBorderRight(new SolidBorder(0));
                            FinishingFirstColumnTable.SetBorderLeft(new SolidBorder(1));
                            FinishingFirstColumnTable.SetBorderTop(new SolidBorder(0));
                            FinishingFirstColumnTable.SetBorderBottom(new SolidBorder(0));

                            FinishingFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            FinishingFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Silicone Softener").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            FinishingFirstColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Cationic Softener").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table FinishingSecondColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FinishingSecondColumnTable.SetBorderRight(new SolidBorder(0));
                            FinishingSecondColumnTable.SetBorderLeft(new SolidBorder(0));
                            FinishingSecondColumnTable.SetBorderTop(new SolidBorder(0));
                            FinishingSecondColumnTable.SetBorderBottom(new SolidBorder(0));

                            FinishingSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Unit Value").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            FinishingSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            FinishingSecondColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.0").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table FinishingThirdColumnTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FinishingThirdColumnTable.SetBorderRight(new SolidBorder(0));
                            FinishingThirdColumnTable.SetBorderLeft(new SolidBorder(0));
                            FinishingThirdColumnTable.SetBorderTop(new SolidBorder(0));
                            FinishingThirdColumnTable.SetBorderBottom(new SolidBorder(0));

                            FinishingThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Amount Of Chemicals").SetFont(kabrioBoldFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            FinishingThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("14.000").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            FinishingThirdColumnTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFixedLeading(20).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            FinishingMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FinishingFirstColumnTable));
                            FinishingMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FinishingSecondColumnTable));
                            FinishingMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FinishingThirdColumnTable));

                            document.Add(FinishingMainTable);

                            Table FooterMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
                            FooterMainTable.SetBorderRight(new SolidBorder(1));
                            FooterMainTable.SetBorderLeft(new SolidBorder(1));
                            FooterMainTable.SetBorderTop(new SolidBorder(0));
                            FooterMainTable.SetBorderBottom(Border.NO_BORDER);

                            Table FooterLeftMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterLeftMainTable.SetBorder(Border.NO_BORDER);

                            FooterLeftMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("LOADING").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(13).SetTextAlignment(TextAlignment.LEFT)));
                            FooterLeftMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date : 04-02-2026").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            FooterLeftMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Time : 10:50 AM").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            Table FooterRightMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterRightMainTable.SetBorder(Border.NO_BORDER);

                            FooterRightMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("UNLOADING").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(13).SetTextAlignment(TextAlignment.LEFT)));
                            FooterRightMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date : 05-02-2026").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            FooterRightMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Time : 09:20 PM").SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            FooterMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterLeftMainTable));
                            FooterMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterRightMainTable));

                            document.Add(FooterMainTable);

                            Table FooterSignatureTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.3f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            FooterSignatureTable.SetBorderRight(new SolidBorder(0));
                            FooterSignatureTable.SetBorderLeft(new SolidBorder(0));
                            FooterSignatureTable.SetBorderTop(Border.NO_BORDER);
                            FooterSignatureTable.SetBorderBottom(new SolidBorder(0));
                            FooterSignatureTable.SetHeight(80);

                            FooterSignatureTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Owner").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(13).SetTextAlignment(TextAlignment.LEFT)));
                            FooterSignatureTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Master").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            FooterSignatureTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Supervisor").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(FooterSignatureTable);

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
