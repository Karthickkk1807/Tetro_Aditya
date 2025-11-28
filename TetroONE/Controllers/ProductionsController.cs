//using iText.Kernel.Pdf;
//using iText.Layout;
//using iText.Layout.Element;
//using iText.Layout.Properties;
//using iText.Barcodes;
//using iText.Kernel.Colors;
//using iText.Kernel.Geom;
//using iText.IO.Image;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Cmp;
using Org.BouncyCastle.Asn1.Crmf;
using PdfSharp.Snippets;
using Razorpay.Api;
using RestSharp;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;
using TetroONE.Models;
using TetroPos.Models;
using RestClient = RestSharp.RestClient;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Productions")]
    public class ProductionsController : BaseController
    {
        public ProductionsController(IConfiguration configuration) : base(configuration)
        {

        }
        [Route("Production")]
        public IActionResult Production()
        {
            return View();
        }
        [Route("InWard")]
        public IActionResult InWard()
        {
            return View();
        }
        [Route("OutWard")]
        public IActionResult OutWard()
        {
            return View();
        }

        [Route("ProductionPlan")]
        public IActionResult ProductionPlan()
        {
            return View();
        }
        [Route("DeliveryPlan")]
        public IActionResult DeliveryPlan()
        {
            return View();
        }

        [Route("Sample")]
        public IActionResult Sample()
        {
            return View();
        }

        [Route("TargetvsActual")]
        public IActionResult TargetvsActual()
        {
            return View();
        }

        [Route("JobOrder")]
        public IActionResult JobOrder()
        {
            return View();
        }
         
        [HttpGet]
        [Route("GetSample")]
        public IActionResult GetTarget(int? PlantId, int? SampleId, DateTime? FromDate, DateTime? ToDate)
        {
            GetSample request = new GetSample()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                SampleId = SampleId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetSampleDetails]", request);
            return Json(response); 
        }
         
        [HttpGet]
        [Route("GetInward")]
        public IActionResult GetInward(int? PlantId, int? InwardId, DateTime? FromDate, DateTime? ToDate)
        {
            GetInward request = new GetInward()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                InwardId = InwardId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetInwardDetails]", request);
            return Json(response);

        }
         
        [HttpGet]
        [Route("GetTransactionTypeNoDetails")]
        public IActionResult GetTransactionTypeNoDetails(int? PlantId, int Transactiontype)
        {
            GetTransactionTypeNoDetails request = new GetTransactionTypeNoDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                Transactiontype = Transactiontype,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetTransactionTypeNoDetails]", request);
            return Json(response);

        }
         
        [HttpGet]
        [Route("GetOutward")]
        public IActionResult GetOutward(int? PlantId, int? OutWardId, DateTime? FromDate, DateTime? ToDate)
        {
            GetOutward request = new GetOutward()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                OutWardId = OutWardId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };
             
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetOutWardDetails]", request);
            return Json(response); 
        }

        [HttpGet]
        [Route("GetOutWardTypeContactDetails")]
        public IActionResult GetOutWardTypeContactDetails(int OutwardType)
        {
            GetOutWardTypeContactDetails request = new GetOutWardTypeContactDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                OutwardType = OutwardType,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetOutWardType_ContactDetails]", request);
            return Json(response);

        }
         
        [HttpGet]
        [Route("GetProductionPlan")]
        public IActionResult GetProductionPlan(int? TypeId, int? ProductionPlanId, DateTime? FromDate, DateTime? ToDate)
        {
            GetProductionPlan request = new GetProductionPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TypeId = TypeId,
                ProductionPlanId = ProductionPlanId == 0 ? null : ProductionPlanId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionPlanDetails_HotCode]", request);
            return Json(response);
        }
         
        [HttpGet]
        [Route("OutwardPrint")]
        public IActionResult OutwardPrint(int NoOfCopies, string printType)
        {
            PDFTaxInvoice pdfService = new PDFTaxInvoice();
            byte[] pdfContent = pdfService.OutwardAdithiyaPrint(NoOfCopies);

            switch (printType?.ToLower())
            {
                case "mail":
                    var base64PdfContent = Convert.ToBase64String(pdfContent);
                    return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                case "download":
                    return File(pdfContent, "application/pdf", "Outward.pdf");

                case "preview":
                    var customFileName = "Kavinesh Developer Testing";
                    Response.Headers.Add("Content-Disposition", $"inline; filename={customFileName}");
                    return File(pdfContent, "application/pdf");

                case "print":
                    return File(pdfContent, "application/pdf");

                case "whatsapp":
                    string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    string folderPath = Path.Combine(wwwrootPath, "WhatsApp_Sender_PDF");

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string fileName = "PurchaseOrder_" + Guid.NewGuid() + ".pdf";
                    string filePath = Path.Combine(folderPath, fileName);

                    try
                    {
                        System.IO.File.WriteAllBytes(filePath, pdfContent);
                        string fileUrlPath = $"https://www.tetropos.com/WhatsApp_Sender_PDF/{fileName}";
                        return Json(new { status = true, message = $"PDF saved successfully.", data = fileUrlPath });
                    }
                    catch (Exception ex)
                    {
                        return Json(new { status = false, message = "Error saving PDF: " + ex.Message });
                    }

                default:
                    return Json(new { status = false, message = "Invalid print type selected." });
            }

            // ⭐ FINAL REQUIRED RETURN
            return Json(new { status = true, message = "" });
        }

        //[HttpGet]
        //[Route("GenerateQrPdf")]
        //public IActionResult GenerateQrPdf(string URL)
        //{
        //    using (var stream = new MemoryStream())
        //    {
        //        PdfWriter writer = new PdfWriter(stream);
        //        PdfDocument pdf = new PdfDocument(writer);
        //        Document document = new Document(pdf, PageSize.A4);

        //        Paragraph heading = new Paragraph("Scan and apply")
        //            .SetFontSize(20).SetBold()
        //            .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
        //            .SetMarginBottom(30);

        //        document.Add(heading);

        //        var qrCode = new BarcodeQRCode(URL);
        //        var qrObject = qrCode.CreateFormXObject(iText.Kernel.Colors.ColorConstants.BLACK, pdf);
        //        var qrImage = new Image(qrObject);

        //        float size = PageSize.A4.GetWidth() - 100;
        //        qrImage.SetWidth(size);
        //        qrImage.SetHeight(size);
        //        qrImage.SetHorizontalAlignment(iText.Layout.Properties.HorizontalAlignment.CENTER);

        //        document.Add(qrImage);

        //        document.Close();

        //        var fileBytes = stream.ToArray();
        //        return File(fileBytes, "application/pdf", "QRCode.pdf");
        //    }
        //}

    }
}
