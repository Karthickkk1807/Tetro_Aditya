using TetroONE.Models;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("TeamInfo")]
    public class TeamInfoController : BaseController
    {
        public TeamInfoController(IConfiguration configuration) : base(configuration)
        {

        }

        [Route("")]
        public IActionResult TeamInfo()
        {
            return View();
        }

        [HttpGet]
        [Route("GetTeamInfo")]
        public IActionResult GetTeamInfo(int? EmployeeId)
        {
            GetTeamInfo GetMyTeam = new GetTeamInfo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                EmployeeId = EmployeeId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetMyTeamDetails]", GetMyTeam);
            return Json(response);
        }
    }
}
