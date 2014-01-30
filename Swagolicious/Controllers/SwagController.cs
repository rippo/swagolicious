using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Swagolicious.App_Start;
using Swagolicious.Models;
using Swagolicious.Models.dto;
using Swagolicious.Service;

namespace Swagolicious.Controllers
{
    public class SwagController : Controller
    {
        public ActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public RedirectToRouteResult Index([FromJson] IEnumerable<SwagItemDto> swag)
        {
            MemberListForSwag.Swag.Clear();

            foreach (var dto in swag)
            {
                for (var i = 0; i < dto.Quantity; i++)
                {
                    MemberListForSwag.Swag.Add(new Swag { Claimed = false, Thing = dto.Name });
                }
            }
            MemberListForSwag.Swag.Shuffle();
            return RedirectToAction("Index");
        }

        public JsonResult AllSwag()
        {
            var list = from s in MemberListForSwag.Swag
                       group s by s.Thing into g
                       select new SwagItemDto
                       {
                           Name = g.Key,
                           Quantity = g.Count()
                       };
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}
