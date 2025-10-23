using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class RecruitmentController : Controller
    {
        public IActionResult Jobpostings()
        {
            return View();
        }

        public IActionResult Candidates()
        {
            return View();
        }
    }
}
