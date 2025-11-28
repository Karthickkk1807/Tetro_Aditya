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
	[Route("Estimate")]
	public class QuotationController : BaseController
	{
		public QuotationController(IConfiguration configuration) : base(configuration)
		{

		}
		public IActionResult Estimate(int EstimateId = 0)
		{
			return View(EstimateId);
		}
		  
		[HttpGet]
		[Route("GetQuotation")]
		public IActionResult GetQuotation(int? QuotationId, int PlantId, DateTime FromDate, DateTime ToDate)
		{
            GetQuotation request = new GetQuotation()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                QuotationId = QuotationId == 0 ? null : QuotationId,
                PlantId = PlantId,
                FromDate = FromDate,
                ToDate = ToDate
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetQuotationDetails]", request);
			return Json(response);
		}
		 
		[HttpGet]
		[Route("DeleteEstimateDetails")]
		public IActionResult DeleteEstimateDetails(int EstimateId)
		{
			DeleteEstimate getInfo = new DeleteEstimate()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				EstimateId = EstimateId, 
			};
			 
			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteEstimateDetails_1]", getInfo);

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
		[Route("EstimatePrint")]
		public IActionResult EstimatePrint(int ModuleId, int ContactId, int NoOfCopies, string printType, int FranchiseId)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@ModuleName", "Estimate");
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

					if (ds.Tables.Count >= 6)
					{
						DataTable dt1 = ds.Tables[0];
						DataTable dt2 = ds.Tables[1];
						DataTable dt3 = ds.Tables[2];
						DataTable dt4 = ds.Tables[3];
						DataTable dt5 = ds.Tables[4];
						DataTable dt6 = ds.Tables[5];
						DataTable dt7 = ds.Tables[6];

						var data = new EstimatePrint
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

							//AltName = dt1.Rows[0]["AltName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltName"]) : null,
							//AltAddress = dt1.Rows[0]["AltAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltAddress"]) : null,
							//AltCity = dt1.Rows[0]["AltCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltCity"]) : null,
							//StateName = dt1.Rows[0]["StateName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["StateName"]) : null,
							//AltContactNumber = dt1.Rows[0]["AltContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltContactNumber"]) : null,

							EstimateNumber = Convert.ToString(dt2.Rows[0]["EstimateNo"]),
							Date = Convert.ToString(dt2.Rows[0]["EstimateDate"]),


							//TotalProduct = Convert.ToString(dt4.Rows[0]["TotalProduct"]),
							//TotalDiscount = Convert.ToString(dt4.Rows[0]["TotalDiscount"]),
							//CGST = Convert.ToString(dt4.Rows[0]["CGST"]),
							//SGST = Convert.ToString(dt4.Rows[0]["SGST"]),
							//SubTotal = Convert.ToString(dt4.Rows[0]["SubTotal"]),

							RoundOffValue = Convert.ToString(dt4.Rows[0]["RoundOffValue"]),
							GrantTotal = Convert.ToString(dt4.Rows[0]["GrantTotal"]),


							Amount_InWords = dt6.Rows[0]["Amount_InWords"] != DBNull.Value ? Convert.ToString(dt6.Rows[0]["Amount_InWords"]) : null,

							AccountName = Convert.ToString(dt1.Rows[0]["AccountName"]),
							AccountNumber = Convert.ToString(dt1.Rows[0]["AccountNumber"]),
							IFSCCode = Convert.ToString(dt1.Rows[0]["IFSCCode"]),
							BankName = Convert.ToString(dt1.Rows[0]["BankName"]),
							UPIId = Convert.ToString(dt1.Rows[0]["UPIId"]),
							BranchName = Convert.ToString(dt1.Rows[0]["BranchName"]),

							TermsAndCondition = Convert.ToString(dt7.Rows[0]["TermsAndCondition"]),
							Signature = dt7.Rows[0]["Signature"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Signature"]) : null,
							Notes = dt7.Rows[0]["Notes"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Notes"]) : "",


							ProductItemTable = dt3,
							ProductOtherChargesTable = dt5,

						};
						PDFEstimate pdfestimate = new PDFEstimate();

						byte[] pdfContent = null;

						pdfContent = pdfestimate.EstimatePrint(data, NoOfCopies);


						switch (printType.ToLower())
						{
							case "mail":
								var base64PdfContent = Convert.ToBase64String(pdfContent);
								return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

							case "download":
								return File(pdfContent, "application/pdf", "PurchaseOrder.pdf");

							case "preview":
								Response.Headers.Add("Content-Disposition", "inline; filename=PurchaseOrder.pdf");
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

								string fileName = "Estimate_" + Guid.NewGuid().ToString() + ".pdf";
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
