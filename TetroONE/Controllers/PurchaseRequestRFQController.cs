using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("PurchaseRequest")]
    public class PurchaseRequestController : BaseController
    {

        public PurchaseRequestController(IConfiguration configuration) : base(configuration)
        {

        } 
        public IActionResult PurchaseRequest()
        {
            return View();
        }
          
        [HttpGet]
        [Route("GetPurchaseRequest")]
        public IActionResult GetPurchaseOrder(DateTime FromDate, DateTime ToDate, int? PurchaseRequestId, int FranchiseId)
        {
            GetPurchaseRequest request = new GetPurchaseRequest()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseRequestId = PurchaseRequestId,
                FromDate = FromDate,
                ToDate = ToDate,
                FranchiseId = FranchiseId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseRequestDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("NotNullGetPurchaseRequest")]
        public IActionResult NotNullGetPurchaseRequest(int PurchaseRequestId, int FranchiseId)
        {

            GetPurchaseRequest getInfo = new GetPurchaseRequest()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseRequestId = PurchaseRequestId,
                FromDate = null,
                ToDate = null,
                FranchiseId = FranchiseId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPurchaseRequestDetails]", getInfo);
            return Json(response);
        }
         
        [HttpPost]
        [Route("InsertUpdatePurchaseRequest")]
        public async Task<IActionResult> InsertUpdatePurchaseRequest()
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
                    ModuleName = "PurchaseRequest"
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

            try
            {
                PurchaseRequestDetailsStatic PurchaseRequestDetailsStatic = JsonConvert.DeserializeObject<PurchaseRequestDetailsStatic>(Request.Form["PurchaseRequestDetailsStatic"]);
                List<PurchaseRequestProductMappingDetails>? PurchaseRequestProductMappingDetails = JsonConvert.DeserializeObject<List<PurchaseRequestProductMappingDetails>?>(Request.Form["PurchaseRequestProductMappingDetails"]);

                DataTable dtproductData = new DataTable();
                dtproductData = GenericTetroONE.ToDataTable(PurchaseRequestProductMappingDetails);

                InsertPurchaseRequestDetails request = new InsertPurchaseRequestDetails()
                {
                    LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                    PurchaseRequestId = PurchaseRequestDetailsStatic.PurchaseRequestId,
                    VendorId = PurchaseRequestDetailsStatic.VendorId,
                    BillFromFranchiseId = PurchaseRequestDetailsStatic.BillFromFranchiseId,
                    ShipToFranchiseId = PurchaseRequestDetailsStatic.ShipToFranchiseId,
                    TopFranchiseId = PurchaseRequestDetailsStatic.TopFranchiseId,
                    PurchaseRequestNo = PurchaseRequestDetailsStatic.PurchaseRequestNo,
                    PurchaseRequestDate = PurchaseRequestDetailsStatic.PurchaseRequestDate,
                    TermsAndCondition = PurchaseRequestDetailsStatic.TermsAndCondition,
                    Notes = PurchaseRequestDetailsStatic.Notes,
                    PurchaseRequestStatusId = PurchaseRequestDetailsStatic.PurchaseRequestStatusId,

                    TVP_PurchaseRequestProductMappingDetails = dtproductData,
                    TVP_AttachmentDetails = dtattachment
                };

                if (PurchaseRequestDetailsStatic.PurchaseRequestId > 0)
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdatePurchaseRequestDetails]", request, "");
                else
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertPurchaseRequestDetails]", request, "PurchaseRequestId");

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
            catch (Exception ex)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("DeletePurchaseRequestDetails")]
        public IActionResult DeletePurchaseRequestDetails(int PurchaseRequestId)
        {
            DeletePurchaseRequest getInfo = new DeletePurchaseRequest()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PurchaseRequestId = PurchaseRequestId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePurchaseRequestDetails]", getInfo);

            DataSet ds = new DataSet();
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

    }
}
