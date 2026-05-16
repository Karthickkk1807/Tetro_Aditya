using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using TetroONE.Controllers;
using TetroONE.Models;

[Authorize]
[Route("EPSON")]
public class EPSONController : BaseController
{
    public EPSONController(IConfiguration configuration) : base(configuration)
    {
         
    }

    // ✅ ADD TO QUEUE
    [HttpGet("PrintDotMatrix")]
    public IActionResult PrintDotMatrix(int ModuleId, string ModuleName)
    {
        try
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintPDFDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@ModuleName", ModuleName);
                    command.Parameters.AddWithValue("@ModuleId", ModuleId);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    DataSet ds = new DataSet();
                    new SqlDataAdapter(command).Fill(ds);

                    var data = new OutWardEPSONPrint
                    {
                        CompanyName = ds.Tables[0].Rows[0]["CompanyName"]?.ToString(),
                        CompanyAddress1 = ds.Tables[0].Rows[0]["CompanyAddress1"]?.ToString(),
                        CompanyAddress2 = ds.Tables[0].Rows[0]["CompanyAddress2"]?.ToString(),
                        CompanyPhone = ds.Tables[0].Rows[0]["CompanyPhone"]?.ToString(),
                        CompanyGST = ds.Tables[0].Rows[0]["CompanyGST"]?.ToString(),
                        CompanyPAN = ds.Tables[0].Rows[0]["CompanyPAN"]?.ToString(),

                        ClientName = ds.Tables[1].Rows[0]["ClientName"]?.ToString(),
                        DCNo = ds.Tables[1].Rows[0]["DCNo"]?.ToString(),
                        ClientAddress1 = ds.Tables[1].Rows[0]["ClientAddress1"]?.ToString(),
                        DCDate = ds.Tables[1].Rows[0]["DCDate"]?.ToString(),
                        ClientAddress2 = ds.Tables[1].Rows[0]["ClientAddress2"]?.ToString(),
                        Time = ds.Tables[1].Rows[0]["Time"]?.ToString(),
                        ClientAddress3 = ds.Tables[1].Rows[0]["ClientAddress3"]?.ToString(),
                        ClientType = ds.Tables[1].Rows[0]["ClientType"]?.ToString(),
                        ClientGST = ds.Tables[1].Rows[0]["ClientGST"]?.ToString(),
                        ClientPAN = ds.Tables[1].Rows[0]["ClientPAN"]?.ToString(),

                        YourDCNo = ds.Tables[2].Rows[0]["YourDCNo"]?.ToString(),
                        Colour = ds.Tables[2].Rows[0]["Colour"]?.ToString(),
                        OrderNO = ds.Tables[2].Rows[0]["OrderNO"]?.ToString(),
                        Process = ds.Tables[2].Rows[0]["Process"]?.ToString(),
                        InwardNo = ds.Tables[2].Rows[0]["InwardNo"]?.ToString(),
                        VehicleNo = ds.Tables[2].Rows[0]["VehicleNo"]?.ToString(),
                        ActualNo = ds.Tables[2].Rows[0]["ActualNo"]?.ToString(),
                        ApprxGoodsValue = ds.Tables[2].Rows[0]["ApprxGoodsValue"]?.ToString(),

                        TotalRoll = ds.Tables[3].Rows[0]["TotalRoll"]?.ToString(),
                        TotalInwardWt = ds.Tables[3].Rows[0]["TotalInwardWt"]?.ToString(),
                        TotalDeliveryWt = ds.Tables[3].Rows[0]["TotalDeliveryWt"]?.ToString(),

                        ProductItemData = ds.Tables[5].AsEnumerable().Select(r => new ProductItem
                        {
                            FabricQuality = r["FabricQuality"]?.ToString(),
                            Dia = r["Dia"]?.ToString(),
                            Roll = r["Roll"]?.ToString(),
                            InwardWt = r["InwardWt"]?.ToString(),
                            DeliveryWt = r["DeliveryWt"]?.ToString()
                        }).ToList()
                    };

                    lock (PrintQueueStore.Lock)
                    {
                        PrintQueueStore.Queue.Add(new PrintQueueItem
                        {
                            Id = PrintQueueStore.Queue.Count + 1,
                            Data = data,
                            IsPrinted = false,
                            IsProcessing = false
                        });
                    }

                    return Json(new { success = true });
                }
            }
        }
        catch (Exception ex)
        {
            return Json(new { success = false, message = ex.Message });
        }
    }

    // ✅ GET JOB
    [AllowAnonymous]
    [HttpGet("GetPendingPrint")]
    public IActionResult GetPendingPrint()
    {
        lock (PrintQueueStore.Lock)
        {
            var item = PrintQueueStore.Queue
                .FirstOrDefault(x => !x.IsPrinted && !x.IsProcessing);

            if (item == null)
                return Json(new { success = false });

            item.IsProcessing = true;

            return Json(new { success = true, id = item.Id, data = item.Data });
        }
    }

    // ✅ MARK PRINTED
    [AllowAnonymous]
    [HttpPost("MarkPrinted")]
    public IActionResult MarkPrinted(int id)
    {
        lock (PrintQueueStore.Lock)
        {
            var item = PrintQueueStore.Queue.FirstOrDefault(x => x.Id == id);
            if (item != null)
            {
                item.IsPrinted = true;
                item.IsProcessing = false;
            }
        }
        return Ok();
    }

    // ❌ FAILED
    [AllowAnonymous]
    [HttpPost("MarkFailed")]
    public IActionResult MarkFailed(int id)
    {
        lock (PrintQueueStore.Lock)
        {
            var item = PrintQueueStore.Queue.FirstOrDefault(x => x.Id == id);
            if (item != null)
                item.IsProcessing = false;
        }
        return Ok();
    }
}