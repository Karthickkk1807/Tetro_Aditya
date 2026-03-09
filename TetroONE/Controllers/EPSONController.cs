using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TetroONE.Controllers
{
    [Authorize]
    [Route("EPSON")]
    public class EPSONController : BaseController
    {
        private readonly DotMatrixPrinter _printer;

        public EPSONController(IConfiguration configuration, DotMatrixPrinter printer) : base(configuration)
        {
            _printer = printer;
        }

        [HttpGet("PrintDotMatrix")]
        public IActionResult PrintDotMatrix(string PrinterName)
        {
            try
            {
                _printer.PrintSlip(PrinterName);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}