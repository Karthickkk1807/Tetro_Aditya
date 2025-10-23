using TetroONE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
	[Authorize]
	public class BaseController : Controller
	{
		public int _employeeId = 0;
		public int _userId = 0;
		public int _companyId = 0;
		public string _connectionString = string.Empty;
		private readonly IConfiguration _configuration;

		public CommonResponse response = new CommonResponse();

		public BaseController(IConfiguration configuration)
		{
			_configuration = configuration;
			_connectionString = _configuration.GetConnectionString("TetroONE");

		}
	}
}
