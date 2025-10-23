using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("NewDashboard")]
    public class NewDashboardController : Controller
    {

        [Route("")]
        public IActionResult NewDashboard()
        {
            return View();
        }
    }
}
