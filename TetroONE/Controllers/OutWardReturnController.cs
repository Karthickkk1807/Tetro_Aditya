using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("OutWardReturn")]
    public class OutWardReturnController : BaseController
    {
        public OutWardReturnController(IConfiguration configuration) : base(configuration)
        {

        }

        [Route("OutWardReturn")]
        public IActionResult OutWardReturn()
        {
            return View();
        }

        [HttpGet]
        [Route("GetInwardReturn")]
        public IActionResult GetInwardReturn(int? PlantId, int? InwardReturnId, DateTime? FromDate, DateTime? ToDate)
        {
            GetInwardReturn request = new GetInwardReturn()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                PlantId = PlantId,
                InwardReturnId = InwardReturnId,
                FromDate = FromDate.HasValue ? FromDate.Value.AddDays(1) : (DateTime?)null,
                ToDate = ToDate,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetInwardReturnDetails]", request);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateOutwardReturnDetails")]
        public async Task<IActionResult> InsertUpdateOutwardDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateInwardReturnDetails staticDetails = new InsertUpdateInwardReturnDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateInwardReturnDetails>(Request.Form["OutwardReturnStaticData"]);

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
                    ModuleName = "InwardReturn"
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

            List<InwardReturnFabricDetails>? OutwardReturnFabric = JsonConvert.DeserializeObject<List<InwardReturnFabricDetails>?>(Request.Form["OutwardReturnFabricDetails"]);
            DataTable OutwardReturnFabricDetails = GenericTetroONE.ToDataTable(OutwardReturnFabric);

            var spName = string.Empty;
            if (staticDetails.InwardReturnId != null && staticDetails.InwardReturnId != 0)
            {
                spName = "[dbo].[USP_UpdateInwardReturnDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertInwardReturnDetails]";
            }

            DataSet ds = new DataSet();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@InwardReturnDate", staticDetails.InwardReturnDate);
                    command.Parameters.AddWithValue("@InwardReturnNo", staticDetails.InwardReturnNo);
                    command.Parameters.AddWithValue("@InwardReturnBy", staticDetails.InwardReturnBy);
                    command.Parameters.AddWithValue("@PackingSlipNo", staticDetails.PackingSlipNo == null ? (object)DBNull.Value : staticDetails.PackingSlipNo);
                    command.Parameters.AddWithValue("@ShipFrom", staticDetails.ShipFrom);
                    command.Parameters.AddWithValue("@ShipTo", staticDetails.ShipTo);
                    command.Parameters.AddWithValue("@ShipToAddress", staticDetails.ShipToAddress);
                    command.Parameters.AddWithValue("@ShipToCity", staticDetails.ShipToCity);
                    command.Parameters.AddWithValue("@ShiptoMobileNo", staticDetails.ShiptoMobileNo);
                    command.Parameters.AddWithValue("@ShipToPlaceOfSupply", staticDetails.ShipToPlaceOfSupply);
                    command.Parameters.AddWithValue("@NoofFabric", staticDetails.NoofFabric);
                    command.Parameters.AddWithValue("@TotalReturnQty", staticDetails.TotalReturnQty);
                    command.Parameters.AddWithValue("@TotalRolls", staticDetails.TotalRolls);
                    command.Parameters.AddWithValue("@Notes", staticDetails.Notes == null ? (object)DBNull.Value : staticDetails.Notes);
                    command.Parameters.AddWithValue("@VehicleNo", staticDetails.VehicleNo);
                    command.Parameters.AddWithValue("@DriverName", staticDetails.DriverName);
                    command.Parameters.AddWithValue("@InwardId", staticDetails.InwardId == null ? (object)DBNull.Value : staticDetails.InwardId);
                    command.Parameters.AddWithValue("@PlantId", staticDetails.PlantId);
                    command.Parameters.AddWithValue("@TotalInwardQty", staticDetails.TotalInwardQty);
                    command.Parameters.AddWithValue("@TotalOutwardQty", staticDetails.TotalOutwardQty);
                    command.Parameters.AddWithValue("@OutWardTo", staticDetails.OutWardTo);

                    command.Parameters.AddWithValue("@TVP_InwardReturnFabricDetails", OutwardReturnFabricDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.InwardReturnId > 0)
                    {
                        command.Parameters.AddWithValue("@InwardReturnId", staticDetails.InwardReturnId);
                        command.Parameters.AddWithValue("@ReturnStatusId", staticDetails.ReturnStatusId);
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
        [Route("DeleteInWardReturnDetails")]
        public IActionResult DeleteInWardReturnDetails(int InWardReturnId)
        {
            DeleteInWardReturnDetails getOutWard = new DeleteInWardReturnDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                InWardReturnId = InWardReturnId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteInWardReturnDetails]", getOutWard);

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
    }
}