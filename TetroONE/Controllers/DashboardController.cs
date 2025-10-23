using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;
using Newtonsoft.Json;
using TetroONE.Controllers;
using DocumentFormat.OpenXml.Bibliography;
using TetroONE.Constant;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Dashboard")]
    public class DashboardController : BaseController
    {
        public DashboardController(IConfiguration configuration) : base(configuration)
        {

        }

        public IActionResult Dashboard()
        {
            if (User.Identity.IsAuthenticated)
            {
                var authenticationScheme = User.Identity.AuthenticationType;
                if (authenticationScheme == CookieAuthenticationDefaults.AuthenticationScheme)
                {
                    _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                    DataSet dst = new DataSet();

                    using (SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        connection.Open();
                        using (SqlCommand command = new SqlCommand("[dbo].[USP_GetLandingPageDetails]", connection))
                        {
                            command.CommandType = CommandType.StoredProcedure;

                            command.Parameters.AddWithValue("@LoginUserId", _userId);

                            command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                            command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;


                            SqlDataAdapter adapter = new SqlDataAdapter(command);
                            adapter.Fill(dst);
                            int status = (int)command.Parameters["@Status"].Value;
                            string message = command.Parameters["@Message"].Value.ToString();

                            response.Message = message;
                            response.Status = Convert.ToBoolean(status);

                            if (response.Status)
                            {
                                DataTable dt = new DataTable();
                                dt = dst.Tables[0];
                                response.Message = Convert.ToString((UserRole)Convert.ToInt32(dt.Rows[0]["UserGroupId"]));

                                SetAccess(dst.Tables[1]);
                            }
                        }
                    }
                } 
            }

            return View();
        }

        private void SetAccess(DataTable dt)
        {
            List<UserAccess> access = GenericTetroONE.ConvertDataTableToList<UserAccess>(dt);
            string json = JsonConvert.SerializeObject(access);
            HttpContext.Session.SetString("UserAccess", json);
        }

        [HttpGet]
        [Route("GetDashBoard1")]
        public IActionResult GetDashBoard1(DateTime FromDate, DateTime ToDate, int FranchiseId,int ReportCategoryId)
        {
            GetDashBoard1 request = new GetDashBoard1()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                FromDate = FromDate,
                ToDate = ToDate,
                ReportCategoryId = ReportCategoryId

            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDashBoardDetails_1]", request);
            return Json(response);

        }
         
        [HttpGet]
        [Route("GetDashBoard2")]
        public IActionResult GetDashBoard2(DateTime FromDate, DateTime ToDate, int FranchiseId, int ReportCategoryId,int ContactId)
        {
            GetDashBoard2 request = new GetDashBoard2()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                FromDate = FromDate,
                ToDate = ToDate,
                ReportCategoryId = ReportCategoryId,
                ContactId = ContactId

            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDashBoardDetails_2]", request);
            return Json(response);

        }


        [HttpGet]
        [Route("GetDashBoard3")]
        public IActionResult GetDashBoard3(DateTime FromDate, DateTime ToDate, int FranchiseId, int DistributorId)
        {
            GetDashBoard3 request = new GetDashBoard3()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                FromDate = FromDate,
                ToDate = ToDate,
                DistributorId = DistributorId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDashBoardDetails_3]", request);
            return Json(response);

        }



        [HttpGet]
        [Route("GetDropDown")]
        public IActionResult GetDropDown(DateTime FromDate, DateTime ToDate)
        {
            GetDropDown request = new GetDropDown()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FromDate = FromDate,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetDashBoardFilterCategoryDetails]", request);
            return Json(response);

        }

    }
}
