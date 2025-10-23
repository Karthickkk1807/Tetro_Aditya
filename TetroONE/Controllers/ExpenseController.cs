using DocumentFormat.OpenXml.VariantTypes;
using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Security.Claims;

namespace TetroONE.Controllers
{
	[Authorize]
	[Route("Expense")]
	public class ExpenseController : BaseController
	{
		public ExpenseController(IConfiguration configuration) : base(configuration)
		{

		}
		public IActionResult Expense()
		{
			return View();
		}

		[HttpGet]
		[Route("GetExpense")]
		public IActionResult GetExpense(DateTime FromDate, DateTime ToDate, int FranchiseId)
		{
			GetExpense request = new GetExpense()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ExpenseDate = null,
				FromDate = FromDate,
				ToDate = ToDate,
				FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetExpenseDetails]", request);
			return Json(response);
		}



		[HttpPost]
		[Route("InsertUpdateExpenseDetails")]
		public async Task<IActionResult> InsertUpdateExpenseDetails()
		{
			IFormFileCollection file = Request.Form.Files;
			List<AttachmentTable> lstattachment = new List<AttachmentTable>();
			DataTable dtattachment = new DataTable();

			foreach (var item in file)
			{
				var attachment = GetFilePath(item.FileName);
				lstattachment.Add(new AttachmentTable()
				{
					AttachmentExactFileName = item.FileName,
					AttachmentFileName = attachment.Item1,
					AttachmentFilePath = attachment.Item2,
					ModuleRefId = null,
					ModuleName = "Expense"
				});
			}

			bool isuploaded = await IsClaimAttachmentUploaded(file, lstattachment);

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

			ExpenseDetailsStatic ExpenseDetailsStatic = JsonConvert.DeserializeObject<ExpenseDetailsStatic>(Request.Form["ExpenseDetailsStatic"]);
			List<ExpenseTypeMappingDetails>? ExpenseTypeMappingDetails = JsonConvert.DeserializeObject<List<ExpenseTypeMappingDetails>?>(Request.Form["ExpenseTypeMappingDetails"]);

			DataTable dtExpenseData = new DataTable();
			dtExpenseData = GenericTetroONE.ToDataTable(ExpenseTypeMappingDetails);

			InsertUpdateExpenseDetails request = new InsertUpdateExpenseDetails()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ExpenseId = ExpenseDetailsStatic.ExpenseId,
				FranchiseId = ExpenseDetailsStatic.FranchiseId,
				BillingFranchiseId = ExpenseDetailsStatic.BillingFranchiseId,
				ExpenseNo = ExpenseDetailsStatic.ExpenseNo,
				ExpenseDate = ExpenseDetailsStatic.ExpenseDate,

				TVP_ExpenseTypeMappingDetails = dtExpenseData,
				TVP_AttachmentDetails = dtattachment
			};

			if (ExpenseDetailsStatic.ExpenseId > 0)
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateExpenseDetails]", request);
			else
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertExpenseDetails]", request, "ExpenseId");

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


		[HttpGet]
		[Route("NotNullGetExpense")]
		public IActionResult NotNullGetExpense(DateTime ExpenseDate)
		{
			GetExpense getInfo = new GetExpense()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ExpenseDate = ExpenseDate,
				FromDate = null,
				ToDate = null,
				FranchiseId = null
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetExpenseDetails]", getInfo);
			return Json(response);
		}

		[HttpGet]
		[Route("DeleteExpense")]
		public IActionResult DeleteExpense(int ExpenseId, int FranchiseId)
		{
			DeleteExpense getInfo = new DeleteExpense()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value),
				ExpenseId = ExpenseId,
                FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteExpenseDetails]", getInfo);

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


		private (string, string) GetFilePath(string reqfilename)
		{
			string guid = Guid.NewGuid().ToString();

			string relativePath = Path.Combine("TetroOne");
			string fileName = guid + "@@" + reqfilename;
			string relativeFilePath = "..\\" + relativePath + "\\" + fileName;
			relativeFilePath = relativeFilePath.Replace("\\", "/");
			return (fileName, relativeFilePath);
		}

		private async Task<bool> IsClaimAttachmentUploaded(IFormFileCollection file, List<AttachmentTable> lstattachment)
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

	}
}
