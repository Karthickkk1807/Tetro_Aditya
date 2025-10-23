namespace TetroONE.Models
{
	public class GetLeave
	{
		public int LoginUserId { get; set; }	
		public int? LeaveId { get; set; }	
	}

	public class InserUpdatetLeave
	{
		public int LoginUserId { get; set; }
		public int? LeaveId { get; set; }
		public int EmployeeId { get; set; }
		public DateTime FromDate { get; set; }
		public DateTime ToDate { get; set; }
		public int IsHalfDay { get; set; }
		public decimal NoOfDays { get; set; }
		public string? LeaveDescription { get; set; }
		public int? LeaveStatusId { get; set; }
		public string? Comments { get; set; }
	}

	public class GetStatus
	{
		public int LoginUserId { get; set; }
		public string ModuleName { get; set; }
		public int ModuleId { get; set; }

	}

	public class GetRemainingDetails
	{
		public int? LoginUserId { get; set; }
		public string? Type { get; set; }
		public int? ModuleId { get; set; }
		public int? EmployeeId { get; set; }
		public string ModuleName { get; set; }
		public DateTime Date { get; set; }

	}


}
