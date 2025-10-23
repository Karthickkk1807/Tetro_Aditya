using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class GeneralLedgerController : Controller
    {
        public IActionResult GeneralLedger()
        {
            return View();
        }
    }
}
