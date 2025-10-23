using TetroONE.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using TetroONE.Constant;

namespace TetroONE.Controllers
{
	[Authorize]
	public class LoginController : Controller
	{
		private readonly IConfiguration _configuration;


		public LoginController(IConfiguration configuration)
		{
			_configuration = configuration;
		}


		[AllowAnonymous]
		public IActionResult Login()
		{
			if (User.Identity.IsAuthenticated)
			{
				var authenticationScheme = User.Identity.AuthenticationType;
				if (authenticationScheme == CookieAuthenticationDefaults.AuthenticationScheme)
				{
					var userClaims = ((ClaimsIdentity)User.Identity).Claims;
					var roleClaim = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

					if (roleClaim != null && roleClaim.Value != "")
					{
						return RedirectToAction("Dashboard", "Dashboard");
					}
				}
			}
			return View();
		}

		[AllowAnonymous]
		[HttpPost]
		public async Task<IActionResult> LoginValue([FromBody] LoginRequest request)
		{

			CommonResponse response = new CommonResponse();
			if (!string.IsNullOrEmpty(request.Username) && !string.IsNullOrEmpty(request.Password))
			{
				string connectionString = _configuration.GetConnectionString("TetroONE");

				using (SqlConnection connection = new SqlConnection(connectionString))
				{
					connection.Open();

					using (SqlCommand command = new SqlCommand("[dbo].[USP_UserLogin]", connection))
					{
						command.CommandType = CommandType.StoredProcedure;

						command.Parameters.AddWithValue("@Username", request.Username);
						command.Parameters.AddWithValue("@Password", request.Password);

						command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
						command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

						DataSet ds = new DataSet();
						SqlDataAdapter adapter = new SqlDataAdapter(command);
						adapter.Fill(ds);

						int status = (int)command.Parameters["@Status"].Value;
						string message = command.Parameters["@Message"].Value.ToString();

						response.Message = message;
						response.Status = Convert.ToBoolean(status);

						if (response.Status)
						{
							DataTable dt = new DataTable();
							dt = ds.Tables[0];

							var claims = new List<Claim>
							{
								new Claim(ClaimTypes.Name,Convert.ToString(dt.Rows[0]["UserName"])),
								new Claim(ClaimTypes.Role, Convert.ToString((UserRole)Convert.ToInt32(dt.Rows[0]["UserGroupId"]))),
								new Claim(ClaimTypes.NameIdentifier, Convert.ToString(dt.Rows[0]["UserId"])),
								new Claim(ClaimTypes.Email, Convert.ToString(dt.Rows[0]["Email"])),
								new Claim(ClaimTypes.DenyOnlySid, Convert.ToString(dt.Rows[0]["CompanyId"])),
								new Claim(ClaimTypes.Surname, Convert.ToString(dt.Rows[0]["UserImageFilePath"])),
								new Claim(ClaimTypes.System, Convert.ToString(dt.Rows[0]["CompanyName"])),
								new Claim(ClaimTypes.Uri, Convert.ToString(dt.Rows[0]["CompanyLogoFilePath"])),
								new Claim(ClaimTypes.UserData,  Convert.ToString(dt.Rows[0]["EmployeeId"])),
								new Claim(ClaimTypes.GroupSid,  Convert.ToString(dt.Rows[0]["UserGroupId"])),
							};
							var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
							var authProperties = new AuthenticationProperties() { IsPersistent = true };
							await HttpContext.SignOutAsync();
							await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
							SetAccess(ds.Tables[1]);
						}
					}
				}
			}
			else
			{
				response.Status = false;
				response.Message = "Username / Password Cannot Empty";
			}
			return Json(response);
		}

		[Authorize]
		public async Task<IActionResult> Logout()
		{
			await HttpContext.SignOutAsync();
			await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
			Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
			Response.Headers["Pragma"] = "no-cache";
			Response.Headers["Expires"] = "0";
			HttpContext.Session.Clear();
			return Json(true);
		}
		private void SetAccess(DataTable dt)
		{
			List<UserAccess> access = GenericTetroONE.ConvertDataTableToList<UserAccess>(dt);
			string json = JsonConvert.SerializeObject(access);
			HttpContext.Session.SetString("UserAccess", json);
		} 
	}
}
