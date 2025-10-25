using System.Data;

namespace TetroONE.Models
{
    public class GetVendor
    {
        public int LoginUserId { get; set; }
        public int? VendorId { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class InsertUpdareVendorDetails
    {
        public int LoginUserId { get; set; }
        public int? VendorId { get; set; }
        public string VendorName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public int StateId { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string ContactNumber { get; set; }
        public string? Email { get; set; }
        public string? GSTNumber { get; set; }
        public string? Remark { get; set; }
        public string? IFSCCode { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? AccountType { get; set; }
        public string? AccountName { get; set; }
        public string? AccountNumber { get; set; }
        public bool? IsActive { get; set; }
        public decimal? MaxCreditLimit { get; set; }
        public decimal? CurrentCreditLimit { get; set; }
        public List<ContactPersonDetails> contactPersonDetails { get; set; }
        public DataTable TVP_ContactPersonDetails { get; set; }
        public List<FranchiseMappingDetails> franchiseMappingDetails { get; set; }
        public DataTable TVP_ContactFranchiseMappingDetails { get; set; }
        public List<VendorProductMappingDetails> vendorProductMappingDetails { get; set; }
        public DataTable TVP_VendorProductMappingDetails { get; set; }
    }

    public class FranchiseMappingDetails
    {
        public int? ContactFranchiseMappingId { get; set; }
        public int? ContactId { get; set; }
        public int? FranchiseId { get; set; }
        public bool IsSelected { get; set; }
    }

    public class ContactPersonDetails
    {
        public int? ContactPersonId { get; set; }
        public string? Salutation { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactNumber { get; set; }
        public string? Email { get; set; }
        public bool IsPrimary { get; set; }
        public int? ContactId { get; set; }
    }

    public class VendorProductMappingDetails
    {
        public int? VendorProductMappingId { get; set; }
        public int? VendorId { get; set; }
        public int? ProductId { get; set; }
    }


    public class GetClient
    {
        public int LoginUserId { get; set; }
        public int? ClientId { get; set; }

        public int? ClientTypeId { get; set; }
    }

    public class DeleteClient
    {
        public int LoginUserId { get; set; }
        public int? ClientId { get; set; }

    }

    public class InsertUpdareClientDetails
    {
        public int LoginUserId { get; set; }
        public int? ClientId { get; set; }
        public int ClientTypeId { get; set; }
        public string? ClientNo { get; set; }
        public string ClientName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public int? StateId { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string ContactNumber { get; set; }
        public string? Email { get; set; }
        public string? GSTNumber { get; set; }
        public decimal CreditLimit { get; set; }
        public decimal? CurrentCreditLimit { get; set; }
        public string? Remark { get; set; }
        public DateTime? CollaboratedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? InvoiceAmount { get; set; }
        public decimal? NoOfCrates { get; set; }
        public decimal? PerCrateCost { get; set; }
        public int? CurrentEligibility { get; set; }

        public bool? IsActive { get; set; }
        public List<ContactPersonDetails> ClientContactPersonDetails { get; set; }
        public List<ClientProductMappingDetails> clientProductMappingDetails { get; set; }
        public DataTable TVP_ContactPersonDetails { get; set; }
        public List<FranchiseMappingDetails> franchiseMappingDetails { get; set; }
        public DataTable TVP_ContactFranchiseMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
    
    }

 

    public class ClientProductMappingDetails
    {
        public int? ClientProductMappingId { get; set; }
        public int? ClientId { get; set; }
        public int? ProductId { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? UnitId { get; set; }
    }

    public class AttachmentTableDyanamicClient
    {
        public int? VisicoolarAttachmentId { get; set; }
        public string? AttachmentExactFileName { get; set; }
        public string? Visi_AttachmentFileName { get; set; }
        public string? Visi_AttachmentFilePath { get; set; }
        public int? DistributorVisicoolarId { get; set; }
        public int? RowNumber { get; set; }
        public int? ClientId { get; set; }
    }

    public class GetFranchise
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class InsertUpdateFranchise
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public string? FranchiseName { get; set; }
        public string? FranchiseAddress { get; set; }
        public string? FranchiseCity { get; set; }
        public int? FranchiseStateId { get; set; }
        public string? FranchiseZipCode { get; set; }
        public string? FranchiseContactNo { get; set; }
        public string? FranchiseEmail { get; set; }
        public string? FranchiseWebsite { get; set; }
        public string? FranchiseGSTNumber { get; set; }
        public string? FranchiseCountry { get; set; }
        public string? Remarks { get; set; }
        public DateTime? CollaboratedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? AccountType { get; set; }
        public string? AccountName { get; set; }
        public string? AccountNumber { get; set; }
        public string? IFSCCode { get; set; }
        public string? UPIId { get; set; }
        public bool? IsActive { get; set; }
        public string Signature { get; set; }
        public string SignatureExistingImage { get; set; }
        public List<ContactPersonDetails> FranchiseContactPersonDetails { get; set; }
        public DataTable TVP_ContactPersonDetails { get; set; }

    }

    public class GetShop
    {
        public int LoginUserId { get; set; }
        public int? ShopId { get; set; }
        public int? DistributorId { get; set; }
    }

    public class InsertUpdateShop
    {
        public int LoginUserId { get; set; }
        public int? ShopId { get; set; }
        public int? ShopTypeId { get; set; }
        public string? ShopName { get; set; }
        public string? ShopAddress { get; set; }
        public string? ShopCity { get; set; }
        public int? ShopStateId { get; set; }
        public string? ShopCountry { get; set; }
        public string? ShopZipcode { get; set; }
        public string? ShopContactNo { get; set; }
        public string? ShopEmail { get; set; }
        public string? ShopGSTNumber { get; set; }
        public decimal? MaxCreditLimit { get; set; }
        public decimal? CurrentCreditLimit { get; set; }
        public string? Remarks { get; set; }
        public bool? IsActive { get; set; }
        public int? Visicooler { get; set; }
        public int? DistributorId { get; set; }
        public List<ContactPersonDetails> ShopContactPersonDetails { get; set; }
        public DataTable TVP_ContactPersonDetails { get; set; }
    }



    public class GetServiceEngr
    {
        public int LoginUserId { get; set; }
        public int? BranchId { get; set; }
        public int? ServiceEngrId { get; set; }
    }

    public class InsertUpdateServiceEngr
    {
        public int LoginUserId { get; set; }
        public int? ServiceEngrId { get; set; }
        public string? ServiceEngrNo { get; set; }
        public int? ServiceEngrTypeId { get; set; }
        public string? ServiceEngrName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? ContactNumber { get; set; }
        public string? WhatsappNo { get; set; }
        public string? Email { get; set; }
        public string? GSTNumber { get; set; }
        public string? Remarks { get; set; }
        public bool? IsActive { get; set; }
        public decimal? CurrentCreditLimit { get; set; }
        public List<ContactPersonDetails> ContactPersonDetails { get; set; }
        public DataTable TVP_ContactPersonDetails { get; set; }
        
        public DataTable TVP_ContactBranchMappingDetails { get; set; }
    }

}