using TetroONE.Models;
using log4net;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using System.Reflection.Metadata.Ecma335;
using ClosedXML.Excel;
using System.Text;
using Org.BouncyCastle.Crypto.Operators;
using System.Net.Mail;
using DocumentFormat.OpenXml.VariantTypes;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("HumanResource")]
    public class HumanResourceController : BaseController
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILog _logger;
        public HumanResourceController(IConfiguration configuration, IWebHostEnvironment hostingEnvironment, ILog logger) : base(configuration)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        }
        [Route("Employee")]
        public IActionResult Employee()
        {
            return View();
        }
        [Route("Attendance")]
        public IActionResult Attendance()
        {
            return View();
        }
        [Route("Deductions")]
        public IActionResult Deductions()
        {
            return View();
        }
        [Route("Payroll")]
        public IActionResult Payroll()
        {
            return View();
        }
        [Route("CompanyDocs")]
        public IActionResult CompanyDocs()
        {
            return View();
        }
        public IActionResult TeamInfo()
        {
            return View();
        }
        [Route("Shift")]
        public IActionResult Shift()
        {
            return View();
        }
        [Route("ExitManagement")]
        public IActionResult ExitManagement()
        {
            return View();
        }

        [HttpGet]
        [Route("Get")]
        public IActionResult Get(int? EmployeeTypeId, int? EmployeeId, int FranchiseId)
        {
            GetEmployee Get = new GetEmployee()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                EmployeeId = EmployeeId,
                EmployeeTypeId = EmployeeTypeId,
                FranchiseId = FranchiseId
            };

            response = GenericTetroONE.GetData(_connectionString, "USP_GetEmployeeDetails", Get);
            return Json(response);
        }

		[HttpPost]
		[Route("InsertEmployee")]
		public async Task<IActionResult> InsertEmployee()
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			InsertEmployee staticDetails = new InsertEmployee();

			staticDetails = JsonConvert.DeserializeObject<InsertEmployee>(Request.Form["StaticData"]);

			List<AttendanceMachineMappingDetail>? staticData = JsonConvert.DeserializeObject<List<AttendanceMachineMappingDetail>?>(Request.Form["AttendanceMachineMapping"]);
			DataTable attendanceMachineMappingDetail = GenericTetroONE.ToDataTable(staticData);

			List<EmployeeReportingPersonMappingDetails>? employeeReportingPersonMappingDetails = JsonConvert.DeserializeObject<List<EmployeeReportingPersonMappingDetails>?>(Request.Form["EmployeeReportingPersonMappingDetails"]);
			DataTable EmployeeReportingPersonMappingDetails = GenericTetroONE.ToDataTable(employeeReportingPersonMappingDetails);

			string relativeFilePath = string.Empty, fileName = string.Empty;

			string employeeImage = !string.IsNullOrEmpty(staticDetails.EmployeeImage) ? staticDetails.EmployeeImage.Split('.')[0] : "";

			var claimsIdentity = (ClaimsIdentity)User.Identity;

			if (!string.IsNullOrEmpty(staticDetails.EmployeeImage) && !Guid.TryParse(employeeImage, out _))
			{
				string guid = Guid.NewGuid().ToString();
				string relativePath = Path.Combine("TetroOne");
				fileName = guid + Path.GetExtension(staticDetails.EmployeeImage)?.ToLowerInvariant();
				relativeFilePath = "..\\" + relativePath + "\\" + fileName;
				relativeFilePath = relativeFilePath.Replace("\\", "/");
			}
			else
			{
				relativeFilePath = staticDetails.ExistingImage;
			}

			List<documentName> documentNames = JsonConvert.DeserializeObject<List<documentName>>(Request.Form["documentName"]);

			IFormFileCollection file = Request.Form.Files;
			var fileIds = Request.Form["file_id[]"];
			List<EmployeeDocumentMapping> lstattachment = new List<EmployeeDocumentMapping>();
			DataTable dtattachment = new DataTable();

			foreach (var item in file)
			{
				var matchingDocument = documentNames.FirstOrDefault(d => d.DocumentFileName == item.FileName);
				if (!lstattachment.Any(x => x.AttachmentExactFileName == item.FileName))
				{
					var attachment = GetFilePath(item.FileName);
					lstattachment.Add(new EmployeeDocumentMapping()
					{
						EmployeeDocumentMappingId = null,
						EmployeeId = null,
						DocumentId = matchingDocument.DocumentId,
						DocumentFileName = attachment.Item1,
						DocumentFilePath = attachment.Item2,
						AttachmentExactFileName = item.FileName,
					});
				}
			}

			bool isuploaded = await IsClaimAttachmentUploadedEmp(file, lstattachment);
			foreach (var item in lstattachment)
			{
				item.DocumentFileName = item.AttachmentExactFileName;
			}

			var exist = Request.Form["Exist"].ToList();
			if (exist != null && exist.Count > 0)
			{
				List<EmployeeDocumentMapping> lstexistattachment = ParseFormDataEmp(Request.Form["Exist"]);
				if (lstexistattachment.Any())
				{
					foreach (var attachment in lstexistattachment)
					{
						if (lstexistattachment.Any(x => !string.IsNullOrEmpty(x.DocumentFileName)))
						{
							lstattachment.AddRange(lstexistattachment);
						}
					}
				}
			}
			lstattachment = lstattachment.GroupBy(x => x.AttachmentExactFileName).Select(g => g.First()).ToList();

			dtattachment = GenericTetroONE.ToDataTable(lstattachment);
			dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");

			List<EmployeeDocumentMapping> lstdeleteattachment = new List<EmployeeDocumentMapping>();
			var deletedFile = Request.Form["DeletedFile"].ToList();
			if (deletedFile != null && deletedFile.Count > 0)
			{
				lstdeleteattachment = ParseFormDataEmp(Request.Form["DeletedFile"]);
				if (lstdeleteattachment.Any())
				{
					lstdeleteattachment.AddRange(lstdeleteattachment);
				}
			}

			staticDetails.LoginUserId = _userId;
			staticDetails.TVP_EmployeeDeviceMappingDetails = attendanceMachineMappingDetail;
			staticDetails.TVP_EmployeeDeviceMappingDetails = attendanceMachineMappingDetail;
			staticDetails.TVP_EmployeeReportingPersonMappingDetails = EmployeeReportingPersonMappingDetails;
			staticDetails.EmployeeImage = relativeFilePath;
			staticDetails.TVP_EmployeeDocumentMappingDetails = dtattachment;

			if (staticDetails.EmployeeId != null && staticDetails.EmployeeId != 0)
			{
				string[] exclude = { "attendanceMachineMappingDetails", "ExistingImage", "TVP_EmployeeDeviceMappingDetails", "EmployeeReportingPersonMappingDetails" };
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateEmployeeDetails]", staticDetails, exclude);
			}
			else
			{
				string[] exclude = { "attendanceMachineMappingDetails", "EmployeeId", "ExistingImage", "EmployeeStatusId", "EmployeeReportingPersonMappingDetails" };
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertEmployeeDetails]", staticDetails, exclude);
			}

			response.Data = fileName;

			if (response.Status)
			{
				var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");

				foreach (var item in lstdeleteattachment)
				{
					string filepath = directoryPath + item.DocumentFilePath.Replace("..", "").Replace("/", "\\");
					if (System.IO.File.Exists(filepath))
					{
						System.IO.File.Delete(filepath);
					}
				}
			}

			return Json(response);
		}

		[HttpGet]
        [Route("Delete")]
        public IActionResult Delete(int EmployeeId)
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[USP_DeleteEmployeeDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _userId);
                    command.Parameters.AddWithValue("@EmployeeId", EmployeeId);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                }

                if (response.Status)
                {
                    if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                    {
                        var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
                        foreach (DataRow item in ds.Tables[0].Rows)
                        {
                            string filePath = directoryPath + Convert.ToString(item["EmployeeImage"])
                                .Replace("..", "").Replace("/", "\\");
                            if (System.IO.File.Exists(filePath))
                            {
                                System.IO.File.Delete(filePath);
                            }
                        }
                    }
                    if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                    {
                        var baseDirectory = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot");
                        foreach (DataRow row in ds.Tables[1].Rows)
                        {
                            string fullPath = baseDirectory + Convert.ToString(row["DocumentFilePath"])
                                .Replace("..", "").Replace("/", "\\");

                            if (System.IO.File.Exists(fullPath))
                            {
                                System.IO.File.Delete(fullPath);
                            }
                        }
                    }
                }

                return Json(response);
            }

        }

        [HttpGet]
        [Route("GetAutoGenerateId")]
        public IActionResult GetAutoGenerateId(int? FranchiseId, int? EmployeeTypeId)
        {
            GetAutoGenerateId Get = new GetAutoGenerateId()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                FranchiseId = FranchiseId,
                EmployeeTypeId = EmployeeTypeId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetEmployeeAutoGenerateNoDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetReportingPerson")]
        public IActionResult GetReportingPerson(int DepartmentId)
        {
            GetReportingPerson Get = new GetReportingPerson()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                DepartmentId = DepartmentId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetReportingPersonDetails_ByDepartmentId]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetPayTypePayGroup")]
        public IActionResult GetPayTypePayGroup(int EmployeeTypeId)
        {
            GetPayTypePayGroup Get = new GetPayTypePayGroup()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                EmployeeTypeId = EmployeeTypeId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetPayTypeDetails_ByEmployeeTypeId]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetPayGroup")]
        public IActionResult GetPayGroup(int PayTypeId)
        {
            GetPayGroup Get = new GetPayGroup()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                PayTypeId = PayTypeId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetPayGroupDetails_ByPayTypeId]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetDocumentDetails")]
        public IActionResult GetDocumentDetails()
        {
            GetEmployee Get = new GetEmployee()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
            };

            string[] exclude = { "EmployeeTypeId", "EmployeeId", "FranchiseId" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEmployeeDocumentDetails]", Get, exclude);
            return Json(response);
        }

        [HttpGet]
        [Route("GetAttendanceEmployee")]
        public IActionResult GetAttendanceEmployee(int EmployeeId, DateTime FromDate, DateTime ToDate, DateTime? PunchDate)
        {
            int? empId = null;
            if (EmployeeId == 0)
            {
                empId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData).Value);
            }
            else
            {
                empId = EmployeeId;
            }
            GetAttendanceEmployee Get = new GetAttendanceEmployee()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),

                EmployeeId = empId,
                FromDate = FromDate.AddDays(1),
                ToDate = ToDate,
                Punchdate = PunchDate,
            };

            string[] exclude = { "EmployeeTypeId" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceLogDetails_Employee_HotCode]", Get, exclude);
            return Json(response);
        }

        //[HttpGet]
        //[Route("GetAttendanceEmployee")]
        //public IActionResult GetAttendanceEmployee(int EmployeeId, DateTime FromDate, DateTime ToDate, DateTime? PunchDate)
        //{
        //    int? empId = null;
        //    if (EmployeeId == 0)
        //    {
        //        empId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData).Value);
        //    }
        //    else
        //    {
        //        empId = EmployeeId;
        //    }
        //    GetAttendanceEmployee Get = new GetAttendanceEmployee()
        //    {
        //        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),

        //        EmployeeId = empId,
        //        FromDate = FromDate.AddDays(1),
        //        ToDate = ToDate,
        //        Punchdate = PunchDate,
        //    };

        //    string[] exclude = { "EmployeeTypeId" };
        //    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceLogDetails_Employee]", Get, exclude);
        //    return Json(response);
        //}

		[HttpGet]
		[Route("GetAttendanceMyTeam")]
		public IActionResult GetAttendanceMyTeam(int EmployeeId, DateTime FromDate, DateTime ToDate, DateTime? PunchDate)
		{
			int? empId = null;
			if (EmployeeId == 0)
			{
				empId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData).Value);
			}
			else
			{
				empId = EmployeeId;
			}
			GetAttendanceEmployee Get = new GetAttendanceEmployee()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),

				EmployeeId = empId,
				FromDate = FromDate.AddDays(1),
				ToDate = ToDate,
				Punchdate = PunchDate,
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceLogDetails_MyTeam_HotCode]", Get);
			return Json(response);
		}


		//[HttpGet]
		//[Route("GetAttendanceMyTeam")]
		//public IActionResult GetAttendanceMyTeam(int EmployeeId, DateTime FromDate, DateTime ToDate, DateTime? PunchDate)
		//{
		//	int? empId = null;
		//	if (EmployeeId == 0)
		//	{
		//		empId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData).Value);
		//	}
		//	else
		//	{
		//		empId = EmployeeId;
		//	}
		//	GetAttendanceEmployee Get = new GetAttendanceEmployee()
		//	{
		//		LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),

		//		EmployeeId = empId,
		//		FromDate = FromDate.AddDays(1),
		//		ToDate = ToDate,
		//		Punchdate = PunchDate,
		//	};

		//	response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceLogDetails_MyTeam]", Get);
		//	return Json(response);
		//}







		[HttpGet]
        [Route("GetAttendanceInOut")]
        public IActionResult GetAttendanceInOut()
        {
            GetAttendanceAdmin Get = new GetAttendanceAdmin()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
            };
            string[] exclude = { "EmployeeId", "FromDate", "ToDate", "PunchDate", "EmployeeTypeId" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceInOutDetails_Employee]", Get, exclude);
            return Json(response);
        }
        [HttpPost]
        [Route("InsertAttendanceEmployee")]
        public IActionResult InsertAttendanceEmployee([FromBody] InsertAttendanceEmployee request)
        {
            string attendanceImage = !string.IsNullOrEmpty(request.DocumentFilePath) ? request.DocumentFilePath.Split('.')[0] : "";
            string relativeFilePath = string.Empty, fileName = string.Empty;

            if (!string.IsNullOrEmpty(request.DocumentFilePath) && !Guid.TryParse(attendanceImage, out _))
            {
                string guid = Guid.NewGuid().ToString();
                string relativePath = Path.Combine("TetroOne");
                fileName = guid + Path.GetExtension(request.DocumentFilePath)?.ToLowerInvariant();
                relativeFilePath = "..\\" + relativePath + "\\" + fileName;
                relativeFilePath = relativeFilePath.Replace("\\", "/");
            }
            else
            {
                relativeFilePath = null;
            }

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            request.EmployeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData).Value);
            request.DocumentFilePath = relativeFilePath;
            request.PunchDate = request.PunchDate;

            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertAttendanceLogDetails_Employee]", request);
            response.Data = relativeFilePath;

            return Json(response);
        }


        [HttpGet]
        [Route("GetAttendanceAdmin")]
        public IActionResult GetAttendanceAdmin(int EmployeeId, DateTime FromDate, DateTime ToDate, int PunchDate, int? EmployeeTypeId)
        {
            GetAttendanceAdmin Get = new GetAttendanceAdmin()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                EmployeeId = EmployeeId == 0 ? null : EmployeeId,
                FromDate = FromDate.AddDays(1),
                ToDate = ToDate,
                PunchDate = PunchDate == 0 ? null : PunchDate,
                EmployeeTypeId = EmployeeTypeId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceLogDetails_Admin_HotCode]", Get);
            return Json(response);
        }

        //[HttpGet]
        //[Route("GetAttendanceAdmin")]
        //public IActionResult GetAttendanceAdmin(int EmployeeId, DateTime FromDate, DateTime ToDate, int PunchDate, int? EmployeeTypeId)
        //{
        //    GetAttendanceAdmin Get = new GetAttendanceAdmin()
        //    {
        //        LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
        //        EmployeeId = EmployeeId == 0 ? null : EmployeeId,
        //        FromDate = FromDate.AddDays(1),
        //        ToDate = ToDate,
        //        PunchDate = PunchDate == 0 ? null : PunchDate,
        //        EmployeeTypeId = EmployeeTypeId
        //    };

        //    response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceLogDetails_Admin]", Get);
        //    return Json(response);
        //}

        [HttpGet]
        [Route("GetManualAttendance")]
        public IActionResult GetManualAttendance(DateTime PunchDate)
        {
            GetManualAttendance Get = new GetManualAttendance()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                PunchDate = PunchDate.AddDays(1)
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetManualAttendanceDetails]", Get);
            return Json(response);
        }


        [HttpPost]
        [Route("InsertManualAttendance")]
        public IActionResult InsertManualAttendance([FromBody] InsertManualAttendance request)
        {
            DataTable manualData = new DataTable();
            manualData = GenericTetroONE.ToDataTable(request.manualData);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            request.TVP_AttendanceDetails = manualData;
            request.PunchDate = request.PunchDate.HasValue ? request.PunchDate.Value.AddDays(1) : (DateTime?)null;

            string[] Exclude = { "manualData" };
            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertManualAttendanceDetails]", request, Exclude);

            return Json(response);
        }

        [HttpGet]
        [Route("GetAvailability")]
        public IActionResult GetAvailability(DateTime? Date)
        {
            GetAvailability getClient = new GetAvailability()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                Date = Date,
                EmployeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData).Value)
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetEmployeeAvailabilityDetails]", getClient);
            return Json(response);
        }

        [HttpPost]
        [Route("UpdateAvailability")]
        public IActionResult UpdateAvailability([FromBody] UpdateAvailability request)
        {
            DataTable EmployeeAvailabilityDetails = new DataTable();
            EmployeeAvailabilityDetails = GenericTetroONE.ToDataTable(request.employeeAvailabilityDetails);

            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            request.TVP_EmployeeAvailabilityDetails = EmployeeAvailabilityDetails;

            string[] Exclude = { "employeeAvailabilityDetails" };
            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateEmployeeAvailabilityDetails]", request, Exclude);
            return Json(response);
        }

        public class DeleteAvailability { public int LoginUserId { get; set; } public int? EmployeeAvailabilityId { get; set; } }
        [HttpGet]
        [Route("DeleteAvailability")]
        public IActionResult DeleteAvailability_1(int EmployeeAvailabilityId)
        {
            DeleteAvailability getVendor = new DeleteAvailability()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                EmployeeAvailabilityId = EmployeeAvailabilityId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteEmployeeAvailabilityDetails]", getVendor);
            return Json(response);
        }

        [HttpGet]
        [Route("GetPayslip")]
        public IActionResult GetPayslip(int PaySlipId, int Month, int Year)
        {
            GetPayslip Get = new GetPayslip()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                PaySlipId = PaySlipId == 0 ? null : PaySlipId,
                Month = Month,
                Year = Year,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPaySlipDetails]", Get);
            return Json(response);
        }


        [HttpGet]
        [Route("GetPayOutComeDetails")]
        public IActionResult GetPayOutComeDetails(string ModuleName, int Month, int Year)
        {
            GetPayOutComeDetails Get = new GetPayOutComeDetails()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ModuleName = ModuleName,
                Month = Month,
                Year = Year,
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPayOutComeDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("ExcelPFDetails")]
        public IActionResult ExcelPFDetails(string ModuleName, int Month, int Year)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPayOutComeDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@Month", Month == 0 ? null : Month);
                    command.Parameters.AddWithValue("@Year", Year);
                    command.Parameters.AddWithValue("@ModuleName", ModuleName);

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    using var workbook = new XLWorkbook();
                    var worksheet = workbook.Worksheets.Add(ModuleName);
                    var currentRow = 1;

                    var dataTable = ds.Tables[0];
                    List<string> columnsToHide = new List<string> { "EmployeeId", "EmployeeImage" };

                    foreach (string columnName in columnsToHide)
                    {
                        if (dataTable.Columns.Contains(columnName))
                        {
                            dataTable.Columns.Remove(columnName);
                        }
                    }

                    currentRow = AddHeadersAndData(worksheet, dataTable, currentRow, XLColor.LightGray, XLColor.White);

                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ModuleName);
                }
            }
        }

        private int AddHeadersAndData(IXLWorksheet worksheet, DataTable dataTable, int currentRow, XLColor headerColor, XLColor dataColor)
        {
            for (int i = 0; i < dataTable.Columns.Count; i++)
            {
                var cell = worksheet.Cell(currentRow, i + 1);
                cell.Value = dataTable.Columns[i].ColumnName;
                cell.Style.Fill.BackgroundColor = headerColor;
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                cell.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
            }

            currentRow++;

            foreach (DataRow row in dataTable.Rows)
            {
                for (int i = 0; i < dataTable.Columns.Count; i++)
                {
                    var cell = worksheet.Cell(currentRow, i + 1);
                    cell.Value = row[i];
                    cell.Style.Fill.BackgroundColor = dataColor;

                    if (dataTable.Columns[i].DataType == typeof(DateTime))
                    {
                        cell.DataType = XLDataType.DateTime;
                        cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    }

                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                }
                currentRow++;
            }

            worksheet.Columns().AdjustToContents();

            return currentRow;
        }

        [HttpGet]
        [Route("TextPFDetails")]
        public IActionResult TextPFDetails(string ModuleName, int Month, int Year)
        {
            _employeeId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("[dbo].[USP_GetPayOutComeDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@LoginUserId", _employeeId);
                    command.Parameters.AddWithValue("@Month", Month == 0 ? null : Month);
                    command.Parameters.AddWithValue("@Year", Year);
                    command.Parameters.AddWithValue("@ModuleName", ModuleName);

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    DataSet ds = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    var dataTable = ds.Tables[0];
                    StringBuilder sb = new StringBuilder();
                    List<string> columnsToHide = new List<string> { "EmployeeId", "EmployeeImage" };

                    foreach (string columnName in columnsToHide)
                    {
                        if (dataTable.Columns.Contains(columnName))
                        {
                            dataTable.Columns.Remove(columnName);
                        }
                    }

                    foreach (DataRow row in dataTable.Rows)
                    {
                        List<string> values = new List<string>();

                        foreach (var item in row.ItemArray)
                        {
                            values.Add(item.ToString());
                        }

                        sb.AppendLine("#~#" + string.Join("#~#", values));
                    }

                    byte[] fileBytes = Encoding.UTF8.GetBytes(sb.ToString());
                    string fileName = "pf_details.txt";

                    return File(fileBytes, "text/plain", fileName);
                }
            }
        }


        [HttpGet]
        [Route("GetAdvance")]
        public IActionResult GetAdvance(int AdvanceId)
        {
            GetAdvance Get = new GetAdvance()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AdvanceId = AdvanceId == 0 ? null : AdvanceId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAdvanceDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertAdvance")]
        public IActionResult InsertAdvance([FromBody] InsertAdvance request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            request.AdvanceId = request.AdvanceId == 0 ? null : request.AdvanceId;
         
            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateAdvanceDetails]", request);

            return Json(response);
        }

        [HttpGet]
        [Route("DeleteAdvance")]
        public IActionResult DeleteAdvance(int AdvanceId)
        {
            GetAdvance Get = new GetAdvance()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                AdvanceId = AdvanceId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteAdvanceDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetLoan")]
        public IActionResult GetLoan(int LoanId)
        {
            GetLoan Get = new GetLoan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                LoanId = LoanId == 0 ? null : LoanId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetLoanDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertLoan")]
        public IActionResult InsertLoan([FromBody] InsertLoan request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            request.LoanId = request.LoanId == 0 ? null : request.LoanId;
          
            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateLoanDetails]", request);

            return Json(response);
        }

        [HttpGet]
        [Route("DeleteLoan")]
        public IActionResult DeleteLoan(int LoanId)
        {
            GetLoan Get = new GetLoan()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                LoanId = LoanId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteLoanDetails]", Get);
            return Json(response);
        }


        [HttpGet]
        [Route("GetClaim")]
        public IActionResult GetClaim(int ClaimId)
        {
            GetClaim Get = new GetClaim()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ClaimId = ClaimId == 0 ? null : ClaimId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetClaimDetails]", Get);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertClaim")]
        public async Task<IActionResult> InsertClaim()
        {
            _userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

            InsertClaim staticDetails = JsonConvert.DeserializeObject<InsertClaim>(Request.Form["StaticDetails"]);

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
                    ModuleName = "Claim"
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

            staticDetails.LoginUserId = _userId;
            staticDetails.ApprovedBy = _userId;
            staticDetails.TVP_AttachmentDetails = dtattachment;

            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateClaimDetails]", staticDetails, "attachement");

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
        [Route("DeleteClaim")]
        public IActionResult DeleteClaim(int ClaimId)
        {
            GetClaim Get = new GetClaim()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ClaimId = ClaimId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteClaimDetails]", Get);

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


        [HttpGet]
        [Route("GetExpenseNo")]
        public IActionResult GetExpenseNo(int? ModuleId, string ModuleName)
        {
            GetExpenseNo Get = new GetExpenseNo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                ModuleId = ModuleId,
                ModuleName = ModuleName
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetExpenseClaimDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetUserTypeId")]
        public IActionResult GetUserTypeId(int EmployeeTypeId)
        {
            GetUserTypeId Get = new GetUserTypeId()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                EmployeeTypeId = EmployeeTypeId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetEmployeeUserTypeDetails_ByEmployeeTypeId]", Get);
            return Json(response);
        }


        [HttpGet]
        [Route("GetCompanyDocument")]
        public IActionResult GetCompanyDocument(int? CompanyDocumentId)
        {
            GetCompanyDocument Get = new GetCompanyDocument()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                CompanyDocumentId = CompanyDocumentId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetCompanyDocumentDetails]", Get);
            return Json(response);
        }


        [HttpPost]
        [Route("InsertCompanyDocument")]
        public async Task<IActionResult> InsertCompanyDocument()
        {
            InsertCompanyDocument staticDetails = JsonConvert.DeserializeObject<InsertCompanyDocument>(Request.Form["StaticDetails"]);

            IFormFileCollection file = Request.Form.Files;
            List<AttachmentDetails> lstattachment = new List<AttachmentDetails>();
            DataTable dtattachment = new DataTable();

            if (file != null && file.Any())
            {
                foreach (var item in file)
                {
                    var attachment = GetFilePath(item.FileName);
                    lstattachment.Add(new AttachmentDetails()
                    {
                        AttachmentExactFileName = item.FileName,
                        AttachmentFileName = attachment.Item1,
                        AttachmentFilePath = attachment.Item2,
                        ModuleName = ""
                    });
                }

                bool isuploaded = await IsClaimAttachmentUploaded(file, lstattachment);

                foreach (var item in lstattachment)
                {
                    item.AttachmentFileName = item.AttachmentExactFileName;
                }
            }
            else
            {
                string[] exist = Request.Form["Exist"].ToArray();
                if (exist != null && exist.Length > 0)
                {
                    List<AttachmentDetails> lstexistattachment = ParseFormData(Request.Form["Exist"]);
                    if (lstexistattachment.Any())
                    {
                        lstattachment.AddRange(lstexistattachment);
                    }
                }
            }

			List<AttachmentDetails> lstdeleteattachment = new List<AttachmentDetails>();
			var deletedFile = Request.Form["DeletedFile"].ToList();
			if (deletedFile != null && deletedFile.Count > 0)
			{
				lstdeleteattachment = ParseFormData(Request.Form["DeletedFile"]);
				if (lstdeleteattachment.Any())
				{
					lstdeleteattachment.AddRange(lstdeleteattachment);
					//lstdeleteattachment.RemoveAll(item1 => lstdeleteattachment.Any(item2 => item2.AttachmentId == item1.AttachmentId));
				}
			}

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);

            staticDetails.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            if (dtattachment != null && dtattachment.Rows.Count > 0)
            {
                staticDetails.DocumentFileName = dtattachment.Rows[0]["AttachmentFileName"]?.ToString();
                staticDetails.DocumentFilePath = dtattachment.Rows[0]["AttachmentFilePath"]?.ToString();
            }
            else
            {
                staticDetails.DocumentFileName = null;
                staticDetails.DocumentFilePath = null;
            }

            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertUpdateCompanyDocumentDetails]", staticDetails, "existImagePath");

			if (!response.Status)
			{
				foreach (var item in lstdeleteattachment)
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
        [Route("DeleteCompanyDocument")]
        public IActionResult DeleteCompanyDocument(int? CompanyDocumentId)
        {
            GetCompanyDocument Get = new GetCompanyDocument()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                CompanyDocumentId = CompanyDocumentId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteCompanyDocumentDetails]", Get);
            return Json(response);
        }

        [HttpGet]
        [Route("GetAttendanceCheckList")]
        public IActionResult GetAttendanceCheckList(DateTime CheckListDate)
        {
            AttendanceCheckList Get = new AttendanceCheckList()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                CheckListDate = CheckListDate
            };
            string[] exclude = { "AttendanceCheckListId", "Comments" };
            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAttendanceCheckListDetails]", Get, exclude);
            return Json(response);
        }

        [HttpPost]
        [Route("InsertAttendanceCheckList")]
        public IActionResult InsertAttendanceCheckList([FromBody] AttendanceCheckList request)
        {
            request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            request.CheckListDate = request.CheckListDate;

            response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertAttendanceCheckListDetails]", request);

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

        private async Task<bool> IsClaimAttachmentUploadedEmp(IFormFileCollection file, List<EmployeeDocumentMapping> lstattachment)
        {
            bool isuploaded = false;

            foreach (var item in file)
            {
                var filenameInfo = lstattachment.FirstOrDefault(x => x.AttachmentExactFileName == item.FileName);
                if (filenameInfo != null)
                {
                    var filename = filenameInfo.DocumentFileName;
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

        private List<EmployeeDocumentMapping> ParseFormDataEmp(string formData)
        {
            List<EmployeeDocumentMapping> existList = JsonConvert.DeserializeObject<List<EmployeeDocumentMapping>>(formData);
            return existList;

        }


        [HttpGet]
        [Route("GetExpenseDD")]
        public IActionResult GetExpenseDD(int? MasterInfoId, string ModuleName)
        {
            CommonDrop Get = new CommonDrop()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                MasterInfoId = MasterInfoId,
                ModuleName = ModuleName
            };

            response = GenericTetroONE.GetData(_connectionString, "USP_DD_GetMasterInfoDetails", Get);
            return Json(response);
        }

		[HttpGet]
		[Route("GeneratePayslip")]
		public IActionResult GeneratePayslip(int Month, int Year, int PayGroupId)
		{
			GeneratePayslip Get = new GeneratePayslip()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				Month = Month,
				Year = Year,
				PayGroupId = PayGroupId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GeneratePayslipDetails]", Get);
			return Json(response);
		}

        [HttpGet]
        [Route("GetTeamInfo")]
        public IActionResult GetTeamInfo(int? EmployeeId)
        {
            GetTeamInfo GetMyTeam = new GetTeamInfo()
            {
                LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                EmployeeId = EmployeeId
            };

            response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetMyTeamDetails]", GetMyTeam);
            return Json(response);
        }

    }
}