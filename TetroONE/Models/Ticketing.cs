using System.Data;

namespace TetroONE.Models
{
    public class GetTicketing
    {
        public int LoginUserId { get; set; }
        public int? TicketId { get; set; }
        public int? FranchiseId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class InsertOrUpdateTicketing
    {
        public int LoginUserId { get; set; }
        public int? TicketId { get; set; }
        public int? FranchiseId { get; set; }
        public string TicketNo { get; set; }
        public int TickectingTypeId { get; set; }
        public DateTime TicketDate { get; set; }
        public int ModuleTypeId { get; set; }
        public int? CreatedById { get; set; }
        public int AssignedToId { get; set; }
        public string Query { get; set; }
        public int? TicketStatusId { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
        public DataTable TVP_TicketFollowUpDetails { get; set; }
        public DataTable TVP_TicketFollowUpAttachmentDetails { get; set; }
    }

    public class TicketFollowUpDetails
    {
        public int? TicketFollowUpId { get; set; }
        public DateTime? TicketFollowUpDate { get; set; }
        public int? FollowUpEmpId { get; set; }
        public string? Comments { get; set; }
        public int? TicketId { get; set; }
        public int? RowNumber { get; set; }
    }

    public class AttachmentTableDyanamic
    {
        public int? TicketFollowUpAttachmentId { get; set; }
        public int TicketId { get; set; }
        public int? TicketFollowUpId { get; set; }
        public string AttachmentFileName { get; set; }
        public string AttachmentFilePath { get; set; }
        public string? AttachmentExactFileName { get; set; }
        public int? RowNumber { get; set; }
    }
}
