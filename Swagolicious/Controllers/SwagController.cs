using System.Web.Mvc;

namespace Swagolicious.Controllers
{
    public class SwagController : Controller
    {
        public ActionResult Index()
        {
            return View("Index");
        }

    }
}
