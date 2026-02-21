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

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("SF.NO").SetFont(kabrioBoldFont).SetMarginTop(10).SetMarginLeft(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.SFNo).SetFont(kabrioFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Company").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ClientName).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Colour").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Colour).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Fabric").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Fabric).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Qty").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Weight).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Rolls").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Rolls).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Machine").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Machine).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Weight").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ChamberQty).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("NoOfChamber").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoLeftTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.NoOfChamber).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            Table HeaderInfoRightTable = new Table(UnitValue.CreatePercentArray(new float[] { 34, 4, 62 })).UseAllAvailableWidth();
                            HeaderInfoRightTable.SetBorderRight(Border.NO_BORDER);
                            HeaderInfoRightTable.SetBorderLeft(Border.NO_BORDER);
                            HeaderInfoRightTable.SetBorderTop(Border.NO_BORDER);
                            HeaderInfoRightTable.SetBorderBottom(Border.NO_BORDER);

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date").SetFont(kabrioBoldFont).SetMarginTop(10).SetMarginLeft(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Date).SetFont(kabrioFont).SetMarginTop(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GSM").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.GSM).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Width").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Width).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Lot No").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.LotNo).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DC No").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.DCNo).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Order No").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.OrderNo).SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Water").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Water ?? "").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Water PPM").SetFont(kabrioBoldFont).SetMarginLeft(10).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(kabrioBoldFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderInfoRightTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.WaterPPM ?? "").SetFont(kabrioFont).SetFixedLeading(15).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            HeaderInfoTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(HeaderInfoLeftTable));
                            HeaderInfoTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(HeaderInfoRightTable));

                            document.Add(HeaderInfoTable);

                            Table PreTreatmentHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            PreTreatmentHeadingTable.SetBorderRight(new SolidBorder(1));
                            PreTreatmentHeadingTable.SetBorderLeft(new SolidBorder(1));
                            PreTreatmentHeadingTable.SetBorderTop(new SolidBorder(1));
                            PreTreatmentHeadingTable.SetBorderBottom(new SolidBorder(0));

                            PreTreatmentHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PRE TREATMENT").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(3).SetMarginBottom(3).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(PreTreatmentHeadingTable);

                            if (data.PreTreatmentProductItemData != null && data.PreTreatmentProductItemData.Columns.Count > 0)
                            {
                                // Create dynamic column width array (equal width)
                                float[] columnWidths = Enumerable
                                    .Repeat(100f / data.PreTreatmentProductItemData.Columns.Count, data.PreTreatmentProductItemData.Columns.Count)
                                    .ToArray();

                                Table PreTreatmentMainTable = new Table(UnitValue.CreatePercentArray(columnWidths)).UseAllAvailableWidth();
                                PreTreatmentMainTable.SetBorder(new SolidBorder(1));

                                // ---------------------------
                                // HEADER ROW (Dynamic)
                                // ---------------------------
                                foreach (DataColumn column in data.PreTreatmentProductItemData.Columns)
                                {
                                    Cell headerCell = new Cell().SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioBoldFont).SetFontSize(12).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph(column.ColumnName));

                                    PreTreatmentMainTable.AddHeaderCell(headerCell);
                                }

                                // ---------------------------
                                // DATA ROWS (Dynamic)
                                // ---------------------------
                                foreach (DataRow row in data.PreTreatmentProductItemData.Rows)
                                {
                                    foreach (var item in row.ItemArray)
                                    {
                                        Cell cell = new Cell().SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioFont).SetFontSize(12).Add(new Paragraph(item?.ToString() ?? ""));
                                        PreTreatmentMainTable.AddCell(cell);
                                    }
                                }

                                document.Add(PreTreatmentMainTable);
                            }

                            Table DyeHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeHeadingTable.SetBorderRight(new SolidBorder(1));
                            DyeHeadingTable.SetBorderLeft(new SolidBorder(1));
                            DyeHeadingTable.SetBorderTop(new SolidBorder(0));
                            DyeHeadingTable.SetBorderBottom(new SolidBorder(0));

                            DyeHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DYE").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(3).SetMarginBottom(3).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(DyeHeadingTable);

                            if (data.DyeProductItemData != null && data.DyeProductItemData.Columns.Count > 0)
                            { 
                                float[] columnWidths = Enumerable.Repeat(100f / data.DyeProductItemData.Columns.Count, data.DyeProductItemData.Columns.Count).ToArray();

                                Table DyeMainTable = new Table(UnitValue.CreatePercentArray(columnWidths)).UseAllAvailableWidth();
                                DyeMainTable.SetBorder(new SolidBorder(1));

                                // ---------------------------
                                // HEADER ROW (Dynamic)
                                // ---------------------------
                                foreach (DataColumn column in data.DyeProductItemData.Columns)
                                {
                                    Cell headerCell = new Cell().SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioBoldFont).SetFontSize(12).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph(column.ColumnName));

                                    DyeMainTable.AddHeaderCell(headerCell);
                                }

                                // ---------------------------
                                // DATA ROWS (Dynamic)
                                // ---------------------------
                                foreach (DataRow row in data.DyeProductItemData.Rows)
                                {
                                    foreach (var item in row.ItemArray)
                                    {
                                        Cell cell = new Cell().SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioFont).SetFontSize(12).Add(new Paragraph(item?.ToString() ?? ""));
                                        DyeMainTable.AddCell(cell);
                                    }
                                }

                                document.Add(DyeMainTable);
                            }

                            Table DyeBathHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DyeBathHeadingTable.SetBorderRight(new SolidBorder(1));
                            DyeBathHeadingTable.SetBorderLeft(new SolidBorder(1));
                            DyeBathHeadingTable.SetBorderTop(new SolidBorder(0));
                            DyeBathHeadingTable.SetBorderBottom(new SolidBorder(0));

                            DyeBathHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DYE BATH").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(3).SetMarginBottom(3).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(DyeBathHeadingTable);

                            if (data.DyeBathProductItemData != null && data.DyeBathProductItemData.Columns.Count > 0)
                            {
                                float[] columnWidths = Enumerable.Repeat(100f / data.DyeBathProductItemData.Columns.Count, data.DyeBathProductItemData.Columns.Count).ToArray();

                                Table DyeBathMainTable = new Table(UnitValue.CreatePercentArray(columnWidths)).UseAllAvailableWidth();
                                DyeBathMainTable.SetBorder(new SolidBorder(1));

                                // ---------------------------
                                // HEADER ROW (Dynamic)
                                // ---------------------------
                                foreach (DataColumn column in data.DyeBathProductItemData.Columns)
                                {
                                    Cell headerCell = new Cell().SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioBoldFont).SetFontSize(12).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph(column.ColumnName));

                                    DyeBathMainTable.AddHeaderCell(headerCell);
                                }

                                // ---------------------------
                                // DATA ROWS (Dynamic)
                                // ---------------------------
                                foreach (DataRow row in data.DyeBathProductItemData.Rows)
                                {
                                    foreach (var item in row.ItemArray)
                                    {
                                        Cell cell = new Cell().SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioFont).SetFontSize(12).Add(new Paragraph(item?.ToString() ?? ""));
                                        DyeBathMainTable.AddCell(cell);
                                    }
                                }

                                document.Add(DyeBathMainTable);
                            }

                            Table AfterTreatmentHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AfterTreatmentHeadingTable.SetBorderRight(new SolidBorder(1));
                            AfterTreatmentHeadingTable.SetBorderLeft(new SolidBorder(1));
                            AfterTreatmentHeadingTable.SetBorderTop(new SolidBorder(0));
                            AfterTreatmentHeadingTable.SetBorderBottom(new SolidBorder(0));

                            AfterTreatmentHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("AFTER TREATMENT").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(3).SetMarginBottom(3).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(AfterTreatmentHeadingTable);


                            if (data.AfterTreatmentProductItemData != null && data.AfterTreatmentProductItemData.Columns.Count > 0)
                            {
                                float[] columnWidths = Enumerable.Repeat(100f / data.AfterTreatmentProductItemData.Columns.Count, data.AfterTreatmentProductItemData.Columns.Count).ToArray();

                                Table AfterTreatmentMainTable = new Table(UnitValue.CreatePercentArray(columnWidths)).UseAllAvailableWidth();
                                AfterTreatmentMainTable.SetBorder(new SolidBorder(1));

                                // ---------------------------
                                // HEADER ROW (Dynamic)
                                // ---------------------------
                                foreach (DataColumn column in data.AfterTreatmentProductItemData.Columns)
                                {
                                    Cell headerCell = new Cell().SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioBoldFont).SetFontSize(12).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph(column.ColumnName));

                                    AfterTreatmentMainTable.AddHeaderCell(headerCell);
                                }

                                // ---------------------------
                                // DATA ROWS (Dynamic)
                                // ---------------------------
                                foreach (DataRow row in data.AfterTreatmentProductItemData.Rows)
                                {
                                    foreach (var item in row.ItemArray)
                                    {
                                        Cell cell = new Cell().SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioFont).SetFontSize(12).Add(new Paragraph(item?.ToString() ?? ""));
                                        AfterTreatmentMainTable.AddCell(cell);
                                    }
                                }

                                document.Add(AfterTreatmentMainTable);
                            }


                            Table FinishingHeadingTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FinishingHeadingTable.SetBorderRight(new SolidBorder(1));
                            FinishingHeadingTable.SetBorderLeft(new SolidBorder(1));
                            FinishingHeadingTable.SetBorderTop(new SolidBorder(0));
                            FinishingHeadingTable.SetBorderBottom(new SolidBorder(0));

                            FinishingHeadingTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("FINISHING").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(3).SetMarginBottom(3).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(FinishingHeadingTable);

                            if (data.FinishingProductItemData != null && data.FinishingProductItemData.Columns.Count > 0)
                            {
                                float[] columnWidths = Enumerable.Repeat(100f / data.FinishingProductItemData.Columns.Count, data.FinishingProductItemData.Columns.Count).ToArray();

                                Table FinishingMainTable = new Table(UnitValue.CreatePercentArray(columnWidths)).UseAllAvailableWidth();
                                FinishingMainTable.SetBorder(new SolidBorder(1));

                                // ---------------------------
                                // HEADER ROW (Dynamic)
                                // ---------------------------
                                foreach (DataColumn column in data.FinishingProductItemData.Columns)
                                {
                                    Cell headerCell = new Cell().SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioBoldFont).SetFontSize(12).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph(column.ColumnName));

                                    FinishingMainTable.AddHeaderCell(headerCell);
                                }

                                // ---------------------------
                                // DATA ROWS (Dynamic)
                                // ---------------------------
                                foreach (DataRow row in data.FinishingProductItemData.Rows)
                                {
                                    foreach (var item in row.ItemArray)
                                    {
                                        Cell cell = new Cell().SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioFont).SetFontSize(12).Add(new Paragraph(item?.ToString() ?? ""));
                                        FinishingMainTable.AddCell(cell);
                                    }
                                }

                                document.Add(FinishingMainTable);
                            }


                            Table FooterMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
                            FooterMainTable.SetBorderRight(new SolidBorder(1));
                            FooterMainTable.SetBorderLeft(new SolidBorder(1));
                            FooterMainTable.SetBorderTop(new SolidBorder(0));
                            FooterMainTable.SetBorderBottom(Border.NO_BORDER);

                            Table FooterLeftMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterLeftMainTable.SetBorder(Border.NO_BORDER);

                            FooterLeftMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("LOADING").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(13).SetTextAlignment(TextAlignment.LEFT)));
                            FooterLeftMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date : " + data.LoadingDate).SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            FooterLeftMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Time : " + data.LoadingTime).SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            Table FooterRightMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterRightMainTable.SetBorder(Border.NO_BORDER);

                            FooterRightMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("UNLOADING").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(13).SetTextAlignment(TextAlignment.LEFT)));
                            FooterRightMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date : " + data.UnloadingDate).SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            FooterRightMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Time : " + data.UnloadingTime).SetFont(kabrioFont).SetFixedLeading(15).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            FooterMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterLeftMainTable));
                            FooterMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterRightMainTable));

                            // --- ADD FOOTER ROW WITH BOTTOM BORDER ---
                            int footerColumnsCount = 2;  // FooterMainTable has 2 columns
                            for (int i = 0; i < footerColumnsCount; i++)
                            {
                                Cell footerCell = new Cell()
                                    .SetBorderTop(Border.NO_BORDER)
                                    .SetBorderLeft(Border.NO_BORDER)
                                    .SetBorderRight(Border.NO_BORDER)
                                    .SetBorderBottom(new SolidBorder(1));
                                FooterMainTable.AddFooterCell(footerCell);
                            }
                            FooterMainTable.SetSkipLastFooter(false);

                            document.Add(FooterMainTable);

                            //Table FooterSignatureTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.3f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            //FooterSignatureTable.SetBorderRight(new SolidBorder(1));
                            //FooterSignatureTable.SetBorderLeft(new SolidBorder(1));
                            //FooterSignatureTable.SetBorderTop(Border.NO_BORDER);
                            //FooterSignatureTable.SetBorderBottom(Border.NO_BORDER);
                            //FooterSignatureTable.SetHeight(110);

                            //FooterSignatureTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.ApprovedBy ?? "").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(13).SetTextAlignment(TextAlignment.CENTER)));
                            //FooterSignatureTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.VerifiedBy ?? "").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            //FooterSignatureTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.PreparedBy ?? "").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            //// --- ADD FOOTER ROW WITH BOTTOM BORDER ---
                            //// Row 2 - Signature Line (Top Border Only)
                            //for (int i = 0; i < 3; i++)
                            //{
                            //    FooterSignatureTable.AddCell(
                            //        new Cell()
                            //            .SetBorderTop(new SolidBorder(1))
                            //            .SetBorderLeft(Border.NO_BORDER)
                            //            .SetBorderRight(Border.NO_BORDER)
                            //            .SetBorderBottom(Border.NO_BORDER)
                            //            .SetHeight(20)
                            //    );
                            //}

                            //document.Add(FooterSignatureTable);

                            //Table FooterSignatureTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 33.3f, 33.33f, 33.33f })).UseAllAvailableWidth();
                            //FooterSignatureTable1.SetBorderRight(new SolidBorder(1));
                            //FooterSignatureTable1.SetBorderLeft(new SolidBorder(1));
                            //FooterSignatureTable1.SetBorderTop(Border.NO_BORDER);
                            //FooterSignatureTable1.SetBorderBottom(new SolidBorder(1));

                            ////FooterSignatureTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("ApprovedBy").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(-25).SetFontSize(13).SetTextAlignment(TextAlignment.CENTER)));
                            ////FooterSignatureTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("VerifiedBy").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(-25).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            ////FooterSignatureTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PreparedBy").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginLeft(10).SetMarginTop(-25).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            //FooterSignatureTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Owner").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(13).SetTextAlignment(TextAlignment.LEFT)));
                            //FooterSignatureTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Master").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            //FooterSignatureTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Supervisor").SetFont(kabrioBoldFont).SetFixedLeading(15).SetMarginTop(50).SetMarginLeft(10).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            //// --- ADD FOOTER ROW WITH BOTTOM BORDER ---
                            //int footerSignatureColumnsCount = 3;  // FooterMainTable has 2 columns
                            //for (int i = 0; i < footerSignatureColumnsCount; i++)
                            //{
                            //    Cell footerCell = new Cell()
                            //        .SetBorderTop(new SolidBorder(1))
                            //        .SetBorderLeft(Border.NO_BORDER)
                            //        .SetBorderRight(Border.NO_BORDER)
                            //        .SetBorderBottom(Border.NO_BORDER);
                            //    FooterSignatureTable1.AddFooterCell(footerCell);
                            //}
                            //FooterSignatureTable1.SetSkipLastFooter(false);

                            //document.Add(FooterSignatureTable1);

                            // Get page count BEFORE adding table
                            // Sample content (to test page break)
                            
                            float signatureHeight = 60f;

                            // Create table
                            Table footerSignatureTable = new Table(UnitValue.CreatePercentArray(new float[] { 33.3f, 33.33f, 33.33f })).UseAllAvailableWidth();

                            footerSignatureTable.SetKeepTogether(true);

                            footerSignatureTable.SetBorderLeft(new SolidBorder(1));
                            footerSignatureTable.SetBorderRight(new SolidBorder(1));
                            footerSignatureTable.SetBorderBottom(new SolidBorder(1));

                            // Add Cells
                            footerSignatureTable.AddCell(new Cell().SetHeight(signatureHeight).SetVerticalAlignment(VerticalAlignment.BOTTOM).SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Owner").SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));
                            footerSignatureTable.AddCell(new Cell().SetHeight(signatureHeight).SetVerticalAlignment(VerticalAlignment.BOTTOM).SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Master").SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));
                            footerSignatureTable.AddCell(new Cell().SetHeight(signatureHeight).SetVerticalAlignment(VerticalAlignment.BOTTOM).SetBorder(Border.NO_BORDER).Add(new Paragraph("Signature Of Supervisor").SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.RIGHT)));

                            // -------------------------------
                            // CHECK AVAILABLE SPACE
                            // -------------------------------

                            DocumentRenderer docRenderer = (DocumentRenderer)document.GetRenderer();
                            LayoutArea currentArea = docRenderer.GetCurrentArea();

                            float availableHeight = currentArea.GetBBox().GetHeight();

                            if (availableHeight < signatureHeight)
                            {
                                // Table will move to next page → show top border
                                footerSignatureTable.SetBorderTop(new SolidBorder(1));
                            }
                            else
                            {
                                // Table stays on same page → hide top border
                                footerSignatureTable.SetBorderTop(new SolidBorder(0));
                            }

                            // Now add table
                            document.Add(footerSignatureTable);

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
