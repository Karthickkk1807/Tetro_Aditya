using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Security.Claims;
using TetroONE.Models;
using TetroPos.Models;
using static TetroONE.Controllers.ContactController;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Contact")]
    public class ContactController : BaseController
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILog _logger;
        public ContactController(IConfiguration configuration, IWebHostEnvironment hostingEnvironment, ILog logger) : base(configuration)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Route("Client")]
        public IActionResult Client()
        {
            return View();
        }

        [Route("Vendor")]
        public IActionResult Vendor()
        {
            return View();
        }

        [Route("ServiceEngr")]
        public IActionResult ServiceEngr()
        {
            return View();
        }

        [Route("JobWorker")]
        public IActionResult JobWorker()
        {
            return View();
        }
        
        [Route("Contractor")]
        public IActionResult Contractor()
        {
            return View();
        }

        //===============================================================================================Vendor==========================================================================================================
        [HttpGet]
        [Route("GetVendor")]
        public IActionResult GetVendor()
        {
            GetVendor getVendor = new GetVendor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                VendorId = null,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetVendorDetails]", getVendor);
            return Json(response);
        }

        [HttpGet]
        [Route("GetVendorID")]
        public IActionResult GetVendorID(int VendorId)
        {
            GetVendor getVendor = new GetVendor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                VendorId = VendorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetVendorDetails]", getVendor);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateVendorDetails")]
        public async Task<IActionResult> InsertUpdateVendorDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateVendorDetails staticDetails = new InsertUpdateVendorDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateVendorDetails>(Request.Form["VendorData"]);

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
                    ModuleName = "Vendor"
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

            List<ContactPersonDetails>? staticData = JsonConvert.DeserializeObject<List<ContactPersonDetails>?>(Request.Form["VendorContactPersonDetails"]);
            DataTable ClientContactPersonDetails = GenericTetroONE.ToDataTable(staticData);

            List<VendorProductMappingDetails>? ProductMapping = JsonConvert.DeserializeObject<List<VendorProductMappingDetails>?>(Request.Form["VendorProductMappingDetails"]);
            DataTable ProductMappingDetails = GenericTetroONE.ToDataTable(ProductMapping);

            var spName = string.Empty;
            if (staticDetails.VendorId != null && staticDetails.VendorId != 0)
            {
                spName = "[dbo].[USP_UpdateVendorDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertVendorDetails]";
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@VendorName", staticDetails.VendorName);
                    command.Parameters.AddWithValue("@Address", staticDetails.Address);
                    command.Parameters.AddWithValue("@City", staticDetails.City);
                    command.Parameters.AddWithValue("@State", staticDetails.State);
                    command.Parameters.AddWithValue("@Country", staticDetails.Country);
                    command.Parameters.AddWithValue("@ZipCode", staticDetails.ZipCode);
                    command.Parameters.AddWithValue("@ContactNumber", staticDetails.ContactNumber);
                    command.Parameters.AddWithValue("@Email", staticDetails.Email);
                    command.Parameters.AddWithValue("@GSTNumber", staticDetails.GSTNumber);
                    command.Parameters.AddWithValue("@Remark", staticDetails.Remark);
                    command.Parameters.AddWithValue("@IFSCCode", staticDetails.IFSCCode);
                    command.Parameters.AddWithValue("@BankName", staticDetails.BankName);
                    command.Parameters.AddWithValue("@BranchName", staticDetails.BranchName);
                    command.Parameters.AddWithValue("@AccountType", staticDetails.AccountType);
                    command.Parameters.AddWithValue("@AccountName", staticDetails.AccountName);
                    command.Parameters.AddWithValue("@AccountNumber", staticDetails.AccountNumber);
                    command.Parameters.AddWithValue("@MaxCreditLimit", staticDetails.MaxCreditLimit == null ? (object)DBNull.Value : staticDetails.MaxCreditLimit);
                    command.Parameters.AddWithValue("@CurrentCreditLimit", staticDetails.CurrentCreditLimit == null ? (object)DBNull.Value : staticDetails.CurrentCreditLimit);

                    command.Parameters.AddWithValue("@TVP_ContactPersonDetails", ClientContactPersonDetails);
                    command.Parameters.AddWithValue("@TVP_VendorProductMappingDetails", ProductMappingDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.VendorId > 0)
                    {
                        command.Parameters.AddWithValue("@VendorId", staticDetails.VendorId);
                        command.Parameters.AddWithValue("@IsActive", staticDetails.IsActive);
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
        [Route("GetProductListVendor")]
        public IActionResult GetProductListVendor(string ModuleName)
        {
            int loginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var parameters = new { LoginUserId = loginUserId, ModuleName = ModuleName };
            var response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductListDetails_Vendor]", parameters);
            return Json(response);
        }

        public class DeleteVendor { public int LoginUserId { get; set; } public int? VendorId { get; set; } }
        [HttpGet]
        [Route("DeleteVendor")]
        public IActionResult DeleteVendor_1(int VendorId)
        {
            DeleteVendor getVendor = new DeleteVendor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                VendorId = VendorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteVendorDetails]", getVendor);
            return Json(response);
        }

        //===============================================================================================End Vendor==========================================================================================================
        //===============================================================================================Contractor==========================================================================================================
        [HttpGet]
        [Route("GetContractor")]
        public IActionResult GetContractor(int ContractorId)
        {
            GetContractor getContractor = new GetContractor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ContractorId = ContractorId == 0 ? null : ContractorId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetContractorDetails]", getContractor);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateContractorDetails")]
        public async Task<IActionResult> InsertUpdateContractorDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateContractorDetails staticDetails = new InsertUpdateContractorDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateContractorDetails>(Request.Form["ContractorData"]);

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
                    ModuleName = "Contractor"
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

            List<ContactPersonDetails>? staticData = JsonConvert.DeserializeObject<List<ContactPersonDetails>?>(Request.Form["ContractorContactPersonDetails"]);
            DataTable ClientContactPersonDetails = GenericTetroONE.ToDataTable(staticData);

            var spName = string.Empty;
            if (staticDetails.ContractorId != null && staticDetails.ContractorId != 0)
            {
                spName = "[dbo].[USP_UpdateContractorDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertContractorDetails]";
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@ContractorName", staticDetails.ContractorName);
                    command.Parameters.AddWithValue("@Address", staticDetails.Address);
                    command.Parameters.AddWithValue("@City", staticDetails.City);
                    command.Parameters.AddWithValue("@State", staticDetails.State);
                    command.Parameters.AddWithValue("@Country", staticDetails.Country);
                    command.Parameters.AddWithValue("@ZipCode", staticDetails.ZipCode);
                    command.Parameters.AddWithValue("@ContactNumber", staticDetails.ContactNumber);
                    command.Parameters.AddWithValue("@Email", staticDetails.Email);
                    command.Parameters.AddWithValue("@GSTNumber", staticDetails.GSTNumber);
                    command.Parameters.AddWithValue("@Remark", staticDetails.Remark);
                    command.Parameters.AddWithValue("@IFSCCode", staticDetails.IFSCCode);
                    command.Parameters.AddWithValue("@BankName", staticDetails.BankName);
                    command.Parameters.AddWithValue("@BranchName", staticDetails.BranchName);
                    command.Parameters.AddWithValue("@AccountType", staticDetails.AccountType);
                    command.Parameters.AddWithValue("@AccountName", staticDetails.AccountName);
                    command.Parameters.AddWithValue("@AccountNumber", staticDetails.AccountNumber);
                    command.Parameters.AddWithValue("@TVP_ContactPersonDetails", ClientContactPersonDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.ContractorId > 0)
                    {
                        command.Parameters.AddWithValue("@ContractorId", staticDetails.ContractorId);
                        command.Parameters.AddWithValue("@IsActive", staticDetails.IsActive);
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
        [Route("DeleteContractor")]
        public IActionResult DeleteContractor(int ContractorId) 
        {
            GetContractor getContractor = new GetContractor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ContractorId = ContractorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteContractorDetails]", getContractor);
            return Json(response);
        }

        //===============================================================================================End Vendor==========================================================================================================


        //===============================================================================================Client==========================================================================================================

        [HttpGet]
        [Route("GetClient")]
        public IActionResult GetClient()
        {
            GetClient getClient = new GetClient()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ClientId = null,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetClientDetails]", getClient);
            return Json(response);
        }

        [HttpGet]
        [Route("GetClientID")]
        public IActionResult GetClientID(int ClientId)
        {
            GetClient getClient = new GetClient()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ClientId = ClientId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetClientDetails]", getClient);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateClientDetails")]
        public async Task<IActionResult> InsertUpdateClientDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateClientDetails staticDetails = new InsertUpdateClientDetails();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateClientDetails>(Request.Form["ClientData"]);

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
                    ModuleName = "Client"
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

            List<ContactPersonDetails>? staticData = JsonConvert.DeserializeObject<List<ContactPersonDetails>?>(Request.Form["ClientContactPersonDetails"]);
            DataTable ClientContactPersonDetails = GenericTetroONE.ToDataTable(staticData);

            var spName = string.Empty;
            if (staticDetails.ClientId != null && staticDetails.ClientId != 0)
            {
                spName = "[dbo].[USP_UpdateClientDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertClientDetails]";
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@ClientName", staticDetails.ClientName);
                    command.Parameters.AddWithValue("@Address", staticDetails.Address);
                    command.Parameters.AddWithValue("@City", staticDetails.City);
                    command.Parameters.AddWithValue("@State", staticDetails.State);
                    command.Parameters.AddWithValue("@Country", staticDetails.Country);
                    command.Parameters.AddWithValue("@ZipCode", staticDetails.ZipCode);
                    command.Parameters.AddWithValue("@ContactNumber", staticDetails.ContactNumber);
                    command.Parameters.AddWithValue("@Email", staticDetails.Email);
                    command.Parameters.AddWithValue("@GSTNumber", staticDetails.GSTNumber);
                    command.Parameters.AddWithValue("@CreditLimit", staticDetails.CreditLimit);
                    //command.Parameters.AddWithValue("@CurrentCreditLimit", staticDetails.CurrentCreditLimit);
                    command.Parameters.AddWithValue("@Remark", staticDetails.Remark);

                    command.Parameters.AddWithValue("@TVP_ContactPersonDetails", ClientContactPersonDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.ClientId > 0)
                    {
                        command.Parameters.AddWithValue("@ClientId", staticDetails.ClientId);
                        command.Parameters.AddWithValue("@IsActive", staticDetails.IsActive);
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
        [Route("DeleteClient")]
        public IActionResult DeleteClient(int ClientId)
        {
            DeleteClient getClient = new DeleteClient()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ClientId = ClientId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteClientDetails]", getClient);

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


        //===============================================================================================Vendor==========================================================================================================
        [HttpGet]
        [Route("GetJobWorker")]
        public IActionResult GetJobWorker(int? JobWorkerId)
        {
            GetJobWorker getJobWorker = new GetJobWorker()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                JobWorkerId = JobWorkerId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetJobWorkersDetails]", getJobWorker);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateJobWorkerDetails")]
        public async Task<IActionResult> InsertUpdateJobWorkerDetails()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateJobWorker staticDetails = new InsertUpdateJobWorker();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateJobWorker>(Request.Form["JobWorkersData"]);

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
                    ModuleName = "JobWorker"
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

            List<ContactPersonDetails>? staticData = JsonConvert.DeserializeObject<List<ContactPersonDetails>?>(Request.Form["JobWorkerContactPersonDetails"]);
            DataTable ClientContactPersonDetails = GenericTetroONE.ToDataTable(staticData);

            var spName = string.Empty;
            if (staticDetails.JobWorkerId != null && staticDetails.JobWorkerId != 0)
            {
                spName = "[dbo].[USP_UpdateJobWorkersDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertJobWorkersDetails]";
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@JobWorkerName", staticDetails.JobWorkerName);
                    command.Parameters.AddWithValue("@Address", staticDetails.Address);
                    command.Parameters.AddWithValue("@City", staticDetails.City);
                    command.Parameters.AddWithValue("@State", staticDetails.State);
                    command.Parameters.AddWithValue("@Country", staticDetails.Country);
                    command.Parameters.AddWithValue("@ZipCode", staticDetails.ZipCode);
                    command.Parameters.AddWithValue("@ContactNumber", staticDetails.ContactNumber);
                    command.Parameters.AddWithValue("@Email", staticDetails.Email);
                    command.Parameters.AddWithValue("@GSTNumber", staticDetails.GSTNumber);
                    command.Parameters.AddWithValue("@Remark", staticDetails.Remark);
                    command.Parameters.AddWithValue("@IFSCCode", staticDetails.IFSCCode);
                    command.Parameters.AddWithValue("@BankName", staticDetails.BankName);
                    command.Parameters.AddWithValue("@BranchName", staticDetails.BranchName);
                    command.Parameters.AddWithValue("@AccountType", staticDetails.AccountType);
                    command.Parameters.AddWithValue("@AccountName", staticDetails.AccountName);
                    command.Parameters.AddWithValue("@AccountNumber", staticDetails.AccountNumber);

                    command.Parameters.AddWithValue("@TVP_ContactPersonDetails", ClientContactPersonDetails);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.JobWorkerId > 0)
                    {
                        command.Parameters.AddWithValue("@JobWorkerId", staticDetails.JobWorkerId);
                        command.Parameters.AddWithValue("@IsActive", staticDetails.IsActive);
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
        [Route("DeleteJobWorker")]
        public IActionResult DeleteJobWorker(int JobWorkerId)
        {
            GetJobWorker getJobWorkers = new GetJobWorker()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                JobWorkerId = JobWorkerId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteJobWorkersDetails]", getJobWorkers);
            return Json(response);
        }

        //===============================================================================================End JobWorkers==========================================================================================================


        //===============================================================================================Franchise=====================================================================================

        [HttpGet]
        [Route("GetFranchise")]
        public IActionResult GetFranchise(int? FranchiseId)
        {
            GetFranchise getFranchise = new GetFranchise()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetFranchiseDetails]", getFranchise);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateFranchise")]
        public async Task<IActionResult> InsertUpdateFranchise()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertUpdateFranchise staticDetails = new InsertUpdateFranchise();

            staticDetails = JsonConvert.DeserializeObject<InsertUpdateFranchise>(Request.Form["FranchiseData"]);

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
                    ModuleName = "Franchise"
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

            List<ContactPersonDetails>? staticData = JsonConvert.DeserializeObject<List<ContactPersonDetails>?>(Request.Form["FranchiseContactData"]);
            DataTable FranchiseContactData = GenericTetroONE.ToDataTable(staticData);


            string SignatureRelativeFilePath = string.Empty, SignaturefileName = string.Empty;
            string signatureImage = !string.IsNullOrEmpty(staticDetails.Signature) ? staticDetails.Signature.Split('.')[0] : "";
            if (!string.IsNullOrEmpty(staticDetails.Signature) && !Guid.TryParse(signatureImage, out _))
            {
                string guid = Guid.NewGuid().ToString();
                string SignatureRelative = Path.Combine("TetroOne");
                SignaturefileName = guid + Path.GetExtension(staticDetails.Signature)?.ToLowerInvariant();
                SignatureRelativeFilePath = "..\\" + SignatureRelative + "\\" + SignaturefileName;
                SignatureRelativeFilePath = SignatureRelativeFilePath.Replace("\\", "/");
            }
            else
            {
                SignatureRelativeFilePath = staticDetails.Signature;
            }

            if (SignatureRelativeFilePath == null && staticDetails.SignatureExistingImage != null)
            {
                SignatureRelativeFilePath = staticDetails.SignatureExistingImage;
            }

            var spName = string.Empty;
            if (staticDetails.FranchiseId != null && staticDetails.FranchiseId != 0)
            {
                spName = "[dbo].[USP_UpdateFranchiseDetails]";
            }
            else
            {
                spName = "[dbo].[USP_InsertFranchiseDetails]";
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@FranchiseName", staticDetails.FranchiseName);
                    command.Parameters.AddWithValue("@FranchiseAddress", staticDetails.FranchiseAddress);
                    command.Parameters.AddWithValue("@FranchiseCity", staticDetails.FranchiseCity);
                    command.Parameters.AddWithValue("@FranchiseStateId", staticDetails.FranchiseStateId);
                    command.Parameters.AddWithValue("@FranchiseZipCode", staticDetails.FranchiseZipCode);
                    command.Parameters.AddWithValue("@FranchiseContactNo", staticDetails.FranchiseContactNo);
                    command.Parameters.AddWithValue("@FranchiseEmail", staticDetails.FranchiseEmail);
                    command.Parameters.AddWithValue("@FranchiseWebsite", staticDetails.FranchiseWebsite);
                    command.Parameters.AddWithValue("@FranchiseGSTNumber", staticDetails.FranchiseGSTNumber);
                    command.Parameters.AddWithValue("@FranchiseCountry", staticDetails.FranchiseCountry);
                    command.Parameters.AddWithValue("@Remarks", staticDetails.Remarks);
                    command.Parameters.AddWithValue("@CollaboratedDate", staticDetails.CollaboratedDate);
                    command.Parameters.AddWithValue("@ExpiryDate", staticDetails.ExpiryDate);
                    command.Parameters.AddWithValue("@BankName", staticDetails.BankName);
                    command.Parameters.AddWithValue("@BranchName", staticDetails.BranchName);
                    command.Parameters.AddWithValue("@AccountType", staticDetails.AccountType);
                    command.Parameters.AddWithValue("@AccountName", staticDetails.AccountName);
                    command.Parameters.AddWithValue("@AccountNumber", staticDetails.AccountNumber);
                    command.Parameters.AddWithValue("@IFSCCode", staticDetails.IFSCCode);
                    command.Parameters.AddWithValue("@UPIId", staticDetails.UPIId);
                    command.Parameters.AddWithValue("@Signature", SignatureRelativeFilePath);
                    command.Parameters.AddWithValue("@TVP_ContactPersonDetails", FranchiseContactData);
                    command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

                    if (staticDetails.FranchiseId > 0)
                    {
                        command.Parameters.AddWithValue("@FranchiseId", staticDetails.FranchiseId);
                        command.Parameters.AddWithValue("@IsActive", staticDetails.IsActive);
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
                    response.Data = SignatureRelativeFilePath;
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
        [Route("DeleteFranchise")]
        public IActionResult DeleteFranchise(int FranchiseId)
        {
            GetFranchise deleteFranchise = new GetFranchise()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteFranchiseDetails]", deleteFranchise);
            return Json(response);
        }


        private async Task<bool> IsClaimAttachmentUploadedDynamic(IFormFileCollection file, List<AttachmentTableDyanamicClient> lstattachment)
        {
            bool isuploaded = false;
            try
            {
                foreach (var item in file)
                {
                    var filenameInfo = lstattachment.FirstOrDefault(x => x.AttachmentExactFileName == item.FileName);
                    if (filenameInfo != null)
                    {
                        var filename = filenameInfo.Visi_AttachmentFileName;
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
            }
            catch (Exception ex)
            {
                isuploaded = false;
            }
            return isuploaded;
        }

        //===============================================================================================ServiceEngr=====================================================================================


        //[HttpGet]
        //[Route("GetServiceEngr")]
        //public IActionResult GetServiceEngr(int BranchId, int ServiceEngrId)
        //{
        //    GetServiceEngr getVendor = new GetServiceEngr()
        //    {
        //        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
        //        BranchId = BranchId,
        //        ServiceEngrId = ServiceEngrId != 0 ? ServiceEngrId : null,
        //    };

        //    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetServiceEngrDetails]", getVendor);
        //    return Json(response);
        //}

        //[HttpPost]
        //[Route("InsertUpdateServiceEngr")]
        //public IActionResult InsertUpdateServiceEngr([FromBody] InsertUpdateServiceEngr request)
        //{
        //    DataTable ContactPersonDetails = new DataTable();
        //    ContactPersonDetails = GenericTetroONE.ToDataTable(request.ContactPersonDetails);



        //    request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
        //    request.TVP_ContactPersonDetails = ContactPersonDetails;


        //    if (request.ServiceEngrId != null && request.ServiceEngrId != 0)
        //    {
        //        string[] Exclude = { "ContactPersonDetails", "ContactBranchMappingDetails" };
        //        response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateServiceEngrDetails]", request, Exclude);
        //    }
        //    else
        //    {
        //        string[] Exclude = { "ContactPersonDetails", "ContactBranchMappingDetails", "ServiceEngrId", "IsActive" };
        //        response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertServiceEngrDetails]", request, Exclude);
        //    }

        //    return Json(response);
        //}

        //public class DeleteServiceEngrClass { public int LoginUserId { get; set; } public int? ServiceEngrId { get; set; } }
        //[HttpGet]
        //[Route("DeleteServiceEngr")]
        //public IActionResult DeleteServiceEngr(int ServiceEngrId)
        //{
        //    DeleteServiceEngrClass getDelete = new DeleteServiceEngrClass()
        //    {
        //        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
        //        ServiceEngrId = ServiceEngrId
        //    };

        //    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteServiceEngrDetails]", getDelete);
        //    return Json(response);
        //}

        public class GstVerifyModel
        {
            public string GstNumber { get; set; }
            public bool IsValid { get; set; }
            public string Gstin { get; set; }
            public string LegalName { get; set; }
            public string TradeName { get; set; }
            public string State { get; set; }
            public string Status { get; set; }
        }

        [HttpGet]
        [Route("VerifyGST")]
        public async Task<IActionResult> VerifyGST(string gstNumber)
        {
            if (string.IsNullOrEmpty(gstNumber) || gstNumber.Length != 15)
                return Json(new { flag = false, message = "Invalid GST number" });

            string apiKey = "cb3dee1f5c0f6cbc0c759e4b3dc821af";
            string url = $"https://sheet.gstincheck.co.in/check/{apiKey}/{gstNumber}";

            using (HttpClient client = new HttpClient())
            {
                var apiResponse = await client.GetAsync(url);

                // Read JSON from API
                var json = await apiResponse.Content.ReadAsStringAsync();

                // Return SAME JSON to UI
                return Content(json, "application/json");
            }
        }

    }
}
