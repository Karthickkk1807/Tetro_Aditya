using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Twilio.TwiML.Voice;

namespace TetroONE.Controllers
{

    [Authorize]
    [Route("Leave")]
    public class LeaveController : BaseController
    {
        public LeaveController(IConfiguration configuration) : base(configuration)
        {

        }
        [Route("")]
        public IActionResult Leave()
        {
            return View();
        }

        [HttpGet]
        [Route("GetLeave")]
        public IActionResult GetLeave(int? LeaveId)
        {
            GetLeave Get = new GetLeave()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                LeaveId = LeaveId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetLeaveDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InserUpdatetLeave")]
        public IActionResult InserUpdatetLeave([FromBody] InserUpdatetLeave request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = { "LeaveId", "LeaveStatusId", "Comments" };
            if (request.LeaveId == null)
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertLeaveDetails]", request, Exculuted);
            else
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateLeaveDetails]", request);

            return Json(response);
        }

        [HttpPost]
        [Route("GetStatus")]
        public IActionResult GetStatus([FromBody] GetStatus request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetMasterInfoDetails_Status]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteLeave")]
        public IActionResult DeleteLeave(int? LeaveId)
        {
            GetLeave Get = new GetLeave()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                LeaveId = LeaveId
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteLeaveDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetRemainingDetails")]
        public IActionResult GetRemainingDetails(int? ModuleId, string? Type, int EmployeeId, string ModuleName, DateTime Date)
        {
            GetRemainingDetails Get = new GetRemainingDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ModuleId = ModuleId,
                Type = Type,
                EmployeeId = EmployeeId,
                ModuleName = ModuleName,
                Date = Date
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetRemainingDetails]", Get);
            return Json(response);
        }
    }
}