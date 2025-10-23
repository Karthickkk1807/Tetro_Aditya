using System.Data;

namespace TetroONE.Models
{
    public class GetPurchaseRequest
    { 
        public int LoginUserId { get; set; }
        public int FranchiseId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; } 
        public int? PurchaseRequestId { get; set; } 
    }
    
    public class PurchaseRequestDetailsStatic
    {
        public int? PurchaseRequestId { get; set; }
        public int VendorId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int ShipToFranchiseId { get; set; }
        public int TopFranchiseId { get; set; }
        public string? PurchaseRequestNo { get; set; }
        public DateTime PurchaseRequestDate { get; set; }
        public string? TermsAndCondition { get; set; }
        public string? Notes { get; set; }
        public int PurchaseRequestStatusId { get; set; }

    }

    public class PurchaseRequestProductMappingDetails
    {
        public int? PurchaseRequestProductMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? UnitId { get; set; }
        public int Quantity { get; set; }
        public string? ProductDescription { get; set; }
        public int? PurchaseRequestId { get; set; }
    }

    public class InsertPurchaseRequestDetails
    {
        public int LoginUserId { get; set; }
        public int? PurchaseRequestId { get; set; }
        public int VendorId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int ShipToFranchiseId { get; set; }
        public int TopFranchiseId { get; set; }
        public string? PurchaseRequestNo { get; set; }
        public DateTime PurchaseRequestDate { get; set; }
        public string? TermsAndCondition { get; set; }
        public string? Notes { get; set; }
        public int PurchaseRequestStatusId { get; set; }
        public DataTable TVP_PurchaseRequestProductMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }

    }
    public class DeletePurchaseRequest
    {
        public int LoginUserId { get; set; }
        public int? PurchaseRequestId { get; set; }

    } 

    public class GetProposalRequest
    {
        public int LoginUserId { get; set; }
        public int FranchiseId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? ProposalRequestId { get; set; }
    }
     
    public class ProposalRequestDetailsStatic
    {
        public int? ProposalRequestId { get; set; }
        public int VendorId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int ShipToFranchiseId { get; set; }
        public int TopFranchiseId { get; set; }
        public string? ProposalRequestNo { get; set; }
        public DateTime ProposalRequestDate { get; set; }
        public string? TermsAndCondition { get; set; }
        public string? Notes { get; set; }
        public int ProposalRequestStatusId { get; set; } 
    }

    public class ProposalRequestProductMappingDetails
    {
        public int? ProposalRequestProductMappingId { get; set; }
        public string? ProposalName { get; set; } 
        public int? ProposalRequestId { get; set; }
    }
     
    public class InsertProposalRequestDetails 
    {
        public int LoginUserId { get; set; }
        public int? ProposalRequestId { get; set; }
        public int VendorId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int ShipToFranchiseId { get; set; }
        public int TopFranchiseId { get; set; }
        public string? ProposalRequestNo { get; set; }
        public DateTime ProposalRequestDate { get; set; }
        public string? TermsAndCondition { get; set; }
        public string? Notes { get; set; }
        public int ProposalRequestStatusId { get; set; }
        public DataTable TVP_ProposalRequestProductMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; } 
    }

    public class DeleteProposalRequest 
    {
        public int LoginUserId { get; set; }
        public int? ProposalRequestId { get; set; } 
    }

}
