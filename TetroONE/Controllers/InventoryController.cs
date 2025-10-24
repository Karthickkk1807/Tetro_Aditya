using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.VariantTypes;
using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Razorpay.Api;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Security.Claims;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Inventory")]
    public class InventoryController : BaseController
    {
        public InventoryController(IConfiguration configuration) : base(configuration)
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
        [Route("ManageStock")]
        public IActionResult ManageStock()
        {
            return View();
        }
       

        [Route("Transfer")]
        public IActionResult Transfer()
        {
            return View();
        }

        [HttpGet]
        [Route("GetDDMasterInfoValue")]
        public IActionResult GetDDMasterInfoValue(int MasterInfoId, string ModuleName)
        {
            CommonDrop request = new CommonDrop()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                MasterInfoId = MasterInfoId == 0 ? null : MasterInfoId,
                ModuleName = ModuleName,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetMasterInfoDetails]", request);
            return Json(response);
        }


        [HttpGet]
        [Route("GetManageStock")]
        public IActionResult GetManageStock(int FranchiseId, DateTime? FromDate, DateTime? ToDate, int? ManageStockId, int ProductTypeId)
        {
            GetManageStock request = new GetManageStock()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                ProductTypeId = ProductTypeId,
                ManageStockId = ManageStockId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetManageStockDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetMaterialsData")]
        public IActionResult GetMaterialsData(int FranchiseId)
        {
            GetMaterialsData request = new GetMaterialsData()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetProductDetails_FranchiseId]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateManageStock")]
        public IActionResult InsertUpdateManageStock([FromBody] InsertUpdateManageStock request)
        {
            DataTable productionProductMappingData = new DataTable();
            productionProductMappingData = GenericTetroONE.ToDataTable(request.manageStockProductMappingDetails);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            request.ManageStockDate = request.ManageStockDate.AddDays(1);
            request.TVP_ManageStockProductMappingDetails = productionProductMappingData;

            if (request.ManageStockId != 0 && request.ManageStockId != null)
            {
                string[] Exclude = { "manageStockProductMappingDetails" };
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateManageStockDetails]", request, Exclude);
            }
            else
            {
                string[] Exclude = { "ManageStockId", "manageStockProductMappingDetails" };
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertManageStockDetails]", request, Exclude);
            }
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteManageStock")]
        public IActionResult DeleteManageStock(int ManageStockId)
        {
            DeleteManageStock request = new DeleteManageStock()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ManageStockId = ManageStockId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteManageStockDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetOutWardPo")]
        public IActionResult GetOutWardPo(int FranchiseId, int DistributorId)
        {
            GetOutWardPo request = new GetOutWardPo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                FranchiseId = FranchiseId,
                DistributorId = DistributorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetPurchaseOrderNoDetails_OutWard]", request);
            return Json(response);

        }

        [HttpGet]
        [Route("GetOutWardPoOutWard")]
        public IActionResult GetOutWardPoOutWard(int PurchaseOrderId)
        {
            GetOutWardPoOutWard request = new GetOutWardPoOutWard()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseOrderId = PurchaseOrderId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetPurchaseOrderDetails_OutWardPurchaseOrderId]", request);
            return Json(response);
        }

      

        [HttpGet]
        [Route("GetTransfer")]
        public IActionResult GetTransfer(int TransferId, DateTime? FromDate, DateTime? ToDate, int FranchiseId)
        {
            GetTransferDetails request = new GetTransferDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TransferId = TransferId == 0 ? null : TransferId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetTransferDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("GetTransferStatusDetails")]
        public IActionResult GetTrGetTransferStatusDetailsnsfer(string? ModuleName, int? ModuleId, int Type)
        {
            GetTransferStatusDetails request = new GetTransferStatusDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ModuleName = ModuleName,
                ModuleId = ModuleId == 0 ? null : ModuleId,
                Type = Type,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetTransferStatusDetails]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateTransferDetails")]
        public async Task<IActionResult> InsertUpdateTransferDetails()
        {
            IFormFileCollection file = Request.Form.Files;
            List<AttachmentTable> lstattachment = new List<AttachmentTable>();
            DataTable dtattachment = new DataTable();

            foreach (var item in file)
            {
                var attachment = GenericTetroONE.GetFilePath(item.FileName);
                lstattachment.Add(new AttachmentTable()
                {
                    AttachmentExactFileName = item.FileName,
                    AttachmentFileName = attachment.Item1,
                    AttachmentFilePath = attachment.Item2,
                    ModuleRefId = null,
                    ModuleName = "Transfer"
                });
            }

            bool isuploaded = await GenericTetroONE.IsAttachmentUploaded(file, lstattachment);

            foreach (var item in lstattachment)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }

            List<AttachmentTable> existFiles = JsonConvert.DeserializeObject<List<AttachmentTable>?>(Request.Form["ExistFiles"]);
            if (existFiles != null && existFiles.Count > 0)
            {
                lstattachment.AddRange(existFiles);
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");


            InsertUpdateTransferStatic InsertUpdateTransferStatic = JsonConvert.DeserializeObject<InsertUpdateTransferStatic>(Request.Form["InsertUpdateTransferStatic"]);
            List<TransferProductMappingDetails>? TransferProductMappingDetails = JsonConvert.DeserializeObject<List<TransferProductMappingDetails>?>(Request.Form["InsertUpdateTransferDetails"]);

            if (TransferProductMappingDetails != null)
            {
                foreach (var item in TransferProductMappingDetails)
                {
                    if (item.Quantity.HasValue)
                    {
                        // Ensure 2 decimal precision
                        item.Quantity = Math.Round(item.Quantity.Value, 2, MidpointRounding.AwayFromZero);
                    }
                }
            }

            DataTable dtDyanmicTransfer = new DataTable();
            dtDyanmicTransfer = GenericTetroONE.ToDataTable(TransferProductMappingDetails);

            InsertUpdateTransferDetails request = new InsertUpdateTransferDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TransferId = InsertUpdateTransferStatic.TransferId,
                TransferNo = InsertUpdateTransferStatic.TransferNo,
                TransferDate = InsertUpdateTransferStatic.TransferDate,
                TransferType = InsertUpdateTransferStatic.TransferType,
                TransferTypeId = InsertUpdateTransferStatic.TransferTypeId,
                FromFranchiseId = InsertUpdateTransferStatic.FromFranchiseId,
                ToFranchiseId = InsertUpdateTransferStatic.ToFranchiseId,
                NoOfProducts = InsertUpdateTransferStatic.NoOfProducts,
                Notes = InsertUpdateTransferStatic.Notes,
                TermsandCondition = InsertUpdateTransferStatic.TermsandCondition,
                ModeOfTransportId = InsertUpdateTransferStatic.ModeOfTransportId,
                TransportNo = InsertUpdateTransferStatic.TransportNo,
                TransferStatusId = InsertUpdateTransferStatic.TransferStatusId,
                OutwardId = null,

                TVP_TransferProductMappingDetails = dtDyanmicTransfer,
                TVP_AttachmentDetails = dtattachment
            };

            string[] ExculedInsert = { "TransferId", "TransferProductMappingDetails", "OutwardId" };
            string[] ExculedUpdate = { "TransferProductMappingDetails" };

            if (InsertUpdateTransferStatic.TransferId > 0)
                response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, "[dbo].[USP_UpdateTransferDetails]", request, ExculedUpdate);
            else
                response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, "[dbo].[USP_InsertTransferDetails]", request, ExculedInsert);

            if (response.Status)
            {
                List<AttachmentTable> deletedFiles = JsonConvert.DeserializeObject<List<AttachmentTable>?>(Request.Form["DeletedFiles"]);
                if (deletedFiles != null && deletedFiles?.Count > 0)
                {
                    await GenericTetroONE.IsAttachmentDeleted(deletedFiles);
                }
            }
            return Json(response);
        }

        [HttpGet]
        [Route("DD_GetTransferDetails_TransferNo")]
        public IActionResult DD_GetTransferDetails_TransferNo(int? TransferId)
        {
            DD_GetTransferDetails_TransferNo request = new DD_GetTransferDetails_TransferNo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TransferId = TransferId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetTransferDetails_TransferNo]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("DD_GetTransferNoDetails_TransferType")]
        public IActionResult DD_GetTransferNoDetails_TransferType(int? ModuleId, int? TransferType, int? FranchiseId)
        {
            DD_GetTransferNoDetails_TransferType request = new DD_GetTransferNoDetails_TransferType()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ModuleId = ModuleId,
                TransferType = TransferType,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetTransferNoDetails_TransferType]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteTransferDetails")]
        public IActionResult DeleteTransferDetails(int? TransferId)
        {
            DeleteTransferDetails request = new DeleteTransferDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TransferId = TransferId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteTransferDetails]", request);
            return Json(response);
        }

    }
}
