using Microsoft.AspNetCore.Hosting;
using System;
using System.Data;
using System.Drawing;
using System.Drawing.Printing;
using System.Linq;
using System.Text;
using TetroONE.Models;

public class DotMatrixPrinter
{
    private readonly IWebHostEnvironment _env;
    private OutWardEPSONPrint _data;

    public DotMatrixPrinter(IWebHostEnvironment env)
    {
        _env = env;
    }

    // ✅ MAIN METHOD
    public void PrintSlip(string printerName, OutWardEPSONPrint data)
    {
        _data = data;

        // 🔍 Step 1: Auto detect if empty
        if (string.IsNullOrWhiteSpace(printerName))
        {
            printerName = DetectEpsonPrinter();
        }

        // ❌ Step 2: If still empty → error
        if (string.IsNullOrWhiteSpace(printerName))
        {
            throw new Exception("EPSON Printer not found!");
        }

        // 🔍 Step 3: Validate printer exists
        bool printerExists = PrinterSettings.InstalledPrinters
            .Cast<string>()
            .Any(p => p.Equals(printerName, StringComparison.OrdinalIgnoreCase));

        if (!printerExists)
        {
            throw new Exception(
                "Printer not found: " + printerName +
                "\n\nAvailable Printers:\n" + GetAllPrinters());
        }

        // 🖨 Step 4: Print
        PrintDocument pd = new PrintDocument();
        pd.PrinterSettings.PrinterName = printerName;

        // Silent print (no popup)
        pd.PrintController = new StandardPrintController();

        // Dot matrix paper size
        PaperSize paper = new PaperSize("DotMatrix", 984, 591);
        pd.DefaultPageSettings.PaperSize = paper;
        pd.DefaultPageSettings.Margins = new Margins(0, 0, 0, 0);

        pd.PrintPage += PrintPage;

        pd.Print();
    }

    // ✅ AUTO DETECT EPSON
    private string DetectEpsonPrinter()
    {
        return PrinterSettings.InstalledPrinters
            .Cast<string>()
            .FirstOrDefault(p => p.ToUpper().Contains("EPSON"));
    }

    // ✅ DEBUG LIST
    private string GetAllPrinters()
    {
        StringBuilder sb = new StringBuilder();

        foreach (string p in PrinterSettings.InstalledPrinters)
        {
            sb.AppendLine(p);
        }

        return sb.ToString();
    }

    private void PrintPage(object sender, PrintPageEventArgs e)
    {
        Graphics g = e.Graphics;

        Pen pen = new Pen(Color.Black, 1);

        int left = 40;
        int right = e.PageBounds.Width - 40;
        int top = 20;

        int addressLeft = left + 20;
        int y = top;

        Font titleFont = new Font("Courier New", 20, FontStyle.Bold);
        Font bold = new Font("Courier New", 10, FontStyle.Bold);
        Font text = new Font("Courier New", 10);

        g.DrawLine(pen, left, y, right, y);
        y += 10;

        g.DrawString(_data.CompanyName, titleFont, Brushes.Black, left + 170, y);
        y += 30;

        int rightHeader = right - 220;

        g.DrawString(_data.CompanyAddress1, bold, Brushes.Black, addressLeft, y);
        g.DrawString("GST : " + _data.CompanyGST, bold, Brushes.Black, rightHeader, y);
        y += 18;

        g.DrawString(_data.CompanyAddress2, bold, Brushes.Black, addressLeft, y);
        g.DrawString("PAN : " + _data.CompanyPAN, bold, Brushes.Black, rightHeader, y);
        y += 18;

        g.DrawString("PHONE : " + _data.CompanyPhone, bold, Brushes.Black, addressLeft, y);

        y += 25;
        g.DrawLine(pen, left, y, right, y);

        y += 8;
        g.DrawString("DELIVERY NOTE - DYEING SAC/HSN : 998821", bold, Brushes.Black, left + 250, y);

        y += 18;
        g.DrawLine(pen, left, y, right, y);

        int mid = left + 470;
        int sectionTop = y;

        y += 10;

        int rightText = mid + 15;

        g.DrawString("To. " + _data.ClientName, text, Brushes.Black, addressLeft, y);
        g.DrawString("DC No : " + _data.DCNo, text, Brushes.Black, rightText, y);

        y += 18;
        g.DrawString(_data.ClientAddress1 + " ,", text, Brushes.Black, addressLeft, y);
        g.DrawString("DC Date : " + _data.DCDate, text, Brushes.Black, rightText, y);

        y += 18;
        g.DrawString(_data.ClientAddress2 + " ,", text, Brushes.Black, addressLeft, y);
        g.DrawString("Time : " + _data.Time, text, Brushes.Black, rightText, y);

        y += 18;
        g.DrawString(_data.ClientAddress3 + " .", text, Brushes.Black, addressLeft, y);
        g.DrawString("Delivery to : " + _data.ClientType, text, Brushes.Black, rightText, y);

        y += 18;
        g.DrawString("GST : " + _data.ClientGST + "  PAN : " + _data.ClientPAN, text, Brushes.Black, addressLeft, y);

        y += 30;

        int sectionBottom = y;

        g.DrawLine(pen, left, sectionBottom, right, sectionBottom);
        g.DrawLine(pen, mid, sectionTop, mid, sectionBottom);

        //--------------------------------
        // TABLE HEADER
        //--------------------------------

        y = sectionBottom + 10;

        int fabricWidth = 220;
        int diaWidth = 70;
        int rollWidth = 70;
        int inwardWidth = 120;
        int deliveryWidth = 120;

        int c1 = left;
        int c2 = c1 + fabricWidth;
        int c3 = c2 + diaWidth;
        int c4 = c3 + rollWidth;
        int c5 = c4 + inwardWidth;
        int c6 = c5 + deliveryWidth;

        g.DrawString("Fabric Quality", bold, Brushes.Black, c1 + 5, y);
        g.DrawString("Dia", bold, Brushes.Black, c2 + 5, y);
        g.DrawString("Roll", bold, Brushes.Black, c3 + 5, y);
        g.DrawString("Inward Wt", bold, Brushes.Black, c4 + 5, y);
        g.DrawString("Delivery Wt", bold, Brushes.Black, c5 + 5, y);
        g.DrawString("Details", bold, Brushes.Black, c6 + 5, y);

        y += 18;
        g.DrawLine(pen, left, y, right, y);

        //--------------------------------
        // TABLE DATA
        //--------------------------------

        ////DataTable dt = _data.ProductItemData;
        int rowHeight = 18;

        ////y += 10;

        ////foreach (DataRow row in dt.Rows)
        ////{
        ////    g.DrawString(row["FabricQuality"]?.ToString(), text, Brushes.Black, c1 + 5, y);
        ////    g.DrawString(row["Dia"]?.ToString(), text, Brushes.Black, c2 + 5, y);
        ////    g.DrawString(row["Roll"]?.ToString(), text, Brushes.Black, c3 + 5, y);
        ////    g.DrawString(row["InwardWt"]?.ToString(), text, Brushes.Black, c4 + 5, y);
        ////    g.DrawString(row["DeliveryWt"]?.ToString(), text, Brushes.Black, c5 + 5, y);

        ////    y += rowHeight;
        ////}

        //--------------------------------
        // DETAILS
        //--------------------------------

        int dy = sectionBottom + 28;

        g.DrawString("Your DC No : " + _data.YourDCNo, text, Brushes.Black, c6 + 5, dy);
        dy += rowHeight;

        g.DrawString("Date : " + _data.DCDate, text, Brushes.Black, c6 + 5, dy);
        dy += rowHeight;

        g.DrawString("Colour : " + _data.Colour, text, Brushes.Black, c6 + 5, dy);
        dy += rowHeight;

        g.DrawString("Order No : " + _data.OrderNO, text, Brushes.Black, c6 + 5, dy);
        dy += rowHeight;

        //--------------------------------
        // PROCESS (AUTO WRAP)
        //--------------------------------

        string processText = "Process : " + _data.Process;
        int processWidth = right - c6 - 20;

        RectangleF rect = new RectangleF(c6 + 5, dy, processWidth, 100);

        StringFormat format = new StringFormat();
        format.Alignment = StringAlignment.Near;
        format.LineAlignment = StringAlignment.Near;

        g.DrawString(processText, text, Brushes.Black, rect, format);

        SizeF size = g.MeasureString(processText, text, processWidth);
        dy += (int)size.Height + 5;

        //--------------------------------

        g.DrawString("Inward No : " + _data.InwardNo, text, Brushes.Black, c6 + 5, dy);
        dy += rowHeight;

        g.DrawString("Vehicle No : " + _data.VehicleNo, text, Brushes.Black, c6 + 5, dy);

        y = Math.Max(y, dy);

        //--------------------------------
        // TOTAL
        //--------------------------------

        y += 15;
        g.DrawLine(pen, left, y, right, y);

        y += 10;

        g.DrawString("TOTAL =>", bold, Brushes.Black, c2 - 30, y);
        g.DrawString(_data.TotalRoll, bold, Brushes.Black, c3, y);
        g.DrawString(_data.TotalInwardWt, bold, Brushes.Black, c4, y);
        g.DrawString(_data.TotalDeliveryWt, bold, Brushes.Black, c5, y);

        g.DrawString("Actual Wt : " + _data.ActualNo, text, Brushes.Black, c6, y);

        y += 16;
        g.DrawString("Apprx Goods Value : " + _data.ApprxGoodsValue, text, Brushes.Black, c6, y);

        //--------------------------------
        // SIGNATURE
        //--------------------------------

        y += 24;
        g.DrawLine(pen, left, y, right, y);

        y += 10;

        g.DrawString("Received", bold, Brushes.Black, left + 40, y);
        g.DrawString("Driver", bold, Brushes.Black, left + 220, y);
        g.DrawString("Delivered By", bold, Brushes.Black, left + 380, y);
        g.DrawString("For ADHITHIYA TEXTILES PROCESS", bold, Brushes.Black, right - 320, y);

        y += 18;
        g.DrawString(_data.Driver, text, Brushes.Black, left + 210, y);

        y += 40;

        //--------------------------------
        // BORDER
        //--------------------------------

        int bottomBorder = Math.Min(y, e.PageBounds.Height - 10);

        g.DrawLine(pen, left, bottomBorder, right, bottomBorder);
        g.DrawLine(pen, left, top, left, bottomBorder);
        g.DrawLine(pen, right, top, right, bottomBorder);

        e.HasMorePages = false;
    }
}