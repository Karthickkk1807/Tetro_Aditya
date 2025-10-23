using TetroONE.Models;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Razorpay.Api;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;

namespace TetroONE.Controllers
{
	[Authorize]
	[Route("Payment")]
	public class PaymentController : BaseController
	{
		private readonly IWebHostEnvironment _hostingEnvironment;
		private readonly ILog _logger;
		public PaymentController(IConfiguration configuration, IWebHostEnvironment hostingEnvironment, ILog logger) : base(configuration)
		{
			_hostingEnvironment = hostingEnvironment;
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[Route("Payment")]
		public IActionResult Payment()
		{
			return View();
		}

		[HttpGet]
		[Route("GetPayment")]
		public IActionResult GetPayment(int? PaymentId, int FranchiseId, DateTime? FromDate, DateTime? ToDate)
		{
			GetPayment getPayment = new GetPayment()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				PaymentId = PaymentId,
				FranchiseId = FranchiseId,
				FromDate = FromDate,
				ToDate = ToDate
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetPaymentDetails]", getPayment);
			return Json(response);
		}


		[HttpGet]
		[Route("PaymentGetContactNameDetails")]
		public IActionResult PaymentGetContactNameDetails(int FranchiseId, int PaymentTypeId, int PaymentCategory)
		{
			PaymentGetContactNameDetails getPaymentContact = new PaymentGetContactNameDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				FranchiseId = FranchiseId,
				PaymentTypeId = PaymentTypeId,
				PaymentCategory = PaymentCategory,
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetContactNameDetails]", getPaymentContact);
			return Json(response);
		}

		[HttpGet]
		[Route("GetPaymentBillNo")]
		public IActionResult GetPaymentBillNo(int FranchiseId, int PaymentTypeId, int ContactId)
		{
			GetPaymentBillNo getPaymentBillNo = new GetPaymentBillNo()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				FranchiseId = FranchiseId,
				PaymentTypeId = PaymentTypeId,
				ContactId = ContactId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetPaymentBillNumberDetails]", getPaymentBillNo);
			return Json(response);
		}

		[HttpGet]
		[Route("GetPaymentBillNoAmount")]
		public IActionResult GetPaymentBillNoAmount(int PaymentTypeId, int ContactId, string BillNumber)
		{
			GetPaymentBillNoAmount getPaymentBillNoAmount = new GetPaymentBillNoAmount()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				PaymentTypeId = PaymentTypeId,
				ContactId = ContactId,
				BillNumber = BillNumber
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DD_GetPaymentBillNoAmountDetails]", getPaymentBillNoAmount);
			return Json(response);
		}


		[HttpGet]
		[Route("GetAutoGenerateNo")]
		public IActionResult GetAutoGenerateNo(int? FranchiseId, string? ModuleName)
		{
			GetAutoGenerateNo getAutoGenerateNo = new GetAutoGenerateNo()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				FranchiseId = FranchiseId,
				ModuleName = ModuleName
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetAutoGenerateNoDetails]", getAutoGenerateNo);
			return Json(response);
		}

		[HttpPost]
		[Route("InsertUpdatePaymentDetails")]
		public async Task<IActionResult> InsertUpdareClientDetails()
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			InsertUpdatePaymentDetails staticDetails = new InsertUpdatePaymentDetails();

			staticDetails = JsonConvert.DeserializeObject<InsertUpdatePaymentDetails>(Request.Form["PaymentDetailsStatic"]);


			IFormFileCollection file = Request.Form.Files;
			List<AttachmentDetails> lstattachment = new List<AttachmentDetails>();
			//List<AttachmentDetails> lstnewattachment = new List<AttachmentDetails>();
			DataTable dtattachment = new DataTable();

			foreach (var item in file)
			{
				var attachment = GetFilePath(item.FileName);
				lstattachment.Add(new AttachmentDetails()
				{
					AttachmentExactFileName = item.FileName,
					AttachmentFileName = attachment.Item1,
					AttachmentFilePath = attachment.Item2,
					ModuleName = "Payment"
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

			List<PaymentBillInfoDetails>? staticData = JsonConvert.DeserializeObject<List<PaymentBillInfoDetails>?>(Request.Form["paymentBillInfoDetails"]);
			DataTable PaymentBillInfoDetails = GenericTetroONE.ToDataTable(staticData);

			var spName = string.Empty;
			if (staticDetails.PaymentId != null && staticDetails.PaymentId != 0)
			{
				spName = "[dbo].[USP_UpdatePaymentDetails]";
			}
			else
			{
				spName = "[dbo].[USP_InsertPaymentDetails]";
			}
			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();

				using (SqlCommand command = new SqlCommand(spName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@PaymentDate", staticDetails.PaymentDate);
					command.Parameters.AddWithValue("@FranchiseId", staticDetails.FranchiseId);
					command.Parameters.AddWithValue("@BillingFranchiseId", staticDetails.BillingFranchiseId);
					command.Parameters.AddWithValue("@PaymentTypeId", staticDetails.PaymentTypeId);
					command.Parameters.AddWithValue("@PaymentCategory", staticDetails.PaymentCategory);
					command.Parameters.AddWithValue("@ContactId", staticDetails.ContactId);
					command.Parameters.AddWithValue("@PaymentNo", staticDetails.PaymentNo);
					command.Parameters.AddWithValue("@Comments", staticDetails.Comments);
					command.Parameters.AddWithValue("@TVP_PaymentBillInfoDetails", PaymentBillInfoDetails);
					command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);

					if (staticDetails.PaymentId > 0)
					{
						command.Parameters.AddWithValue("@PaymentId", staticDetails.PaymentId);
					}

					command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					await command.ExecuteNonQueryAsync();

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

		public class DeletePayment { public int LoginUserId { get; set; } public int? PaymentId { get; set; } }

		[HttpGet]
		[Route("DeletePayment")]
		public IActionResult deletePayment(int? PaymentId)
		{
			DeletePayment getPayment = new DeletePayment()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				PaymentId = PaymentId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeletePaymentDetails]", getPayment);
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
