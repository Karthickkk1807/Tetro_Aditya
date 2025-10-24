using System.Data;

namespace TetroONE.Models
{
    public class GetAsset
    {
        public int LoginUserId { get; set; }
        public int BranchId { get; set; }
        public int? AssetTypeId { get; set; }
        public int? AssetId { get; set; }
    }

    public class GetAutoGenerateNoAsset
    {
        public int LoginUserId { get; set; }
        public string? ModuleName { get; set; }
        public int? BranchId { get; set; }

    }


    public class GetAssetAutoGenerateNoAsset
    {
        public int LoginUserId { get; set; }
        public int AssetSubcategoryId { get; set; }
        public int ManufacturerId { get; set; }

    }

    public class InsertUpdateAsset
    {
        public int LoginUserId { get; set; }
        public int? AssetId { get; set; }
        public string? AssetNo { get; set; }
        public int? AssetTypeId { get; set; }
        public int? AssetSubCategoryId { get; set; }
        public int? AssetCategoryId { get; set; }
        public string? AssetName { get; set; }
        public string? TagSerialNumber { get; set; }
        public string? ModelNumber { get; set; }
        public int? ManufacturerId { get; set; }
        public string? LicenseKey { get; set; }
        public int? AssetMaintenanceFrequencyId { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
        public int? AssetStatusId { get; set; }
        public string? Description { get; set; }
        public int? VendorId { get; set; }

        public string? InVoiceNumber { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public decimal? PurchaseValue { get; set; }
        public string? AssetLifeSpan { get; set; }
        public string? InsurancePolicyNo { get; set; }
        public DateTime? InsuranceExpiryDate { get; set; }
        public DateTime? WarrantyStartDate { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }

        public DateTime? InsCoverageFromDate { get; set; }
        public int? BranchId { get; set; }
        public int? NoofEMI { get; set; }
        public int? BillingTypeId { get; set; }
        public string? PONumber { get; set; }
        public DateTime? PODate { get; set; }

        public DateTime? LastBilledDate { get; set; }
        public DateTime? NextBillingDate { get; set; }
        public int? PaymentType { get; set; }

    }

    public class GetDDFroBulkInserttype
    {
        public int LoginUserId { get; set; }
        public int? MasterInfoId { get; set; }
        public string ModuleName { get; set; }
    }

    public class InsertBulkAsset
    {
        public int LoginUserId { get; set; }
        public int BranchId { get; set; }
        public int? Clear { get; set; }
        public bool? IsInsert { get; set; }
        public List<AssetDetails>? TVP_AssetDetails { get; set; } // Nullable list
    }

    public class AssetDetails
    {
        public string? AssetType { get; set; }
        public string? AssetCategory { get; set; }
        public string? AssetSubCategory { get; set; }
        public string? Manufacturer { get; set; }
        public string? ModelNumber { get; set; }
        public string? TagSerialNumber { get; set; }
        public string? AssetName { get; set; }
        public string? LicenseKey { get; set; }
        public string? AssetMaintenanceFrequency { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
        public string? BillingType { get; set; }
        public DateTime? LastBilledDate { get; set; }
        public DateTime? NextBillingDate { get; set; }
        public string? PaymentType { get; set; }
        public string? NoofEMI { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
        public string? Vendor { get; set; }
        public string? PONumber { get; set; }
        public DateTime? PODate { get; set; }
        public string? InVoiceNumber { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public decimal? PurchaseValue { get; set; }
        public string? AssetLifeSpan { get; set; }
        public string? InsurancePolicyNo { get; set; }
        public string? InsCoverageFromDate { get; set; }
        public DateTime? InsuranceExpiryDate { get; set; }
        public DateTime? WarrantyStartDate { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }
    }

    public class InsertBulkAssetMapping
    {
        public int LoginUserId { get; set; }
        public bool? IsInsert { get; set; }
        public List<AssetMappingDetails>? TVP_AssetMappingDetails { get; set; } // Nullable list
    }

    public class AssetMappingDetails
    {
        public string? BranchName { get; set; }
        public string? HallName { get; set; }
        public string? DepartmentName { get; set; }
        public string? WorkDeskNo { get; set; }
        public string? AssetName { get; set; }
    }

    public class GetAssetDeskMapping
    {
        public int LoginUserId { get; set; }
        public int? AssetMappingId { get; set; }
        public int? BranchId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class DeleteAssetMapping
    {
        public int LoginUserId { get; set; }
        public int? AssetMappingId { get; set; }
    }


    public class InsertUpdateAssetMappingDetails
    {
        public int LoginUserId { get; set; }
        public int? AssetMappingId { get; set; }
        public string? AssetMappingNo { get; set; }
        public int? Type { get; set; }
        public int? BranchId { get; set; }
        public int? HallId { get; set; }
        public int? DepartmentId { get; set; }
        public int? AssetId { get; set; }
        public int? NoOfWorkDesk { get; set; }
        public int? NoOfAsset { get; set; }
        public List<DeskAssetMappingDetails> DeskAssetMappingDetails { get; set; }
        public DataTable TVP_DeskAssetMappingDetails { get; set; }
    }

    public class DeskAssetMappingDetails
    {
        public int? DeskAssetMappingId { get; set; }
        public int? WorkDeskId { get; set; }
        public int? AssetId { get; set; }
        public int? AssetMappingId { get; set; }
    }

    public class GetAssetReturn
    {
        public int LoginUserId { get; set; }
        public int? AssetReturnId { get; set; }
        public int? BranchId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class InsertUpdateReturnDetails
    {
        public int LoginUserId { get; set; }
        public int? AssetReturnId { get; set; }
        public string? AssetReturnAutoId { get; set; }
        public int? Type { get; set; }
        public int? BranchId { get; set; }
        public int? HallId { get; set; }
        public int? DepartmentId { get; set; }
        public int? DepartmentDeskMappingId { get; set; }
        public int? AssetId { get; set; }
        public List<AssetReturnMappingDetails> AssetReturnMappingDetails { get; set; }
        public DataTable TVP_AssetReturnMappingDetails { get; set; }

    }

    public class AssetReturnMappingDetails
    {
        public int? AssetReturnMappingId { get; set; }
        public int? AssetId { get; set; }
        public int? AssetReturnId { get; set; }
        public int? IsReturned { get; set; }

        public string? Description { get; set; }
    }

    public class DeleteAssetReturn
    {
        public int LoginUserId { get; set; }
        public int? AssetReturnId { get; set; }
    }

    public class GetDeskNoDetails_BranchHall
    {
        public int LoginUserId { get; set; }
        public int? BranchId { get; set; }
        public int? HallId { get; set; }
        public int? DepartmentId { get; set; }
    }


    public class GetDeskNoDetails_BranchHall_Return
    {
        public int LoginUserId { get; set; }
        public int? BranchId { get; set; }
        public int? HallId { get; set; }
        public int? DepartmentId { get; set; }
    }

    public class GetAssetNoDetails_AssetMapping
    {
        public int LoginUserId { get; set; }
        public int? AssetmappingId { get; set; }
        public int? Type { get; set; }
        public int? BranchId { get; set; }
        public int? AssetId { get; set; }
    }

    public class GetDepartmentDetails_ByBranchHallId
    {
        public int LoginUserId { get; set; }
        public string? ModuleName { get; set; }
        public int? BranchId { get; set; }
        public int? HallId { get; set; }
    }

    public class GetTransfer
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? BranchId { get; set; }
    }

    public class GetAssetDetails_ByBranchId
    {
        public int LoginUserId { get; set; }
        public int? BranchId { get; set; }
        public int? AssetId { get; set; }
        public int? MovementType { get; set; }
        public string Modulename { get; set; }

    }

    public class InsertUpdateAssetTransferDetails
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
        public string? TransferNo { get; set; }
        public DateTime? TransferDate { get; set; }
        public int? TransferType { get; set; }
        public int? TransferTypeId { get; set; }
        public int? FromBranchId { get; set; }
        public int? ToBranchId { get; set; }
        public decimal? NoOfAssets { get; set; }
        public string? Notes { get; set; }
        public string? TermsandCondition { get; set; }
        public string TransportNo { get; set; }
        public int ModeOfTransportId { get; set; }
        public int? InventoryStatusId { get; set; }
        public List<TransferAssetMappingDetails> TransferAssetMappingDetails { get; set; }
        public DataTable TVP_TransferAssetMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
    }

    public class InsertUpdateAssetTransferStatic
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
        public string? TransferNo { get; set; }
        public DateTime? TransferDate { get; set; }
        public int? TransferType { get; set; }
        public int? TransferTypeId { get; set; }
        public int? FromBranchId { get; set; }
        public int? ToBranchId { get; set; }
        public decimal? NoOfAssets { get; set; }
        public string? Notes { get; set; }
        public string? TermsandCondition { get; set; }
        public int? InventoryStatusId { get; set; }
        public string TransportNo { get; set; }
        public int ModeOfTransportId { get; set; }
    }


    public class TransferAssetMappingDetails
    {
        public int? TransferAssetMappingId { get; set; }
        public int? TransferId { get; set; }
        public int? AssetId { get; set; }
        public decimal? Quantity { get; set; }
    }

    public class DeleteAssetTransferDetails
    {
        public int LoginUserId { get; set; }
        public int? TransferId { get; set; }
    }


    public class AssetTransferPrint
    {
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }

        public string? TransferNo { get; set; }
        public string? TransferDate { get; set; }
        public string? ReceivedDate { get; set; }

        public string? TransferType { get; set; }

        public string? FromBranchName { get; set; }
        public string? FromBranchAddress { get; set; }
        public string? FromBranchCity { get; set; }
        public string? FromBranchState { get; set; }
        public string? FromBranchContactNo { get; set; }


        public string? ToBranchName { get; set; }
        public string? ToBranchAddress { get; set; }
        public string? ToBranchCity { get; set; }
        public string? ToBranchState { get; set; }
        public string? ToBranchContactNo { get; set; }


        public string? NoOfAssets { get; set; }
        public string? Notes { get; set; }


        public string? PreparedBy { get; set; }
        public string? VerifiedBy { get; set; }
        public string? ApprovedBy { get; set; }


        public string? TransportName { get; set; }
        public string? TransportNo { get; set; }


        public DataTable ProductItemTable { get; set; }
    }

    public class GetService
    {
        public int LoginUserId { get; set; }
        public int? ServiceId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? BranchId { get; set; }
    }

    public class InsertUpdateSeviceStatic
    {
        public int LoginUserId { get; set; }
        public int? ServiceId { get; set; }
        public string? ServiceNo { get; set; }
        public DateTime? ServiceDate { get; set; }
        public int? ServiceType { get; set; }
        public int? ServiceTypeId { get; set; }
        public int? WarrantyType { get; set; }
        public int? ContactType { get; set; }
        public int? FromBranchId { get; set; }
        public int? ServiceEngrId { get; set; }
        public decimal? NoOfAssets { get; set; }
        public string? Notes { get; set; }
        public string? TermsandCondition { get; set; }
        public int? ServiceStatusId { get; set; }
        public string? TransportNo { get; set; }
        public int ModeOfTransportId { get; set; }
        public decimal? Amount { get; set; }
        public string? Description { get; set; }
    }

    public class InsertUpdateSeviceDynamic
    {
        public int LoginUserId { get; set; }
        public int? ServiceId { get; set; }
        public string? ServiceNo { get; set; }
        public DateTime? ServiceDate { get; set; }
        public int? ServiceType { get; set; }
        public int? ContactType { get; set; }
        public int? ServiceTypeId { get; set; }
        public int? WarrantyType { get; set; }
        public int? FromBranchId { get; set; }
        public int? ServiceEngrId { get; set; }
        public decimal? NoOfAssets { get; set; }
        public string? Notes { get; set; }
        public string? TermsandCondition { get; set; }
        public int? ServiceStatusId { get; set; }
        public string? TransportNo { get; set; }
        public int ModeOfTransportId { get; set; }
        public decimal? Amount { get; set; }
        public string? Description { get; set; }
        public List<ServiceAssetMappingDetails> ServiceAssetMappingDetails { get; set; }
        public DataTable TVP_ServiceAssetMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
        public List<ServiceAssetMappingDetails_Inward> ServiceAssetMappingDetails_Inward { get; set; }
        public DataTable TVP_ServiceAssetMappingDetails_Inward { get; set; }
    }

    public class ServiceAssetMappingDetails
    {
        public int? ServiceAssetMappingId { get; set; }
        public int? ServiceId { get; set; }
        public int? AssetId { get; set; }
        public decimal? Quantity { get; set; }
    }
    public class ServiceAssetMappingDetails_Inward
    {
        public int? ServiceAssetMappingId { get; set; }
        public int? ServiceId { get; set; }
        public int? AssetId { get; set; }
        public string? AssetName { get; set; }
        public decimal? Price { get; set; }
        public int? ManufacturerId { get; set; }
        public int? AssetSubCategoryId { get; set; }
        public string? ModelNo { get; set; }
        public string? SerialNo { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }
        public int? WarrantyAssetStatusId { get; set; }
    }

    public class DeleteService
    {
        public int LoginUserId { get; set; }
        public int? ServiceId { get; set; }
    }

    public class ServicePrint
    {
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }

        public string? ServiceNo { get; set; }
        public string? ServiceDate { get; set; }
        public string? ServiceType { get; set; }
        public string? WarrantyType { get; set; }
        public string? ReceivedDate { get; set; }

        public string? FromBranchName { get; set; }
        public string? FromBranchAddress { get; set; }
        public string? FromBranchCity { get; set; }
        public string? FromBranchState { get; set; }
        public string? FromBranchContactNo { get; set; }


        public string? ToBranchName { get; set; }
        public string? ToBranchAddress { get; set; }
        public string? ToBranchCity { get; set; }
        public string? ToBranchState { get; set; }
        public string? ToBranchContactNo { get; set; }


        public string? NoOfAssets { get; set; }
        public string? Notes { get; set; }


        public string? PreparedBy { get; set; }
        public string? VerifiedBy { get; set; }
        public string? ApprovedBy { get; set; }


        public string? TransportName { get; set; }
        public string? TransportNo { get; set; }


        public DataTable ProductItemTable { get; set; }
    }

    public class GetInOutWard
    {
        public int LoginUserId { get; set; }
        public int? InwardOutwardId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class InsertUpdateInOutWard
    {
        public int LoginUserId { get; set; }
        public int? InwardOutwardId { get; set; }
        public DateTime? Date { get; set; }
        public int? BranchId { get; set; }
        public int? InwardOutwardType { get; set; }
        public int? InwardOutwardTypeId { get; set; }
        public int? TransferServiceId { get; set; }
        public decimal? TotalQuantity { get; set; }
        public List<InwardAssetMappingDetails> InwardAssetMappingDetails { get; set; }
        public DataTable TVP_InwardAssetMappingDetails { get; set; }
    }

    public class InwardAssetMappingDetails
    {
        public int? InwardAssetMappingId { get; set; }
        public int? InwardOutwardId { get; set; }
        public int? AssetId { get; set; }
        public decimal? InwardQuantity { get; set; }
    }

    public class DeleteInOutWard
    {
        public int LoginUserId { get; set; }
        public int? InwardOutwardId { get; set; }
    }

    public class GetTransferServiceDetails_BranchInOutwardType
    {
        public int LoginUserId { get; set; }
        public int? BranchId { get; set; }
        public int? InwardOutwardType { get; set; }
        public int? InwardOutwardTypeId { get; set; }
    }

    public class USP_DD_GetIOAssetDetails_IOTypeId
    {
        public int LoginUserId { get; set; }
        public int? BranchId { get; set; }
        public int? InwardOutwardType { get; set; }
        public int? InwardOutwardTypeId { get; set; }
        public int? TransferServiceId { get; set; }
    }

    public class SendingSMS
    {
        public string? MessageText { get; set; }
        public string? ContactNumber { get; set; }
    }

    public class SmsResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class SendingWhatsApp
    {
        public string? MessageText { get; set; }
        public string? ContactNumber { get; set; }
    }

    public class GetAudit
    {
        public int LoginUserId { get; set; }
        public int? AuditId { get; set; }
        public int? BranchId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetReportAudit
    {
        public int LoginUserId { get; set; }
        public int? AuditId { get; set; }
    }
    public class GetDeskName
    {
        public int LoginUserId { get; set; }
        public int? FloorId { get; set; }
        public int? BranchId { get; set; }
        public DateTime? AuditDate { get; set; }
    }
}
