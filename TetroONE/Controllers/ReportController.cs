using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using TetroONE.Models;

using TetroONE.Controllers;
using System.Drawing; 
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.VisualBasic;
using TetroONE;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("Report")]
    public class ReportController : BaseController
    {
        public ReportController(IConfiguration configuration) : base(configuration)
        {

        }

        [Route("")]
        public IActionResult Report()
        {
            return View();
        }

        [HttpPost]
        [Route("ReportCategoryDropdown")]
        public IActionResult ReportCategoryDropdown([FromBody] ReportCategoryRequest request)
        {
            try
            {
                int LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

                DataSet ds = new DataSet();

                if (request != null)
                {
                    using (SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        connection.Open();
                        using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetReportCategoryDetails]", connection))
                        {
                            command.CommandType = CommandType.StoredProcedure;

                            command.Parameters.AddWithValue("@LoginUserId", LoginUserId);
                            command.Parameters.AddWithValue("@ReportName", request.ReportName);

                            // Add output parameters
                            command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                            command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                            SqlDataAdapter adapter = new SqlDataAdapter(command);
                            adapter.Fill(ds);

                            response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                            response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                            response.Data = GenericTetroONE.dataSetToJSON(ds);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
            return Json(response);
        }

        [HttpPost]
        [Route("ReportCategoryDropdownNew")]
        public IActionResult ReportCategoryDropdownNew([FromBody] ReportCategoryRequestNew request)
        {
            int LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            DataSet ds = new DataSet();

            if (request != null)
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetReportCategoryDetails_New]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@LoginUserId", LoginUserId);
                        command.Parameters.AddWithValue("@ReportName", request.ReportName);


                        // Add output parameters
                        command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;


                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        adapter.Fill(ds);

                        response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                        response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                        response.Data = GenericTetroONE.dataSetToJSON(ds);
                    }
                }
            }
            return Json(response);
        }

        [HttpPost]
        [Route("ReportValueDropdown")]
        public IActionResult ReportValueDropdown([FromBody] ReportValueRequest request)
        {
            int LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            DataSet ds = new DataSet();

            if (request != null)
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetReportValueDetails]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@LoginUserId", LoginUserId);
                        command.Parameters.AddWithValue("@ModuleName", request.ModuleName);

                        command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;


                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        adapter.Fill(ds);

                        response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                        response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                        response.Data = GenericTetroONE.dataSetToJSON(ds);
                    }
                }
            }

            return Json(response);
        }

        [HttpPost]
        [Route("ReportValueDropdownNew")]
        public IActionResult ReportValueDropdownNew([FromBody] ReportValueRequestNew request)
        {
            int LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            DataSet ds = new DataSet();

            if (request != null)
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("[dbo].[USP_DD_GetReportValueDetails_New]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@LoginUserId", LoginUserId);
                        command.Parameters.AddWithValue("@ReportName", request.ReportName);

                        command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                        command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;


                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        adapter.Fill(ds);

                        response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                        response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                        response.Data = GenericTetroONE.dataSetToJSON(ds);
                    }
                }
            }

            return Json(response);
        }

        [HttpPost]
        [Route("GetReport")]
        public IActionResult GetReport([FromBody] ReportRequest request)
        {
            if (request != null)
            {
                if (request.ReportName == "Employee" || request.ReportName == "Contact")
                {
                    ReportRequest reportRequest = new ReportRequest()
                    {
                        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                        ReportName = request.ReportName,
                        FromDate = null,
                        ToDate = null,
                        ReportCategory = request.ReportCategory,
                        ReportValue = request.ReportValue,
                        IsReport = request.IsReport
                    };
                    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_Rpt_OverallReportDetails]", reportRequest);
                }
                else
                {
                    ReportRequest reportRequest = new ReportRequest()
                    {

                        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                        ReportName = request.ReportName,
                        FromDate = Convert.ToDateTime(request.FromDate),
                        ToDate = Convert.ToDateTime(request.ToDate),
                        ReportCategory = request.ReportCategory,
                        ReportValue = request.ReportValue,
                        IsReport = request.IsReport
                    };
                    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_Rpt_OverallReportDetails]", reportRequest);
                }
            }
            return Json(response);
        }

        [HttpPost]
        [Route("GetReportNew")]
        public IActionResult GetReportNew([FromBody] ReportRequestNew request)
        {
            if (request != null)
            {
                ReportRequestNew reportRequestNew = new ReportRequestNew()
                {
                    LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
                    ReportName = request.ReportName,
                    FromDate = Convert.ToDateTime(request.FromDate),
                    ToDate = Convert.ToDateTime(request.ToDate),
                    Franchise = request.Franchise,
                    ReportCategory = request.ReportCategory,
                    ReportValue = request.ReportValue,
                };
                response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_Rpt_OverallReportDetails_New]", reportRequestNew);
            }
            return Json(response);
        }

        [HttpPost("GenerateReportPDF")]
        public IActionResult GenerateReportPDF([FromBody] ReportRequest request)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_Rpt_OverallReportDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@ReportName", request.ReportName);
                    command.Parameters.AddWithValue("@FromDate", request.FromDate);
                    command.Parameters.AddWithValue("@ToDate", request.ToDate);
                    command.Parameters.AddWithValue("@ReportCategory", request.ReportCategory);
                    command.Parameters.AddWithValue("@ReportValue", request.ReportValue);
                    command.Parameters.AddWithValue("@IsReport", request.IsReport);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    DataSet ds = new DataSet();
                    DataTable dt1 = new DataTable();
                    DataTable dt2 = new DataTable();
                    DataTable dt3 = new DataTable();
                    DataTable dt4 = new DataTable();

                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(ds);
                        dt1 = ds.Tables[0];
                        dt2 = ds.Tables[1];
                        dt3 = ds.Tables[2];
                        dt4 = ds.Tables[3];
                    }

                    var reportDownload = new ReportDownload
                    {
                        CompanyName = Convert.ToString(dt1.Rows[0]["CompanyName"]),
                        CompanyLogoName = Convert.ToString(dt1.Rows[0]["CompanyLogoName"]),
                        Address = Convert.ToString(dt1.Rows[0]["Address"]),
                        Location = Convert.ToString(dt1.Rows[0]["Location"]),
                        Contact = Convert.ToString(dt1.Rows[0]["Contact"]),
                        Website = Convert.ToString(dt1.Rows[0]["Website"]),
                        GSTNumber = Convert.ToString(dt1.Rows[0]["GSTNumber"]),
                        ReportCategory = Convert.ToString(dt2.Rows[0]["ReportCategory"]),
                        ReportValue = Convert.ToString(dt2.Rows[0]["ReportValue"]),
                        Duration = Convert.ToString(dt2.Rows[0]["Duration"]),
                        Reportname = Convert.ToString(dt2.Rows[0]["Reportname"]),
                    };

                    PDFService pdfService = new PDFService();

                    //var pdfFile = pdfService.DownloadReport(reportDownload, dt4);


                    var pdfContent = pdfService.DownloadReport(reportDownload, dt4);


                    var base64PdfContent = Convert.ToBase64String(pdfContent);


                    return Json(new { success = true, fileContent = base64PdfContent });

                }
            }
        }

        [HttpPost]
        [Route("CommonExcelDownload")]
        public IActionResult CommonExcelDownload([FromBody] ReportExcelDownload request)
        {
            int LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_Rpt_OverallReportDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", LoginUserId);
                    command.Parameters.AddWithValue("@ReportName", request.ReportName);
                    command.Parameters.AddWithValue("@FromDate", request.FromDate.AddDays(1));
                    command.Parameters.AddWithValue("@ToDate", request.ToDate.AddDays(1));
                    command.Parameters.AddWithValue("@ReportCategory", request.ReportCategory);
                    command.Parameters.AddWithValue("@ReportValue", request.ReportValue);
                    command.Parameters.AddWithValue("@IsReport", request.IsReport);
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    using var workbook = new XLWorkbook();
                    var worksheet = workbook.Worksheets.Add(($"{request.ReportName}_Report"));


                    if (request.ReportName == "Sales")
                    {

                        worksheet.Cell("A1").Value = "Pump Wise Sales";

                        var currentRow = 2;

                        var dataTable = ds.Tables[3];
                        List<string> columnsToHide = new List<string> { "EmployeeId", "EmployeeImage", "AttendanceLogId", "LeaveId", "PermissionId", "ApprovePrsnImg", "CompensatoryOffId", "AdvanceId", "LoanId", "ClaimId", "ApprovedPrsnImg", "PayslipId", "CompanyLogo", "Colour" };

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable.Columns.Contains(columnName))
                            {
                                dataTable.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable, currentRow, XLColor.LightGray, XLColor.White);

                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Product Wise Sales";
                        currentRow++;

                        var dataTable2 = ds.Tables[4];

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable2.Columns.Contains(columnName))
                            {
                                dataTable2.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable2, currentRow, XLColor.LightGray, XLColor.White);

                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Credit Sale Details";
                        currentRow++;

                        var dataTable3 = ds.Tables[5];

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable3.Columns.Contains(columnName))
                            {
                                dataTable3.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable3, currentRow, XLColor.LightGray, XLColor.White);

                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Payment Details";
                        currentRow++;

                        var dataTable4 = ds.Tables[6];

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable4.Columns.Contains(columnName))
                            {
                                dataTable4.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable4, currentRow, XLColor.LightGray, XLColor.White);

                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Expense Details";
                        currentRow++;

                        var dataTable5 = ds.Tables[7];

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable5.Columns.Contains(columnName))
                            {
                                dataTable5.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable5, currentRow, XLColor.LightGray, XLColor.White);
                        currentRow++;

                        var dataTable6 = ds.Tables[8];
                        //var shortAmt = Convert.ToString();
                        worksheet.Cell(currentRow, 1).Value = "Shortage Amount";
                        worksheet.Cell(currentRow, 2).Value = dataTable6.Rows[0]["GrossAmount"];

                    }
                    else if (request.ReportName == "Consolidated")
                    {
                        var currentRow = 1;

                        var dataTable = ds.Tables[2];
                        List<string> columnsToHide = new List<string> { "EmployeeId", "EmployeeImage", "AttendanceLogId", "LeaveId", "PermissionId", "ApprovePrsnImg", "CompensatoryOffId", "AdvanceId", "LoanId", "ClaimId", "ApprovedPrsnImg", "PayslipId", "CompanyLogo", "Colour" };

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable.Columns.Contains(columnName))
                            {
                                dataTable.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable, currentRow, XLColor.LightGray, XLColor.White);
                        currentRow++;

                        var dataTable2 = ds.Tables[3];

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable2.Columns.Contains(columnName))
                            {
                                dataTable2.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable2, currentRow, XLColor.LightGray, XLColor.White);

                    }
                    else if (request.ReportName == "MonthlyProfitLoss")
                    {
                        var currentRow = 1;

                        var dataTable = ds.Tables[2];
                        List<string> columnsToHide = new List<string> { "EmployeeId", "EmployeeImage", "AttendanceLogId", "LeaveId", "PermissionId", "ApprovePrsnImg", "CompensatoryOffId", "AdvanceId", "LoanId", "ClaimId", "ApprovedPrsnImg", "PayslipId", "CompanyLogo", "Colour", "Profit/Loss Colour" };

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable.Columns.Contains(columnName))
                            {
                                dataTable.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable, currentRow, XLColor.LightGray, XLColor.White);
                        currentRow++;

                        var dataTable2 = ds.Tables[3];

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable2.Columns.Contains(columnName))
                            {
                                dataTable2.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable2, currentRow, XLColor.LightGray, XLColor.White);
                        currentRow++;

                        var dataTable3 = ds.Tables[4];

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable3.Columns.Contains(columnName))
                            {
                                dataTable3.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable3, currentRow, XLColor.LightGray, XLColor.White);
                    }
                    else
                    {
                        var currentRow = 1;

                        var dataTable = ds.Tables[2];
                        List<string> columnsToHide = new List<string> { "EmployeeId", "EmployeeImage", "AttendanceLogId", "LeaveId", "PermissionId", "ApprovePrsnImg", "CompensatoryOffId", "AdvanceId", "LoanId", "ClaimId", "ApprovedPrsnImg", "PayslipId", "CompanyLogo", "Colour" };

                        // Hide columns by name
                        foreach (string columnName in columnsToHide)
                        {
                            if (dataTable.Columns.Contains(columnName))
                            {
                                dataTable.Columns.Remove(columnName);
                            }
                        }

                        // Add headers and data to worksheet
                        currentRow = AddHeadersAndData(worksheet, dataTable, currentRow, XLColor.LightGray, XLColor.White);
                    }

                    // Save workbook to stream
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", request.ReportName);
                }
            }
        } 

        [HttpPost]
        [Route("CommonExcelDownloadNew")]
        public IActionResult CommonExcelDownloadNew([FromBody] ReportExcelDownloadNew request)
        {
            int LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_Rpt_OverallReportDetails_New]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", LoginUserId);
                    command.Parameters.AddWithValue("@ReportName", request.ReportName);
                    command.Parameters.AddWithValue("@FromDate", request.FromDate.AddDays(1));
                    command.Parameters.AddWithValue("@ToDate", request.ToDate.AddDays(1));
                    command.Parameters.AddWithValue("@Franchise", request.Franchise);
                    command.Parameters.AddWithValue("@ReportCategory", request.ReportCategory);
                    command.Parameters.AddWithValue("@ReportValue", request.ReportValue);
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    using var workbook = new XLWorkbook();
                    var worksheet = workbook.Worksheets.Add(($"{request.ReportName}_Report"));

                    var currentRow = 1;

                    var dataTable = ds.Tables[2];
                    List<string> columnsToHide = new List<string> { "" };

                    // Hide columns by name
                    foreach (string columnName in columnsToHide)
                    {
                        if (dataTable.Columns.Contains(columnName))
                        {
                            dataTable.Columns.Remove(columnName);
                        }
                    }

                    // Add headers and data to worksheet
                    currentRow = AddHeadersAndData(worksheet, dataTable, currentRow, XLColor.LightGray, XLColor.White);

                    // Save workbook to stream
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", request.ReportName);
                }
            }
        }


        [HttpPost("GenerateReportPDFNew")]
        public IActionResult GenerateReportPDFNew([FromBody] ReportRequestNew request)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_Rpt_OverallReportDetails_New]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@ReportName", request.ReportName);
                    command.Parameters.AddWithValue("@FromDate", request.FromDate);
                    command.Parameters.AddWithValue("@ToDate", request.ToDate);
                    command.Parameters.AddWithValue("@Franchise", request.Franchise);
                    command.Parameters.AddWithValue("@ReportCategory", request.ReportCategory);
                    command.Parameters.AddWithValue("@ReportValue", request.ReportValue);


                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    DataSet ds = new DataSet();
                    DataTable dt1 = new DataTable();
                    DataTable dt2 = new DataTable();
                    DataTable dt3 = new DataTable();
                    DataTable dt4 = new DataTable();

                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(ds);
                        dt1 = ds.Tables[0];
                        dt2 = ds.Tables[1];
                        dt3 = ds.Tables[2];
                        dt4 = ds.Tables[3];
                    }

                    var reportDownload = new ReportDownload
                    {
                        CompanyName = Convert.ToString(dt1.Rows[0]["CompanyName"]),
                        CompanyLogoName = Convert.ToString(dt1.Rows[0]["CompanyLogoName"]),
                        Address = Convert.ToString(dt1.Rows[0]["Address"]),
                        Location = Convert.ToString(dt1.Rows[0]["Location"]),
                        Contact = Convert.ToString(dt1.Rows[0]["Contact"]),
                        Website = Convert.ToString(dt1.Rows[0]["Website"]),
                        GSTNumber = Convert.ToString(dt1.Rows[0]["GSTNumber"]),
                        ReportCategory = Convert.ToString(dt2.Rows[0]["ReportCategory"]),
                        ReportValue = Convert.ToString(dt2.Rows[0]["ReportValue"]),
                        Duration = Convert.ToString(dt2.Rows[0]["Duration"]),
                        Reportname = Convert.ToString(dt2.Rows[0]["Reportname"]),
                    };

                    PDFService pdfService = new PDFService();

                    //var pdfFile = pdfService.DownloadReport(reportDownload, dt4);


                    var pdfContent = pdfService.DownloadReport(reportDownload, dt4);


                    var base64PdfContent = Convert.ToBase64String(pdfContent);


                    return Json(new { success = true, fileContent = base64PdfContent });

                }
            }
        }

        [HttpGet]
        [Route("GetReportName")]
        public IActionResult GetReportName(int ReportId)
        {
            GetReportName Get = new GetReportName()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ReportId = ReportId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_Rpt_GetReportNameDetails]", Get);
            return Json(response);
        }

        private int AddHeadersAndData(IXLWorksheet worksheet, DataTable dataTable, int currentRow, XLColor headerColor, XLColor dataColor)
        {
            // Add headers with color and borders
            for (int i = 0; i < dataTable.Columns.Count; i++)
            {
                var cell = worksheet.Cell(currentRow, i + 1);
                cell.Value = dataTable.Columns[i].ColumnName;
                cell.Style.Fill.BackgroundColor = headerColor;
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                // Apply border to header cell
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                cell.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
            }

            currentRow++;

            // Add data rows with color and borders
            foreach (DataRow row in dataTable.Rows)
            {
                for (int i = 0; i < dataTable.Columns.Count; i++)
                {
                    var cell = worksheet.Cell(currentRow, i + 1);
                    cell.Value = row[i];
                    cell.Style.Fill.BackgroundColor = dataColor;

                    // Adjust styles if needed
                    if (dataTable.Columns[i].DataType == typeof(DateTime))
                    {
                        cell.DataType = XLDataType.DateTime;
                        cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    }

                    // Apply border to data cell
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                }
                currentRow++;
            }

            worksheet.Columns().AdjustToContents();

            return currentRow;
        }

        public class NewReportExcelRequest { public string? ReportName { get; set; } }

        [HttpPost]
        [Route("ExcelReportDownloadNew")]
        public IActionResult ExcelReportDownloadNew([FromBody] NewReportExcelRequest request)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add($"{request.ReportName}_Report");

            var headerRange = worksheet.Range(2, 2, 2, 12).Merge();
            headerRange.Merge();
            worksheet.Cell(2, 2).Value = "SENNKARATHAAAN FOOD AND BEVERAGES";
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.FontSize = 14;
            headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Medium;

            var SubheaderRange = worksheet.Range(3, 2, 3, 12).Merge();
            SubheaderRange.Merge();
            worksheet.Cell(3, 2).Value = "PROFIT & LOSS A/C FOR THE MONTH OF AUGUST (1-31) 2025";
            SubheaderRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            SubheaderRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            SubheaderRange.Style.Font.Bold = true;
            SubheaderRange.Style.Font.FontSize = 11;
            SubheaderRange.Style.Border.OutsideBorder = XLBorderStyleValues.Medium;

            int startRow = 4;
            int lastRow = startRow + 2;
            var titleRange = worksheet.Range("B4:L4");

            // Top and bottom across the whole row
            titleRange.Style.Border.TopBorder = XLBorderStyleValues.Medium;
            titleRange.Style.Border.BottomBorder = XLBorderStyleValues.Medium;
            worksheet.Cell("B4").Style.Border.LeftBorder = XLBorderStyleValues.Medium;
            worksheet.Cell("L4").Style.Border.RightBorder = XLBorderStyleValues.Medium;

            var leftMarginRange = worksheet.Range("B5:B33");
            leftMarginRange.Style.Border.LeftBorder = XLBorderStyleValues.Medium;

            worksheet.Cell(startRow, 2).Value = "Particulars";
            worksheet.Cell(startRow, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.Cell(startRow, 2).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            worksheet.Cell(startRow, 2).Style.Font.Bold = true;
            worksheet.Cell(startRow, 2).Style.Font.FontSize = 10;

            worksheet.Cell(startRow, 6).Value = "Amount";
            worksheet.Cell(startRow, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.Cell(startRow, 6).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            worksheet.Cell(startRow, 6).Style.Font.Bold = true;
            worksheet.Cell(startRow, 6).Style.Font.FontSize = 10;

            worksheet.Cell(startRow + 1, 2).Value = "Opening Stock";
            worksheet.Cell(startRow + 1, 6).Value = 10000;

            //2 → starting column index(B) 3 → ending column index(C)
            worksheet.Columns(2, 3).AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();

            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{request.ReportName}.xlsx");
        }
    }
}
