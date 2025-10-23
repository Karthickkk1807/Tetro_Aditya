using DocumentFormat.OpenXml.Drawing;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Events;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using iText.Layout.Properties;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Text;
using Paragraph = iText.Layout.Element.Paragraph;
using Table = iText.Layout.Element.Table;

namespace TetroONE.Models
{
    public class PDFService
    {
        public byte[] DownloadPDF(PayslipDownload payslip)
        {
            //Define your memory stream which will temporarily hold the PDF
            using (MemoryStream stream = new MemoryStream())
            {
                //Initialize PDF writer
                PdfWriter writer = new PdfWriter(stream);

                //Initialize PDF document
                PdfDocument pdf = new PdfDocument(writer);


                // Initialize document
                Document document = new Document(pdf);

                // Add content to the documentm 
                Table table = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();

                // Set border property to NONE for each cell to remove table border
                Cell imageCell = new Cell();
                iText.Layout.Element.Image img = new iText.Layout.Element.Image(ImageDataFactory.Create("wwwroot/ModuleImages/TetroSoft_logo_payslip.png"));
                imageCell.SetBorder(Border.NO_BORDER);
                imageCell.SetHorizontalAlignment(HorizontalAlignment.CENTER);
                imageCell.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                imageCell.Add(img).SetTextAlignment(TextAlignment.CENTER);
                table.AddCell(imageCell);
                Cell labelCell = new Cell();
                labelCell.SetBorder(Border.NO_BORDER);
                labelCell.Add(new Paragraph($"{payslip.CompanyName}")).SetTextAlignment(TextAlignment.CENTER).SetFontSize(16);
                labelCell.Add(new Paragraph($"{payslip.CompanyAddress}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(12));
                table.AddCell(labelCell);
                document.Add(table);

                document.Add(new Paragraph($"{payslip.PaySlip}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(14).SetPadding(5));

                Table table2 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();
                Table table3 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();
                Table table4 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();

                Cell cell2 = new Cell().SetFontSize(12).SetPadding(5);
                cell2.SetBorder(Border.NO_BORDER);
                cell2.Add(new Paragraph($"Name"));
                cell2.Add(new Paragraph($"EmployeeId"));
                cell2.Add(new Paragraph($"Designation"));
                cell2.Add(new Paragraph($"Effective Work Days"));
                cell2.Add(new Paragraph($"LOP"));
                cell2.Add(new Paragraph($"PayMentMode"));
                table3.AddCell(cell2);

                Cell cell3 = new Cell().SetFontSize(12).SetPadding(5);
                cell3.SetBorder(Border.NO_BORDER);
                //cell3.Add(new Paragraph($"{payslip.Name}"));
                string truncatedName = payslip.Name.Length > 14 ? payslip.Name.Substring(0, 14) + "....." : payslip.Name;
                cell3.Add(new Paragraph(truncatedName));
                cell3.Add(new Paragraph($"{payslip.EmployeeId}"));
                cell3.Add(new Paragraph($"{payslip.Designation}"));
                cell3.Add(new Paragraph($"{payslip.EffectiveWorkDays}"));
                cell3.Add(new Paragraph($"{payslip.LOP}"));
                cell3.Add(new Paragraph($"{payslip.PayMentMode}"));
                table3.AddCell(cell3);
                table2.AddCell(table3);

                Cell cell4 = new Cell().SetFontSize(12).SetPadding(5);
                cell4.SetBorder(Border.NO_BORDER);
                cell4.Add(new Paragraph($"Bank Name"));
                cell4.Add(new Paragraph($"Account Number"));
                cell4.Add(new Paragraph($"PAN Number "));
                if (payslip.PayslipModel == "Advance")
                {
                    cell4.Add(new Paragraph($"UAN Number"));
                    cell4.Add(new Paragraph($"PF Number"));
                }
                table4.AddCell(cell4);

                Cell cell5 = new Cell().SetFontSize(12).SetPadding(5);
                cell5.SetBorder(Border.NO_BORDER);
                string truncatedBankName = payslip.BankName.Length > 16 ? payslip.BankName.Substring(0, 16) + "....." : payslip.BankName;
                cell5.Add(new Paragraph(truncatedBankName));
                //cell5.Add(new Paragraph($"{payslip.BankName}"));
                cell5.Add(new Paragraph($"{payslip.AccountNumber}"));
                cell5.Add(new Paragraph($"{payslip.PANnumber}"));
                if (payslip.PayslipModel == "Advance")
                {
                    cell5.Add(new Paragraph($"{payslip.UANNumber}"));
                    cell5.Add(new Paragraph($"{payslip.PFNumber}"));
                }
                table4.AddCell(cell5);
                table2.AddCell(table4);
                document.Add(table2);

                document.Add(new Paragraph("").SetTextAlignment(TextAlignment.CENTER).SetFontSize(14).SetPadding(5));

                Table table6 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();  // 1st row

                Table table7 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();    // 1st row 1 cell
                Table table8 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();    // 1st row 2nd cell

                Table table9 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();    // 2nd row

                Table table10 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();   // 2st row 1th cell
                Table table11 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();   // 2st row 2nd cell

                Cell cell6 = new Cell().SetFontSize(12).SetPadding(5);
                cell6.SetBorder(Border.NO_BORDER);
                cell6.Add(new Paragraph($"Earnings"));
                table7.AddCell(cell6);

                Cell cell7 = new Cell().SetFontSize(12).SetPadding(5);
                cell7.SetBorder(Border.NO_BORDER);
                cell7.Add(new Paragraph($"Amount"));
                table7.AddCell(cell7);

                table6.AddCell(table7);

                Cell cell8 = new Cell().SetFontSize(12).SetPadding(5);
                cell8.SetBorder(Border.NO_BORDER);
                cell8.Add(new Paragraph($"Deductions"));
                table8.AddCell(cell8);

                Cell cell9 = new Cell().SetFontSize(12).SetPadding(5);
                cell9.SetBorder(Border.NO_BORDER);
                cell9.Add(new Paragraph($"Amount"));
                table8.AddCell(cell9);

                table6.AddCell(table8);

                document.Add(table6);

                Cell cell10 = new Cell().SetFontSize(12).SetPadding(5);
                cell10.SetBorder(Border.NO_BORDER);
                cell10.Add(new Paragraph($"Basic Pay"));
                cell10.Add(new Paragraph($"HRA"));
                cell10.Add(new Paragraph($"Other Allowance"));
                cell10.Add(new Paragraph($"Claim"));
                cell10.Add(new Paragraph($"Bonus"));
                table10.AddCell(cell10);

                Cell cell11 = new Cell().SetFontSize(12).SetPadding(5);
                cell11.SetBorder(Border.NO_BORDER);
                cell11.Add(new Paragraph($"{payslip.BasicPay}"));
                cell11.Add(new Paragraph($"{payslip.HRA}"));
                cell11.Add(new Paragraph($"{payslip.OtherAllowance}"));
                cell11.Add(new Paragraph($"{payslip.Claim}"));
                cell11.Add(new Paragraph($"{payslip.Bonus}"));
                table10.AddCell(cell11);
                table9.AddCell(table10);

                Cell cell12 = new Cell().SetFontSize(12).SetPadding(5);
                cell12.SetBorder(Border.NO_BORDER);
                if (payslip.PayslipModel == "Advance")
                {
                    cell12.Add(new Paragraph($"PF"));
                    cell12.Add(new Paragraph($"ESI"));
                    cell12.Add(new Paragraph($"Income Tax"));
                }
                cell12.Add(new Paragraph($"Leave Deduction"));
                cell12.Add(new Paragraph($"Advance Amount"));
                cell12.Add(new Paragraph($"Loan Amount"));
                cell12.Add(new Paragraph($"Other Deduction"));
                table11.AddCell(cell12);

                Cell cell13 = new Cell().SetFontSize(12).SetPadding(5);
                cell13.SetBorder(Border.NO_BORDER);
                if (payslip.PayslipModel == "Advance")
                {
                    cell13.Add(new Paragraph($"{payslip.PF}"));
                    cell13.Add(new Paragraph($"{payslip.ESI}"));
                    cell13.Add(new Paragraph($"{payslip.IncomeTax}"));
                }
                cell13.Add(new Paragraph($"{payslip.LeaveDeduction}"));
                cell13.Add(new Paragraph($"{payslip.AdvanceAmount}"));
                cell13.Add(new Paragraph($"{payslip.LoanAmount}"));
                cell13.Add(new Paragraph($"{payslip.OtherDeduction}"));
                table11.AddCell(cell13);
                table9.AddCell(table11);
                document.Add(table9);

                Table table12 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();
                Table table13 = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();

                Cell cell14 = new Cell().SetFontSize(12).SetPadding(5);
                cell14.SetBorder(Border.NO_BORDER);
                cell14.Add(new Paragraph($"Total Earnings"));
                cell14.Add(new Paragraph($"Total Deduction"));
                table13.AddCell(cell14);

                Cell cell15 = new Cell().SetFontSize(12).SetPadding(5);
                cell15.SetBorder(Border.NO_BORDER);
                cell15.Add(new Paragraph($"{payslip.TotalEarning}"));
                cell15.Add(new Paragraph($"{payslip.TotalDeduction}"));
                table13.AddCell(cell15);
                table12.AddCell(table13);
                document.Add(table12);

                Table table14 = new Table(UnitValue.CreatePercentArray(1)).UseAllAvailableWidth();

                Cell cell16 = new Cell().SetFontSize(12).SetPadding(5);
                cell16.Add(new Paragraph($"Net Pay    {payslip.NetPay}   {payslip.InWords} "));
                table14.AddCell(cell16);
                document.Add(table14);

                // Close the Document
                document.Close();

                return stream.ToArray();
            }
        }

        public class FooterEventHandler : IEventHandler
        {
            public void HandleEvent(Event @event)
            {
                PdfDocumentEvent docEvent = (PdfDocumentEvent)@event;
                PdfDocument pdfDoc = docEvent.GetDocument();
                PdfPage page = docEvent.GetPage();
                int pageNumber = pdfDoc.GetPageNumber(page);
                PdfCanvas canvas = new PdfCanvas(page.NewContentStreamBefore(), page.GetResources(), pdfDoc);

                // Define the content for RO, HO, and BO addresses with newline characters for line breaks
                String roContent = "RO : 11/5A, Pattatharasiamman Kovil Street,Singanallur, Coimbatore-641005";
                String hoContent1 = "HO : #12-I | Rajagopal Street, Nehru nagar East | SITRA | Coimbatore-641014 | Tel:91-422-3221423 | Cell: 9750913179";
                String hoContent2 = "    E-Mail : info@airlogix.in | airlogixsullair@gmail.com";
                String boContent = "BO : #22 | Sakthinagar main road| Porur | Chennai - 600116 | Tel:91-44-24473902 | Cell: 9750913182 | E-Mail : sales@airlogix.in | admin@airlogix.in";

                // Set the font and size
                PdfFont font = PdfFontFactory.CreateFont("Helvetica");
                canvas.SetFontAndSize(font, 8);

                // Define the positions for each address
                float xPosition = 40;
                float yPosition = 60;
                float lineSpacing = 10; // Adjust this value for desired spacing between lines
                float yOffset = 5; // Adjust this value for top and bottom padding
                float xOffset = 200;

                // Add the content for RO, HO, and BO addresses to the footer with proper line breaks
                canvas.BeginText().MoveText(xPosition, yPosition).ShowText(roContent).EndText();
                canvas.BeginText().MoveText(xPosition, yPosition - (lineSpacing + yOffset)).ShowText(hoContent1).EndText(); // Adjust Y position for the second line
                canvas.BeginText().MoveText(xPosition, yPosition - 2 * (lineSpacing + yOffset)).ShowText(hoContent2).EndText(); // Adjust Y position for the second line
                canvas.BeginText().MoveText(xPosition, yPosition - 3 * (lineSpacing + yOffset)).ShowText(boContent).EndText(); // Adjust Y position for the third line

            }
        }

        static string CleanData(string input)
        {
            return input.Replace("&nbsp;", "").Trim();
        }

        public class FooterDynamicEventHandler : IEventHandler
        {
            string roContent;
            string hoContent;
            string boContent;

            public FooterDynamicEventHandler(string roContent, string hoContent, string boContent)
            {
                this.roContent = roContent;
                this.hoContent = hoContent;
                this.boContent = boContent;
            }

            public void HandleEvent(Event @event)
            {
                PdfDocumentEvent docEvent = (PdfDocumentEvent)@event;
                PdfDocument pdfDoc = docEvent.GetDocument();
                PdfPage page = docEvent.GetPage();
                int pageNumber = pdfDoc.GetPageNumber(page);
                PdfCanvas canvas = new PdfCanvas(page.NewContentStreamBefore(), page.GetResources(), pdfDoc);

                // Set the font and size
                PdfFont font = PdfFontFactory.CreateFont("Helvetica");
                canvas.SetFontAndSize(font, 8);

                // Define the positions for each address
                float xPosition = 40;
                float yPosition = 60;
                float lineSpacing = 10; // Adjust this value for desired spacing between lines
                float yOffset = 5; // Adjust this value for top and bottom padding
                float xOffset = 200;

                // Add the content for RO, HO, and BO addresses to the footer with proper line breaks
                canvas.BeginText().MoveText(xPosition, yPosition).ShowText(roContent).EndText();
                canvas.BeginText().MoveText(xPosition, yPosition - (lineSpacing + yOffset)).ShowText(hoContent).EndText(); // Adjust Y position for the second line
                canvas.BeginText().MoveText(xPosition, yPosition - 2 * (lineSpacing + yOffset)).ShowText(boContent).EndText(); // Adjust Y position for the second line
                //canvas.BeginText().MoveText(xPosition, yPosition - 3 * (lineSpacing + yOffset)).ShowText(boContent).EndText(); // Adjust Y position for the third line

            }
        }

        // Define the headers for different copies
        string[] headers = new string[]
        {
                 "ORIGINAL FOR CUSTOMER",
                 "DUPLICATE FOR TRANSPORTER",
                 "TRIPLICATE FOR SUPPLIER",
                 "EXTRA COPY"
        };

        public static string Decode(string token)
        {
            var parts = token.Split('.');
            var header = parts[0];
            var payload = parts[1];
            var signature = parts[2];
            byte[] crypto = Base64UrlDecode(parts[2]);
            var headerJson = Encoding.UTF8.GetString(Base64UrlDecode(header));
            var headerData = JObject.Parse(headerJson);
            var payloadJson = Encoding.UTF8.GetString(Base64UrlDecode(payload));
            var payloadData = JObject.Parse(payloadJson);
            return headerData.ToString() + payloadData.ToString();
        }

        public static byte[] Base64UrlDecode(string input)
        {
            try
            {
                // Replace URL-safe characters back to standard Base64 characters
                input = input.Replace('-', '+').Replace('_', '/');

                // Add padding if necessary
                switch (input.Length % 4)
                {
                    case 2:
                        input += "==";
                        break;
                    case 3:
                        input += "=";
                        break;
                }

                return Convert.FromBase64String(input);
            }
            catch (System.FormatException ex)
            {
                // Handle the format exception (invalid Base64 string)
                Console.WriteLine("Error decoding Base64 string: " + ex.Message);
                throw; // Rethrow the exception to propagate it to the caller
            }
        }

        // Method to convert a string to a byte array using ASCII encoding
        public byte[] StringToByteArray(string input)
        {
            return Encoding.ASCII.GetBytes(input);
        }

        public byte[] DownloadReport(ReportDownload report, DataTable dt)
        {
            //Define your memory stream which will temporarily hold the PDF
            using (MemoryStream stream = new MemoryStream())
            {
                //Initialize PDF writer
                PdfWriter writer = new PdfWriter(stream);

                //Initialize PDF document
                PdfDocument pdf = new PdfDocument(writer);

                // Initialize document
                Document document = new Document(pdf);

                // Add content to the document
                Table table = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();

                // Set border property to NONE for each cell to remove table border
                Cell imageCell = new Cell();
                iText.Layout.Element.Image img = new iText.Layout.Element.Image(ImageDataFactory.Create("wwwroot/assets/PreviewPDF/KaalaiyanPDFLogo.png"));
                img.SetWidth(70);
                img.SetHeight(70);
                imageCell.SetBorder(Border.NO_BORDER);
                imageCell.SetHorizontalAlignment(HorizontalAlignment.CENTER);
                imageCell.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                imageCell.Add(img).SetTextAlignment(TextAlignment.CENTER);
                table.AddCell(imageCell);
                Cell labelCell = new Cell();
                labelCell.SetBorder(Border.NO_BORDER);
                Paragraph companyNameParagraph = new Paragraph($"{report.CompanyName}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(16).SetBold();
                labelCell.Add(companyNameParagraph);
                labelCell.Add(new Paragraph($"{report.Address}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(12));
                labelCell.Add(new Paragraph($"{report.Location}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(12));
                labelCell.Add(new Paragraph($"{report.Contact}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(12));
                labelCell.Add(new Paragraph($"{report.Website}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(12));
                labelCell.Add(new Paragraph($"{report.GSTNumber}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(12));
                table.AddCell(labelCell).SetPadding(20);
                document.Add(table);

                // Add a horizontal line
                LineSeparator line = new LineSeparator(new SolidLine());
                document.Add(line);

                document.Add(new Paragraph($"{report.Reportname}").SetTextAlignment(TextAlignment.CENTER).SetFontSize(14).SetPadding(10).SetBold());

                Table table2 = new Table(UnitValue.CreatePercentArray(3)).UseAllAvailableWidth();
                Cell cell1 = new Cell().SetFontSize(10).SetBold();
                cell1.SetBorder(Border.NO_BORDER);
                cell1.Add(new Paragraph($"Report Category : {report.ReportCategory}"));
                table2.AddCell(cell1);

                Cell cell2 = new Cell().SetFontSize(10).SetBold();
                cell2.SetBorder(Border.NO_BORDER);
                cell2.Add(new Paragraph($"Report Value : {report.ReportValue}"));
                table2.AddCell(cell2);

                Cell cell3 = new Cell().SetFontSize(10).SetBold();
                cell3.SetBorder(Border.NO_BORDER);
                cell3.Add(new Paragraph($"Duration : {report.Duration}"));
                table2.AddCell(cell3);

                document.Add(table2);

                Table table3 = new Table(UnitValue.CreatePercentArray(1)).UseAllAvailableWidth();
                Cell cell4 = new Cell().SetPadding(10);
                cell4.SetBorder(Border.NO_BORDER);
                table3.AddCell(cell4).SetPadding(10);
                document.Add(table3);

                // Add DataTable to the PDF
                Table dataTable = new Table(UnitValue.CreatePercentArray(dt.Columns.Count - 1)).UseAllAvailableWidth();
                // Add header cells
                foreach (DataColumn column in dt.Columns)
                {
                    if (column.ColumnName != dt.Columns[dt.Columns.Count - 1].ColumnName)
                    {
                        Cell headerCell = new Cell().SetFontSize(10).SetBold();
                        headerCell.Add(new Paragraph(column.ColumnName));
                        dataTable.AddHeaderCell(headerCell);
                    }
                }

                // Add data cells
                foreach (DataRow row in dt.Rows)
                {
                    for (int i = 0; i < dt.Columns.Count - 1; i++) // Exclude the last column
                    {
                        Cell dataCell = new Cell().SetFontSize(10);
                        dataCell.Add(new Paragraph(row[i].ToString()));
                        dataTable.AddCell(dataCell);
                    }
                }

                document.Add(dataTable);

                // Close the Document
                document.Close();

                return stream.ToArray();
            }
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

        public static DeviceRgb HexToRgb(string hexColor)
        {
            if (hexColor.StartsWith("#"))
                hexColor = hexColor.Substring(1);

            int r = int.Parse(hexColor.Substring(0, 2), System.Globalization.NumberStyles.HexNumber);
            int g = int.Parse(hexColor.Substring(2, 2), System.Globalization.NumberStyles.HexNumber);
            int b = int.Parse(hexColor.Substring(4, 2), System.Globalization.NumberStyles.HexNumber);

            return new DeviceRgb(r, g, b);
        }
    }
}
