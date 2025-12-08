using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [AllowAnonymous]
    [Route("ProductionQRCode")]
    public class ProductionQRCodeController : Controller
    {
        private readonly string _connectionString = string.Empty;
        public ProductionQRCodeController(IConfiguration configuration)
        {
            _connectionString = Convert.ToString(configuration["ConnectionStrings:TetroONE"]);
        }

        public CommonResponse response = new CommonResponse();

        [HttpGet("QRCodePop")]
        public IActionResult QRCodePop()
        {
            return View();
        }

        public class GetProductionLogDetailsMobClass
        {
            public int? ProductionPlanId { get; set; }
        }
         
        public class InsertUpdateProductionLogMobClass
        {
            public int? ProductionPlanId { get; set; }
            public int? ProductionLogId { get; set; }
            public int? ProcessTypeId { get; set; }
            public decimal? Quantity { get; set; }
            public int? ProductionLogStatusId { get; set; }
            public string? Remarks { get; set; } 
            public int? PlantId { get; set; } 
        }

        [HttpGet]
        [Route("GetProductionLogDetailsMob")]
        public IActionResult GetProductionLogDetailsMob(int? ProductionPlanId)
        {
            GetProductionLogDetailsMobClass request = new GetProductionLogDetailsMobClass()
            {
                ProductionPlanId = ProductionPlanId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionLogDetails_Mob]", request);
            return Json(response);
        }
        
        [HttpPost]
        [Route("InsertUpdateProductionLogMob")]
        public IActionResult InsertUpdateProductionLogMob([FromBody] InsertUpdateProductionLogMobClass request)
        { 
            string storedProcedure = "[dbo].[USP_UpdateProductionLogDetails_Mob]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request);
            return Json(response);
        }

    }
}
