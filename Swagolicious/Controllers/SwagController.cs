using System.Collections.Generic;
using System.Web.Mvc;
using Swagolicious.App_Start;

namespace Swagolicious.Controllers
{
    public class SwagController : Controller
    {
        public ActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public ActionResult Index([FromJson] IEnumerable<SwagModel> swag)
        {
            // Can process the data any way we want here,
            // e.g., further server-side validation, save to database, etc
            return View("Index");
        }

    }
}
