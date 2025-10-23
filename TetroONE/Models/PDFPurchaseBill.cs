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
using iText.Kernel.Events;
using iText.Kernel.Pdf.Canvas;
using iText.IO.Font.Constants;
using System.Text;
using Newtonsoft.Json.Linq;
using HtmlAgilityPack;
using iText.Barcodes;
using iText.IO.Font;
using iText.IO.Font.Otf;
using System.IO;
using iText.Kernel.Geom;
using SkiaSharp;
using Svg.Skia;
using System.Globalization;
using TetroONE.Models;


namespace TetroPos.Models
{
	public class PDFPurchaseBill
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

		public byte[] PurchaseBillPrint(PurchaseBillPrint data, int numberOfCopies)
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
							document.SetFont(latoFont);
							document.Add(new Paragraph("PURCHASE BILL").SetFont(latoBoldFont).SetFontSize(14).SetCharacterSpacing(0.3f));

							// Create a table with 3 columns, each taking a specific percentage of the available width
							Table BillingAddressTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 5, 75 })).UseAllAvailableWidth();

							BillingAddressTable.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyName).SetFont(latoBoldFont).SetFontSize(11)));

							// Add the Billing address
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Address").SetFont(latoBoldFont).SetFontSize(10)));
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyAddress).SetFont(latoFont).SetFontSize(10)));

							// Add the Billing city
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("City").SetFont(latoBoldFont).SetFontSize(10)));
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyCity).SetFont(latoFont).SetFontSize(10)));

							// Add the Billing contact
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GST").SetFont(latoBoldFont).SetFontSize(10)));
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							BillingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.CompanyGSTNumber).SetFont(latoFont).SetFontSize(10)));


							// Create a table with 3 columns, each taking a specific percentage of the available width
							Table POOrderDetailsTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();

							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("\u00A0").SetFont(latoBoldFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));
							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("\u00A0").SetFont(latoBoldFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));
							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Date").SetFont(latoBoldFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));
							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PurchaseOrder No").SetFont(latoBoldFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));
							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.PurchaseBillDate).SetFont(latoFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));
							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.PurchaseBillNumber).SetFont(latoFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));
							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("\u00A0").SetFont(latoBoldFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));
							POOrderDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("\u00A0").SetFont(latoBoldFont).SetFontSize(10)).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE));

							// Create a table with 3 columns, each taking a specific percentage of the available width
							Table VendorAddressTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 5, 75 })).UseAllAvailableWidth();

							VendorAddressTable.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph(data.VendorName).SetFont(latoBoldFont).SetFontSize(11)));

							// Add the Billing address
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Address").SetFont(latoBoldFont).SetFontSize(10)));
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.VendorAddress).SetFont(latoFont).SetFontSize(10)));

							// Add the Billing city
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("City").SetFont(latoBoldFont).SetFontSize(10)));
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.VendorCity).SetFont(latoFont).SetFontSize(10)));

							// Add the Billing contact
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Contact").SetFont(latoBoldFont).SetFontSize(10)));
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							VendorAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.VendorContact).SetFont(latoFont).SetFontSize(10)));

							// Create a table with 3 columns, each taking a specific percentage of the available width
							Table ShippingAddressTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 5, 75 })).UseAllAvailableWidth();

							ShippingAddressTable.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).Add(new Paragraph(data.AltName).SetFont(latoBoldFont).SetFontSize(10)));

							// Add the Billing address
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Address").SetFont(latoBoldFont).SetFontSize(10)));
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.AltAddress).SetFont(latoFont).SetFontSize(10)));

							// Add the Billing city
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("City").SetFont(latoBoldFont).SetFontSize(10)));
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.AltCity).SetFont(latoFont).SetFontSize(10)));

							// Add the Billing contact
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Contact").SetFont(latoBoldFont).SetFontSize(10)));
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(":").SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)));
							ShippingAddressTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(data.AltContactNumber).SetFont(latoFont).SetFontSize(10)));

							// Create a table with 2 columns and set the width to 100%
							Table table = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();

							// Add cells to the first row with centered text both horizontally and vertically
							table.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("Billing Address").SetFont(latoBoldFont).SetFontSize(11).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)); // Vertical alignment
							table.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("PurchaseOrder Details").SetFont(latoBoldFont).SetFontSize(11).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)); // Vertical alignment

							// Add the inner table to the main table as a cell
							table.AddCell(new Cell().Add(BillingAddressTable));

							// Add the inner table to the main table as a cell
							table.AddCell(new Cell().Add(POOrderDetailsTable));

							// Add cells to the first row with centered text both horizontally and vertically
							table.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("Vendor Address").SetFont(latoBoldFont).SetFontSize(11).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)); // Vertical alignment
							table.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("Shipping Address").SetFont(latoBoldFont).SetFontSize(11).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)); // Vertical alignment

							// Add the inner table to the main table as a cell
							table.AddCell(new Cell().Add(VendorAddressTable));

							// Add the inner table to the main table as a cell
							table.AddCell(new Cell().Add(ShippingAddressTable));

							// Add the table to the document
							document.Add(table);

							float[] ProductTableColumnWidth = { 7.5f, 17.5f, 12.5f, 12.5f, 12.5f, 12.5f, 12.5f, 12.5f };

							// Create ProductItemTable with specified column widths
							Table ProductItemTable = new Table(UnitValue.CreatePercentArray(ProductTableColumnWidth)).UseAllAvailableWidth();
							ProductItemTable.SetWidth(UnitValue.CreatePercentValue(100));

							// Add header row
							for (int i = 0; i < data.ProductItemTable.Columns.Count; i++)
							{
								Cell ProductItemTableheaderCell = new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph(data.ProductItemTable.Columns[i].ColumnName).SetPadding(2).SetFont(latoBoldFont).SetFontColor(HeaderFontColor));

								// Remove the top border, and add other borders as needed
								ProductItemTableheaderCell.SetBorderTop(Border.NO_BORDER).SetBorderBottom(new SolidBorder(0.5f)).SetBorderLeft(new SolidBorder(0.5f)).SetBorderRight(new SolidBorder(0.5f));

								if (i == 7 || i == 6 || i == 5 || i == 3)
								{
									ProductItemTableheaderCell.SetTextAlignment(TextAlignment.RIGHT).SetPaddingRight(2);
								}
								else if (i == 1)
								{
									ProductItemTableheaderCell.SetTextAlignment(TextAlignment.LEFT).SetPaddingLeft(2);
								}
								else
								{
									ProductItemTableheaderCell.SetTextAlignment(TextAlignment.CENTER);
								}

								ProductItemTable.AddHeaderCell(ProductItemTableheaderCell);
							}

							// Add data rows
							foreach (DataRow row in data.ProductItemTable.Rows)
							{
								for (int i = 0; i < row.ItemArray.Length; i++)
								{
									var item = row.ItemArray[i];
									Cell cell = new Cell().Add(new Paragraph(item.ToString()));

									if (i == 7 || i == 6 || i == 5 || i == 3)
									{
										cell.SetTextAlignment(TextAlignment.RIGHT).SetPaddingRight(5);
									}
									else if (i == 1)
									{
										cell.SetTextAlignment(TextAlignment.LEFT).SetPaddingLeft(5);
									}
									else
									{
										cell.SetTextAlignment(TextAlignment.CENTER);
									}

									ProductItemTable.AddCell(cell.SetFontSize(10).SetHeight(20).SetVerticalAlignment(VerticalAlignment.MIDDLE));
								}
							}

							// Determine the initial minHeight based on the row count
							int rowCount = data.ProductItemTable.Rows.Count;
							float minHeight = 200 - (rowCount - 1) * 20;

							//  Ensure minHeight is not less than the minimum for the 8th row

							//minHeight = Math.Max(minHeight, 60);

							if (rowCount < 9)
							{
								for (int i = 0; i < data.ProductItemTable.Columns.Count; i++)
								{
									// Add a placeholder cell with a dynamic minHeight
									Cell placeholderCell = new Cell()
										.Add(new Paragraph(" ")) // Using a regular space or "\u00A0" for a non-breaking space
										.SetMinHeight(minHeight)  // Set the dynamic minimum height
										.SetBorderTop(Border.NO_BORDER)
										.SetBorderBottom(new SolidBorder(0.5f))
										.SetBorderLeft(new SolidBorder(0.5f))
										.SetBorderRight(new SolidBorder(0.5f));

									ProductItemTable.AddCell(placeholderCell);
								}
							}

							document.Add(ProductItemTable);

							float[] ProductTableTotalColumnWidth = { 7.5f, 17.5f, 12.5f, 12.5f, 12.5f, 12.5f, 12.5f, 12.5f };
							DeviceRgb ProductTableTotalBackgroundColor = new DeviceRgb(19, 26, 50);

							Table ProductSubTableTotal = new Table(UnitValue.CreatePercentArray(new float[] { 25, 37.5f, 12.5f, 12.5f, 12.5f })).UseAllAvailableWidth();
							ProductSubTableTotal.AddCell(new Cell().Add(new Paragraph("Total Product :" + data.TotalProduct).SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER));
							ProductSubTableTotal.AddCell(new Cell().Add(new Paragraph("").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER));
							ProductSubTableTotal.AddCell(new Cell().Add(new Paragraph(data.TotalDiscount).SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER));
							//ProductSubTableTotal.AddCell(new Cell().Add(new Paragraph(data.TotalTax).SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER));
							ProductSubTableTotal.AddCell(new Cell().Add(new Paragraph(data.SubTotal).SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER));

							document.Add(ProductSubTableTotal);

							float[] ProductTableOtherChargesColumnWidth = { 62.5f, 12.5f, 12.5f, 12.5f };
							DeviceRgb ProductTableOtherChargesBackgroundColor = new DeviceRgb(19, 26, 50);

							// Create ProductItemTable with specified column widths
							Table ProductItemOtherChragesTable = new Table(UnitValue.CreatePercentArray(ProductTableOtherChargesColumnWidth)).UseAllAvailableWidth();
							ProductItemOtherChragesTable.SetWidth(UnitValue.CreatePercentValue(100));

							// Add data rows
							foreach (DataRow row in data.OtherChargesTable.Rows)
							{
								for (int i = 0; i < row.ItemArray.Length; i++)
								{
									var item = row.ItemArray[i];
									Cell cell = new Cell().Add(new Paragraph(item.ToString()));

									if (i == 0)
									{
										cell.SetFont(latoBoldFont).SetFontSize(10).SetPaddingRight(5).SetTextAlignment(TextAlignment.RIGHT).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorderTop(Border.NO_BORDER);
									}

									else if (i == 2)
									{
										cell.SetFont(notoSansFont).SetFontSize(10).SetPaddingRight(5).SetTextAlignment(TextAlignment.RIGHT).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorderTop(Border.NO_BORDER);
									}

									else
									{
										cell.SetFont(latoFont).SetFontSize(10).SetPaddingRight(5).SetTextAlignment(TextAlignment.RIGHT).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorderTop(Border.NO_BORDER);
									}

									ProductItemOtherChragesTable.AddCell(cell);
								}
							}

							document.Add(ProductItemOtherChragesTable);

							// Create a table with 2 columns and set the width to 100%
							Table ProductItemsGrantTotalTable = new Table(UnitValue.CreatePercentArray(new float[] { 62.5f, 37.5f })).UseAllAvailableWidth();

							// Add cells to the first row with centered text both horizontally and vertically
							ProductItemsGrantTotalTable.AddCell(new Cell().Add(new Paragraph("Round Off").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER)); // Vertical alignment
							ProductItemsGrantTotalTable.AddCell(new Cell().Add(new Paragraph(data.RoundOffValue).SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER)); // Vertical alignment
							ProductItemsGrantTotalTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("Grant Total").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER).SetFontColor(HeaderFontColor)); // Vertical alignment
							ProductItemsGrantTotalTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph(data.GrantTotal).SetFont(latoFont).SetFontSize(10).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetPaddingRight(5).SetBorderTop(Border.NO_BORDER).SetFontColor(HeaderFontColor)); // Vertical alignment

							document.Add(ProductItemsGrantTotalTable);

							// CGST Table header
							Table CGSTTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
							CGSTTable.AddCell(new Cell(1, 2).SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).Add(new Paragraph("CGST").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));
							CGSTTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0.5f)).SetBorderRight(new SolidBorder(0.5f)).Add(new Paragraph("Rate").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));
							CGSTTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0.5f)).Add(new Paragraph("Amount").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));

							// SGST Table header
							Table SGSTTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
							SGSTTable.AddCell(new Cell(1, 2).SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).Add(new Paragraph("SGST").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));
							SGSTTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0.5f)).SetBorderRight(new SolidBorder(0.5f)).Add(new Paragraph("Rate").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));
							SGSTTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0.5f)).Add(new Paragraph("Amount").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));

							// SGST Table header
							Table CESSTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
							CESSTable.AddCell(new Cell(1, 2).SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).Add(new Paragraph("CESS").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));
							CESSTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0.5f)).SetBorderRight(new SolidBorder(0.5f)).Add(new Paragraph("Rate").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));
							CESSTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).SetBorder(Border.NO_BORDER).SetBorderTop(new SolidBorder(0.5f)).Add(new Paragraph("Amount").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor)));

							// Define the top margin (e.g., 20 points)
							float topMargin = 5f;
							// Create a top margin paragraph
							Paragraph topMarginParagraph = new Paragraph().SetMarginTop(topMargin);
							document.Add(topMarginParagraph);

							// Create a table with 2 columns and set the width to 100%
							Table ProductItemsTaxTable = new Table(UnitValue.CreatePercentArray(new float[] { 15, 18, 18, 18, 15, 15 })).UseAllAvailableWidth();
							ProductItemsTaxTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("HSN/SAC").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor));
							ProductItemsTaxTable.AddCell(new Cell().Add(CGSTTable).SetPadding(0));
							ProductItemsTaxTable.AddCell(new Cell().Add(SGSTTable).SetPadding(0));
							ProductItemsTaxTable.AddCell(new Cell().Add(CESSTable).SetPadding(0));

							ProductItemsTaxTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("CESS Non Ad (Rs)").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor));
							ProductItemsTaxTable.AddCell(new Cell().SetBackgroundColor(HeaderBackgroundColor).Add(new Paragraph("Tax Amount (Rs)").SetFont(latoBoldFont).SetFontSize(10).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetFontColor(HeaderFontColor));

							document.Add(ProductItemsTaxTable);

							float[] TotalOtherChargesColumnWidth = { 15, 9, 9, 9, 9, 9, 9, 15, 15 };
							DeviceRgb TotalOtherChargesColumnWidthBackgroundColor = new DeviceRgb(19, 26, 50);

							// Create ProductItemTable with specified column widths
							Table TotalOtherChargesTable = new Table(UnitValue.CreatePercentArray(TotalOtherChargesColumnWidth)).UseAllAvailableWidth();
							TotalOtherChargesTable.SetWidth(UnitValue.CreatePercentValue(100));

							// Add data rows
							foreach (DataRow row in data.OtherChargesTaxTable.Rows)
							{
								for (int i = 0; i < row.ItemArray.Length; i++)
								{
									var item = row.ItemArray[i];
									Cell cell = new Cell().Add(new Paragraph(item.ToString()));

									cell.SetFont(latoBoldFont).SetFontSize(10).SetPaddingRight(5).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorderTop(Border.NO_BORDER);

									cell.SetFont(latoFont).SetFontSize(10).SetPaddingRight(5).SetTextAlignment(TextAlignment.CENTER).SetVerticalAlignment(VerticalAlignment.MIDDLE).SetBorderTop(Border.NO_BORDER);

									TotalOtherChargesTable.AddCell(cell);
								}
							}

							document.Add(TotalOtherChargesTable);

							// Create a table for total amount
							Table TotalAmountTable = new Table(UnitValue.CreatePercentArray(1)).UseAllAvailableWidth();
							TotalAmountTable.AddCell(new Cell().Add(new Paragraph("Total Amount (in words)").SetTextAlignment(TextAlignment.LEFT).SetFont(latoBoldFont).SetFontSize(10)).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetPaddingTop(3));
							TotalAmountTable.AddCell(new Cell().Add(new Paragraph(data.Amount_InWords).SetTextAlignment(TextAlignment.LEFT).SetFont(latoFont).SetFontSize(10)).SetBorderTop(Border.NO_BORDER).SetPaddingBottom(3));
							document.Add(TotalAmountTable);

							// Create a table for Terms and condition
							Table TermsandConditionTable = new Table(UnitValue.CreatePercentArray(1)).UseAllAvailableWidth();
							TermsandConditionTable.AddCell(new Cell().Add(new Paragraph("Terms and Conditions").SetTextAlignment(TextAlignment.LEFT).SetFont(latoBoldFont).SetFontSize(10)).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetPaddingTop(3));
							TermsandConditionTable.AddCell(new Cell().Add(new Paragraph(data.TermsandConditions).SetTextAlignment(TextAlignment.LEFT).SetFont(latoFont).SetFontSize(10)).SetBorderTop(Border.NO_BORDER).SetPaddingBottom(3).SetMinHeight(30));
							document.Add(TermsandConditionTable);

							document.Close();
						}
					}

					pdfCopies.Add(stream.ToArray());
				}
			}

			byte[] combinedPdf = CombinePdfCopies(pdfCopies);
			return combinedPdf;
		}

		public byte[] PurchaseBillPrintNew(PurchaseBillPrint data, int numberOfCopies)
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
							ModuleTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPaddingTop(5).Add(new Paragraph("Purchase Bill").SetFont(kabrioBoldFont).SetFontSize(15).SetTextAlignment(TextAlignment.CENTER).SetMarginTop(-5)));
							ModuleTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("MADE FOR THE RECIPIENT").SetFont(kabrioFont).SetPaddingTop(3).SetFontSize(9).SetTextAlignment(TextAlignment.RIGHT).SetMarginTop(1)));

							document.Add(ModuleTable);

							Table CustomerMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 60, 40 })).UseAllAvailableWidth();
							CustomerMainTable.SetBorderBottom(new SolidBorder(1));
							CustomerMainTable.SetBorderLeft(new SolidBorder(1));
							CustomerMainTable.SetBorderRight(new SolidBorder(1));
							CustomerMainTable.SetBorder(Border.NO_BORDER);

							Table CustomerDetaisTable = new Table(UnitValue.CreatePercentArray(new float[] { 25, 75 })).UseAllAvailableWidth();
							CustomerDetaisTable.SetPadding(0);

							CustomerDetaisTable.AddCell(new Cell(1, 2).SetBorderBottom(new SolidBorder(1)).SetBorder(Border.NO_BORDER).SetPadding(0).Add(new Paragraph("Vendor Details").SetFont(kabrioBoldFont).SetFontSize(10).SetPadding(0).SetTextAlignment(TextAlignment.CENTER)));

							if (!string.IsNullOrEmpty(data.VendorName))
							{
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("M/S").SetFont(kabrioBoldFont).SetFontSize(9)));
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.VendorName).SetFont(kabrioFont)).SetFontSize(9)));
							}

							if (!string.IsNullOrEmpty(data.VendorCity) || !string.IsNullOrEmpty(data.VendorAddress) || !string.IsNullOrEmpty(data.VendorZipCode))
							{
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Address").SetFont(kabrioBoldFont).SetFontSize(9)));
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.VendorAddress + ", " + data.VendorCity + " - " + data.VendorZipCode).SetFont(kabrioFont)).SetFontSize(9)));
							}

							if (!string.IsNullOrEmpty(data.VendorContact))
							{
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Phone Number").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.VendorContact).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

							}

							if (!string.IsNullOrEmpty(data.VendorGSTNumber))
							{
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("GSTIN").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.VendorGSTNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							}

							if (!string.IsNullOrEmpty(data.VendorState))
							{
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Place of Supply").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
								CustomerDetaisTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.VendorState).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							}


							Table GstNumberTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
							GstNumberTable.SetBorder(Border.NO_BORDER);

							if (!string.IsNullOrEmpty(data.PurchaseBillNumber))
							{
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PBill No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.PurchaseBillNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							}

							if (!string.IsNullOrEmpty(data.PurchaseBillDate))
							{
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PBill Date").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.PurchaseBillDate).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							}

							if (!string.IsNullOrEmpty(data.PurchaseOrderNumber))
							{
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("PO No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.PurchaseOrderNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							}


							if (!string.IsNullOrEmpty(data.OriginalInvoiceNumber))
							{
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Original Invoice No").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
								GstNumberTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph().Add(new Text(": ").SetFont(kabrioBoldFont)).Add(new Text(data.OriginalInvoiceNumber).SetFont(kabrioFont)).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							}

							CustomerMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetPadding(0).Add(CustomerDetaisTable));
							CustomerMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetPadding(0).Add(GstNumberTable));

							document.Add(CustomerMainTable);

							//Table EmptyTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
							//EmptyTable.SetBorderBottom(new SolidBorder(1));
							//EmptyTable.SetBorderLeft(new SolidBorder(1));
							//EmptyTable.SetBorderRight(new SolidBorder(1));
							//EmptyTable.SetBorderTop(new SolidBorder(0));
							//EmptyTable.SetBorder(Border.NO_BORDER);
							//EmptyTable.SetHeight(15);

							//document.Add(EmptyTable);



							float[] ProductTableColumnWidth = null;
							if (data.ProductItemTable.Columns.Count == 6)
							{
								//for This Width will 7 Column
								ProductTableColumnWidth = new float[] { 10, 30, 15, 15, 10, 20 };
							}
							else if (data.ProductItemTable.Columns.Count == 7)
							{
								//for This Width will 7 Column
								ProductTableColumnWidth = new float[] { 5, 30, 10, 10, 10, 15, 20 };
							}

							else if (data.ProductItemTable.Columns.Count == 8)
							{
								//for This Width will 8 Column
								ProductTableColumnWidth = new float[] { 10, 25, 10, 10, 10, 15, 15, 15 };
							}
							else if (data.ProductItemTable.Columns.Count == 9)
							{
								//for This Width will 9 Column
								ProductTableColumnWidth = new float[] { 5, 20, 15, 10, 10, 10, 10, 10, 10 };
							}
							else if (data.ProductItemTable.Columns.Count == 10)
							{
								//for This Width will 10 Column
								ProductTableColumnWidth = new float[] { 5, 25, 10, 10, 8.3F, 8.3F, 8.3F, 8.3F, 8.3F, 8.3F };
							}
							else if (data.ProductItemTable.Columns.Count == 11)
							{
								//for This Width will 11 Column
								ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 7.5F, 7.5F, 10, 10, 15 };
							}
							else if (data.ProductItemTable.Columns.Count == 12)
							{
								//for This Width will 12 Column
								ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 10, 10, 5, 5, 5, 15 };
							}
							else if (data.ProductItemTable.Columns.Count == 13)
							{
								//for This Width will 13 Column
								ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 5, 5, 10, 5, 5, 5, 15 };
							}
							else if (data.ProductItemTable.Columns.Count == 14)
							{
								//for This Width will 14 Column
								ProductTableColumnWidth = new float[] { 5, 20, 5, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15 };
							}

							Table ProductItemTable = new Table(UnitValue.CreatePercentArray(ProductTableColumnWidth)).UseAllAvailableWidth();
							ProductItemTable.SetBorderBottom(Border.NO_BORDER);

							bool specialCharacterFound = false;
							float headerHeight = 0;

							string[] columnHeaders = new string[data.ProductItemTable.Columns.Count];

							foreach (var column in data.ProductItemTable.Columns)
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


							for (int i = 0; i < data.ProductItemTable.Columns.Count; i++)
							{
								columnHeaders[i] = data.ProductItemTable.Columns[i].ColumnName;

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
							for (int rowIndex = 0; rowIndex < data.ProductItemTable.Rows.Count - 1; rowIndex++)
							{
								DataRow row = data.ProductItemTable.Rows[rowIndex];

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
									else
									{
										paragraph.Add(new Text(displayValue).SetFont(kabrioFont));

										Cell cell = new Cell().Add(paragraph).SetTextAlignment(TextAlignment.CENTER).SetBorder(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1));
										ProductItemTable.AddCell(cell.SetFontSize(10).SetVerticalAlignment(VerticalAlignment.TOP));
									}

								}
							}

							// Calculate the number of rows and minimum height
							int rowCount = data.ProductItemTable.Rows.Count;
							float minHeight = 160 - (rowCount - 1) * 20; // Adjust dynamically

							minHeight = Math.Max(minHeight, 60); // Ensure a minimum height

							// Add padding rows if necessary
							int minRowCount = 9; // Adjust this based on page size
							if (rowCount < minRowCount)
							{
								int missingRows = minRowCount - rowCount;
								for (int j = 0; j < missingRows; j++)
								{
									for (int i = 0; i < data.ProductItemTable.Columns.Count; i++)
									{
										Cell placeholderCell = new Cell().Add(new Paragraph("")).SetMinHeight(20).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1));

										ProductItemTable.AddCell(placeholderCell);
									}
								}
							}

							DataRow lastRow = data.ProductItemTable.Rows[data.ProductItemTable.Rows.Count - 1];

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
							for (int i = 4; i < data.ProductItemTable.Columns.Count; i++)
							{
								string totalValue = lastRow[i]?.ToString() ?? " ";

								Cell totalCell = new Cell()
									.Add(new Paragraph(totalValue).SetFont(kabrioBoldFont).SetFontSize(10)).SetBorderTop(new SolidBorder(1)).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(HeaderBackgroundColor).SetFontColor(HeaderFontColor);

								ProductItemTable.AddCell(totalCell);
							}

							document.Add(ProductItemTable);


							if (data.OtherChargesTable.Rows.Count != 0)
							{
								float[] ForOtherChargersColumnWidth = { 70, 10, 10, 10 };

								Table ForOtherChargersTable = new Table(UnitValue.CreatePercentArray(ForOtherChargersColumnWidth)).UseAllAvailableWidth();
								ForOtherChargersTable.SetBorderLeft(new SolidBorder(1));
								ForOtherChargersTable.SetBorderRight(new SolidBorder(1));
								ForOtherChargersTable.SetBorderTop(new SolidBorder(1));
								ForOtherChargersTable.SetBorder(Border.NO_BORDER);

								// Add data rows
								foreach (DataRow row in data.OtherChargesTable.Rows)
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

							//Table BankTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
							//BankTable.SetBorderBottom(new SolidBorder(1));
							//BankTable.SetBorderLeft(new SolidBorder(1));
							//BankTable.SetBorderRight(new SolidBorder(1));
							//BankTable.SetBorderTop(new SolidBorder(0));
							//BankTable.SetBorder(Border.NO_BORDER);

							//BankTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Details").SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));

							////document.Add(BankTable);

							//Table BankMainTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();
							//BankMainTable.SetBorderBottom(new SolidBorder(1));
							//BankMainTable.SetBorderLeft(new SolidBorder(1));
							//BankMainTable.SetBorderRight(new SolidBorder(1));
							//BankMainTable.SetBorderTop(Border.NO_BORDER);
							//BankMainTable.SetBorder(Border.NO_BORDER);


							//Table BankDetailsTable = new Table(UnitValue.CreatePercentArray(new float[] { 40, 50 })).UseAllAvailableWidth();

							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Name").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.BankName).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Holder Name").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.AccountName).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Branch Name").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.BranchName).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Account No").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.AccountNumber).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph("Bank Branch IFSC").SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));
							//BankDetailsTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(new Paragraph(": " + data.IFSCCode).SetFont(kabrioFont).SetFontSize(9).SetTextAlignment(TextAlignment.LEFT)));

							//// Create a table with 3 columns, each taking a specific percentage of the available width
							//Table QRCodeDetails = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();

							//var upiId = data.UPIId;
							//var payeeName = data.CompanyName;
							//var amount = data.GrantTotal;
							//var currency = "INR";
							//string transactionId = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{new Random().Next(1000, 9999)}";

							//var transactionNote = "Payment For Products";
							//var upiString = $"upi://pay?pa={upiId}&pn={payeeName}&am={amount}&cu={currency}&tn={transactionNote}";


							//BarcodeQRCode qrCode = new BarcodeQRCode(upiString);
							//Image qrCodeImage = new Image(qrCode.CreateFormXObject(pdf));

							//qrCodeImage.SetHeight(70); // Set height to 30px
							//qrCodeImage.SetWidth(70);  // Set width to 30px
							//qrCodeImage.SetHorizontalAlignment(HorizontalAlignment.CENTER);

							//QRCodeDetails.AddCell(new Cell().Add(qrCodeImage).SetBorder(Border.NO_BORDER).SetPaddingTop(5));
							//QRCodeDetails.AddCell(new Cell().Add(new Paragraph("UPI ID : " + data.UPIId).SetTextAlignment(TextAlignment.CENTER).SetFont(kabrioFont).SetFontSize(9)).SetBorder(Border.NO_BORDER).SetPaddingTop(-5));

							//// Add the image to the first row, first column
							//Image pyamentPlaceholderImage = new Image(ImageDataFactory.Create("wwwroot/Common Images/PaymentPlaceHolderImages.png")); // Replace with your image path
							//pyamentPlaceholderImage.SetHeight(5);
							//pyamentPlaceholderImage.SetWidth(80);

							//QRCodeDetails.AddCell(new Cell().SetBorder(Border.NO_BORDER).Add(pyamentPlaceholderImage).SetPaddingLeft(90));

							// BankMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetBorderRight(new SolidBorder(1)).SetPadding(0).SetPaddingTop(3).Add(BankDetailsTable));
							//BankMainTable.AddCell(new Cell().SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1)).SetPadding(0).SetPaddingTop(-5).Add(QRCodeDetails));

							//document.Add(BankMainTable);


							Table TearmSignatureFooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 })).UseAllAvailableWidth();

							Table TearmFooterTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 })).UseAllAvailableWidth();
							TearmFooterTable.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER).SetBorderBottom(new SolidBorder(1))
								.Add(new Paragraph("Terms and Conditions")
									.SetFont(kabrioBoldFont).SetFontSize(9).SetTextAlignment(TextAlignment.CENTER)));
							TearmFooterTable.AddCell(new Cell(1, 3).SetBorder(Border.NO_BORDER)
								.Add(new Paragraph(data.TermsandConditions)
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

		private string CapitalizeWords(string input)
		{
			TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
			return textInfo.ToTitleCase(input);
		}

	}
}
