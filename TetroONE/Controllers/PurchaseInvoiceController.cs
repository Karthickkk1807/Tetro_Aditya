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
    [Route("PurchaseInvoice")]
    public class PurchaseInvoiceController : BaseController
    {
        public PurchaseInvoiceController(IConfiguration configuration) : base(configuration)
        {

        }
        public IActionResult PurchaseBill(int PurchaseBillId = 0)
        {
            return View(PurchaseBillId);
        }

        [HttpGet]
        [Route("GetPurchaseBill")]
        public IActionResult GetPurchaseBill(int PurchaseBillId, DateTime FromDate, DateTime ToDate, int PlantId)
        {
            GetPurchaseBill request = new GetPurchaseBill()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseBillId = PurchaseBillId == 0 ? null : PurchaseBillId,
                FromDate = FromDate,
                ToDate = ToDate,
                PlantId = PlantId
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseBillDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("ShippingAddressForStoreId")]
        public IActionResult ShippingAddressForStoreId()
        {
            ShippingAddressForStoreId request = new ShippingAddressForStoreId()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
            };

            return Json(GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetShippingAddressByStoreId]", request));
        }

        [HttpGet]
        [Route("GetInventoryNumberDetailsByVendorId")]
        public IActionResult GetInventoryNumberDetailsByVendorId(string moduleName, int? ModuleId, int vendorId, int ShipToFranchiseId)
        {
            InventoryNumberDetailsByVendorId request = new InventoryNumberDetailsByVendorId()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ModuleName = moduleName,
                ModuleId = ModuleId,
                VendorId = vendorId,
                ShipToFranchiseId = ShipToFranchiseId
            };

            return Json(GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetInventoryNumberDetails_ByVendorId]", request));
        }

        [HttpGet]
        [Route("GetPurchaseDetails_ByPurchaseId")]
        public IActionResult GetPurchaseDetails_ByPurchaseId(int PurchaseId, string ModuleName, int FranchiseId)
        {
            GetPurchaseOrderDetails request = new GetPurchaseOrderDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseId = PurchaseId,
                ModuleName = ModuleName,
                FranchiseId = FranchiseId
            };

            return Json(GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetPurchaseDetails_ByPurchaseId]", request));
        }

        [HttpGet]
        [Route("ShippingAddressForWareHouseId")]
        public IActionResult ShippingAddressForWareHouseId(int WareHouseId)
        {
            ShippingAddressForWareHouseId request = new ShippingAddressForWareHouseId()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                WareHouseId = WareHouseId,
            };

            return Json(GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetShippingAddressByWareHouseId]", request));
        }

        [HttpGet]
        [Route("GetOtherChargesType")]
        public IActionResult GetOtherChargesType(int? OtherChargesId, string OtherChargesTypeName)
        {
            PurchaseBillOtherchargesType getInfo = new PurchaseBillOtherchargesType()
            {
                LoginuserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                OtherChargesId = OtherChargesId,
                OtherChargesType = OtherChargesTypeName,
            };

            response = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_GetOtherChargesDetailsByType]", getInfo);
            return Json(response);
        }

        [HttpGet]
        [Route("GetPurchaseOrderNoDetails_ByVendorPlant")]
        public IActionResult GetPurchaseOrderNoDetails_ByVendorPlant(int? VendorId, int PlantId, int PurchaseOrderId)
        {
            GetPurchaseOrderNoDetails_ByVendorPlant getInfo = new GetPurchaseOrderNoDetails_ByVendorPlant()
            {
                LoginuserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                VendorId = VendorId,
                PlantId = PlantId,
                PurchaseOrderId = PurchaseOrderId == 0 ? null : PurchaseOrderId
            };

            response = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetPurchaseOrderNoDetails_ByVendorPlant]", getInfo);
            return Json(response);
        }

        [HttpGet]
        [Route("DD_GetPurchaseOrderNo")]
        public IActionResult DD_GetPurchaseOrderNo(int? ModuleId, string? ModuleName)
        {
            DD_GetPurchaseOrderNo getInfo = new DD_GetPurchaseOrderNo()
            {
                LoginuserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ModuleId = ModuleId,
                ModuleName = ModuleName
            };

            response = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetPurchaseOrderNo_PurchaseBill]", getInfo);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdatePurchaseBill")]
        public async Task<IActionResult> InsertUpdatePurchaseBill()
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
                    ModuleName = "PurchaseBill"
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

            PurchaseBillDetailsStatic PurchaseBillDetailsStatic = JsonConvert.DeserializeObject<PurchaseBillDetailsStatic>(Request.Form["PurchaseBillDetailsStatic"]);
            List<PurchaseBillProductMappingDetails>? PurchaseBillProductMappingDetails = JsonConvert.DeserializeObject<List<PurchaseBillProductMappingDetails>?>(Request.Form["PurchaseBillProductMappingDetails"]);
            List<PurchaseBillOtherChargesMappingDetails> PurchaseBillOtherChargesMappingDetails = JsonConvert.DeserializeObject<List<PurchaseBillOtherChargesMappingDetails>>(Request.Form["PurchaseBillOtherChargesMappingDetails"]);

            DataTable dtproductData = new DataTable();
            dtproductData = GenericTetroONE.ToDataTable(PurchaseBillProductMappingDetails);

            DataTable dtOtherChargesData = new DataTable();
            dtOtherChargesData = GenericTetroONE.ToDataTable(PurchaseBillOtherChargesMappingDetails);

            InsertUpdatePurchaseBill request = new InsertUpdatePurchaseBill()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseBillId = PurchaseBillDetailsStatic.PurchaseBillId,
                VendorId = PurchaseBillDetailsStatic.VendorId,
                BillFromPlantId = PurchaseBillDetailsStatic.BillFromPlantId,
                PlantId = PurchaseBillDetailsStatic.PlantId,
                ShipToPlantId = PurchaseBillDetailsStatic.ShipToPlantId,
                PurchaseBillNo = PurchaseBillDetailsStatic.PurchaseBillNo,
                PurchaseBillDate = PurchaseBillDetailsStatic.PurchaseBillDate,
                PurchaseOrderId = PurchaseBillDetailsStatic.PurchaseOrderId,
                OriginalInvoiceNo = PurchaseBillDetailsStatic.OriginalInvoiceNo,
                SubTotal = PurchaseBillDetailsStatic.SubTotal,
                RoundOffValue = PurchaseBillDetailsStatic.RoundOffValue,
                GrantTotal = PurchaseBillDetailsStatic.GrantTotal,
                BalanceAmount = PurchaseBillDetailsStatic.BalanceAmount,
                Notes = PurchaseBillDetailsStatic.Notes,
                TermsAndCondition = PurchaseBillDetailsStatic.TermsAndCondition,
                PurchaseBillStatusId = PurchaseBillDetailsStatic.PurchaseBillStatusId,

                TVP_Purchase_ProductMappingDetails = dtproductData,
                TVP_PurchaseSaleOtherChargesMappingDetails = dtOtherChargesData,
                TVP_AttachmentDetails = dtattachment
            };

            if (PurchaseBillDetailsStatic.PurchaseBillId > 0)
                response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdatePurchaseBillDetails]", request);
            else
                response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertPurchaseBillDetails]", request, "PurchaseBillId");

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

        [HttpGet]
        [Route("DeletePurchaseBillDetails")]
        public IActionResult DeletePurchaseBillDetails(int PurchaseBillId)
        {
            DelPurchaseBill getInfo = new DelPurchaseBill()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseBillId = PurchaseBillId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePurchaseBillDetails]", getInfo);

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
        [Route("PurchaseBillPrint")]
        public IActionResult PurchaseBillPrint(int ModuleId, int NoOfCopies, string printType)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintPDFDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@ModuleName", "PurchaseBill");
                    command.Parameters.AddWithValue("@ModuleId", ModuleId);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
                    DataSet ds = new DataSet();
                    
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(ds);
                    }

                    if (ds.Tables.Count >= 8)
                    {
                        DataTable dt1 = ds.Tables[0];
                        DataTable dt2 = ds.Tables[1];
                        DataTable dt3 = ds.Tables[2];
                        DataTable dt4 = ds.Tables[3];
                        DataTable dt5 = ds.Tables[4];
                        DataTable dt6 = ds.Tables[5];
                        DataTable dt7 = ds.Tables[6];
                        DataTable dt8 = ds.Tables[7];

                        // Check if dt1 has rows
                        if (dt1.Rows.Count > 0)
                        {
                            var data = new PurchaseBillPrint
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

                                PINo = dt3.Rows[0]["PINo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["PINo"]) : null,
                                PIDate = dt3.Rows[0]["PIDate"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["PIDate"]) : null,
                                PONo = dt3.Rows[0]["PONo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["PONo"]) : null,
                                VendorBillNo = dt3.Rows[0]["VendorBillNo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["VendorBillNo"]) : null,

                                IGSTPer = dt5.Rows[0]["IGSTPer"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["IGSTPer"]) : null,
                                CGSTPer = dt5.Rows[0]["CGSTPer"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["CGSTPer"]) : null,
                                SGSTPer = dt5.Rows[0]["SGSTPer"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["SGSTPer"]) : null,
                                IGSTValue = dt5.Rows[0]["IGSTValue"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["IGSTValue"]) : null,
                                CGSTValue = dt5.Rows[0]["CGSTValue"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["CGSTValue"]) : null,
                                SGSTValue = dt5.Rows[0]["SGSTValue"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["SGSTValue"]) : null,
                                 
                                TermsConditions = dt6.Rows[0]["TermsConditions"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["TermsConditions"]) : null,
                                RoundOff = dt6.Rows[0]["RoundOff"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["RoundOff"]) : null,
                                NetAmount = dt6.Rows[0]["NetAmount"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["NetAmount"]) : null,

                                RupeesInWords = dt7.Rows[0]["RupeesInWords"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["RupeesInWords"]) : null,

                                ProductItemData = dt4,
                                OtherChargesData = dt8, 
                            };

                            PDFPurchaseBill pdfService = new PDFPurchaseBill();
                            byte[] pdfContent = null;

                            pdfContent = pdfService.PurchaseBillPrint(NoOfCopies, data);

                            switch (printType.ToLower())
                            {
                                case "mail":
                                    var base64PdfContent = Convert.ToBase64String(pdfContent);
                                    return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                                case "download":
                                    return File(pdfContent, "application/pdf", "PurchaseInvoice.pdf");

                                case "preview":
                                    Response.Headers.Add("Content-Disposition", "inline; filename=PurchaseInvoice.pdf");
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

                                    string fileName = "PurchaseBill_" + Guid.NewGuid().ToString() + ".pdf";
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

        [HttpPost]
        [Route("GetProductQC")]
        public async Task<IActionResult> GetProductQC()
        {
            try
            {
                int employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

                // Read FilterType from Form
                var filterTypeJson = Request.Form["FilterType"];
                if (string.IsNullOrEmpty(filterTypeJson))
                {
                    return Json(new
                    {
                        Status = false,
                        Message = "No product IDs provided.",
                        Data = new List<object>()
                    });
                }

                List<ProductFilter> productFilters = JsonConvert.DeserializeObject<List<ProductFilter>>(filterTypeJson);
                if (productFilters == null || !productFilters.Any())
                {
                    return Json(new
                    {
                        Status = false,
                        Message = "Invalid or empty product filter list.",
                        Data = new List<object>()
                    });
                }

                DataTable filterTable = GenericTetroONE.ToDataTable(productFilters);
                DataSet ds = new DataSet();

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    SqlCommand command = new SqlCommand("[dbo].[USP_GetQCDetails_ByProductId]", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LoginUserId", employeeId);
                    command.Parameters.AddWithValue("@TVP_QCProductDetails", filterTable);

                    // Output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    await Task.Run(() => adapter.Fill(ds));

                    bool status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    string message = Convert.ToString(command.Parameters["@Message"].Value);
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        var listData = GenericTetroONE.DataTableToList<GetProductQC>(ds.Tables[0]);
                        return Json(new
                        {
                            Status = status,
                            Message = message,
                            Data = listData
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            Status = false,
                            Message = "No QC details found for selected products.",
                            Data = new List<object>()
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    Status = false,
                    Message = "An error occurred while processing the request: " + ex.Message,
                    Data = new List<object>()
                });
            }
        }




    }
}
