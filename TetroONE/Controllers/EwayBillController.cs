using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using System.Text;
using TetroONE.Models;

namespace TetroONE.Controllers
{
	[Authorize]
	[Route("EwayBill")]
	public class EwayBillController : BaseController
	{
		public EwayBillController(IConfiguration configuration) : base(configuration)
		{

		}
		[HttpPost]
		[Route("GenerateEwayBill")]
		public async Task<IActionResult> GenerateEwayBill([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			if (request.SaleId == 0)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve sale details" });
			}
			var saleResponse = GetSaleDetails(request.SaleId); // Replace with actual values

			if (saleResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve sale details" });
			}

			var ewaybillDataResponse = new EwayBillJSONData
			{
				supplyType = "O",
				subSupplyType = "1",
				subSupplyDesc = " ",
				docType = "INV",
				docNo = "bv1/101",
				docDate = "11/01/2025",
				fromGstin = "29AAGCB1286Q000",
				fromTrdName = "welton",
				fromAddr1 = "2ND CROSS NO 59  19  A",
				fromAddr2 = "GROUND FLOOR OSBORNE ROAD",
				fromPlace = "FRAZER TOWN",
				actFromStateCode = 29,
				fromPincode = 560001,
				fromStateCode = 29,
				toGstin = "05AAACH6188F1ZM",
				toTrdName = "sthuthya",
				toAddr1 = "Shree Nilaya",
				toAddr2 = "Dasarahosahalli",
				toPlace = "Beml Nagar",
				toPincode = 263652,
				actToStateCode = 5,
				toStateCode = 5,
				transactionType = 4,
				dispatchFromGstin = "29AAAAA1303P1ZV",
				dispatchFromTradeName = "ABC Traders",
				shipToGstin = "29ALSPR1722R1Z3",
				shipToTradeName = "XYZ Traders",
				totalValue = 56099,
				cgstValue = 0,
				sgstValue = 0,
				igstValue = 300.67m,
				cessValue = 400.56m,
				cessNonAdvolValue = 400,
				totInvValue = 57200.23m,
				transMode = "1",
				transDistance = "2487",
				transporterName = "kavii",
				transporterId = "05AAACG0904A1ZL",
				transDocNo = "vv1",
				transDocDate = "11/01/2025",
				vehicleNo = "APR3214",
				vehicleType = "R",

				itemList = new List<ItemList>
	{
		new ItemList
		{
			productName = "Wheat",
			productDesc = "Wheat",
			hsnCode = 1001,
			quantity = 4,
			qtyUnit = "BOX",
			taxableAmount = 56099,
			sgstRate = 0,
			cgstRate = 0,
			igstRate = 3,
			cessRate = 0
		}
	}
			};


			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			string EwayBillData = JsonConvert.SerializeObject(ewaybillDataResponse);

			var EwaybillResponse = await GetEwayBillByToken(request, EwayBillData);

			if (EwaybillResponse.IsSuccess)
			{
				return Ok(EwaybillResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = EwaybillResponse });
			}
		}

		[HttpPost]
		[Route("UpdateVehicleDetails")]
		public async Task<IActionResult> UpdateVehicleDetails([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			//if (request.SaleId == 0)
			//{
			//    return BadRequest(new { isSuccess = false, message = "Failed to retrieve sale details" });
			//}
			//var saleResponse = GetSaleDetails(request.SaleId, request.IsSale); // Replace with actual values

			//if (saleResponse == null)
			//{
			//    return BadRequest(new { isSuccess = false, message = "Failed to retrieve sale details" });
			//}

			var UpdateVehicleRequest = new UpdateVehicleRequest
			{
				ewbNo = 181010741405,
				vehicleNo = "DEF1234",
				fromPlace = "FRAZER TOWN",
				fromState = 29,
				reasonCode = "1",
				reasonRem = "Due to Break Down",
				transDocNo = "12",
				transDocDate = "12/01/2025",
				transMode = "1"
			};


			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			string UpdateVehicleRequestData = JsonConvert.SerializeObject(UpdateVehicleRequest);

			var UpdateVehicleResponse = await UpdateVehiclDetails(request, UpdateVehicleRequestData);

			if (UpdateVehicleResponse.IsSuccess)
			{
				return Ok(UpdateVehicleResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = UpdateVehicleResponse });
			}
		}

		[HttpPost]
		[Route("CancelEWB")]
		public async Task<IActionResult> CancelEWB([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var CancelEWBRequest = new CancelEWBRequest
			{
				ewbNo = request.EwayBillNumber,
				cancelRsnCode = request.cancelRsnCode,
				cancelRmrk = request.cancelRmrk
			};

			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			string CancelEWBRequestData = JsonConvert.SerializeObject(CancelEWBRequest);

			var CancelEWBRequestDataResponse = await CancelEWBDetails(request, CancelEWBRequestData);

			if (CancelEWBRequestDataResponse.IsSuccess && CancelEWBRequestDataResponse.cancelDate != "")
			{
				var UpdateCancelEwaybillResponse = UpdateEwayBillCancelResponseDetails(request, CancelEWBRequestDataResponse);
				return Ok(CancelEWBRequestDataResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = CancelEWBRequestDataResponse });
			}
		}

		public DataSet UpdateEwayBillCancelResponseDetails(GetewayBillTokenRequest Request, CancelEWBResponse CancelRequest)
		{
			_employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_UpdateEWayBillResponseDetails_CancelDate]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					// Add parameters if your stored procedure expects them
					command.Parameters.AddWithValue("@LoginUserId", _employeeId);
					command.Parameters.AddWithValue("@EwbNo", CancelRequest.ewayBillNo);
					command.Parameters.AddWithValue("@CancelDate", CancelRequest.cancelDate);
					command.Parameters.AddWithValue("@EwayBillStatus", "Cancelled");

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

		[HttpPost]
		[Route("RejectEWB")]
		public async Task<IActionResult> RejectEWB([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var rejectEWBRequest = new RejectEWBRequest
			{
				ewbNo = request.EwayBillNumber
			};

			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			string rejectEWBRequestData = JsonConvert.SerializeObject(rejectEWBRequest);

			var rejectEWBRequestDataResponse = await RejectEWBDetails(request, rejectEWBRequestData);

			if (rejectEWBRequestDataResponse.IsSuccess)
			{
				return Ok(rejectEWBRequestDataResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = rejectEWBRequestDataResponse });
			}
		}

		[HttpPost]
		[Route("UpdateTransporter")]
		public async Task<IActionResult> UpdateTransporter([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var updateTransporterRequest = new UpdateTransporterRequest
			{
				ewbNo = request.EwayBillNumber,
				transporterId = request.TransporterId
			};

			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			string updateTransporterRequestData = JsonConvert.SerializeObject(updateTransporterRequest);

			var updateTransporterDataResponse = await UpdateTransporterDetails(request, updateTransporterRequestData);

			if (updateTransporterDataResponse.IsSuccess)
			{
				return Ok(updateTransporterDataResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = updateTransporterDataResponse });
			}
		}

		[HttpPost]
		[Route("ExtendValidity")]
		public async Task<IActionResult> ExtendValidity([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var extendValidityRequest = new ExtendValidityRequest
			{
				ewbNo = 191010741408,
				vehicleNo = "APR3214",
				fromPlace = "FRAZER TOWN",
				fromState = 29,
				remainingDistance = 50,
				transDocNo = "vv1",
				transDocDate = "11/01/2025",
				transMode = "1",
				extnRsnCode = 1,
				extnRemarks = "Nature Calamity",
				fromPincode = 560001,
				consignmentStatus = "M",
				transitType = "",
				addressLine1 = "",
				addressLine2 = "",
				addressLine3 = "",

			};


			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			string extendValidityRequestData = JsonConvert.SerializeObject(extendValidityRequest);

			var extendValidityDataResponse = await ExtendValidityDetails(request, extendValidityRequestData);

			if (extendValidityDataResponse.IsSuccess)
			{
				return Ok(extendValidityDataResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN response", response = extendValidityDataResponse });
			}
		}

		[HttpPost]
		[Route("GetEWBbyEWBNumber")]
		public async Task<IActionResult> GetEWBbyEWBNumber([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var getEWBRequest = new GetEWBRequest
			{
				ewbNo = request.EwayBillNumber
			};

			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			// Step 2: If token retrieval is successful, use it to get the IRN response
			var EWBResponse = await GetEWBResponse(request, getEWBRequest.ewbNo.ToString());

			if (EWBResponse.IsSuccess)
			{
				return Ok(EWBResponse);  // Return the full response
			}
			else
			{
				return BadRequest(new { isSuccess = false, message = "Failed to retrieve IRN", response = EWBResponse });
			}
		}

		[HttpPost]
		[Route("GetEWBbyDate")]
		public async Task<IActionResult> GetEWBbyDate([FromBody] GetewayBillTokenRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.email))
			{
				return BadRequest(new { isSuccess = false, message = "Registered Email is required" });
			}

			var getEWBRequest = new GetEWBRequest
			{
				date = request.GetDate
			};

			// Step 1: Get Authentication Token
			var tokenResponse = await GetAuthenticationToken(request);

			if (tokenResponse == null)
			{
				return BadRequest(new { isSuccess = false, message = "Token Net Generated,contact admin" });
			}

			// Step 2: If token retrieval is successful, use it to get the IRN response
			var EWBResponse = await GetEWBbyDateResponse(request, getEWBRequest.date.ToString());

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
		private async Task<GetewayBillTokenResponse> GetAuthenticationToken(GetewayBillTokenRequest request)
		{
			using (var client = new HttpClient())
			{

				// API URL with email, username, and password as query parameters
				string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/authenticate?" +
								$"email={Uri.EscapeDataString(request.email)}&" +
								$"username={Uri.EscapeDataString(request.username)}&" +
								$"password={Uri.EscapeDataString(request.password)}";

				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				// Make the API call using GET instead of POST
				HttpResponseMessage response = await client.GetAsync(apiUrl);

				// Read and return the response content
				string responseContent = await response.Content.ReadAsStringAsync();

				// Deserialize the response content into a dynamic object
				dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);

				// Check if the response status is "Success"
				if (jsonResponse.status_cd == "1")
				{
					// Extract the data you need from the API response
					return new GetewayBillTokenResponse
					{
						IsSuccess = true
					};
				}

				// If the status is not successful, return null
				return null;
			}
		}
		private async Task<GetewayBillResponse> GetEwayBillByToken(GetewayBillTokenRequest request, string requestBodyData)
		{
			var responseObj = new GetewayBillResponse
			{
				Errors = new List<string>()
			};

			try
			{
				using (var client = new HttpClient())
				{
					string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/genewaybill?email={Uri.EscapeDataString(request.email)}";

					var content = new StringContent(requestBodyData, Encoding.UTF8, "application/json");

					client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
					client.DefaultRequestHeaders.Add("client_id", request.client_id);
					client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
					client.DefaultRequestHeaders.Add("gstin", request.gstin);

					HttpResponseMessage response = await client.PostAsync(apiUrl, content);
					string responseBody = await response.Content.ReadAsStringAsync();

					if (response.IsSuccessStatusCode)
					{
						JObject jsonResponse = JObject.Parse(responseBody);

						if (jsonResponse["data"] != null)
						{
							return new GetewayBillResponse
							{
								IsSuccess = true,
								ewayBillNo = jsonResponse["data"]["ewayBillNo"]?.ToString(),
								ewayBillDate = jsonResponse["data"]["ewayBillDate"]?.ToString(),
								validUpto = jsonResponse["data"]["validUpto"]?.ToString(),
							};
						}
					}

					// Handle errors from the API
					JObject errorResponse = JObject.Parse(responseBody);

					if (errorResponse["status_desc"] != null)
					{
						string statusDescString = errorResponse["status_desc"].ToString();

						try
						{
							JArray errorArray = JArray.Parse(statusDescString);
							foreach (var error in errorArray)
							{
								string errorCode = error["ErrorCode"]?.ToString();
								string errorMessage = error["ErrorMessage"]?.ToString();
								responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
							}
						}
						catch (Exception ex)
						{
							responseObj.Errors.Add("Failed to parse status_desc: " + ex.Message);
						}
					}
					else
					{
						responseObj.Errors.Add($"API request failed with status code: {response.StatusCode}");
					}
				}
			}
			catch (Exception ex)
			{
				responseObj.Errors.Add($"Exception: {ex.Message}");
			}

			responseObj.IsSuccess = false;
			return responseObj;
		}
		private async Task<UpdateVehicleResponse> UpdateVehiclDetails(GetewayBillTokenRequest request, string requestBodyData)
		{
			var responseObj = new UpdateVehicleResponse
			{
				Errors = new List<string>()
			};

			try
			{
				using (var client = new HttpClient())
				{

					string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/vehewb?email={Uri.EscapeDataString(request.email)}";
					var content = new StringContent(requestBodyData, Encoding.UTF8, "application/json");

					client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
					client.DefaultRequestHeaders.Add("client_id", request.client_id);
					client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
					client.DefaultRequestHeaders.Add("gstin", request.gstin);

					HttpResponseMessage response = await client.PostAsync(apiUrl, content);
					string responseBody = await response.Content.ReadAsStringAsync();

					if (response.IsSuccessStatusCode)
					{
						JObject jsonResponse = JObject.Parse(responseBody);

						if (jsonResponse["data"] != null)
						{
							return new UpdateVehicleResponse
							{
								IsSuccess = true,
								vehUpdDate = jsonResponse["data"]["vehUpdDate"]?.ToString(),
								validUpto = jsonResponse["data"]["validUpto"]?.ToString(),
							};
						}
					}

					// Handle errors from the API
					JObject errorResponse = JObject.Parse(responseBody);

					if (errorResponse["status_desc"] != null)
					{
						string statusDescString = errorResponse["status_desc"].ToString();

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
				}
			}
			catch (Exception ex)
			{
				responseObj.Errors.Add($"Exception: {ex.Message}");
			}

			responseObj.IsSuccess = false;
			return responseObj;
		}
		private async Task<CancelEWBResponse> CancelEWBDetails(GetewayBillTokenRequest request, string requestBodyData)
		{
			var responseObj = new CancelEWBResponse
			{
				Errors = new List<string>()
			};

			try
			{
				using (var client = new HttpClient())
				{

					string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/canewb?email={Uri.EscapeDataString(request.email)}";
					var content = new StringContent(requestBodyData, Encoding.UTF8, "application/json");

					client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
					client.DefaultRequestHeaders.Add("client_id", request.client_id);
					client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
					client.DefaultRequestHeaders.Add("gstin", request.gstin);

					HttpResponseMessage response = await client.PostAsync(apiUrl, content);
					string responseBody = await response.Content.ReadAsStringAsync();

					if (response.IsSuccessStatusCode)
					{
						JObject jsonResponse = JObject.Parse(responseBody);

						if (jsonResponse["data"] != null)
						{
							return new CancelEWBResponse
							{
								IsSuccess = true,
								ewayBillNo = jsonResponse["data"]["ewayBillNo"]?.ToString(),
								cancelDate = jsonResponse["data"]["cancelDate"]?.ToString()
							};
						}
					}

					// Handle errors from the API
					JObject errorResponse = JObject.Parse(responseBody);

					if (errorResponse["error"] != null)
					{
						string statusDescString = errorResponse["error"]["message"].ToString();

						try
						{
							// Parse statusDescString as JObject instead of JArray
							JObject errorObject = JObject.Parse(statusDescString);

							// Extract the "errorCodes" property
							string errorCodes = errorObject["errorCodes"]?.ToString();

							// Add the error code to the response object
							responseObj.Errors.Add($"ErrorCodes: {errorCodes}");
						}
						catch (Exception ex)
						{
							responseObj.Errors.Add("Failed to parse status_desc: " + ex.Message);
						}
					}

				}
			}
			catch (Exception ex)
			{
				responseObj.Errors.Add($"Exception: {ex.Message}");
			}

			responseObj.IsSuccess = false;
			return responseObj;
		}
		private async Task<RejectEWBResponse> RejectEWBDetails(GetewayBillTokenRequest request, string requestBodyData)
		{
			var responseObj = new RejectEWBResponse
			{
				Errors = new List<string>()
			};

			try
			{
				using (var client = new HttpClient())
				{

					string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/rejewb?email={Uri.EscapeDataString(request.email)}";
					var content = new StringContent(requestBodyData, Encoding.UTF8, "application/json");

					client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
					client.DefaultRequestHeaders.Add("client_id", request.client_id);
					client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
					client.DefaultRequestHeaders.Add("gstin", request.gstin);

					HttpResponseMessage response = await client.PostAsync(apiUrl, content);
					string responseBody = await response.Content.ReadAsStringAsync();

					if (response.IsSuccessStatusCode)
					{
						JObject jsonResponse = JObject.Parse(responseBody);

						if (jsonResponse["data"] != null)
						{
							return new RejectEWBResponse
							{
								IsSuccess = true
							};
						}
					}

					// Handle errors from the API
					JObject errorResponse = JObject.Parse(responseBody);

					if (errorResponse["status_cd"] != null)
					{
						string statusDescString = errorResponse["status_desc"].ToString();

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
				}
			}
			catch (Exception ex)
			{
				responseObj.Errors.Add($"Exception: {ex.Message}");
			}

			responseObj.IsSuccess = false;
			return responseObj;
		}
		private async Task<UpdateTransporterResponse> UpdateTransporterDetails(GetewayBillTokenRequest request, string requestBodyData)
		{
			var responseObj = new UpdateTransporterResponse
			{
				Errors = new List<string>()
			};

			try
			{
				using (var client = new HttpClient())
				{

					string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/updatetransporter?email={Uri.EscapeDataString(request.email)}";
					var content = new StringContent(requestBodyData, Encoding.UTF8, "application/json");

					client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
					client.DefaultRequestHeaders.Add("client_id", request.client_id);
					client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
					client.DefaultRequestHeaders.Add("gstin", request.gstin);

					HttpResponseMessage response = await client.PostAsync(apiUrl, content);
					string responseBody = await response.Content.ReadAsStringAsync();

					if (response.IsSuccessStatusCode)
					{
						JObject jsonResponse = JObject.Parse(responseBody);

						if (jsonResponse["data"] != null)
						{
							return new UpdateTransporterResponse
							{
								IsSuccess = true
							};
						}
					}

					// Handle errors from the API
					JObject errorResponse = JObject.Parse(responseBody);

					if (errorResponse["status_cd"] != null)
					{
						string statusDescString = errorResponse["error"].ToString();

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
				}
			}
			catch (Exception ex)
			{
				responseObj.Errors.Add($"Exception: {ex.Message}");
			}

			responseObj.IsSuccess = false;
			return responseObj;
		}
		private async Task<ExtendValidityResponse> ExtendValidityDetails(GetewayBillTokenRequest request, string requestBodyData)
		{
			var responseObj = new ExtendValidityResponse
			{
				Errors = new List<string>()
			};

			try
			{
				using (var client = new HttpClient())
				{

					string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/extendvalidity?email={Uri.EscapeDataString(request.email)}";
					var content = new StringContent(requestBodyData, Encoding.UTF8, "application/json");

					client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
					client.DefaultRequestHeaders.Add("client_id", request.client_id);
					client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
					client.DefaultRequestHeaders.Add("gstin", request.gstin);

					HttpResponseMessage response = await client.PostAsync(apiUrl, content);
					string responseBody = await response.Content.ReadAsStringAsync();

					if (response.IsSuccessStatusCode)
					{
						JObject jsonResponse = JObject.Parse(responseBody);

						if (jsonResponse["data"] != null)
						{
							return new ExtendValidityResponse
							{
								IsSuccess = true,
								//ewayBillNo = jsonResponse["data"]["ewayBillNo"]?.ToString(),
								//cancelDate = jsonResponse["data"]["cancelDate"]?.ToString()
							};
						}
					}

					// Handle errors from the API
					JObject errorResponse = JObject.Parse(responseBody);

					if (errorResponse["status_cd"] != null)
					{
						string statusDescString = errorResponse["error"].ToString();

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
				}
			}
			catch (Exception ex)
			{
				responseObj.Errors.Add($"Exception: {ex.Message}");
			}

			responseObj.IsSuccess = false;
			return responseObj;
		}
		private async Task<GetewayBillResponse> GetEWBResponse(GetewayBillTokenRequest request, string ewbNumber)
		{
			using (var client = new HttpClient())
			{
				// Updated API URL with dynamic parameters from request

				string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/getewaybill" +
								$"?email={Uri.EscapeDataString(request.email)}" +
								$"&ewbNo={Uri.EscapeDataString(ewbNumber)}";

				// Set required headers
				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				// Make the API call using GET
				HttpResponseMessage response = await client.GetAsync(apiUrl);

				// Read and return the response content
				string responseContent = await response.Content.ReadAsStringAsync();

				JObject jsonResponse = JObject.Parse(responseContent);

				var responseObj = new GetewayBillResponse();

				// Check if the response status is "Success"
				if (jsonResponse["data"] != null)
				{
					// Extract the data from the API response
					return new GetewayBillResponse
					{
						ewayBillNo = jsonResponse["data"]["ewbNo"]?.ToString(),
						ewayBillDate = jsonResponse["data"]["ewayBillDate"]?.ToString(),
						validUpto = jsonResponse["data"]["validUpto"]?.ToString(),
						IsSuccess = true
					};
				}

				// Process Errors (Extracting status_desc field)
				if (jsonResponse["status_desc"] != null)
				{
					string statusDescString = jsonResponse["status_desc"].ToString();

					try
					{
						JArray errorArray = JArray.Parse(statusDescString);
						foreach (var error in errorArray)
						{
							string errorCode = error["ErrorCode"]?.ToString();
							string errorMessage = error["ErrorMessage"]?.ToString();
							responseObj.Errors.Add($"ErrorCode: {errorCode}, Message: {errorMessage}");
						}
					}
					catch (Exception ex)
					{
						responseObj.Errors.Add("Failed to parse status_desc: " + ex.Message);
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
		private async Task<GetewayBillByDateResponse> GetEWBbyDateResponse(GetewayBillTokenRequest request, string Date)
		{
			using (var client = new HttpClient())
			{
				string apiUrl = $"https://apisandbox.whitebooks.in/ewaybillapi/v1.03/ewayapi/getewaybillsbydate" +
								$"?email={Uri.EscapeDataString(request.email)}" +
								$"&date={Uri.EscapeDataString(Date)}";

				client.DefaultRequestHeaders.Add("ip_address", request.ip_address);
				client.DefaultRequestHeaders.Add("client_id", request.client_id);
				client.DefaultRequestHeaders.Add("client_secret", request.client_secret);
				client.DefaultRequestHeaders.Add("gstin", request.gstin);

				HttpResponseMessage response = await client.GetAsync(apiUrl);
				string responseContent = await response.Content.ReadAsStringAsync();

				var responseObj = new GetewayBillByDateResponse();

				try
				{
					JObject jsonResponse = JObject.Parse(responseContent);

					if (jsonResponse["data"] != null)
					{
						responseObj.Data = jsonResponse["data"].ToObject<List<EwayBillDataList>>();
						responseObj.IsSuccess = true;
					}
					else
					{
						responseObj.Errors.Add("No data found in the response.");
						responseObj.IsSuccess = false;
					}

					if (jsonResponse["status_desc"] != null)
					{
						responseObj.StatusDescription = jsonResponse["status_desc"].ToString();
					}
				}
				catch (Exception ex)
				{
					responseObj.Errors.Add("Failed to parse API response: " + ex.Message);
					responseObj.IsSuccess = false;
				}

				return responseObj;
			}
		}
		private object GetSaleDetails(int SaleId)
		{
			GetSale getInfo = new GetSale()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleId = SaleId,

			};

			return GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetSaleDetails]", getInfo);
		}
	}
}
