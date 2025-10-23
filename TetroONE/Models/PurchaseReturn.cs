using System.Data;

namespace TetroONE.Models
{
    public class GetPurchaseReturn
    {
        public int LoginUserId { get; set; }
        public int? PurchaseReturnId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int FranchiseId { get; set; }
    }

    public class DeletePurchaseReturn
    {
        public int LoginUserId { get; set; }
        public int? PurchaseReturnId { get; set; }
       

    }

    public class GetPurchaseReturnByPurchaseBillId
    {
        public int LoginUserId { get; set; }
        public int PurchaseBillId { get; set; }
    }
        
    public class PurchaseReturnDetailsStatic
    {
        public int? PurchaseReturnId { get; set; }
        public int VendorId { get; set; }
        public int? ShipToId { get; set; }
        public int? FranchiseId{ get; set; }
        public int BillFromFranchiseId { get; set; }
        public string? PurchaseReturnNo { get; set; }
        public DateTime PurchaseReturnDate { get; set; }
        public int? PurchaseBillId { get; set; }

        public DateTime PurchaseBillDate { get; set; }
        public string? OriginalInvoiceNo { get; set; }
        public int? ReturnReasonId { get; set; }
        public int? ReturnTypeId { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GrantTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public int PurchaseReturnStatusId { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }  
       

    }

    public class PurchaseReturnProductMappingDetails
    {
        public int? PurchaseProductMappingId { get; set; }
        public int ProductId { get; set; }

        public decimal PurchasePrice { get; set; }
        public decimal Quantity { get; set; }
        public int UnitId { get; set; }
        
        public string? ProductDescription { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? CGST_Percentage { get; set; }
        public decimal? CGST_Value { get; set; }
        public decimal? SGST_Percentage { get; set; }
        public decimal? SGST_Value { get; set; }
        public decimal? IGST_Percentage { get; set; }
        public decimal? IGST_Value { get; set; }
        public decimal? CESS_Percentage { get; set; }
        public decimal? CESS_Value { get; set; }
        public decimal TotalAmount { get; set; }
        public int? ModuleId { get; set; }
    }

    public class PurchaseReturnOtherChargesMappingDetails
    {
        public int? PurchaseSaleOtherChargesMappingId { get; set; }
        public int? OtherChargesId { get; set; }
        public string? OtherChargesType { get; set; }
        public bool IsPercentage { get; set; }
        public decimal Value { get; set; }
        public decimal OtherChargeValue { get; set; }
        public int? ModuleId { get; set; }
    }
    //public class PurchaseReturnModeOfPaymentMappingDetails
    //{
    //    public int? PurchaseReturnModeOfPaymentMappingId { get; set; }
    //    public int? PurchaseReturnId { get; set; }
    //    public int ModeOfPaymentId { get; set; }
    //    public decimal MOPAmount { get; set; }
    //}

    public class InsertPurchaseReturnDetails
    {
        public int LoginUserId { get; set; }
        public int? PurchaseReturnId { get; set; }
        public int VendorId { get; set; }
        public int? ShipToId { get; set; }
        public int? FranchiseId { get; set; }
        public int BillFromFranchiseId { get; set; }
        
        public string? PurchaseReturnNo { get; set; }
        public DateTime PurchaseReturnDate { get; set; }
        public int? PurchaseBillId { get; set; }

        public DateTime PurchaseBillDate { get; set; }
        public string? OriginalInvoiceNo { get; set; }
        public int? ReturnReasonId { get; set; }
        public int? ReturnTypeId { get; set; }
        public decimal SubTotal { get; set; }   
        public decimal GrantTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public int PurchaseReturnStatusId { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public DataTable? TVP_Purchase_ProductMappingDetails { get; set; }
        public DataTable? TVP_PurchaseSaleOtherChargesMappingDetails { get; set; }
       
        public DataTable? TVP_AttachmentDetails { get; set; }
    }
    public class PurchaseReturnPrint
    {
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyCity { get; set; }
        public string? CompanyCountry { get; set; }
        public string? CompanyGSTNumber { get; set; }
        public string? CompanyContactNumber { get; set; }
        public string? CompanyEmail { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? PurchaseReturnNumber { get; set; }
        public string? PurchaseReturnDate { get; set; }
        public string? PurchaseBillDate { get; set; }
        public string? OriginalInvoiceNumber { get; set; }
        public string? VendorName { get; set; }
        public string? VendorAddress { get; set; }
        public string? VendorCity { get; set; }
        public string? VendorZipCode { get; set; }
        public string? VendorState { get; set; }
        public string? VendorCountry { get; set; }
        public string? VendorContact { get; set; }
        public string? VendorGSTNumber { get; set; }
        public string? VendorContactPersonName { get; set; }
        public string? AccountName { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? AccountNumber { get; set; }
        public string? AccountType { get; set; }
        public string? IFSCCode { get; set; }
        public string? UPIId { get; set; }

        public string? AltName { get; set; }
        public string? AltAddress { get; set; }
        public string? AltCity { get; set; }
        public string? AltContactNumber { get; set; }
        public string? StateName { get; set; }

        public string? TotalProduct { get; set; }
        public string? TotalDiscount { get; set; }
        public string? CGST { get; set; }
        public string? SGST { get; set; }
        public string? SubTotal { get; set; }

        public string? RoundOffValue { get; set; }
        public string? GrantTotal { get; set; }

        public string? Amount_InWords { get; set; }

        public string? Notes { get; set; }
        public string? TermsandConditions { get; set; }
        public string? BackroundColour { get; set; }
        public string? TextColour { get; set; }
        public string? Signature { get; set; }
        public DataTable ProductItemTable { get; set; }
        public DataTable OtherChargesTable { get; set; }
        public DataTable OtherChargesTaxTable { get; set; }
        public DataTable ProductItemTableNew { get; set; }

    }
}
