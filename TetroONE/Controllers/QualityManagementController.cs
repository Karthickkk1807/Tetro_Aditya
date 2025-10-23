using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class QualityManagementController : Controller
    {
        public IActionResult IncomingQC()
        {
            return View();
        }
        public IActionResult InProcessQC()
        {
            return View();
        }
        public IActionResult FinalQC()
        {
            return View();
        }
    }
}
