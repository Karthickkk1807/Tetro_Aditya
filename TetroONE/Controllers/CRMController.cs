using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class CRMController : Controller
    { 
        public IActionResult Visitor()
        {
            return View();
        }
        public IActionResult PromotionsCampaigns()
        {
            return View();
        }
        public IActionResult Surveys()
        {
            return View();
        }
    }
}
