using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class FinancialPlanningController : Controller
    {
        public IActionResult FinancialPlanning()
        {
            return View();
        }
    }
}
