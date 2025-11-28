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

    public class GetOutWardTypeContactDetails
    {
        public int LoginUserId { get; set; }
        public int OutwardType { get; set; }
    }

    public class GetProductionPlan
    {
        public int LoginUserId { get; set; }
        public int? TypeId { get; set; }
        public int? ProductionPlanId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

}
