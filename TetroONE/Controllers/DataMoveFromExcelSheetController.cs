using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace TetroONE.Controllers
{
    public class DataMoveFromExcelSheetController : BaseController
    {
        public DataMoveFromExcelSheetController(IConfiguration configuration) : base(configuration)
        {
            
        }

        public class DataMoveFromExcelSheetModel
        {
            public int DataMoveFromExcelSheetId { get; set; }
            public string Name { get; set; }
            public string Address { get; set; }
            public decimal Quantity { get; set; }
        }

        [HttpPost]
        public IActionResult UploadExcelData([FromBody] List<DataMoveFromExcelSheetModel> data)
        {
            if (data == null || !data.Any())
                return BadRequest("No data received");

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    foreach (var item in data)
                    {
                        using (SqlCommand cmd = new SqlCommand(@"
                            INSERT INTO DataMoveFromExcelSheet (DataMoveFromExcelSheetId, Name, Address, Quantity)
                            VALUES (@DataMoveFromExcelSheetId, @Name, @Address, @Quantity)"
                        , connection))
                        {
                            cmd.Parameters.AddWithValue("@DataMoveFromExcelSheetId", item.DataMoveFromExcelSheetId);
                            cmd.Parameters.AddWithValue("@Name", (object?)item.Name ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@Address", (object?)item.Address ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@Quantity", item.Quantity);

                            cmd.ExecuteNonQuery();
                        }
                    }
                }

                return Ok("Inserted Successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
