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
        public IActionResult GetProduct(int ProductTypeId, int FranchiseId)
        {
            GetProduct GetProduct = new GetProduct()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductTypeId = ProductTypeId,
                ProductId = null,
                FranchiseId = FranchiseId,
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductDetails]", GetProduct);
            return Json(response);
        }

        [HttpGet]
        [Route("GetProductId")]
        public IActionResult GetProductId(int ProductId, int FranchiseId)
        {
            GetProduct GetProduct = new GetProduct()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductId = ProductId,
                FranchiseId = FranchiseId
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
        public async Task<IActionResult> SaveLoan([FromBody] InsertUpdateDetails request)
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataTable ProductFranchiseMapping = new DataTable();
            ProductFranchiseMapping = GenericTetroONE.ToDataTable(request.productFranchiseMapping);

            DataTable ProductProductionStagesMapping = new DataTable();
            ProductProductionStagesMapping = GenericTetroONE.ToDataTable(request.productProductionStagesMapping);

            DataTable ProductRawMaterialMapping = new DataTable();
            ProductRawMaterialMapping = GenericTetroONE.ToDataTable(request.productRawMaterialMapping);

            DataTable ProductQCMappingDetails = new DataTable();
            ProductQCMappingDetails = GenericTetroONE.ToDataTable(request.productQCMappingDetails);

            var spName = string.Empty;
            if (request.ProductId != null && request.ProductId != 0)
            {
                spName = "[dbo].[USP_UpdateProductDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertProductDetails]";
            }
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@ProductTypeId", request.ProductTypeId);
                    command.Parameters.AddWithValue("@ProductName", request.ProductName);
                    command.Parameters.AddWithValue("@ProductCategoryId", request.ProductCategoryId);
                    command.Parameters.AddWithValue("@ProductSubCategoryId", request.ProductSubCategoryId);
                    command.Parameters.AddWithValue("@ProductFlavourId", request.ProductFlavourId ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@ProductDescription", request.ProductDescription);
                    command.Parameters.AddWithValue("@PrimaryUnitId", request.PrimaryUnitId);
                    command.Parameters.AddWithValue("@SecondaryUnitId", request.SecondaryUnitId);
                    command.Parameters.AddWithValue("@SecondaryUnitValue", request.SecondaryUnitValue);
                    command.Parameters.AddWithValue("@CGST", request.CGST ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@SGST", request.SGST ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@IGST", request.IGST ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@CESS", request.CESS ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@TVP_ProductFranchiseMappingDetails", ProductFranchiseMapping);
                    command.Parameters.AddWithValue("@TVP_ProductProductionStagesMappingDetails", ProductProductionStagesMapping);
                    command.Parameters.AddWithValue("@TVP_ProductRawMaterialMappingDetails_1", ProductRawMaterialMapping);
                    command.Parameters.AddWithValue("@TVP_ProductQCMappingDetails", ProductQCMappingDetails);

                    if (request.ProductId > 0)
                    {
                        command.Parameters.AddWithValue("@ProductId", request.ProductId);
                    }

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    try
                    {
                        await command.ExecuteNonQueryAsync();
                    }
                    catch (Exception ex)
                    {
                        // Log or inspect the error
                        Console.WriteLine(ex.Message);
                        throw;
                    }

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }
                connection.Close();
            }
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