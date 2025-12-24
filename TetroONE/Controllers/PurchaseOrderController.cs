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
        public IActionResult PurchaseOrderPrint(int ModuleId, int NoOfCopies, string printType)
        {
            try
            {
                _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintPDFDetails]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                        command.Parameters.AddWithValue("@ModuleName", "PurchaseOrder");
                        command.Parameters.AddWithValue("@ModuleId", ModuleId);

                        command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
                        DataSet ds = new DataSet();

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(ds);
                        }

                        if (ds.Tables.Count >= 7)
                        {
                            DataTable dt1 = ds.Tables[0];
                            DataTable dt2 = ds.Tables[1];
                            DataTable dt3 = ds.Tables[2];
                            DataTable dt4 = ds.Tables[3];
                            DataTable dt5 = ds.Tables[4];
                            DataTable dt6 = ds.Tables[5];
                            DataTable dt7 = ds.Tables[6];

                            // Check if dt1 has rows
                            if (dt1.Rows.Count > 0)
                            {
                                var data = new PurchaseOrderPrint
                                {
                                    CompanyName = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null,
                                    Address1 = dt1.Rows[0]["Address1"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Address1"]) : null,
                                    Address2 = dt1.Rows[0]["Address2"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Address2"]) : null,
                                    Phone = dt1.Rows[0]["Phone"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Phone"]) : null,
                                    PFCodeNo = dt1.Rows[0]["PFCodeNo"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["PFCodeNo"]) : null,
                                    ESICodeNo = dt1.Rows[0]["ESICodeNo"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ESICodeNo"]) : null,
                                    Email = dt1.Rows[0]["Email"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Email"]) : null,
                                    GSTin = dt1.Rows[0]["GSTin"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["GSTin"]) : null,
                                    MSMERegistrationNo = dt1.Rows[0]["MSMERegistrationNo"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["MSMERegistrationNo"]) : null,

                                    ToName = dt2.Rows[0]["ToName"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["ToName"]) : null,
                                    ToAddress1 = dt2.Rows[0]["ToAddress1"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["ToAddress1"]) : null,
                                    ToAddress2 = dt2.Rows[0]["ToAddress2"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["ToAddress2"]) : null,
                                    GST = dt2.Rows[0]["GST"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["GST"]) : null,

                                    PONo = dt3.Rows[0]["PONo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["PONo"]) : null,
                                    PODate = dt3.Rows[0]["PODate"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["PODate"]) : null,
                                    ExpDeliveryDate = dt3.Rows[0]["ExpDeliveryDate"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["ExpDeliveryDate"]) : null,

                                    IGSTPer = dt5.Rows[0]["IGSTPer"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["IGSTPer"]) : null,
                                    CGSTPer = dt5.Rows[0]["CGSTPer"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["CGSTPer"]) : null,
                                    SGSTPer = dt5.Rows[0]["SGSTPer"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["SGSTPer"]) : null,
                                    IGSTValue = dt5.Rows[0]["IGSTValue"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["IGSTValue"]) : null,
                                    CGSTValue = dt5.Rows[0]["CGSTValue"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["CGSTValue"]) : null,
                                    SGSTValue = dt5.Rows[0]["SGSTValue"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["SGSTValue"]) : null,

                                    //IGSTPer = dt5.Rows.Count > 0 && dt5.Rows[0]["IGSTPer"] != DBNull.Value && !string.IsNullOrWhiteSpace(dt5.Rows[0]["IGSTPer"].ToString()) && dt5.Rows[0]["IGSTPer"].ToString().ToLower() != "undefined" ? dt5.Rows[0]["IGSTPer"].ToString() : null, 
                                    //CGSTPer = dt5.Rows.Count > 0 && dt5.Rows[0]["CGSTPer"] != DBNull.Value && !string.IsNullOrWhiteSpace(dt5.Rows[0]["CGSTPer"].ToString()) && dt5.Rows[0]["CGSTPer"].ToString().ToLower() != "undefined" ? dt5.Rows[0]["CGSTPer"].ToString() : null, 
                                    //SGSTPer = dt5.Rows.Count > 0 && dt5.Rows[0]["SGSTPer"] != DBNull.Value && !string.IsNullOrWhiteSpace(dt5.Rows[0]["SGSTPer"].ToString()) && dt5.Rows[0]["SGSTPer"].ToString().ToLower() != "undefined" ? dt5.Rows[0]["SGSTPer"].ToString() : null, 
                                    //IGSTValue = dt5.Rows.Count > 0 && dt5.Rows[0]["IGSTValue"] != DBNull.Value && !string.IsNullOrWhiteSpace(dt5.Rows[0]["IGSTValue"].ToString()) && dt5.Rows[0]["IGSTValue"].ToString().ToLower() != "undefined" ? dt5.Rows[0]["IGSTValue"].ToString() : null, 
                                    //CGSTValue = dt5.Rows.Count > 0 && dt5.Rows[0]["CGSTValue"] != DBNull.Value && !string.IsNullOrWhiteSpace(dt5.Rows[0]["CGSTValue"].ToString()) && dt5.Rows[0]["CGSTValue"].ToString().ToLower() != "undefined" ? dt5.Rows[0]["CGSTValue"].ToString() : null, 
                                    //SGSTValue = dt5.Rows.Count > 0 && dt5.Rows[0]["SGSTValue"] != DBNull.Value && !string.IsNullOrWhiteSpace(dt5.Rows[0]["SGSTValue"].ToString()) && dt5.Rows[0]["SGSTValue"].ToString().ToLower() != "undefined" ? dt5.Rows[0]["SGSTValue"].ToString() : null,

                                    TermsConditions = dt6.Rows[0]["TermsConditions"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["TermsConditions"]) : null,
                                    RoundOff = dt6.Rows[0]["RoundOff"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["RoundOff"]) : null,
                                    NetAmount = dt6.Rows[0]["NetAmount"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["NetAmount"]) : null,

                                    RupeesInWords = dt7.Rows[0]["RupeesInWords"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["RupeesInWords"]) : null,

                                    ProductItemData = dt4,
                                };

                                string PurchaseOrderNumber = dt3.Rows[0]["PONo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["PONo"]) : null;
                                string customFileName = $"PurchaseOrder_{PurchaseOrderNumber}.pdf";
                                PDFPurchaseOrder pdfService = new PDFPurchaseOrder();
                                byte[] pdfContent = null;

                                pdfContent = pdfService.PurchaseOrderPrint(NoOfCopies, data);

                                switch (printType.ToLower())
                                {
                                    case "mail":
                                        var base64PdfContent = Convert.ToBase64String(pdfContent);
                                        return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                                    case "download":
                                        return File(pdfContent, "application/pdf", "PurchaseOrder.pdf");

                                    case "preview":
                                        Response.Headers.Add("Content-Disposition", $"inline; filename={customFileName}");
                                        return File(pdfContent, "application/pdf");

                                    case "print":
                                        return File(pdfContent, "application/pdf");

                                    case "whatsapp":
                                        string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                                        string folderPath = Path.Combine(wwwrootPath, "WhatsApp_Sender_PDF");

                                        if (!Directory.Exists(folderPath))
                                        {
                                            Directory.CreateDirectory(folderPath);
                                        }

                                        string fileName = "PurchaseOrder_" + Guid.NewGuid().ToString() + ".pdf";
                                        string filePath = Path.Combine(folderPath, fileName);

                                        //string fileName = "PurchaseOrder_" + PurchaseOrderNumber + ".pdf";
                                        //string filePath = Path.Combine(folderPath, fileName);

                                        //if (System.IO.File.Exists(filePath))
                                        //{
                                        //    System.IO.File.Delete(filePath);
                                        //}
                                        try
                                        {
                                            // Write the PDF file to the specified path
                                            System.IO.File.WriteAllBytes(filePath, pdfContent);

                                            // Return the response with status, message, and the file URL
                                            string fileurlpath = $"https://www.tetropos.com/WhatsApp_Sender_PDF/{fileName}";
                                            return Json(new { status = true, message = $"PDF saved successfully at {filePath}", data = fileurlpath });
                                        }
                                        catch (Exception ex)
                                        {
                                            return Json(new { success = false, message = "Error saving PDF: " + ex.Message });
                                        }

                                    default:
                                        return Json(new { success = false, message = "Invalid print type selected." });
                                }
                            }
                            else
                            {

                                return Json(new { success = false, message = "No data found for the given ModuleId." });
                            }
                        }
                        else
                        {
                            // Handle case where expected number of tables is not returned
                            return Json(new { success = false, message = "Expected number of tables not returned from stored procedure." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return Json(new { success = false, message = "An error occurred while generating purchase order print.", error = ex.Message });
            }
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
