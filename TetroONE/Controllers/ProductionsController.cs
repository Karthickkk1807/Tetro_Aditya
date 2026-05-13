//using iText.Kernel.Pdf;
//using iText.Layout;
//using iText.Layout.Element;
//using iText.Layout.Properties;
//using iText.Barcodes;
//using iText.Kernel.Colors;
//using iText.Kernel.Geom;
//using iText.IO.Image;
using iText.Barcodes;
using iText.Kernel.Colors;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Cmp;
using Org.BouncyCastle.Asn1.Crmf;
using PdfSharp;
using PdfSharp.Snippets;
using Razorpay.Api;
using RestSharp;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;
using TetroONE.Models;
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
        [Route("InWard")]
        public IActionResult InWard()
        {
            return View();
        }
        [Route("OutWard")]
        public IActionResult OutWard()
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
        [Route("GetSample")]
        public IActionResult GetTarget(int? PlantId, int? SampleId, DateTime? FromDate, DateTime? ToDate)
        {
            GetSample request = new GetSample()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                SampleId = SampleId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetSampleDetails]", request);
            return Json(response);
        }


        //-------------------------------------------------------------------------Inward---------------------------------------------------------------------------------


        [HttpGet]
        [Route("GetInward")]
        public IActionResult GetInward(int? PlantId, int? InwardId, DateTime? FromDate, DateTime? ToDate)
        {
            GetInward request = new GetInward()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                InwardId = InwardId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetInwardDetails]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateInwardDetails")]
        public async Task<IActionResult> InsertUpdateInwardDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateInwardDetails staticDetails = new InsertUpdateInwardDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateInwardDetails>(Request.Form["InwardStaticData"]);

            IFormFileCollection file = Request.Form.Files;
            List<AttachmentDetails> lstattachment = new List<AttachmentDetails>();
            DataTable dtattachment = new DataTable();

            foreach (var item in file)
            {
                var attachment = GetFilePath(item.FileName);
                lstattachment.Add(new AttachmentDetails()
                {
                    AttachmentExactFileName = item.FileName,
                    AttachmentFileName = attachment.Item1,
                    AttachmentFilePath = attachment.Item2,
                    ModuleName = "InWard"
                });
            }

            bool isuploaded = await IsClaimAttachmentUploaded(file, lstattachment);
            foreach (var item in lstattachment)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }

            var exist = Request.Form["Exist"].ToList();
            if (exist != null && exist.Count > 0)
            {
                List<AttachmentDetails> lstexistattachment = ParseFormData(Request.Form["Exist"]);
                if (lstexistattachment.Any())
                {
                    lstattachment.AddRange(lstexistattachment);
                }
            }
            List<AttachmentDetails> lstdeleteattachment = new List<AttachmentDetails>();
            var deletedFile = Request.Form["DeletedFile"].ToList();
            if (deletedFile != null && deletedFile.Count > 0)
            {
                lstdeleteattachment = ParseFormData(Request.Form["DeletedFile"]);
                if (lstdeleteattachment.Any())
                {
                    lstattachment.AddRange(lstdeleteattachment);
                    lstattachment.RemoveAll(item1 => lstdeleteattachment.Any(item2 => item2.AttachmentId == item1.AttachmentId));
                }
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");

            List<InwardFabricDetails>? staticData = JsonConvert.DeserializeObject<List<InwardFabricDetails>?>(Request.Form["InwardFabricDetails"]);
            DataTable InwardFabricDetails = GenericTetroONE.ToDataTable(staticData);

            List<InwardFabricProcessMappingDetails>? staticData1 = JsonConvert.DeserializeObject<List<InwardFabricProcessMappingDetails>?>(Request.Form["InwardFabricProcessMappingDetails"]);
            DataTable InwardFabricProcessMappingDetails = GenericTetroONE.ToDataTable(staticData1);

            var spName = string.Empty;
            if (staticDetails.InWardId != null && staticDetails.InWardId != 0)
            {
                spName = "[dbo].[USP_UpdateInWardDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertInWardDetails]";
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@PlantId", staticDetails.PlantId);
                    command.Parameters.AddWithValue("@InWardDate", staticDetails.InWardDate);
                    command.Parameters.AddWithValue("@InWardNo", staticDetails.InWardNo);
                    command.Parameters.AddWithValue("@InwardType", staticDetails.InwardType);
                    command.Parameters.AddWithValue("@PaymentTypeId", staticDetails.PaymentTypeId);
                    command.Parameters.AddWithValue("@ClientId", staticDetails.ClientId);
                    command.Parameters.AddWithValue("@ClientDcNumber", staticDetails.ClientDcNumber);
                    command.Parameters.AddWithValue("@ReceivedFrom", staticDetails.ReceivedFrom);
                    command.Parameters.AddWithValue("@OldDcNumber", staticDetails.OldDcNumber);
                    command.Parameters.AddWithValue("@LabOption", staticDetails.LabOption);
                    command.Parameters.AddWithValue("@VehicleNo", staticDetails.VehicleNo);
                    command.Parameters.AddWithValue("@ColorId", staticDetails.ColorId);
                    command.Parameters.AddWithValue("@StorageLocationId", staticDetails.StorageLocationId);
                    command.Parameters.AddWithValue("@NoofFabric", staticDetails.NoofFabric);
                    command.Parameters.AddWithValue("@TotalQty", staticDetails.TotalQty);
                    command.Parameters.AddWithValue("@TotalRolls", staticDetails.TotalRolls);
                    command.Parameters.AddWithValue("@OrderNumber", staticDetails.OrderNumber);
                    command.Parameters.AddWithValue("@ReceivedBy", staticDetails.ReceivedBy);
                    command.Parameters.AddWithValue("@Notes", staticDetails.Notes == null ? (object)DBNull.Value : staticDetails.Notes);

                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);
                    command.Parameters.AddWithValue("@TVP_InwardFabricDetails", InwardFabricDetails);
                    command.Parameters.AddWithValue("@TVP_InwardFabricProcessMappingDetails", InwardFabricProcessMappingDetails);

                    if (staticDetails.InWardId > 0)
                    {
                        command.Parameters.AddWithValue("@InWardId", staticDetails.InWardId);
                        command.Parameters.AddWithValue("@InWardStatusId", staticDetails.InWardStatusId);
                    }

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    try
                    {
                        await command.ExecuteNonQueryAsync();
                    }
                    catch (Exception ex)
                    {

                    }

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                }
                connection.Close();

            }
            if (!response.Status)
            {
                foreach (var item in lstattachment)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\TetroOne\");
                    string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                                .Replace("..", "").Replace("/", "\\");
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteInWardDetails")]
        public IActionResult DeleteInWardDetails(int InWardId)
        {
            DeleteInWardDetails getInWard = new DeleteInWardDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                InWardId = InWardId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteInWardDetails]", getInWard);

            if (response.Status)
            {
                string lst = response.Data.ToString().Substring(1, response.Data.ToString().Length - 2);
                List<AttachmentDetails> att = new List<AttachmentDetails>();
                att = JsonConvert.DeserializeObject<List<AttachmentDetails>>(lst);

                if (att != null && att.Count > 0)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
                    foreach (var item in att)
                    {
                        if (!string.IsNullOrEmpty(item.AttachmentFilePath))
                        {
                            string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                            .Replace("..", "").Replace("/", "\\");
                            if (System.IO.File.Exists(filePath))
                            {
                                System.IO.File.Delete(filePath);
                            }
                        }
                    }
                }
            }
            return Json(response);
        }

        //-------------------------------------------------------------------------Outward---------------------------------------------------------------------------------

        [HttpGet]
        [Route("GetOutward")]
        public IActionResult GetOutward(int? PlantId, int? OutWardId, DateTime? FromDate, DateTime? ToDate)
        {
            GetOutward request = new GetOutward()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                OutWardId = OutWardId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetOutWardDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetDDProductionPlan")]
        public IActionResult GetProductionPlan(int? ProductionPlanId)
        {
            GetDDProductionPlan request = new GetDDProductionPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProductionPlanId = ProductionPlanId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[DD_USP_GetProductionPlanDetails]", request);
            return Json(response);
        }


        [HttpGet]
        [Route("GetOutWardTypeContactDetails")]
        public IActionResult GetOutWardTypeContactDetails(int OutwardType)
        {
            GetOutWardTypeContactDetails request = new GetOutWardTypeContactDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                OutwardType = OutwardType,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetOutWardType_ContactDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetOutWardTypeClientJobDetails")]
        public IActionResult GetOutWardTypeClientJobDetails(string ModuleName, int ModuleId)
        {
            GetOutWardTypeClientJobDetails request = new GetOutWardTypeClientJobDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ModuleName = ModuleName,
                ModuleId = ModuleId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetOutWardType_ClientJobDetails]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateOutwardDetails")]
        public async Task<IActionResult> InsertUpdateOutwardDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateOutwardDetails staticDetails = new InsertUpdateOutwardDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateOutwardDetails>(Request.Form["OutwardStaticData"]);

            IFormFileCollection file = Request.Form.Files;
            List<AttachmentDetails> lstattachment = new List<AttachmentDetails>();
            DataTable dtattachment = new DataTable();

            foreach (var item in file)
            {
                var attachment = GetFilePath(item.FileName);
                lstattachment.Add(new AttachmentDetails()
                {
                    AttachmentExactFileName = item.FileName,
                    AttachmentFileName = attachment.Item1,
                    AttachmentFilePath = attachment.Item2,
                    ModuleName = "OutWard"
                });
            }

            bool isuploaded = await IsClaimAttachmentUploaded(file, lstattachment);
            foreach (var item in lstattachment)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }

            var exist = Request.Form["Exist"].ToList();
            if (exist != null && exist.Count > 0)
            {
                List<AttachmentDetails> lstexistattachment = ParseFormData(Request.Form["Exist"]);
                if (lstexistattachment.Any())
                {
                    lstattachment.AddRange(lstexistattachment);
                }
            }
            List<AttachmentDetails> lstdeleteattachment = new List<AttachmentDetails>();
            var deletedFile = Request.Form["DeletedFile"].ToList();
            if (deletedFile != null && deletedFile.Count > 0)
            {
                lstdeleteattachment = ParseFormData(Request.Form["DeletedFile"]);
                if (lstdeleteattachment.Any())
                {
                    lstattachment.AddRange(lstdeleteattachment);
                    lstattachment.RemoveAll(item1 => lstdeleteattachment.Any(item2 => item2.AttachmentId == item1.AttachmentId));
                }
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");

            List<OutWardFabricDetails>? OutwardFabric = JsonConvert.DeserializeObject<List<OutWardFabricDetails>?>(Request.Form["OutwardFabricDetails"]);
            DataTable OutWardFabricDetails = GenericTetroONE.ToDataTable(OutwardFabric);

            List<OutwardFabricProcessMappingDetails>? OutwardFabricProcess = JsonConvert.DeserializeObject<List<OutwardFabricProcessMappingDetails>?>(Request.Form["OutwardFabricProcessMappingDetails"]);
            DataTable OutwardFabricProcessMappingDetails = GenericTetroONE.ToDataTable(OutwardFabricProcess);

            var spName = string.Empty;
            if (staticDetails.OutWardId != null && staticDetails.OutWardId != 0)
            {
                spName = "[dbo].[USP_UpdateOutWardDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertOutWardDetails]";
            }

            DataSet ds = new DataSet();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@OutwardDate", staticDetails.OutwardDate);
                    command.Parameters.AddWithValue("@OutwardNo", staticDetails.OutwardNo);
                    command.Parameters.AddWithValue("@OutWardTo", staticDetails.OutWardTo);
                    command.Parameters.AddWithValue("@ProductionPlanId", staticDetails.ProductionPlanId);
                    command.Parameters.AddWithValue("@PackingSlipNo", staticDetails.PackingSlipNo == null ? (object)DBNull.Value : staticDetails.PackingSlipNo);
                    command.Parameters.AddWithValue("@ShipFrom", staticDetails.ShipFrom);
                    command.Parameters.AddWithValue("@ShipTo", staticDetails.ShipTo);
                    command.Parameters.AddWithValue("@ShipToAddress", staticDetails.ShipToAddress);
                    command.Parameters.AddWithValue("@ShipToCity", staticDetails.ShipToCity);
                    command.Parameters.AddWithValue("@ShiptoMobileNo", staticDetails.ShiptoMobileNo);
                    command.Parameters.AddWithValue("@ShipToPlaceOfSupply", staticDetails.ShipToPlaceOfSupply);
                    command.Parameters.AddWithValue("@OutWardedBy", staticDetails.OutWardedBy);
                    command.Parameters.AddWithValue("@NoofFabric", staticDetails.NoofFabric);
                    command.Parameters.AddWithValue("@TotalQty", staticDetails.TotalQty);
                    command.Parameters.AddWithValue("@TotalRolls", staticDetails.TotalRolls);
                    command.Parameters.AddWithValue("@Notes", staticDetails.Notes == null ? (object)DBNull.Value : staticDetails.Notes);
                    command.Parameters.AddWithValue("@VehicleNo", staticDetails.VehicleNo);
                    command.Parameters.AddWithValue("@DriverName", staticDetails.DriverName);
                    command.Parameters.AddWithValue("@InwardId", staticDetails.InwardId == null ? (object)DBNull.Value : staticDetails.InwardId);
                    command.Parameters.AddWithValue("@PlantId", staticDetails.PlantId);

                    command.Parameters.AddWithValue("@TVP_OutwardFabricDetails", OutWardFabricDetails);
                    command.Parameters.AddWithValue("@TVP_OutwardFabricProcessMappingDetails", OutwardFabricProcessMappingDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.OutWardId > 0)
                    {
                        command.Parameters.AddWithValue("@OutWardId", staticDetails.OutWardId);
                        command.Parameters.AddWithValue("@OutWardStatusId", staticDetails.OutWardStatusId);
                    }

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
                connection.Close();
            }
            if (!response.Status)
            {
                foreach (var item in lstattachment)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\TetroOne\");
                    string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                                .Replace("..", "").Replace("/", "\\");
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteOutWardDetails")]
        public IActionResult DeleteOutWardDetails(int OutWardId)
        {
            DeleteOutwardDetails getOutWard = new DeleteOutwardDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                OutWardId = OutWardId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteOutWardDetails]", getOutWard);

            if (response.Status)
            {
                string lst = response.Data.ToString().Substring(1, response.Data.ToString().Length - 2);
                List<AttachmentDetails> att = new List<AttachmentDetails>();
                att = JsonConvert.DeserializeObject<List<AttachmentDetails>>(lst);

                if (att != null && att.Count > 0)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
                    foreach (var item in att)
                    {
                        if (!string.IsNullOrEmpty(item.AttachmentFilePath))
                        {
                            string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                            .Replace("..", "").Replace("/", "\\");
                            if (System.IO.File.Exists(filePath))
                            {
                                System.IO.File.Delete(filePath);
                            }
                        }
                    }
                }
            }
            return Json(response);
        }

        //-------------------------------------------------------------------------ProductionPlan---------------------------------------------------------------------------------

        [HttpGet]
        [Route("GetProductionPlan")]
        public IActionResult GetProductionPlan(int? PlantId, int? TypeId, int? ProductionPlanId, DateTime? FromDate, DateTime? ToDate)
        {
            GetProductionPlan request = new GetProductionPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TypeId = TypeId,
                PlantId = PlantId,
                ProductionPlanId = ProductionPlanId == 0 ? null : ProductionPlanId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionPlanDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetFabricDetailsProductionPlan")]
        public IActionResult GetFabricDetailsProductionPlan(int PlantId, int? IsUpdate, decimal? KG, string? Color)
        {
            GetFabricDetailsProductionPlan request = new GetFabricDetailsProductionPlan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                IsUpdate = IsUpdate,
                KG = KG,
                Color = Color,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetFabricDetails_ProductionPlan]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateProductionPlanDetails")]
        public async Task<IActionResult> InsertUpdateProductionPlanDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateProductionPlanDetails staticDetails = new InsertUpdateProductionPlanDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateProductionPlanDetails>(Request.Form["ProductionPlanStaticData"]);

            IFormFileCollection file = Request.Form.Files;
            List<AttachmentDetails> lstattachment = new List<AttachmentDetails>();
            DataTable dtattachment = new DataTable();

            foreach (var item in file)
            {
                var attachment = GetFilePath(item.FileName);
                lstattachment.Add(new AttachmentDetails()
                {
                    AttachmentExactFileName = item.FileName,
                    AttachmentFileName = attachment.Item1,
                    AttachmentFilePath = attachment.Item2,
                    ModuleName = "ProductionPlan"
                });
            }

            bool isuploaded = await IsClaimAttachmentUploaded(file, lstattachment);
            foreach (var item in lstattachment)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }

            var exist = Request.Form["Exist"].ToList();
            if (exist != null && exist.Count > 0)
            {
                List<AttachmentDetails> lstexistattachment = ParseFormData(Request.Form["Exist"]);
                if (lstexistattachment.Any())
                {
                    lstattachment.AddRange(lstexistattachment);
                }
            }
            List<AttachmentDetails> lstdeleteattachment = new List<AttachmentDetails>();
            var deletedFile = Request.Form["DeletedFile"].ToList();
            if (deletedFile != null && deletedFile.Count > 0)
            {
                lstdeleteattachment = ParseFormData(Request.Form["DeletedFile"]);
                if (lstdeleteattachment.Any())
                {
                    lstattachment.AddRange(lstdeleteattachment);
                    lstattachment.RemoveAll(item1 => lstdeleteattachment.Any(item2 => item2.AttachmentId == item1.AttachmentId));
                }
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");

            List<ProductionPlanFabricDetails>? ProductionPlanFabricDetails1 = JsonConvert.DeserializeObject<List<ProductionPlanFabricDetails>?>(Request.Form["ProductionPlanFabricDetails"]);
            DataTable ProductionPlanFabricDetails = GenericTetroONE.ToDataTable(ProductionPlanFabricDetails1);

            List<ProductionPlanFabricProcessMappingDetails>? ProductionPlanFabricProcessMappingDetails1 = JsonConvert.DeserializeObject<List<ProductionPlanFabricProcessMappingDetails>?>(Request.Form["ProductionPlanFabricProcessMappingDetails"]);
            DataTable ProductionPlanFabricProcessMappingDetails = GenericTetroONE.ToDataTable(ProductionPlanFabricProcessMappingDetails1);

            List<ProductionPlanChemicalRequirementDetails>? ProductionPlanChemicalRequirementDetails1 = JsonConvert.DeserializeObject<List<ProductionPlanChemicalRequirementDetails>?>(Request.Form["ProductionPlanChemicalRequirementDetails"]);
            DataTable ProductionPlanChemicalRequirementDetails = GenericTetroONE.ToDataTable(ProductionPlanChemicalRequirementDetails1);

            var spName = string.Empty;
            if (staticDetails.ProductionPlanId != null && staticDetails.ProductionPlanId != 0)
            {
                spName = "[dbo].[USP_UpdateProductionPlanDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertProductionPlanDetails]";
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                DataSet ds = new DataSet();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@PlantId", staticDetails.PlantId);
                    command.Parameters.AddWithValue("@ProductionNo", staticDetails.ProductionNo);
                    command.Parameters.AddWithValue("@ProductionDate", staticDetails.ProductionDate);
                    command.Parameters.AddWithValue("@TotalWeight", staticDetails.TotalWeight);
                    command.Parameters.AddWithValue("@ColorId", staticDetails.ColorId);
                    command.Parameters.AddWithValue("@MachineId", staticDetails.MachineId);
                    command.Parameters.AddWithValue("@ProductionPlanStatusId", staticDetails.ProductionPlanStatusId);
                    command.Parameters.AddWithValue("@Comments", staticDetails.Comments == null ? (object)DBNull.Value : staticDetails.Comments);
                    command.Parameters.AddWithValue("@PreparedBy", staticDetails.PreparedBy);

                    command.Parameters.AddWithValue("@TVP_ProductionPlanFabricDetails", ProductionPlanFabricDetails);
                    command.Parameters.AddWithValue("@TVP_ProductionPlanFabricProcessMappingDetails", ProductionPlanFabricProcessMappingDetails);
                    command.Parameters.AddWithValue("@TVP_ProductionPlanChemicalRequirementDetails", ProductionPlanChemicalRequirementDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.ProductionPlanId > 0)
                    {
                        command.Parameters.AddWithValue("@ProductionPlanId", staticDetails.ProductionPlanId);
                        command.Parameters.AddWithValue("@WaterLevel", staticDetails.WaterLevel);
                        command.Parameters.AddWithValue("@MLR", staticDetails.MLR);
                        //command.Parameters.AddWithValue("@LoadingDateTime", staticDetails.LoadingDateTime);
                        //command.Parameters.AddWithValue("@UnLoadingDateTime", staticDetails.UnLoadingDateTime);
                    }

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    try
                    {
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        adapter.Fill(ds);

                    }
                    catch (Exception ex)
                    {

                    }

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
                connection.Close();
            }
            if (!response.Status)
            {
                foreach (var item in lstattachment)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\TetroOne\");
                    string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                                .Replace("..", "").Replace("/", "\\");
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteProductionPlanDetails")]
        public IActionResult DeleteProductionPlanDetails(int ProductionPlanId)
        {
            DeleteProductionPlanDetails getOutWard = new DeleteProductionPlanDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductionPlanId = ProductionPlanId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductionPlanDetails]", getOutWard);

            if (response.Status)
            {
                string lst = response.Data.ToString().Substring(1, response.Data.ToString().Length - 2);
                List<AttachmentDetails> att = new List<AttachmentDetails>();
                att = JsonConvert.DeserializeObject<List<AttachmentDetails>>(lst);

                if (att != null && att.Count > 0)
                {
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
                    foreach (var item in att)
                    {
                        if (!string.IsNullOrEmpty(item.AttachmentFilePath))
                        {
                            string filePath = directoryPath + Convert.ToString(item.AttachmentFilePath)
                            .Replace("..", "").Replace("/", "\\");
                            if (System.IO.File.Exists(filePath))
                            {
                                System.IO.File.Delete(filePath);
                            }
                        }
                    }
                }
            }
            return Json(response);
        }

        [HttpGet]
        [Route("GetDefaultChemicalDetails")]
        public IActionResult GetDefaultChemicalDetails(int ProcessType, int ProductionPlanId, decimal ColourValue)
        {
            GetDefaultChemical request = new GetDefaultChemical()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProcessType = ProcessType,
                ProductionPlanId = ProductionPlanId,
                ColourValue = ColourValue == 0 ? null : ColourValue
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDefaultChemicalDetails]", request);
            return Json(response);
        }

        //-------------------------------------------------------------------------ProductionPlan---------------------------------------------------------------------------------

        [HttpGet]
        [Route("GetProductionLogDetails")]
        public IActionResult GetProductionLogDetails(int? PlantId, int? ProductionPlanId, int? ProductionLogId, DateTime? FromDate, DateTime? ToDate)
        {
            GetProductionLogDetails request = new GetProductionLogDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                ProductionPlanId = ProductionPlanId == 0 ? null : ProductionPlanId,
                ProductionLogId = ProductionLogId == 0 ? null : ProductionLogId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionLogDetails]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateProductionLog")]
        public IActionResult InsertUpdateProductionLog([FromBody] InsertUpdateProductionLog request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            //string[] Exculuted = (request.ProductionLogId != null)
            //    ? new string[] { "" }
            //    : new string[] { "MasterInfoId" };

            string storedProcedure = "[dbo].[USP_UpdateProductionLogDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request);
            return Json(response);
        }

        [HttpGet]
        [Route("OutwardPrint")]
        public IActionResult OutwardPrint(int ModuleId, int NoOfCopies, string printType)
        {
            try
            {
                _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintPDFDetails]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                        command.Parameters.AddWithValue("@ModuleName", "OutWard");
                        command.Parameters.AddWithValue("@ModuleId", ModuleId);

                        command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
                        DataSet ds = new DataSet();

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(ds);
                        }

                        if (ds.Tables.Count >= 5)
                        {
                            DataTable dt1 = ds.Tables[0];
                            DataTable dt2 = ds.Tables[1];
                            DataTable dt3 = ds.Tables[2];
                            DataTable dt4 = ds.Tables[3];
                            DataTable dt5 = ds.Tables[4];

                            // Check if dt1 has rows
                            if (dt1.Rows.Count > 0)
                            {
                                var data = new OutWardPrint
                                {
                                    CompanyName = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null,
                                    Address1 = dt1.Rows[0]["Address1"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Address1"]) : null,
                                    Address2 = dt1.Rows[0]["Address2"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Address2"]) : null,
                                    Phone = dt1.Rows[0]["Phone"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["Phone"]) : null,
                                    GSTin = dt1.Rows[0]["GSTin"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["GSTin"]) : null,

                                    OutwardToName = dt2.Rows[0]["OutwardToName"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["OutwardToName"]) : null,
                                    Address = dt2.Rows[0]["Address"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Address"]) : null,
                                    City = dt2.Rows[0]["City"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["City"]) : null,
                                    GSTNumber = dt2.Rows[0]["GSTNumber"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["GSTNumber"]) : null,

                                    DCNo = dt3.Rows[0]["DCNo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["DCNo"]) : null,
                                    DCDate = dt3.Rows[0]["DCDate"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["DCDate"]) : null,
                                    Time = dt3.Rows[0]["Time"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["Time"]) : null,
                                    DeliveryTo = dt3.Rows[0]["DeliveryTo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["DeliveryTo"]) : null,

                                    TotalInwardWt = dt5.Rows[0]["TotalInwardWt"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["TotalInwardWt"]) : null,
                                    TotalOutwardWt = dt5.Rows[0]["TotalOutwardWt"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["TotalOutwardWt"]) : null,
                                    AvgLoss = dt5.Rows[0]["AvgLoss"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["AvgLoss"]) : null,
                                    DeliveredBy = dt5.Rows[0]["DeliveredBy"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["DeliveredBy"]) : null,
                                    VehicleNo = dt5.Rows[0]["VehicleNo"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["VehicleNo"]) : null,
                                    DriverName = dt5.Rows[0]["DriverName"] != DBNull.Value ? Convert.ToString(dt5.Rows[0]["DriverName"]) : null,

                                    ProductItemData = dt4
                                };

                                string DCNo = dt3.Rows[0]["DCNo"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["DCNo"]) : null;
                                string customFileName = $"OutWard_{DCNo}.pdf";

                                PDFTaxInvoice pdfService = new PDFTaxInvoice();
                                byte[] pdfContent = null;
                                pdfContent = pdfService.OutwardAdithiyaPrint(NoOfCopies, data);

                                switch (printType.ToLower())
                                {
                                    case "mail":
                                        var base64PdfContent = Convert.ToBase64String(pdfContent);
                                        return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                                    case "download":
                                        return File(pdfContent, "application/pdf", "OutWard.pdf");

                                    case "preview":
                                        Response.Headers.Add("Content-Disposition", $"inline; filename={customFileName}");
                                        return File(pdfContent, "application/pdf");

                                    case "print":
                                        return File(pdfContent, "application/pdf");

                                    case "whatsapp":
                                        string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                                        string folderPath = Path.Combine(wwwrootPath, "WhatsApp_Sender_PDF");

                                        if (!Directory.Exists(folderPath))
                                        {
                                            Directory.CreateDirectory(folderPath);
                                        }

                                        string fileName = "OutWard" + Guid.NewGuid().ToString() + ".pdf";
                                        string filePath = Path.Combine(folderPath, fileName);

                                        //string fileName = "OutWard" + PurchaseOrderNumber + ".pdf";
                                        //string filePath = Path.Combine(folderPath, fileName);

                                        //if (System.IO.File.Exists(filePath))
                                        //{
                                        //    System.IO.File.Delete(filePath);
                                        //}
                                        try
                                        {
                                            // Write the PDF file to the specified path
                                            System.IO.File.WriteAllBytes(filePath, pdfContent);

                                            // Return the response with status, message, and the file URL
                                            string fileurlpath = $"https://www.tetropos.com/WhatsApp_Sender_PDF/{fileName}";
                                            return Json(new { status = true, message = $"PDF saved successfully at {filePath}", data = fileurlpath });
                                        }
                                        catch (Exception ex)
                                        {
                                            return Json(new { success = false, message = "Error saving PDF: " + ex.Message });
                                        }

                                    default:
                                        return Json(new { success = false, message = "Invalid print type selected." });
                                }
                            }
                            else
                            {
                                return Json(new { success = false, message = "No data found for the given ModuleId." });
                            }
                        }
                        else
                        {
                            // Handle case where expected number of tables is not returned
                            return Json(new { success = false, message = "Expected number of tables not returned from stored procedure." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return Json(new { success = false, message = "An error occurred while generating purchase order print.", error = ex.Message });
            }
        }

        [HttpGet]
        [Route("JobCardPrint")]
        public IActionResult JobCardPrint(int ModuleId, int NoOfCopies, string printType, string URL, int IsRate)
        {
            try
            {
                _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPrintPDFDetails]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                        command.Parameters.AddWithValue("@ModuleName", "Production Plan");
                        command.Parameters.AddWithValue("@ModuleId", ModuleId);

                        command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
                        DataSet ds = new DataSet();

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(ds);
                        }

                        if (ds.Tables.Count >= 10)
                        {
                            DataTable dt1 = ds.Tables[0];
                            DataTable dt2 = ds.Tables[1];
                            DataTable dt3 = ds.Tables[2];
                            DataTable dt4 = ds.Tables[3];
                            DataTable dt5 = ds.Tables[4];
                            DataTable dt6 = ds.Tables[5];
                            DataTable dt7 = ds.Tables[6];
                            DataTable dt8 = ds.Tables[7];
                            DataTable dt9 = ds.Tables[8];
                            DataTable dt10 = ds.Tables[9];

                            // Check if dt1 has rows
                            if (dt1.Rows.Count > 0)
                            {
                                var data = new JobCardPrint
                                {
                                    CompanyLogo = dt1.Rows[0]["CompanyLogo"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyLogo"]) : null,
                                    CompanyName = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null,

                                    Date = dt2.Rows[0]["Date"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Date"]) : null,
                                    SFNo = dt2.Rows[0]["SFNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["SFNo"]) : null,
                                    ClientName = dt2.Rows[0]["ClientName"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["ClientName"]) : null,
                                    Fabric = dt2.Rows[0]["Fabric"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Fabric"]) : null,
                                    Weight = dt2.Rows[0]["Weight"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Weight"]) : null,
                                    Rolls = dt2.Rows[0]["Rolls"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Rolls"]) : null,
                                    GSM = dt2.Rows[0]["GSM"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["GSM"]) : null,
                                    Width = dt2.Rows[0]["Width"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Width"]) : null,
                                    Colour = dt2.Rows[0]["Colour"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Colour"]) : null,
                                    WaterPPM = dt2.Rows[0]["WaterPPM"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["WaterPPM"]) : null,
                                    LotNo = dt2.Rows[0]["LotNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["LotNo"]) : null,
                                    DCNo = dt2.Rows[0]["DCNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["DCNo"]) : null,
                                    OrderNo = dt2.Rows[0]["OrderNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["OrderNo"]) : null,
                                    Water = dt2.Rows[0]["Water"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["Water"]) : null,
                                    RPM = dt2.Rows[0]["RPM"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["RPM"]) : null,

                                    Machine = dt3.Rows[0]["Machine"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["Machine"]) : null,
                                    NoOfChamber = dt3.Rows[0]["NoOfChamber"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["NoOfChamber"]) : null,
                                    ChamberQty = dt3.Rows[0]["ChamberQty"] != DBNull.Value ? Convert.ToString(dt3.Rows[0]["ChamberQty"]) : null,

                                    LoadingDate = dt9.Rows[0]["LoadingDate"] != DBNull.Value ? Convert.ToString(dt9.Rows[0]["LoadingDate"]) : null,
                                    LoadingTime = dt9.Rows[0]["LoadingTime"] != DBNull.Value ? Convert.ToString(dt9.Rows[0]["LoadingTime"]) : null,
                                    UnloadingDate = dt9.Rows[0]["UnloadingDate"] != DBNull.Value ? Convert.ToString(dt9.Rows[0]["UnloadingDate"]) : null,
                                    UnloadingTime = dt9.Rows[0]["UnloadingTime"] != DBNull.Value ? Convert.ToString(dt9.Rows[0]["UnloadingTime"]) : null,

                                    ApprovedBy = dt10.Rows[0]["ApprovedBy"] != DBNull.Value ? Convert.ToString(dt10.Rows[0]["ApprovedBy"]) : null,
                                    VerifiedBy = dt10.Rows[0]["VerifiedBy"] != DBNull.Value ? Convert.ToString(dt10.Rows[0]["VerifiedBy"]) : null,
                                    PreparedBy = dt10.Rows[0]["PreparedBy"] != DBNull.Value ? Convert.ToString(dt10.Rows[0]["PreparedBy"]) : null,

                                    PreTreatmentProductItemData = dt4,

                                    DyeProductItemData = dt5,

                                    DyeBathProductItemData = dt6,

                                    AfterTreatmentProductItemData = dt7,

                                    FinishingProductItemData = dt8,
                                };

                                string LotNumber = dt2.Rows[0]["LotNo"] != DBNull.Value ? Convert.ToString(dt2.Rows[0]["LotNo"]) : null;
                                string customFileName = $"JobCard_{LotNumber}.pdf";
                                PDFJobCard pdfService = new PDFJobCard();
                                byte[] pdfContent = null;
                                pdfContent = pdfService.JobOrderPrint(NoOfCopies, data, URL, IsRate);

                                switch (printType.ToLower())
                                {
                                    case "mail":
                                        var base64PdfContent = Convert.ToBase64String(pdfContent);
                                        return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                                    case "download":
                                        return File(pdfContent, "application/pdf", "JobCard.pdf");

                                    case "preview":
                                        Response.Headers.Add("Content-Disposition", $"inline; filename={customFileName}");
                                        return File(pdfContent, "application/pdf");

                                    case "print":
                                        return File(pdfContent, "application/pdf");

                                    case "whatsapp":
                                        string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                                        string folderPath = Path.Combine(wwwrootPath, "WhatsApp_Sender_PDF");

                                        if (!Directory.Exists(folderPath))
                                        {
                                            Directory.CreateDirectory(folderPath);
                                        }

                                        string fileName = "Job_" + Guid.NewGuid().ToString() + ".pdf";
                                        string filePath = Path.Combine(folderPath, fileName);

                                        //string fileName = "PurchaseOrder_" + PurchaseOrderNumber + ".pdf";
                                        //string filePath = Path.Combine(folderPath, fileName);

                                        //if (System.IO.File.Exists(filePath))
                                        //{
                                        //    System.IO.File.Delete(filePath);
                                        //}
                                        try
                                        {
                                            // Write the PDF file to the specified path
                                            System.IO.File.WriteAllBytes(filePath, pdfContent);

                                            // Return the response with status, message, and the file URL
                                            string fileurlpath = $"https://www.tetropos.com/WhatsApp_Sender_PDF/{fileName}";
                                            return Json(new { status = true, message = $"PDF saved successfully at {filePath}", data = fileurlpath });
                                        }
                                        catch (Exception ex)
                                        {
                                            return Json(new { success = false, message = "Error saving PDF: " + ex.Message });
                                        }

                                    default:
                                        return Json(new { success = false, message = "Invalid print type selected." });
                                }
                            }
                            else
                            {
                                return Json(new { success = false, message = "No data found for the given ModuleId." });
                            }
                        }
                        else
                        {
                            // Handle case where expected number of tables is not returned
                            return Json(new { success = false, message = "Expected number of tables not returned from stored procedure." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return Json(new { success = false, message = "An error occurred while generating Job Card print.", error = ex.Message });
            }
        }

        [HttpGet]
        [Route("GreyFabricStockPrint")]
        public IActionResult GreyFabricStockPrint(int ReportCategory, int Reportvalue, DateTime FromDate, DateTime ToDate)
        {
            try
            {
                _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_GetGreyFabricDetails_PDF]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                        command.Parameters.AddWithValue("@ReportCategory", ReportCategory);
                        command.Parameters.AddWithValue("@Reportvalue", Reportvalue);
                        command.Parameters.AddWithValue("@FromDate", FromDate.AddDays(1));
                        command.Parameters.AddWithValue("@ToDate", ToDate);

                        command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;
                        
                        DataSet ds = new DataSet();

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(ds);
                        }

                        if (ds.Tables.Count >= 2)
                        {
                            DataTable dt1 = ds.Tables[0];
                            DataTable dt2 = ds.Tables[1];

                            // Check if dt1 has rows
                            if (dt1.Rows.Count > 0)
                            {
                                var data = new GreyFabricPrint
                                {
                                    CompanyName = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null,
                                    FromDate = dt1.Rows[0]["FromDate"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["FromDate"]) : null,
                                    ToDate = dt1.Rows[0]["ToDate"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ToDate"]) : null,

                                    DynamicItemData = dt2
                                };

                                string CompanyName1 = dt1.Rows[0]["CompanyName"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["CompanyName"]) : null;
                                string FromDate1 = dt1.Rows[0]["FromDate"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["FromDate"]) : null;
                                string ToDate1 = dt1.Rows[0]["ToDate"] != DBNull.Value ? Convert.ToString(dt1.Rows[0]["ToDate"]) : null;

                                string customFileName = $"FabricStock From {CompanyName1 + "" + FromDate1 + "-" + ToDate1}.pdf";

                                GreyFabricStockPrint pdfService = new GreyFabricStockPrint();

                                byte[] pdfContent = null;

                                var printType = "preview";
                                int NoOfCopies = 1;

                                pdfContent = pdfService.GreyFabricPrint(NoOfCopies, data);

                                switch (printType.ToLower())
                                {
                                    case "mail":
                                        var base64PdfContent = Convert.ToBase64String(pdfContent);
                                        return Json(new { success = true, fileContent = base64PdfContent, message = " generated successfully." });

                                    case "download":
                                        return File(pdfContent, "application/pdf", "JobCard.pdf");

                                    case "preview":
                                        Response.Headers.Add("Content-Disposition", $"inline; filename={customFileName}");
                                        return File(pdfContent, "application/pdf");

                                    case "print":
                                        return File(pdfContent, "application/pdf");

                                    case "whatsapp":
                                        string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                                        string folderPath = Path.Combine(wwwrootPath, "WhatsApp_Sender_PDF");

                                        if (!Directory.Exists(folderPath))
                                        {
                                            Directory.CreateDirectory(folderPath);
                                        }

                                        string fileName = "Job_" + Guid.NewGuid().ToString() + ".pdf";
                                        string filePath = Path.Combine(folderPath, fileName);

                                        //string fileName = "PurchaseOrder_" + PurchaseOrderNumber + ".pdf";
                                        //string filePath = Path.Combine(folderPath, fileName);

                                        //if (System.IO.File.Exists(filePath))
                                        //{
                                        //    System.IO.File.Delete(filePath);
                                        //}
                                        try
                                        {
                                            // Write the PDF file to the specified path
                                            System.IO.File.WriteAllBytes(filePath, pdfContent);

                                            // Return the response with status, message, and the file URL
                                            string fileurlpath = $"https://www.tetropos.com/WhatsApp_Sender_PDF/{fileName}";
                                            return Json(new { status = true, message = $"PDF saved successfully at {filePath}", data = fileurlpath });
                                        }
                                        catch (Exception ex)
                                        {
                                            return Json(new { success = false, message = "Error saving PDF: " + ex.Message });
                                        }

                                    default:
                                        return Json(new { success = false, message = "Invalid print type selected." });
                                }
                            }
                            else
                            {
                                return Json(new { success = false, message = "No data found for the given ModuleId." });
                            }
                        }
                        else
                        {
                            // Handle case where expected number of tables is not returned
                            return Json(new { success = false, message = "Expected number of tables not returned from stored procedure." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return Json(new { success = false, message = "An error occurred while generating Job Card print.", error = ex.Message });
            }
        }

        [HttpGet]
        [Route("GenerateQrPdf")]
        public IActionResult GenerateQrPdf(string URL, string ProductionPlanNo)
        {
            using (var stream = new MemoryStream())
            {
                PdfWriter writer = new PdfWriter(stream);
                PdfDocument pdf = new PdfDocument(writer);
                var pageSize = iText.Kernel.Geom.PageSize.A4;
                Document document = new Document(pdf, pageSize);
                Paragraph heading = new Paragraph(ProductionPlanNo + "_" + "QRCode").SetFontSize(20).SetBold().SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER).SetMarginBottom(30);
                document.Add(heading);

                var qrCode = new BarcodeQRCode(URL);
                var qrObject = qrCode.CreateFormXObject(ColorConstants.BLACK, pdf);
                var qrImage = new Image(qrObject);

                float size = pageSize.GetWidth() - 100;
                qrImage.SetWidth(size);
                qrImage.SetHeight(size);
                qrImage.SetHorizontalAlignment(iText.Layout.Properties.HorizontalAlignment.CENTER);

                document.Add(qrImage);
                document.Close();

                // ✅ Fallback + clean filename
                var safePlanNo = string.IsNullOrWhiteSpace(ProductionPlanNo) ? "QRCode" : ProductionPlanNo.Replace("/", "-").Replace("\\", "-");

                return File(stream.ToArray(), "application/pdf", $"{safePlanNo}_QRCode.pdf");
            }
        }

        [HttpGet]
        [Route("GenerateQrContectPdf")]
        public IActionResult GenerateQrContectPdf(string URL, string ProductionPlanNo)
        {
            using (var stream = new MemoryStream())
            {
                PdfWriter writer = new PdfWriter(stream);
                PdfDocument pdf = new PdfDocument(writer);

                var pageSize = iText.Kernel.Geom.PageSize.A4;
                Document document = new Document(pdf, pageSize);

                // ===== Heading =====
                Paragraph heading = new Paragraph("Contact QR Code")
                    .SetFontSize(20)
                    .SetBold()
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                    .SetMarginBottom(30);

                document.Add(heading);

                // ===== QR Code (vCard) =====
                BarcodeQRCode qrCode = new BarcodeQRCode(URL);
                var qrObject = qrCode.CreateFormXObject(ColorConstants.BLACK, pdf);
                Image qrImage = new Image(qrObject);

                float qrSize = pageSize.GetWidth() - 250;
                qrImage.SetWidth(qrSize);
                qrImage.SetHeight(qrSize);
                qrImage.SetHorizontalAlignment(iText.Layout.Properties.HorizontalAlignment.CENTER);

                document.Add(qrImage);

                // ===== Space =====
                document.Add(new Paragraph("\n"));

                // ===== Contact Text (Styled) =====
                Paragraph name = new Paragraph("Name : RAMESH KUMAR")
                    .SetFontSize(12)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                Paragraph title = new Paragraph("Managing Director")
                    .SetFontSize(16)   // BIGGER FONT
                    .SetBold()         // DIFFERENT STYLE
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                Paragraph phone = new Paragraph("Contact Number : +91-99940 66096")
                    .SetFontSize(12)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                Paragraph email = new Paragraph("Email : ramesh.kumar@vahle.com")
                    .SetFontSize(12)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                document.Add(name);
                document.Add(title);
                document.Add(phone);
                document.Add(email);

                document.Close();

                var safePlanNo = string.IsNullOrWhiteSpace(ProductionPlanNo)
                    ? "Contact_QR"
                    : ProductionPlanNo.Replace("/", "-").Replace("\\", "-");

                return File(stream.ToArray(), "application/pdf", $"{safePlanNo}_QRCode.pdf");
            }
        }

        private (string, string) GetFilePath(string reqfilename)
        {
            string guid = Guid.NewGuid().ToString();

            string relativePath = Path.Combine("TetroOne");
            string fileName = guid + "@@" + reqfilename;
            string relativeFilePath = "..\\" + relativePath + "\\" + fileName;
            relativeFilePath = relativeFilePath.Replace("\\", "/");
            return (fileName, relativeFilePath);
        }

        private async Task<bool> IsClaimAttachmentUploaded(IFormFileCollection file, List<AttachmentDetails> lstattachment)
        {
            bool isuploaded = false;

            foreach (var item in file)
            {
                var filenameInfo = lstattachment.FirstOrDefault(x => x.AttachmentExactFileName == item.FileName);
                if (filenameInfo != null)
                {
                    var filename = filenameInfo.AttachmentFileName;
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\TetroOne\");
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

            return isuploaded;
        }

        private List<AttachmentDetails> ParseFormData(string formData)
        {
            List<AttachmentDetails> existList = JsonConvert.DeserializeObject<List<AttachmentDetails>>(formData);
            return existList;

        }

        [HttpGet]
        [Route("GetApplicableMachineData")]
        public IActionResult GetApplicableMachineData(int companyId, decimal totalWeight)
        {
            string query = @"
                            SELECT  TOP 1 MachineName
                                    ,NoOfChambers
                                    ,(@TotalWeight / NoOfChambers) AS ChamberWeight
                            FROM    [dbo].[MachineDetails]
                            WHERE   @TotalWeight BETWEEN MinCapacity AND MaxCapacity
                            AND     CompanyId = @CompanyId";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@CompanyId", companyId);
                cmd.Parameters.AddWithValue("@TotalWeight", totalWeight);

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        var result = new
                        {
                            MachineName = reader["MachineName"] == DBNull.Value ? null : reader["MachineName"].ToString(),
                            NoOfChambers = reader["NoOfChambers"] == DBNull.Value ? (int?)null : Convert.ToInt32(reader["NoOfChambers"]),
                            ChamberWeight = reader["ChamberWeight"] == DBNull.Value ? (decimal?)null : Convert.ToDecimal(reader["ChamberWeight"])
                        };
                        return Ok(result); // JSON response
                    }
                }
            }

            return Ok(new { MachineName = (string?)null, NoOfChambers = (int?)null, ChamberWeight = (decimal?)null });
        }
    }
}
