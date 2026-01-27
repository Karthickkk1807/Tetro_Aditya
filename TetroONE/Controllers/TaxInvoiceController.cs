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
	[Route("Sale")]
	public class TaxInvoiceController : BaseController
	{
		public TaxInvoiceController(IConfiguration configuration) : base(configuration)
		{

		}
		public IActionResult TaxInvoice(int SaleId = 0)
		{
			return View(SaleId);
		}

        [Route("Quotation")]
        public IActionResult Quotation()
		{
			return View();
		}

        [Route("SaleOrder")]
        public IActionResult SaleOrder()
		{
			return View();
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
                FromDate = FromDate.AddDays(1),
                ToDate = ToDate.AddDays(1),
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetQuotationDetails]", request);
            return Json(response);
        }
		  
        [HttpPost]
        [Route("InsertUpdateQuotationDetails")]
        public async Task<IActionResult> InsertUpdateQuotationDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateQuotationDetails staticDetails = new InsertUpdateQuotationDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateQuotationDetails>(Request.Form["QuotationData"]);

            IFormFileCollection file = Request.Form.Files;
            List<AttachmentDetails> lstattachment = new List<AttachmentDetails>();
            DataTable dtattachment = new DataTable();

            foreach (var item in file)
            {
                var attachment = GetFilePath(item.FileName);
                lstattachment.Add(new AttachmentDetails()
                {
                    AttachmentExactFileName = item.FileName,
                    AttachmentFileName = attachment.Item1,
                    AttachmentFilePath = attachment.Item2,
                    ModuleName = "Quotation"
                });
            }

            bool isuploaded = await IsClaimAttachmentUploaded(file, lstattachment);
            foreach (var item in lstattachment)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }

            var exist = Request.Form["Exist"].ToList();
            if (exist != null && exist.Count > 0)
            {
                List<AttachmentDetails> lstexistattachment = ParseFormData(Request.Form["Exist"]);
                if (lstexistattachment.Any())
                {
                    lstattachment.AddRange(lstexistattachment);
                }
            }
            List<AttachmentDetails> lstdeleteattachment = new List<AttachmentDetails>();
            var deletedFile = Request.Form["DeletedFile"].ToList();
            if (deletedFile != null && deletedFile.Count > 0)
            {
                lstdeleteattachment = ParseFormData(Request.Form["DeletedFile"]);
                if (lstdeleteattachment.Any())
                {
                    lstattachment.AddRange(lstdeleteattachment);
                    lstattachment.RemoveAll(item1 => lstdeleteattachment.Any(item2 => item2.AttachmentId == item1.AttachmentId));
                }
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");

            List<QuotationColorMappingDetails>? QuotationColorMappingDetails1 = JsonConvert.DeserializeObject<List<QuotationColorMappingDetails>?>(Request.Form["QuotationColorMappingDetails"]);
            DataTable QuotationColorMappingDetails = GenericTetroONE.ToDataTable(QuotationColorMappingDetails1);

            List<QuotationProcessTypeMappingDetails>? QuotationProcessTypeMappingDetails1 = JsonConvert.DeserializeObject<List<QuotationProcessTypeMappingDetails>?>(Request.Form["QuotationProcessTypeMappingDetails"]);
            DataTable QuotationProcessTypeMappingDetails = GenericTetroONE.ToDataTable(QuotationProcessTypeMappingDetails1);

            var spName = string.Empty;
            if (staticDetails.QuotationId != null && staticDetails.QuotationId != 0)
            {
                spName = "[dbo].[USP_UpdateQuotationDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertQuotationDetails]";
            }

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@PlantId", staticDetails.PlantId);
                    command.Parameters.AddWithValue("@QuotationNo", staticDetails.QuotationNo);
                    command.Parameters.AddWithValue("@QuotationDate", staticDetails.QuotationDate);
                    command.Parameters.AddWithValue("@ClientId", staticDetails.ClientId);
                    command.Parameters.AddWithValue("@ValidTo", staticDetails.ValidTo);
                    command.Parameters.AddWithValue("@ReMarks", staticDetails.ReMarks);
                    command.Parameters.AddWithValue("@QuotationStatusId", staticDetails.QuotationStatusId); 
                     
                    command.Parameters.AddWithValue("@TVP_QuotationColorMappingDetails", QuotationColorMappingDetails);
                    command.Parameters.AddWithValue("@TVP_QuotationProcessTypeMappingDetails", QuotationProcessTypeMappingDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.QuotationId > 0)
                    {
                        command.Parameters.AddWithValue("@QuotationId", staticDetails.QuotationId); 
                    }

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);


                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
                connection.Close();

            }
            if (!response.Status)
            {
                foreach (var item in lstattachment)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\TetroOne\");
                    string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                                .Replace("..", "").Replace("/", "\\");
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }

            return Json(response);
        }

        [HttpGet]
        [Route("DeleteQuotationDetails")]
        public IActionResult DeleteQuotationDetails(int QuotationId)
        {
            DeleteQuotationDetails getInfo = new DeleteQuotationDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                QuotationId = QuotationId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteQuotationDetails]", getInfo);
            return Json(response);
        }
		 
        [HttpGet]
		[Route("GetSale")]
		public IActionResult GetSale(DateTime FromDate, DateTime ToDate, int FranchiseId)
		{
			GetSale request = new GetSale()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleId = null,
				FromDate = FromDate,
				ToDate = ToDate,
				FranchiseId = FranchiseId 
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetSaleDetails]", request);
			return Json(response);
		}
		 
		[HttpPost]
		[Route("InsertUpdateSale")]
		public async Task<IActionResult> InsertUpdateSale()
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
					ModuleName = "Sale"
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

			SaleDetailsStatic SaleDetailsStatic = JsonConvert.DeserializeObject<SaleDetailsStatic>(Request.Form["SaleDetailsStatic"]);
			List<SaleProductMappingDetails>? SaleProductMappingDetails = JsonConvert.DeserializeObject<List<SaleProductMappingDetails>?>(Request.Form["SaleProductMappingDetails"]);
			List<SaleOtherChargesMappingDetails>? SaleOtherChargesMappingDetails = JsonConvert.DeserializeObject<List<SaleOtherChargesMappingDetails>?>(Request.Form["SaleOtherChargesMappingDetails"]);

			DataTable dtproductData = new DataTable();
			dtproductData = GenericTetroONE.ToDataTable(SaleProductMappingDetails);

			DataTable dtOtherChargesData = new DataTable();
			dtOtherChargesData = GenericTetroONE.ToDataTable(SaleOtherChargesMappingDetails);



			InsertUpdateSale request = new InsertUpdateSale()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleId = SaleDetailsStatic.SaleId,
				FranchiseId = SaleDetailsStatic.FranchiseId,
				BillingFranchiseId = SaleDetailsStatic.BillingFranchiseId,
				BillFromFranchiseId = SaleDetailsStatic.BillFromFranchiseId,
				SaleDate = SaleDetailsStatic.SaleDate,
				SaleNo = SaleDetailsStatic.SaleNo,
				EstimateId = SaleDetailsStatic.EstimateId,
				ClientId = SaleDetailsStatic.ClientId,
				DeliveryChallanId = SaleDetailsStatic.DeliveryChallanId,
				DeliveryChallanDate = SaleDetailsStatic.DeliveryChallanDate,
				GoodsDeliveryDate = SaleDetailsStatic.GoodsDeliveryDate,
				EstimateDate = SaleDetailsStatic.EstimateDate,
				Notes = SaleDetailsStatic.Notes,
				SubTotal = SaleDetailsStatic.SubTotal,
				GrantTotal = SaleDetailsStatic.GrantTotal,
				RoundOffValue = SaleDetailsStatic.RoundOffValue,
				SaleStatusId = SaleDetailsStatic.SaleStatusId,
				TermsAndCondition = SaleDetailsStatic.TermsAndCondition,
				//TransporterId = SaleDetailsStatic.TransporterId,
				//TransportName = SaleDetailsStatic.TransportName,
				//ModeofTransport = SaleDetailsStatic.ModeofTransport,
				//Distance = SaleDetailsStatic.Distance,
				//TransportDocNo = SaleDetailsStatic.TransportDocNo,
				//TransportDocDate = SaleDetailsStatic.TransportDocDate,
				//VehicleNumber = SaleDetailsStatic.VehicleNumber,
				//VehicleType = SaleDetailsStatic.VehicleType, 
				//DocumentType = SaleDetailsStatic.DocumentType,
				//SupplyType = SaleDetailsStatic.SupplyType,
				//TransactionType = SaleDetailsStatic.TransactionType,
				//DispatchAddressId = SaleDetailsStatic.DispatchAddressId, 
				//ShippingAddressId = SaleDetailsStatic.ShippingAddressId,
				 

				TVP_Sale_ProductMappingDetails = dtproductData,
				TVP_PurchaseSaleOtherChargesMappingDetails = dtOtherChargesData,

				TVP_AttachmentDetails = dtattachment
			};

			if (SaleDetailsStatic.SaleId > 0)
				response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdateSaleDetails]", request);
			else
				response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertSaleDetails]", request, "SaleId");

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
		[Route("DeleteSaleDetails")]
		public IActionResult DeletePurchaseBillDetails(int SaleId)
		{ 
			DeleteSale getInfo = new DeleteSale()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleId = SaleId, 
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteSaleDetails]", getInfo);

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
		[Route("TaxInvoicePrint")]
		public IActionResult TaxInvoicePrint(int ModuleId, int ContactId, int NoOfCopies, string printType, int FranchiseId)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@ModuleName", "Sale");
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

						//string Irn = null;

						//if (dt13.Rows.Count > 0)
						//{
						//    Irn = dt13.Rows[0]["Irn"] != DBNull.Value ? Convert.ToString(dt13.Rows[0]["Irn"]) : null;
						//}

						var data = new TaxInvoicePrint
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
							ClientContactNumber = dt1.Rows[0]["ClientContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientContactNumber"]) : null,
							ClientGSTNumber = dt1.Rows[0]["ClientGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientGSTNumber"]) : null,
							ClientContactPersonName = dt1.Rows[0]["ContactPersonName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ContactPersonName"]) : null,
							ClientZipCode = dt1.Rows[0]["ClientZipCode"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientZipCode"]) : null,
							ClientState = dt1.Rows[0]["ClientState"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientState"]) : null,
							ClientCountry = dt1.Rows[0]["ClientCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientCountry"]) : null,

							//AltName = dt1.Rows[0]["AltName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltName"]) : null,
							//AltAddress = dt1.Rows[0]["AltAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltAddress"]) : null,
							//AltCity = dt1.Rows[0]["AltCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltCity"]) : null,
							//AltContactNumber = dt1.Rows[0]["AltContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltContactNumber"]) : null,

							SaleNumber = Convert.ToString(dt2.Rows[0]["SaleNo"]),
							SaleDate = Convert.ToString(dt2.Rows[0]["SaleDate"]),
                            GoodsDeliveryDate = Convert.ToString(dt2.Rows[0]["GoodsDeliveryDate"]),
                            //DeliveryChallanNumber = dt2.Rows[0]["DeliveryChallanNumber"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["DeliveryChallanNumber"]) : null,
                            //DeliveryChallanDate = Convert.ToString(dt2.Rows[0]["DeliveryChallanDate"]),
                            //EstimateNumber = Convert.ToString(dt2.Rows[0]["EstimateNumber"]),
                            //EstimateDate = Convert.ToString(dt2.Rows[0]["EstimateDate"]),
                            //ExpectedDeliveryDate = Convert.ToString(dt2.Rows[0]["ExpectedDeliveryDate"]),

                            //TotalProducts = Convert.ToString(dt4.Rows[0]["TotalProducts"]),
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
							Notes = dt7.Rows[0]["Notes"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Notes"]) : null,

							ProductTable = dt3,
							ProductOtherChargesTable = dt5,
						};

						//if (Irn != null)
						//{
						//    data.Irn = Irn;
						//    data.AckNo = dt13.Rows[0]["AckNo"] != null ? Convert.ToString(dt13.Rows[0]["AckNo"]) : null;
						//    data.AckDate = dt13.Rows[0]["AckDate"] != null ? Convert.ToString(dt13.Rows[0]["AckDate"]) : null;
						//    data.SignedInvoice = dt13.Rows[0]["SignedInvoice"] != null ? Convert.ToString(dt13.Rows[0]["SignedInvoice"]) : null;
						//    data.SignedQRCode = dt13.Rows[0]["SignedQRCode"] != null ? Convert.ToString(dt13.Rows[0]["SignedQRCode"]) : null;
						//    data.EwbNo = dt13.Rows[0]["EwbNo"] != null ? Convert.ToString(dt13.Rows[0]["EwbNo"]) : null;
						//    data.EwbDate = dt13.Rows[0]["EwbDate"] != null ? Convert.ToString(dt13.Rows[0]["EwbDate"]) : null;
						//    data.EwbValidTill = dt13.Rows[0]["EwbValidTill"] != null ? Convert.ToString(dt13.Rows[0]["EwbValidTill"]) : null;
						//    data.EInvoiceStatus = dt13.Rows[0]["EInvoiceStatus"] != null ? Convert.ToString(dt13.Rows[0]["EInvoiceStatus"]) : null;
						//}

						PDFTaxInvoice pdfService = new PDFTaxInvoice();
						byte[] pdfContent = null;

						pdfContent = pdfService.TaxInvoicePrint(data, NoOfCopies);

						switch (printType.ToLower())
						{
							case "mail":
								var base64PdfContent = Convert.ToBase64String(pdfContent);
								return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

							case "download":
								return File(pdfContent, "application/pdf", "TaxInvoice.pdf");

							case "preview":
								Response.Headers.Add("Content-Disposition", "inline; filename=TaxInvoice.pdf");
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

								string fileName = "Sale_" + Guid.NewGuid().ToString() + ".pdf";
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
		 
        [HttpGet]
        [Route("SaleOrderPrint")]
        public IActionResult SaleOrderPrint(int NoOfCopies, string printType)
        {
            PDFTaxInvoice pdfService = new PDFTaxInvoice();
            byte[] pdfContent = pdfService.SaleOrderPrintNew(NoOfCopies);

            switch (printType?.ToLower())
            {
                case "mail":
                    var base64PdfContent = Convert.ToBase64String(pdfContent);
                    return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                case "download":
                    return File(pdfContent, "application/pdf", "TaxInvoice.pdf");

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

                    string fileName = "TaxInvoice_" + Guid.NewGuid() + ".pdf";
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


        [HttpGet]
        [Route("QuotationPrint")]
        public IActionResult QuotationPrint(int ModuleId, int NoOfCopies, string printType)
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
                        command.Parameters.AddWithValue("@ModuleName", "Quotation");
                        command.Parameters.AddWithValue("@ModuleId", ModuleId);

                        command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
                        DataSet ds = new DataSet();

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(ds);
                        }

                        if (ds.Tables.Count >= 4)
                        {
                            DataTable dt1 = ds.Tables[0];
                            DataTable dt2 = ds.Tables[1];
                            DataTable dt3 = ds.Tables[2];
                            DataTable dt4 = ds.Tables[3]; 

                            // Check if dt1 has rows
                            if (dt1.Rows.Count > 0)
                            {
                                var data = new QuotationPrint
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
                                    Sir = dt1.Rows[0]["Sir"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Sir"]) : null,
                                    SirContent = dt1.Rows[0]["SirContent"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["SirContent"]) : null,
                                    FooterContent = dt1.Rows[0]["FooterContent"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["FooterContent"]) : null,

                                    ClientName = dt2.Rows[0]["ClientName"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["ClientName"]) : null,
                                    Address = dt2.Rows[0]["Address"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Address"]) : null,
                                    City = dt2.Rows[0]["City"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["City"]) : null,

                                    QuotationNo = dt3.Rows[0]["QuotationNo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["QuotationNo"]) : null,
                                    QuotationDate = dt3.Rows[0]["QuotationDate"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["QuotationDate"]) : null,
                                    Validity = dt3.Rows[0]["Validity"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["Validity"]) : null, 
									 
                                    ProductItemData = dt4,
                                };

                                string QuotationNo = dt3.Rows[0]["QuotationNo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["QuotationNo"]) : null;
                                string customFileName = $"Quotation_{QuotationNo}.pdf";

                                PDFQuotation pdfService = new PDFQuotation();
                                byte[] pdfContent = null;
                                pdfContent = pdfService.QuotationPrintPDF(NoOfCopies, data);

                                switch (printType.ToLower())
                                {
                                    case "mail":
                                        var base64PdfContent = Convert.ToBase64String(pdfContent);
                                        return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                                    case "download":
                                        return File(pdfContent, "application/pdf", "Quotation.pdf");

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

                                        string fileName = "OutWard" + Guid.NewGuid().ToString() + ".pdf";
                                        string filePath = Path.Combine(folderPath, fileName);

                                        //string fileName = "OutWard" + PurchaseOrderNumber + ".pdf";
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
		  
        [HttpGet]
		[Route("GetCreditLimitDetails")]
		public IActionResult GetCreditLimitDetails(int ModuleId, bool IsEdit, int clientId, int FranchiseId)
		{
			GetCreditLimitDetails request = new GetCreditLimitDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value), 
				ModuleId = ModuleId,
				IsEdit = IsEdit,
				ClientId = clientId,
				FranchiseId = FranchiseId 
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetCreditLimitDetails]", request);
			return Json(response);
		}




        private (string, string) GetFilePath(string reqfilename)
        {
            string guid = Guid.NewGuid().ToString();

            string relativePath = Path.Combine("TetroOne");
            string fileName = guid + "@@" + reqfilename;
            string relativeFilePath = "..\\" + relativePath + "\\" + fileName;
            relativeFilePath = relativeFilePath.Replace("\\", "/");
            return (fileName, relativeFilePath);
        }

        private async Task<bool> IsClaimAttachmentUploaded(IFormFileCollection file, List<AttachmentDetails> lstattachment)
        {
            bool isuploaded = false;

            foreach (var item in file)
            {
                var filenameInfo = lstattachment.FirstOrDefault(x => x.AttachmentExactFileName == item.FileName);
                if (filenameInfo != null)
                {
                    var filename = filenameInfo.AttachmentFileName;
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\TetroOne\");
                    var filePath = Path.Combine(directoryPath, filename);

                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await item.CopyToAsync(stream);
                    }
                }
            }
            isuploaded = true;

            return isuploaded;
        }

        private List<AttachmentDetails> ParseFormData(string formData)
        {
            List<AttachmentDetails> existList = JsonConvert.DeserializeObject<List<AttachmentDetails>>(formData);
            return existList;

        }

    }
}