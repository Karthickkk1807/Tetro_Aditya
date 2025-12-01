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
        public int? PlantStateId { get; set; }
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
    }

    public class InsertUpdateMasterInfo
    {
        public int LoginUserId { get; set; }
        public int? MasterInfoId { get; set; }
        public string ModuleName { get; set; }
        public string MasterInfoName { get; set; }
        public string? MasterInfoDescription { get; set; }
    }
      
}
