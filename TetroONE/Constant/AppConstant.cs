namespace TetroONE.Constant
{
	public static class AppConstant
	{
		public const string LoginFailed = "Invalid username and password";
	}

	public enum UserRole
	{
		SuperAdmin = 1,
		Admin = 2,
		Executive = 3,
		GeneralUser = 4,
		Vendor = 5,
		Distributor = 6,
	}
}

