using TetroONE.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using System.Reflection;
using Newtonsoft.Json.Linq;
using DocumentFormat.OpenXml.Spreadsheet; 
using Newtonsoft.Json;
using Org.BouncyCastle.Crypto.Operators;

namespace TetroONE.Controllers
{
	public class CommonController : BaseController
	{
		public CommonController(IConfiguration configuration) : base(configuration)
		{
		}
		public IActionResult Index()
		{
			return View();
		}

		[HttpGet]
		public IActionResult Getlanding()
		{
			LandingResponse Get = new LandingResponse()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
			};

			response = GenericTetroONE.GetData(_connectionString, "USP_GetLandingPageDetails", Get);
			return Json(response);
		}
		[HttpGet]
		public IActionResult ClientDetailsByClientId(int clientId)
		{
			GetClientDetails request = new GetClientDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ClientId = clientId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_ClientDetailsByClientId]", request);
			return Json(response);

		}

		[HttpPost]
		public async Task<IActionResult> fileupload()
		{
			IFormFile file = Request.Form.Files[0];

			string id = Convert.ToString(Request.Form["id"]);

			var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\TetroOne\", id.Replace("../TetroOne/", ""));
			var directoryPath = Path.GetDirectoryName(filePath);

			if (!Directory.Exists(directoryPath))
			{
				Directory.CreateDirectory(directoryPath);
			}

			using (var stream = System.IO.File.Create(filePath))
			{
				await this.Request.Form.Files[0].CopyToAsync(stream);
			}

			return Ok("");
		}


		[HttpGet]
		public IActionResult VendorDetailsByVendorId(int vendorId)
		{
			GetVendorDetails request = new GetVendorDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				VendorId = vendorId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_VendorDetailsByVendorId]", request);
			return Json(response); 
		}

        [HttpGet]
        public IActionResult BillFromDetails_BillFromId(int ModuleId, string ModuleName)
        {
            BillFromDetails_BillFromId request = new BillFromDetails_BillFromId()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ModuleId = ModuleId,
                ModuleName = ModuleName
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetBranchDetailsByBranchId]", request);
            return Json(response); 
        }

        [HttpGet]
        public IActionResult DistributorDetailsByDistributorId(int? DistributorId)
        {
            DistributorDetailsByDistributorId request = new DistributorDetailsByDistributorId()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                DistributorId = DistributorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DistributorDetailsByDistributorId]", request);
            return Json(response);

        }
        [HttpGet]
		public IActionResult GetInventoryWhatsappDetails(string ModuleName, int ModuleId, string FilePath)
		{
			GetInventoryWhatsappDetails request = new GetInventoryWhatsappDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ModuleName = ModuleName,
				ModuleId = ModuleId,
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetInventoryWhatsappDetails]", request);

			if (response.Status)
			{
				if (response.Data != null && response.Data.ToString() != "[]")
				{
					var data = JArray.Parse(response.Data.ToString())[0][0];

					string mobileNumber = data["mobile_Number"].ToString();
					string templateId = data["template_id"].ToString();
					string header_document_url = FilePath;

					var dynamicVariables = new Dictionary<string, object>();

					foreach (var property in data)
					{
						string propName = ((JProperty)property).Name;
						if (propName != "mobile_Number" && propName != "template_id")
						{
							dynamicVariables[propName] = ((JProperty)property).Value;
						}
					}

					if (!string.IsNullOrEmpty(mobileNumber) && !string.IsNullOrEmpty(templateId) && !string.IsNullOrEmpty(header_document_url))
					{
						WatsAppApi.SendWatsAppMessageInventoryPDF(mobileNumber, templateId, header_document_url, dynamicVariables);
					}
				}
			}
			return Json(response);
		}
		[HttpGet]
		public IActionResult GetEmailToAddressDetails(string moduleName, int moduleId)
		{

			GetEmailDetails getInfo = new GetEmailDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ModuleName = moduleName,
				ModuleId = moduleId,

			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEmailInfoDetails]", getInfo);
			return Json(response);
		}

		[HttpPost]
		public IActionResult GetDropDown([FromBody] CommonDrop request)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetMasterInfoDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@MasterInfoId", DBNull.Value);
					command.Parameters.AddWithValue("@ModuleName", request.ModuleName);

					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					SqlDataAdapter adapter = new SqlDataAdapter(command);
					adapter.Fill(ds);

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);

					response.Data = GenericTetroONE.dataSetToJSON(ds);
				}
			}
			return Json(response);
		}

		[HttpPost]
		public IActionResult GetDropDownNotNull([FromBody] CommonDrop request)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetMasterInfoDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@MasterInfoId", request.MasterInfoId);
					command.Parameters.AddWithValue("@ModuleName", request.ModuleName);

					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					SqlDataAdapter adapter = new SqlDataAdapter(command);
					adapter.Fill(ds);

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);

					response.Data = GenericTetroONE.dataSetToJSON(ds);
				}
			}
			return Json(response);
		}
		 
		[HttpGet]
		public IActionResult GetInventoryStatusDetails(string ModuleName, int ModuleId)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

			DataSet ds = new DataSet();

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetInventoryStatusDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@ModuleName", ModuleName);
					command.Parameters.AddWithValue("@ModuleId", ModuleId != 0 ? (object)ModuleId : DBNull.Value);

					command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					SqlDataAdapter adapter = new SqlDataAdapter(command);
					adapter.Fill(ds);

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);

					response.Data = GenericTetroONE.dataSetToJSON(ds);
				}
			}
			return Json(response);
		}

        [HttpGet]
        public IActionResult GetBillFromDDDetails( int? ModuleId,string? ModuleName)
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            DataSet ds = new DataSet();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_BillFromDetails_FranchiseId]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@ModuleId", (object?)ModuleId ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ModuleName", (object?)ModuleName ?? DBNull.Value);
                   

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
            }
            return Json(response);
        }

        [HttpGet]
        public IActionResult ActivityHistoryDetails(string ModuleName, int ModuleId)
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            DataSet ds = new DataSet();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetActivityHistoryDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@ModuleName", ModuleName);
                    command.Parameters.AddWithValue("@ModuleId", ModuleId);

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
            }
            return Json(response);
        }

		[HttpGet]
		public IActionResult GetAutoGenerate(string ModuleName, int? FranchiseId)
		{
			GetAutoGenerate Get = new GetAutoGenerate()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				ModuleName = ModuleName,
				FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAutoGenerateNoDetails]", Get);
			return Json(response);
		}

		[HttpGet]
		public IActionResult GetPreview(int ModuleId, string ModuleName)
		{
			GetPreview Get = new GetPreview()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				ModuleId = ModuleId,
				ModuleName = ModuleName,
			};

			response = GenericTetroONE.GetData(_connectionString, "USP_GetPreviewDetails", Get);
			return Json(response);
		}

		[HttpGet]
		public IActionResult GetSampleTA(int ModuleId, string ModuleName)
		{
			GetTAModel Get = new GetTAModel()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				ModuleName = ModuleName,
				ModuleId = ModuleId,
			};

			response = GenericTetroONE.GetData(_connectionString, "USP_GetTimeAndActionDetails", Get);
			return Json(response);
		}



		[HttpPost]
		public IActionResult InsertTimeAndAction([FromBody] InsertTimeAndAction request)
		{
			request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			response = GenericTetroONE.Execute(_connectionString, "USP_UpdateTimeAndActionDetails", request);

			return Json(response);
		}

		[HttpGet]
		public IActionResult GetNotificationDetails()
		{
			GetNotification Get = new GetNotification()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				NotificationId = null,
			};

			response = GenericTetroONE.GetData(_connectionString, "USP_GetNotificationDetails", Get);
			return Json(response);
		}

		[HttpGet]
		public IActionResult GetNotificationDetailsId(int NotificationId)
		{
			GetNotification Get = new GetNotification()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				NotificationId = NotificationId,
			};

			response = GenericTetroONE.GetData(_connectionString, "USP_GetNotificationDetails", Get);
			return Json(response);
		}

        [HttpGet]
        public IActionResult SetUserAccess()
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataSet ds = new DataSet();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_UserLogin_New]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value));

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    if (response.Status && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = ds.Tables[0];
                       /// response.Message = Enum.GetName(typeof(UserRole), Convert.ToInt32(dt.Rows[0]["UserGroupId"]));

                        SetAccess(dt);
                    }
                }
            }
            return Json(response);
        }


        private void SetAccess(DataTable dt)
        {
            List<UserAccess> access = GenericTetroONE.ConvertDataTableToList<UserAccess>(dt);
            string json = JsonConvert.SerializeObject(access);
            HttpContext.Session.SetString("UserAccess", json);
        }
    }
}
