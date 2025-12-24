using System.Data;
namespace TetroONE.Models
{
    public class GetPurchaseBill
    {
        public int LoginUserId { get; set; }
        public int? PurchaseBillId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int PlantId { get; set; } 
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
        public int? OtherChargesId { get; set; }
        public string OtherChargesType { get; set; } 
    }
    
    public class GetPurchaseOrderNoDetails_ByVendorPlant
    {
        public int LoginuserId { get; set; }
        public int? VendorId { get; set; }
        public int? PlantId { get; set; } 
    }
    
    public class DD_GetPurchaseOrderNo
    {
        public int LoginuserId { get; set; }
        public int? ModuleId { get; set; }
        public string? ModuleName { get; set; } 
    }

    public class PurchaseBillDetailsStatic
    {
        public int LoginUserId { get; set; }
        public int? PurchaseBillId { get; set; }
        public int? VendorId { get; set; }
        public int BillFromPlantId { get; set; }
        public int? PlantId { get; set; }
        public int? ShipToPlantId { get; set; }
        public string? PurchaseBillNo { get; set; }
        public DateTime? PurchaseBillDate { get; set; }
        public int? PurchaseOrderId { get; set; }
        public string? OriginalInvoiceNo { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? RoundOffValue { get; set; }
        public decimal? GrantTotal { get; set; }
        public decimal? BalanceAmount { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public int PurchaseBillStatusId { get; set; }
    }

    public class PurchaseBillProductMappingDetails
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

    public class PurchaseBillOtherChargesMappingDetails
    {
        public int? PurchaseSaleOtherChargesMappingId { get; set; } 
        public int? OtherChargesId { get; set; }
        public string? OtherChargesType { get; set; }
        public bool? IsPercentage { get; set; }
        public decimal? Value { get; set; }
        public decimal? OtherChargeValue { get; set; }
        public int? ModuleId { get; set; }
    }
     
    public class InsertUpdatePurchaseBill
    {
        public int LoginUserId { get; set; }
        public int? PurchaseBillId { get; set; }
        public int? VendorId { get; set; }
        public int BillFromPlantId { get; set; }
        public int? PlantId { get; set; }
        public int? ShipToPlantId { get; set; }
        public string? PurchaseBillNo { get; set; }
        public DateTime? PurchaseBillDate { get; set; }
        public int? PurchaseOrderId { get; set; } 
        public string? OriginalInvoiceNo { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? RoundOffValue { get; set; }
        public decimal? GrantTotal { get; set; }
        public decimal? BalanceAmount { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public int PurchaseBillStatusId { get; set; }
        public DataTable TVP_Purchase_ProductMappingDetails { get; set; }
        public DataTable TVP_PurchaseSaleOtherChargesMappingDetails  { get; set; } 
        public DataTable TVP_AttachmentDetails { get; set; }
    }
     
    public class PurchaseBillPrint
    {
        public string? CompanyName { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Phone { get; set; }
        public string? PFCodeNo { get; set; }
        public string? ESICodeNo { get; set; }
        public string? Email { get; set; }
        public string? GSTin { get; set; }
        public string? MSMERegistrationNo { get; set; }

        public string? ToName { get; set; }
        public string? ToAddress1 { get; set; }
        public string? ToAddress2 { get; set; }
        public string? GST { get; set; }
         
        public string? PINo { get; set; }
        public string? PIDate { get; set; }
        public string? PONo { get; set; }
        public string? VendorBillNo { get; set; }
         
        public string? IGSTPer { get; set; }
        public string? CGSTPer { get; set; }
        public string? SGSTPer { get; set; }
        public string? IGSTValue { get; set; }
        public string? CGSTValue { get; set; }
        public string? SGSTValue { get; set; }

        public string? TermsConditions { get; set; }
        public string? RoundOff { get; set; }
        public string? NetAmount { get; set; }

        public string? RupeesInWords { get; set; } 
        public DataTable ProductItemData { get; set; }

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
