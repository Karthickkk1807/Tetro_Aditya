using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class ProductionQRCodeController : Controller
    {
        public IActionResult QRCodePop()
        {
            return View();
        }
    }
}
 