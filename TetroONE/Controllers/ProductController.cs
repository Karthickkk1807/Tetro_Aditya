using DocumentFormat.OpenXml.Bibliography;
using TetroONE.Models;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using Twilio.TwiML.Voice;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Product")]
    public class ProductController : BaseController
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILog _logger;
        public ProductController(IConfiguration configuration, IWebHostEnvironment hostingEnvironment, ILog logger) : base(configuration)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Route("Product")]
        public IActionResult Product()
        {
            return View();
        }

        [HttpGet]
        [Route("GetProduct")]
        public IActionResult GetProduct(int PlantId, int ProductTypeId)
        {
            GetProduct GetProduct = new GetProduct()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductTypeId = ProductTypeId,
                ProductId = null,
                PlantId = PlantId,
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductDetails]", GetProduct);
            return Json(response);
        }

        [HttpGet]
        [Route("GetProductId")]
        public IActionResult GetProductId(int ProductId, int PlantId, int ProductTypeId)
        {
            GetProduct GetProduct = new GetProduct()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductTypeId = ProductTypeId,
                ProductId = ProductId,
                PlantId = PlantId
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductDetails]", GetProduct);
            return Json(response);
        }
         
        public partial class GetProductProcess_1
        {
            public int LoginUserId	 { get; set; }
            public string? ModuleName { get; set; }
        }

        [HttpGet]
        [Route("GetProductProcess")]
        public IActionResult GetProductProcess(string ModuleName)
        {
            GetProductProcess_1 GetProduct = new GetProductProcess_1()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ModuleName = ModuleName

            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionStagesDetails_Product]", GetProduct);
            return Json(response);
        }

        public class DeleteProductClass { public int LoginUserId { get; set; } public int? ProductId { get; set; } }
        [HttpGet]
        [Route("DeleteProduct")]
        public IActionResult DeleteProduct(int ProductId)
        {
            DeleteProductClass GetProduct = new DeleteProductClass()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductId = ProductId
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductDetails]", GetProduct);
            return Json(response);
        }
         
        [HttpPost]
        [Route("InsertUpdateProductDetails")]
        public async Task<IActionResult> InsertUpdateProductDetails([FromBody] InsertUpdateDetails request)
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            
            DataTable ProductPlantMappingDetails = new DataTable();
            ProductPlantMappingDetails = GenericTetroONE.ToDataTable(request.ProductPlantMappingDetails);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value); 
            request.TVP_ProductPlantMappingDetails = ProductPlantMappingDetails;

            var spName = string.Empty;
            string[] Exclude;

            if (request.ProductId != null && request.ProductId != 0)
            {
                Exclude = new string[] { "ProductPlantMappingDetails" };
                spName = "[dbo].[USP_UpdateProductDetails]";
            }
            else
            {
                Exclude = new string[] { "ProductId", "ProductPlantMappingDetails" };
                spName = "[dbo].[USP_InsertProductDetails]";
            }

            response = GenericTetroONE.Execute(_connectionString, spName, request, Exclude); 
            return Json(response);
        }

        [HttpGet]
        [Route("GetManPower")]
        public IActionResult GetManPower()
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetProductManPowerDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    //command.Parameters.AddWithValue("@Type", Type);
                    //command.Parameters.AddWithValue("@ModuleName", ModuleName);
                    //command.Parameters.AddWithValue("@ModuleName", ModuleName ?? (object)DBNull.Value)) != ModuleName ? ModuleName : DBNull.Value;

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
            }
            return Json(response);
        }

        [HttpGet]
        [Route("GetProductRawMaterial")]
        public IActionResult GetProductRawMaterial(int? Type, string ModuleName)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetProductRawMaterialDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@Type", Type);
                    command.Parameters.AddWithValue("@ModuleName", ModuleName);
                    //command.Parameters.AddWithValue("@ModuleName", ModuleName ?? (object)DBNull.Value)) != ModuleName ? ModuleName : DBNull.Value;

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
            }
            return Json(response);
        }

        [HttpPost]
        [Route("InsertProductManPower")]
        public IActionResult InsertProductManPower([FromBody] InsertProductManPower request)
        {
            DataTable ManPowerData = new DataTable();
            ManPowerData = GenericTetroONE.ToDataTable(request.productManPowerDetails);

            DataTable ManPowerProductionStagesMappingDetails = new DataTable();
            ManPowerProductionStagesMappingDetails = GenericTetroONE.ToDataTable(request.productManPowerPSMappingDetails);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            request.TVP_ProductManPowerDetails = ManPowerData;
            request.TVP_ProductManPowerPSMappingDetails = ManPowerProductionStagesMappingDetails;

            string[] Exclude = { "productManPowerDetails", "productManPowerPSMappingDetails" };
            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertProductManPowerDetails]", request, Exclude);

            return Json(response);
        }
        
        
        [HttpPost]
        [Route("InsertProductRawMaterial")]
        public IActionResult InsertProductRawMaterial([FromBody] InsertProductRawMaterial request)
        {
            DataTable ProductRawMaterialDetails = new DataTable();
            ProductRawMaterialDetails = GenericTetroONE.ToDataTable(request.productRawMaterialDetails);

            DataTable ProductRawMaterialMappingDetails = new DataTable();
            ProductRawMaterialMappingDetails = GenericTetroONE.ToDataTable(request.productRawMaterialMappingDetails);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            request.TVP_ProductRawMaterialDetails = ProductRawMaterialDetails;
            request.TVP_ProductRawMaterialMappingDetails = ProductRawMaterialMappingDetails;

            string[] Exclude = { "productRawMaterialDetails", "productRawMaterialMappingDetails" };
            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertProductRawMaterialDetails]", request, Exclude);

            return Json(response);
        }
    }
}