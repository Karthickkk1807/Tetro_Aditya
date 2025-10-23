using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Globalization;
using System.Net;
using System.Security.Claims;
using System.Text;
using TetroONE.Models;

namespace TetroONE.Controllers
{
	public class EInvoiceController : BaseController
	{
		public EInvoiceController(IConfiguration configuration) : base(configuration)
		{

		}

		[HttpPost]
		[Route("GenerateEInvoice")]
		public async Task<IActionResult> GenerateEInvoice([FromBody] GetTokenRequest request)
		{

			try
			{
				if (request == null || string.IsNullOrEmpty(request.email))
				{
					return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
				}

				if (request.SaleId == 0)
				{
					return BadRequest(new { isSuccess = false, message = "Failed to retrieve sale details" });
				}

				var saleResponse = GetSaleDetails(request.SaleId, request.IsSale); // Replace with actual values

				if (saleResponse == null)
				{
					return BadRequest(new { isSuccess = false, message = "Failed to retrieve sale details" });
				}

				DataTable SecondTable = saleResponse.Tables.Count > 1 ? saleResponse.Tables[1] : null;
				DataRow SecondTableRow = (SecondTable != null && SecondTable.Rows.Count > 0) ? SecondTable.Rows[0] : null;

				DataTable FifthTable = saleResponse.Tables.Count > 4 ? saleResponse.Tables[4] : null;
				DataRow FifthTableRow = (FifthTable != null && FifthTable.Rows.Count > 0) ? FifthTable.Rows[0] : null;

				DataTable SixthTable = saleResponse.Tables.Count > 5 ? saleResponse.Tables[5] : null;
				DataRow SixthTableRow = (SixthTable != null && SixthTable.Rows.Count > 0) ? SixthTable.Rows[0] : null;

				DataTable SeventhTable = saleResponse.Tables.Count > 6 ? saleResponse.Tables[6] : null;
				DataRow SeventhTableRow = (SeventhTable != null && SeventhTable.Rows.Count > 0) ? SeventhTable.Rows[0] : null;

				DataTable EightTable = saleResponse.Tables.Count > 7 ? saleResponse.Tables[7] : null;
				DataRow EightTableRow = (EightTable != null && EightTable.Rows.Count > 0) ? EightTable.Rows[0] : null;

				DataTable NinethTable = saleResponse.Tables.Count > 8 ? saleResponse.Tables[8] : null;
				DataRow NinethTableRow = (NinethTable != null && NinethTable.Rows.Count > 0) ? NinethTable.Rows[0] : null;

				DataTable TenthTable = saleResponse.Tables.Count > 9 ? saleResponse.Tables[9] : null;
				DataRow TenthTableRow = (TenthTable != null && TenthTable.Rows.Count > 0) ? TenthTable.Rows[0] : null;

				DataTable EleventhTable = saleResponse.Tables.Count > 10 ? saleResponse.Tables[10] : null;
				DataRow EleventhTableRow = (EleventhTable != null && EleventhTable.Rows.Count > 0) ? EleventhTable.Rows[0] : null;

				DataTable TwelthTable = saleResponse.Tables.Count > 11 ? saleResponse.Tables[11] : null;
				DataRow TwelthTableRow = (TwelthTable != null && TwelthTable.Rows.Count > 0) ? TwelthTable.Rows[0] : null;

				DataTable ThirteenTable = saleResponse.Tables.Count > 12 ? saleResponse.Tables[12] : null;
				DataRow ThirteenTableRow = (ThirteenTable != null && ThirteenTable.Rows.Count > 0) ? ThirteenTable.Rows[0] : null;

				var sno = 0;
				// Extract the first table from the dataset
				DataTable FirstTable = saleResponse.Tables[0];

				// Initialize the item list dynamically
				List<Item> itemList = new List<Item>();

				foreach (DataRow row in FirstTable.Rows)
				{
					itemList.Add(new Item
					{
						SlNo = (sno + 1).ToString(),
						IsServc = "N", // Assuming "N" for all items; modify if necessary
						PrdDesc = row["ProductName"].ToString(),
						HsnCd = row["HSNCode"].ToString(),
						Barcde = row["Barcode"].ToString(),
						BchDtls = new BchDtls
						{
							Nm = row["BatchNumber"].ToString(),
							Expdt = ConvertToEInvoiceDateFormat(row["ExpiryDate"].ToString()),
							WrDt = ConvertToEInvoiceDateFormat(row["ExpiryDate"].ToString())
						},
						Qty = Convert.ToDouble(row["Quantity"]),
						FreeQty = 0,
						Unit = row["PrimaryUnitDescription"].ToString(),
						UnitPrice = Convert.ToDouble(row["Price"]),
						TotAmt = Math.Round(Convert.ToDouble(row["Price"]) * Convert.ToDouble(row["Quantity"]), 2),
						Discount = Math.Round((Convert.ToDouble(row["Price"]) * Convert.ToDouble(row["Quantity"])) - Convert.ToDouble(row["TaxableAmount"]), 2),
						PreTaxVal = 0,
						AssAmt = Math.Round(Convert.ToDouble(row["TaxableAmount"]), 2),
						GstRt = Math.Round(Convert.ToDouble(row["GSTPercentage"]), 2),
						SgstAmt = Math.Round(((Convert.ToDouble(row["TaxableAmount"]) / 100) * Convert.ToDouble(row["GSTPercentage"])) / 2, 2),
						IgstAmt = 0,
						CgstAmt = Math.Round(((Convert.ToDouble(row["TaxableAmount"]) / 100) * Convert.ToDouble(row["GSTPercentage"])) / 2, 2),
						CesRt = Math.Round(Convert.ToDouble(row["CESSPercentage"]), 2),
						CesAmt = Math.Round(Convert.ToDouble(row["CESSAdAmount"]), 2),
						CesNonAdvlAmt = Math.Round(Convert.ToDouble(row["CESSNonAdAmount"]), 2),
						StateCesRt = Math.Round(Convert.ToDouble(row["StateCESSPercentage"]), 2),
						StateCesAmt = Math.Round(Convert.ToDouble(row["StateCESSAdAmount"]), 2),
						StateCesNonAdvlAmt = Math.Round(Convert.ToDouble(row["StateCESSNonAdAmount"]), 2),
						OthChrg = 0,
						TotItemVal = Math.Round(Convert.ToDouble(row["TotalItemValue"]), 2),
						OrdLineRef = null,
						OrgCntry = null,
						PrdSlNo = null,
						AttribDtls = new List<AttribDtls>
		{
			new AttribDtls
			{
				Nm = null,
				Val = null
			}
		}
					});
				}

				var InvoiceDataResponse1 = new InvoiceData
				{
					Version = "1.1",

					TranDtls = new TranDtls
					{
						TaxSch = "GST",
						SupTyp = SecondTableRow["SupplyType"].ToString(),
						RegRev = "N",
						EcmGstin = null,
						IgstOnIntra = "N"
					},

					DocDtls = new DocDtls
					{
						Typ = "INV",
						No = GetValueOrDefault(SecondTableRow, "SaleNumber", string.Empty),
						Dt = ConvertToEInvoiceDateFormat(GetValueOrDefault(SecondTableRow, "SaleDate", string.Empty)),

					},

					SellerDtls = new SellerDtls
					{
						Gstin = SeventhTableRow["GSTNumber"].ToString(),
						LglNm = SeventhTableRow["CompanyName"].ToString(),
						TrdNm = SeventhTableRow["CompanyName"].ToString(),
						Addr1 = SeventhTableRow["CompanyAddress"].ToString(),
						Addr2 = null,
						Loc = SeventhTableRow["CompanyCity"].ToString(),
						Pin = Convert.ToInt32(SeventhTableRow["CompanyZipCode"]),
						Stcd = SeventhTableRow["StateId"].ToString(),
						Ph = SeventhTableRow["CompanyContactNumber"].ToString(),
						Em = SeventhTableRow["CompanyEmail"].ToString()
					},

					BuyerDtls = new BuyerDtls
					{
						Gstin = EightTableRow["GSTNumber"].ToString(),
						LglNm = EightTableRow["ClientName"].ToString(),
						TrdNm = EightTableRow["ClientName"].ToString(),
						Pos = EightTableRow["StateId"].ToString(),
						Addr1 = EightTableRow["Address"].ToString(),
						Addr2 = null,
						Loc = EightTableRow["City"].ToString(),
						Pin = Convert.ToInt32(EightTableRow["ZipCode"]),
						Stcd = EightTableRow["StateId"].ToString(),
						Ph = EightTableRow["ContactNumber"].ToString(),
						Em = EightTableRow["Email"].ToString(),
					},

					DispDtls = new DispDtls
					{
						Nm = ThirteenTableRow["DispatchName"].ToString(),
						Addr1 = ThirteenTableRow["DispatchAddress"].ToString(),
						Addr2 = null,
						Loc = ThirteenTableRow["DispatchCity"].ToString(),
						Pin = Convert.ToInt32(ThirteenTableRow["DispatchZipCode"]),
						Stcd = ThirteenTableRow["DispatchStateCode"].ToString(),
					},

					ShipDtls = new ShipDtls
					{
						Gstin = EightTableRow["GSTNumber"].ToString(),
						LglNm = NinethTableRow["ShippingName"].ToString(),
						TrdNm = NinethTableRow["ShippingName"].ToString(),
						Addr1 = NinethTableRow["ShippingAddress"].ToString(),
						Addr2 = null,
						Loc = NinethTableRow["ShippingCity"].ToString(),
						Pin = Convert.ToInt32(NinethTableRow["ShippingZipCode"]),
						Stcd = NinethTableRow["ShippingStateCodeId"].ToString(),
					},

					ItemList = itemList,

					ValDtls = new ValDtls
					{
						AssVal = (double)Convert.ToDouble(TenthTableRow["TotalTaxableAmount"]),
						CgstVal = (double)Convert.ToDouble(TenthTableRow["TotalCGSTAmount"]),
						SgstVal = (double)Convert.ToDouble(TenthTableRow["TotalSGSTAmount"]),
						IgstVal = (double)Convert.ToDouble(TenthTableRow["TotalIGSTAmount"]),
						CesVal = (double)Convert.ToDouble(TenthTableRow["TotalCessAmount"]),
						StCesVal = (double)Convert.ToDouble(TenthTableRow["TotalStateCessAmount"]),
						Discount = (double)Convert.ToDouble(EleventhTableRow["TotalDiscount"]),
						OthChrg = (double)Convert.ToDouble(TwelthTableRow["TotalOtherCharges"]),
						RndOffAmt = (double)Convert.ToDouble(SecondTableRow["RoundOffValue"]),
						TotInvVal = (double)Convert.ToDouble(SecondTableRow["GrantTotal"]),
						TotInvValFc = (double)Convert.ToDouble(SecondTableRow["GrantTotal"]),
					},

					PayDtls = new PayDtls
					{
						Nm = SeventhTableRow["AccountName"].ToString(),
						Accdet = SeventhTableRow["AccountNumber"].ToString(),
						Mode = "Cash",
						Fininsbr = SeventhTableRow["IFSCCode"].ToString(),
						Payterm = null,
						Payinstr = null,
						Crtrn = null,
						Dirdr = null,
						Crday = Convert.ToInt32(SecondTableRow["PaidFromValue"]),
						Paidamt = (double)Convert.ToDouble(SecondTableRow["GrantTotal"]) - (double)Convert.ToDouble(SecondTableRow["BalanceAmount"]),
						Paymtdue = (double)Convert.ToDouble(SecondTableRow["BalanceAmount"])
					},

					RefDtls = new RefDtls
					{
						InvRm = SecondTableRow["Notes"].ToString(),
						DocPerdDtls = new DocPerdDtls
						{
							InvStDt = DateTime.Now.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
							InvEndDt = DateTime.Now.AddDays(30).ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
						},
						PrecDocDtls = new List<PrecDocDtls>
		{
			new PrecDocDtls
			{
				InvNo = GetValueOrDefault(SecondTableRow, "SaleNumber", string.Empty),
				InvDt = ConvertToEInvoiceDateFormat(GetValueOrDefault(SecondTableRow, "SaleDate", string.Empty)),
				OthRefNo = "Reference"
			}
		},
						ContrDtls = new List<ContrDtls>
		{
			new ContrDtls
			{
				RecAdvRefr = null,
				RecAdvDt = null,
				Tendrefr = null,
				Contrrefr = null,
				Extrefr = null,
				Projrefr = null,
				Porefr = null,
				PoRefDt = null
			}
		}
					},

					AddlDocDtls = new List<AddlDocDtls>
	{
		new AddlDocDtls
		{
			Url = null,
			Docs = null,
			Info = null
		}
	},

					ExpDtls = new ExpDtls
					{
						ShipBNo = null,
						ShipBDt = null,
						Port = null,
						RefClm = null,
						ForCur = null,
						CntCode = null
					},

					EwbDtls = new EwbDtls
					{
						Transid = null,
						Transname = null,
						Distance = null,
						Transdocno = null,
						TransdocDt = null,
						Vehno = null,
						Vehtype = null,
						TransMode = null
					}
				};

				// Clean the requestedInvoiceData by removing properties with null values
				var InvoiceDataResponse = CleanNullProperties(InvoiceDataResponse1);

				// Step 1: Get Authentication Token
				var tokenResponse = await GetAuthenticationToken(request);

				if (tokenResponse == null)
				{
					return BadRequest(new { isSuccess = false, message = "Failed to retrieve authentication token" });
				}

				string InvoiceData = JsonConvert.SerializeObject(InvoiceDataResponse);
				// Step 2: If token retrieval is successful, use it to get the IRN response
				var irnResponse = await GetIRNByToken(request, tokenResponse.AuthToken, InvoiceData);

				if (irnResponse.IsSuccess && Convert.ToInt32(SecondTableRow["SaleId"]) > 0)
				{
					var InsertIRNResponse = InsertEInvoiceResponseDetails(irnResponse, Convert.ToInt32(SecondTableRow["SaleId"]));
					return Ok(irnResponse);
				}

				else
				{
					return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = irnResponse });
				}
			}
			catch (Exception ex)
			{
				return BadRequest(new { isSuccess = false, message = $"Error: {ex.Message}" });
			}
		}

		private T GetValueOrDefault<T>(DataRow row, string columnName, T defaultValue = default)
		{
			return row.Table.Columns.Contains(columnName) && row[columnName] != DBNull.Value
				? (T)Convert.ChangeType(row[columnName], typeof(T))
				: defaultValue;
		}

		public static string ConvertToEInvoiceDateFormat(string inputDate)
		{
			// Define possible formats for input date
			string[] formats = { "MM/dd/yy HH:mm:ss", "yyyy-MM-dd", "dd/MM/yyyy", "yyyy/MM/dd HH:mm:ss" };

			// Try parsing the input date
			if (DateTime.TryParseExact(inputDate, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
			{
				// Convert to required e-invoice format: "dd/MM/yyyy"
				return parsedDate.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
			}

			// If parsing fails, return empty or log an error
			Console.WriteLine($"Invalid date format for E-Invoice: {inputDate}");
			return string.Empty;

		}


		[HttpGet]
		[Route("GetSaleDetailsById")]
		public IActionResult NotNullGetSale(int SaleId, bool IsSale)
		{
			var response = GetSaleDetails(SaleId, IsSale);
			return Json(response);
		}

		[HttpGet]
		[Route("GetAPICredentialDetails")]
		public IActionResult GetAPICredentialDetails(int APICredentialId)
		{
			GetAPICredential request = new GetAPICredential()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				APICredentialId = APICredentialId,
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAPICredentialDetails]", request);
			return Json(response);
		}

		[HttpPost]
		[Route("GetEInvoicebyIRNOrDOC")]
		public async Task<IActionResult> GetEInvoicebyIRNOrDOC([FromBody] GetTokenRequest request)
		{
			if (request == null)
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve authentication token" });
			}

			// Step 2: If token retrieval is successful, use it to get the IRN response
			var irnResponse = await EinvoiceResponse(request, tokenResponse.AuthToken);

			if (irnResponse.IsSuccess)
			{
				return Ok(irnResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN", response = irnResponse });
			}
		}

		[HttpPost]
		[Route("CancelledIRN")]
		public async Task<IActionResult> CancelledIRN([FromBody] GetTokenRequest request)
		{
			if (request == null)
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			// Step 1: Token Generation
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve authentication token" });
			}

			// Step 2: If token retrieval is successful, use it to get the IRN response
			var CancelirnResponse = await CancelledIRNtails(request, tokenResponse.AuthToken);

			if (CancelirnResponse.IsSuccess && CancelirnResponse.CancelDate != "")
			{
				var UpdateCancelIRNResponse = UpdateEInvoiceCancelResponseDetails(request, CancelirnResponse);
				return Ok(CancelirnResponse);
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = CancelirnResponse });
			}
		}

		[HttpPost]
		[Route("RejectedIRN")]
		public async Task<IActionResult> RejectedIRN([FromBody] GetTokenRequest request)
		{
			if (request == null)
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			// Step 1: Token Generation
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve authentication token" });
			}

			// Step 2: If token retrieval is successful, use it to get the IRN response
			var irnResponse = await RejectedIRNResponse(request, tokenResponse.AuthToken);

			if (irnResponse.IsSuccess)
			{
				return Ok(irnResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN", response = irnResponse });
			}
		}

		[HttpPost]
		[Route("GenerateEWB")]
		public async Task<IActionResult> GenerateEWB([FromBody] GetTokenRequest request)
		{
			if (request == null)
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			// Step 1: Token Generation
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve authentication token" });
			}

			var saleResponse = GetSaleDetails(request.SaleId, request.IsSale); // Replace with actual values

			if (saleResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve sale details" });
			}

			DataTable ResponseTable = saleResponse.Tables.Count > 13 ? saleResponse.Tables[13] : null;
			DataRow ResponseTableRow = (ResponseTable != null && ResponseTable.Rows.Count > 0) ? ResponseTable.Rows[0] : null;

			DataTable TransportTable = saleResponse.Tables.Count > 4 ? saleResponse.Tables[4] : null;
			DataRow TransportTableRow = (TransportTable != null && TransportTable.Rows.Count > 0) ? TransportTable.Rows[0] : null;

			DataTable ShippingTable = saleResponse.Tables.Count > 8 ? saleResponse.Tables[8] : null;
			DataRow ShippingTableRow = (ShippingTable != null && ShippingTable.Rows.Count > 0) ? ShippingTable.Rows[0] : null;

			DataTable DispatchTable = saleResponse.Tables.Count > 12 ? saleResponse.Tables[12] : null;
			DataRow DispatchTableRow = (DispatchTable != null && DispatchTable.Rows.Count > 0) ? DispatchTable.Rows[0] : null;

			var EWBRequest = new EWBDetails();

			// Check if ResponseTableRow is not null before accessing it
			EWBRequest.Irn = ResponseTableRow?["Irn"]?.ToString() ?? string.Empty;

			// Check if TransportTableRow is not null before accessing it
			if (TransportTableRow != null)
			{
				EWBRequest.Distance = TransportTableRow["Distance"] != DBNull.Value
					? Convert.ToInt32(TransportTableRow["Distance"])
					: 0;
				EWBRequest.TransMode = TransportTableRow["ModeofTransport"]?.ToString() ?? string.Empty;
				EWBRequest.TransId = TransportTableRow["TransporterId"]?.ToString() ?? string.Empty;
				EWBRequest.TransName = TransportTableRow["TransportName"]?.ToString() ?? string.Empty;
				EWBRequest.TransDocDt = TransportTableRow["TransportDocDate"] != DBNull.Value
					? ConvertToEInvoiceDateFormat(TransportTableRow["TransportDocDate"].ToString())
					: string.Empty;
				EWBRequest.TransDocNo = TransportTableRow["TransportDocNo"]?.ToString() ?? string.Empty;
				EWBRequest.VehNo = TransportTableRow["VehicleNumber"]?.ToString() ?? string.Empty;
				EWBRequest.VehType = TransportTableRow["VehicleType"]?.ToString() == "ODC" ? "O" : "R";
			}

			// Check if ShippingTableRow is not null before accessing it
			if (ShippingTableRow != null)
			{
				EWBRequest.ExpShipDtls.Addr1 = ShippingTableRow["ShippingAddress"]?.ToString() ?? string.Empty;
				EWBRequest.ExpShipDtls.Addr2 = null;
				EWBRequest.ExpShipDtls.Loc = ShippingTableRow["ShippingCity"]?.ToString() ?? string.Empty;
				EWBRequest.ExpShipDtls.Pin = ShippingTableRow["ShippingZipCode"] != DBNull.Value
					? Convert.ToInt32(ShippingTableRow["ShippingZipCode"])
					: 0;
				EWBRequest.ExpShipDtls.Stcd = ShippingTableRow["ShippingStateCodeId"]?.ToString() ?? string.Empty;
			}

			// Check if DispatchTableRow is not null before accessing it
			if (DispatchTableRow != null)
			{
				EWBRequest.DispDetails.Nm = DispatchTableRow["DispatchName"]?.ToString() ?? string.Empty;
				EWBRequest.DispDetails.Addr1 = DispatchTableRow["DispatchAddress"]?.ToString() ?? string.Empty;
				EWBRequest.DispDetails.Addr2 = null;
				EWBRequest.DispDetails.Loc = DispatchTableRow["DispatchCity"]?.ToString() ?? string.Empty;
				EWBRequest.DispDetails.Pin = DispatchTableRow["DispatchZipCode"] != DBNull.Value
					? Convert.ToInt32(DispatchTableRow["DispatchZipCode"])
					: 0;
				EWBRequest.DispDetails.Stcd = DispatchTableRow["DispatchStateCode"]?.ToString() ?? string.Empty;
			}


			if (EWBRequest.Irn != null && EWBRequest.Irn != "")
			{
				var EWBResponse = await GenerateEWBDetails(request, tokenResponse.AuthToken, EWBRequest);

				if (EWBResponse.IsSuccess)
				{
					var UpdateEWBResponse = UpdateEwayBillDetails(request, EWBResponse);
					return Ok(EWBResponse);  // Return the full response
				}
				else
				{
					return BadRequest(new { isSuccess = false, message = "Eway Bill Not Generated", response = EWBResponse });
				}
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN" });
			}
		}

		[HttpPost]
		[Route("GetEWBbyIRN")]
		public async Task<IActionResult> GetEWBbyIRN([FromBody] GetTokenRequest request)
		{
			if (request == null)
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve authentication token" });
			}

			// Step 2: If token retrieval is successful, use it to get the IRN response
			var EWBResponse = await GetEWBResponse(request, tokenResponse.AuthToken);

			if (EWBResponse.IsSuccess)
			{
				return Ok(EWBResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN", response = EWBResponse });
			}
		}

		// Helper Method
		private async Task<GetTokenResponse> GetAuthenticationToken(GetTokenRequest request)
		{
			using (var client = new HttpClient())
			{
				// API URL with email as a query parameter
				string apiUrl = $"https://apisandbox.whitebooks.in/einvoice/authenticate?email={Uri.EscapeDataString(request.email)}";

				// Set required headers
				client.DefaultRequestHeaders.Add("username", request.username);
				client.DefaultRequestHeaders.Add("password", request.password);
				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);
				client.DefaultRequestHeaders.Add("cache-control", "no-cache");

				// Make the API call using GET instead of POST
				HttpResponseMessage response = await client.GetAsync(apiUrl);

				// Read and return the response content
				string responseContent = await response.Content.ReadAsStringAsync();

				// Deserialize the response content into a dynamic object
				dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);

				// Check if the response status is "Success"
				if (jsonResponse.status_cd == "Sucess")
				{
					// Extract the data you need from the API response
					return new GetTokenResponse
					{
						TokenExpiry = jsonResponse.data.TokenExpiry,
						Sek = jsonResponse.data.Sek,
						AuthToken = jsonResponse.data.AuthToken
					};
				}

				// If the status is not successful, return null
				return null;
			}
		}
		private async Task<GetIRNResponse> GetIRNByToken(GetTokenRequest request, string authToken, string requestBodyData)
		{
			using (var client = new HttpClient())
			{
				string apiUrl = $"https://apisandbox.whitebooks.in/einvoice/type/GENERATE/version/V1_03?email={Uri.EscapeDataString(request.email)}";


				var content = new StringContent(requestBodyData, Encoding.UTF8, "application/json");

				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("username", request.username);
				client.DefaultRequestHeaders.Add("auth-token", authToken);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				var responseObj = new GetIRNResponse();

				HttpResponseMessage response = await client.PostAsync(apiUrl, content);
				string responseBody = await response.Content.ReadAsStringAsync();
				JObject jsonResponse = JObject.Parse(responseBody);

				// Extract IRN response data if available
				if (jsonResponse["data"] != null)
				{
					return new GetIRNResponse
					{
						AckNo = jsonResponse["data"]["AckNo"]?.ToString(),
						AckDt = jsonResponse["data"]["AckDt"]?.ToString(),
						Irn = jsonResponse["data"]["Irn"]?.ToString(),
						SignedInvoice = jsonResponse["data"]["SignedInvoice"]?.ToString(),
						SignedQRCode = jsonResponse["data"]["SignedQRCode"]?.ToString(),
						Status = jsonResponse["data"]["Status"]?.ToString(),
						EwbNo = jsonResponse["data"]["EwbNo"]?.ToString(),
						EwbDt = jsonResponse["data"]["EwbDt"]?.ToString(),
						EwbValidTill = jsonResponse["data"]["EwbValidTill"]?.ToString(),
						Remarks = jsonResponse["data"]["Remarks"]?.ToString(),
						IsSuccess = true
					};
				}

				// Process Errors (Extracting status_desc field)
				if (jsonResponse["status_desc"] != null)
				{
					string statusDescString = jsonResponse["status_desc"].ToString();

					JArray errorArray = JArray.Parse(statusDescString);
					foreach (var error in errorArray)
					{
						string errorCode = error["ErrorCode"]?.ToString();
						string errorMessage = error["ErrorMessage"]?.ToString();
						responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
					}
				}
				else
				{
					responseObj.Errors.Add($"API request failed with status code: {response.StatusCode}");
				}

				responseObj.IsSuccess = false;
				return responseObj;
			}
		}
		private async Task<GetIRNResponse> EinvoiceResponse(GetTokenRequest request, string token)
		{

			using (var client = new HttpClient())
			{
				// Updated API URL with dynamic parameters from request

				string apiUrl = "";

				// Set required headers
				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("username", request.username);
				client.DefaultRequestHeaders.Add("auth-token", token);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				if (request.docnum != null && request.docdate != null)
				{
					client.DefaultRequestHeaders.Add("docnum", request.docnum);
					client.DefaultRequestHeaders.Add("docdate", request.docdate);

					apiUrl = $"https://apisandbox.whitebooks.in/einvoice/type/GETIRNBYDOCDETAILS/version/V1_03" +
								$"?param1={Uri.EscapeDataString(request.DocumentType)}" +
								$"&email={Uri.EscapeDataString(request.email)}";
				}
				else
				{
					apiUrl = $"https://apisandbox.whitebooks.in/einvoice/type/GETIRN/version/V1_03" +
								$"?param1={Uri.EscapeDataString(request.IRN)}" +
								$"&email={Uri.EscapeDataString(request.email)}";
				}

				// Make the API call using GET
				HttpResponseMessage response = await client.GetAsync(apiUrl);

				// Read and return the response content
				string responseContent = await response.Content.ReadAsStringAsync();

				JObject jsonResponse = JObject.Parse(responseContent);

				var responseObj = new GetIRNResponse();

				// Check if the response status is "Success"
				if (jsonResponse["data"] != null)
				{
					// Extract the data from the API response
					return new GetIRNResponse
					{
						AckNo = jsonResponse["data"]["AckNo"]?.ToString(),
						AckDt = jsonResponse["data"]["AckDt"]?.ToString(),
						Irn = jsonResponse["data"]["Irn"]?.ToString(),
						SignedInvoice = jsonResponse["data"]["SignedInvoice"]?.ToString(),
						SignedQRCode = jsonResponse["data"]["SignedQRCode"]?.ToString(),
						Status = jsonResponse["data"]["Status"]?.ToString(),
						EwbNo = jsonResponse["data"]["EwbNo"]?.ToString(),
						EwbDt = jsonResponse["data"]["EwbDt"]?.ToString(),
						EwbValidTill = jsonResponse["data"]["EwbValidTill"]?.ToString(),
						Remarks = jsonResponse["data"]["Remarks"]?.ToString(),
						IsSuccess = true
					};
				}

				// Process Errors (Extracting status_desc field)
				if (jsonResponse["status_desc"] != null)
				{
					string statusDescString = jsonResponse["status_desc"].ToString();

					JArray errorArray = JArray.Parse(statusDescString);
					foreach (var error in errorArray)
					{
						string errorCode = error["ErrorCode"]?.ToString();
						string errorMessage = error["ErrorMessage"]?.ToString();
						responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
					}
				}

				else
				{
					responseObj.Errors.Add($"API request failed with status code: {response.StatusCode}");
				}

				responseObj.IsSuccess = false;
				return responseObj;
			}
		}
		private async Task<CancelledIRNResponse> CancelledIRNtails(GetTokenRequest request, string authToken)
		{
			using (var client = new HttpClient())
			{

				var requestBody = new
				{
					Irn = request.IRN,
					CnlRsn = request.CnlRsn,
					CnlRem = request.CnlRem
				};

				string requestBodyString = JsonConvert.SerializeObject(requestBody);
				string apiUrl = $"https://apisandbox.whitebooks.in/einvoice/type/CANCEL/version/V1_03?email={Uri.EscapeDataString(request.email)}";
				var content = new StringContent(requestBodyString, Encoding.UTF8, "application/json");

				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("username", request.username);
				client.DefaultRequestHeaders.Add("auth-token", authToken);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				var responseObj = new CancelledIRNResponse();

				HttpResponseMessage response = await client.PostAsync(apiUrl, content);
				string responseBody = await response.Content.ReadAsStringAsync();
				JObject jsonResponse = JObject.Parse(responseBody);

				// Extract IRN response data if available
				if (jsonResponse["data"] != null)
				{
					return new CancelledIRNResponse
					{
						Irn = jsonResponse["data"]["Irn"]?.ToString(),
						CancelDate = jsonResponse["data"]["CancelDate"]?.ToString(),
						IsSuccess = true
					};
				}

				// Process Errors (Extracting status_desc field)
				if (jsonResponse["status_desc"] != null)
				{
					string statusDescString = jsonResponse["status_desc"].ToString();

					JArray errorArray = JArray.Parse(statusDescString);
					foreach (var error in errorArray)
					{
						string errorCode = error["ErrorCode"]?.ToString();
						string errorMessage = error["ErrorMessage"]?.ToString();
						responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
					}
				}
				else
				{
					responseObj.Errors.Add($"API request failed with status code: {response.StatusCode}");
				}

				responseObj.IsSuccess = false;
				return responseObj;
			}
		}
		private async Task<RejectedIRNResponse> RejectedIRNResponse(GetTokenRequest request, string token)
		{

			using (var client = new HttpClient())
			{
				string apiUrl = $"https://apisandbox.whitebooks.in/einvoice/type/GETREJECTEDIRNS/version/V1_03" +
								$"?param1={Uri.EscapeDataString(request.date)}" +
								$"&email={Uri.EscapeDataString(request.email)}";

				// Set required headers
				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("username", request.username);
				client.DefaultRequestHeaders.Add("auth-token", token);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				// Make the API call using GET
				HttpResponseMessage response = await client.GetAsync(apiUrl);

				// Read and return the response content
				string responseContent = await response.Content.ReadAsStringAsync();

				JObject jsonResponse = JObject.Parse(responseContent);

				var responseObj = new RejectedIRNResponse();

				// Check if the response status is "Success"
				if (jsonResponse["data"] != null)
				{
					// Extract the data from the API response
					return new RejectedIRNResponse
					{
						IsSuccess = true
					};
				}

				// Process Errors (Extracting status_desc field)
				if (jsonResponse["status_desc"] != null)
				{
					string statusDescString = jsonResponse["status_desc"].ToString();

					JArray errorArray = JArray.Parse(statusDescString);
					foreach (var error in errorArray)
					{
						string errorCode = error["ErrorCode"]?.ToString();
						string errorMessage = error["ErrorMessage"]?.ToString();
						responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
					}
				}

				else
				{
					responseObj.Errors.Add($"API request failed with status code: {response.StatusCode}");
				}

				responseObj.IsSuccess = false;
				return responseObj;
			}
		}
		private async Task<EWBResponse> GenerateEWBDetails(GetTokenRequest request, string authToken, EWBDetails EWBRequest)
		{
			using (var client = new HttpClient())
			{
				string requestBodyString = JsonConvert.SerializeObject(EWBRequest);
				string apiUrl = $"https://apisandbox.whitebooks.in/einvoice/type/GENERATE_EWAYBILL/version/V1_03?email={Uri.EscapeDataString(request.email)}";
				var content = new StringContent(requestBodyString, Encoding.UTF8, "application/json");

				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("username", request.username);
				client.DefaultRequestHeaders.Add("auth-token", authToken);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				var responseObj = new EWBResponse();

				HttpResponseMessage response = await client.PostAsync(apiUrl, content);
				string responseBody = await response.Content.ReadAsStringAsync();
				JObject jsonResponse = JObject.Parse(responseBody);

				// Extract IRN response data if available
				if (jsonResponse["data"] != null)
				{
					return new EWBResponse
					{
						EwbNo = jsonResponse["data"]["EwbNo"]?.ToString(),
						EwbDt = jsonResponse["data"]["EwbDt"]?.ToString(),
						EwbValidTill = jsonResponse["data"]["EwbValidTill"]?.ToString(),
						Remarks = jsonResponse["data"]["Remarks"]?.ToString(),
						IsSuccess = true
					};
				}

				// Process Errors (Extracting status_desc field)
				if (jsonResponse["status_desc"] != null)
				{
					string statusDescString = jsonResponse["status_desc"].ToString();

					JArray errorArray = JArray.Parse(statusDescString);
					foreach (var error in errorArray)
					{
						string errorCode = error["ErrorCode"]?.ToString();
						string errorMessage = error["ErrorMessage"]?.ToString();
						responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
					}
				}
				else
				{
					responseObj.Errors.Add($"API request failed with status code: {response.StatusCode}");
				}

				responseObj.IsSuccess = false;
				return responseObj;
			}
		}
		private async Task<EWBResponse> GetEWBResponse(GetTokenRequest request, string token)
		{

			using (var client = new HttpClient())
			{
				// Updated API URL with dynamic parameters from request

				string apiUrl = $"https://apisandbox.whitebooks.in/einvoice/type/GETEWAYBILLIRN/version/V1_03" +
								$"?param1={Uri.EscapeDataString(request.IRN)}" +
								$"&email={Uri.EscapeDataString(request.email)}";

				// Set required headers
				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("username", request.username);
				client.DefaultRequestHeaders.Add("auth-token", token);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				// Make the API call using GET
				HttpResponseMessage response = await client.GetAsync(apiUrl);

				// Read and return the response content
				string responseContent = await response.Content.ReadAsStringAsync();

				JObject jsonResponse = JObject.Parse(responseContent);

				var responseObj = new EWBResponse();

				// Check if the response status is "Success"
				if (jsonResponse["data"] != null)
				{
					// Extract the data from the API response
					return new EWBResponse
					{
						Status = jsonResponse["data"]["Status"]?.ToString(),
						EwbNo = jsonResponse["data"]["EwbNo"]?.ToString(),
						EwbDt = jsonResponse["data"]["EwbDt"]?.ToString(),
						EwbValidTill = jsonResponse["data"]["EwbValidTill"]?.ToString(),
						GenGstin = jsonResponse["data"]["GenGstin"]?.ToString(),
						IsSuccess = true
					};
				}

				// Process Errors (Extracting status_desc field)
				if (jsonResponse["status_desc"] != null)
				{
					string statusDescString = jsonResponse["status_desc"].ToString();

					JArray errorArray = JArray.Parse(statusDescString);
					foreach (var error in errorArray)
					{
						string errorCode = error["ErrorCode"]?.ToString();
						string errorMessage = error["ErrorMessage"]?.ToString();
						responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
					}
				}
				else
				{
					responseObj.Errors.Add($"API request failed with status code: {response.StatusCode}");
				}

				responseObj.IsSuccess = false;
				return responseObj;
			}
		}
		private static object CleanNullProperties(object obj)
		{
			if (obj == null)
			{
				return null;
			}

			if (obj is JToken token)
			{
				switch (token.Type)
				{
					case JTokenType.Object:
						var cleanedObject = new JObject();
						foreach (var property in token.Children<JProperty>())
						{
							var cleanedValue = CleanNullProperties(property.Value);
							if (cleanedValue != null && !(cleanedValue is JValue jValue && jValue.Type == JTokenType.Null))
							{
								cleanedObject.Add(property.Name, JToken.FromObject(cleanedValue));
							}
						}
						return cleanedObject.Count > 0 ? cleanedObject : null;

					case JTokenType.Array:
						var cleanedArray = new JArray();
						foreach (var item in token.Children())
						{
							var cleanedItem = CleanNullProperties(item);
							if (cleanedItem != null && !(cleanedItem is JValue jArrayValue && jArrayValue.Type == JTokenType.Null))
							{
								cleanedArray.Add(JToken.FromObject(cleanedItem));
							}
						}
						return cleanedArray.Count > 0 ? cleanedArray : null;

					default:
						return token;
				}
			}

			var jObj = JObject.FromObject(obj);
			var result = CleanNullProperties(jObj);
			return result is JObject jObjectResult && jObjectResult.Count == 0 ? null : result;
		}
		public DataSet GetSaleDetails(int SaleId, bool IsSale)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_GetSaleDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					// Add parameters if your stored procedure expects them
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);


					command.Parameters.AddWithValue("@SaleId", SaleId);
					command.Parameters.AddWithValue("@IsSale", IsSale);

					// Add output parameters
					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					SqlDataAdapter adapter = new SqlDataAdapter(command);
					adapter.Fill(ds);

					// Check the status and message
					int status = Convert.ToInt32(command.Parameters["@Status"].Value);
					string message = Convert.ToString(command.Parameters["@Message"].Value);

					if (status != 1)
					{
						// Handle error appropriately, maybe log it or throw an exception
						throw new Exception($"Failed to get sales details: {message}");
					}
				}
			}

			return ds;
		}
		public DataSet APICredentialDetails(int APICredentialId)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_GetAPICredentialDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					// Add parameters if your stored procedure expects them
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@APICredentialId", APICredentialId);


					// Add output parameters
					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					SqlDataAdapter adapter = new SqlDataAdapter(command);
					adapter.Fill(ds);

					// Check the status and message
					int status = Convert.ToInt32(command.Parameters["@Status"].Value);
					string message = Convert.ToString(command.Parameters["@Message"].Value);

					if (status != 1)
					{
						// Handle error appropriately, maybe log it or throw an exception
						throw new Exception($"Failed to get sales details: {message}");
					}
				}
			}

			return ds;
		}
		public DataSet InsertEInvoiceResponseDetails(GetIRNResponse Request, int SaleId)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_InsertEInvoiceResponseDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					// Add parameters if your stored procedure expects them
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@AckNo", Request.AckNo);
					command.Parameters.AddWithValue("@AckDate", Request.AckDt);
					command.Parameters.AddWithValue("@Irn", Request.Irn);
					command.Parameters.AddWithValue("@SignedInvoice", Request.SignedInvoice);
					command.Parameters.AddWithValue("@SignedQRCode", Request.SignedQRCode);
					command.Parameters.AddWithValue("@EwbNo", Request.EwbNo);
					command.Parameters.AddWithValue("@EwbDate", Request.EwbDt);
					command.Parameters.AddWithValue("@EwbValidTill", Request.EwbValidTill);
					command.Parameters.AddWithValue("@Remarks", Request.Remarks);
					command.Parameters.AddWithValue("@EInvoiceStatus", "Generated");
					command.Parameters.AddWithValue("@SaleId", SaleId);

					// Add output parameters
					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					command.ExecuteNonQuery();

					// Check the status and message
					int status = Convert.ToInt32(command.Parameters["@Status"].Value);
					string message = Convert.ToString(command.Parameters["@Message"].Value);

					if (status != 1)
					{
						// Handle error appropriately, maybe log it or throw an exception
						throw new Exception($"Failed to Insert IRN details: {message}");
					}
				}
			}

			return ds;
		}
		public DataSet UpdateEInvoiceCancelResponseDetails(GetTokenRequest Request, CancelledIRNResponse CancelRequest)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_UpdateEInvoiceResponseDetails_CancelDate]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					// Add parameters if your stored procedure expects them
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@Irn", Request.IRN);
					command.Parameters.AddWithValue("@CancelDate", CancelRequest.CancelDate);
					command.Parameters.AddWithValue("@EInvoiceStatus", "Cancelled");

					// Add output parameters
					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					command.ExecuteNonQuery();

					// Check the status and message
					int status = Convert.ToInt32(command.Parameters["@Status"].Value);
					string message = Convert.ToString(command.Parameters["@Message"].Value);

					if (status != 1)
					{
						// Handle error appropriately, maybe log it or throw an exception
						throw new Exception($"Failed to update Cancel IRN details: {message}");
					}
				}
			}

			return ds;
		}
		public DataSet UpdateEwayBillDetails(GetTokenRequest Request, EWBResponse EWBRequest)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_UpdateEWayBillResponseDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					// Add parameters if your stored procedure expects them
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@SaleId", Request.SaleId);
					command.Parameters.AddWithValue("@EwbNo", EWBRequest.EwbNo);
					command.Parameters.AddWithValue("@EwbDate", EWBRequest.EwbDt);
					command.Parameters.AddWithValue("@EwbValidTill", EWBRequest.EwbValidTill);
					command.Parameters.AddWithValue("@EwayBillStatus", "Generated");

					// Add output parameters
					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					command.ExecuteNonQuery();

					// Check the status and message
					int status = Convert.ToInt32(command.Parameters["@Status"].Value);
					string message = Convert.ToString(command.Parameters["@Message"].Value);

					if (status != 1)
					{
						// Handle error appropriately, maybe log it or throw an exception
						throw new Exception($"Failed to update Cancel IRN details: {message}");
					}
				}
			}

			return ds;
		}

		[HttpGet]
		[Route("GetSaleDate_BySaleId")]
		public IActionResult GetSaleDate_BySaleId(int saleId)
		{
			SaleDateRequest request = new SaleDateRequest()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleId = saleId,

			};

			response = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_GetSaleDateDetails_BySaleId]", request);
			return Json(response);
		}
	}
}
