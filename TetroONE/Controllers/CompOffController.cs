using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("CompOff")]
    public class CompOffController : BaseController
    {
        public CompOffController(IConfiguration configuration) : base(configuration)
        {

        }
        [Route("")]
        public IActionResult Leave()
        {
            return View();
        }
         
        [HttpGet]
        [Route("GetCompOff")]
        public IActionResult GetCompOff(int? CompOffId)
        {
            GetCompOff Get = new GetCompOff()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                CompOffId = CompOffId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetCompensatoryOffDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InserUpdatetCompensatoryOff")]
        public IActionResult InserUpdatetLeave([FromBody] InserUpdatetCompensatoryOff request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted1 = { "CompOffId", "CompOffStatusId", "Comments" };
            string[] Exculuted2 = { "AvlCompOff"};
            if (request.CompOffId == null)
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertCompensatoryOffDetails]", request, Exculuted1);
            else
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateCompensatoryOffDetails]", request, Exculuted2);

            return Json(response);
        }
         
        [HttpGet]
        [Route("DeleteCompOff")]
        public IActionResult DeleteCompOff(int? CompOffId)
        {
            GetCompOff Get = new GetCompOff()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                CompOffId = CompOffId
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteCompensatoryOffDetails]", Get);
            return Json(response);
        }
    }
}
