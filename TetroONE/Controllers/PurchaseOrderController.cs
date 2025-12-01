using DocumentFormat.OpenXml.VariantTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("PurchaseOrder")]
    public class PurchaseOrderController : BaseController
    {
        public PurchaseOrderController(IConfiguration configuration) : base(configuration)
        {

        }
        public IActionResult PurchaseOrder(int purchaseOrderId = 0)
        {
            return View(purchaseOrderId);
        }

        [HttpGet]
        [Route("GetPurchaseOrder")]
        public IActionResult GetPurchaseOrder(int? PlantId, int? PurchaseOrderId, DateTime FromDate, DateTime ToDate)
        {
            GetPurchaseOrder request = new GetPurchaseOrder()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                PurchaseOrderId = PurchaseOrderId,
                FromDate = FromDate,
                ToDate = ToDate,
            };
            response = GenericTetroONE.GetData(_connectionString, "[USP_GetPurchaseOrderDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetOtherChargesType")]
        public IActionResult GetOtherChargesType(string OtherChargesTypeName)
        {

            PurchaseOrderOtherchargesType getInfo = new PurchaseOrderOtherchargesType()
            {
                LoginuserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                OtherChargesType = OtherChargesTypeName,

            };

            response = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_GetOtherChargesDetailsByType]", getInfo);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdatePurchaseOrder")]
        public async Task<IActionResult> InsertUpdatePurchaseOrder()
        {
            IFormFileCollection file = Request.Form.Files;
            List<AttachmentTable> lstattachment = new List<AttachmentTable>();
            DataTable dtattachment = new DataTable();

            foreach (var item in file)
            {
                var attachment = GenericTetroONE.GetFilePath(item.FileName);
                lstattachment.Add(new AttachmentTable()
                {
                    AttachmentExactFileName = item.FileName,
                    AttachmentFileName = attachment.Item1,
                    AttachmentFilePath = attachment.Item2,
                    ModuleRefId = null,
                    ModuleName = "PurchaseOrder"
                });
            }

            bool isuploaded = await GenericTetroONE.IsAttachmentUploaded(file, lstattachment);

            foreach (var item in lstattachment)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }

            List<AttachmentTable> existFiles = JsonConvert.DeserializeObject<List<AttachmentTable>?>(Request.Form["ExistFiles"]);
            if (existFiles != null && existFiles.Count > 0)
            {
                lstattachment.AddRange(existFiles);
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");

            try
            {
                PurchaseDetailsStatic PurchaseDetailsStatic = JsonConvert.DeserializeObject<PurchaseDetailsStatic>(Request.Form["PurchaseOrderDetailsStatic"]);
                List<PurchaseOrderProductMappingDetails>? PurchaseOrderProductMappingDetails = JsonConvert.DeserializeObject<List<PurchaseOrderProductMappingDetails>?>(Request.Form["PurchaseOrderProductMappingDetails"]);

                DataTable dtproductData = new DataTable();
                dtproductData = GenericTetroONE.ToDataTable(PurchaseOrderProductMappingDetails);

                InsertPurchaseOrderDetails request = new InsertPurchaseOrderDetails()
                {
                    LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                    PurchaseOrderId = PurchaseDetailsStatic.PurchaseOrderId,
                    PurchaseOrderNo = PurchaseDetailsStatic.PurchaseOrderNo,
                    VendorId = PurchaseDetailsStatic.VendorId,
                    ShipToPlantId = PurchaseDetailsStatic.ShipToPlantId,
                    BillFromPlantId = PurchaseDetailsStatic.BillFromPlantId,
                    PlantId = PurchaseDetailsStatic.PlantId,
                    PurchaseOrderDate = PurchaseDetailsStatic.PurchaseOrderDate,
                    ExpectedDeliveryDate = PurchaseDetailsStatic.ExpectedDeliveryDate,
                    SubTotal = PurchaseDetailsStatic.SubTotal,
                    RoundOffValue = PurchaseDetailsStatic.RoundOffValue,
                    GrantTotal = PurchaseDetailsStatic.GrantTotal,
                    Notes = PurchaseDetailsStatic.Notes,
                    TermsAndCondition = PurchaseDetailsStatic.TermsAndCondition,
                    PurchaseOrderStatusId = PurchaseDetailsStatic.PurchaseOrderStatusId,
                    TVP_Purchase_ProductMappingDetails = dtproductData,
                    TVP_AttachmentDetails = dtattachment
                };

                if (PurchaseDetailsStatic.PurchaseOrderId > 0)
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdatePurchaseOrderDetails]", request);
                else
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertPurchaseOrderDetails]", request, "PurchaseOrderId");

                if (response.Status)
                {
                    List<AttachmentTable> deletedFiles = JsonConvert.DeserializeObject<List<AttachmentTable>?>(Request.Form["DeletedFiles"]);
                    if (deletedFiles != null && deletedFiles?.Count > 0)
                    {
                        await GenericTetroONE.IsAttachmentDeleted(deletedFiles);
                    }
                }

                return Json(response);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("GetProduct")]
        public IActionResult GetProduct(string ModuleName, int VendorId, int PlantId)
        {
            GetProduct_PurchaseSale request = new GetProduct_PurchaseSale()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProductId = null,
                ModuleName = ModuleName,
                VendorId = VendorId,
                PlantId = PlantId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductDetails_PurchaseSale]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetProductsPopupDetails")]
        public IActionResult GetProductsPopupDetails(int productId, int FranchiseId, string ModuleName)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetProductDetails_PurchaseSale]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameters if your stored procedure expects them
                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@ProductId", productId);
                    command.Parameters.AddWithValue("@ModuleName", ModuleName);
                    command.Parameters.AddWithValue("@VendorId", DBNull.Value);
                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);


                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
            }
            return Json(response);
        }

        [HttpGet]
        [Route("DeletePurchaseOrderDetails")]
        public IActionResult DeletePurchaseOrderDetails(int PurchaseOrderId)
        {
            DeletePurchaseOrder getInfo = new DeletePurchaseOrder()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseOrderId = PurchaseOrderId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePurchaseOrderDetails]", getInfo);

            DataSet ds = new DataSet();
            if (response.Status)
            {
                string lst = response.Data.ToString().Substring(1, response.Data.ToString().Length - 2);
                List<AttachmentDetails> att = new List<AttachmentDetails>();
                att = JsonConvert.DeserializeObject<List<AttachmentDetails>>(lst);

                if (att != null && att.Count > 0)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
                    foreach (var item in att)
                    {
                        if (!string.IsNullOrEmpty(item.AttachmentFilePath))
                        {
                            string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                            .Replace("..", "").Replace("/", "\\");
                            if (System.IO.File.Exists(filePath))
                            {
                                System.IO.File.Delete(filePath);
                            }
                        }
                    }
                }
            }
            return Json(response);
        }
        
        [HttpGet]
        [Route("PurchaseOrderPrint")]
        public IActionResult PurchaseOrderPrint(int NoOfCopies, string printType)
        {
            PDFPurchaseOrder pdfService = new PDFPurchaseOrder();
            byte[] pdfContent = pdfService.PurchaseOrderPrintNew(NoOfCopies);

            switch (printType?.ToLower())
            {
                case "mail":
                    var base64PdfContent = Convert.ToBase64String(pdfContent);
                    return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                case "download":
                    return File(pdfContent, "application/pdf", "PurchaseOrder.pdf");

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
         

        [HttpPost]
        [Route("UpdateBankInfo")]
        public IActionResult UpdateBankInfo([FromBody] UpdateBankInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateCompanyBankDetails]", request);
            return Json(response);
        }


        [HttpPost]
        [Route("UpdateVendorDetail")]
        public IActionResult UpdateVendorDetail([FromBody] UpdateVendorDetail request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateVendorDetailsByBillingScreen]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetPurchaseReturn_ProposalReturn_ReturnNo")]
        public IActionResult GetPurchaseReturn_ProposalReturn_ReturnNo(int FranchiseId, int ModuleId, int BillTo, int? PurchaseRequestNo, int? ProposalRequestNo)
        {
            GetPurchaseReturn_ProposalReturn_ReturnNo request = new GetPurchaseReturn_ProposalReturn_ReturnNo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                ModuleId = ModuleId,
                BillTo = BillTo,
                PurchaseRequestNo = PurchaseRequestNo,
                ProposalRequestNo = ProposalRequestNo
            };

            response = GenericTetroONE.GetData(_connectionString, "[USP_DD_GetPurchaseReturn_ProposalReturn_ReturnNo]", request);
            return Json(response);
        }

    }
}
