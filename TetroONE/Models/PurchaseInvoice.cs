using System.Data;
namespace TetroONE.Models
{
    public class GetPurchaseBill
    {
        public int LoginUserId { get; set; }

        public int? PurchaseBillId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int FranchiseId { get; set; }

    }

    public class DelPurchaseBill
    {
        public int LoginUserId { get; set; }

        public int? PurchaseBillId { get; set; }
        

    }
    public class GetProductQC
    {
        public int? ProductQCMappingId { get; set; }
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? QCName { get; set; }
        public decimal? Value { get; set; }
    }
    public class ProductFilter
    {
        public int ProductId { get; set; }
    }
    public class GetPurchaseOrderDetails
    {
        public int LoginUserId { get; set; }

        public int? PurchaseId { get; set; }
        public string ModuleName { get; set; }

        public int FranchiseId { get; set; }
    }
    public class PODetailsRequest
    {
        public int LoginUserId { get; set; }
        public int VendorId { get; set; }
    }
    public class PurchaseBillOtherchargesType
    {
        public int LoginuserId { get; set; }
        public string OtherChargesType { get; set; }
        
    }

    public class PurchaseBillDetailsStatic
    {
        public int? PurchaseBillId { get; set; }
        public int VendorId { get; set; }

        public int? FranchiseId { get; set; }
        public int? ShipToFranchiseId { get; set; }
        public int? BillFromFranchiseId { get; set; }
        public string PurchaseBillNo { get; set; }
        public DateTime PurchaseBillDate { get; set; }  
        public int? PurchaseOrderId { get; set; }
       
        public string OriginalInvoiceNo { get; set; }
       
        
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GrantTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public decimal BalanceAmount { get; set; }
        public int? PurchaseBillStatusId { get; set; }
        
       
    }

    public class PurchaseBillProductMappingDetails
    {
        public int? PurchaseBillProductMappingId { get; set; }
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
        public int? PurchaseBillId { get; set; }

    }

    public class PurchaseBillOtherChargesMappingDetails
    {
        public int? PurchaseSaleOtherChargesMappingId { get; set; }
        public int OtherChargesId { get; set; }
        public string OtherChargesType { get; set; }
        public bool IsPercentage { get; set; }
        public decimal Value { get; set; }
        public decimal OtherChargeValue { get; set; }
        public int ModuleId { get; set; }
    }

    public class PurchaseBillProductQCDetails
    {
        public int? PurchaseBillQCMappingId { get; set; }
        public int ProductId { get; set; }
        public int ProductQCMappingId { get; set; }
        public decimal? Value { get; set; }
        public int? PurchaseBillId { get; set; }

    }
    public class InsertUpdatePurchaseBill
    {
        public int LoginUserId { get; set; }
        public int? PurchaseBillId { get; set; }
        public int? FranchiseId { get; set; }
        public int VendorId { get; set; }
        public int? ShipToFranchiseId { get; set; }
        public int? BillFromFranchiseId { get; set; }
        public string PurchaseBillNo { get; set; }
        public DateTime PurchaseBillDate { get; set; }
        public int? PurchaseOrderId { get; set; }
        
        public string OriginalInvoiceNo { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GrantTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public int? PurchaseBillStatusId { get; set; }
        public decimal BalanceAmount { get; set; }
        public DataTable TVP_Purchase_ProductMappingDetails { get; set; }
        public DataTable TVP_PurchaseSaleOtherChargesMappingDetails  { get; set; }

        public DataTable TVP_PurchaseBillQCMappingDetails { get; set; }

        public DataTable TVP_AttachmentDetails { get; set; }
    }


    public class PurchaseBillPrint
    {
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyCity { get; set; }
        public string? CompanyCountry { get; set; }
        public string? CompanyGSTNumber { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? CompanyEmail { get; set; }
        public string? CompanyContactNumber { get; set; }

        public string? AccountName { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? AccountNumber { get; set; }
        public string? IFSCCode { get; set; }
        public string? UPIId { get; set; }

        public string? PurchaseBillNumber { get; set; }
        public string? PurchaseBillDate { get; set; }
        public string? OriginalInvoiceNumber { get; set; }
        public string? PurchaseOrderNumber { get; set; }


        public string? VendorName { get; set; }
        public string? VendorAddress { get; set; }
        public string? VendorCity { get; set; }
        public string? VendorZipCode { get; set; }
        public string? VendorState { get; set; }
        public string? VendorCountry { get; set; }
        public string? VendorContact { get; set; }
        public string? VendorGSTNumber { get; set; }

        public string? AltName { get; set; }
        public string? AltAddress { get; set; }
        public string? AltCity { get; set; }
        public string? StateName { get; set; }
        public string? AltContactNumber { get; set; }

        public string? TotalProduct { get; set; }
        public string? TotalDiscount { get; set; }
        public string? CGST { get; set; }
        public string? SGST { get; set; }
        public string? SubTotal { get; set; }

        public string? RoundOffValue { get; set; }
        public string? GrantTotal { get; set; }

        public string? Amount_InWords { get; set; }

        public string? TaxableAmount { get; set; }
        public string? TermsandConditions { get; set; }
        public string? Notes { get; set; }
        public string? BackroundColour { get; set; }
        public string? TextColour { get; set; }
        public string? Signature { get; set; }
        public DataTable ProductItemTable { get; set; }
        public DataTable OtherChargesTable { get; set; }
        public DataTable OtherChargesTaxTable { get; set; }
        public DataTable ProductItemTableNew { get; set; }

    }

    public class ShippingAddressForStoreId
    {
        public int LoginUserId { get; set; }
       
    }

    public class InventoryNumberDetailsByVendorId
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int? ModuleId { get; set; }
        public int VendorId { get; set; }
        public int ShipToFranchiseId { get; set; }
        
    }

    public class ShippingAddressForWareHouseId
    {
        public int LoginUserId { get; set; }
        public int? WareHouseId { get; set; }
    }

    public class UpdateWareHouseInfoDetails
    {
        public int LoginUserId { get; set; }
       
        public string? StoreName { get; set; }
        public string? StoreAddress { get; set; }
        public string? StoreCity { get; set; }
        public int? StateCodeId { get; set; }
        public string? StoreZipCode { get; set; }
        public string? StoreContactNumber { get; set; }

    }
}
