namespace TetroONE.Models
{
	public class GetPermission
	{
		public int LoginUserId { get; set; }
		public int? PermissionId { get; set; }
	}

	public class InserUpdatetPermission
	{
		public int LoginUserId { get; set; }
		public int? PermissionId { get; set; }
		public string Type { get; set; }
		public int? EmployeeId { get; set; }
		public string NumberOfHours { get; set; }
		public DateTime Date { get; set; }
		public string StartTime { get; set; }
		public string EndTime { get; set; }
		public int? PermissionStatusId { get; set; }
		public string? Description { get; set; }
		public string? Comments { get; set; }
	}
	 
	public class GetCompOff
    {
		public int LoginUserId { get; set; }
		public int? CompOffId { get; set; }
	}

	public class InserUpdatetCompensatoryOff
	{
		public int LoginUserId { get; set; }
		public int? CompOffId { get; set; }
		public int? EmployeeId { get; set; }
		public DateTime? CompensatoryOffDate { get; set; }
		public bool? IsHalfDay { get; set; }
		public decimal? NoOfDays { get; set; }
		public decimal? AvlCompOff { get; set; } 
		public string? CompOffDescription { get; set; }
		public int? CompOffStatusId { get; set; }
		public string? Comments { get; set; } 
	}

}
