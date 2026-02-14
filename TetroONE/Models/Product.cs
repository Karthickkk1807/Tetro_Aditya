using TetroONE.Models;
using System.Data;

namespace TetroONE.Models
{
    public class GetProduct
    {
        public int LoginUserId { get; set; } 
        public int ProductTypeId { get; set; } 
        public int? ProductId { get; set; }
        public int? PlantId { get; set; }
    }
    public class GetManPower
    {
        public int LoginUserId { get; set; }
        public int? Type { get; set; }
        public string ModuleName { get; set; }
    }
    public class InsertUpdateDetails
    {
        public int LoginUserId { get; set; }
        public int? ProductId { get; set; }
        public int ProductTypeId { get; set; }
        public string ProductName { get; set; }
        public int ProductCategoryId { get; set; }
        public int ProductSubCategoryId { get; set; } 
        public string? ProductDescription { get; set; }
        public int PrimaryUnitId { get; set; }
        public decimal PrimaryPrice { get; set; }
        public decimal ReOrderLevel { get; set; }
        public int? TaxInfoId { get; set; }
        //public decimal? CGST { get; set; }
        //public decimal? SGST { get; set; }
        //public decimal? IGST { get; set; }
        //public decimal? CESS { get; set; }
        public List<ProductPlantMappingDetails> ProductPlantMappingDetails { get; set; }
        public DataTable TVP_ProductPlantMappingDetails { get; set; } 
    }
    
    public class ProductPlantMappingDetails
    {
        public int? ProductPlantMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? PlantId { get; set; }
        public decimal? OpeningStock { get; set; }
        public decimal? StockInHand { get; set; } 
    }

    public class ProductProductionStagesMapping
    {
        public int? ProductProductionStagesMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? ProductionStagesId { get; set; }
        public bool? IsSelected { get; set; }
    }

    public class ProductRawMaterialMapping
    {
        public int? ProductRawMaterialMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? RawMaterialId { get; set; }
        public bool? IsSelected { get; set; }
    }

    public class InsertProductManPower
    {
        public int LoginUserId { get; set; }
        public List<ProductManPowerDetails> productManPowerDetails { get; set; }
        public DataTable TVP_ProductManPowerDetails { get; set; }
        public List<ProductManPowerPSMappingDetails> productManPowerPSMappingDetails { get; set; }
        public DataTable TVP_ProductManPowerPSMappingDetails { get; set; }
    }

    public class ProductManPowerDetails
    {
        public int? ProductManPowerId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? UnitId { get; set; }
        public decimal? Quantity { get; set; }
        public int? TotalStages { get; set; }   
        public int? TotalManPower { get; set; }
    }
    public class ProductManPowerPSMappingDetails
    {
        public int? ProductManPSMappingId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? ProductionStagesId { get; set; }
        public int? Value { get; set; }
    }

    public class InsertProductRawMaterial
    {
        public int LoginUserId { get; set; }
        public List<ProductRawMaterialDetails> productRawMaterialDetails { get; set; }
        public DataTable TVP_ProductRawMaterialDetails { get; set; }
        public List<ProductRawMaterialMappingDetails> productRawMaterialMappingDetails { get; set; }
        public DataTable TVP_ProductRawMaterialMappingDetails { get; set; }
    }

    public class ProductRawMaterialDetails
    {
        public int? ProductRawMaterialId { get; set; }
        public int? ProductId { get; set; }
        public int? UnitId { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? TotalRawMaterials { get; set; }
        public decimal? TotalRawMaterialsQty { get; set; }
    }

    public class ProductRawMaterialMappingDetails
    {
        public int? ProductRawMaterialMappingId { get; set; }
        public int? ProductId { get; set; }
        public int? RawMaterialId { get; set; }
        public decimal? Value { get; set; }
    }
}



