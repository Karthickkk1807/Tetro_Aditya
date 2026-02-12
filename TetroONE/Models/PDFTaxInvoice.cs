
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
using System.Globalization;
using SKSvg = Svg.Skia.SKSvg;
namespace TetroONE.Models
{
    public class PDFTaxInvoice
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

        public byte[] TaxInvoicePrint(TaxInvoicePrint data, int numberOfCopies)
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
                            Table HeaderMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 90, 6, 4 })).UseAllAvailableWidth();
                            HeaderMainTable.SetBorderRight(new SolidBorder(1));
                            HeaderMainTable.SetBorderLeft(new SolidBorder(1));
                            HeaderMainTable.SetBorderTop(new SolidBorder(1));
                            HeaderMainTable.SetBorder(Border.NO_BORDER);

                            Table CompanyName = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();

                            CompanyName.AddCell(new Cell(1, 2).SetBorder(Border.NO_BORDER).Add(new Paragraph("").SetFont(kabrioBoldFont).SetFontSize(15).SetHeight(15f).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell(1, 2).SetBackgroundColor(HeaderBackgroundColor).SetPaddingLeft(80).SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyName).SetFont(kabrioBoldFont).SetFontColor(HeaderFontColor).SetFontSize(14).SetTextAlignment(TextAlignment.CENTER)));

                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyAddress).SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Tel : " + data.CompanyContactNumber).SetFont(kabrioFont).SetFontSize(10).SetMargin(0).SetTextAlignment(TextAlignment.RIGHT)));

                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyCity).SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Web : " + data.CompanyWebsite).SetFont(kabrioFont).SetFontSize(10).SetMargin(0).SetTextAlignment(TextAlignment.RIGHT)));

                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(data.CompanyCountry.ToLower())).SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            CompanyName.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Email : " + data.CompanyEmail).SetFont(kabrioFont).SetFontSize(10).SetMargin(0).SetTextAlignment(TextAlignment.RIGHT)));


                            Table CompanyLogo = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

                            // Load and prepare the image
                            string imgFolderPath = "wwwroot/assets/PreviewPDF";
                            string imgFileName = data.CompanyLogo;
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
                                imageData = File.ReadAllBytes("wwwroot/assets/PreviewPDF/KaalaiyanPDFLogo.png");
                            }

                            iText.Layout.Element.Image img = new iText.Layout.Element.Image(ImageDataFactory.Create(imageData));
                            img.SetWidth(70);
                            img.SetHeight(70);

                            img.SetMargins(0, 0, 0, 0);

                            // Create a cell to hold the image
                            Cell imageCell = new Cell().SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP).Add(img).SetPaddingTop(5);

                            CompanyLogo.AddCell(imageCell);

                            // Add the table to the final document

                            Table HeaderEmptyTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

                            HeaderEmptyTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetWidth(200f).SetHeight(15f).Add(new Paragraph("").SetFont(kabrioBoldFont).SetFontSize(15).SetTextAlignment(TextAlignment.LEFT)));
                            HeaderEmptyTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).SetWidth(180f).SetHeight(26f).Add(new Paragraph("")));

                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyName));
                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CompanyLogo));
                            HeaderMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(HeaderEmptyTable));

                            document.Add(HeaderMainTable);


                            Table ModuleTable = new Table(UnitValue.CreatePercentArray(new float[] { 33, 33, 33 })).UseAllAvailableWidth();

                            ModuleTable.SetBorder(new SolidBorder(1));

                            ModuleTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("GST No : ").SetFont(kabrioBoldFont)).Add(new Text(data.CompanyGSTNumber).SetFont(kabrioFont)).SetPaddingTop(2).SetFontSize(11).SetTextAlignment(TextAlignment.LEFT)));
                            ModuleTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPaddingTop(5).Add(new Paragraph("Tax Invoice").SetFont(kabrioBoldFont).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER).SetMarginTop(-5)));
                            ModuleTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("MADE FOR THE RECIPIENT").SetFont(kabrioFont).SetPaddingTop(3).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT).SetMarginTop(1)));

                            document.Add(ModuleTable);

                            if (data.Irn != null)
                            {
                                Table EInvoiceMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 60, 40 })).UseAllAvailableWidth();
                                EInvoiceMainTable.SetBorderBottom(new SolidBorder(1));
                                EInvoiceMainTable.SetBorderLeft(new SolidBorder(1));
                                EInvoiceMainTable.SetBorderRight(new SolidBorder(1));
                                EInvoiceMainTable.SetBorderTop(Border.NO_BORDER);
                                EInvoiceMainTable.SetBorder(Border.NO_BORDER);
                                EInvoiceMainTable.SetMarginTop(0);

                                Table EInvoiceTable = new Table(UnitValue.CreatePercentArray(new float[] { 25, 75 })).UseAllAvailableWidth();
                                EInvoiceTable.SetBorder(Border.NO_BORDER);

                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Irn").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                                string DataForIrn = data.Irn;

                                //var(firstPart , secondPart) = SplitTheNumber(DataForIrn);
                                DataForIrn = SplitTheNumber(DataForIrn);

                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(DataForIrn).SetFont(kabrioFont)).SetFontSize(9)));

                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Ack No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.AckNo).SetFont(kabrioFont)).SetFontSize(9)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Ack Date").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.AckDate).SetFont(kabrioFont)).SetFontSize(9)));

                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Eway Bill No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.EwbNo).SetFont(kabrioFont)).SetFontSize(9)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Eway Bill Date").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.EwbDate).SetFont(kabrioFont)).SetFontSize(9)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Eway Bill Valid").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                EInvoiceTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.EwbValidTill).SetFont(kabrioFont)).SetFontSize(9)));


                                Table EInvoiceQRCOdeTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                                EInvoiceQRCOdeTable.SetBorder(Border.NO_BORDER);

                                EInvoiceQRCOdeTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("E-Invoice QR-Code").SetFont(kabrioBoldFont).SetFontSize(11).SetMarginTop(5).SetMarginLeft(20).SetTextAlignment(TextAlignment.CENTER)));

                                var EwayString = $"Irn.No - {data.Irn} / Ack No - {data.AckNo} / Ack Date - {data.AckDate}";
                                BarcodeQRCode errorQrCode = new BarcodeQRCode(EwayString);

                                Image errorQrImage = new Image(errorQrCode.CreateFormXObject(pdf));

                                errorQrImage.SetHeight(90);
                                errorQrImage.SetWidth(90);
                                errorQrImage.SetMarginTop(-5);
                                errorQrImage.SetMarginLeft(20);
                                errorQrImage.SetHorizontalAlignment(HorizontalAlignment.CENTER);

                                EInvoiceQRCOdeTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(errorQrImage));


                                EInvoiceMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(EInvoiceTable));
                                EInvoiceMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(EInvoiceQRCOdeTable));

                                document.Add(EInvoiceMainTable);

                            }


                            Table CustomerMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 60, 40 })).UseAllAvailableWidth();
                            CustomerMainTable.SetBorderBottom(new SolidBorder(1));
                            CustomerMainTable.SetBorderLeft(new SolidBorder(1));
                            CustomerMainTable.SetBorderRight(new SolidBorder(1));
                            CustomerMainTable.SetBorder(Border.NO_BORDER);

                            Table CustomerDetaisTable = new Table(UnitValue.CreatePercentArray(new float[] { 25, 75 })).UseAllAvailableWidth();
                            CustomerDetaisTable.SetPadding(0);

                            CustomerDetaisTable.AddCell(new Cell(1, 2).SetBorderBottom(new SolidBorder(1)).SetBorder(Border.NO_BORDER).SetPadding(0).Add(new Paragraph("Client Details").SetFont(kabrioBoldFont).SetFontSize(10).SetPadding(0).SetTextAlignment(TextAlignment.CENTER)));

                            if (!string.IsNullOrEmpty(data.ClientName))
                            {
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("M/S").SetFont(kabrioBoldFont).SetFontSize(9)));
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.ClientName).SetFont(kabrioFont)).SetFontSize(9)));
                            }

                            if (!string.IsNullOrEmpty(data.ClientCity) || !string.IsNullOrEmpty(data.ClientAddress) || !string.IsNullOrEmpty(data.ClientZipCode))
                            {
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Address").SetFont(kabrioBoldFont).SetFontSize(9)));
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.ClientAddress + ", " + data.ClientCity + " - " + data.ClientZipCode).SetFont(kabrioFont)).SetFontSize(9)));
                            }

                            if (!string.IsNullOrEmpty(data.ClientContactNumber))
                            {
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Phone Number").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.ClientContactNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            }

                            if (!string.IsNullOrEmpty(data.ClientGSTNumber))
                            {
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GSTIN").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.ClientGSTNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            if (!string.IsNullOrEmpty(data.ClientState))
                            {
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Place of Supply").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.ClientState).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }


                            Table GstNumberTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
                            GstNumberTable.SetBorder(Border.NO_BORDER);

                            if (!string.IsNullOrEmpty(data.SaleNumber))
                            {
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Sale No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.SaleNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            if (!string.IsNullOrEmpty(data.SaleDate))
                            {
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Sale Date").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.SaleDate).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            if (!string.IsNullOrEmpty(data.DeliveryChallanNumber))
                            {
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Delivery Challan No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.DeliveryChallanNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            if (!string.IsNullOrEmpty(data.DeliveryChallanDate))
                            {
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Delivery Challan Date").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.DeliveryChallanDate).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            if (!string.IsNullOrEmpty(data.EstimateNumber))
                            {
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Estimate No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.EstimateNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            if (!string.IsNullOrEmpty(data.EstimateDate))
                            {
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Estimate Date").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.EstimateDate).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            if (!string.IsNullOrEmpty(data.GoodsDeliveryDate))
                            {
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Goods Delivery Date").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                                GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.GoodsDeliveryDate).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            }

                            CustomerMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CustomerDetaisTable));
                            CustomerMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetPadding(0).Add(GstNumberTable));

                            document.Add(CustomerMainTable);

                            float[] ProductTableColumnWidth = null;
                            if (data.ProductTable.Columns.Count == 6)
                            {
                                //for This Width will 7 Column
                                ProductTableColumnWidth = new float[] { 10, 30, 15, 15, 10, 20 };
                            }
                            else if (data.ProductTable.Columns.Count == 7)
                            {
                                //for This Width will 7 Column
                                ProductTableColumnWidth = new float[] { 5, 30, 10, 10, 10, 15, 20 };
                            }

                            else if (data.ProductTable.Columns.Count == 8)
                            {
                                //for This Width will 8 Column
                                ProductTableColumnWidth = new float[] { 10, 25, 10, 10, 10, 15, 15, 15 };
                            }
                            else if (data.ProductTable.Columns.Count == 9)
                            {
                                //for This Width will 9 Column
                                ProductTableColumnWidth = new float[] { 5, 20, 15, 10, 10, 10, 10, 10, 10 };
                            }
                            else if (data.ProductTable.Columns.Count == 10)
                            {
                                //for This Width will 10 Column
                                ProductTableColumnWidth = new float[] { 5, 25, 10, 10, 8.3F, 8.3F, 8.3F, 8.3F, 8.3F, 8.3F };
                            }
                            else if (data.ProductTable.Columns.Count == 11)
                            {
                                //for This Width will 11 Column
                                ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 7.5F, 7.5F, 10, 10, 15 };
                            }
                            else if (data.ProductTable.Columns.Count == 12)
                            {
                                //for This Width will 12 Column
                                ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 10, 10, 5, 5, 5, 15 };
                            }
                            else if (data.ProductTable.Columns.Count == 13)
                            {
                                //for This Width will 13 Column
                                ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 5, 5, 10, 5, 5, 5, 15 };
                            }
                            else if (data.ProductTable.Columns.Count == 14)
                            {
                                //for This Width will 14 Column
                                ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15 };
                            }

                            Table ProductItemTable = new Table(UnitValue.CreatePercentArray(ProductTableColumnWidth)).UseAllAvailableWidth();
                            ProductItemTable.SetBorderBottom(Border.NO_BORDER);

                            bool specialCharacterFound = false;
                            float headerHeight = 0;

                            string[] columnHeaders = new string[data.ProductTable.Columns.Count];

                            foreach (var column in data.ProductTable.Columns)
                            {
                                var dataColumn = column as DataColumn; // Cast the object to DataColumn

                                if (dataColumn != null) // Check if casting was successful
                                {
                                    var columnName = dataColumn.ColumnName;

                                    //if (columnName.Contains("%") || columnName.Contains('-'))
                                    if (columnName.Contains('-'))
                                    {
                                        specialCharacterFound = true;
                                        headerHeight = 30f;
                                        break; // No need to check further once a special character is found
                                    }
                                    else
                                    {
                                        headerHeight = 15f;
                                    }
                                }
                            }


                            for (int i = 0; i < data.ProductTable.Columns.Count; i++)
                            {
                                columnHeaders[i] = data.ProductTable.Columns[i].ColumnName;

                                Paragraph headerParagraph = new Paragraph().SetFont(kabrioBoldFont).SetFontSize(9).SetFontColor(HeaderFontColor).SetTextAlignment(TextAlignment.CENTER);

                                //if (columnHeaders[i].Contains("%"))
                                //{
                                //    string[] parts = columnHeaders[i].Split('%');

                                //    headerParagraph.Add(new Text(parts[0]).SetFont(kabrioBoldFont));
                                //    headerParagraph.Add(new Text("\n").SetFont(kabrioBoldFont));
                                //    headerParagraph.Add(new Text("%" + parts[1]).SetFont(kabrioBoldFont));
                                //}
                                if (columnHeaders[i].Contains('-'))
                                {
                                    string[] parts = columnHeaders[i].Split('-');

                                    headerParagraph.Add(new Text(parts[0]).SetFont(kabrioBoldFont));
                                    headerParagraph.Add(new Text("\n").SetFont(kabrioBoldFont));
                                    headerParagraph.Add(new Text(parts[1]).SetFont(kabrioBoldFont));
                                }
                                else
                                {
                                    headerParagraph.Add(new Text(columnHeaders[i]).SetFont(kabrioBoldFont));
                                }

                                Cell headerCell = new Cell().SetBorder(Border.NO_BORDER).SetBackgroundColor(HeaderBackgroundColor).Add(headerParagraph);

                                headerCell.SetBorderBottom(new SolidBorder(1)).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetHeight(UnitValue.CreatePointValue(headerHeight));
                                ProductItemTable.AddHeaderCell(headerCell);
                            }

                            // Add data rows dynamically, excluding the last row
                            for (int rowIndex = 0; rowIndex < data.ProductTable.Rows.Count - 1; rowIndex++)
                            {
                                DataRow row = data.ProductTable.Rows[rowIndex];

                                for (int i = 0; i < row.ItemArray.Length; i++)
                                {
                                    var item = row.ItemArray[i];
                                    string displayValue = string.IsNullOrEmpty(item.ToString()) ? "-" : item.ToString();

                                    Paragraph paragraph = new Paragraph();

                                    if (i == 1)
                                    {
                                        string columnText = row[i].ToString();
                                        if (columnText.Contains("--"))
                                        {
                                            string[] parts = columnText.Split("--");
                                            paragraph.Add(new Text(parts[0]).SetFont(kabrioBoldFont));
                                            paragraph.Add(new Text("\n").SetFont(kabrioBoldFont));
                                            paragraph.Add(new Text(parts[1]).SetFont(kabrioFont).SetFontSize(8));
                                        }
                                        else
                                        {
                                            paragraph.Add(new Text(columnText).SetFont(kabrioFont));
                                        }
                                        Cell cell = new Cell().Add(paragraph).SetTextAlignment(TextAlignment.LEFT).SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1));
                                        ProductItemTable.AddCell(cell.SetFontSize(10).SetVerticalAlignment(VerticalAlignment.TOP));
                                    }
                                    else if (i == 5 || i == 6 || i == 7)
                                    {
                                        string columnText = row[i].ToString();
                                        if (columnText.Contains("--"))
                                        {
                                            string[] parts = columnText.Split("--");
                                            paragraph.Add(new Text(parts[0]).SetFont(kabrioFont));
                                            paragraph.Add(new Text("\n").SetFont(kabrioFont));
                                            paragraph.Add(new Text(parts[1]).SetFont(kabrioFont).SetFontSize(10));
                                        }
                                        else
                                        {
                                            paragraph.Add(new Text(columnText).SetFont(kabrioFont));
                                        }
                                        Cell cell = new Cell().Add(paragraph).SetTextAlignment(TextAlignment.CENTER).SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1));
                                        ProductItemTable.AddCell(cell.SetFontSize(10).SetVerticalAlignment(VerticalAlignment.TOP));
                                    }
                                    else
                                    {
                                        paragraph.Add(new Text(displayValue).SetFont(kabrioFont));

                                        Cell cell = new Cell().Add(paragraph).SetTextAlignment(TextAlignment.CENTER).SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1));
                                        ProductItemTable.AddCell(cell.SetFontSize(10).SetVerticalAlignment(VerticalAlignment.TOP));
                                    }

                                }
                            }

                            int rowCount = data.ProductTable.Rows.Count;
                            float minHeight = 100 - (rowCount - 1) * 20;

                            minHeight = Math.Max(minHeight, 60);

                            int minRowCount = 6;
                            if (rowCount < minRowCount)
                            {
                                int missingRows = minRowCount - rowCount;
                                for (int j = 0; j < missingRows; j++)
                                {
                                    for (int i = 0; i < data.ProductTable.Columns.Count; i++)
                                    {
                                        Cell placeholderCell = new Cell().Add(new Paragraph("")).SetMinHeight(20).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1));

                                        ProductItemTable.AddCell(placeholderCell);
                                    }
                                }
                            }

                            DataRow lastRow = data.ProductTable.Rows[data.ProductTable.Rows.Count - 1];

                            // Extract values from the first 5 columns and remove empty values
                            string mergedText = "";
                            for (int i = 0; i < 4; i++)
                            {
                                string value = lastRow[i]?.ToString().Trim();
                                if (!string.IsNullOrEmpty(value) && value != "-")
                                {
                                    mergedText += value + "\n"; // Add values line by line
                                }
                            }

                            Cell mergedCell = new Cell(1, 4)
                                .Add(new Paragraph("No Of Product : " + mergedText.Trim()).SetFont(kabrioBoldFont).SetFontSize(10)).SetBorderTop(new SolidBorder(1)).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(HeaderBackgroundColor).SetFontColor(HeaderFontColor);

                            // Add the merged cell to the table
                            ProductItemTable.AddCell(mergedCell);

                            // Add the remaining columns dynamically
                            for (int i = 4; i < data.ProductTable.Columns.Count; i++)
                            {
                                string totalValue = lastRow[i]?.ToString() ?? " ";

                                Cell totalCell = new Cell()
                                    .Add(new Paragraph(totalValue).SetFont(kabrioBoldFont).SetFontSize(10)).SetBorderTop(new SolidBorder(1)).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(HeaderBackgroundColor).SetFontColor(HeaderFontColor);

                                ProductItemTable.AddCell(totalCell);
                            }

                            document.Add(ProductItemTable);


                            if (data.ProductOtherChargesTable.Rows.Count != 0)
                            {
                                float[] ForOtherChargersColumnWidth = { 70, 10, 10, 10 };

                                Table ForOtherChargersTable = new Table(UnitValue.CreatePercentArray(ForOtherChargersColumnWidth)).UseAllAvailableWidth();
                                ForOtherChargersTable.SetBorderLeft(new SolidBorder(1));
                                ForOtherChargersTable.SetBorderRight(new SolidBorder(1));
                                ForOtherChargersTable.SetBorderTop(new SolidBorder(1));
                                ForOtherChargersTable.SetBorder(Border.NO_BORDER);

                                // Add data rows
                                foreach (DataRow row in data.ProductOtherChargesTable.Rows)
                                {
                                    for (int i = 0; i < row.ItemArray.Length; i++)
                                    {
                                        var item = row.ItemArray[i];
                                        Cell cell = new Cell().Add(new Paragraph(item.ToString()).SetBorder(Border.NO_BORDER).SetPadding(0));

                                        var Font = (i == 2) ? notoSansBoldFont : kabrioBoldFont;
                                        var FontSize = (i == 2) ? 11 : 9;
                                        var PaddingTopSymbol = (i == 2) ? -7 : 0;
                                        cell.SetFont(Font).SetFontSize(FontSize).SetPaddingTop(PaddingTopSymbol).SetBorder(Border.NO_BORDER).SetBorderRight(new SolidBorder(0)).SetTextAlignment(TextAlignment.RIGHT);

                                        ForOtherChargersTable.AddCell(cell);
                                    }
                                }

                                document.Add(ForOtherChargersTable);
                            }

                            Table RoundoffGrandTotalMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 70, 30 })).UseAllAvailableWidth();
                            RoundoffGrandTotalMainTable.SetBorderBottom(new SolidBorder(0));
                            RoundoffGrandTotalMainTable.SetBorderLeft(new SolidBorder(1));
                            RoundoffGrandTotalMainTable.SetBorderRight(new SolidBorder(1));
                            RoundoffGrandTotalMainTable.SetBorderTop(new SolidBorder(1));
                            RoundoffGrandTotalMainTable.SetBorder(Border.NO_BORDER);

                            Table RoundoffTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            RoundoffTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).Add(new Paragraph("RoundOff Value").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            RoundoffTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).Add(new Paragraph("Grand Total").SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.RIGHT)));

                            Table GrandTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            GrandTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).Add(new Paragraph(data.RoundOffValue).SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            GrandTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0)).Add(new Paragraph(data.GrantTotal).SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.RIGHT)));

                            RoundoffGrandTotalMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderRight(new SolidBorder(0)).SetPadding(0).Add(RoundoffTable));
                            RoundoffGrandTotalMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderRight(new SolidBorder(0)).SetPadding(0).Add(GrandTable));

                            document.Add(RoundoffGrandTotalMainTable);


                            //Table Empty1Table = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //Empty1Table.SetBorderBottom(new SolidBorder(1));
                            //Empty1Table.SetBorderLeft(new SolidBorder(1));
                            //Empty1Table.SetBorderRight(new SolidBorder(1));
                            //Empty1Table.SetBorderTop(new SolidBorder(0));
                            //Empty1Table.SetBorder(Border.NO_BORDER);
                            //Empty1Table.SetHeight(15);

                            //document.Add(Empty1Table);

                            Table AmountFooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AmountFooterTable.SetBorderBottom(new SolidBorder(1));
                            AmountFooterTable.SetBorderLeft(new SolidBorder(1));
                            AmountFooterTable.SetBorderRight(new SolidBorder(1));
                            AmountFooterTable.SetBorder(Border.NO_BORDER);

                            AmountFooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).Add(new Paragraph("Total in words").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            AmountFooterTable.AddCell(new Cell().SetBorderBottom(new SolidBorder(1)).SetBorderTop(Border.NO_BORDER).Add(new Paragraph(System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(data.Amount_InWords.ToLower()).Insert(0, "F").Substring(1)).SetFont(kabrioFont).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(AmountFooterTable);

                            //Table NotesTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //NotesTable.SetBorderBottom(new SolidBorder(1));
                            //NotesTable.SetBorderLeft(new SolidBorder(1));
                            //NotesTable.SetBorderRight(new SolidBorder(1));
                            //NotesTable.SetBorder(Border.NO_BORDER);

                            //// Notes Header
                            //NotesTable.AddCell(new Cell()
                            //	.SetBorder(Border.NO_BORDER)
                            //	.SetBorderBottom(Border.NO_BORDER)
                            //	.Add(new Paragraph("Notes")
                            //	.SetFont(kabrioBoldFont)
                            //	.SetFontSize(9)
                            //	.SetTextAlignment(TextAlignment.LEFT)));

                            //// Notes Content
                            //string notesContent = string.IsNullOrWhiteSpace(data.Notes) ? "" : System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(data.Notes.ToLower()).Insert(0, "F").Substring(1);

                            //NotesTable.AddCell(new Cell()
                            //	.SetBorderBottom(new SolidBorder(1))
                            //	.SetBorderTop(Border.NO_BORDER)
                            //	.Add(new Paragraph(data.Notes)
                            //	.SetFont(kabrioFont)
                            //	.SetFontSize(9)
                            //	.SetTextAlignment(TextAlignment.LEFT)));

                            //document.Add(NotesTable);

                            Table BankTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            BankTable.SetBorderBottom(new SolidBorder(1));
                            BankTable.SetBorderLeft(new SolidBorder(1));
                            BankTable.SetBorderRight(new SolidBorder(1));
                            BankTable.SetBorderTop(new SolidBorder(0));
                            BankTable.SetBorder(Border.NO_BORDER);

                            BankTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Details").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));

                            document.Add(BankTable);

                            Table BankMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
                            BankMainTable.SetBorderBottom(new SolidBorder(1));
                            BankMainTable.SetBorderLeft(new SolidBorder(1));
                            BankMainTable.SetBorderRight(new SolidBorder(1));
                            BankMainTable.SetBorderTop(Border.NO_BORDER);
                            BankMainTable.SetBorder(Border.NO_BORDER);


                            Table BankDetailsTable = new Table(UnitValue.CreatePercentArray(new float[] { 40, 50 })).UseAllAvailableWidth();

                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Name").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.BankName).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Holder Name").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.AccountName).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Branch Name").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.BranchName).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Account No").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.AccountNumber).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Branch IFSC").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.IFSCCode).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            // Create a table with 3 columns, each taking a specific percentage of the available width
                            Table QRCodeDetails = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

                            var upiId = data.UPIId;
                            var payeeName = data.CompanyName;
                            var amount = data.GrantTotal;
                            var currency = "INR";
                            string transactionId = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{new Random().Next(1000, 9999)}";

                            var transactionNote = "Payment For Products";
                            var upiString = $"upi://pay?pa={upiId}&pn={payeeName}&am={amount}&cu={currency}&tn={transactionNote}";


                            BarcodeQRCode qrCode = new BarcodeQRCode(upiString);
                            Image qrCodeImage = new Image(qrCode.CreateFormXObject(pdf));

                            qrCodeImage.SetHeight(70); // Set height to 30px
                            qrCodeImage.SetWidth(70);  // Set width to 30px
                            qrCodeImage.SetHorizontalAlignment(HorizontalAlignment.CENTER);

                            QRCodeDetails.AddCell(new Cell().Add(qrCodeImage).SetBorder(Border.NO_BORDER).SetPaddingTop(5));
                            QRCodeDetails.AddCell(new Cell().Add(new Paragraph("UPI ID : " + data.UPIId).SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioFont).SetFontSize(9)).SetBorder(Border.NO_BORDER).SetPaddingTop(-5));

                            // Add the image to the first row, first column
                            Image pyamentPlaceholderImage = new Image(ImageDataFactory.Create("wwwroot/assets/PreviewPDF/PaymentPlaceHolderImages.png")); // Replace with your image path
                            pyamentPlaceholderImage.SetHeight(5);
                            pyamentPlaceholderImage.SetWidth(80);

                            QRCodeDetails.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(pyamentPlaceholderImage).SetPaddingLeft(90));

                            BankMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetPadding(0).SetPaddingTop(3).Add(BankDetailsTable));
                            BankMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetPadding(0).SetPaddingTop(-5).Add(QRCodeDetails));

                            document.Add(BankMainTable);


                            Table NotesTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            NotesTable.SetBorderBottom(new SolidBorder(1));
                            NotesTable.SetBorderLeft(new SolidBorder(1));
                            NotesTable.SetBorderRight(new SolidBorder(1));
                            NotesTable.SetBorder(Border.NO_BORDER);

                            // Notes Header
                            NotesTable.AddCell(new Cell()
                                .SetBorder(Border.NO_BORDER)
                                .SetBorderBottom(Border.NO_BORDER)
                                .Add(new Paragraph("Notes")
                                .SetFont(kabrioBoldFont)
                                .SetFontSize(9)
                                .SetTextAlignment(TextAlignment.LEFT)));

                            // Notes Content
                            string notesContent = string.IsNullOrWhiteSpace(data.Notes) ? "" : System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(data.Notes.ToLower()).Insert(0, "F").Substring(1);

                            NotesTable.AddCell(new Cell()
                                .SetBorderBottom(new SolidBorder(1))
                                .SetBorderTop(Border.NO_BORDER)
                                .Add(new Paragraph(data.Notes)
                                .SetFont(kabrioFont)
                                .SetFontSize(9)
                                .SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(NotesTable);

                            Table TearmSignatureFooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();

                            Table TearmFooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            TearmFooterTable.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1))
                                .Add(new Paragraph("Terms and Conditions")
                                    .SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            TearmFooterTable.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER)
                                .Add(new Paragraph(data.TermsAndCondition)
                                    .SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            Table SignatureFooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

                            string imgFolderPath1 = "wwwroot/TetroOne";
                            string imgFileName1 = data?.Signature; // If null, imgFileName1 will remain null
                            byte[] imageData1 = null;

                            // Check if the signature exists and file is valid
                            if (!string.IsNullOrEmpty(imgFileName1))
                            {
                                string imgPath1 = System.IO.Path.Combine(imgFolderPath1, imgFileName1);
                                string fullPath1 = System.IO.Path.GetFullPath(imgPath1);

                                if (File.Exists(fullPath1))
                                {
                                    string extension = System.IO.Path.GetExtension(fullPath1)?.ToLower();

                                    if (extension == ".png" || extension == ".jpg" || extension == ".jpeg" || extension == ".gif")
                                    {
                                        imageData1 = File.ReadAllBytes(fullPath1);
                                    }
                                    else if (extension == ".svg")
                                    {
                                        imageData1 = ConvertSvgToPng(fullPath1);
                                    }
                                }
                            }

                            // 🚀 Only create and bind image if valid data exists
                            Image imag = null;
                            if (imageData1 != null && imageData1.Length > 0)
                            {
                                imag = new Image(ImageDataFactory.Create(imageData1));
                                float imageWidth = 130f;
                                float imageHeight = 130f;
                                imag.ScaleToFit(imageWidth, imageHeight);
                            }

                            // ✅ Only add image cell if `imag` is not null
                            if (imag != null)
                            {
                                SignatureFooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER)
                                    .Add(imag.SetMarginLeft(50).SetTextAlignment(TextAlignment.CENTER)));
                            }
                            else
                            {
                                // Add an empty space to maintain the signature area
                                SignatureFooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER)
                                    .Add(new Paragraph(" ").SetHeight(50)));  // Empty space
                            }

                            // Add the signature label regardless of the image
                            SignatureFooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER)
                                .Add(new Paragraph("Authorised Signatory")
                                    .SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));

                            TearmSignatureFooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER)
                                .SetBorderBottom(new SolidBorder(1)).SetBorderLeft(new SolidBorder(1))
                                .SetBorderRight(new SolidBorder(1)).SetPadding(0).Add(TearmFooterTable));
                            TearmSignatureFooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER)
                                .SetBorderBottom(new SolidBorder(1)).SetBorderRight(new SolidBorder(1))
                                .SetPadding(0).Add(SignatureFooterTable));

                            document.Add(TearmSignatureFooterTable);


                            // Create a table with 3 columns, each taking a specific percentage of the available width
                            Table QRCodeDetails1 = new Table(UnitValue.CreatePercentArray(new float[] { 40, 60 })).UseAllAvailableWidth();


                            var upiId1 = data.UPIId;
                            var payeeName1 = data.CompanyName;
                            var amount1 = data.GrantTotal;
                            var currency1 = "INR";
                            string transactionId1 = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{new Random().Next(1000, 9999)}";

                            var transactionNote1 = "Payment For Products";
                            var upiString1 = $"upi://pay?pa={upiId}&pn={payeeName}&am={amount}&cu={currency}&tn={transactionNote}";

                            BarcodeQRCode qrCode1 = new BarcodeQRCode(upiString);
                            iText.Layout.Element.Image qrCodeImage1 = new iText.Layout.Element.Image(qrCode.CreateFormXObject(pdf));

                            qrCodeImage.SetHeight(70);
                            qrCodeImage.SetHorizontalAlignment(HorizontalAlignment.CENTER);

                            QRCodeDetails.AddCell(new Cell().Add(qrCodeImage).SetBorder(Border.NO_BORDER));
                            QRCodeDetails.AddCell(new Cell().Add(new Paragraph("UPI ID:\n " + data.UPIId).SetTextAlignment(TextAlignment.LEFT).SetFont(latoFont).SetFontSize(10)).SetBorder(Border.NO_BORDER).SetPaddingTop(10));

                            // Add the image to the first row, first column
                            iText.Layout.Element.Image pyamentPlaceholderImage1 = new iText.Layout.Element.Image(ImageDataFactory.Create("wwwroot/assets/PreviewPDF/PaymentPlaceHolderImages.png")); // Replace with your image path
                            pyamentPlaceholderImage.SetHeight(10);
                            pyamentPlaceholderImage.SetWidth(100);

                            QRCodeDetails.AddCell(new Cell(1, 2).SetBorder(Border.NO_BORDER).Add(pyamentPlaceholderImage));

                            document.Add(QRCodeDetails1);

                            document.Close();
                        }
                    }

                    pdfCopies.Add(stream.ToArray());
                }
            }

            byte[] combinedPdf = CombinePdfCopies(pdfCopies);
            return combinedPdf;
        }

        public byte[] SaleOrderPrintNew(int numberOfCopies)
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

                            Table DetailsMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 70, 30 })).UseAllAvailableWidth();
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

                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("GST INVOICE").SetFont(kabrioBoldFont).SetFontSize(14).SetFixedLeading(19).SetTextAlignment(TextAlignment.CENTER)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bill No      : ATP25-26/3250").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date         : 30-10-2025").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("HSN/SAC : 998821").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));

                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable1));
                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable2));

                            document.Add(DetailsMainTable);

                            Table MainTableBinding = new Table(UnitValue.CreatePercentArray(new float[] { 10, 10, 15, 25, 10, 10, 10, 10 })).UseAllAvailableWidth();
                            MainTableBinding.SetBorderRight(new SolidBorder(1));
                            MainTableBinding.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding.SetBorderTop(new SolidBorder(1));
                            MainTableBinding.SetBorder(Border.NO_BORDER);

                            Table MainTableBinding1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Ref No").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("6866").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("6867").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("-").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding2.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding2.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding2.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding2.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding2.SetBorder(Border.NO_BORDER);
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("De No").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("9105").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("9106").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("-").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding3 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding3.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding3.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding3.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding3.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding3.SetBorder(Border.NO_BORDER);
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Party De No").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1140").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("076").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("-").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding4 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding4.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding4.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding4.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding4.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding4.SetBorder(Border.NO_BORDER);
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Colour/Proces").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("BEIGE").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("BIOWASH").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DRYER").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("TUBULAR COMPACTING").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("BEIGE").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("BIOWASH").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DRYER").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("TUBULAR COMPACTING").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("SUB-TOTAL").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            Table MainTableBinding5 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding5.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding5.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding5.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding5.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding5.SetBorder(Border.NO_BORDER);
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Roll").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("2").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding6 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding6.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding6.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding6.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding6.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding6.SetBorder(Border.NO_BORDER);
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Weight").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("11.350").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("11.350").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("11.350").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("11.350").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("23.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("23.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("23.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("23.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("34.350").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding7 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding7.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding7.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding7.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding7.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding7.SetBorder(Border.NO_BORDER);
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Rate").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("150.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("10.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("10.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("5.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("150.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("10.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("10.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("5.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding7.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("-").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            Table MainTableBinding8 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            MainTableBinding8.SetBorderBottom(Border.NO_BORDER);
                            MainTableBinding8.SetBorderLeft(new SolidBorder(1));
                            MainTableBinding8.SetBorderRight(Border.NO_BORDER);
                            MainTableBinding8.SetBorderTop(Border.NO_BORDER);
                            MainTableBinding8.SetBorder(Border.NO_BORDER);
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Amount").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1,702.50").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("113.50").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("113.50").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("56.75").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("3,450.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("230.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("230.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("115.00").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            MainTableBinding8.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("6,011.25").SetFont(kabrioBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));


                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding1));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding2));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding3));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding4));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding5));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding6));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding7));
                            MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding8));

                            document.Add(MainTableBinding);


                            Table BankAmountTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
                            BankAmountTable.SetBorderBottom(new SolidBorder(1));
                            BankAmountTable.SetBorderLeft(new SolidBorder(1));
                            BankAmountTable.SetBorderRight(new SolidBorder(1));
                            BankAmountTable.SetBorderTop(Border.NO_BORDER);

                            Table BankAmountSubTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 15, 10, 75 })).UseAllAvailableWidth();
                            BankAmountSubTable1.SetBorder(Border.NO_BORDER);

                            BankAmountSubTable1.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Details  :-").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT).SetUnderline()));

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("A/C No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("0660000013292,").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("City Union Bank Ltd.,").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Branch").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("Tirupur Main Branch,").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("IFSC").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("CIUB0000066.").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            Table BankAmountSubTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 70, 15, 15 })).UseAllAvailableWidth();
                            BankAmountSubTable2.SetMarginTop(12);
                            BankAmountSubTable2.SetBorder(Border.NO_BORDER);

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("CGST @ 2.50%").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("150.28").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("SGST @ 2.50%").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("150.28").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Round Off").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("0.19").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("NET AMOUNT").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(1)).Add(new Paragraph().Add(new Text("6,312.00").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable1));
                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable2));

                            document.Add(BankAmountTable);


                            Table AmountTextTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            AmountTextTable.SetBorderBottom(new SolidBorder(1));
                            AmountTextTable.SetBorderLeft(new SolidBorder(1));
                            AmountTextTable.SetBorderRight(new SolidBorder(1));
                            AmountTextTable.SetBorderTop(Border.NO_BORDER);

                            AmountTextTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("Rupees Six Thousand Three Hundred Twelve Only").SetFont(kabrioBoldFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(AmountTextTable);

                            Table ClauseTextTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            ClauseTextTable.SetBorderBottom(new SolidBorder(1));
                            ClauseTextTable.SetBorderLeft(new SolidBorder(1));
                            ClauseTextTable.SetBorderRight(new SolidBorder(1));
                            ClauseTextTable.SetBorderTop(Border.NO_BORDER);

                            ClauseTextTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("ARBITRATION CLAUSE :- ").SetFont(kabrioBoldFont)).Add(new Text(" Any dispute arising out of this transaction/Contract will be referred to institutional Arbitration council of Tirupur as per rules & regulations of Aribitration council of Tirupur and the award passed will be binding on us.").SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

                            document.Add(ClauseTextTable);

                            Table FooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterTable.SetBorderBottom(new SolidBorder(1));
                            FooterTable.SetBorderLeft(new SolidBorder(1));
                            FooterTable.SetBorderRight(new SolidBorder(1));
                            FooterTable.SetBorderTop(Border.NO_BORDER);

                            Table FooterTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 33, 33, 33 })).UseAllAvailableWidth();
                            FooterTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("* Subject to TIRUPUR Jurisdicton only").SetFont(kabrioFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            FooterTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));
                            FooterTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("For").Add(new Text(" Adhithiya Textiles Process").SetFontColor(new DeviceRgb(255, 0, 0))).SetFixedLeading(10).SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER)));

                            Table FooterTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 33, 33, 33 })).UseAllAvailableWidth();
                            FooterTable2.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph("* Payments Should made within 45 Days").SetFont(kabrioFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            Table FooterTable3 = new Table(UnitValue.CreatePercentArray(new float[] { 70, 30 })).UseAllAvailableWidth();
                            FooterTable3.SetMarginTop(40);

                            FooterTable3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Received (Seal With Sign)").SetFont(kabrioFont).SetFontSize(9).SetMarginRight(60).SetFixedLeading(10).SetTextAlignment(TextAlignment.RIGHT)));
                            FooterTable3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Authorised Signatory").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));

                            FooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterTable1));
                            FooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterTable2));
                            FooterTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(FooterTable3));

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

        public byte[] OutwardAdithiyaPrint(int numberOfCopies, OutWardPrint data)
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
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.OutwardToName != null ? data.OutwardToName : "-").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.Address != null ? data.Address : "-").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.City != null ? data.City : "-").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GST " + data.GSTNumber != null ? data.GSTNumber : "-").SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            Table DetailsTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            DetailsTable2.SetBorderBottom(Border.NO_BORDER);
                            DetailsTable2.SetBorderLeft(new SolidBorder(1));
                            DetailsTable2.SetBorderRight(Border.NO_BORDER);
                            DetailsTable2.SetBorderTop(Border.NO_BORDER);

                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("OutWard").SetFont(kabrioBoldFont).SetFontSize(14).SetFixedLeading(19).SetTextAlignment(TextAlignment.CENTER)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DC No               : " + data.DCNo).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("DC Date           : " + data.DCDate).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Time                 : " + (data.Time == "" || data.Time == null ? '-' : data.Time)).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));
                            DetailsTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Delivery To      : " + (data.DeliveryTo == "" || data.DeliveryTo == null ? '-' : data.DeliveryTo)).SetFont(kabrioFont).SetFontSize(10).SetFixedLeading(12).SetTextAlignment(TextAlignment.LEFT)));

                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable1));
                            DetailsMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(DetailsTable2));

                            document.Add(DetailsMainTable);

                            //Table MainTableBinding = new Table(UnitValue.CreatePercentArray(new float[] { 15, 10, 10, 15, 15, 35 })).UseAllAvailableWidth();
                            //MainTableBinding.SetBorderRight(new SolidBorder(1));
                            //MainTableBinding.SetBorderLeft(new SolidBorder(1));
                            //MainTableBinding.SetBorderTop(new SolidBorder(1));
                            //MainTableBinding.SetBorder(Border.NO_BORDER);

                            //Table MainTableBinding1 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Fabric Qty").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("SINGLE JERSEY").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("COTTON LYCRA").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("INTERLOCK").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("HONEYCOMB").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //Table MainTableBinding2 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //MainTableBinding2.SetBorderBottom(Border.NO_BORDER);
                            //MainTableBinding2.SetBorderLeft(new SolidBorder(1));
                            //MainTableBinding2.SetBorderRight(Border.NO_BORDER);
                            //MainTableBinding2.SetBorderTop(Border.NO_BORDER);
                            //MainTableBinding2.SetBorder(Border.NO_BORDER);
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Dia").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("30").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("28").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("30").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("32").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //Table MainTableBinding3 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //MainTableBinding3.SetBorderBottom(Border.NO_BORDER);
                            //MainTableBinding3.SetBorderLeft(new SolidBorder(1));
                            //MainTableBinding3.SetBorderRight(Border.NO_BORDER);
                            //MainTableBinding3.SetBorderTop(Border.NO_BORDER);
                            //MainTableBinding3.SetBorder(Border.NO_BORDER);
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Roll").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("1").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("3").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("2").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding3.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //Table MainTableBinding4 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //MainTableBinding4.SetBorderBottom(Border.NO_BORDER);
                            //MainTableBinding4.SetBorderLeft(new SolidBorder(1));
                            //MainTableBinding4.SetBorderRight(Border.NO_BORDER);
                            //MainTableBinding4.SetBorderTop(Border.NO_BORDER);
                            //MainTableBinding4.SetBorder(Border.NO_BORDER);
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Inward Wt").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("2.000").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("2.800").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("7.200").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("4.500").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding4.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //Table MainTableBinding5 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //MainTableBinding5.SetBorderBottom(Border.NO_BORDER);
                            //MainTableBinding5.SetBorderLeft(new SolidBorder(1));
                            //MainTableBinding5.SetBorderRight(Border.NO_BORDER);
                            //MainTableBinding5.SetBorderTop(Border.NO_BORDER);
                            //MainTableBinding5.SetBorder(Border.NO_BORDER);
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Delivery Wt").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("1.800").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("2.650").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("6.950").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("4.300").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding5.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("-").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));

                            //Table MainTableBinding6 = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            //MainTableBinding6.SetBorderBottom(Border.NO_BORDER);
                            //MainTableBinding6.SetBorderLeft(new SolidBorder(1));
                            //MainTableBinding6.SetBorderRight(Border.NO_BORDER);
                            //MainTableBinding6.SetBorderTop(Border.NO_BORDER);
                            //MainTableBinding6.SetBorder(Border.NO_BORDER);
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).Add(new Paragraph("Details").SetFont(kabrioBoldFont).SetFontSize(10).SetFixedLeading(15).SetTextAlignment(TextAlignment.CENTER)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Your DC No : 474").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Colour          : LIGHT BEIGE").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Process        : BIOWASH, DRYER").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Loss %          : 10%").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("Your DC No : 513").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Colour          : BLACK").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Process        : BIOWASH").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Loss %          : 5.36%").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("Your DC No : 514").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Colour          : WHITE").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Process        : SOFT FLOW, DRYER").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Loss %          : 3.47%").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0)).Add(new Paragraph("Your DC No : 515").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Colour          : MAROON").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Process        : BIOWASH, COMPACTING").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));
                            //MainTableBinding6.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Loss %          : 4.44%").SetFont(kabrioFont).SetFontSize(10).SetTextAlignment(TextAlignment.LEFT)));

                            //MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding1));
                            //MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding2));
                            //MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding3));
                            //MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding4));
                            //MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding5));
                            //MainTableBinding.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(MainTableBinding6)); 

                            //document.Add(MainTableBinding);

                            string[] visibleColumns = { "Fabric", "Dia", "Roll", "Inward Wt", "Delivery Wt", "Details" };

                            float[] widths = { 20, 10, 10, 15, 15, 30 };

                            Table table = new Table(UnitValue.CreatePercentArray(widths))
                                .UseAllAvailableWidth()
                                .SetBorder(new SolidBorder(1));


                            // ================= HEADER =================
                            foreach (string col in visibleColumns)
                            {
                                table.AddHeaderCell(
                                    new Cell()
                                        .Add(new Paragraph(col)
                                            .SetFont(kabrioBoldFont)
                                            .SetFontSize(10)
                                            .SetTextAlignment(TextAlignment.CENTER))
                                        .SetBorder(new SolidBorder(1))
                                );
                            }
                             
                            // ================= DATA ROWS =================
                            foreach (DataRow row in data.ProductItemData.Rows)
                            {
                                table.AddCell(CreateCell(row["Fabric"]));
                                table.AddCell(CreateCell(row["Dia"]));
                                table.AddCell(CreateCell(row["Roll"]));
                                table.AddCell(CreateCell(row["Inward Wt"]));
                                table.AddCell(CreateCell(row["Delivery Wt"]));

                                // -------- DETAILS COLUMN (CORRECTED) ----------
                                Paragraph details = new Paragraph()
                                    .SetFont(kabrioFont)
                                    .SetFontSize(9)
                                    .SetTextAlignment(TextAlignment.LEFT);

                                bool hasDetails = false;
                                if (data.ProductItemData.Columns.Contains("DC No"))
                                {
                                    string dcNo = string.IsNullOrWhiteSpace(row["DC No"]?.ToString())
                                        ? "-"
                                        : row["DC No"].ToString();

                                    details.Add($"Your DC No : {dcNo}\n");
                                    hasDetails = true;
                                }

                                if (data.ProductItemData.Columns.Contains("Color"))
                                {
                                    string color = string.IsNullOrWhiteSpace(row["Color"]?.ToString())
                                        ? "-"
                                        : row["Color"].ToString();

                                    details.Add($"Colour          : {color}\n");
                                    hasDetails = true;
                                }

                                if (data.ProductItemData.Columns.Contains("Process"))
                                {
                                    string process = string.IsNullOrWhiteSpace(row["Process"]?.ToString())
                                        ? "-"
                                        : row["Process"].ToString();

                                    details.Add($"Process        : {process}\n");
                                    hasDetails = true;
                                }

                                // ✅ LOSS % — ALWAYS SHOW
                                if (data.ProductItemData.Columns.Contains("Loss"))
                                {
                                    string lossValue = string.IsNullOrWhiteSpace(row["Loss"]?.ToString())
                                        ? "-"
                                        : row["Loss"].ToString();

                                    details.Add($"Loss %          : {lossValue}");
                                    hasDetails = true;
                                }

                                // Safety (rare case: no columns at all)
                                if (!hasDetails)
                                    details.Add("-");

                                table.AddCell(
                                    new Cell()
                                        .Add(details)
                                        .SetBorder(new SolidBorder(1))
                                        .SetPaddingLeft(6)
                                );
                            }


                            // ================= CELL METHOD =================
                            Cell CreateCell(object value)
                            {
                                return new Cell()
                                    .Add(new Paragraph(
                                            string.IsNullOrWhiteSpace(value?.ToString()) ? "-" : value.ToString()
                                        )
                                        .SetFont(kabrioFont)
                                        .SetFontSize(9)
                                        .SetTextAlignment(TextAlignment.CENTER))
                                    .SetBorder(new SolidBorder(1))
                                    .SetHeight(18);
                            }
                             
                            // ================= EMPTY ROWS (ONLY HORIZONTAL LINES) ================= 
                            //int minRows = 6;   // minimum rows you want visible
                            //int currentRows = data.ProductItemData.Rows.Count;
                            //
                            //// calculate how many empty rows are needed
                            //int emptyRowsToAdd = Math.Max(0, minRows - currentRows);
                            //
                            //// estimated row height based on font size and spacing
                            //float realRowHeight = 12f; // you can adjust if needed
                            //
                            //for (int i = 0; i < emptyRowsToAdd; i++)
                            //{
                            //    for (int c = 0; c < 6; c++)
                            //    {
                            //        Cell emptyCell = new Cell()
                            //            .Add(new Paragraph(" "))     // blank content
                            //            .SetFont(kabrioFont)
                            //            .SetFontSize(9)
                            //            .SetHeight(realRowHeight)    // match estimated row height
                            //            .SetBorder(Border.NO_BORDER); // no borders at all
                            //
                            //        table.AddCell(emptyCell);
                            //    }
                            //}



                            document.Add(table);

                            Table BankAmountTable = new Table(UnitValue.CreatePercentArray(new float[] { 65, 35 })).UseAllAvailableWidth();
                            BankAmountTable.SetBorderBottom(new SolidBorder(1));
                            BankAmountTable.SetBorderLeft(new SolidBorder(1));
                            BankAmountTable.SetBorderRight(new SolidBorder(1));
                            BankAmountTable.SetBorderTop(new SolidBorder(0));

                            Table BankAmountSubTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 24, 5, 68, 2 })).UseAllAvailableWidth();
                            BankAmountSubTable1.SetBorder(Border.NO_BORDER);

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Total Inward Wt").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(string.IsNullOrWhiteSpace(data.TotalInwardWt) ? "-" : data.TotalInwardWt).SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT))); 
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Total Delivery Wt").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.TotalOutwardWt).SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Avg Loss %").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(string.IsNullOrWhiteSpace(data.AvgLoss) ? "-" : data.AvgLoss).SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable1.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            Table BankAmountSubTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 35, 5, 58, 2 })).UseAllAvailableWidth();
                            BankAmountSubTable2.SetBorder(Border.NO_BORDER);

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Delivered by").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.DeliveredBy).SetFont(kabrioFont)).SetFixedLeading(10).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Vehicle No").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.VehicleNo).SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Driver Name").SetFont(kabrioBoldFont).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.CENTER)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(data.DriverName).SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));
                            BankAmountSubTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text("").SetFont(kabrioFont)).SetFontSize(9).SetFixedLeading(10).SetTextAlignment(TextAlignment.LEFT)));

                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable1));
                            BankAmountTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(BankAmountSubTable2));

                            document.Add(BankAmountTable);

                            Table FooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
                            FooterTable.SetBorderBottom(new SolidBorder(1));
                            FooterTable.SetBorderLeft(new SolidBorder(1));
                            FooterTable.SetBorderRight(new SolidBorder(1));
                            FooterTable.SetBorderTop(Border.NO_BORDER);

                            Table FooterTable1 = new Table(UnitValue.CreatePercentArray(new float[] { 33, 33, 33 })).UseAllAvailableWidth();
                            FooterTable1.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph("For").Add(new Text(" Adhithiya Textiles Process").SetFontColor(new DeviceRgb(255, 0, 0))).SetFixedLeading(10).SetFont(kabrioBoldFont).SetFontSize(12).SetTextAlignment(TextAlignment.RIGHT)));

                            Table FooterTable2 = new Table(UnitValue.CreatePercentArray(new float[] { 70, 30 })).UseAllAvailableWidth();
                            FooterTable2.SetMarginTop(60);

                            FooterTable2.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Delivered (Seal With Sign)").SetFont(kabrioFont).SetFontSize(9).SetMarginRight(60).SetFixedLeading(10).SetTextAlignment(TextAlignment.RIGHT)));
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
        public static string SplitTheNumber(string DataForIrn)
        {
            if (DataForIrn.Length > 49)
            {
                string firstPart = DataForIrn.Substring(0, 45);
                string secondPart = DataForIrn.Substring(45);
                DataForIrn = firstPart + " " + secondPart;
            }
            return (DataForIrn);
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

        private string CapitalizeWords(string input)
        {
            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
            return textInfo.ToTitleCase(input);
        }
    }
}
