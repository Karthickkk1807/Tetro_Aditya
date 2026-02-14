using System.Data;

namespace TetroONE.Models
{
    public class GetProduct_PurchaseSale
    {
        public int LoginUserId { get; set; }
        public int? ProductId { get; set; }
        public string ModuleName { get; set; }
        public int? VendorId { get; set; }
        public int PlantId { get; set; } 
    }
    public class ProductModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductTypeName { get; set; }
        public decimal? PrimaryPrice { get; set; }
        public decimal? SecondaryPrice { get; set; }
        public string PrimaryUnitName { get; set; }
        public string SecondaryUnitName { get; set; }
        public decimal? StockInHand { get; set; }
        public string StockInHand_Colour { get; set; }
        // Add any other fields needed
    }

    public class GetPurchaseOrder
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; } 
    }

    public class DeletePurchaseOrder
    {
        public int LoginUserId { get; set; }
        public int? PurchaseOrderId { get; set; }

    }

    public class PurchaseOrderOtherchargesType
    {
        public int LoginuserId { get; set; }
        public string OtherChargesType { get; set; }

    }

    public class ShippingAddressDDRequest
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; } = "Purchase";
        public int ModuleId { get; set; }
    }


    public class AttachmentDetails
    {
        public int? AttachmentId { get; set; }
        public string ModuleName { get; set; }
        public int? ModuleRefId { get; set; }
        public string AttachmentFileName { get; set; }
        public string AttachmentFilePath { get; set; }
        public string AttachmentExactFileName { get; set; }

    }

    public class PurchaseDetailsStatic
    {
        public int? PurchaseOrderId { get; set; }
        public int VendorId { get; set; }
        public int BillFromPlantId { get; set; }
        public int ShipToPlantId { get; set; }
        public int PlantId { get; set; }
        public string? PurchaseOrderNo { get; set; }
        public DateTime PurchaseOrderDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public decimal GrantTotal { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public int PurchaseOrderStatusId { get; set; } 
    }

    public class PurchaseOrderProductMappingDetails
    {
        public int? PurchaseOrderProductMappingId { get; set; }
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
    
    public class InsertPurchaseOrderDetails
    {
        public int LoginUserId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int VendorId { get; set; }
        public int BillFromPlantId { get; set; }
        public int ShipToPlantId { get; set; }
        public int PlantId { get; set; }
        public string? PurchaseOrderNo { get; set; }
        public DateTime PurchaseOrderDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public decimal GrantTotal { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public int PurchaseOrderStatusId { get; set; } 
        public DataTable TVP_Purchase_ProductMappingDetails { get; set; }  
        public DataTable TVP_AttachmentDetails { get; set; }
    }

    public class PurchaseOrderPrint
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

        public string? PONo { get; set; }
        public string? PODate { get; set; }
        public string? ExpDeliveryDate { get; set; }
         
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

    public class UpdateBankInfo
    {
        public int LoginUserId { get; set; }
        public int? ModuleId { get; set; }
        public string? ModuleName { get; set; }
        public string? AccountName { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? AccountNumber { get; set; }
        public string? AccountType { get; set; }
        public string? IFSCCode { get; set; }
        public string? UPIId { get; set; }
    }

    public class UpdateVendorDetail
    {
        public int LoginUserId { get; set; }
        public int VendorId { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Zipcode { get; set; }
        public int? StateId { get; set; }
        public string? ContactNumber { get; set; }
        public string? Country { get; set; }
        public string? Email { get; set; }
        public string? GSTNumber { get; set; }

    }

    public class GetPurchaseReturn_ProposalReturn_ReturnNo
    {
        public int LoginUserId { get; set; }
        public int FranchiseId { get; set; }
        public int ModuleId { get; set; }
        public int? BillTo { get; set; }
        public int? PurchaseRequestNo { get; set; }
        public int? ProposalRequestNo { get; set; }
    }

}
