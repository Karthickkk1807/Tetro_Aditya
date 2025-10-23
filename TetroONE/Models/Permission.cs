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









}
