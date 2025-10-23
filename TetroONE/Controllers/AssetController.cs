using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    public class AssetController : Controller
    {
        public IActionResult QRGeneration()
        {
            return View();
        }
        public IActionResult AssetMapRet()
        {
            return View();
        }
        public IActionResult AssetTransfer()
        {
            return View();
        }
        public IActionResult AssetService()
        {
            return View();
        }
        public IActionResult Auditing()
        {
            return View();
        }
        public IActionResult Scrap()
        {
            return View();
        }
    }
}
