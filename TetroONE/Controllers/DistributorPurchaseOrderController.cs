using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;

namespace TetroONE.Controllers
{
	[Authorize]
	[Route("DPO")]
	public class DistributorPurchaseOrderController : BaseController
	{
		public DistributorPurchaseOrderController(IConfiguration configuration) : base(configuration)
		{

		}

		public IActionResult DistributorPurchaseOrder()
		{
			return View();
		}

		[HttpGet]
		[Route("GetPurchaseOrder")]
		public IActionResult GetPurchaseOrder(DateTime FromDate, DateTime ToDate, int FranchiseId,int TypeId)
		{
			DPGetPurchaseOrder request = new DPGetPurchaseOrder()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				PurchaseOrderId_DBT = null,
				FromDate = FromDate,
				ToDate = ToDate,
				FranchiseId_DBT = FranchiseId,
				TypeId = TypeId


			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseOrderDetails_DBT]", request);
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
				PurchaseDetailsStaticDPO PurchaseDetailsStatic = JsonConvert.DeserializeObject<PurchaseDetailsStaticDPO>(Request.Form["PurchaseDetailsStatic"]);
				List<PurchaseOrderProductMappingDetailsDPO>? PurchaseOrderProductMappingDetails = JsonConvert.DeserializeObject<List<PurchaseOrderProductMappingDetailsDPO>?>(Request.Form["PurchaseOrderProductMappingDetails"]);

				DataTable dtproductData = new DataTable();
				dtproductData = GenericTetroONE.ToDataTable(PurchaseOrderProductMappingDetails);

				InsertPurchaseOrderDetailsDPO request = new InsertPurchaseOrderDetailsDPO()
				{
					LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
					PurchaseOrderId = PurchaseDetailsStatic.PurchaseOrderId,
					PurchaseOrderNo = PurchaseDetailsStatic.PurchaseOrderNo,
					VendorId = PurchaseDetailsStatic.VendorId,
					ShipToFranchiseId = PurchaseDetailsStatic.ShipToFranchiseId,
					FranchiseId = PurchaseDetailsStatic.FranchiseId,
					BillFromFranchiseId = PurchaseDetailsStatic.BillFromFranchiseId,
					PurchaseOrderDate = PurchaseDetailsStatic.PurchaseOrderDate,
					ExpectedDeliveryDate = PurchaseDetailsStatic.ExpectedDeliveryDate,
					TermsAndCondition = PurchaseDetailsStatic.TermsAndCondition,
					Notes = PurchaseDetailsStatic.Notes,
					SubTotal = PurchaseDetailsStatic.SubTotal,
					GrantTotal = PurchaseDetailsStatic.GrantTotal,
					RoundOffValue = PurchaseDetailsStatic.RoundOffValue,
					PurchaseOrderStatusId = PurchaseDetailsStatic.PurchaseOrderStatusId,
                    TVP_Purchase_ProductMappingDetails = dtproductData,
					TVP_AttachmentDetails = dtattachment
				};
                

                if (PurchaseDetailsStatic.PurchaseOrderId > 0)
					response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdatePurchaseOrderDetails_DBT]", request);
				else
					response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertPurchaseOrderDetails_DBT]", request, "PurchaseOrderId");

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
		[Route("NotNullGetPurchaseOrder")]
		public IActionResult NotNullGetPurchaseOrder(int PurchaseOrderId, int FranchiseId)
		{

			DPGetPurchaseOrder getInfo = new DPGetPurchaseOrder()
			{

				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				PurchaseOrderId_DBT = PurchaseOrderId,
				FromDate = null,
				ToDate = null,
				FranchiseId_DBT = FranchiseId,
				TypeId = null


			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseOrderDetails_DBT]", getInfo);
			return Json(response);
		}
		

		[HttpGet]
		[Route("DeletePurchaseOrderDetails")]
		public IActionResult DeletePurchaseOrderDetails(int purchaseOrderId)
		{
			DeletePurchaseOrderDPO getInfo = new DeletePurchaseOrderDPO()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				PurchaseOrderId = purchaseOrderId,

			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePurchaseOrderDetails_DBT]", getInfo);

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

		public IActionResult PurchaseOrderPrint(int ModuleId, int ContactId, int NoOfCopies, string printType, int FranchiseId)
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
						command.Parameters.AddWithValue("@ModuleName", "PurchaseOrder_DBT");
						command.Parameters.AddWithValue("@ModuleId", ModuleId);
						command.Parameters.AddWithValue("@ContactId", ContactId);
						command.Parameters.AddWithValue("@FranchiseId", FranchiseId);


						//command.Parameters.AddWithValue("@ShippingAddressId", ShippingAddressId);
						//command.Parameters.AddWithValue("@IsSameAddress", DBNull.Value);


						command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
						command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
						DataSet ds = new DataSet();

						using (SqlDataAdapter adapter = new SqlDataAdapter(command))
						{
							adapter.Fill(ds);
						}

						if (ds.Tables.Count >= 6)
						{
							DataTable dt1 = ds.Tables[0];
							DataTable dt2 = ds.Tables[1];
							DataTable dt3 = ds.Tables[2];
							DataTable dt4 = ds.Tables[3];
							DataTable dt5 = ds.Tables[4];
							DataTable dt6 = ds.Tables[5];

							// Check if dt1 has rows
							if (dt1.Rows.Count > 0)
							{
								var data = new PurchaseOrderPrintDPO
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

									PurchaseOrderNumber = dt2.Rows[0]["PurchaseOrderNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseOrderNo"]) : null,
									PurchaseOrderDate = dt2.Rows[0]["PurchaseOrderDate"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseOrderDate"]) : null,
									ExpectedDeliveryDate = dt2.Rows[0]["ExpectedDeliveryDate"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["ExpectedDeliveryDate"]) : null,

									RoundOffValue = dt4.Rows[0]["RoundOffValue"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["RoundOffValue"]) : null,
									GrantTotal = dt4.Rows[0]["GrantTotal"] != DBNull.Value ? Convert.ToString(dt4.Rows[0]["GrantTotal"]) : null,
									NumberToWords = dt5.Rows[0]["Amount_InWords"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["Amount_InWords"]) : null,
									Notes = dt6.Rows[0]["Notes"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["Notes"]) : null,

									TermsandConditions = dt6.Rows[0]["TermsAndCondition"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["TermsAndCondition"]) : null,
									Signature = dt6.Rows[0]["Signature"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["Signature"]) : null,
									ProductItemTable = dt3,

								};

								string PurchaseOrderNumber = dt2.Rows[0]["PurchaseOrderNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["PurchaseOrderNo"]) : null;
								string customFileName = $"PurchaseOrder_{PurchaseOrderNumber}.pdf";
								PDF_DPO pdfService = new PDF_DPO();
								byte[] pdfContent = null;

								pdfContent = pdfService.PurchaseOrderPrintNewDPO(data, NoOfCopies);


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

		


	}

}



