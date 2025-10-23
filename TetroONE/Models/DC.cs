using System.Data;

namespace TetroONE.Models
{
    public class GetDC
    {
        public int LoginUserId { get; set; }
        public int? DeliveryChallanId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? FranchiseId { get; set; }

    }
    public class GetInventoryNumberDetailsByCLientId
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int ClientId { get; set; }


    }
    public class DeleteDC
    {
        public int LoginUserId { get; set; }
        public int? DeliveryChallanId { get; set; }


    }

    public class DeliveryChallanDetailsStatic
    {
        public int? DeliveryChallanId { get; set; }
        public int FranchiseId { get; set; }
        public int BillingFranchiseId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int ClientId { get; set; }

        public string? DeliveryChallanNo { get; set; }
        public DateTime DeliveryChallanDate { get; set; }
        public string? ChallanType { get; set; }
        public string? ReferenceNo { get; set; }
        public int? EstimateId { get; set; }
        public DateTime? EstimateDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GrantTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public int? DeliveryChallanStatusId { get; set; }
    }

    public class DeliveryChallanProductMappingDetails
    {
        public int? SaleProductMappingId { get; set; }
        public int ProductId { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal Quantity { get; set; }
        public int UnitId { get; set; }
        public string? ProductDescription { get; set; }
        public decimal? Discount { get; set; }
        public decimal? GstPercentage { get; set; }
        public decimal TotalAmount { get; set; }
        public int? ModuleId { get; set; }
    }

    public class DeliveryChallanOtherChargesMappingDetails
    {
        public int? PurchaseSaleOtherChargesMappingId { get; set; }
        public int? OtherChargesId { get; set; }
        public string? OtherChargesType { get; set; }
        public bool IsPercentage { get; set; }
        public decimal Value { get; set; }
        public decimal OtherChargeValue { get; set; }
        public int? ModuleId { get; set; }
    }
    
    public class InsertDeliveryChallanDetails
    {

        public int LoginUserId { get; set; }
        public int? DeliveryChallanId { get; set; }
        public int FranchiseId { get; set; }
        public int BillingFranchiseId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int ClientId { get; set; }

        public string? DeliveryChallanNo { get; set; }
        public DateTime DeliveryChallanDate { get; set; }
        public string? ChallanType { get; set; }
        public string? ReferenceNo { get; set; }
        public int? EstimateId { get; set; }
        public DateTime? EstimateDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GrantTotal { get; set; }
        public decimal RoundOffValue { get; set; }
        public string? Notes { get; set; }
        public string? TermsAndCondition { get; set; }
        public int? DeliveryChallanStatusId { get; set; }

        public DataTable? TVP_SaleProductMappingDetails { get; set; }
        public DataTable? TVP_PurchaseSaleOtherChargesMappingDetails { get; set; }
        public DataTable? TVP_AttachmentDetails { get; set; }
    }

    public class DCPrint
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
        public string? StateName { get; set; }
        public string? AltContactNumber { get; set; }
        public string? DeliveryChallanNumber { get; set; }
        public string? DeliveryChallanDate { get; set; }
        public string? ChallanType { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? EstimateNumber { get; set; }
        public string? EstimateDate { get; set; }
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
        public string? TermsAndCondition { get; set; }
        public string? Signature { get; set; }
        public string? Notes { get; set; }
        public string? BackroundColour { get; set; }
        public string? TextColour { get; set; }
        public DataTable? ProductTable { get; set; }
        public DataTable? ProductOtherChargesTable { get; set; }
        public DataTable? OtherChargesTaxTable { get; set; }
        public DataTable? ProductItemTableNew { get; set; }

    }
}
