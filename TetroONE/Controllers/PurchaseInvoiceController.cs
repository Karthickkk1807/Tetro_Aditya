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
		public IActionResult GetPurchaseBill(DateTime FromDate, DateTime ToDate, int FranchiseId)
		{
			GetPurchaseBill request = new GetPurchaseBill()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				PurchaseBillId = null,
				FromDate = FromDate,
				ToDate = ToDate,
				FranchiseId = FranchiseId

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
		public IActionResult GetInventoryNumberDetailsByVendorId(string moduleName,int? ModuleId, int vendorId, int ShipToFranchiseId)
		{
			InventoryNumberDetailsByVendorId request = new InventoryNumberDetailsByVendorId()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ModuleName = moduleName,
                ModuleId= ModuleId,

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
		public IActionResult GetOtherChargesType(string OtherChargesTypeName)
		{

			PurchaseBillOtherchargesType getInfo = new PurchaseBillOtherchargesType()
			{
				LoginuserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				OtherChargesType = OtherChargesTypeName,

			};

			response = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_GetOtherChargesDetailsByType]", getInfo);
			return Json(response);
		}

		[HttpPost]
		[Route("UpdateWareHouseInfoDetails")]
		public IActionResult UpdateWareHouseInfoDetails([FromBody] UpdateWareHouseInfoDetails request)
		{
			request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

			response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateWarehouseForShippingDetails]", request);
			return Json(response);
		}


		[HttpPost]
		[Route("UpdateStoreForShippingDetails")]
		public IActionResult UpdateStoreForShippingDetails([FromBody] UpdateWareHouseInfoDetails request)
		{
			request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

			response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateStoreForShippingDetails]", request);
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
			List<PurchaseBillOtherChargesMappingDetails>? PurchaseBillOtherChargesMappingDetails = JsonConvert.DeserializeObject<List<PurchaseBillOtherChargesMappingDetails>?>(Request.Form["PurchaseBillOtherChargesMappingDetails"]);
            List<PurchaseBillProductQCDetails> PurchaseBillProductQCDetailsList = JsonConvert.DeserializeObject<List<PurchaseBillProductQCDetails>>(Request.Form["PurchaseBillProductQCDetails"]);
            DataTable dtproductData = new DataTable();
			dtproductData = GenericTetroONE.ToDataTable(PurchaseBillProductMappingDetails);

			DataTable dtOtherChargesData = new DataTable();
			dtOtherChargesData = GenericTetroONE.ToDataTable(PurchaseBillOtherChargesMappingDetails);

            DataTable dtQCData = new DataTable();
            dtQCData = GenericTetroONE.ToDataTable(PurchaseBillProductQCDetailsList);

            InsertUpdatePurchaseBill request = new InsertUpdatePurchaseBill()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				PurchaseBillId = PurchaseBillDetailsStatic.PurchaseBillId,
				PurchaseBillNo = PurchaseBillDetailsStatic.PurchaseBillNo,
				VendorId = PurchaseBillDetailsStatic.VendorId,
				FranchiseId = PurchaseBillDetailsStatic.FranchiseId,
				ShipToFranchiseId = PurchaseBillDetailsStatic.ShipToFranchiseId,
				BillFromFranchiseId = PurchaseBillDetailsStatic.BillFromFranchiseId,
				PurchaseOrderId = PurchaseBillDetailsStatic.PurchaseOrderId,

				PurchaseBillDate = PurchaseBillDetailsStatic.PurchaseBillDate,
				OriginalInvoiceNo = PurchaseBillDetailsStatic.OriginalInvoiceNo,
				Notes = PurchaseBillDetailsStatic.Notes,
				TermsAndCondition = PurchaseBillDetailsStatic.TermsAndCondition,
				SubTotal = PurchaseBillDetailsStatic.SubTotal,
				GrantTotal = PurchaseBillDetailsStatic.GrantTotal,
				RoundOffValue = PurchaseBillDetailsStatic.RoundOffValue,
				PurchaseBillStatusId = PurchaseBillDetailsStatic.PurchaseBillStatusId,

				BalanceAmount = PurchaseBillDetailsStatic.BalanceAmount,
                TVP_Purchase_ProductMappingDetails = dtproductData,

				TVP_PurchaseSaleOtherChargesMappingDetails = dtOtherChargesData,
                TVP_PurchaseBillQCMappingDetails = dtQCData,

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
		[Route("NotNullGetPurchaseBill")]
		public IActionResult NotNullGetPurchaseBill(int PurchaseBillId, int FranchiseId)
		{

			GetPurchaseBill getInfo = new GetPurchaseBill()
			{

				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				PurchaseBillId = PurchaseBillId,
				FromDate = null,
				ToDate = null,
				FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseBillDetails]", getInfo);
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
		public IActionResult PurchaseBillPrint(int ModuleId, int ContactId, int NoOfCopies, string printType, int FranchiseId)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@ModuleName", "PurchaseBill");
					command.Parameters.AddWithValue("@ModuleId", ModuleId);
					command.Parameters.AddWithValue("@ContactId", ContactId);
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
							var data = new PurchaseBillPrint
							{
								CompanyName = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null,
								CompanyLogo = dt1.Rows[0]["CompanyLogo"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyLogo"]) : null,
								CompanyAddress = dt1.Rows[0]["CompanyAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyAddress"]) : null,
								CompanyCity = dt1.Rows[0]["CompanyCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyCity"]) : null,
								CompanyCountry = dt1.Rows[0]["CompanyCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyCountry"]) : null,
								CompanyGSTNumber = dt1.Rows[0]["CompanyGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyGSTNumber"]) : null,
								CompanyWebsite = dt1.Rows[0]["Website"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Website"]) : null,
								CompanyEmail = dt1.Rows[0]["Email"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Email"]) : null,
								CompanyContactNumber = dt1.Rows[0]["ContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ContactNumber"]) : null,

								PurchaseBillNumber = dt2.Rows[0]["PurchaseBillNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseBillNo"]) : null,
								PurchaseBillDate = dt2.Rows[0]["PurchaseBillDate"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseBillDate"]) : null,
								OriginalInvoiceNumber = dt2.Rows[0]["OriginalInvoiceNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["OriginalInvoiceNo"]) : null,
								PurchaseOrderNumber = dt2.Rows[0]["PurchaseOrderNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseOrderNo"]) : null,

								AccountName = dt1.Rows[0]["AccountName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AccountName"]) : null,
								BankName = dt1.Rows[0]["BankName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["BankName"]) : null,
								BranchName = dt1.Rows[0]["BranchName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["BranchName"]) : null,
								AccountNumber = dt1.Rows[0]["AccountNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AccountNumber"]) : null,
								IFSCCode = dt1.Rows[0]["IFSCCode"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["IFSCCode"]) : null,
								UPIId = dt1.Rows[0]["UPIId"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["UPIId"]) : null,

								VendorName = dt1.Rows[0]["VendorName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorName"]) : null,
								VendorAddress = dt1.Rows[0]["VendorAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorAddress"]) : null,
								VendorCity = dt1.Rows[0]["VendorCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorCity"]) : null,
								VendorZipCode = dt1.Rows[0]["VendorZipCode"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorZipCode"]) : null,
								VendorState = dt1.Rows[0]["VendorState"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorState"]) : null,
								VendorCountry = dt1.Rows[0]["VendorCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorCountry"]) : null,
								VendorContact = dt1.Rows[0]["VendorContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorContactNumber"]) : null,
								VendorGSTNumber = dt1.Rows[0]["VendorGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["VendorGSTNumber"]) : null,

								//AltName = dt1.Rows[0]["AltName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltName"]) : null,
								//AltAddress = dt1.Rows[0]["AltAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltAddress"]) : null,
								//AltCity = dt1.Rows[0]["AltCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltCity"]) : null,
								//StateName = dt1.Rows[0]["StateName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["StateName"]) : null,
								//AltContactNumber = dt1.Rows[0]["AltContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltContactNumber"]) : null,

								//TotalProduct = dt4.Rows[0]["Total Products"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["Total Products"]) : null,
								//TotalDiscount = dt4.Rows[0]["TotalDiscount"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["TotalDiscount"]) : null,
								//CGST = dt4.Rows[0]["CGST"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["CGST"]) : null,
								//SGST = dt4.Rows[0]["SGST"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["SGST"]) : null,
								//SubTotal = dt4.Rows[0]["SubTotal"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["SubTotal"]) : null,

								RoundOffValue = dt4.Rows[0]["RoundOffValue"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["RoundOffValue"]) : null,
								GrantTotal = dt4.Rows[0]["GrantTotal"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["GrantTotal"]) : null,
								Amount_InWords = dt6.Rows[0]["Amount_InWords"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["Amount_InWords"]) : null,
								TermsandConditions = dt7.Rows[0]["TermsAndCondition"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["TermsAndCondition"]) : null,
								Notes = dt7.Rows[0]["Notes"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Notes"]) : null,
								Signature = dt7.Rows[0]["Signature"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Signature"]) : null,

								//BackroundColour = dt10.Rows[0]["BackroundColour"] != DBNull.Value ? Convert.ToString(dt10.Rows[0]["BackroundColour"]) : null,
								//TextColour = dt10.Rows[0]["TextColour"] != DBNull.Value ? Convert.ToString(dt10.Rows[0]["TextColour"]) : null,


								OtherChargesTable = dt5,

								ProductItemTable = dt3,

							};


							PDFPurchaseBill pdfService = new PDFPurchaseBill();
							byte[] pdfContent = null;

							pdfContent = pdfService.PurchaseBillPrintNew(data, NoOfCopies);

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
