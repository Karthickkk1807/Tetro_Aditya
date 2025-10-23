using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("ProposalRequest")]
    public class ProposalRequestController : BaseController
    {

        public ProposalRequestController(IConfiguration configuration) : base(configuration)
        {

        }
        public IActionResult ProposalRequest()
        {
            return View();
        }
         
        [HttpGet]
        [Route("GetProposalRequest")]
        public IActionResult GetProposalRequest(DateTime FromDate, DateTime ToDate, int? ProposalRequestId, int FranchiseId)
        {
            GetProposalRequest request = new GetProposalRequest()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProposalRequestId = ProposalRequestId,
                FromDate = FromDate,
                ToDate = ToDate,
                FranchiseId = FranchiseId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProposalRequestDetails]", request);
            return Json(response);
        }

        [HttpGet]
        [Route("NotNullGetProposalRequest")]
        public IActionResult NotNullGetProposalRequest(int ProposalRequestId, int FranchiseId)
        { 
            GetProposalRequest getInfo = new GetProposalRequest()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProposalRequestId = ProposalRequestId,
                FromDate = null,
                ToDate = null,
                FranchiseId = FranchiseId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProposalRequestDetails]", getInfo);
            return Json(response);
        }
        
        [HttpPost]
        [Route("InsertUpdateProposalRequest")]
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
                    ModuleName = "ProposalRequest"
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
                ProposalRequestDetailsStatic ProposalRequestDetailsStatic = JsonConvert.DeserializeObject<ProposalRequestDetailsStatic>(Request.Form["ProposalRequestDetailsStatic"]);
                List<ProposalRequestProductMappingDetails>? ProposalRequestProductMappingDetails = JsonConvert.DeserializeObject<List<ProposalRequestProductMappingDetails>?>(Request.Form["ProposalRequestProductMappingDetails"]);

                DataTable dtproductData = new DataTable();
                dtproductData = GenericTetroONE.ToDataTable(ProposalRequestProductMappingDetails);

                InsertProposalRequestDetails request = new InsertProposalRequestDetails()
                {
                    LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                    ProposalRequestId = ProposalRequestDetailsStatic.ProposalRequestId,
                    VendorId = ProposalRequestDetailsStatic.VendorId,
                    BillFromFranchiseId = ProposalRequestDetailsStatic.BillFromFranchiseId,
                    ShipToFranchiseId = ProposalRequestDetailsStatic.ShipToFranchiseId,
                    TopFranchiseId = ProposalRequestDetailsStatic.TopFranchiseId,
                    ProposalRequestNo = ProposalRequestDetailsStatic.ProposalRequestNo,
                    ProposalRequestDate = ProposalRequestDetailsStatic.ProposalRequestDate,
                    TermsAndCondition = ProposalRequestDetailsStatic.TermsAndCondition,
                    Notes = ProposalRequestDetailsStatic.Notes,
                    ProposalRequestStatusId = ProposalRequestDetailsStatic.ProposalRequestStatusId,

                    TVP_ProposalRequestProductMappingDetails = dtproductData,
                    TVP_AttachmentDetails = dtattachment
                };

                if (ProposalRequestDetailsStatic.ProposalRequestId > 0)
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_UpdateProposalRequestDetails]", request, "");
                else
                    response = GenericTetroONE.ExecuteReturnData(_connectionString, "[dbo].[USP_InsertProposalRequestDetails]", request, "ProposalRequestId");

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
        [Route("DeleteProposalRequestDetails")]
        public IActionResult DeleteProposalRequestDetails(int ProposalRequestId)
        {
            DeleteProposalRequest getInfo = new DeleteProposalRequest()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                ProposalRequestId = ProposalRequestId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProposalRequestDetails]", getInfo);

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