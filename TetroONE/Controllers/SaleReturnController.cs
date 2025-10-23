using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;

namespace TetroONE.Controllers
{
	[Authorize]
	[Route("SaleReturn")]
	public class SaleReturnController : BaseController
	{
		public SaleReturnController(IConfiguration configuration) : base(configuration)
		{

		}
		public IActionResult SaleReturn(int SaleReturnId = 0)
		{
			return View(SaleReturnId);
		}


		[HttpGet]
		[Route("GetSaleReturn")]
		public IActionResult GetSaleReturn(DateTime FromDate, DateTime ToDate, int FranchiseId,int? SaleReturnId)
		{
			GetSaleReturn request = new GetSaleReturn()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleReturnId = SaleReturnId,
				FromDate = FromDate,
				ToDate = ToDate,
				FranchiseId = FranchiseId

			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetSaleReturnDetails]", request);
			return Json(response);
		}

		[HttpGet]
		[Route("GetProductPrice")]
		public IActionResult GetProductPrice(int UnitId ,int ProductId, int FranchiseId,int DistributorId)
		{
			GetProductPrice request = new GetProductPrice()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				UnitId = UnitId,
				ProductId = ProductId,
                FranchiseId= FranchiseId,
                DistributorId= DistributorId


            };

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetUnitPriceDetails]", request);
			return Json(response);
		}

		[HttpGet]
		[Route("GetDistributorByFranchiseId")]
		public IActionResult GetDistributorByFranchiseId(int FranchiseId)
		{
			Getdistributor request = new Getdistributor()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetDistributor_byFranchiseId]", request);
			return Json(response);
		}

		[HttpPost]
		[Route("InsertUpdateSaleReturn")]
		public IActionResult InsertUpdateSaleReturn([FromBody] InsertSaleReturnDetails request)
		{
			DataTable inWardProductMapping = new DataTable();
			inWardProductMapping = GenericTetroONE.ToDataTable(request.SaleReturnProductMappingDetails);

			request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
			request.TVP_SaleReturnProductMappingDetails = inWardProductMapping;

			if (request.SaleReturnId > 0)
			{
				response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdateSaleReturnDetails]", request, "SaleReturnProductMappingDetails");
			}
			else
			{
				string[] exclude = { "SaleReturnId", "SaleReturnProductMappingDetails" };
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertSaleReturnDetails]", request, exclude);
			}
			return Json(response);

		}

		[HttpGet]
		[Route("DeleteSaleReturnDetails")]
		public IActionResult DeleteSaleReturnDetails(int SaleReturnId)
		{
			DeleteSaleReturn getInfo = new DeleteSaleReturn()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleReturnId = SaleReturnId,


			};
			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteSaleReturnDetails]", getInfo);
			return Json(response);
		}

		[HttpGet]
		[Route("NotNullGetSalesReturn")]
		public IActionResult NotNullGetSalesReturn(int SaleReturnId, DateTime FromDate, DateTime ToDate, int FranchiseId)
		{

			GetSaleReturn getInfo = new GetSaleReturn()
			{

				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				SaleReturnId = SaleReturnId,
				FromDate = null,
				ToDate = null,
				FranchiseId = null


			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetSaleReturnDetails]", getInfo);
			return Json(response);
		}

	}
}
