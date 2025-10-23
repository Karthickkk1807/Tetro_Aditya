using TetroONE.Models;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Security.Claims;
using TetroPos.Models;

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

		[Route("Franchise")]
		public IActionResult Franchise()
		{
			return View();
		}

		//===============================================================================================Vendor==========================================================================================================
		[HttpGet]
		[Route("GetVendor")]
		public IActionResult GetVendor(int FranchiseId)
		{
			GetVendor getVendor = new GetVendor()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				VendorId = null,
				FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetVendorDetails]", getVendor);
			return Json(response);
		}

		[HttpGet]
		[Route("GetVendorID")]
		public IActionResult GetVendorID(int VendorId, int FranchiseId)
		{
			GetVendor getVendor = new GetVendor()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				VendorId = VendorId,
				FranchiseId = FranchiseId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetVendorDetails]", getVendor);
			return Json(response);
		}

		[HttpPost]
		[Route("InsertUpdareVendorDetails")]
		public IActionResult InsertUpdareVendorDetails([FromBody] InsertUpdareVendorDetails request)
		{
			DataTable VendorContactData = new DataTable();
			VendorContactData = GenericTetroONE.ToDataTable(request.contactPersonDetails);

			DataTable ProductMappingDetails = new DataTable();
			ProductMappingDetails = GenericTetroONE.ToDataTable(request.vendorProductMappingDetails);

			DataTable FranchiseMappingDetails = new DataTable();
			FranchiseMappingDetails = GenericTetroONE.ToDataTable(request.franchiseMappingDetails);

			request.LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
			request.TVP_ContactPersonDetails = VendorContactData;
			request.TVP_VendorProductMappingDetails = ProductMappingDetails;
			request.TVP_ContactFranchiseMappingDetails = FranchiseMappingDetails;

			if (request.VendorId != null && request.VendorId != 0)
			{
				string[] Exclude = { "contactPersonDetails", "vendorProductMappingDetails", "franchiseMappingDetails" };
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_UpdateVendorDetails]", request, Exclude);
			}
			else
			{
				string[] Exclude = { "contactPersonDetails", "vendorProductMappingDetails", "franchiseMappingDetails", "VendorId", "IsActive" };
				response = GenericTetroONE.Execute(_connectionString, "[dbo].[USP_InsertVendorDetails]", request, Exclude);
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


		//===============================================================================================Client==========================================================================================================

		[HttpGet]
		[Route("GetClient")]
		public IActionResult GetClient(int FranchiseId ,int ClientTypeId)
		{
			GetClient getClient = new GetClient()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				ClientId = null,
				FranchiseId = FranchiseId,
                ClientTypeId = ClientTypeId
            };

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetClientDetails]", getClient);
			return Json(response);
		}

		[HttpGet]
		[Route("GetClientID")]
		public IActionResult GetClientID(int ClientId, int FranchiseId)
		{
			GetClient getClient = new GetClient()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				ClientId = ClientId,
				FranchiseId = FranchiseId,
				ClientTypeId = null
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetClientDetails]", getClient);
			return Json(response);
		}

		[HttpPost]
		[Route("InsertUpdareClientDetails")]
		public async Task<IActionResult> InsertUpdareClientDetails()
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			InsertUpdareClientDetails staticDetails = new InsertUpdareClientDetails();

			staticDetails = JsonConvert.DeserializeObject<InsertUpdareClientDetails>(Request.Form["ClientDetailsStatic"]);

            IFormFileCollection file = Request.Form.Files;
            List<AttachmentTable> lstattachment = new List<AttachmentTable>();
            DataTable dtattachment = new DataTable();

            List<AttachmentTableDyanamicClient> DyanamicAttachment = JsonConvert.DeserializeObject<List<AttachmentTableDyanamicClient>?>(Request.Form["VisicoolerDyanamicAttachment"]);

            List<AttachmentTableDyanamicClient> lstattachmentDynamic = new List<AttachmentTableDyanamicClient>();
            DataTable dtattachmentDynamic = new DataTable();

            foreach (var item in file)
            {
                var matchingDocument = DyanamicAttachment.FirstOrDefault(d => d.Visi_AttachmentFileName == item.FileName);
                if (!lstattachmentDynamic.Any(x => x.AttachmentExactFileName == item.FileName)
                        && matchingDocument != null
                        && matchingDocument.Visi_AttachmentFileName == item.FileName)
                {
                    var attachmentName = GetFilePath(item.FileName);
                    lstattachmentDynamic.Add(new AttachmentTableDyanamicClient()
                    {
                        VisicoolarAttachmentId = null,
                        AttachmentExactFileName = item.FileName,
                        Visi_AttachmentFileName = attachmentName.Item1,
                        Visi_AttachmentFilePath = attachmentName.Item2,
                        DistributorVisicoolarId = staticDetails.ClientId,
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
                        ModuleName = "Client"
                    });
                }
            }

            bool isuploadedDynamic = await IsClaimAttachmentUploadedDynamic(file, lstattachmentDynamic);

            foreach (var item in lstattachmentDynamic)
            {
                item.Visi_AttachmentFileName = item.AttachmentExactFileName;
            }
            List<AttachmentTableDyanamicClient> existFilesDyn = JsonConvert.DeserializeObject<List<AttachmentTableDyanamicClient>?>(Request.Form["ExistFilesDyanamicAttachment"]);

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

            List<AttachmentTable> existFiles = JsonConvert.DeserializeObject<List<AttachmentTable>?>(Request.Form["Exist"]);

            if (existFiles != null && existFiles.Count > 0)
            {
                lstattachment.AddRange(existFiles);
            }

            dtattachment = GenericTetroONE.ToDataTable(lstattachment);
            dtattachment = GenericTetroONE.RemoveColumn(dtattachment, "AttachmentExactFileName");


            List<ContactPersonDetails>? staticData = JsonConvert.DeserializeObject<List<ContactPersonDetails>?>(Request.Form["ClientContactPersonDetails"]);
			DataTable ClientContactPersonDetails = GenericTetroONE.ToDataTable(staticData);

			List<FranchiseMappingDetails>? FranchiseData = JsonConvert.DeserializeObject<List<FranchiseMappingDetails>?>(Request.Form["FranchiseStaticData"]);
			DataTable FranchiseStaticData = GenericTetroONE.ToDataTable(FranchiseData);

            List<ClientProductMappingDetails>? ClientProductMappingDetails = JsonConvert.DeserializeObject<List<ClientProductMappingDetails>?>(Request.Form["ClientProductMappingDetails"]);
            DataTable ClientProductStaticDetails = GenericTetroONE.ToDataTable(ClientProductMappingDetails);

            List<DistributorVisicoolarDetails>? DistributorVisicoolarDetails = JsonConvert.DeserializeObject<List<DistributorVisicoolarDetails>?>(Request.Form["DistributorVisicoolarDetails"]);
            DataTable TVPDistributorVisicoolarDetails = GenericTetroONE.ToDataTable(DistributorVisicoolarDetails);

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
					command.Parameters.AddWithValue("@ClientTypeId", staticDetails.ClientTypeId);
                    command.Parameters.AddWithValue("@ClientNo", staticDetails.ClientNo == null?DBNull.Value: staticDetails.ClientNo);

                    command.Parameters.AddWithValue("@ClientName", staticDetails.ClientName);
					command.Parameters.AddWithValue("@Address", staticDetails.Address);
					command.Parameters.AddWithValue("@City", staticDetails.City);
					command.Parameters.AddWithValue("@StateId", staticDetails.StateId);
					command.Parameters.AddWithValue("@Country", staticDetails.Country);
					command.Parameters.AddWithValue("@ZipCode", staticDetails.ZipCode);
					command.Parameters.AddWithValue("@ContactNumber", staticDetails.ContactNumber);
					command.Parameters.AddWithValue("@Email", staticDetails.Email);
					command.Parameters.AddWithValue("@GSTNumber", staticDetails.GSTNumber);
					command.Parameters.AddWithValue("@CreditLimit", staticDetails.CreditLimit);
					command.Parameters.AddWithValue("@CurrentCreditLimit", staticDetails.CurrentCreditLimit);
					command.Parameters.AddWithValue("@Remark", staticDetails.Remark);
					command.Parameters.AddWithValue("@CollaboratedDate", staticDetails.CollaboratedDate ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@ExpiryDate",staticDetails.ExpiryDate?.AddDays(1) ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@InvoiceAmount", staticDetails.InvoiceAmount ?? (object)DBNull.Value);
					command.Parameters.AddWithValue("@NoOfCrates", staticDetails.NoOfCrates ?? (object)DBNull.Value);
					command.Parameters.AddWithValue("@PerCrateCost", staticDetails.PerCrateCost ?? (object)DBNull.Value);
					command.Parameters.AddWithValue("@CurrentEligibility", staticDetails.CurrentEligibility ?? (object)DBNull.Value);

                    //command.Parameters.AddWithValue("@Visi_CollaboratedDate", staticDetails.Visi_CollaboratedDate ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@Visi_ExpiryDate", staticDetails.Visi_ExpiryDate ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@Visi_InvoiceAmount", staticDetails.Visi_InvoiceAmount ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@Visi_NoOfQty", staticDetails.Visi_NoOfQty ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@GivenVisiCooler", staticDetails.GivenVisiCooler ?? (object)DBNull.Value);

                    //command.Parameters.AddWithValue("@GoDown", staticDetails.GoDown ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@Shops", staticDetails.Shops ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@Logistics", staticDetails.Logistics ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@InwardedforRefill", staticDetails.InwardedforRefill ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@Shortage", staticDetails.Shortage ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@TVP_ContactPersonDetails", ClientContactPersonDetails);
					command.Parameters.AddWithValue("@TVP_ClientProductMappingDetails", ClientProductStaticDetails);
					command.Parameters.AddWithValue("@TVP_ContactFranchiseMappingDetails", FranchiseStaticData);
					command.Parameters.AddWithValue("@TVP_AttachmentDetails", dtattachment);
                    command.Parameters.AddWithValue("@TVP_DistributorVisicoolarDetails", TVPDistributorVisicoolarDetails);
                    command.Parameters.AddWithValue("@TVP_VisicoolarAttachmentDetails", dtattachmentDynamic);


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

		[HttpGet]
		[Route("GetShop")]
		public IActionResult GetShop(int? ShopId, int? DistributorId)
		{
			GetShop Get = new GetShop()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				ShopId = ShopId == 0 ? null : ShopId,
                DistributorId = DistributorId
            };

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_GetShopDetails]", Get);
			return Json(response);
		}


		[HttpPost]
		[Route("InsertUpdateShop")]
		public IActionResult InsertUpdateShop([FromBody] InsertUpdateShop request)
		{
			_userId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

			DataTable ShopMappingDetails = new DataTable();
			ShopMappingDetails = GenericTetroONE.ToDataTable(request.ShopContactPersonDetails);

			string storedProcedure = (request.ShopId != null)
				? "[dbo].[USP_UpdateShopDetails]"
				: "[dbo].[USP_InsertShopDetails]";

			using (SqlConnection connection = new SqlConnection(_connectionString))
			{
				connection.Open();

				using (SqlCommand command = new SqlCommand(storedProcedure, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					command.Parameters.AddWithValue("@LoginUserId", _userId);
					command.Parameters.AddWithValue("@ShopTypeId", request.ShopTypeId);
					command.Parameters.AddWithValue("@ShopName", request.ShopName);
					command.Parameters.AddWithValue("@ShopAddress", request.ShopAddress);
					command.Parameters.AddWithValue("@ShopCity", request.ShopCity);
					command.Parameters.AddWithValue("@ShopStateId", request.ShopStateId);
					command.Parameters.AddWithValue("@ShopCountry", request.ShopCountry);
					command.Parameters.AddWithValue("@ShopZipcode", request.ShopZipcode);
					command.Parameters.AddWithValue("@ShopContactNo", request.ShopContactNo);
					command.Parameters.AddWithValue("@ShopEmail", request.ShopEmail);
					command.Parameters.AddWithValue("@ShopGSTNumber", request.ShopGSTNumber);
					command.Parameters.AddWithValue("@MaxCreditLimit", request.MaxCreditLimit);
					command.Parameters.AddWithValue("@CurrentCreditLimit", request.CurrentCreditLimit ?? (object)DBNull.Value);
					command.Parameters.AddWithValue("@Remarks", request.Remarks);
					command.Parameters.AddWithValue("@Visicooler", request.Visicooler ?? (object)DBNull.Value);
					command.Parameters.AddWithValue("@TVP_ContactPersonDetails", ShopMappingDetails);

					if (request.ShopId > 0)
					{
						command.Parameters.AddWithValue("@ShopId", request.ShopId);
						command.Parameters.AddWithValue("@IsActive", request.IsActive);
					}
					else
					{
                        command.Parameters.AddWithValue("@DistributorId", request.DistributorId ?? (object)DBNull.Value);
                    }

						command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
					command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

					command.ExecuteNonQuery();

					response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
					response.Message = Convert.ToString(command.Parameters["@Message"].Value);

				}
				connection.Close();
			}
			return Json(response);
		}

		public class DeletedShop { public int LoginUserId { get; set; } public int? ShopId { get; set; } }
		[HttpGet]
		[Route("DeletedShop")]
		public IActionResult DeletedShop_1(int? ShopId)
		{
			DeletedShop Get = new DeletedShop()
			{
				LoginUserId = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
				ShopId = ShopId == 0 ? null : ShopId
			};

			response = GenericTetroONE.GetData(_connectionString, "[dbo].[USP_DeleteShopDetails]", Get);
			return Json(response);
		}

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
    }
}
