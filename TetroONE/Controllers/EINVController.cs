using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
	public class EINVController : BaseController
	{
		public EINVController(IConfiguration configuration) : base(configuration)
		{

		}
		public IActionResult Index()
		{
			return View();
		}

		[HttpGet]
		[Route("GetEInvoice")]
		public IActionResult GetEInvoice()
		{
			GetEInvoice request = new GetEInvoice()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				EInvoiceResponseId = null,
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEInvoiceResponseDetails]", request);
			return Json(response);
		}


		[HttpPost]
		[Route("PrintEInvoice")]
		public IActionResult PrintEInvoice([FromBody] PrintEInvoiceRequest request)
		{
			int SaleId = request.SaleId;

			int LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

			DataSet ds = new DataSet();

			try
			{

				using (SqlConnection connection = new SqlConnection(_connectionString))
				{
					connection.Open();
					using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintDetails_EwayBill]", connection))
					{
						command.CommandType = CommandType.StoredProcedure;

						command.Parameters.AddWithValue("@LoginUserId", LoginUserId);
						command.Parameters.AddWithValue("@SaleId", SaleId);


						// Add output parameters
						command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
						command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

						SqlDataAdapter adapter = new SqlDataAdapter(command);
						adapter.Fill(ds);

						if (ds.Tables.Count >= 2)
						{
							DataTable TableResult1 = ds.Tables[0];
							DataTable TableResult2 = ds.Tables[1];
							DataTable TableResult3 = ds.Tables[2];

							if (TableResult1.Rows.Count > 0)
							{
								var EWayData = new PrintEInvoice()
								{
									EWayBillNo = TableResult1.Rows[0]["EWayBillNo"] != DBNull.Value ? Convert.ToString(TableResult1.Rows[0]["EWayBillNo"]) : null,
									EWayBillDate = TableResult1.Rows[0]["EWayBillDate"] != DBNull.Value ? Convert.ToString(TableResult1.Rows[0]["EWayBillDate"]) : null,
									GeneratedBy = TableResult1.Rows[0]["GeneratedBy"] != DBNull.Value ? Convert.ToString(TableResult1.Rows[0]["GeneratedBy"]) : null,
									VaildFrom = TableResult1.Rows[0]["VaildFrom"] != DBNull.Value ? Convert.ToString(TableResult1.Rows[0]["VaildFrom"]) : null,
									ValidUntil = TableResult1.Rows[0]["ValidUntil"] != DBNull.Value ? Convert.ToString(TableResult1.Rows[0]["ValidUntil"]) : null,

									GSTINofSupplier = TableResult2.Rows[0]["GSTINofSupplier"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["GSTINofSupplier"]) : null,
									PlaceofDispatch = TableResult2.Rows[0]["PlaceofDispatch"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["PlaceofDispatch"]) : null,
									GSTINofRecipient = TableResult2.Rows[0]["GSTINofRecipient"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["GSTINofRecipient"]) : null,
									PlaceofDelivery = TableResult2.Rows[0]["PlaceofDelivery"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["PlaceofDelivery"]) : null,
									DocumentNo = TableResult2.Rows[0]["DocumentNo"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["DocumentNo"]) : null,
									DocumentDate = TableResult2.Rows[0]["DocumentDate"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["DocumentDate"]) : null,
									TransactionType = TableResult2.Rows[0]["TransactionType"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["TransactionType"]) : null,
									ValueofGoods = TableResult2.Rows[0]["ValueofGoods"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["ValueofGoods"]) : null,
									HSNCode = TableResult2.Rows[0]["HSNCode"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["HSNCode"]) : null,
									ReasonforTransportation = TableResult2.Rows[0]["ReasonforTransportation"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["ReasonforTransportation"]) : null,
									Transporter = TableResult2.Rows[0]["Transporter"] != DBNull.Value ? Convert.ToString(TableResult2.Rows[0]["Transporter"]) : null,

									Mode = TableResult3.Rows[0]["Mode"] != DBNull.Value ? Convert.ToString(TableResult3.Rows[0]["Mode"]) : null,
									VehicleTransDocNoDt = TableResult3.Rows[0]["VehicleTransDocNoDt"] != DBNull.Value ? Convert.ToString(TableResult3.Rows[0]["VehicleTransDocNoDt"]) : null,
									From = TableResult3.Rows[0]["From"] != DBNull.Value ? Convert.ToString(TableResult3.Rows[0]["From"]) : null,
									EnteredDate = TableResult3.Rows[0]["EnteredDate"] != DBNull.Value ? Convert.ToString(TableResult3.Rows[0]["EnteredDate"]) : null,
									EnteredBy = TableResult3.Rows[0]["EnteredBy"] != DBNull.Value ? Convert.ToString(TableResult3.Rows[0]["EnteredBy"]) : null,
									CEWBNo = TableResult3.Rows[0]["CEWBNo"] != DBNull.Value ? Convert.ToString(TableResult3.Rows[0]["CEWBNo"]) : null,
									MultiVeh = TableResult3.Rows[0]["MultiVeh"] != DBNull.Value ? Convert.ToString(TableResult3.Rows[0]["MultiVeh"]) : null,
								};

								PDFEWayBill pdfService = new PDFEWayBill();
								byte[] pdfContent = null;

								pdfContent = pdfService.EWayBillPrint(EWayData);
								Response.Headers.Add("Content-Disposition", "inline; filename=E-waybill.pdf");
								return File(pdfContent, "application/pdf");
							}
						}
					}
				}

			}
			catch (Exception error)
			{
				return Json(error);
				Console.WriteLine("An error occurred: " + error.Message);
			}
			return Json(null);
		}

		[HttpGet]
		[Route("EInvoicePrint")]
		public IActionResult TaxInvoicePrint(int ModuleId, int NoOfCopies)
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
						command.Parameters.AddWithValue("@ModuleName", "Sales");
						command.Parameters.AddWithValue("@ModuleId", ModuleId);
						command.Parameters.AddWithValue("@ContactId", DBNull.Value);
						command.Parameters.AddWithValue("@IsStore", DBNull.Value);
						command.Parameters.AddWithValue("@ShippingAddressId", DBNull.Value);
						command.Parameters.AddWithValue("@IsSameAddress", DBNull.Value);
						command.Parameters.AddWithValue("@MobileNumber", DBNull.Value);
						command.Parameters.AddWithValue("@CustomerName", DBNull.Value);


						command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
						command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
						DataSet ds = new DataSet();

						using (SqlDataAdapter adapter = new SqlDataAdapter(command))
						{
							adapter.Fill(ds);
						}

						if (ds.Tables.Count >= 10)
						{
							DataTable dt1 = ds.Tables[0];
							DataTable dt2 = ds.Tables[1];
							DataTable dt3 = ds.Tables[2];
							DataTable dt4 = ds.Tables[3];
							DataTable dt5 = ds.Tables[4];
							DataTable dt6 = ds.Tables[5];
							DataTable dt7 = ds.Tables[6];
							DataTable dt8 = ds.Tables[7];
							DataTable dt9 = ds.Tables[8];
							DataTable dt10 = ds.Tables[9];
							DataTable dt11 = ds.Tables[10];
							DataTable dt12 = ds.Tables[11];
							DataTable dt13 = ds.Tables[12];

							// Check if required tables have rows
							if (dt1.Rows.Count == 0) return Json(new { success = false, message = "No company or client information found." });
							if (dt2.Rows.Count == 0) return Json(new { success = false, message = "No Inoice information found." });
							if (dt3.Rows.Count == 0) return Json(new { success = false, message = "No product information found." });
							if (dt4.Rows.Count == 0) return Json(new { success = false, message = "No totals or discounts information found." });
							if (dt6.Rows.Count == 0) return Json(new { success = false, message = "No round-off or grant total information found." });
							if (dt7.Rows.Count == 0) return Json(new { success = false, message = "No amount in words information found." });
							if (dt9.Rows.Count == 0) return Json(new { success = false, message = "No data found." });
							if (dt10.Rows.Count == 0) return Json(new { success = false, message = "No terms and conditions or signature information found." });
							if (dt11.Rows.Count == 0) return Json(new { success = false, message = "No terms and conditions or signature information found." });
							if (dt12.Rows.Count == 0) return Json(new { success = false, message = "No Product data found." });

							string Irn = null;

							if (dt13.Rows.Count > 0)
							{
								Irn = dt13.Rows[0]["Irn"] != DBNull.Value ? Convert.ToString(dt13.Rows[0]["Irn"]) : null;
							}

							var data = new TaxInvoicePrint
							{

								CompanyName = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null,
								CompanyLogo = dt1.Rows[0]["CompanyLogo"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyLogo"]) : null,
								CompanyAddress = dt1.Rows[0]["CompanyAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyAddress"]) : null,
								CompanyCity = dt1.Rows[0]["CompanyCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyCity"]) : null,
								CompanyCountry = dt1.Rows[0]["CompanyCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyCountry"]) : null,
								CompanyGSTNumber = dt1.Rows[0]["CompanyGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyGSTNumber"]) : null,
								CompanyContactNumber = dt1.Rows[0]["CompanyContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyContactNumber"]) : null,
								CompanyEmail = dt1.Rows[0]["CompanyEmail"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyEmail"]) : null,
								CompanyWebsite = dt1.Rows[0]["CompanyWebsite"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyWebsite"]) : null,

								ClientName = dt1.Rows[0]["ClientName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientName"]) : null,
								ClientAddress = dt1.Rows[0]["ClientAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientAddress"]) : null,
								ClientCity = dt1.Rows[0]["ClientCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientCity"]) : null,
								ClientContactNumber = dt1.Rows[0]["ClientContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientContactNumber"]) : null,
								ClientGSTNumber = dt1.Rows[0]["ClientGSTNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientGSTNumber"]) : null,
								ClientContactPersonName = dt1.Rows[0]["ClientContactPersonName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientContactPersonName"]) : null,
								ClientZipCode = dt1.Rows[0]["ClientZipCode"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientZipCode"]) : null,
								ClientState = dt1.Rows[0]["ClientState"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientState"]) : null,
								ClientCountry = dt1.Rows[0]["ClientCountry"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ClientCountry"]) : null,

								AltName = dt1.Rows[0]["AltName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltName"]) : null,
								AltAddress = dt1.Rows[0]["AltAddress"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltAddress"]) : null,
								AltCity = dt1.Rows[0]["AltCity"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltCity"]) : null,
								AltContactNumber = dt1.Rows[0]["AltContactNumber"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["AltContactNumber"]) : null,

								SaleNumber = Convert.ToString(dt2.Rows[0]["SaleNumber"]),
								SaleDate = Convert.ToString(dt2.Rows[0]["SaleDate"]),
								DeliveryChallanNumber = dt2.Rows[0]["DeliveryChallanNumber"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["DeliveryChallanNumber"]) : null,
								DeliveryChallanDate = Convert.ToString(dt2.Rows[0]["DeliveryChallanDate"]),
								EstimateNumber = Convert.ToString(dt2.Rows[0]["EstimateNumber"]),
								EstimateDate = Convert.ToString(dt2.Rows[0]["EstimateDate"]),
								ExpectedDeliveryDate = Convert.ToString(dt2.Rows[0]["ExpectedDeliveryDate"]),

								TotalProducts = Convert.ToString(dt4.Rows[0]["TotalProducts"]),
								TotalDiscount = Convert.ToString(dt4.Rows[0]["TotalDiscount"]),
								CGST = Convert.ToString(dt4.Rows[0]["CGST"]),
								SGST = Convert.ToString(dt4.Rows[0]["SGST"]),
								SubTotal = Convert.ToString(dt4.Rows[0]["SubTotal"]),

								RoundOffValue = Convert.ToString(dt6.Rows[0]["RoundOffValue"]),
								GrantTotal = Convert.ToString(dt6.Rows[0]["GrantTotal"]),

								Amount_InWords = dt7.Rows[0]["Amount_InWords"] != DBNull.Value ? Convert.ToString(dt7.Rows[0]["Amount_InWords"]) : null,

								AccountName = Convert.ToString(dt9.Rows[0]["AccountName"]),
								AccountNumber = Convert.ToString(dt9.Rows[0]["AccountNumber"]),
								IFSCCode = Convert.ToString(dt9.Rows[0]["IFSCCode"]),
								BankName = Convert.ToString(dt9.Rows[0]["BankName"]),
								UPIId = Convert.ToString(dt9.Rows[0]["UPIId"]),
								BranchName = Convert.ToString(dt9.Rows[0]["BranchName"]),

								TermsAndCondition = Convert.ToString(dt10.Rows[0]["TermsAndCondition"]),
								Signature = Convert.ToString(dt10.Rows[0]["Signature"]),

								BackroundColour = dt11.Rows[0]["BackroundColour"] != DBNull.Value ? Convert.ToString(dt11.Rows[0]["BackroundColour"]) : null,
								TextColour = dt11.Rows[0]["TextColour"] != DBNull.Value ? Convert.ToString(dt11.Rows[0]["TextColour"]) : null,

								ProductTable = dt12,
								ProductOtherChargesTable = dt5,
								OtherChargesTaxTable = dt8,
								ProductItemTableNew = dt3,

							};

							if (Irn != null)
							{
								data.Irn = Irn;
								data.AckNo = dt13.Rows[0]["AckNo"] != null ? Convert.ToString(dt13.Rows[0]["AckNo"]) : null;
								data.AckDate = dt13.Rows[0]["AckDate"] != null ? Convert.ToString(dt13.Rows[0]["AckDate"]) : null;
								data.SignedInvoice = dt13.Rows[0]["SignedInvoice"] != null ? Convert.ToString(dt13.Rows[0]["SignedInvoice"]) : null;
								data.SignedQRCode = dt13.Rows[0]["SignedQRCode"] != null ? Convert.ToString(dt13.Rows[0]["SignedQRCode"]) : null;
								data.EwbNo = dt13.Rows[0]["EwbNo"] != null ? Convert.ToString(dt13.Rows[0]["EwbNo"]) : null;
								data.EwbDate = dt13.Rows[0]["EwbDate"] != null ? Convert.ToString(dt13.Rows[0]["EwbDate"]) : null;
								data.EwbValidTill = dt13.Rows[0]["EwbValidTill"] != null ? Convert.ToString(dt13.Rows[0]["EwbValidTill"]) : null;
								data.EInvoiceStatus = dt13.Rows[0]["EInvoiceStatus"] != null ? Convert.ToString(dt13.Rows[0]["EInvoiceStatus"]) : null;
							}

							PDFTaxInvoice pdfService = new PDFTaxInvoice();
							byte[] pdfContent = null;

							pdfContent = pdfService.TaxInvoicePrint(data, NoOfCopies);

							Response.Headers.Add("Content-Disposition", "inline; filename=TaxInvoice.pdf");
							return File(pdfContent, "application/pdf");

						}
						else
						{
							return Json(new { success = false, message = "Expected number of tables not returned from stored procedure." });
						}
					}
				}
			}

			catch (Exception error)
			{
				return Json(error);
				Console.WriteLine("An error occurred: " + error.Message);
			}
		}
	}
}