using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class QualityManagementController : Controller
    { 
        public IActionResult InWardQC()
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
