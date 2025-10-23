using DocumentFormat.OpenXml.VariantTypes;
using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Cmp;
using Org.BouncyCastle.Asn1.Crmf;
using PdfSharp.Snippets;
using Razorpay.Api;
using RestSharp;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;
using TetroPos.Models;
using RestClient = RestSharp.RestClient;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Productions")]
    public class ProductionsController : BaseController
    {
        public ProductionsController(IConfiguration configuration) : base(configuration)
        {

        }
        [Route("Production")]
        public IActionResult Production()
        {
            return View();
        }
        [Route("InWardOutWard")]
        public IActionResult InWardOutWard()
        {
            return View();
        }

        [Route("ProductionPlan")]
        public IActionResult ProductionPlan()
        {
            return View();
        }
        [Route("DeliveryPlan")]
        public IActionResult DeliveryPlan()
        {
            return View();
        }

        [Route("Sample")]
        public IActionResult Sample()
        {
            return View();
        }

        [Route("TargetvsActual")]
        public IActionResult TargetvsActual()
        {
            return View();
        }

        [Route("JobOrder")]
        public IActionResult JobOrder()
        {
            return View();
        }
         

        [HttpGet]
        [Route("GetProduction")]
        public IActionResult GetProduction(int FranchiseId, DateTime? FromDate, DateTime? ToDate, int? ProductionId)
        {
            GetProduction request = new GetProduction()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                ProductionId = ProductionId,
                //ProductionDate = ProductionDate.HasValue ? ProductionDate.Value.AddDays(1) : (DateTime?)null,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionDetails]", request);
            return Json(response);

        }

        [HttpGet]
        [Route("GetPONumberbyDate")]
        public IActionResult GetPONumberbyDate(DateTime? FromDate, DateTime? ToDate, int FranchiseId)
        {
            GetPONumberbyDate request = new GetPONumberbyDate()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
                FranchiseId = FranchiseId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDistributorPODetails_Date]", request);
            return Json(response);

        }
        [HttpPost]
        [Route("GetDPODetailsById")]
        public async Task<IActionResult> GetDPODetailsById(
                [FromForm] string FilterType,
                [FromForm] int FranchiseId,
                [FromForm] DateTime ProductionPlanDate)
        {
            try
            {
                int employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

                var productFilters = JsonConvert.DeserializeObject<List<GetDPODetailsById>>(FilterType);
                if (productFilters == null || !productFilters.Any())
                {
                    return Json(new { Status = false, Message = "Invalid or empty filter list.", Data = new List<object>() });
                }

                DataTable filterTable = GenericTetroONE.ToDataTable(productFilters);
                DataSet ds = new DataSet();

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetProductDetails_ByPurchaseOrderId_DBT]", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LoginUserId", employeeId);
                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    command.Parameters.AddWithValue("@ProductionPlanDate", ProductionPlanDate);
                    command.Parameters.AddWithValue("@TVP_PurchaseOrderDetails_DBT", filterTable);

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    response.Data = GenericTetroONE.dataSetToJSON(ds);



                    return Json(response);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = "Error: " + ex.Message, Data = new List<object>() });
            }
        }

        [HttpPost]
        [Route("InsertUpdateProduction")]
        public async Task<IActionResult> InsertUpdateProduction()
        {
            IFormFileCollection file = Request.Form.Files;

            List<ProductionAttachmentDetails> DyanamicAttachment = JsonConvert.DeserializeObject<List<ProductionAttachmentDetails>?>(Request.Form["DyanamicAttachment"]);

            List<ProductionAttachmentDetails> lstattachmentDynamic = new List<ProductionAttachmentDetails>();
            DataTable dtattachmentDynamic = new DataTable();

            foreach (var item in file)
            {
                var matchingDocument = DyanamicAttachment.FirstOrDefault(d => d.AttachmentFileName == item.FileName);
                if (!lstattachmentDynamic.Any(x => x.AttachmentExactFileName == item.FileName)
                        && matchingDocument != null
                        && matchingDocument.AttachmentFileName == item.FileName)
                {
                    var attachmentName = GetFilePath(item.FileName);
                    lstattachmentDynamic.Add(new ProductionAttachmentDetails()
                    {
                        ProductionAttachmentId = null,
                        AttachmentExactFileName = item.FileName,
                        AttachmentFileName = attachmentName.Item1,
                        AttachmentFilePath = attachmentName.Item2,
                        ProductionProductMappingId = null,
                        ProductionId = null,
                        RowNumber = matchingDocument.RowNumber,
                    });
                }
            }

            bool isuploadedDynamic = await IsClaimAttachmentUploadedDynamic(file, lstattachmentDynamic);

            foreach (var item in lstattachmentDynamic)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }
            List<ProductionAttachmentDetails> existFilesDyn = JsonConvert.DeserializeObject<List<ProductionAttachmentDetails>?>(Request.Form["ExistFilesDyanamicAttachment"]);

            if (existFilesDyn != null && existFilesDyn.Count > 0)
            {
                lstattachmentDynamic.AddRange(existFilesDyn);
            }

            dtattachmentDynamic = GenericTetroONE.ToDataTable(lstattachmentDynamic);
            dtattachmentDynamic = GenericTetroONE.RemoveColumn(dtattachmentDynamic, "AttachmentExactFileName");

            try
            {
                InsertUpdateProduction ProductionDetailsStatic =
                    JsonConvert.DeserializeObject<InsertUpdateProduction>(Request.Form["ProductionDetailsStatic"]);


                List<productionProductMappingDetails>? productionProductMappingDetails =
                    JsonConvert.DeserializeObject<List<productionProductMappingDetails>?>(Request.Form["productionProductMappingDetails"]);

                DataTable ProductionProductMappingDetails = new DataTable();
                ProductionProductMappingDetails = GenericTetroONE.ToDataTable(productionProductMappingDetails);

                List<ProductionQCMappingDetails>? productionQCMappingDetails =
                    JsonConvert.DeserializeObject<List<ProductionQCMappingDetails>?>(Request.Form["ProductionQCMappingDetails"]);

                DataTable ProductionQCMappingDetails = new DataTable();
                ProductionQCMappingDetails = GenericTetroONE.ToDataTable(productionQCMappingDetails);

                ProductionDetailsStatic.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
                ProductionDetailsStatic.TVP_ProductionProductMappingDetails = ProductionProductMappingDetails;
                ProductionDetailsStatic.TVP_ProductionQCMappingDetails = ProductionQCMappingDetails;
                ProductionDetailsStatic.TVP_ProductionAttachmentDetails = dtattachmentDynamic;

                if (ProductionDetailsStatic.ProductionId == 0 || ProductionDetailsStatic.ProductionId == null)
                {
                    string[] ExcludePara = { "ProductionId" };
                    response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertProductionDetails]", ProductionDetailsStatic, ExcludePara);
                }
                else
                {
                    response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateProductionDetails]", ProductionDetailsStatic);
                }

                if (response.Status)
                {
                    List<ProductionAttachmentDetails> deletedFiles = JsonConvert.DeserializeObject<List<ProductionAttachmentDetails>?>(Request.Form["DeletedFiles"]);
                    if (deletedFiles != null && deletedFiles?.Count > 0)
                    {
                        await GenericTetroONE.IsAttachmentDeletedProductionAttachmentDetails(deletedFiles);
                    }
                }

                return Json(response);
            }
            catch (Exception)
            {

                throw;
            }
        }

        //[HttpPost]
        //[Route("InsertUpdateProduction")]
        //public IActionResult InsertUpdateProduction([FromBody] InsertUpdateProduction request)
        //{
        //    DataTable productionProductMappingDetails = new DataTable();
        //    productionProductMappingDetails = GenericTetroONE.ToDataTable(request.productionProductMappingDetails);

        //    DataTable ProductionQCMappingDetails = new DataTable();
        //    ProductionQCMappingDetails = GenericTetroONE.ToDataTable(request.ProductionQCMappingDetails);

        //    request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
        //    request.ProductionDate = request.ProductionDate.AddDays(1);
        //    request.TVP_ProductionProductMappingDetails = productionProductMappingDetails;
        //    request.TVP_ProductionQCMappingDetails = ProductionQCMappingDetails;

        //    if (request.ProductionId != 0 && request.ProductionId != null)
        //    {
        //        string[] Exclude = { "productionProductMappingDetails", "ProductionQCMappingDetails" };
        //        response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateProductionDetails]", request, Exclude);
        //    }
        //    else
        //    {
        //        string[] Exclude = { "ProductionId", "productionProductMappingDetails", "ProductionQCMappingDetails" };
        //        response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertProductionDetails]", request, Exclude);
        //    }
        //    return Json(response);
        //}

        [HttpGet]
        [Route("GetOpeningBalance")]
        public IActionResult GetOpeningBalance(int FranchiseId, DateTime? ProdDate, int ProductId)
        {
            GetOpeningBalance request = new GetOpeningBalance()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                ProductId = ProductId == 0 ? null : ProductId,
                Date = ProdDate.HasValue ? ProdDate.Value.AddDays(1) : (DateTime?)null
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionOpeningBalanceDetails_ByProductId]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("DD_ProductionQCMapping")]
        public IActionResult DD_ProductionQCMapping(int ProductId)
        {
            DD_ProductionQCMapping request = new DD_ProductionQCMapping()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProductId = ProductId,
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_ProductionQCMappingDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteProduction")]
        public IActionResult DeleteProduction(int ProductionId)
        {
            DeleteProduction request = new DeleteProduction()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProductionId = ProductionId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductionDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetInWardOutWard")]
        public IActionResult GetInWardOutWard(int FranchiseId, DateTime? FromDate, DateTime? ToDate, DateTime? InWardOutWardDate, int DistributorId)
        {
            GetInWardOutWard request = new GetInWardOutWard()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
                InWardOutWardDate = InWardOutWardDate,
                DistributorId = DistributorId == 0 ? null : DistributorId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetInWardOutWardDetails]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateInWardOutWardDetails")]
        public IActionResult InsertUpdateInWardOutWardDetails([FromBody] InsertUpdateInWardOutWardDetails request)
        {
            DataTable inWardProductMapping = new DataTable();
            inWardProductMapping = GenericTetroONE.ToDataTable(request.inWardProductMapping);

            DataTable outWardProductMappingDetails = new DataTable();
            outWardProductMappingDetails = GenericTetroONE.ToDataTable(request.outWardProductMapping);

            StaticOutWardDetails requests = new StaticOutWardDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                InWardOutWardId = request.InWardOutWardId,
                InWardOutWardType = request.InWardOutWardType,
                InWardOutWardDate = request.InWardOutWardDate.AddDays(1),
                FromFranchiseId = request.FromFranchiseId,
                ToFranchiseId = request.ToFranchiseId,
                DistributorId = request.DistributorId,
                PurchaseOrderId = request.PurchaseOrderId,
                TVP_InWardProductMappingDetails = inWardProductMapping,
                TVP_OutWardProductMappingDetails = outWardProductMappingDetails,
            };

            response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdateInWardOutWardDetails]", requests);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteInWardOutWard")]
        public IActionResult DeleteInWardOutWard(int InWardOutWardId, int DistributorId)
        {
            DeleteInWardOutWard request = new DeleteInWardOutWard()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                InWardOutWardId = InWardOutWardId,
                DistributorId = DistributorId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteInWardOutWardDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetProductionPlan")]
        public IActionResult GetProductionPlan(int FranchiseId, DateTime? FromDate, DateTime? ToDate, int? ProductionPlanId)
        {
            GetProductionPlan request = new GetProductionPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                ProductionPlanId = ProductionPlanId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionPlanDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetProductionPlanByFranchise")]
        public IActionResult GetProductionPlanByFranchise(int FranchiseId, DateTime ProductionPlanDate)
        {
            GetProductionPlanByFranchise request = new GetProductionPlanByFranchise()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ToFranchiseId = FranchiseId,
                ProductionPlanDate = ProductionPlanDate.AddDays(1),
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseOrder_DBTByFranchise]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateProductionPlan")]
        public IActionResult InsertUpdateProductionPlan([FromBody] InsertUpdateProductionPlan request)
        {
            DataTable ProductionPlanDistributorPoMappingDetails = new DataTable();
            ProductionPlanDistributorPoMappingDetails = GenericTetroONE.ToDataTable(request.ProductionPlanDistributorPoMappingDetails);

            DataTable productionProductMappingDetails = new DataTable();
            productionProductMappingDetails = GenericTetroONE.ToDataTable(request.productionPlanMappingDetails);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            request.FromDate = request.FromDate.Value.AddDays(1);
            request.ToDate = request.ToDate.Value.AddDays(1);
            request.ProductionPlanDate = request.ProductionPlanDate.AddDays(1);
            request.TVP_ProductionPlanDistributorPoMappingDetails = ProductionPlanDistributorPoMappingDetails;
            request.TVP_ProductionPlanMappingDetails = productionProductMappingDetails;

            string[] Exclude = { "productionPlanMappingDetails", "ProductionPlanDistributorPoMappingDetails" };
            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertUpdateProductionPlanDetails]", request, Exclude);

            return Json(response);
        }

        [HttpGet]
        [Route("DeleteProductionPlan")]
        public IActionResult DeleteProductionPlan(int ProductionPlanId)
        {
            GetProductionPlan request = new GetProductionPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProductionPlanId = ProductionPlanId,
            };

            string[] Exclude = { "FranchiseId", "FromDate", "ToDate" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductionPlanDetails]", request, Exclude);
            return Json(response);
        }

        [HttpGet]
        [Route("GetDeliveryPlan")]
        public IActionResult GetDeliveryPlan(int FranchiseId, DateTime? FromDate, DateTime? ToDate, int? DeliveryPlanId)
        {
            GetDeliveryPlan request = new GetDeliveryPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                DeliveryPlanId = DeliveryPlanId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDeliveryPlanDetails]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateDeliveryPlan")]
        public IActionResult InsertUpdateDeliveryPlan([FromBody] InsertUpdateDeliveryPlan request)
        {
            DataTable DeliveryPlanDistributorMappingDetails = new DataTable();
            DeliveryPlanDistributorMappingDetails = GenericTetroONE.ToDataTable(request.DeliveryPlanDistributorMappingDetails);

            DataTable DeliveryPlanExpenseMappingDetails = new DataTable();
            DeliveryPlanExpenseMappingDetails = GenericTetroONE.ToDataTable(request.DeliveryPlanExpenseMappingDetails);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            request.DeliveryPlanDate = request.DeliveryPlanDate.AddDays(1);
            request.TVP_DeliveryPlanDistributorMappingDetails = DeliveryPlanDistributorMappingDetails;
            request.TVP_DeliveryPlanExpenseMappingDetails = DeliveryPlanExpenseMappingDetails;
            if (request.DeliveryPlanId != null)
            {
                string[] Exclude = { "DeliveryPlanDistributorMappingDetails", "DeliveryPlanExpenseMappingDetails" };
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateDeliveryPlanDetails]", request, Exclude);
            }
            else
            {
                string[] Exclude = { "DeliveryPlanDistributorMappingDetails", "DeliveryPlanExpenseMappingDetails", "DeliveryPlanId" };
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertDeliveryPlanDetails]", request, Exclude);
            }
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteDeliveryPlan")]
        public IActionResult DeleteDeliveryPlan(int DeliveryPlanId)
        {
            GetDeliveryPlan request = new GetDeliveryPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                DeliveryPlanId = DeliveryPlanId
            };

            string[] Exclude = { "FranchiseId", "FromDate", "ToDate" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteDeliveryPlanDetails]", request, Exclude);
            return Json(response);
        }

        [HttpGet]
        [Route("GetDeliveryProduct")]
        public IActionResult GetDeliveryProduct(int FranchiseId, DateTime DeliveryPlanDate, int? DistributorId)
        {
            GetDeliveryProduct request = new GetDeliveryProduct()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                DistributorId = DistributorId,
                DeliveryPlanDate = DeliveryPlanDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetDeliveryPlanDistributorDetails]", request);
            return Json(response);
        }


        private (string, string) GetFilePath(string reqfilename)
        {
            string guid = Guid.NewGuid().ToString();

            string relativePath = Path.Combine("ProfileImages");
            string fileName = guid + "@@" + reqfilename;
            string relativeFilePath = "..\\" + relativePath + "\\" + fileName;
            relativeFilePath = relativeFilePath.Replace("\\", "/");
            return (fileName, relativeFilePath);
        }

        private async Task<bool> IsClaimAttachmentUploadedDynamic(IFormFileCollection file, List<ProductionAttachmentDetails> lstattachment)
        {
            bool isuploaded = false;
            try
            {
                foreach (var item in file)
                {
                    var filenameInfo = lstattachment.FirstOrDefault(x => x.AttachmentExactFileName == item.FileName);
                    if (filenameInfo != null)
                    {
                        var filename = filenameInfo.AttachmentFileName;
                        var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\ProfileImages\");
                        var filePath = Path.Combine(directoryPath, filename);

                        if (!Directory.Exists(directoryPath))
                        {
                            Directory.CreateDirectory(directoryPath);
                        }

                        using (var stream = System.IO.File.Create(filePath))
                        {
                            await item.CopyToAsync(stream);
                        }
                    }
                }
                isuploaded = true;
            }
            catch (Exception ex)
            {
                isuploaded = false;
            }

            return isuploaded;
        }

        //     [HttpGet]
        //     [Route("SendingSMS")]
        //     public async Task<IActionResult> SendingSMS()
        //     {
        //         var client = new RestClient("https://4eyeqp.api.infobip.com");
        //         var request = new RestRequest("/sms/2/text/advanced", RestSharp.Method.Post);

        //         request.AddHeader("Authorization", "App 956d68ce367369537ee3d8b5ef5a8911-46527216-fbf6-45a3-adc0-9f70b08d2924");
        //         request.AddHeader("Content-Type", "application/json");
        //         request.AddHeader("Accept", "application/json");

        //         // Create the request body as C# object
        //         var smsRequest = new
        //         {
        //             messages = new[]
        //             {
        //         new
        //         {
        //        destinations = new[]
        //        {
        //            new { to = "+91 6374378437" }
        //        },
        //        text = "Hello! This is a test SMS from Infobip."
        //    }
        //}
        //         };

        //         request.AddJsonBody(smsRequest); // ✅ Properly serializes the object to JSON

        //         var response = await client.ExecuteAsync(request);

        //         if (response.IsSuccessful)
        //         {
        //             return Json(new { status = true, message = "SMS sent successfully!" });
        //         }
        //         else
        //         {
        //             return Json(new
        //             {
        //                 status = false,
        //                 message = "SMS sending failed!",
        //                 error = response.Content
        //             });
        //         }
        //     }




        //=========================================================================================================



        [HttpGet]
        [Route("GetSample")]
        public IActionResult GetSample(int FranchiseId, DateTime? FromDate, DateTime? ToDate, int? SampleId)
        {
            GetSample request = new GetSample()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                SampleId = SampleId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetSampleDetails]", request);
            return Json(response);

        }


        [HttpGet]
        [Route("GetSampleProductDetails")]
        public IActionResult GetSample(int FranchiseId)
        {
            GetSampleProductDetails request = new GetSampleProductDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,

            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetSampleProductDetails]", request);
            return Json(response);

        }


        [HttpPost]
        [Route("InsertUpdateSample")]
        public async Task<IActionResult> InsertUpdateSample()
        {
            try
            {
                SampleDetailsStatic SampleDetailsStatic = JsonConvert.DeserializeObject<SampleDetailsStatic>(Request.Form["SampleDetailsStatic"]);
                List<SampleProductMappingDetails>? SampleProductMappingDetails = JsonConvert.DeserializeObject<List<SampleProductMappingDetails>?>(Request.Form["SampleProductMappingDetails"]);

                DataTable dtproductData = new DataTable();
                dtproductData = GenericTetroONE.ToDataTable(SampleProductMappingDetails);

                InsertSampleDetails request = new InsertSampleDetails()
                {
                    LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                    SampleId = SampleDetailsStatic.SampleId,
                    SampleDate = SampleDetailsStatic.SampleDate,
                    FranchiseId = SampleDetailsStatic.FranchiseId,
                    InchargeId = SampleDetailsStatic.InchargeId,
                    NoOfProducts = SampleDetailsStatic.NoOfProducts,
                    NoOfQty = SampleDetailsStatic.NoOfQty,
                    TVP_SampleProductMappingDetails = dtproductData,

                };

                if (SampleDetailsStatic.SampleId > 0)
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdateSampleDetails]", request);
                else
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertSampleDetails]", request, "SampleId");


                return Json(response);
            }
            catch (Exception ex)
            {

                throw;
            }
        }


        [HttpGet]
        [Route("DeleteSampleDetails")]
        public IActionResult DeleteSampleDetails(int SampleId)
        {
            DeleteSample getInfo = new DeleteSample()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                SampleId = SampleId,

            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteSampleDetails]", getInfo);
            return Json(response);
        }

        //=========================================================================================================



        [HttpGet]
        [Route("GetTarget")]
        public IActionResult GetTarget(int FranchiseId, DateTime? FromDate, DateTime? ToDate, int? TargetId)
        {
            GetTarget request = new GetTarget()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TargetId = TargetId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetTargetDetails]", request);
            return Json(response);

        }
        [HttpPost]
        [Route("InsertUpdateTarget")]
        public async Task<IActionResult> InsertUpdateTarget([FromBody] TargetDetailsStatic request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            if (request.TargetId > 0)
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateTargetDetails]", request);
            else
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertTargetDetails]", request, "TargetId");


            return Json(response);
        }


        [HttpGet]
        [Route("DeleteTargetDetails")]
        public IActionResult DeleteTargetDetails(int TargetId)
        {
            DeleteTargetDetails getInfo = new DeleteTargetDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TargetId = TargetId,

            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteTargetDetails]", getInfo);
            return Json(response);
        }

    }
}
