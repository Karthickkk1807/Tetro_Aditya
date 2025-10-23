namespace TetroONE.Models
{
	public class LoginRequest
	{
		public string Username { get; set; }
		public string Password { get; set; }
	}

	public class CommonResponse
	{
		public bool Status { get; set; }
		public string Message { get; set; }
		public object Data { get; set; }
	}

	public class LandingResponse
	{
		public int LoginUserId { get; set; }
	}


	public class ForgetPassword
	{
		public string? OTPMedium { get; set; }
		public string? OTPNumber { get; set; }
		public string? Password { get; set; }
	}

	
	public class HandleException
	{
		public string Controller { get; set; }
		public string Method { get; set; }
		public string Error { get; set; }
		public int CreatedBy { get; set; }
	}



}
