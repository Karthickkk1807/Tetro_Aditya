using System.Data;

namespace TetroPos.Models
{
    public class GetEnquiry
    {
        public int LoginUserId { get; set; }
        public int? EnquiryId { get; set; }
        public int? FranchiseId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class DeleteEnquiry
    {
        public int LoginUserId { get; set; }
        public int? EnquiryId { get; set; }
        public int? FranchiseId { get; set; }

    }

    public class InsertEnquiryDetailsStatic
    {
        public int LoginUserId { get; set; }
        public DateTime EnquiryDate { get; set; }
        public string EnquiryPersonName { get; set; }
        public string EnquiryNo { get; set; }
        public string ContactNumber { get; set; }
        public string EnquiryEmail { get; set; }
        public int EnquiryTypeId { get; set; }
        public int AttendantId { get; set; }
        public string? CheckIn { get; set; }
        public string? CheckOut { get; set; }
        public string Query { get; set; }
        public string Comments { get; set; }
        public bool EnquiryIsLookUp { get; set; }
        public DateTime? EnquiryLookUpDate { get; set; }
        public bool EnquiryIsForwardOption { get; set; }
        public int? ForwardEmpId { get; set; }
        public int? FranchiseId { get; set; }
    }


    public class InsertEnquiry
    {
        public int LoginUserId { get; set; }
        public DateTime EnquiryDate { get; set; }
        public string EnquiryPersonName { get; set; }
        public string EnquiryNo { get; set; }
        public string ContactNumber { get; set; }
        public string EnquiryEmail { get; set; }
        public int EnquiryTypeId { get; set; }
        public int AttendantId { get; set; }
        public string? CheckIn { get; set; }
        public string? CheckOut { get; set; }
        public string Query { get; set; }
        public string Comments { get; set; }
        public bool EnquiryIsLookUp { get; set; }
        public DateTime? EnquiryLookUpDate { get; set; }
        public bool EnquiryIsForwardOption { get; set; }
        public int? ForwardEmpId { get; set; }
        public int? FranchiseId { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
    }


     public class EnquiryAttachmentTable
    {
        public int? AttachmentId { get; set; }
        public string ModuleName { get; set; }
        public int? ModuleRefId { get; set; }
        public string AttachmentFileName { get; set; }
        public string AttachmentFilePath { get; set; }
        public string AttachmentExactFileName { get; set; }

    }

    public class EnquiryNumberDetails
    {
        public int LoginUserId { get; set; }
        public string Module { get; set; }
        public string ReturnType { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class EnquiryFollowUpDetails
    {
        public int? EnquiryFollowUpId { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public string? ContactPerson { get; set; }
        public string? Comments { get; set; }
        public bool IsLookUp { get; set; }
        public DateTime? LookUpDate { get; set; }
        public bool IsForwardOption { get; set; }
        public int? ForwardEmpId { get; set; }
        public int? EnquiryId { get; set; }
        public int? RowNumber { get; set; }
    }


    public class UpdateEnquiryDetailsStatic
    {
        public int LoginUserId { get; set; }
        public int? EnquiryId { get; set; }
        public DateTime EnquiryDate { get; set; }
        public string EnquiryPersonName { get; set; }
        public string? EnquiryNo { get; set; }
        public int? EnquiryStatusId { get; set; }
        public string ContactNumber { get; set; }
        public string EnquiryEmail { get; set; }
        public int EnquiryTypeId { get; set; }
        public int AttendantId { get; set; }
        public string? CheckIn { get; set; }
        public string? CheckOut { get; set; }
        public string Query { get; set; }
        public string Comments { get; set; }
        public bool EnquiryIsLookUp { get; set; }
        public DateTime? EnquiryLookUpDate { get; set; }
        public bool EnquiryIsForwardOption { get; set; }
        public int? ForwardEmpId { get; set; }
        public int? FranchiseId { get; set; }
        public DataTable TVP_EnquiryFollowUpDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
        public DataTable TVP_EnquiryAttachmentDetails { get; set; }
    }

    public partial class DyanamicAttachment
    {
        public int RowNumber { get; set; }
        public string fileName { get; set; }    
    }

    public class AttachmentTableDyanamicEnquiry
    {
        public int? EnquiryAttachmentId { get; set; }
        public string ModuleName { get; set; }
        public int? ModuleRefId { get; set; }
        public string AttachmentFileName { get; set; }
        public string AttachmentFilePath { get; set; }
        public string? AttachmentExactFileName { get; set; }
        public int RoWNumber { get; set; }
    }
}
