using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace TetroONE.Controllers
{
	[Authorize]
	[Route("Permission")]
	public class PermissionController : BaseController
	{
		public PermissionController(IConfiguration configuration) : base(configuration)
		{

		}
		[Route("")]
		public IActionResult Permission()
		{
			return View();
		}

		[HttpGet]
		[Route("GetPermission")]
		public IActionResult GetPermission(int? PermissionId)
		{
			GetPermission Get = new GetPermission()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				PermissionId = PermissionId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPermissionDetails]", Get);
			return Json(response);
		}

		[HttpPost]
		[Route("InserUpdatetPermission")]
		public IActionResult InserUpdatetPermission([FromBody] InserUpdatetPermission request)
		{
			request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			string[] Exculuted = { "PermissionId", "PermissionStatusId", "Comments" };
			if (request.PermissionId == null)
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertPermissionDetails]", request, Exculuted);
			else
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdatePermissionDetails]", request);

			return Json(response);
		}

		[HttpGet]
		[Route("DeletePermission")]
		public IActionResult DeletePermission(int? PermissionId)
		{
			GetPermission Get = new GetPermission()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				PermissionId = PermissionId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePermissionDetails]", Get);
			return Json(response);
		}







	}
}
