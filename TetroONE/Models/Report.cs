namespace TetroONE.Models
{
	public class ReportCategoryRequest
	{
		public int LoginUserId { get; set; }
		public string ReportName { get; set; }

	}

	public class ReportCategoryRequestNew
	{
		public int LoginUserId { get; set; }
		public string ReportName { get; set; }

	}

	public class ReportValueRequest
	{
		public int LoginUserId { get; set; }
		public string ModuleName { get; set; }

	}

	public class ReportValueRequestNew
    {
		public int LoginUserId { get; set; }
		public string ReportName { get; set; }

	}

    public class ReportExcelDownloadNew
    {
        public string ReportName { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Franchise { get; set; }
        public int ReportCategory { get; set; }
        public int ReportValue { get; set; }
    }


    public class ReportRequest
	{
		public int LoginUserId { get; set; }
		public string ReportName { get; set; }
		public DateTime? FromDate { get; set; }
		public DateTime? ToDate { get; set; }
		public string ReportCategory { get; set; }
		public int ReportValue { get; set; }
        public bool IsReport { get; set; }
    }
    
	public class ReportRequestNew
    {
		public int LoginUserId { get; set; }
		public string ReportName { get; set; }
		public DateTime? FromDate { get; set; }
		public DateTime? ToDate { get; set; }
		public int Franchise { get; set; } 
		public int ReportCategory { get; set; }
		public int ReportValue { get; set; }
    }

    public class ReportExcelDownload
    {
        public string ReportName { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string ReportCategory { get; set; }
        public int ReportValue { get; set; }
        public bool IsReport { get; set; }
    }

    public class PayslipDownload
    {
        public string Month { get; set; }
        public string CompanyLogo { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string PaySlip { get; set; }
        public string Name { get; set; }
        public string EmployeeId { get; set; }
        public string Designation { get; set; }
        public string EffectiveWorkDays { get; set; }
        public string LOP { get; set; }
        public string PayMentMode { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string PANnumber { get; set; }
        public string UANNumber { get; set; }
        public string PFNumber { get; set; }
        public string BasicPay { get; set; }
        public string HRA { get; set; }
        public string OtherAllowance { get; set; }
        public string Claim { get; set; }
        public string Bonus { get; set; }
        public string PF { get; set; }
        public string ESI { get; set; }
        public string IncomeTax { get; set; }
        public string LeaveDeduction { get; set; }
        public string AdvanceAmount { get; set; }
        public string LoanAmount { get; set; }
        public string OtherDeduction { get; set; }
        public string TotalEarning { get; set; }
        public string TotalDeduction { get; set; }
        public string NetPay { get; set; }
        public string InWords { get; set; }
        public string PayslipModel { get; set; }
    }

    public class ReportDownload
    {
        public string CompanyName { get; set; }
        public string CompanyLogoName { get; set; }
        public string Address { get; set; }
        public string Location { get; set; }
        public string Contact { get; set; }
        public string Website { get; set; }
        public string GSTNumber { get; set; }
        public string ReportCategory { get; set; }
        public string ReportValue { get; set; }
        public string Duration { get; set; }
        public string Reportname { get; set; }

    }

    public class GetReportName
	{
        public int LoginUserId { get; set; }
        public int ReportId { get; set; }
    }



}
