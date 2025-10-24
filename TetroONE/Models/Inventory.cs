using System.Data;

namespace TetroONE.Models
{
    public class GetManageStock
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? ManageStockId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetMaterialsData
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class InsertUpdateManageStock
    {
        public int LoginUserId { get; set; }
        public int? ManageStockId { get; set; }
        public DateTime ManageStockDate { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public int? InchargeId { get; set; }
        public List<manageStockProductMappingDetails> manageStockProductMappingDetails { get; set; }
        public DataTable TVP_ManageStockProductMappingDetails { get; set; }
    }

    public class manageStockProductMappingDetails
    {
        public int? ManageStockProductMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? UnitId { get; set; }
        public decimal? SystemStock { get; set; }
        public decimal? ManualStock { get; set; }
        public decimal? DiffStock { get; set; }
        public int? ManageStockId { get; set; }
    }

    public class DeleteManageStock
    {
        public int LoginUserId { get; set; }
        public int ManageStockId { get; set; }
    }

    

    public class GetTransferDetails
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class GetTransferStatusDetails
    {
        public int LoginUserId { get; set; }
        public string? ModuleName { get; set; }
        public int? ModuleId { get; set; }
        public int? Type { get; set; }
    }


    public class InsertUpdateTransferDetails
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
        public string? TransferNo { get; set; }
        public DateTime? TransferDate { get; set; }
        public int? TransferType { get; set; }
        public int? TransferTypeId { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public int? NoOfProducts { get; set; }
        public string? Notes { get; set; }
        public string? TermsandCondition { get; set; }
        public int? ModeOfTransportId { get; set; }
        public string? TransportNo { get; set; }
        public int? TransferStatusId { get; set; }
        public int? OutwardId { get; set; } = null;
        public List<TransferProductMappingDetails> TransferProductMappingDetails { get; set; }
        public DataTable TVP_TransferProductMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
    }

    public class InsertUpdateTransferStatic
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
        public string? TransferNo { get; set; }
        public DateTime? TransferDate { get; set; }
        public int? TransferType { get; set; }
        public int? TransferTypeId { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public int? NoOfProducts { get; set; }
        public string? Notes { get; set; }
        public string? TermsandCondition { get; set; }
        public int? ModeOfTransportId { get; set; }
        public string? TransportNo { get; set; }
        public int? TransferStatusId { get; set; }
    }

    public class TransferProductMappingDetails
    {
        public int? TransferProductMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? TransferId { get; set; }
        public decimal? Quantity { get; set; }
        public int? UnitId { get; set; }
    }

    public class DeleteTransferDetails
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
    }

    public class DD_GetTransferDetails_TransferNo
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
    }

    public class DD_GetTransferNoDetails_TransferType
    {
        public int LoginUserId { get; set; }
        public int? ModuleId { get; set; }
        public int? TransferType { get; set; }
        public int? FranchiseId { get; set; }
    }

}