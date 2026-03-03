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

    /*=================================================================Color=====================================================================*/

    public class GetColor
    {
        public int LoginUserId { get; set; }
        public int? ColorId { get; set; } 
    }
     
    public class InsertUpdateColorInfo
    {
        public int LoginUserId { get; set; }
        public int? ColorId { get; set; }
        public string ColorName { get; set; }
        public string ColorCode { get; set; }
        public string? PantoneCode { get; set; }
        public string? ColorDescription { get; set; } 
    }

    /*=================================================================Machine=====================================================================*/

    public class GetMachine
    {
        public int LoginUserId { get; set; }
        public int? MachineId { get; set; } 
    }
     
    public class InsertUpdateMachineInfo
    {
        public int LoginUserId { get; set; }
        public int? MachineId { get; set; }
        public string MachineName { get; set; }
        public string MachineDescription { get; set; }
        public decimal? MinCapacity { get; set; }
        public decimal? MaxCapacity { get; set; }  
    }

    /*=================================================================ProductCategory=====================================================================*/

    public class GetProductCategory
    {
        public int LoginUserId { get; set; }
        public int? ProductCategoryId { get; set; } 
    }
     
    public class InsertUpdateProductCategoryInfo
    {
        public int LoginUserId { get; set; }
        public int? ProductCategoryId { get; set; }
        public int? ProductTypeId { get; set; }
        public string ProductCategoryName { get; set; }
        public string? ProductCategoryDescription { get; set; } 
    }

    /*=================================================================ProductSubCategory=====================================================================*/

    public class GetProductSubCategory
    {
        public int LoginUserId { get; set; }
        public int? ProductSubCategoryId { get; set; } 
    }
     
    public class InsertUpdateProductSubCategoryInfo
    {
        public int LoginUserId { get; set; }
        public int? ProductSubCategoryId { get; set; }
        public int? ProductCategoryId { get; set; }
        public string ProductSubCategoryName { get; set; }
        public string? ProductSubCategoryDescription { get; set; } 
        public decimal? Productioncost { get; set; } 
    }


    /*=================================================================AutoGeneratePrefix=====================================================================*/
    public class GetAutoGeneratePrefix
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? AutoGeneratePrefixId { get; set; } 
    }

    public class InsertUpdateAutoGeneratePrefixInfo
    {
        public int LoginUserId { get; set; }
        public int? AutoGeneratePrefixId { get; set; }
        public int? ModuleTypeId { get; set; } 
        public string? Prefix { get; set; }
        public string? StartingFrom { get; set; }
        public int? PlantId { get; set; }
    }

    public class DeleteAutoGeneratePrefixDetails
    {
        public int LoginUserId { get; set; } 
        public int? AutoGeneratePrefixId { get; set; }
    }

    /*=================================================================DefaultProduct=====================================================================*/
    public class GetDefaultProduct
    {
        public int LoginUserId { get; set; }
        public int? DefaultProductId { get; set; }
    }

    public class InsertDefaultProductDetails 
    {
        public int LoginUserId { get; set; }
        public int? DefaultProductId { get; set; }
        public int? ProcessId { get; set; }
        public int? ProductId { get; set; }     
        public int? Unit { get; set; }
        public decimal? BelowGSMValue { get; set; }
        public decimal? AboveGSMValue { get; set; }
        public decimal? LightColorValue { get; set; }
        public decimal? MediumColorValue { get; set; }
        public decimal? DarkColorValue { get; set; }
        public string? Description { get; set; }
    }
    
    public class DeleteDefaultProduct
    {
        public int LoginUserId { get; set; } 
        public int? DefaultProductId { get; set; }
    }

    public class GetOtherCharges
    {
        public int LoginUserId { get; set; }
        public int? OtherChargesId { get; set; }
    }

    public class InsertUpdateOtherCharges
    {
        public int LoginUserId { get; set; }
        public int? OtherChargesId { get; set; }
        public string OtherChargesType { get; set; }
        public string OtherChargesName { get; set; }
        public decimal Value { get; set; }
        public bool IsPercentage { get; set; }
    }
}