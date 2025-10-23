using System.Data;

namespace TetroONE.Models
{
    public class GetSale
    {
        public int LoginUserId { get; set; }
        public int? SaleId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? FranchiseId { get; set; }

    }

    public class GetSaleDetails
    {
        public int LoginUserId { get; set; }
       

    }


    public class DeleteSale
    {
        public int LoginUserId { get; set; }
        public int? SaleId { get; set; }
       

    }

    public class GetDCDeliveryChallanId
    {
        public int LoginUserId { get; set; }
        public int? DeliveryChallanId { get; set; }
    }

    public class GetQuickBill
    {
        public int LoginUserId { get; set; }
        public int? SaleId { get; set; }
        public bool IsSale { get; set; }
       
    }

    public class GetLoyaltyPoints
    {
        public int LoginUserId { get; set; }
        public int? ClientId { get; set; }
       

    }

    public class GetShiftingAddressDDByClientId
    {
        public int LoginUserId { get; set; }
        public string? ModuleType { get; set; }
        public int? ModuleTypeId { get; set; }
    }

    public class GetAlternateAddressDetails
    {
        public int LoginUserId { get; set; }
        public string? Type { get; set; }
        public int? AltAddressId { get; set; }
        public int? ModuleTypeId { get; set; }
    }
    public class CompanyAddressDetails
    {
        public int LoginUserId { get; set; }
        public int? CompanyId { get; set; }

    }

    public class DispatchAddressDetails
    {
        public int LoginUserId { get; set; }
        public int? MasterInfoId { get; set; }
        public string? ModuleName { get; set; }
       
    }

    public class UpdateClientInfo
    {
        public int LoginUserId { get; set; }
        public int? ClientId { get; set; }
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

    public class EstimateDetailsRequest
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int ClientId { get; set; }
       
    }

    public class SaleOtherchargesType
    {
        public int LoginuserId { get; set; }
        public string? OtherChargesType { get; set; }
       
    }
    public class SaleDetailsStatic
    {
        public int? SaleId { get; set; }
		public int FranchiseId { get; set; }
		public int BillingFranchiseId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int? ClientId { get; set; }
        public string SaleNo { get; set; }
		public DateTime SaleDate { get; set; }
		public int? EstimateId { get; set; }
        public DateTime? EstimateDate { get; set; }
		public int? DeliveryChallanId { get; set; }
		public DateTime? DeliveryChallanDate { get; set; }
		public DateTime? GoodsDeliveryDate { get; set; }
		public decimal SubTotal { get; set; }
		public decimal RoundOffValue { get; set; }
		public decimal GrantTotal { get; set; }
		public int SaleStatusId { get; set; }
	
		public string? Notes { get; set; }
		public string? TermsAndCondition { get; set; }
        //public string? TransporterId { get; set; }
        //public string? TransportName { get; set; }
        //public string? ModeofTransport { get; set; }
        //public int? Distance { get; set; }
        //public string? TransportDocNo { get; set; }
        //public string? TransportDocDate { get; set; }
        //public string? VehicleNumber { get; set; }
        //public string? VehicleType { get; set; }

        //public string? DocumentType { get; set; }
        //public string? SupplyType { get; set; }
        //public string? TransactionType { get; set; }
        //public int? DispatchAddressId { get; set; }

    }

    public class SaleProductMappingDetails
    {
		public int? SaleProductMappingId { get; set; }
		public int ProductId { get; set; }
		public decimal SellingPrice { get; set; }
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
        public decimal? Discount { get; set; }
        public decimal TotalAmount { get; set; }
		public int? ModuleId { get; set; }
	}

    public class SaleOtherChargesMappingDetails
    {
		public int? PurchaseSaleOtherChargesMappingId { get; set; }
		public int? OtherChargesId { get; set; }
		public string? OtherChargesType { get; set; }
		public bool IsPercentage { get; set; }
		public decimal Value { get; set; }
		public decimal OtherChargeValue { get; set; }
		public int? ModuleId { get; set; }
	}

    

    public class InsertUpdateSale
    {
        public int LoginUserId { get; set; }
		public int? SaleId { get; set; }
		public int FranchiseId { get; set; }
		public int BillingFranchiseId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int? ClientId { get; set; }
		public string SaleNo { get; set; }
		public DateTime SaleDate { get; set; }
		public int? EstimateId { get; set; }
		public DateTime? EstimateDate { get; set; }
		public int? DeliveryChallanId { get; set; }
		public DateTime? DeliveryChallanDate { get; set; }
		public DateTime? GoodsDeliveryDate { get; set; }
		public decimal SubTotal { get; set; }
		public decimal RoundOffValue { get; set; }
		public decimal GrantTotal { get; set; }
		public int SaleStatusId { get; set; }
		public string? Notes { get; set; }
		public string? TermsAndCondition { get; set; }

		//public string? TransporterId { get; set; }
		//public string? TransportName { get; set; }
		//public string? ModeofTransport { get; set; }
		//public int? Distance { get; set; }
		//public string? TransportDocNo { get; set; }
		//public string? TransportDocDate { get; set; }
		//public string? VehicleNumber { get; set; }
		//public string? VehicleType { get; set; }
		//public string? DocumentType { get; set; }
		//public string? SupplyType { get; set; }
		//public string? TransactionType { get; set; }
		//public int? DispatchAddressId { get; set; }
		public DataTable TVP_Sale_ProductMappingDetails { get; set; }
        public DataTable TVP_PurchaseSaleOtherChargesMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
    }


    public class EstimateMappingRequest
    {
        public int LoginUserId { get; set; }
        public int? EstimateId { get; set; }
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

    public class ShippingAddressDDRequestForSale
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; } = "Sale";
        public int ModuleId { get; set; }
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

    public class GetCreditLimitDetails
    {
        public int LoginUserId { get; set; }
        public int ModuleId { get; set; }
        public bool IsEdit { get; set; }
        public int ClientId { get; set; }
        public int FranchiseId { get; set; }
        
        
    }
}
