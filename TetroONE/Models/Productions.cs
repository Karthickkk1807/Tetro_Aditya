using System.Configuration;
using System.Data;

namespace TetroONE.Models
{
    public class GetInWardOutWard
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public DateTime? InWardOutWardDate { get; set; }
        public int? DistributorId { get; set; }
    }

    public class InsertUpdateInWardOutWardDetails
    {
        public int LoginUserId { get; set; }
        public int? InWardOutWardId { get; set; }
        public string? InWardOutWardType { get; set; }
        public DateTime InWardOutWardDate { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public int? DistributorId { get; set; }
        public int? PurchaseOrderId { get; set; }

        public List<InWardProductMapping> inWardProductMapping { get; set; }
        public DataTable TVP_InWardProductMappingDetails { get; set; }
       
        public List<OutWardProductMapping> outWardProductMapping { get; set; }
        public DataTable TVP_OutWardProductMappingDetails { get; set; }
    }

    public class StaticOutWardDetails
    {
        public int LoginUserId { get; set; }
        public int? InWardOutWardId { get; set; }
        public string? InWardOutWardType { get; set; }
        public DateTime? InWardOutWardDate { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public int? DistributorId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public DataTable TVP_InWardProductMappingDetails { get; set; }
        public DataTable TVP_OutWardProductMappingDetails { get; set; }
    }



    public class InWardProductMapping
    {
        public int? InWardProductMappingId { get; set; }
        public int? ProductId { get; set; }
        public decimal? InWardQty { get; set; }
        public decimal? RefundQty { get; set; }
        public decimal? SortingQty_Others { get; set; }
        public decimal? SortingQty_Damage { get; set; }
        public decimal? SortingQty_OtherBottles { get; set; }
        public decimal? FinalInWardQty { get; set; }
        public int? InWardOutWardId { get; set; }
        public int? RowNumber { get; set; }
    }
    
    public class OutWardProductMapping
    {
        public int? OutWardProductMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? ProductFlavourId { get; set; }
        public int? POQty { get; set; }
        public decimal? OutWardQty { get; set; }
        public int? InWardOutWardId { get; set; }
    }


    public class DeleteInWardOutWard
    {
        public int LoginUserId { get; set; }
        public int? InWardOutWardId { get; set; }
        public int? DistributorId { get; set; }
    }

    public class GetProduction
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? ProductionId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetPONumberbyDate
    {
        public int LoginUserId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class GetDPODetailsById
    {
        public int PurchaseOrderId_DBT { get; set; }
    }

    public class InsertUpdateProduction
    {
        public int LoginUserId { get; set; }
        public int? ProductionId { get; set; }
        public DateTime ProductionDate { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public decimal? NoOfHours { get; set; }
        public int? NoOfProducts { get; set; }
        public int? TotalQty_RGB { get; set; }
        public int? TotalQty_PET { get; set; }

        //public List<productionProductMappingDetails> productionProductMappingDetails { get; set; }
        public DataTable TVP_ProductionProductMappingDetails { get; set; }
        //public List<ProductionQCMappingDetails> ProductionQCMappingDetails { get; set; }
        public DataTable TVP_ProductionQCMappingDetails { get; set; }
        public DataTable TVP_ProductionAttachmentDetails { get; set; }
    }

    public class productionProductMappingDetails
    {
        public int? ProductionProductMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? UnitId { get; set; }
        public int? ProductFlavourId { get; set; }
        public decimal? RejectionQty_Dust { get; set; }
        public decimal? RejectionQty_MarbleDown { get; set; }
        public decimal? RejectionQty_LowFill { get; set; }
        public decimal? RejectionQty_RedHazard { get; set; }
        public decimal? RejectionQty_Others { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? OpeningBalance { get; set; }
        public decimal? Distribution { get; set; }
        public decimal? ClosingBalance { get; set; }
        public int? RowNumber { get; set; }
        public int? ProductionId { get; set; }
    }

    public class ProductionQCMappingDetails
    {
        public int? ProductionQCMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? ProductQCMappingId { get; set; }
        public decimal? Value { get; set; }
        public int? RowNumber { get; set; }
        public bool? IsActive { get; set; }
        public int? ProductionId { get; set; }
        public int? ProductionProductMappingId { get; set; }
    }

    public class ProductionAttachmentDetails
    {
        public int? ProductionAttachmentId { get; set; }
        public string? AttachmentFileName { get; set; }
        public string? AttachmentFilePath { get; set; }
        public int? ProductionProductMappingId { get; set; }
        public int? ProductionId { get; set; }
        public int? RowNumber { get; set; }
        public string? AttachmentExactFileName {  get; set; }
    }

    public class GetOpeningBalance
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public DateTime? Date { get; set; }
        public int? ProductId { get; set; }
    }

    public class DD_ProductionQCMapping
    {
        public int LoginUserId { get; set; }
        public int? ProductId { get; set; }
    }

    public class DeleteProduction
    {
        public int LoginUserId { get; set; }
        public int ProductionId { get; set; }
    }

    public class GetOutWardPo
    {
        public int LoginUserId { get; set; }
        public int FranchiseId { get; set; }
        public int DistributorId { get; set; }
    }

    public class GetOutWardPoOutWard
    {
        public int LoginUserId { get; set; }
        public int PurchaseOrderId { get; set; }
    }

    public class GetProductionPlan
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? ProductionPlanId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
    public class GetProductionPlanByFranchise
    {
        public int LoginUserId { get; set; }
        public int? ToFranchiseId { get; set; }
        public DateTime? ProductionPlanDate { get; set; }
    }

    public class InsertUpdateProductionPlan
    {
        public int LoginUserId { get; set; }
        public int? ProductionPlanId { get; set; }
        public DateTime ProductionPlanDate { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? NoOfProducts { get; set; }
        public int? TotalQuantity_RGB { get; set; }
        public int? TotalQuantity_PET { get; set; }
        public List<ProductionPlanDistributorPoMappingDetails> ProductionPlanDistributorPoMappingDetails { get; set; }
        public DataTable TVP_ProductionPlanDistributorPoMappingDetails { get; set; }
        public List<ProductionPlanMappingDetails> productionPlanMappingDetails { get; set; }
        public DataTable TVP_ProductionPlanMappingDetails { get; set; }
    }

    public class ProductionPlanMappingDetails
    {
        public int? ProductionPlanMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? UnitId { get; set; }
        public decimal? SystemOpeningBalance { get; set; }
        public decimal? ManualOpeningBalance { get; set; }
        public decimal? PurchaseOrderQuantity { get; set; }
        public int? EmptyBottles { get; set; }
        public decimal? Quantity { get; set; }
        public int? ProductionPlanId { get; set; }
    }

    public class ProductionPlanDistributorPoMappingDetails
    {
        public int? ProductionPlanDistributorPoMappingId { get; set; }
        public int? ProductionPlanId { get; set; }
        public int PurchaseOrderId { get; set; }
    }
    public class GetDeliveryPlan
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? DeliveryPlanId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class InsertUpdateDeliveryPlan
    {
        public int LoginUserId { get; set; }
        public int? DeliveryPlanId { get; set; }
        public DateTime DeliveryPlanDate { get; set; }
        public int? FromFranchiseId { get; set; }
        public int? ToFranchiseId { get; set; }
        public string? TransportRoute { get; set; }
        public int? NoOfDistributor { get; set; }
        public int? NoOfProducts { get; set; }
        public int? TotalQty_PET { get; set; }
        public int? TotalQty_RGB { get; set; }
        public List<DeliveryPlanDistributorMappingDetails> DeliveryPlanDistributorMappingDetails { get; set; }
        public DataTable TVP_DeliveryPlanDistributorMappingDetails { get; set; }
        public List<DeliveryPlanExpenseMappingDetails> DeliveryPlanExpenseMappingDetails { get; set; }
        public DataTable TVP_DeliveryPlanExpenseMappingDetails { get; set; }
    }

    public class DeliveryPlanDistributorMappingDetails
    {
        public int? DeliveryPlanDistributorMappingId { get; set; }
        public int? DistributorId { get; set; }
        public int? ProductId { get; set; }
        public string? DeliveryTime { get; set; }
        public int? UnitId { get; set; }
        public int? POQuantity { get; set; }
        public decimal? Quantity { get; set; }
        public int? DeliveryPlanId { get; set; }
        public decimal? ConvertionValues { get; set; }
    }

    public class DeliveryPlanExpenseMappingDetails
    {
        public int? DeliveryPlanExpenseMappingId { get; set; }
        public string? ExpenseName { get; set; }
        public decimal? ExpenseAmount { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? PerBottleCost { get; set; }
        public int? DeliveryPlanId { get; set; }
    }

    public class GetDeliveryProduct
    {
        public int LoginUserId { get; set; }
        public DateTime? DeliveryPlanDate { get; set; }
        public int? FranchiseId { get; set; }
        public int? DistributorId { get; set; }
    }


    public class GetSample
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? SampleId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
    public class GetSampleProductDetails
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
       
    }
    

    public class SampleDetailsStatic
    {
       
        public int? SampleId { get; set; }
        public DateTime SampleDate { get; set; }
        public int? FranchiseId { get; set; }
        public int? InchargeId { get; set; }
        public int? NoOfProducts { get; set; }
        public int? NoOfQty { get; set; }
    }

    public class SampleProductMappingDetails
    {
        public int? SampleProductMappingId { get; set; }
        public int? SampleId { get; set; }
        public int ProductId { get; set; }
        public int? Quantity { get; set; }
        public string? Comments { get; set; }
        
       
    }

    public class InsertSampleDetails
    {
        public int LoginUserId { get; set; }
        public int? SampleId { get; set; }
        public DateTime SampleDate { get; set; }
        public int? FranchiseId { get; set; }
        public int? InchargeId { get; set; }
        public int? NoOfProducts { get; set; }
        public int? NoOfQty { get; set; }
        public DataTable TVP_SampleProductMappingDetails { get; set; }
      
    }

    public class DeleteSample
    {
        public int LoginUserId { get; set; }
        public int? SampleId { get; set; }

    }

    public class GetTarget
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? TargetId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }


    public class TargetDetailsStatic
    {
        public int LoginUserId { get; set; }
        public int? TargetId { get; set; }
        public int? FranchiseId { get; set; }
        public string? TargetMonth { get; set; }
        public int? NoOfDays { get; set; }
        public int? TargetCount { get; set; }
    }


    public class DeleteTargetDetails
    {
        public int LoginUserId { get; set; }
        public int? TargetId { get; set; }
       
    }


}
