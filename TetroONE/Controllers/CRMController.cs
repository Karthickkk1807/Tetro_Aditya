using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;
using TetroPos.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("CRM")]
    public class CRMController : BaseController
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILog _logger;
        public CRMController(IConfiguration configuration, IWebHostEnvironment hostingEnvironment, ILog logger) : base(configuration)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Route("Visitor")]
        public IActionResult Visitor()
        {
            return View();
        }

        [HttpGet]
        [Route("GetVisitor")]
        public IActionResult GetVisitor(int VisitorId, int PlantId, DateTime? FromDate, DateTime? ToDate)
        {
            GetVisitor getInfo = new GetVisitor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                VisitorId = VisitorId == 0 ? null : VisitorId,
                PlantId = PlantId,
                FromDate = FromDate?.AddDays(1),
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetVisitorDetails]", getInfo);
            return Json(response);
        }
         
        [HttpPost]
        [Route("InsertVistorsDetails")]
        public IActionResult InsertVistorsDetails([FromBody] InsertVistorsDetails request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string storedProcedure = (request.VisitorId != null)
                 ? "[dbo].[USP_UpdateVisitorDetails]"
                 : "[dbo].[USP_InsertVisitorDetails]";

            string[] ExculutedForInsert = { "VisitorId", "VisitorStatusId" };
            string[] ExculutedForUpdate = { };
            if (storedProcedure == "[dbo].[USP_InsertVisitorDetails]")
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, ExculutedForInsert);
            else
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, ExculutedForUpdate);

            return Json(response);
        }

        [HttpGet]
        [Route("GetVisitorDelete")]
        public IActionResult GetVisitorDelete(int VisitorId)
        {
            GetVisitorDelete getInfo = new GetVisitorDelete()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                VisitorId = VisitorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteVisitorDetails]", getInfo);
            return Json(response);
        }

    }
}
