using System.Data;

namespace TetroONE.Models
{
    public class GetEmployee
    {
        public int LoginUserId { get; set; }
        public int? EmployeeTypeId { get; set; }
        public int? EmployeeId { get; set; }
        public int? FranchiseId { get; set; }
    }


    public class InsertEmployee
    {
        public int LoginUserId { get; set; }
        public int? EmployeeId { get; set; }
        public string EmployeeCompanyId { get; set; }
        public string Salutation { get; set; }
        public string EmployeeName { get; set; }
        public string? Designation { get; set; }
        public string MobileNumber { get; set; }
        public string? AlternateNo { get; set; }
        public string? Email { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public int EmployeeTypeId { get; set; }
        public int? EmployeeStatusId { get; set; }
        public int ShiftId { get; set; }
        public int DepartmentId { get; set; }
        public string? EmployeeImage { get; set; }
        public string? ExistingImage { get; set; }
        public int? GenderId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int? ReligionId { get; set; }
        public int? MaritalStatusId { get; set; }
        public string? AadharNo { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? Zipcode { get; set; }
        public bool IsInsuranceApplicable { get; set; }
        public string? InsuranceNumber { get; set; }
        public DateTime? InsuranceDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int PayTypeId { get; set; }
        public decimal CTC { get; set; }
        public decimal AccPayment { get; set; }
        public decimal CashPayment { get; set; }
        public int PayGroupId { get; set; }
        public bool IsPFApplicable { get; set; }
        public string? UANNumber { get; set; }
        public string? PFNumber { get; set; }
        public string? EmployeeContribution { get; set; }
        public string? EmployerContribution { get; set; }
        public bool IsESIApplicable { get; set; }
        public string? ESINumber { get; set; }
        public string? ESIEmployeeContribution { get; set; }
        public string? ESIEmployerContribution { get; set; }
        public int? FranchiseId { get; set; }
        public int UserTypeId { get; set; }
        public int UserGroupId { get; set; }
        public bool IsLoginUser { get; set; }

        public List<AttendanceMachineMappingDetail> attendanceMachineMappingDetails { get; set; }
        public DataTable TVP_EmployeeDeviceMappingDetails { get; set; }
        public DataTable TVP_EmployeeDocumentMappingDetails { get; set; }
        public DataTable TVP_EmployeeReportingPersonMappingDetails { get; set; }
    }

    public class EmployeeReportingPersonMappingDetails
    {
        public int? EmployeeReportingPersonMappingId { get; set; }
        public int? EmployeeId { get; set; }
        public int? ReportingPersonId { get; set; }
    }

    public class AttendanceMachineMappingDetail
    {
        public int? EmployeeDeviceMappingId { get; set; }
        public int? EmployeeId { get; set; }
        public int? AttendanceMachineId { get; set; }
        public bool IsBlock { get; set; }
    }

    public class GetAttendanceEmployee
    {
        public int LoginUserId { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime? Punchdate { get; set; }

    }
    public class GetAttendanceAdmin
    {
        public int LoginUserId { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int? PunchDate { get; set; }

        public int? EmployeeTypeId { get; set; }
    }

    public class GetManualAttendance
    {
        public int LoginUserId { get; set; }
        public DateTime? PunchDate { get; set; }
    }

    public class InsertManualAttendance
    {
        public int LoginUserId { get; set; }
        public DateTime? PunchDate { get; set; }

        public List<ManualData> manualData { get; set; }
        public DataTable TVP_AttendanceDetails { get; set; }
    }

    public class ManualData
    {
        public int EmployeeId { get; set; }
        public string? PunchIn { get; set; }
        public string? PunchOut { get; set; }
    }

    public class GetPayslip
    {
        public int LoginUserId { get; set; }
        public int? PaySlipId { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
    }
	public class GeneratePayslip
	{
		public int LoginUserId { get; set; }
		public int? Month { get; set; }
		public int? Year { get; set; }
		public int? PayGroupId { get; set; }
	}
	public class GetPayOutComeDetails
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
    }

    public class GetAdvance
    {
        public int LoginUserId { get; set; }
        public int? AdvanceId { get; set; }
    }
    public class InsertAdvance
    {
        public int LoginUserId { get; set; }
        public int? AdvanceId { get; set; }
        public DateTime AdvanceDate { get; set; }
        public int EmployeeId { get; set; }
        public decimal AdvanceAmount { get; set; }
        public decimal? DueAmount { get; set; }
        public int? AdvanceStatusId { get; set; }
        public string? Description { get; set; }
        public string? Comments { get; set; }
    }

    public class GetLoan
    {
        public int LoginUserId { get; set; }
        public int? LoanId { get; set; }
    }
    public class InsertLoan
    {
        public int LoginUserId { get; set; }
        public int? LoanId { get; set; }
        public DateTime LoanDate { get; set; }
        public int EmployeeId { get; set; }
        public decimal LoanAmount { get; set; }
        public int NoOfDues { get; set; }
        public decimal? DueAmount { get; set; }
        public int? CompletedDue { get; set; }
        public int? PendingDues { get; set; }
        public decimal? PendingAmount { get; set; }
        public int? LoanStatusId { get; set; }
        public string? Description { get; set; }
        public string? Comments { get; set; }
    }


    public class GetClaim
    {
        public int LoginUserId { get; set; }
        public int? ClaimId { get; set; }
    }
    public class InsertClaim
    {
        public int LoginUserId { get; set; }
        public int? ClaimId { get; set; }
        public string ClaimNo { get; set; }
        public int? ExpenseId { get; set; }
        public DateTime ClaimDate { get; set; }
        public int ClaimTypeId { get; set; }
        public decimal ClaimAmount { get; set; }
        public string? ClaimDescription { get; set; }
        public int RequestedBy { get; set; }
        public int ApprovedBy { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public string? ApproverComments { get; set; }
        public int? ClaimStatusId { get; set; }
        public List<AttachmentTable> attachement { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
    }


    public class EmployeeDocumentMapping
    {
        public int? EmployeeDocumentMappingId { get; set; }
        public int? EmployeeId { get; set; }
        public int? DocumentId { get; set; }
        public string DocumentFileName { get; set; }
        public string DocumentFilePath { get; set; }
        public string AttachmentExactFileName { get; set; }

    }

    public class documentName
    {
        public int? DocumentId { get; set; }
        public string DocumentFileName { get; set; }

    }

    public class GetExpenseNo
    {
        public int LoginUserId { get; set; }
        public int? ModuleId { get; set; }
        public string ModuleName { get; set; }

    }



    public class GetAutoGenerateId
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? EmployeeTypeId { get; set; }
    }
    public class GetReportingPerson
    {
        public int LoginUserId { get; set; }
        public int? DepartmentId { get; set; }
    }

    public class GetPayGroup
    {
        public int LoginUserId { get; set; }
        public int? PayTypeId { get; set; }
    }
    public class GetPayTypePayGroup
    {
        public int LoginUserId { get; set; }
        public int? EmployeeTypeId { get; set; }
    }

    public class GetUserTypeId
    {
        public int LoginUserId { get; set; }
        public int? EmployeeTypeId { get; set; }
    }


    public class InsertAttendanceEmployee
    {
        public int LoginUserId { get; set; }
        public int EmployeeId { get; set; }
        public string PunchDate { get; set; }
        public string PunchTime { get; set; }
        public string? Location { get; set; }
        public string DocumentFilePath { get; set; }
    }

    public class GetCompanyDocument
    {
        public int LoginUserId { get; set; }
        public int? CompanyDocumentId { get; set; }
    }
    public class InsertCompanyDocument
    {
        public int LoginUserId { get; set; }
        public int? CompanyDocumentId { get; set; }
        public string DocumentName { get; set; }
        public int? DocTypeId { get; set; }
        public DateTime ActivatedOn { get; set; }
        public DateTime ExpiredDate { get; set; }
        public string? Description { get; set; }
        public string? DocumentFileName { get; set; }
        public string? DocumentFilePath { get; set; }
        public string existImagePath { get; set; }

    }

    public class AttendanceCheckList
    {
        public int LoginUserId { get; set; }
        public int? AttendanceCheckListId { get; set; }
        public DateTime CheckListDate { get; set; }
        public string Comments { get; set; }
    }

    public class GetAvailability
    {
        public int LoginUserId { get; set; }
        public DateTime? Date { get; set; }
        public int? EmployeeId { get; set; }
    }

    public class UpdateAvailability
    {
        public int LoginUserId { get; set; }
        public List<EmployeeAvailabilityDetails> employeeAvailabilityDetails { get; set; }
        public DataTable TVP_EmployeeAvailabilityDetails { get; set; }
    }

    public class EmployeeAvailabilityDetails
    {
        public int? EmployeeAvailabilityId { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime? Date { get; set; }
        public int? AvailabilityTypeId { get; set; }
        public string? Description { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
    }
}