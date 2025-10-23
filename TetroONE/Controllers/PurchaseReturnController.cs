using DocumentFormat.OpenXml.VariantTypes;
using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using TetroPos.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("PurchaseReturn")]
    public class PurchaseReturnController : BaseController
    {
        public PurchaseReturnController(IConfiguration configuration) : base(configuration)
        {

        }
        public IActionResult PurchaseReturn(int PurchaseReturnId = 0)
        {
            return View(PurchaseReturnId);
        }


        [HttpGet]
        [Route("GetPurchaseReturn")]
        public IActionResult GetPurchaseReturn(DateTime FromDate, DateTime ToDate, int FranchiseId)
        {
            GetPurchaseReturn request = new GetPurchaseReturn()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseReturnId = null,
                FromDate = FromDate,
                ToDate = ToDate,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseReturnDetails]", request);
            return Json(response);

        }


        [HttpGet]
        [Route("NotNullGetPurchaseReturn")]
        public IActionResult NotNullGetPurchaseReturn(int PurchaseReturnId, int FranchiseId)
        {

            GetPurchaseReturn getInfo = new GetPurchaseReturn()
            {

                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseReturnId = PurchaseReturnId,
                FromDate = null,
                ToDate = null,
                FranchiseId = FranchiseId


            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseReturnDetails]", getInfo);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdatePurchaseReturn")]
        public async Task<IActionResult> InsertUpdatePurchaseReturn()
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
                    ModuleName = "PurchaseReturn"
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
                PurchaseReturnDetailsStatic PurchaseReturnDetailsStatic = JsonConvert.DeserializeObject<PurchaseReturnDetailsStatic>(Request.Form["PurchaseReturnDetailsStatic"]);
                List<PurchaseReturnProductMappingDetails>? PurchaseReturnProductMappingDetails = JsonConvert.DeserializeObject<List<PurchaseReturnProductMappingDetails>?>(Request.Form["PurchaseReturnProductMappingDetails"]);
                List<PurchaseReturnOtherChargesMappingDetails>? PurchaseReturnOtherChargesMappingDetails = JsonConvert.DeserializeObject<List<PurchaseReturnOtherChargesMappingDetails>?>(Request.Form["PurchaseReturnOtherChargesMappingDetails"]);

                DataTable dtproductData = new DataTable();
                dtproductData = GenericTetroONE.ToDataTable(PurchaseReturnProductMappingDetails);

                DataTable dtOtherChargesData = new DataTable();
                dtOtherChargesData = GenericTetroONE.ToDataTable(PurchaseReturnOtherChargesMappingDetails);




                InsertPurchaseReturnDetails request = new InsertPurchaseReturnDetails()
                {
                    LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                    PurchaseReturnId = PurchaseReturnDetailsStatic.PurchaseReturnId,
                    PurchaseReturnNo = PurchaseReturnDetailsStatic.PurchaseReturnNo,
                    VendorId = PurchaseReturnDetailsStatic.VendorId,
                    PurchaseReturnDate = PurchaseReturnDetailsStatic.PurchaseReturnDate,
                    ShipToId = PurchaseReturnDetailsStatic.ShipToId,
                    FranchiseId = PurchaseReturnDetailsStatic.FranchiseId,
                    BillFromFranchiseId = PurchaseReturnDetailsStatic.BillFromFranchiseId,
                    PurchaseBillId = PurchaseReturnDetailsStatic.PurchaseBillId,
                    PurchaseBillDate = PurchaseReturnDetailsStatic.PurchaseBillDate,
                    OriginalInvoiceNo = PurchaseReturnDetailsStatic.OriginalInvoiceNo,
                    Notes = PurchaseReturnDetailsStatic.Notes,
                    TermsAndCondition = PurchaseReturnDetailsStatic.TermsAndCondition,
                    SubTotal = PurchaseReturnDetailsStatic.SubTotal,
                    GrantTotal = PurchaseReturnDetailsStatic.GrantTotal,
                    RoundOffValue = PurchaseReturnDetailsStatic.RoundOffValue,
                    PurchaseReturnStatusId = PurchaseReturnDetailsStatic.PurchaseReturnStatusId,

                    ReturnReasonId = PurchaseReturnDetailsStatic.ReturnReasonId,
                    ReturnTypeId = PurchaseReturnDetailsStatic.ReturnTypeId,



                    TVP_Purchase_ProductMappingDetails = dtproductData,
                    TVP_PurchaseSaleOtherChargesMappingDetails = dtOtherChargesData,

                    TVP_AttachmentDetails = dtattachment
                };

                if (PurchaseReturnDetailsStatic.PurchaseReturnId > 0)
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdatePurchaseReturnDetails]", request);
                else
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertPurchaseReturnDetails]", request, "PurchaseReturnId");
                //response.Data = relativeFilePath;

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
        [Route("DeletePurchaseReturnDetails")]
        public IActionResult DeletePurchaseReturnDetails(int PurchaseReturnId)
        {

            DeletePurchaseReturn getInfo = new DeletePurchaseReturn()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseReturnId = PurchaseReturnId,

            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePurchaseReturnDetails]", getInfo);

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
        [Route("PurchaseReturnPrint")]
        public IActionResult PurchaseReturnPrint(int moduleId, int shippingAddressId, string contactId, string printType, int NoOfCopies, int FranchiseId)
        {
            try
            {
                _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintDetails]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                        command.Parameters.AddWithValue("@ModuleName", "PurchaseReturn");
                        command.Parameters.AddWithValue("@ModuleId", moduleId);
                        command.Parameters.AddWithValue("@ContactId", contactId);
                        command.Parameters.AddWithValue("@FranchiseId", FranchiseId);


                        command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
                        DataSet ds = new DataSet();

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(ds);
                        }

                        if (ds.Tables.Count >= 5)
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
                                var data = new PurchaseReturnPrint
                                {
                                    CompanyName = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null,
                                    CompanyLogo = dt1.Rows[0]["CompanyLogo"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyLogo"]) : null,
                                    CompanyAddress = dt1.Rows[0]["CompanyAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyAddress"]) : null,
                                    CompanyCity = dt1.Rows[0]["CompanyCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyCity"]) : null,
                                    CompanyCountry = dt1.Rows[0]["CompanyCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyCountry"]) : null,
                                    CompanyGSTNumber = dt1.Rows[0]["CompanyGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyGSTNumber"]) : null,
                                    CompanyContactNumber = dt1.Rows[0]["ContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ContactNumber"]) : null,
                                    CompanyEmail = dt1.Rows[0]["Email"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Email"]) : null,
                                    CompanyWebsite = dt1.Rows[0]["Website"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Website"]) : null,


                                    VendorName = dt1.Rows[0]["VendorName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorName"]) : null,
                                    VendorAddress = dt1.Rows[0]["VendorAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorAddress"]) : null,
                                    VendorCity = dt1.Rows[0]["VendorCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorCity"]) : null,
                                    VendorZipCode = dt1.Rows[0]["VendorZipCode"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorZipCode"]) : null,
                                    VendorState = dt1.Rows[0]["VendorState"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorState"]) : null,
                                    VendorCountry = dt1.Rows[0]["VendorCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorCountry"]) : null,
                                    VendorContact = dt1.Rows[0]["VendorContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorContactNumber"]) : null,
                                    VendorGSTNumber = dt1.Rows[0]["VendorGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorGSTNumber"]) : null,
                                    VendorContactPersonName = dt1.Rows[0]["ContactPersonName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ContactPersonName"]) : null,

                                    //AltName = dt1.Rows[0]["AltName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltName"]) : null,
                                    //AltAddress = dt1.Rows[0]["AltAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltAddress"]) : null,
                                    //AltCity = dt1.Rows[0]["AltCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltCity"]) : null,
                                    //AltContactNumber = dt1.Rows[0]["AltContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltContactNumber"]) : null,
                                    //StateName = dt1.Rows[0]["StateName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["StateName"]) : null,

                                    AccountName = dt1.Rows[0]["AccountName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AccountName"]) : null,
                                    BankName = dt1.Rows[0]["BankName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["BankName"]) : null,
                                    BranchName = dt1.Rows[0]["BranchName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["BranchName"]) : null,
                                    AccountNumber = dt1.Rows[0]["AccountNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AccountNumber"]) : null,
                                    IFSCCode = dt1.Rows[0]["IFSCCode"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["IFSCCode"]) : null,
                                    UPIId = dt1.Rows[0]["UPIId"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["UPIId"]) : null,

                                    PurchaseReturnNumber = dt2.Rows[0]["PurchaseReturnNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseReturnNo"]) : null,

                                    PurchaseReturnDate = dt2.Rows[0]["PurchaseReturnDate"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseReturnDate"]) : null,
                                    OriginalInvoiceNumber = dt2.Rows[0]["OriginalInvoiceNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["OriginalInvoiceNo"]) : null,


                                    RoundOffValue = dt4.Rows[0]["RoundOffValue"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["RoundOffValue"]) : null,
                                    GrantTotal = dt4.Rows[0]["GrantTotal"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["GrantTotal"]) : null,
                                    Amount_InWords = dt6.Rows[0]["Amount_InWords"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["Amount_InWords"]) : null,
                                    TermsandConditions = dt7.Rows[0]["TermsAndCondition"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["TermsAndCondition"]) : null,
                                    Notes = dt7.Rows[0]["Notes"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Notes"]) : null,

                                    Signature = dt7.Rows[0]["Signature"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Signature"]) : null,


                                    OtherChargesTable = dt5,
                                   
                                    ProductItemTable = dt3,

                                };

                                PDFPurchaseReturn pdfService = new PDFPurchaseReturn();
                                byte[] pdfContent = null;


                                pdfContent = pdfService.PurchaseReturnPrint(data, NoOfCopies);

                                switch (printType.ToLower())
                                {
                                    case "mail":
                                        var base64PdfContent = Convert.ToBase64String(pdfContent);
                                        return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                                    case "download":
                                        return File(pdfContent, "application/pdf", "PurchaseReturn.pdf");

                                    case "preview":
                                        Response.Headers.Add("Content-Disposition", "inline; filename=PurchaseReturn.pdf");
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

                                        string fileName = "PurchaseReturn_" + Guid.NewGuid().ToString() + ".pdf";
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
                                // Handle case where dt1 has no rows
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
    }
}
