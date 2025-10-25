using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class MaintenanceManagementController : Controller
    {
        public IActionResult MaintenancePlanning()
        {
            return View();
        }
        public IActionResult MaintenanceLog()
        {
            return View();
        }
        public IActionResult Service()
        {
            return View();
        }
        public IActionResult DowntimeTracking()
        {
            return View();
        }
    }
}
