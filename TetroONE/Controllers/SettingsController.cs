using DocumentFormat.OpenXml.Presentation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Crypto.Operators;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Reflection.PortableExecutable;
using System.Security.Claims;
using TetroONE.Models;

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

        //=============================================================================BankSettings============================================================================

        [HttpGet]
        [Route("GetPlantDetails")]
        public IActionResult GetPlantDetails(int? PlantId)
        {
            GetPlantDetails Get = new GetPlantDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                PlantId = PlantId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPlantDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertPlantDetails")]
        public IActionResult InsertPlantDetails([FromBody] InsertPlantDetails request)
        {
            DataTable ContactPersonDetails = new DataTable();
            ContactPersonDetails = GenericTetroONE.ToDataTable(request.ContactPersonDetailsPlant);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            request.TVP_ContactPersonDetails = ContactPersonDetails;

            string storedProcedure = (request.PlantId != null)
                 ? "[dbo].[USP_UpdatePlantDetails]"
                 : "[dbo].[USP_InsertPlantDetails]";

            string[] ExculutedForInsert = { "PlantId", "IsActive", "ContactPersonDetailsPlant" };
            string[] ExculutedForUpdate = { "ContactPersonDetailsPlant" };
            if (storedProcedure == "[dbo].[USP_InsertPlantDetails]")
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, ExculutedForInsert);
            else
                response = GenericTetroONE.Execute(_connectionString, storedProcedure, request, ExculutedForUpdate);

            return Json(response);
        }

        [HttpGet]
        [Route("DeletePlantDetails")]
        public IActionResult DeletePlantDetails(int? PlantId)
        {
            GetPlantDetails Get = new GetPlantDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                PlantId = PlantId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePlantDetails]", Get);
            return Json(response);
        }

        //=============================================================================BankSettings============================================================================

        [HttpGet]
        [Route("GetMasterInfo")]
        public IActionResult GetMasterInfo(int MasterInfoId, string ModuleName)
        {
            GetMasterInfo Get = new GetMasterInfo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = MasterInfoId == 0 ? null : MasterInfoId,
                ModuleName = ModuleName
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetMasterInfoDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateMasterInfo")]
        public IActionResult InsertUpdateMasterInfo([FromBody] InsertUpdateMasterInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.MasterInfoId != null)
                ? new string[] { "" }
                : new string[] { "MasterInfoId" };

            string storedProcedure = (request.MasterInfoId != null)
                ? "[dbo].[USP_UpdateMasterInfoDetails]"
                : "[dbo].[USP_InsertMasterInfoDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request, Exculuted);
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

        /*=================================================================Color=====================================================================*/

        [HttpGet]
        [Route("GetColor")]
        public IActionResult GetColor(int ColorId)
        {
            GetColor Get = new GetColor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ColorId = ColorId == 0 ? null : ColorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetColorDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateColorInfo")]
        public IActionResult InsertUpdateColorInfo([FromBody] InsertUpdateColorInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.ColorId != null)
                ? new string[] { "" }
                : new string[] { "ColorId" };

            string storedProcedure = (request.ColorId != null)
                ? "[dbo].[USP_UpdateColorDetails]"
                : "[dbo].[USP_InsertColorDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request, Exculuted);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteColorDetails")]
        public IActionResult DeleteColorDetails(int ColorId)
        {
            GetColor Get = new GetColor()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ColorId = ColorId == 0 ? null : ColorId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteColorDetails]", Get);
            return Json(response);
        }

        /*=================================================================Machine=====================================================================*/

        [HttpGet]
        [Route("GetMachine")]
        public IActionResult GetMachine(int MachineId)
        {
            GetMachine Get = new GetMachine()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MachineId = MachineId == 0 ? null : MachineId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetMachineDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateMachineInfo")]
        public IActionResult InsertUpdateMachineInfo([FromBody] InsertUpdateMachineInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.MachineId != null)
                ? new string[] { "" }
                : new string[] { "MachineId" };

            string storedProcedure = (request.MachineId != null)
                ? "[dbo].[USP_UpdateMachineDetails]"
                : "[dbo].[USP_InsertMachineDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request, Exculuted);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteMachineDetails")]
        public IActionResult DeleteMachineDetails(int MachineId)
        {
            GetMachine Get = new GetMachine()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MachineId = MachineId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteMachineDetails]", Get);
            return Json(response);
        }

        /*=================================================================ProductCategory=====================================================================*/

        [HttpGet]
        [Route("GetProductCategory")]
        public IActionResult GetProductCategory(int ProductCategoryId)
        {
            GetProductCategory Get = new GetProductCategory()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductCategoryId = ProductCategoryId == 0 ? null : ProductCategoryId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductCategoryDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateProductCategoryInfo")]
        public IActionResult InsertUpdateProductCategoryInfo([FromBody] InsertUpdateProductCategoryInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.ProductCategoryId != null)
                ? new string[] { "" }
                : new string[] { "ProductCategoryId" };

            string storedProcedure = (request.ProductCategoryId != null)
                ? "[dbo].[USP_UpdateProductCategoryDetails]"
                : "[dbo].[USP_InsertProductCategoryDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request, Exculuted);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteProductCategoryDetails")]
        public IActionResult DeleteProductCategoryDetails(int ProductCategoryId)
        {
            GetProductCategory Get = new GetProductCategory()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductCategoryId = ProductCategoryId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductCategoryDetails]", Get);
            return Json(response);
        }

        /*=================================================================ProductSubCategory=====================================================================*/

        [HttpGet]
        [Route("GetProductSubCategory")]
        public IActionResult GetProductSubCategory(int ProductSubCategoryId)
        {
            GetProductSubCategory Get = new GetProductSubCategory()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductSubCategoryId = ProductSubCategoryId == 0 ? null : ProductSubCategoryId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetProductSubCategoryDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateProductSubCategoryInfo")]
        public IActionResult InsertUpdateProductSubCategoryInfo([FromBody] InsertUpdateProductSubCategoryInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.ProductSubCategoryId != null)
                ? new string[] { "" }
                : new string[] { "ProductSubCategoryId" };

            string storedProcedure = (request.ProductSubCategoryId != null)
                ? "[dbo].[USP_UpdateProductSubCategoryDetails]"
                : "[dbo].[USP_InsertProductSubCategoryDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request, Exculuted);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteProductSubCategoryDetails")]
        public IActionResult DeleteProductSubCategoryDetails(int ProductSubCategoryId)
        {
            GetProductSubCategory Get = new GetProductSubCategory()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ProductSubCategoryId = ProductSubCategoryId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteProductSubCategoryDetails]", Get);
            return Json(response);
        }

        /*=================================================================AutoGeneratePrefix=====================================================================*/

        [HttpGet]
        [Route("GetAutoGeneratePrefixDetails")]
        public IActionResult GetAutoGeneratePrefixDetails(int PlantId, int AutoGeneratePrefixId)
        {
            GetAutoGeneratePrefix Get = new GetAutoGeneratePrefix()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AutoGeneratePrefixId = AutoGeneratePrefixId == 0 ? null : AutoGeneratePrefixId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAutoGeneratePrefixDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateAutoGeneratePrefixInfo")]
        public IActionResult InsertUpdateAutoGeneratePrefixInfo([FromBody] InsertUpdateAutoGeneratePrefixInfo request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.AutoGeneratePrefixId != null)
                ? new string[] { "" }
                : new string[] { "AutoGeneratePrefixId" };

            string storedProcedure = (request.AutoGeneratePrefixId != null)
                ? "[dbo].[USP_UpdateAutoGeneratePrefixDetails]"
                : "[dbo].[USP_InsertAutoGeneratePrefixDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request, Exculuted);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteAutoGeneratePrefixDetails")]
        public IActionResult DeleteAutoGeneratePrefixDetails(int AutoGeneratePrefixId)
        {
            DeleteAutoGeneratePrefixDetails Get = new DeleteAutoGeneratePrefixDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AutoGeneratePrefixId = AutoGeneratePrefixId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteAutoGeneratePrefixDetails]", Get);
            return Json(response);
        }


        /*=================================================================DefaultProduct=====================================================================*/

        [HttpGet]
        [Route("GetDefaultProduct")]
        public IActionResult GetDefaultProduct(int DefaultProductId)
        {
            GetDefaultProduct Get = new GetDefaultProduct()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                DefaultProductId = DefaultProductId == 0 ? null : DefaultProductId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetDefaultProductDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertDefaultProductDetails")]
        public IActionResult InsertDefaultProductDetails([FromBody] InsertDefaultProductDetails request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.DefaultProductId != null)
                ? new string[] { "" }
                : new string[] { "DefaultProductId" };

            string storedProcedure = (request.DefaultProductId != null)
                ? "[dbo].[USP_UpdateDefaultProductDetails]"
                : "[dbo].[USP_InsertDefaultProductDetails]";

            response = GenericTetroONE.ExecuteReturnDataArray(_connectionString, storedProcedure, request, Exculuted);
            return Json(response);
        }

        [HttpGet]
        [Route("DeleteDefaultProduct")]
        public IActionResult DeleteDefaultProduct(int DefaultProductId)
        {
            DeleteDefaultProduct Get = new DeleteDefaultProduct()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                DefaultProductId = DefaultProductId == 0 ? null : DefaultProductId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteDefaultProductDetails]", Get);
            return Json(response);
        }

        /*=================================================================End DefaultProduct=====================================================================*/

        /*=================================================================DefaultProduct=====================================================================*/

        [HttpGet]
        [Route("GetOtherCharges")]
        public IActionResult GetOtherCharges(int OtherChargesId)
        {
            GetOtherCharges Get = new GetOtherCharges()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                OtherChargesId = OtherChargesId == 0 ? null : OtherChargesId,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetOtherChargesDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateOtherCharges")]
        public IActionResult InsertUpdateOtherCharges([FromBody] InsertUpdateOtherCharges request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            string[] Exculuted = (request.OtherChargesId != null && request.OtherChargesId != 0)
                ? new string[] { "" }
                : new string[] { "OtherChargesId" };

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

            string[] exclude = { "" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteOtherChargesDetails]", Get, exclude);

            return Json(response);
        }
        /*=================================================================End DefaultProduct=====================================================================*/

    }
}
