using HtmlAgilityPack;
using TetroONE;
using TetroONE.Controllers;
using TetroONE.Models;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Globalization;
using System.Security.Claims;
using TetroPos.Models;

namespace TetroONE.Controllers
{

    [Authorize]
    [Route("Enquiry")]
    public class EnquiryController : BaseController
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILog _logger;
        public EnquiryController(IConfiguration configuration, IWebHostEnvironment hostingEnvironment, ILog logger) : base(configuration)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Route("")]
        public IActionResult Enquiry()
        {
            return View();
        }

        [HttpGet]
        [Route("GetEnquiry")]
        public IActionResult GetEnquiry(int FranchiseId, DateTime? FromDate, DateTime? ToDate)
        {
            GetEnquiry getInfo = new GetEnquiry()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                EnquiryId = null,
                FranchiseId = FranchiseId,
                FromDate = FromDate?.AddDays(1),
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEnquiryDetails]", getInfo);
            return Json(response);
        }
         
        [HttpPost]
        [Route("InsertEnquiry")]
        public async Task<IActionResult> InsertEnquiry()
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
                    ModuleName = "Enquiry"
                });
            }

            bool isuploaded = await GenericTetroONE.IsAttachmentUploaded(file, lstattachment);

            foreach (var item in lstattachment)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");

            try
            {
                InsertEnquiryDetailsStatic InsertEnquiryDetailsStatic =
                JsonConvert.DeserializeObject<InsertEnquiryDetailsStatic>(Request.Form["InsertEnquiryDetailsStatic"]);

                InsertEnquiry request = new InsertEnquiry()
                {
                    LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                    EnquiryDate = InsertEnquiryDetailsStatic.EnquiryDate,
                    EnquiryPersonName = InsertEnquiryDetailsStatic.EnquiryPersonName,
                    EnquiryNo = InsertEnquiryDetailsStatic.EnquiryNo,
                    ContactNumber = InsertEnquiryDetailsStatic.ContactNumber,
                    EnquiryEmail = InsertEnquiryDetailsStatic.EnquiryEmail,
                    EnquiryTypeId = InsertEnquiryDetailsStatic.EnquiryTypeId,
                    AttendantId = InsertEnquiryDetailsStatic.AttendantId,
                    CheckIn = InsertEnquiryDetailsStatic.CheckIn,
                    CheckOut = InsertEnquiryDetailsStatic.CheckOut,
                    Query = InsertEnquiryDetailsStatic.Query,
                    Comments = InsertEnquiryDetailsStatic.Comments,
                    EnquiryIsLookUp = InsertEnquiryDetailsStatic.EnquiryIsLookUp,
                    EnquiryLookUpDate = InsertEnquiryDetailsStatic.EnquiryLookUpDate,
                    EnquiryIsForwardOption = InsertEnquiryDetailsStatic.EnquiryIsForwardOption,
                    ForwardEmpId = InsertEnquiryDetailsStatic.ForwardEmpId,
                    FranchiseId = InsertEnquiryDetailsStatic.FranchiseId,
                    TVP_AttachmentDetails = dtattachment

                };

                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertEnquiryDetails]", request);

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
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("GetEnquiryNumberDetails")]
        public IActionResult GetEnquiryNumberDetails(int FranchiseId)
        {
            EnquiryNumberDetails getInfo = new EnquiryNumberDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                Module = "Enquiry",
                ReturnType = null,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAutoGenerateIdDetails]", getInfo);
            return Json(response);
        }

        [HttpGet]
        [Route("GetPopupEnquiryDetails")]
        public IActionResult GetPopupEnquiryDetails(int enquiryId, int FranchiseId, DateTime? FromDate, DateTime? ToDate)
        {
            GetEnquiry getInfo = new GetEnquiry()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                EnquiryId = enquiryId,
                FranchiseId = FranchiseId,
                FromDate = FromDate,
                ToDate = ToDate
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEnquiryDetails]", getInfo);
            return Json(response);
        }

        [HttpPost]
        [Route("UpdateEnquiry")]
        public async Task<IActionResult> UpdateEnquiry()
        {
            IFormFileCollection file = Request.Form.Files;
            List<AttachmentTable> lstattachment = new List<AttachmentTable>();
            DataTable dtattachment = new DataTable();

            List<AttachmentTableDyanamicEnquiry> DyanamicAttachment = JsonConvert.DeserializeObject<List<AttachmentTableDyanamicEnquiry>?>(Request.Form["DyanamicAttachment"]);

            List<AttachmentTableDyanamicEnquiry> lstattachmentDynamic = new List<AttachmentTableDyanamicEnquiry>();
            DataTable dtattachmentDynamic = new DataTable();

            foreach (var item in file)
            {
                var matchingDocument = DyanamicAttachment.FirstOrDefault(d => d.AttachmentFileName == item.FileName);
                if (!lstattachmentDynamic.Any(x => x.AttachmentExactFileName == item.FileName)
                        && matchingDocument != null
                        && matchingDocument.AttachmentFileName == item.FileName)
                {
                    var attachmentName = GetFilePath(item.FileName);
                    lstattachmentDynamic.Add(new AttachmentTableDyanamicEnquiry()
                    {
                        EnquiryAttachmentId = null,
                        AttachmentExactFileName = item.FileName,
                        AttachmentFileName = attachmentName.Item1,
                        AttachmentFilePath = attachmentName.Item2,
                        ModuleName = "Enquiry",
                        RoWNumber = matchingDocument.RoWNumber,
                    });
                }

                else
                {
                    var attachment = GenericTetroONE.GetFilePath(item.FileName);
                    lstattachment.Add(new AttachmentTable()
                    {
                        AttachmentExactFileName = item.FileName,
                        AttachmentFileName = attachment.Item1,
                        AttachmentFilePath = attachment.Item2,
                        ModuleName = "Enquiry"
                    });
                }
            }

            bool isuploadedDynamic = await IsClaimAttachmentUploadedDynamic(file, lstattachmentDynamic);

            foreach (var item in lstattachmentDynamic)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }
            List<AttachmentTableDyanamicEnquiry> existFilesDyn = JsonConvert.DeserializeObject<List<AttachmentTableDyanamicEnquiry>?>(Request.Form["ExistFilesDyanamicAttachment"]);

            if (existFilesDyn != null && existFilesDyn.Count > 0)
            {
                lstattachmentDynamic.AddRange(existFilesDyn);
            }

            dtattachmentDynamic = GenericTetroONE.ToDataTable(lstattachmentDynamic);
            dtattachmentDynamic = GenericTetroONE.RemoveColumn(dtattachmentDynamic, "AttachmentExactFileName");

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
                UpdateEnquiryDetailsStatic UpdateEnquiryDetailsStatic =
                    JsonConvert.DeserializeObject<UpdateEnquiryDetailsStatic>(Request.Form["UpdateEnquiryDetailsStatic"]);


                List<EnquiryFollowUpDetails>? EnquiryFollowUpDetails =
                    JsonConvert.DeserializeObject<List<EnquiryFollowUpDetails>?>(Request.Form["EnquiryFollowupDetailsArray"]);

                DataTable dtenquiryfollowup = new DataTable();
                dtenquiryfollowup = GenericTetroONE.ToDataTable(EnquiryFollowUpDetails);

                foreach (DataRow row in dtenquiryfollowup.Rows)
                {
                    if (dtenquiryfollowup.Columns.Contains("LookUpDate"))
                    {
                        string dateString = row["LookUpDate"].ToString();
                        DateTime date;
                        if (DateTime.TryParseExact(dateString, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
                        {
                            row["LookUpDate"] = date.ToString("yyyy-MM-dd HH:mm:ss");
                        }
                    }
                }
                foreach (DataRow row in dtenquiryfollowup.Rows)
                {
                    if (dtenquiryfollowup.Columns.Contains("FollowUpDate"))
                    {
                        string dateString = row["FollowUpDate"].ToString();
                        DateTime date;
                        if (DateTime.TryParseExact(dateString, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
                        {
                            row["FollowUpDate"] = date.ToString("yyyy-MM-dd HH:mm:ss");
                        }
                    }
                }
                UpdateEnquiryDetailsStatic.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
                UpdateEnquiryDetailsStatic.TVP_EnquiryFollowUpDetails = dtenquiryfollowup;
                UpdateEnquiryDetailsStatic.TVP_AttachmentDetails = dtattachment;
                UpdateEnquiryDetailsStatic.TVP_EnquiryAttachmentDetails = dtattachmentDynamic;

                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateEnquiryDetails]", UpdateEnquiryDetailsStatic);

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
            catch (Exception)
            {

                throw;
            }
        }


        [HttpGet]
        [Route("DeleteEnquiry")]
        public IActionResult DeleteClient(int enquiryId, int FranchiseId)
        {
            DeleteEnquiry request = new DeleteEnquiry()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                EnquiryId = enquiryId,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteEnquiryDetails]", request);
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

        private async Task<bool> IsClaimAttachmentUploadedDynamic(IFormFileCollection file, List<AttachmentTableDyanamicEnquiry> lstattachment)
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
    }
}
