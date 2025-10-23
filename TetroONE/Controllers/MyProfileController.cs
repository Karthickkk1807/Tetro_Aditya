using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Hosting.Internal;
using log4net;

namespace TetroONE.Controllers
{
	[Authorize]
	[Route("Myprofile")]
	public class MyProfileController : BaseController
	{
		private readonly IWebHostEnvironment _hostingEnvironment;
		private readonly ILog _logger;
		public MyProfileController(IConfiguration configuration, IWebHostEnvironment hostingEnvironment, ILog logger) : base(configuration)
		{
			_hostingEnvironment = hostingEnvironment;
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}
		[Route("")]
		public IActionResult MyProfile()
		{
			return View();
		}


		[HttpGet]
		[Route("GetMyprofile")]
		public IActionResult GetMyprofile()
		{
			Myprofile Get = new Myprofile()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
			};

			response = GenericTetroONE.GetData(_connectionString, "USP_GetMyProfileDetails", Get);
			return Json(response);
		}


		[HttpPost]
		[Route("UpdateProfile")]
		public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfile request)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			string relativeFilePath = string.Empty, fileName = string.Empty;

			string employeeImage = !string.IsNullOrEmpty(request.UserImageFileName) ? request.UserImageFileName.Split('.')[0] : "";

			var claimsIdentity = (ClaimsIdentity)User.Identity;

			if (!string.IsNullOrEmpty(request.UserImageFileName) && !Guid.TryParse(employeeImage, out _))
			{
				string guid = Guid.NewGuid().ToString();
				string relativePath = Path.Combine("TetroOne");
				fileName = guid + Path.GetExtension(request.UserImageFileName)?.ToLowerInvariant();
				relativeFilePath = "..\\" + relativePath + "\\" + fileName;
				relativeFilePath = relativeFilePath.Replace("\\", "/");


				var uriClaim = claimsIdentity.FindFirst(ClaimTypes.Surname);
				if (uriClaim != null)
				{
					claimsIdentity.RemoveClaim(uriClaim);
				}
				claimsIdentity.AddClaim(new Claim(ClaimTypes.Surname, relativeFilePath));
				var newPrincipal = new ClaimsPrincipal(claimsIdentity);
				await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, newPrincipal);
			}
			else
			{
				relativeFilePath = request.ExistingImage;
			}

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();

				using (SqlCommand command = new SqlCommand("[dbo].[USP_UpdateMyProfileDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@UserImageFileName", request.UserImageFileName);
					command.Parameters.AddWithValue("@UserImageFilePath", relativeFilePath);
					command.Parameters.AddWithValue("@ContactNumber", request.ContactNumber);

					command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					command.ExecuteNonQuery();

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);
					response.Data = fileName;
				}
				connection.Close();

				string existemployeeImage = !string.IsNullOrEmpty(request.ExistingImage) ? Path.GetFileNameWithoutExtension(request.ExistingImage) : "";

				if (response.Status && !string.IsNullOrEmpty(request.UserImageFileName)
					&& Guid.TryParse(existemployeeImage, out _) && !string.IsNullOrEmpty(employeeImage))
				{

					var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
					string filePath = directoryPath + Convert.ToString(request.ExistingImage)
								.Replace("..", "").Replace("/", "\\");
					if (System.IO.File.Exists(filePath))
					{
						System.IO.File.Delete(filePath);
					}
				}
			}
			return Json(response);
		}

		[HttpPost]
		[Route("UpdateChangePassword")]

		public IActionResult UpdateChangePassword([FromBody] ChangePassword request)
		{
			request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
			response = GenericTetroONE.Execute(_connectionString, "USP_UpdatepasswordDetails", request);
			return Json(response);
		}


		[HttpGet]
		[Route("GetFranchise")]
		public IActionResult GetFranchise()
		{
			GetFranchise1 Get = new GetFranchise1()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
			};
			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetFranchiseDetails_Popup]", Get);
			return Json(response);
		}

		public class GetUserGroupDetailsPara { public int LoginUserId { get; set; } public int? UserTypeId { get; set; } }

		[HttpGet]
		[Route("GetUserGroupDetails")]
		public IActionResult GetUserGroupDetails(int UserTypeId)
		{
			GetUserGroupDetailsPara Get = new GetUserGroupDetailsPara()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				UserTypeId = UserTypeId
			};
			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetUserGroupDetails_UserTypeId]", Get);
			return Json(response);
		}

		[HttpGet]
		[Route("GetManageUser")]
		public IActionResult GetManageUser(string ModuleName)
		{
			ManageUser Get = new ManageUser()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				UserId = null,
				ModuleName = ModuleName,
			};
			response = GenericTetroONE.GetData(_connectionString, "USP_GetUserDetails", Get);
			return Json(response);
		}

		[HttpGet]
		[Route("GetManageUserId")]
		public IActionResult GetManageUserId(int UserId, string ModuleName)
		{
			ManageUser Get = new ManageUser()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				UserId = UserId,
				ModuleName = ModuleName,
			};
			response = GenericTetroONE.GetData(_connectionString, "USP_GetUserDetails", Get);
			return Json(response);
		}

		[HttpPost]
		[Route("InsertUser")]
		public async Task<IActionResult> InsertUser([FromBody] InsertUser request)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			string relativeFilePath = string.Empty, fileName = string.Empty;

			string employeeImage = !string.IsNullOrEmpty(request.UserImageFileName) ? request.UserImageFileName.Split('.')[0] : "";

			var claimsIdentity = (ClaimsIdentity)User.Identity;

			if (!string.IsNullOrEmpty(request.UserImageFileName) && !Guid.TryParse(employeeImage, out _))
			{
				string guid = Guid.NewGuid().ToString();
				string relativePath = Path.Combine("TetroOne");
				fileName = guid + Path.GetExtension(request.UserImageFileName)?.ToLowerInvariant();
				relativeFilePath = "..\\" + relativePath + "\\" + fileName;
				relativeFilePath = relativeFilePath.Replace("\\", "/");
			}
			else
			{
				relativeFilePath = null;
			}

			DataTable UserFranchiseMappingDetails = new DataTable();
			UserFranchiseMappingDetails = GenericTetroONE.ToDataTable(request.userFranchiseMappingDetails);

			DataTable UserDepartmentMappingDetails = new DataTable();
			UserDepartmentMappingDetails = GenericTetroONE.ToDataTable(request.userDepartmentMappingDetails);

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();

				using (SqlCommand command = new SqlCommand("[dbo].[USP_InsertUserDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@Salutation", request.Salutation);
					command.Parameters.AddWithValue("@FirstName", request.FirstName);
					command.Parameters.AddWithValue("@UserImageFileName", request.UserImageFileName);
					command.Parameters.AddWithValue("@UserImageFilePath", relativeFilePath);
					command.Parameters.AddWithValue("@ContactNumber", request.ContactNumber);
					command.Parameters.AddWithValue("@Email", request.Email);
					command.Parameters.AddWithValue("@Password", request.Password);
					command.Parameters.AddWithValue("@UserTypeId", request.UserTypeId);
					command.Parameters.AddWithValue("@UserGroupId", request.UserGroupId);
					command.Parameters.AddWithValue("@ContactId", request.ContactId ?? (object)DBNull.Value);
					command.Parameters.AddWithValue("@TVP_UserFranchiseMappingDetails", UserFranchiseMappingDetails);
					command.Parameters.AddWithValue("@TVP_UserDepartmentMappingDetails", UserDepartmentMappingDetails);

					command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					command.ExecuteNonQuery();

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);
					response.Data = fileName;
				}
				connection.Close();

				string existemployeeImage = !string.IsNullOrEmpty(request.ExistingImage) ? Path.GetFileNameWithoutExtension(request.ExistingImage) : "";

				if (response.Status && !string.IsNullOrEmpty(request.UserImageFileName)
					&& Guid.TryParse(existemployeeImage, out _) && !string.IsNullOrEmpty(employeeImage))
				{

					var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
					string filePath = directoryPath + Convert.ToString(request.ExistingImage)
								.Replace("..", "").Replace("/", "\\");
					if (System.IO.File.Exists(filePath))
					{
						System.IO.File.Delete(filePath);
					}
				}
			}
			return Json(response);
		}

		[HttpPost]
		[Route("UpdateUser")]
		public async Task<IActionResult> UpdateUser([FromBody] UpdateUser request)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			string relativeFilePath = string.Empty, fileName = string.Empty;

			string employeeImage = !string.IsNullOrEmpty(request.UserImageFileName) ? request.UserImageFileName.Split('.')[0] : "";

			var claimsIdentity = (ClaimsIdentity)User.Identity;

			if (!string.IsNullOrEmpty(request.UserImageFileName) && !Guid.TryParse(employeeImage, out _))
			{
				string guid = Guid.NewGuid().ToString();
				string relativePath = Path.Combine("TetroOne");
				fileName = guid + Path.GetExtension(request.UserImageFileName)?.ToLowerInvariant();
				relativeFilePath = "..\\" + relativePath + "\\" + fileName;
				relativeFilePath = relativeFilePath.Replace("\\", "/");

				if (_userId == request.UserId)
				{
					var uriClaim = claimsIdentity.FindFirst(ClaimTypes.Surname);
					if (uriClaim != null)
					{
						claimsIdentity.RemoveClaim(uriClaim);
					}
					claimsIdentity.AddClaim(new Claim(ClaimTypes.Surname, relativeFilePath));
					var newPrincipal = new ClaimsPrincipal(claimsIdentity);
					await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, newPrincipal);
				}
			}
			else
			{
				relativeFilePath = request.ExistingImage;
			}

			DataTable UserFranchiseMappingDetails = new DataTable();
			UserFranchiseMappingDetails = GenericTetroONE.ToDataTable(request.userFranchiseMappingDetails);

			DataTable UserDepartmentMappingDetails = new DataTable();
			UserDepartmentMappingDetails = GenericTetroONE.ToDataTable(request.userDepartmentMappingDetails);

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();

				using (SqlCommand command = new SqlCommand("[dbo].[USP_UpdateUserDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@UserId", request.UserId);
					command.Parameters.AddWithValue("@Salutation", request.Salutation);
					command.Parameters.AddWithValue("@FirstName", request.FirstName);
					command.Parameters.AddWithValue("@UserImageFileName", request.UserImageFileName);
					command.Parameters.AddWithValue("@UserImageFilePath", relativeFilePath);
					command.Parameters.AddWithValue("@ContactNumber", request.ContactNumber);
					command.Parameters.AddWithValue("@Email", request.Email);
					command.Parameters.AddWithValue("@Password", request.Password);
					command.Parameters.AddWithValue("@UserTypeId", request.UserTypeId);
					command.Parameters.AddWithValue("@UserGroupId", request.UserGroupId);
					command.Parameters.AddWithValue("@ContactId", request.ContactId ?? (object)DBNull.Value);
					command.Parameters.AddWithValue("@TVP_UserFranchiseMappingDetails", UserFranchiseMappingDetails);
					command.Parameters.AddWithValue("@TVP_UserDepartmentMappingDetails", UserDepartmentMappingDetails);

					command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					command.ExecuteNonQuery();

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);
					response.Data = fileName;
				}
				connection.Close();

				string existemployeeImage = !string.IsNullOrEmpty(request.ExistingImage) ? Path.GetFileNameWithoutExtension(request.ExistingImage) : "";

				if (response.Status && !string.IsNullOrEmpty(request.UserImageFileName)
					&& Guid.TryParse(existemployeeImage, out _) && !string.IsNullOrEmpty(employeeImage))
				{

					var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
					string filePath = directoryPath + Convert.ToString(request.ExistingImage)
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
		[Route("DeleteUserId")]
		public IActionResult DeleteUserId(int UserId)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataSet ds = new DataSet();
			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();

				using (SqlCommand command = new SqlCommand("[dbo].[USP_DeleteUserDetails]", connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@UserId", UserId);

					command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					SqlDataAdapter adapter = new SqlDataAdapter(command);
					adapter.Fill(ds);

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);

				}

				if (response.Status)
				{
					if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
					{
						var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
						foreach (DataRow item in ds.Tables[0].Rows)
						{
							string filePath = directoryPath + Convert.ToString(item["UserImageFilePath"])
								.Replace("..", "").Replace("/", "\\");
							if (System.IO.File.Exists(filePath))
							{
								System.IO.File.Delete(filePath);
							}
						}
					}
				}

				return Json(response);
			}
		}

	}
}
