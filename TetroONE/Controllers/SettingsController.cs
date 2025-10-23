using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Crypto.Operators;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Settings")]
    public class SettingsController : BaseController
    {
        public SettingsController(IConfiguration configuration) : base(configuration)
        {

        }
        [Route("CompanySetting")]
        public IActionResult CompanySetting()
        {
            return View();
        }
        [Route("OtherSettings")]
        public IActionResult OtherSettings()
        {
            return View();
        }

        [HttpGet]
        [Route("GetCompanySetting")]
        public IActionResult GetCompanySetting()
        {
            Settings Get = new Settings()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                CompanyId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.DenyOnlySid).Value)
            };

            response = GenericTetroONE.GetData(_connectionString, "USP_GetCompanyDetails", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("UpdateSetting")]
        public async Task<IActionResult> UpdateSetting([FromBody] UpdateSettings request)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            _companyId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.DenyOnlySid).Value);

            string relativeFilePath = string.Empty, fileName = string.Empty;
            string SignatureRelativeFilePath = string.Empty, SignaturefileName = string.Empty;

            string employeeImage = !string.IsNullOrEmpty(request.CompanyLogoFileName) ? request.CompanyLogoFileName.Split('.')[0] : "";
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            if (!string.IsNullOrEmpty(request.CompanyLogoFileName) && !Guid.TryParse(employeeImage, out _))
            {
                string guid = Guid.NewGuid().ToString();
                string relativePath = Path.Combine("TetroOne");
                fileName = guid + Path.GetExtension(request.CompanyLogoFileName)?.ToLowerInvariant();
                relativeFilePath = "..\\" + relativePath + "\\" + fileName;
                relativeFilePath = relativeFilePath.Replace("\\", "/");

                var uriClaim = claimsIdentity.FindFirst(ClaimTypes.Uri);

                if (uriClaim != null)
                {
                    claimsIdentity.RemoveClaim(uriClaim);
                }
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Uri, relativeFilePath));

            }
            else
            {
                relativeFilePath = request.CompanyLogoFileName;
            }

            if (relativeFilePath == null && request.ExistingImage != null)
            {
                relativeFilePath = request.ExistingImage;
            }

            var SystemClaim = claimsIdentity.FindFirst(ClaimTypes.System);

            if (SystemClaim != null)
            {
                claimsIdentity.RemoveClaim(SystemClaim);
            }
            claimsIdentity.AddClaim(new Claim(ClaimTypes.System, request.CompanyName));
            var newPrincipal = new ClaimsPrincipal(claimsIdentity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, newPrincipal);


            string signatureImage = !string.IsNullOrEmpty(request.Signature) ? request.Signature.Split('.')[0] : "";
            if (!string.IsNullOrEmpty(request.Signature) && !Guid.TryParse(signatureImage, out _))
            {
                string guid = Guid.NewGuid().ToString();
                string SignatureRelative = Path.Combine("TetroOne");
                SignaturefileName = guid + Path.GetExtension(request.Signature)?.ToLowerInvariant();
                SignatureRelativeFilePath = "..\\" + SignatureRelative + "\\" + SignaturefileName;
                SignatureRelativeFilePath = SignatureRelativeFilePath.Replace("\\", "/");
            }
            else
            {
                SignatureRelativeFilePath = request.Signature;
            }

            if (SignatureRelativeFilePath == null && request.SignatureExistingImage != null)
            {
                SignatureRelativeFilePath = request.SignatureExistingImage;
            }



            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[USP_UpdateCompanyDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@CompanyId", _companyId);
                    command.Parameters.AddWithValue("@CompanyName", request.CompanyName);
                    command.Parameters.AddWithValue("@CompanyLogoFileName", request.CompanyLogoFileName);
                    command.Parameters.AddWithValue("@CompanyLogoFilePath", relativeFilePath);
                    command.Parameters.AddWithValue("@Address", request.Address);
                    command.Parameters.AddWithValue("@City", request.City);
                    command.Parameters.AddWithValue("@State", request.State);
                    command.Parameters.AddWithValue("@Country", request.Country);
                    command.Parameters.AddWithValue("@ZipCode", request.ZipCode);
                    command.Parameters.AddWithValue("@ContactNumber", request.ContactNumber);
                    command.Parameters.AddWithValue("@Email", request.Email);
                    command.Parameters.AddWithValue("@Website", request.Website);
                    command.Parameters.AddWithValue("@GSTNumber", request.GSTNumber);
                    command.Parameters.AddWithValue("@BankName", request.BankName);
                    command.Parameters.AddWithValue("@BranchName", request.BranchName);
                    command.Parameters.AddWithValue("@AccountType", request.AccountType);
                    command.Parameters.AddWithValue("@AccountName", request.AccountName);
                    command.Parameters.AddWithValue("@AccountNumber", request.AccountNumber);
                    command.Parameters.AddWithValue("@IFSCCode", request.IFSCCode);
                    command.Parameters.AddWithValue("@UPIId", request.UPIId);
                    command.Parameters.AddWithValue("@Signature", SignatureRelativeFilePath);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    command.ExecuteNonQuery();

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    response.Data = new { FilePath = relativeFilePath, SignaturePath = SignatureRelativeFilePath };

                }
                connection.Close();

                string existvendorImage = !string.IsNullOrEmpty(request.ExistingImage) ? Path.GetFileNameWithoutExtension(request.ExistingImage) : "";

                if (response.Status && !string.IsNullOrEmpty(request.CompanyLogoFileName)
                    && Guid.TryParse(existvendorImage, out _) && !string.IsNullOrEmpty(employeeImage))
                {

                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
                    string filePath = directoryPath + Convert.ToString(request.ExistingImage)
                                .Replace("..", "").Replace("/", "\\");
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }
            return Json(response);
        }


        //=============================================================================EndOfSettings============================================================================

        //=============================================================================AlterSettings============================================================================

        [HttpGet]
        [Route("GetCompanyAlternativeSetting")]
        public IActionResult GetCompanyAlternativeSetting(int? AlternateCompanyId)
        {
            GetCompanyAlternativeSetting Get = new GetCompanyAlternativeSetting()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AlternateCompanyId = AlternateCompanyId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAlternateCompanyDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertAlternativeSetting")]
        public IActionResult InsertAlternativeSetting([FromBody] InsertAlternativeSetting request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string storedProcedure = (request.AlternateCompanyId != null)
                 ? "[dbo].[USP_UpdateAlternateCompanyDetails]"
                 : "[dbo].[USP_InsertAlternateCompanyDetails]";

            string[] Exculuted = { "AlternateCompanyId" };
            if (storedProcedure == "[dbo].[USP_InsertAlternateCompanyDetails]")
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, Exculuted);
            else
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request);

            return Json(response);
        }

        [HttpGet]
        [Route("DeleteAlternativeSetting")]
        public IActionResult DeleteAlternativeSetting(int? AlternateCompanyId)
        {
            GetCompanyAlternativeSetting Get = new GetCompanyAlternativeSetting()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AlternateCompanyId = AlternateCompanyId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteAlternateCompanyDetails]", Get);
            return Json(response);
        }

        //=============================================================================EndOfAlterSettings============================================================================



        //=============================================================================BankSettings============================================================================

        [HttpGet]
        [Route("GetBankDetails")]
        public IActionResult GetBankDetails(int? BankId)
        {
            GetBankDetails Get = new GetBankDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                BankId = BankId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetBankDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertBankDetails")]
        public IActionResult InsertBankDetails([FromBody] InsertBankDetails request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string storedProcedure = (request.BankId != null)
                 ? "[dbo].[USP_UpdateBankDetails]"
                 : "[dbo].[USP_InsertBankDetails]";

            string[] Exculuted = { "BankId" };
            if (storedProcedure == "[dbo].[USP_InsertBankDetails]")
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, Exculuted);
            else
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request);

            return Json(response);
        }

        [HttpGet]
        [Route("DeleteBankDetails")]
        public IActionResult DeleteBankDetails(int? BankId)
        {
            GetBankDetails Get = new GetBankDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                BankId = BankId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteBankDetails]", Get);
            return Json(response);
        }

        //=============================================================================BankSettings============================================================================






        [HttpGet]
        [Route("GetMasterInfo")]
        public IActionResult GetMasterInfo(int MasterInfoId, int FranchiseId, string ModuleName)
        {
            GetMasterInfo Get = new GetMasterInfo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = MasterInfoId == 0 ? null : MasterInfoId,
                ModuleName = ModuleName,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetMasterInfoDetails]", Get);
            return Json(response);
        }


        [HttpPost]
        [Route("InsertUpdateMasterInfo")]
        public IActionResult InsertUpdateMasterInfo([FromBody] InsertUpdateMasterInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataTable masterInfoMappingDetails = new DataTable();
            masterInfoMappingDetails = GenericTetroONE.ToDataTable(request.masterInfoMappingDetails);
            request.TVP_MasterInfoMappingDetails = masterInfoMappingDetails;

            string[] Exculuted = (request.MasterInfoId != null)
                ? new string[] { "masterInfoMappingDetails" }
                : new string[] { "MasterInfoId", "masterInfoMappingDetails" };

            string storedProcedure = (request.MasterInfoId != null)
                ? "[dbo].[USP_UpdateMasterInfoDetails]"
                : "[dbo].[USP_InsertMasterInfoDetails]";

            response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, Exculuted);

            return Json(response);

        }

        public class DeleteMasterInfo { public int LoginUserId { get; set; } public int? MasterInfoId { get; set; } public string ModuleName { get; set; } }
        [HttpGet]
        [Route("DeleteMasterInfo")]
        public IActionResult DeleteMasterInfo_1(int MasterInfoId, string ModuleName)
        {
            DeleteMasterInfo Delete = new DeleteMasterInfo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = MasterInfoId,
                ModuleName = ModuleName
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteMasterInfoDetails]", Delete);
            return Json(response);
        }

        [HttpGet]
        [Route("GetProductionStage")]
        public IActionResult GetProductionStage(int ProductionStagesId, int FranchiseId)
        {
            GetProductionStage Get = new GetProductionStage()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductionStagesId = ProductionStagesId == 0 ? null : ProductionStagesId,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductionStagesDetails]", Get);
            return Json(response);
        }


        [HttpPost]
        [Route("InsertUpdateProductionStage")]
        public IActionResult InsertUpdateProductionStage([FromBody] InsertUpdateProductionStage request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataTable masterInfoMappingDetails = new DataTable();
            masterInfoMappingDetails = GenericTetroONE.ToDataTable(request.masterInfoMappingDetails);

            request.TVP_MasterInfoMappingDetails = masterInfoMappingDetails;

            string[] Exculuted = (request.ProductionStagesId != null && request.ProductionStagesId != 0)
                ? new string[] { "masterInfoMappingDetails" }
                : new string[] { "masterInfoMappingDetails", "ProductionStagesId" };

            string storedProcedure = (request.ProductionStagesId != null && request.ProductionStagesId != 0)
                ? "[dbo].[USP_UpdateProductionStagesDetails]"
                : "[dbo].[USP_InsertProductionStagesDetails]";

            response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, Exculuted);

            return Json(response);
        }
        public class DeleteProductionStage_1 { public int LoginUserId { get; set; } public int? ProductionStagesId { get; set; } }
        [HttpGet]
        [Route("DeleteProductionStage")]
        public IActionResult DeleteProductionStage(int ProductionStagesId)
        {
            DeleteProductionStage_1 Delete = new DeleteProductionStage_1()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductionStagesId = ProductionStagesId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductionStagesDetails]", Delete);
            return Json(response);
        }

        //=============================================================================Cretaria============================================================================

        //[HttpGet]
        //[Route("GetCretaria")]
        //public IActionResult GetCretaria(int CriteriaId, int FranchiseId)
        //{
        //    GetCretaria Get = new GetCretaria()
        //    {
        //        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
        //        CriteriaId = CriteriaId == 0 ? null : CriteriaId,
        //        FranchiseId = FranchiseId
        //    };

        //    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetCriteriaDetails]", Get);
        //    return Json(response);
        //}


        //[HttpPost]
        //[Route("InsertUpdateCretaria")]
        //public IActionResult InsertUpdateCretaria([FromBody] InsertUpdateCretaria request)
        //{
        //    request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

        //    DataTable masterInfoMappingDetails = new DataTable();
        //    masterInfoMappingDetails = GenericTetroONE.ToDataTable(request.masterInfoMappingDetails);

        //    request.TVP_MasterInfoMappingDetails = masterInfoMappingDetails;

        //    string[] Exculuted = (request.CriteriaId != null && request.CriteriaId != 0)
        //        ? new string[] { "masterInfoMappingDetails" }
        //        : new string[] { "masterInfoMappingDetails", "CriteriaId" };

        //    string storedProcedure = (request.CriteriaId != null && request.CriteriaId != 0)
        //        ? "[dbo].[USP_UpdateCriteriaDetails]"
        //        : "[dbo].[USP_InsertCriteriaDetails]";

        //    response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, Exculuted);

        //    return Json(response);
        //}

        //public class DeletedForCretaria { public int LoginUserId { get; set; } public int? CriteriaId { get; set; } }
        //[HttpGet]
        //[Route("DeleteCretaria")]
        //public IActionResult DeleteCretaria(int CriteriaId)
        //{
        //    DeletedForCretaria Delete = new DeletedForCretaria()
        //    {
        //        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
        //        CriteriaId = CriteriaId,
        //    };

        //    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteCriteriaDetails]", Delete);
        //    return Json(response);
        //}
        //=====================================================================================================================
        [HttpGet]
        [Route("GetProductSubCategoryDetails")]
        public IActionResult GetCretaria(int ProductSubCategoryId)
        {
            GetProductSubCategory Get = new GetProductSubCategory()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductSubCategoryId = ProductSubCategoryId == 0 ? null : ProductSubCategoryId,

            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductSubCategoryDetails]", Get);
            return Json(response);
        }


        [HttpPost]
        [Route("InsertUpdateProductSubCategory")]
        public IActionResult InsertUpdateProductSubCategory([FromBody] InsertUpdateProductSubCategory request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string storedProcedure = (request.ProductSubCategoryId != null && request.ProductSubCategoryId != 0)
                ? "[dbo].[USP_UpdateProductSubCategoryDetails]"
                : "[dbo].[USP_InsertProductSubCategoryDetails]";
            string Exclude = (request.ProductSubCategoryId != null && request.ProductSubCategoryId != 0)
                ? ""
                : "ProductSubCategoryId";
            response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, Exclude);

            return Json(response);
        }

        public class DeletedForCretaria { public int LoginUserId { get; set; } public int? CriteriaId { get; set; } }
        public class DeleteProductSubCategory { public int LoginUserId { get; set; } public int? ProductSubCategoryId { get; set; } }
        [HttpGet]
        [Route("DeleteProductSubCategory")]
        public IActionResult DeleteCretaria(int ProductSubCategoryId)
        {
            DeleteProductSubCategory Delete = new DeleteProductSubCategory()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductSubCategoryId = ProductSubCategoryId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductSubCategoryDetails]", Delete);
            return Json(response);
        }
        //=============================================================================AutoGeneratePrefix============================================================================


        [HttpGet]
        [Route("GetAutoGeneratePrefix")]
        public IActionResult GetAutoGeneratePrefix(int? AutoGeneratePrefixId, int FranchiseId)
        {
            GetAutoGeneratePrefix Get = new GetAutoGeneratePrefix()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AutoGeneratePrefixId = AutoGeneratePrefixId == 0 ? null : AutoGeneratePrefixId,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAutoGeneratePrefixDetails]", Get);
            return Json(response);
        }


        [HttpPost]
        [Route("InsertUpdateAutoGeneratePrefix")]
        public IActionResult InsertUpdateAutoGeneratePrefix([FromBody] InsertUpdateAutoGeneratePrefix request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            if (request.AutoGeneratePrefixId != null)
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateAutoGeneratePrefixDetails]", request);
            else
            {
                string[] Exculuted = { "AutoGeneratePrefixId" };
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertAutoGeneratePrefixDetails]", request, Exculuted);
            }

            return Json(response);
        }


        public class AutoGeneratePrefixDelete_1 { public int LoginUserId { get; set; } public int? AutoGeneratePrefixId { get; set; } }
        [HttpGet]
        [Route("AutoGeneratePrefixDelete")]
        public IActionResult AutoGeneratePrefixDelete(int? AutoGeneratePrefixId)
        {
            AutoGeneratePrefixDelete_1 Get = new AutoGeneratePrefixDelete_1()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AutoGeneratePrefixId = AutoGeneratePrefixId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteAutoGeneratePrefixDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetAttendanceDevice")]
        public IActionResult GetAttendanceDevice(int AttendanceMachineId, int FranchiseId)
        {
            GetAttendanceDevice Get = new GetAttendanceDevice()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AttendanceMachineId = AttendanceMachineId == 0 ? null : AttendanceMachineId,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceMachineDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetEmployeeDeviceMapping")]
        public IActionResult GetEmployeeDeviceMapping()
        {
            GetEmployeeDeviceMapping Get = new GetEmployeeDeviceMapping()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value)
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEmployeeDeviceMappingDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateAttendanceMachine")]
        public IActionResult InsertAttendanceMachine([FromBody] InsertAttendanceMachine request)
        {
            DataTable dt = new DataTable();

            if (request.deviceMappingDetailsList != null && request.deviceMappingDetailsList.Count > 0)
            {
                dt = ConvertToDataTableAttandence(request.deviceMappingDetailsList);
            }
            else
            {
                dt = ConvertToDataTableAttandenceNull();
            }

            if (request.AttendanceMachineId == 0 || request.AttendanceMachineId == null)
            {
                request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                request.TVP_EmployeeDeviceMappingDetails = dt;

                string[] exclude = { "AttendanceMachineId", "deviceMappingDetailsList", "IsActives" };
                response = GenericTetroONE.ExecuteReturnDataBioMetric(_connectionString, "USP_InsertAttendanceMachineDetails", request, exclude);

                if (response.Status && response.Data != null)
                {
                    string jsonData = response.Data.ToString();
                    JArray dataArray = JArray.Parse(jsonData);

                    if (dataArray.Count > 1)
                    {
                        var credentials = dataArray[1][0];
                        string userName = credentials["ESSLUserName"].ToString();
                        string userPassword = credentials["ESSLPassword"].ToString();
                        string webAddress = credentials["WebAddress"].ToString();

                        foreach (var employee in dataArray[0])
                        {
                            string employeeName = employee["EmployeeName"].ToString();
                            string employeeId = employee["EmployeeId"].ToString();
                            string cardNumber = employee["CardNumber"].ToString();
                            string serialNo = employee["SerialNo"].ToString();

                            Biometric.AddEmployeeToBiomatric(employeeId, employeeName, cardNumber, serialNo, userName, userPassword, webAddress);

                        }
                    }
                }
                return Json(response);
            }
            else
            {
                request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                request.TVP_EmployeeDeviceMappingDetails = dt;

                string[] exclude = { "deviceMappingDetailsList" };
                response = GenericTetroONE.ExecuteReturnDataBioMetric(_connectionString, "USP_UpdateAttendanceMachineDetails", request, exclude);

                if (response.Status && response.Data != null)
                {
                    string jsonData = response.Data.ToString();
                    JArray dataArray = JArray.Parse(jsonData);

                    if (dataArray.Count > 1)
                    {
                        var credentials = dataArray[1][0];
                        string userName = credentials["ESSLUserName"].ToString();
                        string userPassword = credentials["ESSLPassword"].ToString();
                        string webAddress = credentials["WebAddress"].ToString();

                        foreach (var employee in dataArray[0])
                        {
                            var action = employee["MergeAction"].ToString();
                            string employeeId = employee["EmployeeId"].ToString();
                            string employeeName = employee["EmployeeName"].ToString();
                            string cardNumber = employee["CardNumber"].ToString();
                            string serialNo = employee["SerialNo"].ToString();

                            if (action.ToLower() == "insert")
                            {
                                Biometric.AddEmployeeToBiomatric(employeeId, employeeName, cardNumber, serialNo, userName, userPassword, webAddress);
                            }
                            else if (action.ToLower() == "delete")
                            {
                                Biometric.DeleteEmployeeToBiomatric(employeeId, serialNo, userName, userPassword, webAddress);
                            }
                        }
                    }
                }

                return Json(response);
            }
        }

        private DataTable ConvertToDataTableAttandence(List<ManageDeviceMappingDetailsSettings> list)
        {
            DataTable table = new DataTable();
            table.Columns.Add("EmployeeDeviceMappingId", typeof(int));
            table.Columns.Add("EmployeeId", typeof(int));
            table.Columns.Add("AttendanceMachineId", typeof(int));
            //table.Columns.Add("Status", typeof(bool));
            table.Columns.Add("IsBlock", typeof(bool));

            foreach (var item in list)
            {
                DataRow row = table.NewRow();
                row["EmployeeDeviceMappingId"] = item.EmployeeDeviceMappingId != null ? item.EmployeeDeviceMappingId : DBNull.Value;
                row["EmployeeId"] = item.EmployeeId;
                row["AttendanceMachineId"] = item.AttendanceMachineId != null ? item.AttendanceMachineId : DBNull.Value;
                //row["Status"] = item.Status;
                row["IsBlock"] = item.IsBlock;
                table.Rows.Add(row);
            }

            return table;
        }

        private DataTable ConvertToDataTableAttandenceNull()
        {
            DataTable table = new DataTable();
            table.Columns.Add("EmployeeDeviceMappingId", typeof(int));
            table.Columns.Add("EmployeeId", typeof(int));
            table.Columns.Add("AttendanceMachineId", typeof(int));
            //table.Columns.Add("Status", typeof(string));
            table.Columns.Add("IsBlock", typeof(string));


            DataRow row = table.NewRow();
            row["EmployeeDeviceMappingId"] = DBNull.Value;
            row["EmployeeId"] = DBNull.Value;
            row["AttendanceMachineId"] = DBNull.Value;
            //row["Status"] = "";
            row["IsBlock"] = "";
            table.Rows.Add(row);

            return table;
        }

        [HttpGet]
        [Route("DeleteDeviceMapping")]
        public IActionResult DeleteDeviceMapping(int AttendanceMachineId)
        {
            GetAttendanceDevice Get = new GetAttendanceDevice()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AttendanceMachineId = AttendanceMachineId
            };

            string[] exclude = { "FranchiseId" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteAttendanceMachineDetails]", Get, exclude);

            if (response.Status)
            {
                string jsonData = response.Data.ToString();
                JArray dataArray = JArray.Parse(jsonData);

                if (dataArray.Count > 1)
                {
                    var credentials = dataArray[1][0];
                    string userName = credentials["ESSLUserName"].ToString();
                    string userPassword = credentials["ESSLPassword"].ToString();
                    string webAddress = credentials["WebAddress"].ToString();

                    foreach (var employee in dataArray[0])
                    {
                        string employeeId = employee["EmployeeId"].ToString();
                        string serialNo = employee["SerialNo"].ToString();

                        Biometric.DeleteEmployeeToBiomatric(employeeId, serialNo, userName, userPassword, webAddress);
                    }
                }
            }

            return Json(response);
        }

        [HttpGet]
        [Route("GetOtherCharges")]
        public IActionResult GetOtherCharges(int OtherChargesId, int FranchiseId)
        {
            GetOtherCharges Get = new GetOtherCharges()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                OtherChargesId = OtherChargesId == 0 ? null : OtherChargesId,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetOtherChargesDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateOtherCharges")]
        public IActionResult InsertUpdateOtherCharges([FromBody] InsertUpdateOtherCharges request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataTable masterInfoMappingDetails = new DataTable();
            masterInfoMappingDetails = GenericTetroONE.ToDataTable(request.masterInfoMappingDetails);

            request.TVP_MasterInfoMappingDetails = masterInfoMappingDetails;

            string[] Exculuted = (request.OtherChargesId != null && request.OtherChargesId != 0)
                ? new string[] { "masterInfoMappingDetails" }
                : new string[] { "masterInfoMappingDetails", "OtherChargesId" };

            string storedProcedure = (request.OtherChargesId != null && request.OtherChargesId != 0)
                ? "[dbo].[USP_UpdateOtherChargesDetails]"
                : "[dbo].[USP_InsertOtherChargesDetails]";

            response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, Exculuted);

            return Json(response);
        }

        [HttpGet]
        [Route("DeleteOtherCharges")]
        public IActionResult DeleteOtherCharges(int OtherChargesId)
        {
            GetOtherCharges Get = new GetOtherCharges()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                OtherChargesId = OtherChargesId
            };

            string[] exclude = { "FranchiseId" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteOtherChargesDetails]", Get, exclude);

            return Json(response);
        }


        [HttpGet]
        [Route("GetEmployeeDetails_Franchise")]
        public IActionResult GetEmployeeDetails_Franchise(int FranchiseId)
        {
            GetEmployeeDetails_Franchise Get = new GetEmployeeDetails_Franchise()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEmployeeDetails_Franchise]", Get);

            return Json(response);
        }


    }
}
