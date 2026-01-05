using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using TetroONE.Constant;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [AllowAnonymous]
    [Route("ProductionQRCode")]
    public class ProductionQRCodeLoginController : Controller
    {
        private readonly string _connectionString = string.Empty;
        public ProductionQRCodeLoginController(IConfiguration configuration)
        {
            _connectionString = Convert.ToString(configuration["ConnectionStrings:TetroONE"]);
        }
         
        public CommonResponse response = new CommonResponse();

        [Route("ProductionQRCodeLogin")]
        public IActionResult ProductionQRCodeLogin()
        {
            return View(); 
        }
        
        [AllowAnonymous]
        [HttpPost]
        [Route("ProductionQRCodeLoginValue")]
        public async Task<IActionResult> LoginValue([FromBody] LoginRequest request)
        {
            CommonResponse response = new CommonResponse();
            if (!string.IsNullOrEmpty(request.Username) && !string.IsNullOrEmpty(request.Password))
            { 
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("[dbo].[USP_UserLogin_QRCode]", connection))
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
                        response.Data = GenericTetroONE.dataSetToJSON(ds);
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
    }
}
