using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using TetroONE.Controllers; 
using Newtonsoft.Json;
using TetroONE;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("UserAccess")]
    public class UserAccessController : BaseController
    {
        public UserAccessController(IConfiguration configuration) : base(configuration)
        {

        }
        [Authorize]
        [Route("")]
        public IActionResult UserAccess()
        {
            return View();
        }

        [HttpGet]
        [Route("GetUserAcces")]
        public IActionResult GetUserAcces(int FranchiseId, int Value, string Category, string? Search)
        {

            GetUserAcces getUserAcces = new GetUserAcces()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                Category = Category,
                Value = Value,
                Search = Search,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetUserAccessDetails]", getUserAcces);
            return Json(response);
        }


        [HttpGet]
        [Route("GetReportValueUserAcces")]
        public IActionResult GetReportValueUserAcces(string ModuleName)
        {

            GetReportValueUserAcces getUserAcces = new GetReportValueUserAcces()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ModuleName = ModuleName,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetReportValueDetails]", getUserAcces);
            return Json(response);
        }


        [HttpPost]
        [Route("UpdateUseraccess")]
        public IActionResult UpdateUseraccess([FromBody] UpdateUseraccess request)
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataTable UserActionMapping = new DataTable();
            UserActionMapping = ToDataTable(request.userActionMappingDetails);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[USP_UpdateUserAccessDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@TVP_UserActionMappingDetails", UserActionMapping);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    command.ExecuteNonQuery();

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }
                connection.Close();
            }
            return Json(response);
        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            // Get all the properties of the type
            var properties = typeof(T).GetProperties();
            foreach (var property in properties)
            {
                dataTable.Columns.Add(property.Name, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
            }

            foreach (var item in items)
            {
                var values = new object[properties.Length];
                for (int i = 0; i < properties.Length; i++)
                {
                    values[i] = properties[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }

            return dataTable;
        }

    }
}
