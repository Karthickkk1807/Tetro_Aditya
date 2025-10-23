using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Data;

namespace TetroONE.Models
{
    public class Settings
    {
        public int LoginUserId { get; set; }
        public int CompanyId { get; set; }

    }
    public class UpdateSettings
    {
        public int LoginUserId { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogoFileName { get; set; }
        public string CompanyLogoFilePath { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string GSTNumber { get; set; }
       
        public string ExistingImage { get; set; }
        public string Signature { get; set; }
        public string SignatureExistingImage { get; set; }
    }

    public class GetCompanyAlternativeSetting
    {
        public int LoginUserId { get; set; }
        public int? AlternateCompanyId { get; set; }
    }

    public class InsertAlternativeSetting
    {
        public int LoginUserId { get; set; }
        public int? AlternateCompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? ContactNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? GSTNumber { get; set; }
       
    }




    public class GetBankDetails
    {
        public int LoginUserId { get; set; }
        public int? BankId { get; set; }
    }

    public class InsertBankDetails
    {
        public int LoginUserId { get; set; }
        public int? BankId { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? AccountType { get; set; }
        public string? AccountName { get; set; }
        public string? AccountNumber { get; set; }
        public string? IFSCCode { get; set; }
        public string? UPIId { get; set; }
    }



    public class GetPlantDetails
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
    }

    public class InsertPlantDetails
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public string? PlantName { get; set; }
        public string? PlantAddress { get; set; }
        public string? PlantCity { get; set; }
        public string? PlantState { get; set; }
        public string? PlantZipCode { get; set; }
        public string? PlantContactNo { get; set; }
        public string? PlantEmail { get; set; }
        public string? PlantCountry { get; set; }
        public bool? IsActive { get; set; }
        public List<ContactPersonDetailsPlant> ContactPersonDetailsPlant { get; set; }
        public DataTable TVP_ContactPersonDetails { get; set; }
    }

    public class ContactPersonDetailsPlant
    {
        public int? ContactPersonId { get; set; }   
        public string? Salutation { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactNumber { get; set; }
        public string? Email { get; set; }
        public bool? IsPrimary { get; set; }
        public int? ContactId { get; set; }
    }

    //=============================================================================EndOfSettings============================================================================

    public class GetMasterInfo
    {
        public int LoginUserId { get; set; }
        public int? MasterInfoId { get; set; }
        public string ModuleName { get; set; }
        public int FranchiseId { get; set; }
    }

    public class InsertUpdateMasterInfo
    {
        public int LoginUserId { get; set; }
        public int? MasterInfoId { get; set; }
        public string? MasterInfoDescription { get; set; }
        public string ModuleName { get; set; }
        public string MasterInfoName { get; set; }
        public List<MasterInfoMappingDetails> masterInfoMappingDetails { get; set; }
        public DataTable TVP_MasterInfoMappingDetails { get; set; }
    }

    public class MasterInfoMappingDetails
    {
        public int? MasterInfoId { get; set; }
        public int? ModuleId { get; set; }
        public int? franchiseId { get; set; }
        public bool IsSelected { get; set; }
    }

    public class GetProductionStage
    {
        public int LoginUserId { get; set; }
        public int? ProductionStagesId { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class InsertUpdateProductionStage
    {
        public int LoginUserId { get; set; }
        public int? ProductionStagesId { get; set; }
        public string ProductionStagesName { get; set; }
        public bool IsRGB { get; set; }
        public bool IsPet { get; set; }
        public List<MasterInfoMappingDetails> masterInfoMappingDetails { get; set; }
        public DataTable TVP_MasterInfoMappingDetails { get; set; }
    }

    public class GetCretaria
    {
        public int LoginUserId { get; set; }
        public int? CriteriaId { get; set; }
       
    }
    public class GetProductSubCategory
    {
        public int LoginUserId { get; set; }
        public int? ProductSubCategoryId { get; set; }
       
    }

    public class InsertUpdateCretaria   
    {
        public int LoginUserId { get; set; }
        public int? CriteriaId { get; set; }
        public string CriteriaTypeId { get; set; }
        public string CriteriaName { get; set; }
        public string CriteriaDescription { get; set; }
        public List<MasterInfoMappingDetails> masterInfoMappingDetails { get; set; }
        public DataTable TVP_MasterInfoMappingDetails { get; set; }
    }
    public class InsertUpdateProductSubCategory
    {
        public int LoginUserId { get; set; }
        public int? ProductSubCategoryId { get; set; }
        public int? ProductCategoryId { get; set; }
        public decimal? ProductionCost { get; set; }
        public string ProductSubCategoryName { get; set; }
        public string ProductSubCategoryDescription { get; set; }
    
    }

    public class GetAutoGeneratePrefix
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? AutoGeneratePrefixId { get; set; }
    }

    public class InsertUpdateAutoGeneratePrefix
    {
        public int LoginUserId { get; set; }
        public int? AutoGeneratePrefixId { get; set; }
        public string ModuleType { get; set; }
        public string Prefix { get; set; }
        public string StartingFrom { get; set; }
        public int FranchiseId { get; set; }
    }

	public class GetAttendanceDevice
	{
		public int LoginUserId { get; set; }
		public int? AttendanceMachineId { get; set; }
		public int FranchiseId { get; set; }
	}

	public class GetEmployeeDeviceMapping
    {
		public int LoginUserId { get; set; }
		public int? EmployeeId { get; set; }
	}

	public class InsertAttendanceMachine
	{
		public int LoginUserId { get; set; }
		public int? FranchiseId { get; set; }
		public int? AttendanceMachineId { get; set; }
		public string AttendanceMachineName { get; set; }
		public string SerialNo { get; set; }
		public bool IsActives { get; set; }
		public string MachineDescription { get; set; }
		public List<ManageDeviceMappingDetailsSettings>? deviceMappingDetailsList { get; set; }
		public DataTable TVP_EmployeeDeviceMappingDetails { get; set; }

	}
	public class ManageDeviceMappingDetailsSettings
	{
		public int? EmployeeDeviceMappingId { get; set; }
		public int? EmployeeId { get; set; }
		public int? AttendanceMachineId { get; set; }
		public bool IsBlock { get; set; }
	}
	public class GetOtherCharges
	{
		public int LoginUserId { get; set; }
		public int? OtherChargesId { get; set; }
		public int FranchiseId { get; set; }
	}


	public class InsertUpdateOtherCharges
	{
		public int LoginUserId { get; set; }
		public int? OtherChargesId { get; set; }
		public string OtherChargesType { get; set; }
		public string OtherChargesName { get; set; }
		public decimal Value { get; set; }
		public bool IsPercentage { get; set; }
		public List<MasterInfoMappingDetails> masterInfoMappingDetails { get; set; }
		public DataTable TVP_MasterInfoMappingDetails { get; set; }
	}

    public class GetEmployeeDetails_Franchise
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
    }


}
