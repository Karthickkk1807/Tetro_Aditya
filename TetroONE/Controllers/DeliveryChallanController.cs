using DocumentFormat.OpenXml.VariantTypes;
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
	[Route("DeliveryChallan")]
	public class DeliveryChallanController : BaseController
	{
		public DeliveryChallanController(IConfiguration configuration) : base(configuration)
		{

		}
		public IActionResult Deliverychallan(int DeliveryChallanId = 0)
		{
			return View(DeliveryChallanId);
		}


		[HttpGet]
		[Route("GetDC")]
		public IActionResult GetDC(DateTime FromDate, DateTime ToDate, int FranchiseId)
		{
			GetDC request = new GetDC()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				DeliveryChallanId = null,
				FromDate = FromDate,
				ToDate = ToDate,
				FranchiseId = FranchiseId

			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDeliveryChallanDetails]", request);
			return Json(response);
		}
		[HttpGet]
		[Route("GetInventoryNumberDetailsByCLientId")]
		public IActionResult GetInventoryNumberDetailsByCLientId(string moduleName, int ClientId)
		{
			GetInventoryNumberDetailsByCLientId request = new GetInventoryNumberDetailsByCLientId()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ModuleName = moduleName,
				ClientId = ClientId,

			};

			return Json(GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetInventoryNumberDetails_ByCLientId]", request));
		}
		[HttpPost]
		[Route("InsertUpdateDeliveryChallan")]
		public async Task<IActionResult> InsertUpdateDeliveryChallan()
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
					ModuleName = "DeliveryChallan"
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

			DeliveryChallanDetailsStatic DeliveryChallanDetailsStatic = JsonConvert.DeserializeObject<DeliveryChallanDetailsStatic>(Request.Form["DeliveryChallanDetailsStatic"]);
			List<DeliveryChallanProductMappingDetails>? DeliveryChallanProductMappingDetails = JsonConvert.DeserializeObject<List<DeliveryChallanProductMappingDetails>?>(Request.Form["DeliveryChallanProductMappingDetails"]);
			List<DeliveryChallanOtherChargesMappingDetails>? DeliveryChallanOtherChargesMappingDetails = JsonConvert.DeserializeObject<List<DeliveryChallanOtherChargesMappingDetails>?>(Request.Form["DeliveryChallanOtherChargesMappingDetails"]);

			DataTable dtproductData = new DataTable();
			dtproductData = GenericTetroONE.ToDataTable(DeliveryChallanProductMappingDetails);

			DataTable dtOtherChargesData = new DataTable();
			dtOtherChargesData = GenericTetroONE.ToDataTable(DeliveryChallanOtherChargesMappingDetails);

			InsertDeliveryChallanDetails request = new InsertDeliveryChallanDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ClientId = DeliveryChallanDetailsStatic.ClientId,
				DeliveryChallanId = DeliveryChallanDetailsStatic.DeliveryChallanId,
				FranchiseId = DeliveryChallanDetailsStatic.FranchiseId,
				BillingFranchiseId = DeliveryChallanDetailsStatic.BillingFranchiseId,
				BillFromFranchiseId = DeliveryChallanDetailsStatic.BillFromFranchiseId,
				DeliveryChallanNo = DeliveryChallanDetailsStatic.DeliveryChallanNo,
				DeliveryChallanDate = DeliveryChallanDetailsStatic.DeliveryChallanDate,
				EstimateId = DeliveryChallanDetailsStatic.EstimateId,
				EstimateDate = DeliveryChallanDetailsStatic.EstimateDate,
				ChallanType = DeliveryChallanDetailsStatic.ChallanType,
				ReferenceNo = DeliveryChallanDetailsStatic.ReferenceNo,
				Notes = DeliveryChallanDetailsStatic.Notes,
				TermsAndCondition = DeliveryChallanDetailsStatic.TermsAndCondition,
				SubTotal = DeliveryChallanDetailsStatic.SubTotal,
				GrantTotal = DeliveryChallanDetailsStatic.GrantTotal,
				RoundOffValue = DeliveryChallanDetailsStatic.RoundOffValue,
				DeliveryChallanStatusId = DeliveryChallanDetailsStatic.DeliveryChallanStatusId,

				TVP_SaleProductMappingDetails = dtproductData,
				TVP_PurchaseSaleOtherChargesMappingDetails = dtOtherChargesData,
				TVP_AttachmentDetails = dtattachment
			};

			if (DeliveryChallanDetailsStatic.DeliveryChallanId > 0)
				response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdateDeliveryChallanDetails]", request);
			else
				response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertDeliveryChallanDetails]", request, "DeliveryChallanId");


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
		[Route("NotNullGetDeliveryChallan")]
		public IActionResult NotNullGetDeliveryChallan(int DeliveryChallanId, DateTime FromDate, DateTime ToDate, int FranchiseId)
		{
			GetDC getInfo = new GetDC()
			{

				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				DeliveryChallanId = DeliveryChallanId,
				FromDate = FromDate,
				ToDate = ToDate,
				FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDeliveryChallanDetails]", getInfo);
			return Json(response);
		}



		[HttpGet]
		[Route("DeleteDCDetails")]
		public IActionResult DeleteDCDetails(int DeliveryChallanId)
		{
			DeleteDC getInfo = new DeleteDC()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				DeliveryChallanId = DeliveryChallanId,
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteDeliveryChallanDetails]", getInfo);

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
		[Route("DCPrint")]
		public IActionResult DCPrint(int ModuleId, int ContactId, int NoOfCopies, string printType, int FranchiseId)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@ModuleName", "DeliveryChallan");
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




						var data = new DCPrint
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

							ClientName = dt1.Rows[0]["ClientName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientName"]) : null,
							ClientAddress = dt1.Rows[0]["ClientAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientAddress"]) : null,
							ClientCity = dt1.Rows[0]["ClientCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientCity"]) : null,
							ClientZipCode = dt1.Rows[0]["ClientZipCode"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientZipCode"]) : null,
							ClientState = dt1.Rows[0]["ClientState"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientState"]) : null,
							ClientCountry = dt1.Rows[0]["ClientCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientCountry"]) : null,
							ClientContactNumber = dt1.Rows[0]["ClientContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientContactNumber"]) : null,
							ClientGSTNumber = dt1.Rows[0]["ClientGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientGSTNumber"]) : null,



							DeliveryChallanNumber = Convert.ToString(dt2.Rows[0]["DeliveryChallanNo"]),
							DeliveryChallanDate = Convert.ToString(dt2.Rows[0]["DeliveryChallanDate"]),
							//ChallanType = Convert.ToString(dt2.Rows[0]["ChallanType"]),
							//ReferenceNumber = Convert.ToString(dt2.Rows[0]["ReferenceNumber"]),
							//EstimateNumber = Convert.ToString(dt2.Rows[0]["EstimateNumber"]),
							//EstimateDate = Convert.ToString(dt2.Rows[0]["EstimateDate"]),

							//TotalProducts = Convert.ToString(dt4.Rows[0]["TotalProducts"]),
							//TotalDiscount = Convert.ToString(dt4.Rows[0]["TotalDiscount"]),
							//CGST = Convert.ToString(dt4.Rows[0]["CGST"]),
							//SGST = Convert.ToString(dt4.Rows[0]["SGST"]),
							//SubTotal = Convert.ToString(dt4.Rows[0]["SubTotal"]),

							RoundOffValue = Convert.ToString(dt4.Rows[0]["RoundOffValue"]),
							GrantTotal = Convert.ToString(dt4.Rows[0]["GrantTotal"]),

							Amount_InWords = Convert.ToString(dt6.Rows[0]["Amount_InWords"]),

							AccountName = Convert.ToString(dt1.Rows[0]["AccountName"]),
							AccountNumber = Convert.ToString(dt1.Rows[0]["AccountNumber"]),
							IFSCCode = Convert.ToString(dt1.Rows[0]["IFSCCode"]),
							BankName = Convert.ToString(dt1.Rows[0]["BankName"]),
							UPIId = Convert.ToString(dt1.Rows[0]["UPIId"]),
							BranchName = Convert.ToString(dt1.Rows[0]["BranchName"]),

							TermsAndCondition = Convert.ToString(dt7.Rows[0]["TermsAndCondition"]),
							Signature = dt7.Rows[0]["Signature"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Signature"]) : null,
							Notes = dt7.Rows[0]["Notes"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Notes"]) : null,


							ProductTable = dt3,
							ProductOtherChargesTable = dt5,

						};


						PDFDeliveryChallan PDFdc = new PDFDeliveryChallan();
						byte[] pdfContent = null;

						pdfContent = PDFdc.DCPrint(data, NoOfCopies);



						switch (printType.ToLower())
						{
							case "mail":
								var base64PdfContent = Convert.ToBase64String(pdfContent);
								return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

							case "download":
								return File(pdfContent, "application/pdf", "Delivery Challan.pdf");

							case "preview":
								Response.Headers.Add("Content-Disposition", "inline; filename=Delivery Challan.pdf");
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

								string fileName = "DeliveryChallan_" + Guid.NewGuid().ToString() + ".pdf";
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
						return Json(new { success = false, message = "Expected number of tables not returned from stored procedure." });
					}
				}
			}
		}
	}
}
