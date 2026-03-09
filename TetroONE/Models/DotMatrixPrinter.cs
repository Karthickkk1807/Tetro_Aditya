using Microsoft.AspNetCore.Hosting;
using System;
using System.Drawing;
using System.Drawing.Printing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;

public class DotMatrixPrinter
{
    private readonly IWebHostEnvironment _env;

    public DotMatrixPrinter(IWebHostEnvironment env)
    {
        _env = env;
    }

    public void PrintSlip(string PrinterName)
    {
        //string printerName = "EPSON FX-2175"; // EXACT NAME FROM WINDOWS
        //string printerName = "EPSON FX-2175 (Copy 1)"; // EXACT NAME FROM WINDOWS
        string printerName = PrinterName;

        // Check printer exists
        if (!PrinterSettings.InstalledPrinters.Cast<string>()
            .Any(p => p.Equals(printerName, StringComparison.OrdinalIgnoreCase)))
        {
            throw new Exception("Printer not found: " + printerName);
        }

        PrintDocument pd = new PrintDocument();
        pd.PrinterSettings.PrinterName = printerName;

        // Continuous Paper Size (Adjust if needed)
        PaperSize customSize = new PaperSize("DotMatrix", 850, 1400);
        pd.DefaultPageSettings.PaperSize = customSize;

        pd.DefaultPageSettings.Margins = new Margins(0, 0, 0, 0);

        pd.PrintPage += PrintPage;

        pd.PrintController = new StandardPrintController(); // Silent Print

        pd.Print();
    }

    private void PrintPage(object sender, PrintPageEventArgs e)
    {
        Graphics g = e.Graphics;

        Font headerFont = new Font("Courier New", 14, FontStyle.Bold);
        Font boldFont = new Font("Courier New", 11, FontStyle.Bold);
        Font normalFont = new Font("Courier New", 10);

        Pen dashPen = new Pen(Color.Black, 1);
        dashPen.DashStyle = DashStyle.Dash;

        int paperWidth = e.PageBounds.Width;
        int paperHeight = e.PageBounds.Height;

        int sideMargin = 70;

        int slipWidth = paperWidth - (sideMargin * 2);
        int slipHeight = paperHeight - 40;

        int startX = sideMargin;
        int y = 20;

        // OUTER BORDER
        g.DrawRectangle(dashPen, startX, y, slipWidth, slipHeight);

        y += 20;

        StringFormat center = new StringFormat();
        center.Alignment = StringAlignment.Center;

        g.DrawString("ADHITHIYA TEXTILES PROCESS",
            headerFont,
            Brushes.Black,
            new RectangleF(startX, y, slipWidth, 30),
            center);

        y += 30;

        string address =
    @"SF 418-A, Palavanjipalayam Road, Veerapandi
Palladam(TK) Tirupur - 641605
Phone : 9489880088
GSTIN : 33AAAFF3819N1ZE";

        g.DrawString(address,
            normalFont,
            Brushes.Black,
            new RectangleF(startX, y, slipWidth, 60),
            center);

        y += 80;

        g.DrawString("DELIVERY NOTE - DYEING",
            boldFont,
            Brushes.Black,
            new RectangleF(startX, y, slipWidth, 30),
            center);

        y += 40;

        int tableX = startX + 20;
        int tableY = y;

        int col1 = 260;
        int col2 = 80;
        int col3 = 80;
        int col4 = 130;
        int col5 = 130;

        int rowHeight = 30;

        // HEADER ROW
        g.DrawRectangle(dashPen, tableX, tableY, col1, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1, tableY, col2, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1 + col2, tableY, col3, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1 + col2 + col3, tableY, col4, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1 + col2 + col3 + col4, tableY, col5, rowHeight);

        g.DrawString("Fabric Quality", boldFont, Brushes.Black, tableX + 10, tableY + 8);
        g.DrawString("Dia", boldFont, Brushes.Black, tableX + col1 + 20, tableY + 8);
        g.DrawString("Roll", boldFont, Brushes.Black, tableX + col1 + col2 + 20, tableY + 8);
        g.DrawString("Inward Wt", boldFont, Brushes.Black, tableX + col1 + col2 + col3 + 10, tableY + 8);
        g.DrawString("Delivery Wt", boldFont, Brushes.Black, tableX + col1 + col2 + col3 + col4 + 10, tableY + 8);

        tableY += rowHeight;

        // DATA ROW
        g.DrawRectangle(dashPen, tableX, tableY, col1, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1, tableY, col2, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1 + col2, tableY, col3, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1 + col2 + col3, tableY, col4, rowHeight);
        g.DrawRectangle(dashPen, tableX + col1 + col2 + col3 + col4, tableY, col5, rowHeight);

        g.DrawString("LYCRA DURBY SINGLE JERSY", normalFont, Brushes.Black, tableX + 10, tableY + 8);
        g.DrawString("38", normalFont, Brushes.Black, tableX + col1 + 25, tableY + 8);
        g.DrawString("1", normalFont, Brushes.Black, tableX + col1 + col2 + 25, tableY + 8);
        g.DrawString("5.000", normalFont, Brushes.Black, tableX + col1 + col2 + col3 + 20, tableY + 8);
        g.DrawString("4.900", normalFont, Brushes.Black, tableX + col1 + col2 + col3 + col4 + 20, tableY + 8);

        tableY += rowHeight + 40;

        g.DrawString("TOTAL :", boldFont, Brushes.Black, startX + slipWidth - 220, tableY);
        g.DrawString("7.500", boldFont, Brushes.Black, startX + slipWidth - 140, tableY);

        tableY += 80;

        g.DrawString("Received By", normalFont, Brushes.Black, startX + 40, tableY);
        g.DrawString("Driver", normalFont, Brushes.Black, startX + (slipWidth / 2) - 40, tableY);
        g.DrawString("For Adhithiya Textiles Process", normalFont, Brushes.Black, startX + slipWidth - 260, tableY);

        e.HasMorePages = false;
    }
}