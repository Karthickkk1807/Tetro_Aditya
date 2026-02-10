using System.Configuration;
using System.Data;

namespace TetroONE.Models
{
    public class GetSample
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? SampleId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetInward
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? InwardId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetTransactionTypeNoDetails
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? Transactiontype { get; set; }
    }

    public class GetOutward
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? OutWardId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetDDProductionPlan
    {
        public int LoginUserId { get; set; }
        public int? ProductionPlanId { get; set; }
    }

    public class GetOutWardTypeContactDetails
    {
        public int LoginUserId { get; set; }
        public int OutwardType { get; set; }
    }

    public class GetOutWardTypeClientJobDetails
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int ModuleId { get; set; }
    }

    public class GetProductionPlan
    {
        public int LoginUserId { get; set; }
        public int? TypeId { get; set; }
        public int? PlantId { get; set; }
        public int? ProductionPlanId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetDefaultChemical
    {
        public int LoginUserId { get; set; }
        public int? ProcessType { get; set; }
        public int? ProductionPlanId { get; set; }
        public decimal? ColourValue { get; set; }
    }

    public class GetFabricDetailsProductionPlan
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? IsUpdate { get; set; }
        public decimal? KG { get; set; }
        public string? Color { get; set; }
    }

    public class InsertUpdateInwardDetails
    {
        public int LoginUserId { get; set; }
        public int? InWardId { get; set; }
        public int PlantId { get; set; }
        public DateTime? InWardDate { get; set; }
        public string? InWardNo { get; set; }
        public int? InwardType { get; set; }
        public int? PaymentTypeId { get; set; }
        public int? ClientId { get; set; }
        public string? ClientDcNumber { get; set; }
        public int? ReceivedFrom { get; set; }
        public string? OldDcNumber { get; set; }
        public string? LabOption { get; set; }
        public string? VehicleNo { get; set; }
        public int? ColorId { get; set; }
        public int? StorageLocationId { get; set; }
        public int? NoofFabric { get; set; }
        public decimal? TotalQty { get; set; }
        public decimal? TotalRolls { get; set; }
        public int? ReceivedBy { get; set; }
        public int? InWardStatusId { get; set; }
        public string? Notes { get; set; }
        public List<InwardFabricDetails> InwardFabricDetails { get; set; }
        public DataTable TVP_InwardFabricDetails { get; set; }
        public List<InwardFabricProcessMappingDetails> InwardFabricProcessMappingDetails { get; set; }
        public DataTable TVP_InwardFabricProcessMappingDetails { get; set; }
    }

    public class InwardFabricDetails
    {
        public int? InwardFabricId { get; set; }
        public int? FabricId { get; set; }
        public int? ProcessCount { get; set; }
        public decimal? Dia { get; set; }
        public decimal? GSM { get; set; }
        public decimal? Qty { get; set; }
        public int? NoOfRolls { get; set; }
        public int? Width { get; set; }
        public int? RowNo { get; set; }
        public int? InWardId { get; set; }
    }

    public class InwardFabricProcessMappingDetails
    {
        public int? InwardFabricProcessMappingId { get; set; }
        public int? InwardFabricId { get; set; }
        public int? FabricTypeId { get; set; }
        public int? ProcessId { get; set; }
        public int? RowNo { get; set; }
    }

    public class DeleteInWardDetails
    {
        public int LoginUserId { get; set; }
        public int? InWardId { get; set; }
    }

    public class InsertUpdateOutwardDetails
    {
        public int LoginUserId { get; set; }
        public int? OutWardId { get; set; }
        public DateTime? OutwardDate { get; set; }
        public string? OutwardNo { get; set; }
        public int? OutWardTo { get; set; }
        public int? ProductionPlanId { get; set; }
        public string? PackingSlipNo { get; set; }
        public string? ShipFrom { get; set; }
        public string? ShipTo { get; set; }
        public string? ShipToAddress { get; set; }
        public string? ShipToCity { get; set; }
        public string? ShiptoMobileNo { get; set; }
        public string? ShipToPlaceOfSupply { get; set; }
        public int? OutWardedBy { get; set; }
        public int? NoofFabric { get; set; }
        public decimal? TotalQty { get; set; }
        public decimal? TotalRolls { get; set; }
        public string? Notes { get; set; }
        public string? VehicleNo { get; set; }
        public string? DriverName { get; set; }
        public int? OutWardStatusId { get; set; }
        public int? InwardId { get; set; }
        public int? PlantId { get; set; }
        public List<OutWardFabricDetails> OutWardFabricDetails { get; set; }
        public DataTable TVP_OutwardFabricDetails { get; set; }
        public List<OutwardFabricProcessMappingDetails> OutwardFabricProcessMappingDetails { get; set; }
        public DataTable TVP_OutwardFabricProcessMappingDetails { get; set; }
    }

    public class OutWardFabricDetails
    {
        public int? OutwardFabricId { get; set; }
        public int? FabricTypeId { get; set; }
        public int? ProcessCount { get; set; }
        public decimal? Dia { get; set; }
        public decimal? GSM { get; set; }
        public decimal? Qty { get; set; }
        public int? NoOfRolls { get; set; }
        public int? Width { get; set; }
        public int? RowNo { get; set; }
        public int? OutwardId { get; set; }
    }

    public class OutwardFabricProcessMappingDetails
    {
        public int? OutwardFabricProcessMappingId { get; set; }
        public int? OutwardFabricId { get; set; }
        public int? FabricTypeId { get; set; }
        public int? ProcessId { get; set; }
        public int? RowNo { get; set; }
    }

    public class DeleteOutwardDetails
    {
        public int LoginUserId { get; set; }
        public int? OutWardId { get; set; }
    }

    public class InsertUpdateProductionPlanDetails
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? ProductionPlanId { get; set; }
        public string? ProductionNo { get; set; }
        public DateTime? ProductionDate { get; set; }
        public decimal? TotalWeight { get; set; }
        public int? ColorId { get; set; }
        public int? MachineId { get; set; }
        public decimal? MLR { get; set; }
        public int? WaterLevel { get; set; }
        public string? LoadingDateTime { get; set; }
        public string? UnLoadingDateTime { get; set; }
        public int? ProductionPlanStatusId { get; set; }
        public string? Comments { get; set; }
        public int? PreparedBy { get; set; }
        public List<ProductionPlanFabricDetails> ProductionPlanFabricDetails { get; set; }
        public DataTable TVP_ProductionPlanFabricDetails { get; set; }
        public List<ProductionPlanFabricProcessMappingDetails> ProductionPlanFabricProcessMappingDetails { get; set; }
        public DataTable TVP_ProductionPlanFabricProcessMappingDetails { get; set; } 
        public List<ProductionPlanChemicalRequirementDetails> ProductionPlanChemicalRequirementDetails { get; set; }
        public DataTable TVP_ProductionPlanChemicalRequirementDetails { get; set; }
    }

    public class ProductionPlanFabricDetails
    {
        public int? ProductionPlanFabricId { get; set; }
        public int? InwardId { get; set; }
        public int? InwardFabricId { get; set; }
        public int? FabricTypeId { get; set; }
        public int? ColorId { get; set; }
        public decimal? Dia { get; set; }
        public decimal? GSM { get; set; }
        public int? NoOfRolls { get; set; }
        public int? Width { get; set; }
        public decimal? Quantity { get; set; }
        public int? ProcessCount { get; set; }
        public string? Comments { get; set; }
        public int? ProductionPlanId { get; set; }
    }

    public class ProductionPlanFabricProcessMappingDetails
    {
        public int? ProductionPlanFabricProcessMappingId { get; set; }
        public int? ProductionPlanFabricId { get; set; }
        public int? ProcessTypeId { get; set; }
        public int? RowNo { get; set; }
    }
    
    public class ProductionPlanChemicalRequirementDetails
    {
        public int? ProductionPlanChemicalRequirementId { get; set; }
        public int? ProcessType { get; set; }
        public int? ChemicalId { get; set; }
        public int? ChemicalType { get; set; }
        public decimal? GPL { get; set; }
        public decimal? TotalQty { get; set; }
        public int? ProductionPlanId { get; set; }
    }

    public class DeleteProductionPlanDetails
    {
        public int LoginUserId { get; set; }
        public int? ProductionPlanId { get; set; }
    }

    public class GetProductionLogDetails
    {
        public int LoginUserId { get; set; }
        public int? PlantId { get; set; }
        public int? ProductionPlanId { get; set; }
        public int? ProductionLogId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class InsertUpdateProductionLog
    {
        public int LoginUserId { get; set; }
        public int? ProductionPlanId { get; set; }
        public int? ProductionLogId { get; set; }
        public int? PlantId { get; set; }
        public int? PreparedBy { get; set; }
        public int? ProcessTypeId { get; set; }
        public decimal? Quantity { get; set; }
        public int? ProductionLogStatusId { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public string? Remarks { get; set; }
    }

    public class OutWardPrint
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

        public string? OutwardToName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? GSTNumber { get; set; }

        public string? DCNo { get; set; }
        public string? DCDate { get; set; }
        public string? Time { get; set; }
        public string? DeliveryTo { get; set; }

        public string? TotalInwardWt { get; set; }
        public string? TotalOutwardWt { get; set; }
        public string? AvgLoss { get; set; }
        public string? DeliveredBy { get; set; }
        public string? VehicleNo { get; set; }
        public string? DriverName { get; set; }

        public DataTable ProductItemData { get; set; }
    }

    public class JobCardPrint
    {
        public string? CompanyLogo { get; set; }
        public string? CompanyName { get; set; }

        public string? Date { get; set; }
        public string? SFNo { get; set; }
        public string? ClientName { get; set; }
        public string? Colour { get; set; }
        public string? Rolls { get; set; }
        public string? Fabric { get; set; }
        public string? Weight { get; set; }
        public string? WaterPPM { get; set; }
        public string? LotNo { get; set; }
        public string? DCNo { get; set; }
        public string? OrderNo { get; set; }
        public string? Water { get; set; }
        public string? GSM { get; set; }
        public string? RPM { get; set; }

        public string? Machine { get; set; }
        public string? NoOfChamber { get; set; }
        public string? ChamberQty { get; set; }
        
        public string? PreTreatmentProduct { get; set; }
        public string? PreTreatmentUnit { get; set; }
        public string? PreTreatmentUnitValue { get; set; }
        public string? PreTreatmentQty { get; set; }

        public string? DyeProduct { get; set; }
        public string? DyeUnit { get; set; }
        public string? DyeUnitValue { get; set; }
        public string? DyeQty { get; set; }

        public string? DyeBathProduct { get; set; }
        public string? DyeBathUnit { get; set; }
        public string? DyeBathUnitValue { get; set; }
        public string? DyeBathQty { get; set; }

        public string? AfterTreatmentProduct { get; set; }
        public string? AfterTreatmentUnit { get; set; }
        public string? AfterTreatmentUnitValue { get; set; }
        public string? AfterTreatmentQty { get; set; }

        public string? FinishingProduct { get; set; }
        public string? FinishingUnit { get; set; }
        public string? FinishingUnitValue { get; set; }
        public string? FinishingQty { get; set; }
    }
}
