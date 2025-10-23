using ClosedXML.Excel;
using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Ticketing")]
    public class TicketingController : BaseController
    {
        public TicketingController(IConfiguration configuration) : base(configuration)
        {

        }
        public IActionResult Ticketing()
        {
            return View();
        }

        [HttpGet]
        [Route("GetTicketing")]
        public IActionResult GetLeave(int? TicketId, int FranchiseId, DateTime? FromDate, DateTime? ToDate)
        {
            GetTicketing Get = new GetTicketing()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                TicketId = TicketId,
                FranchiseId = FranchiseId,
                FromDate = FromDate,
                ToDate = ToDate
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetTicketDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateTicketing")]
        public async Task<IActionResult> InsertUpdateTicketing()
        {
            IFormFileCollection file = Request.Form.Files;
            List<AttachmentTable> lstattachment = new List<AttachmentTable>();
            DataTable dtattachment = new DataTable();

            List<AttachmentTableDyanamic> DyanamicAttachment = JsonConvert.DeserializeObject<List<AttachmentTableDyanamic>?>(Request.Form["DyanamicAttachment"]);

            List<AttachmentTableDyanamic> lstattachmentDynamic = new List<AttachmentTableDyanamic>();
            DataTable dtattachmentDynamic = new DataTable();

            foreach (var item in file)
            {
                var matchingDocument = DyanamicAttachment.FirstOrDefault(d => d.AttachmentFileName == item.FileName);
                if (!lstattachmentDynamic.Any(x => x.AttachmentExactFileName == item.FileName)
                        && matchingDocument != null
                        && matchingDocument.AttachmentFileName == item.FileName)
                {
                    var attachmentName = GetFilePath(item.FileName);
                    lstattachmentDynamic.Add(new AttachmentTableDyanamic()
                    {
                        TicketFollowUpAttachmentId = null,
                        AttachmentExactFileName = item.FileName,
                        AttachmentFileName = attachmentName.Item1,
                        AttachmentFilePath = attachmentName.Item2,
                        RowNumber = matchingDocument.RowNumber,
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
                        ModuleName = "Ticket"
                    });
                }
            }

            bool isuploadedDynamic = await IsTicketingAttachmentUploadedDynamic(file, lstattachmentDynamic);

            foreach (var item in lstattachmentDynamic)
            {
                item.AttachmentFileName = item.AttachmentExactFileName;
            }
            List<AttachmentTableDyanamic> existFilesDyn = JsonConvert.DeserializeObject<List<AttachmentTableDyanamic>?>(Request.Form["ExistFilesDyanamicAttachment"]);

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
                InsertOrUpdateTicketing InsertUpdateTicketDetailsStatic =
                    JsonConvert.DeserializeObject<InsertOrUpdateTicketing>(Request.Form["TicketDetailsStatic"]);

                List<TicketFollowUpDetails>? TicketFollowUpDetails =
                    JsonConvert.DeserializeObject<List<TicketFollowUpDetails>?>(Request.Form["TicketFollowupDetailsArray"]);

                DataTable ticketFollowUpDetails = new DataTable();
                ticketFollowUpDetails = GenericTetroONE.ToDataTable(TicketFollowUpDetails);

                foreach (DataRow row in ticketFollowUpDetails.Rows)
                {
                    if (ticketFollowUpDetails.Columns.Contains("TicketFollowUpDate"))
                    {
                        string dateString = row["TicketFollowUpDate"].ToString();
                        DateTime date;
                        if (DateTime.TryParseExact(dateString, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
                        {
                            row["TicketFollowUpDate"] = date.ToString("yyyy-MM-dd HH:mm:ss");
                        }
                    }
                }
                InsertUpdateTicketDetailsStatic.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
                InsertUpdateTicketDetailsStatic.TVP_AttachmentDetails = dtattachment;
                InsertUpdateTicketDetailsStatic.TVP_TicketFollowUpDetails = ticketFollowUpDetails;
                InsertUpdateTicketDetailsStatic.TVP_TicketFollowUpAttachmentDetails = dtattachmentDynamic;
                if (InsertUpdateTicketDetailsStatic.TicketId != null && InsertUpdateTicketDetailsStatic.TicketId != 0)
                {
                    response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateTicketDetails]", InsertUpdateTicketDetailsStatic);
                }
                else
                {
                    InsertUpdateTicketDetailsStatic.TicketDate = DateTime.Now;
                    InsertUpdateTicketDetailsStatic.CreatedById = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData)?.Value);
                    string[] Exclude = { "TicketStatusId", "TicketId" };
                    response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertTicketDetails]", InsertUpdateTicketDetailsStatic, Exclude);
                }
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

        public class DeleteTicket_Class { public int? LoginUserId { get; set; } public int? TicketId { get; set; } }

        [HttpGet]
        [Route("DeleteTicket")]
        public IActionResult DeleteTicket(int? TicketId)
        {
            DeleteTicket_Class request = new DeleteTicket_Class()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                TicketId = TicketId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteTicketDetails]", request);
            return Json(response);
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

        private async Task<bool> IsTicketingAttachmentUploadedDynamic(IFormFileCollection file, List<AttachmentTableDyanamic> lstattachment)
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