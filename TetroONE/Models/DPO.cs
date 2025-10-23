using System.Data;

namespace TetroONE.Models
{
	
	


	public class DPGetPurchaseOrder
	{
		public int LoginUserId { get; set; }
		public int? PurchaseOrderId_DBT { get; set; }
		public DateTime? FromDate { get; set; }
		public DateTime? ToDate { get; set; }
		public int FranchiseId_DBT { get; set; }
		public int? TypeId { get; set; }


	}

	public class DeletePurchaseOrderDPO
	{
		public int LoginUserId { get; set; }
		public int? PurchaseOrderId { get; set; }

	}



	public class PurchaseDetailsStaticDPO
	{
		public int? PurchaseOrderId { get; set; }
		public string? PurchaseOrderNo { get; set; }
		public int VendorId { get; set; }
		public int ShipToFranchiseId { get; set; }
		public int FranchiseId { get; set; }
		public int BillFromFranchiseId { get; set; }
		public DateTime PurchaseOrderDate { get; set; }
		public DateTime? ExpectedDeliveryDate { get; set; }
		public string? TermsAndCondition { get; set; }
		public string? Notes { get; set; }
		public decimal SubTotal { get; set; }
		public decimal GrantTotal { get; set; }
		public decimal RoundOffValue { get; set; }
		public int PurchaseOrderStatusId { get; set; }
	}

	public class PurchaseOrderProductMappingDetailsDPO
	{
		public int? PurchaseOrderProductMappingId { get; set; }
		public int ProductId { get; set; }
		public decimal PurchasePrice { get; set; }
		public decimal Quantity { get; set; }
		public int UnitId { get; set; }
		public string? ProductDescription { get; set; }
        public decimal? Subtotal { get; set; }
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

	public class InsertPurchaseOrderDetailsDPO
	{
		public int LoginUserId { get; set; }
		public int? PurchaseOrderId { get; set; }
		public string? PurchaseOrderNo { get; set; }
		public int VendorId { get; set; }
		public int ShipToFranchiseId { get; set; }
		public int FranchiseId { get; set; }
		public int BillFromFranchiseId { get; set; }
		public DateTime PurchaseOrderDate { get; set; }
		public DateTime? ExpectedDeliveryDate { get; set; }
		public string? TermsAndCondition { get; set; }
		public string? Notes { get; set; }
		public decimal SubTotal { get; set; }
		public decimal GrantTotal { get; set; }
		public decimal RoundOffValue { get; set; }
		public int PurchaseOrderStatusId { get; set; }
		public DataTable TVP_Purchase_ProductMappingDetails { get; set; }
		public DataTable TVP_AttachmentDetails { get; set; }
	}

	public class PurchaseOrderPrintDPO
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

		public string? PurchaseOrderNumber { get; set; }
		public string? PurchaseOrderDate { get; set; }
		public string? ExpectedDeliveryDate { get; set; }

		public string? VendorName { get; set; }
		public string? VendorAddress { get; set; }
		public string? VendorCity { get; set; }
		public string? VendorZipCode { get; set; }
		public string? VendorState { get; set; }
		public string? VendorCountry { get; set; }
		public string? VendorContact { get; set; }
		public string? VendorGSTNumber { get; set; }

		public string? RoundOffValue { get; set; }
		public string? GrantTotal { get; set; }
		public string? TaxableAmount { get; set; }
		public string? NumberToWords { get; set; }
		public string? Notes { get; set; }
		public string? TermsandConditions { get; set; }
		public string? BackroundColour { get; set; }
		public string? TextColour { get; set; }
		public string? Signature { get; set; }

		public DataTable ProductItemTable { get; set; }
		public DataTable OtherChargesTable { get; set; }
		//public DataTable OtherChargesTaxTable { get; set; }
		public DataTable ProductItemTableNew { get; set; }

	}


}
