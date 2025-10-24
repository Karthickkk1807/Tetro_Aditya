using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using TetroONE.Models;

namespace TetroONE.Controllers
{
    public class AssetController : BaseController
    {
        public AssetController(IConfiguration configuration) : base(configuration)
        {

        }
        public IActionResult QRGeneration()
        {
            return View();
        }
        public IActionResult AssetMapRet()
        {
            return View();
        }
        public IActionResult AssetTransfer()
        {
            return View();
        }
        public IActionResult AssetService()
        {
            return View();
        }
        public IActionResult Auditing()
        {
            return View();
        }
        public IActionResult Scrap()
        {
            return View();
        }

        [Route("AssetManagement")]
        public IActionResult AssetManagement()
        {
            return View();
        }




        [HttpGet]
        [Route("GetAsset")]
        public IActionResult GetAsset(int BranchId, int AssetTypeId, int AssetId)
        {
            GetAsset GetProduct = new GetAsset()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                BranchId = BranchId,
                AssetTypeId = AssetTypeId,
                AssetId = AssetId != 0 ? AssetId : null,
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAssetDetails]", GetProduct);
            return Json(response);
        }

        //[HttpGet]
        //[Route("GetAutoGenerateNo")]
        //public IActionResult GetAutoGenerateNo(string ModuleName, int? BranchId)
        //{
        //    GetAutoGenerateNoAsset GetProduct = new GetAutoGenerateNoAsset()
        //    {
        //        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
        //        ModuleName = ModuleName,
        //        BranchId = BranchId
        //    };
        //    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAutoGenerateNoDetails]", GetProduct);
        //    return Json(response);
        //}

        [HttpGet]
        [Route("GetAssetAutoGenerateNo")]
        public IActionResult GetAssetAutoGenerateNo(int AssetSubcategoryId, int ManufacturerId)
        {
            GetAssetAutoGenerateNoAsset GetProduct = new GetAssetAutoGenerateNoAsset()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AssetSubcategoryId = AssetSubcategoryId,
                ManufacturerId = ManufacturerId
            };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAssetGenerateNoDetails]", GetProduct);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertUpdateAsset")]
        public IActionResult InsertUpdateAsset([FromBody] InsertUpdateAsset request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            if (request.AssetId != null && request.AssetId != 0)
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateAssetDetails]", request);
            else
            {
                string[] Exclude = { "AssetId" };
                response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertAssetDetails]", request, Exclude);
            }

            return Json(response);
        }

        public class DeleteAssetClass { public int LoginUserId { get; set; } public int? AssetId { get; set; } }
        [HttpGet]
        [Route("DeleteAsset")]
        public IActionResult DeleteAsset(int AssetId)
        {
            DeleteAssetClass getDelete = new DeleteAssetClass()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AssetId = AssetId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteAssetDetails]", getDelete);
            return Json(response);
        }




        [HttpGet("DownloadExcel")]
        public IActionResult DownloadExcel()
        {
            // Fetch Asset Type Data
            var GetAssetType = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetType",
            };

            var responseAssetType = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetType);

            var responseDataJsonAssetType = responseAssetType.Data as string;
            var dataListsAssetType = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssetType);
            var AssetTypeNameList = dataListsAssetType?.ElementAtOrDefault(0)?.Select(b => b["AssetTypeName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssetSubCategory Data
            var GetAssetSubCategory = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetSubCategory",
            };

            var responseAssetSubCategory = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetSubCategory);

            var responseDataJsonAssetSubCategory = responseAssetSubCategory.Data as string;
            var dataListsAssetSubCategory = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssetSubCategory);
            var AssetSubCategoryList = dataListsAssetSubCategory?.ElementAtOrDefault(0)?.Select(b => b["AssetSubCategoryName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssetCategory Data
            var GetAssetCategory = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetCategory",
            };

            var responseAssetCategory = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetCategory);

            var responseDataJsonAssetCategory = responseAssetCategory.Data as string;
            var dataListsAssetCategory = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssetCategory);
            var AssetCategoryList = dataListsAssetCategory?.ElementAtOrDefault(0)?.Select(b => b["AssetCategoryName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch Manufacture Data
            var GetManufacture = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "Manufacturer",
            };

            var responseManufacture = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetManufacture);

            var responseDataJsonManufacture = responseManufacture.Data as string;
            var dataListsManufacture = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonManufacture);
            var ManufactureList = dataListsManufacture?.ElementAtOrDefault(0)?.Select(b => b["ManufacturerName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssetMaintainanceFrequerncy Data
            var GetAssetMaintainanceFrequerncy = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetMaintenanceFrequency",
            };

            var responseAssetMaintainanceFrequerncy = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetMaintainanceFrequerncy);

            var responseDataJsonAssetMaintainanceFrequerncy = responseAssetMaintainanceFrequerncy.Data as string;
            var dataListsAssetMaintainanceFrequerncy = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssetMaintainanceFrequerncy);
            var AssetMaintainanceFrequerncyList = dataListsAssetMaintainanceFrequerncy?.ElementAtOrDefault(0)?.Select(b => b["AssetMaintenanceFrequencyName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssetStatus Data
            var GetAssetStatus = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetStatus",
            };

            var responseAssetStatus = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetStatus);

            var responseDataJsonAssetStatus = responseAssetStatus.Data as string;
            var dataListsAssetStatus = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssetStatus);
            var AssetStatusList = dataListsAssetStatus?.ElementAtOrDefault(0)?.Select(b => b["AssetStatusName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch Vendor Data
            var GetVendor = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "Vendor",
            };

            var responseVendor = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetVendor);

            var responseDataJsonVendor = responseVendor.Data as string;
            var dataListsVendor = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonVendor);
            var VendorList = dataListsVendor?.ElementAtOrDefault(0)?.Select(b => b["VendorName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssetInsurance Data
            var GetAssetInsurance = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetInsuranceCoverage",
            };

            var responseAssetInsurance = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetInsurance);

            var responseDataJsonAssetInsurance = responseAssetInsurance.Data as string;
            var dataListsAssetInsurance = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssetInsurance);
            var AssetInsuranceList = dataListsAssetInsurance?.ElementAtOrDefault(0)?.Select(b => b["AssetInsuranceCoverageName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssetTagType Data
            var GetAssetTagType = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetTagType",
            };

            var responseAssetTagType = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetTagType);

            var responseDataJsonAssetTagType = responseAssetTagType.Data as string;
            var dataListsAssetTagType = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssetTagType);
            var AssetTagTypeList = dataListsAssetTagType?.ElementAtOrDefault(0)?.Select(b => b["AssetTagTypeName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch Branch Data
            var GetBranch = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "Branch",
            };

            var responseBranch = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetBranch);

            var responseDataJsonBranch = responseBranch.Data as string;
            var dataListsBranch = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonBranch);
            var BranchList = dataListsBranch?.ElementAtOrDefault(0)?.Select(b => b["BranchName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch Hall Data
            var GetHall = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "Hall",
            };



            var responseHall = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetType);

            var responseDataJsonHall = responseHall.Data as string;
            var dataListsHall = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonHall);
            var HallList = dataListsHall?.ElementAtOrDefault(0)?.Select(b => b["HallName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch Department Data
            var GetDepartment = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "Department",
            };

            var responseDepartment = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetDepartment);

            var responseDataJsonDepartment = responseDepartment.Data as string;
            var dataListsDepartment = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonDepartment);
            var DepartmentList = dataListsDepartment?.ElementAtOrDefault(0)?.Select(b => b["DepartmentName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssignedTo Data
            var GetAssignedTo = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssignedTo",
            };

            var responseAssignedTo = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssignedTo);

            var responseDataJsonAssignedTo = responseAssignedTo.Data as string;
            var dataListsAssignedTo = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataJsonAssignedTo);
            var AssignedToList = dataListsAssignedTo?.ElementAtOrDefault(0)?.Select(b => b["WorkDeskName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch BillingType Data
            var GetBillingType = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "BillingType",
            };

            var responseBillingType = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetBillingType);

            var responseDataBillingType = responseBillingType.Data as string;
            var dataListsBillingType = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataBillingType);
            var BillingTypeList = dataListsBillingType?.ElementAtOrDefault(0)?.Select(b => b["BillingTypeName"]?.ToString()).ToList() ?? new List<string>();




            // Fetch TaxInfo Data
            var GetPaymentTypeInfo = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "PaymentTypeAsset",
            };

            var responsePayTypeInfo = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetPaymentTypeInfo);

            var responseDataPaytype = responsePayTypeInfo.Data as string;
            var dataListsPayType = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataPaytype);
            var PayTypeList = dataListsPayType?.ElementAtOrDefault(0)?.Select(b => b["PaymentTypeName"]?.ToString()).ToList() ?? new List<string>();


            // Fetch TaxInfo Data
            var GetNoOfEMIInfo = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "NoOfEMI",
            };

            var responseNoOfEMI = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetNoOfEMIInfo);

            var responseDataNoOfEMI = responseNoOfEMI.Data as string;
            var dataListsNoOfEMI = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataNoOfEMI);
            var NoOfEMIList = dataListsNoOfEMI?.ElementAtOrDefault(0)?.Select(b => b["NoOfEMIName"]?.ToString()).ToList() ?? new List<string>();

            using (var workbook = new XLWorkbook())
            {
                // Sheet 1: Client Data
                var AssetWorksheet = workbook.Worksheets.Add("AssetDetails");

                var clientColumns = new[]
                {
                    "Asset Type"
                    ,"Asset Category"
                    ,"Asset SubCategory"
                    ,"Manufacturer"
                    ,"Model Number"
                    ,"Tag/Serial Number"
                    ,"Asset Name"
                    ,"License Key"
                    ,"Maintenance Frequency"
                    ,"Last Maintenance Date"
                    ,"Next Maintenance Date"
                    ,"Billing Type"
                    ,"Last Billed Date"
                    ,"Next Billing Date"
                    ,"Payment Type"
                    ,"NoofEMI"
                    ,"Status"
                    ,"Description"
                    ,"Vendor"
                    ,"PO Number"
                    ,"PO Date"
                    ,"Invoice Number"
                    ,"Invoice Date"
                    ,"Purchase Value"
                    ,"LifeSpan"
                    ,"Insurance PolicyNo"
                    ,"Ins Coverage From Date"
                    ,"Insurance Expiry Date"
                    ,"Warranty Start Date"
                    ,"Warranty Expiry Date"
                };

                bool afterDescription = false;

                for (int i = 0; i < clientColumns.Length; i++)
                {
                    var cell = AssetWorksheet.Cell(1, i + 1);
                    cell.Value = clientColumns[i];
                    cell.Style.Font.Bold = true;

                    if (clientColumns[i] == "Vendor")
                    {
                        cell.Style.Fill.SetBackgroundColor(XLColor.FromArgb(225, 215, 209));
                        afterDescription = true; // Start marking all columns after this
                    }
                    else if (afterDescription)
                    {
                        cell.Style.Fill.SetBackgroundColor(XLColor.FromArgb(225, 215, 209));
                    }
                    else
                    {
                        cell.Style.Fill.SetBackgroundColor(XLColor.FromArgb(211, 211, 211)); // Default gray
                    }

                    AssetWorksheet.Column(i + 1).Width = Math.Max(clientColumns[i].Length + 2, 0);
                }

                for (int row = 2; row <= 1000; row++)
                {
                    // Column G = 7
                    AssetWorksheet.Cell(row, 7).FormulaA1 =
                        $"=IF(COUNTA(D{row},F{row},C{row},E{row})=0, \"\", D{row} & \"_\" & C{row} & \"_\" & E{row} & \"_\" & F{row})";
                }

                ApplyDropdownList(AssetWorksheet, AssetTypeNameList, "AssetTypeName", "A", 2, 2000);
                ApplyDropdownList(AssetWorksheet, AssetCategoryList, "AssetCategoryName", "B", 2, 2000);
                ApplyDropdownList(AssetWorksheet, AssetSubCategoryList, "AssetSubCategoryName", "C", 2, 2000);
                ApplyDropdownList(AssetWorksheet, ManufactureList, "ManufacturerName", "D", 2, 2000);
                ApplyDropdownList(AssetWorksheet, AssetStatusList, "AssetStatusName", "Q", 2, 2000);
                ApplyDropdownList(AssetWorksheet, NoOfEMIList, "List", "p", 2, 2000);
                ApplyDropdownList(AssetWorksheet, AssetMaintainanceFrequerncyList, "AssetMaintenanceFrequencyName", "I", 2, 2000);
                ApplyDropdownList(AssetWorksheet, BillingTypeList, "BillingTypeName", "L", 2, 2000);
                ApplyDropdownList(AssetWorksheet, PayTypeList, "PaymentType", "O", 2, 2000);
                ApplyDropdownList(AssetWorksheet, VendorList, "VendorName", "S", 2, 2000);


                ApplyDateOnlyValidation(AssetWorksheet, "J", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "K", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "M", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "N", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "U", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "W", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "AA", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "AB", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "AC", 2, 2000);
                ApplyDateOnlyValidation(AssetWorksheet, "AD", 2, 2000);

                ApplyNumberOnlyValidation(AssetWorksheet, "Y", 2, 2000);

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    var fileName = "AssetInfoDetails.xlsx";

                    var contentDisposition = new System.Net.Mime.ContentDisposition
                    {
                        FileName = fileName,
                        Inline = false // Force download
                    };

                    Response.Headers.Add("Content-Disposition", contentDisposition.ToString());

                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        private void ApplyDropdownList(IXLWorksheet worksheet, List<string> data, string namedRangeName, string targetColumn, int startRow, int endRow)
        {
            var hiddenColumnIndex = worksheet.ColumnsUsed().Count() + 1;
            var hiddenColumnLetter = XLHelper.GetColumnLetter(hiddenColumnIndex);
            var hiddenColumnRange = worksheet.Range($"{hiddenColumnLetter}1:{hiddenColumnLetter}{data.Count}");

            for (int i = 0; i < data.Count; i++)
            {
                worksheet.Cell(i + 1, hiddenColumnIndex).Value = data[i];
            }

            worksheet.NamedRanges.Add(namedRangeName, hiddenColumnRange);

            worksheet.Column(hiddenColumnIndex).Hide();

            for (int row = startRow; row <= endRow; row++)
            {
                var cell = worksheet.Cell($"{targetColumn}{row}");
                cell.DataValidation.List(namedRangeName, true);
            }
        }
        private void ApplyDateOnlyValidation(IXLWorksheet worksheet, string targetColumn, int startRow, int endRow)
        {
            for (int row = startRow; row <= endRow; row++)
            {
                var cell = worksheet.Cell($"{targetColumn}{row}");
                var validation = cell.DataValidation;
                validation.Clear();
                validation.Date.Between(new DateTime(1900, 1, 1), new DateTime(2100, 12, 31));
                validation.IgnoreBlanks = false;
                validation.ErrorMessage = "Please enter a valid date Like 01-01-2025.";
            }
        }


        private void ApplyNumberOnlyValidation(IXLWorksheet worksheet, string targetColumn, int startRow, int endRow)
        {
            for (int row = startRow; row <= endRow; row++)
            {
                var cell = worksheet.Cell($"{targetColumn}{row}");


                cell.Style.NumberFormat.SetFormat("0");

                var validation = cell.DataValidation;
                validation.Clear();
                validation.Custom("ISNUMBER(" + cell.Address.ToStringRelative() + ")");
                validation.IgnoreBlanks = false;
                validation.ErrorMessage = "Only numbers are allowed in this column.";
            }
        }


        private void ApplyTextAndSpecialOnlyValidation(IXLWorksheet worksheet, string targetColumn, int startRow, int endRow)
        {
            for (int row = startRow; row <= endRow; row++)
            {
                var cell = worksheet.Cell($"{targetColumn}{row}");
                var validation = cell.DataValidation;
                validation.Clear();
                // Custom validation formula to ensure only text (alphabetic and special characters)
                validation.Custom("ISTEXT(" + cell.Address.ToStringRelative() + ")");
                validation.IgnoreBlanks = false;
                validation.ErrorMessage = "This column will allow only text and special symbols.";
            }
        }

        public static class XLHelper
        {
            public static string GetColumnLetter(int columnIndex)
            {
                var dividend = columnIndex;
                var columnLetter = string.Empty;
                var modulo = 0;

                while (dividend > 0)
                {
                    modulo = (dividend - 1) % 26;
                    columnLetter = (char)(65 + modulo) + columnLetter;
                    dividend = (dividend - modulo) / 26;
                }

                return columnLetter;
            }
        }


        [HttpPost("InsertBulkAsset")]
        public async Task<IActionResult> InsertBulkClient([FromBody] InsertBulkAsset request)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                DataTable BulkAsset = new DataTable();

                if (request.TVP_AssetDetails != null && request.TVP_AssetDetails.Count > 0)
                {
                    BulkAsset = GenericTetroONE.ToDataTable(request.TVP_AssetDetails);
                }

                using (SqlCommand command = new SqlCommand("[dbo].[USP_InsertAssetDetails_BulkInsert]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@BranchId", request.BranchId);
                    command.Parameters.AddWithValue("@Clear", request.Clear ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@IsInsert", request.IsInsert);
                    if (BulkAsset != null && BulkAsset.Rows.Count > 0)
                    {
                        command.Parameters.AddWithValue("@TVP_AssetDetails", BulkAsset);
                    }
                    else
                    {
                        // Create empty DataTable with schema of AssetDetails
                        BulkAsset = GenericTetroONE.ToDataTable(new List<AssetDetails>());

                        // Create a row with all columns set to null (DBNull.Value)
                        DataRow row = BulkAsset.NewRow();
                        foreach (DataColumn column in BulkAsset.Columns)
                        {
                            row[column.ColumnName] = DBNull.Value;
                        }
                        BulkAsset.Rows.Add(row);
                    }

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    DataSet ds = new DataSet();
                    try
                    {
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        adapter.Fill(ds);
                    }
                    catch (Exception ex)
                    {
                        // Log the SQL exception details if you have a logging mechanism
                        response.Status = false;
                        response.Message = "A database error occurred while filling the dataset: " + ex.Message;
                        return Json(response);
                    }

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
                connection.Close();
            }
            return Json(response);
        }

        //========================================================End BulkInset Asset=====================================================

        //========================================================BulkInset Asset Mapping=====================================================

        [HttpGet("DownloadExcelAssetMapping")]
        public IActionResult DownloadExcelAssetMapping()
        {

            // Fetch BranchName Data
            var GetBranchName = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "BranchName_BulkInsert",
            };

            var responseBranchName = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetBranchName);

            var responseDataBranchName = responseBranchName.Data as string;
            var dataListsBranchName = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataBranchName);
            var BranchNameList = dataListsBranchName?.ElementAtOrDefault(0)?.Select(b => b["BranchName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch HallName Data
            var GetHallName = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "HallName_BulkInsert",
            };

            var responseHallName = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetHallName);

            var responseDataHallName = responseHallName.Data as string;
            var dataListsHallName = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataHallName);
            var HallNameList = dataListsHallName?.ElementAtOrDefault(0)?.Select(b => b["HallName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch DepartmentName Data
            var GetDepartmentName = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "DepartmentName_BulkInsert",
            };

            var responseDepartmentName = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetDepartmentName);

            var responseDataDepartmentName = responseDepartmentName.Data as string;
            var dataListsDepartmentName = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataDepartmentName);
            var DepartmentNameList = dataListsDepartmentName?.ElementAtOrDefault(0)?.Select(b => b["DepartmentName"]?.ToString()).ToList() ?? new List<string>();

            // Fetch WorkDeskNo Data
            var GetWorkDeskNo = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "WorkDeskNo_BulkInsert",
            };

            var responseWorkDeskNo = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetWorkDeskNo);

            var responseDataWorkDeskNo = responseWorkDeskNo.Data as string;
            var dataListsWorkDeskNo = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataWorkDeskNo);
            var WorkDeskNoList = dataListsWorkDeskNo?.ElementAtOrDefault(0)?.Select(b => b["DeskNo"]?.ToString()).ToList() ?? new List<string>();

            // Fetch AssetName Data
            var GetAssetName = new GetDDFroBulkInserttype()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = null,
                ModuleName = "AssetName_BulkInsert",
            };

            var responseAssetName = GenericTetroONE.GetData(_connectionString, "[DBO].[USP_DD_GetMasterInfoDetails]", GetAssetName);

            var responseDataAssetName = responseAssetName.Data as string;
            var dataListsAssetName = JsonConvert.DeserializeObject<List<List<JObject>>>(responseDataAssetName);
            var AssetNameList = dataListsAssetName?.ElementAtOrDefault(0)?.Select(b => b["AssetName"]?.ToString()).ToList() ?? new List<string>();

            using (var workbook = new XLWorkbook())
            {
                // Sheet 1: Client Data
                var AssetMappingsheet = workbook.Worksheets.Add("AssetMappingDetails");

                var AssetMappingColumns = new[]
                {
                    "Branch Name"
                    ,"Hall Name"
                    ,"Department Name"
                    ,"WorkDesk No"
                    ,"Asset Name"
                };

                for (int i = 0; i < AssetMappingColumns.Length; i++)
                {
                    var cell = AssetMappingsheet.Cell(1, i + 1);
                    cell.Value = AssetMappingColumns[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.SetBackgroundColor(XLColor.FromArgb(211, 211, 211));
                    AssetMappingsheet.Column(i + 1).Width = Math.Max(AssetMappingColumns[i].Length + 2, 0);
                }

                ApplyDropdownList(AssetMappingsheet, BranchNameList, "BranchName", "A", 2, 1000);
                ApplyDropdownList(AssetMappingsheet, HallNameList, "HallName", "B", 2, 1000);
                ApplyDropdownList(AssetMappingsheet, DepartmentNameList, "DepartmentName", "C", 2, 1000);
                ApplyDropdownList(AssetMappingsheet, WorkDeskNoList, "WorkDeskNo", "D", 2, 1000);
                ApplyDropdownList(AssetMappingsheet, AssetNameList, "AssetName", "E", 2, 1000);

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    var fileName = "AssetMappingDetails.xlsx";

                    var contentDisposition = new System.Net.Mime.ContentDisposition
                    {
                        FileName = fileName,
                        Inline = false // Force download
                    };

                    Response.Headers.Add("Content-Disposition", contentDisposition.ToString());

                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        [HttpPost("InsertBulkAssetMapping")]
        public async Task<IActionResult> InsertBulkAssetMapping([FromBody] InsertBulkAssetMapping request)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                DataTable BulkAssetMapping = new DataTable();

                if (request.TVP_AssetMappingDetails != null && request.TVP_AssetMappingDetails.Count > 0)
                {
                    BulkAssetMapping = GenericTetroONE.ToDataTable(request.TVP_AssetMappingDetails);
                }

                using (SqlCommand command = new SqlCommand("[dbo].[USP_InsertAssetMappingDetails_BulkInsert]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@IsInsert", request.IsInsert);
                    command.Parameters.AddWithValue("@TVP_AssetMappingDetails", BulkAssetMapping);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    DataSet ds = new DataSet();
                    try
                    {
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        adapter.Fill(ds);
                    }
                    catch (Exception ex)
                    {
                        // Log the SQL exception details if you have a logging mechanism
                        response.Status = false;
                        response.Message = "A database error occurred while filling the dataset: " + ex.Message;
                        return Json(response);
                    }

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    response.Data = GenericTetroONE.dataSetToJSON(ds);
                }
                connection.Close();
            }
            return Json(response);
        }

        //========================================================End BulkInset=====================================================


        //=======================================================Sending SMS=====================================================

        //[HttpPost("SendingSMS")]
        //public async Task<IActionResult> SendingSMS([FromBody] SendingSMS request)
        //{
        //    if (string.IsNullOrEmpty(request.ContactNumber) || string.IsNullOrEmpty(request.MessageText))
        //    {
        //        return BadRequest(new SmsResponse
        //        {
        //            IsSuccess = false,
        //            Message = "ContactNumber and MessageText are required."
        //        });
        //    }

        //    try
        //    {
        //        using (HttpClient client = new HttpClient())
        //        {
        //            client.DefaultRequestHeaders.Add("authorization", "daSLDe724fwpYvQ1mMRthr3xIyoBKHVgZsc9bjnJXU0OTqC8WuZClgDSb4tXunaVv9AxhEMd1Q3rFfLG");

        //            var content = new FormUrlEncodedContent(new[]
        //            {
        //                new KeyValuePair<string, string>("sender_id", "FSTSMS"),
        //                new KeyValuePair<string, string>("message", request.MessageText),
        //                new KeyValuePair<string, string>("language", "english"),
        //                new KeyValuePair<string, string>("route", "p"),
        //                new KeyValuePair<string, string>("numbers", request.ContactNumber)
        //            });

        //            var response = await client.PostAsync("https://www.fast2sms.com/dev/bulkV2", content);
        //            string result = await response.Content.ReadAsStringAsync();

        //            if (response.IsSuccessStatusCode)
        //            {
        //                return Ok(new SmsResponse
        //                {
        //                    IsSuccess = true,
        //                    Message = "SMS Sent Successfully."
        //                });
        //            }
        //            else
        //            {
        //                // Return the actual Fast2SMS error message here
        //                return Ok(new SmsResponse
        //                {
        //                    IsSuccess = false,
        //                    Message = $"Failed to Send SMS. Fast2SMS Response: {result}"
        //                });
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new SmsResponse
        //        {
        //            IsSuccess = false,
        //            Message = $"Exception occurred: {ex.Message}"
        //        });
        //    }
        //}

        //========================================================End Sending SMS=====================================================

        //========================================================Sending WhatsApp=====================================================
        //[HttpPost("SendWhatsAppMessage")]
        //public async Task<IActionResult> SendWhatsAppMessage([FromBody] SendingWhatsApp request)
        //{
        //    if (string.IsNullOrWhiteSpace(request.ContactNumber) || string.IsNullOrWhiteSpace(request.MessageText))
        //    {
        //        return BadRequest(new SmsResponse
        //        {
        //            IsSuccess = false,
        //            Message = "Contact number and message text are required."
        //        });
        //    }

        //    try
        //    {
        //        using HttpClient client = new HttpClient();

        //        // Replace with your actual CallMeBot API key
        //        string apiKey = "YOUR_CALLMEBOT_API_KEY";

        //        string encodedMessage = Uri.EscapeDataString(request.MessageText);
        //        string endpoint = $"https://api.callmebot.com/whatsapp.php?phone={request.ContactNumber}&text={encodedMessage}&apikey={apiKey}";

        //        HttpResponseMessage response = await client.GetAsync(endpoint);
        //        string apiResult = await response.Content.ReadAsStringAsync();

        //        bool isSuccess = response.IsSuccessStatusCode && apiResult.Contains("Message Sent");

        //        return Ok(new SmsResponse
        //        {
        //            IsSuccess = isSuccess,
        //            Message = isSuccess
        //                ? "WhatsApp message sent successfully 🎉"
        //                : $"Failed to send message. Response: {apiResult}"
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new SmsResponse
        //        {
        //            IsSuccess = false,
        //            Message = $"Unexpected error occurred: {ex.Message}"
        //        });
        //    }
        //}


    }
}
