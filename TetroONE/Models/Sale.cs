using System.Data;

namespace TetroONE.Models
{
    public class GetSale
    {
        public int LoginUserId { get; set; }
        public int? SaleId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

    }
    public class DeleteSale
    {
        public int LoginUserId { get; set; }
        public int? SaleId { get; set; }

    }

    public class SaleDetailsStatic
    {
        public int? LoginUserId { get; set; }
        public int? SaleId { get; set; }
		public string? SaleNo { get; set; }
		public DateTime? SaleDate { get; set; }
        public int? BillFrom { get; set; }
        public int? ClientId { get; set; }
        public int? InWardId { get; set; }
		public decimal? SubTotal { get; set; }
		public decimal? RoundOffValue { get; set; }
        public decimal? GrantTotal { get; set; }
		public DateTime? DueDate { get; set; }
		public int? SaleStatusId { get; set; }
		public string? Notes { get; set; }
        public int? TaxInfoId { get; set; }
    }

    public class InsertUpdateSale
    {
        public int? LoginUserId { get; set; }
        public int? SaleId { get; set; }
        public string? SaleNo { get; set; }
        public DateTime? SaleDate { get; set; }
        public int? BillFrom { get; set; }
        public int? ClientId { get; set; }
        public int? InWardId { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? RoundOffValue { get; set; }
        public decimal? GrantTotal { get; set; }
        public DateTime? DueDate { get; set; }
        public int? SaleStatusId { get; set; }
        public string? Notes { get; set; }
        public int? TaxInfoId { get; set; }
        public DataTable TVP_SaleOutWardMappingDetails { get; set; }
        public DataTable TVP_SaleOutWardFabricDetails { get; set; }
        public DataTable TVP_PurchaseSaleOtherChargesMappingDetails { get; set; } 
        public DataTable TVP_AttachmentDetails { get; set; }
    }
     
    public class SaleOutWardMappingDetails
    {
        public int? SaleOutWardMappingId { get; set; }
        public int? SaleId { get; set; }
        public int? OutWardId { get; set; }
    }
     
    public class SaleOutWardFabricDetails
    {
        public int? SaleOutWardFabricId { get; set; }
        public int? OutWardId { get; set; }
        public string? InWardNo { get; set; }
        public string? OutWardNo { get; set; }
        public string? ColourProcess { get; set; }
        public int? NoOfRolls { get; set; }
        public decimal? OutWardQty { get; set; }
        public decimal? Rate { get; set; }
        public decimal? Amount { get; set; }
        public int? SaleId { get; set; }
    }
     
    public class PurchaseSaleOtherChargesMappingDetails
    {
        public int? PurchaseSaleOtherChargesMappingId { get; set; }
        public int? OtherChargesId { get; set; }
        public string? OtherChargesType { get; set; }
        public bool? IsPercentage { get; set; }
        public decimal? Value { get; set; }
        public decimal? OtherChargeValue { get; set; }
        public int? ModuleId { get; set; }
    } 

    public class SalePrint
    {
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyCity { get; set; }
        public string? CompanyCountry { get; set; }
        public string? CompanyGSTNumber { get; set; }
        public string? ClientName { get; set; }
        public string? ClientAddress { get; set; }
        public string? ClientCity { get; set; }
        public string? ClientCountry { get; set; }
        public string? ClientGSTNumber { get; set; }
        public string? ClientContactPersonName { get; set; }
        public string? SaleNumber { get; set; }
        public string? SaleDate { get; set; }
        public DataTable? MainTable { get; set; }
        public DataTable? TaxTable { get; set; }
        public DataTable? TotalTable { get; set; }
        public DataTable? TermsTable { get; set; }
        public string? AmountInWords { get; set; }

    }
     
    public class TaxInvoicePrint
    {
        public string? CustomerName { get; set; }
        public string? MobileNumber { get; set; }

        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyCity { get; set; }
        public string? CompanyCountry { get; set; }
        public string? CompanyGSTNumber { get; set; }
        public string? CompanyContactNumber { get; set; }
        public string? CompanyEmail { get; set; }
        public string? CompanyWebsite { get; set; }

        public string? ClientName { get; set; }
        public string? ClientAddress { get; set; }
        public string? ClientCity { get; set; }
        public string? ClientZipCode { get; set; }
        public string? ClientState { get; set; }
        public string? ClientCountry { get; set; }
        public string? ClientContactNumber { get; set; }
        public string? ClientGSTNumber { get; set; }
        public string? ClientContactPersonName { get; set; }

        public string? AltName { get; set; }
        public string? AltAddress { get; set; }
        public string? AltCity { get; set; }
        public string? AltContactNumber { get; set; }

        public string? SaleNumber { get; set; }
        public string? SaleDate { get; set; }
        public string? GoodsDeliveryDate { get; set; }
        public string? DeliveryChallanNumber { get; set; }
        public string? DeliveryChallanDate { get; set; }
        public string? EstimateNumber { get; set; }
        public string? EstimateDate { get; set; }
        public string? ExpectedDeliveryDate { get; set; }

        public string? TotalProducts { get; set; }
        public string? TotalDiscount { get; set; }
        public string? CGST { get; set; }
        public string? SGST { get; set; }
        public string? SubTotal { get; set; }


        public string? RoundOffValue { get; set; }
        public string? GrantTotal { get; set; }

        public string? Amount_InWords { get; set; }

        public string? AccountName { get; set; }    
        public string? AccountNumber { get; set; }
        public string? IFSCCode { get; set; }
        public string? BankName { get; set; }
        public string? UPIId { get; set; }
        public string? BranchName { get; set; }

        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public string? Signature { get; set; }
        public string? BackroundColour { get; set; }
        public string? TextColour { get; set; }


        public DataTable? ProductTable { get; set; }
        public DataTable? ProductOtherChargesTable { get; set; }
        public DataTable? OtherChargesTaxTable { get; set; }

        public DataTable? ProductItemTableNew { get; set; }
        public DataTable? ProductTablethermal { get; set; }

        public string? Irn { get; set; }
        public string? AckNo { get; set; }
        public string? AckDate { get; set; }
        public string? SignedInvoice { get; set; }
        public string? SignedQRCode { get; set; }
        public string? EwbNo { get; set; }
        public string? EwbDate { get; set; }
        public string? EwbValidTill { get; set; }
        public string? EInvoiceStatus { get; set; }

    }

    public class SaleOrderPrintNew
    {
        public string? CompanyLogo { get; set; }
        public string? CompanyName { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Phone { get; set; }
        public string? PFCodeNo { get; set; }
        public string? ESICodeNo { get; set; }
        public string? Email { get; set; }
        public string? GSTin { get; set; }
        public string? MSMERegistrationNo { get; set; }

        public string? ClientName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? GSTNumber { get; set; }

        public string? SaleId { get; set; }
        public string? SaleNo { get; set; }
        public string? SaleDate { get; set; }
        public string? HSNSAC { get; set; }

        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? AccountNumber { get; set; }
        public string? IFSCCode { get; set; }

        public string? SubTotal { get; set; }
        public string? CGST_Percentage { get; set; }
        public string? SGST_Percentage { get; set; }
        public string? CGST_Amount { get; set; }
        public string? SGST_Amount { get; set; }
        public string? RoundOffValue { get; set; }
        public string? GrantTotal { get; set; }
        public string? RupeesInWords { get; set; }
        
        public string? ArbitrationClause { get; set; }
        public string? Value1 { get; set; }
        public string? Value2 { get; set; }

        public string? Roll { get; set; }
        public string? Weight { get; set; }

        public DataTable? SaleDetailsTable { get; set; }
        public DataTable? OtherChargesData { get; set; }
    }
    
    public class GetOutwardDetails_ByInWardId
    {
        public int LoginUserId { get; set; }
        public int InWardId { get; set; }
        public int OutWardId { get; set; } 
    }
}
