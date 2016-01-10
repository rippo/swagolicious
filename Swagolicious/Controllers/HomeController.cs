using System.Linq;
using System.Web.Mvc;
using Swagolicious.Models;
using Swagolicious.Service;

namespace Swagolicious.Controllers
{
    public class HomeController : Controller
    {
        protected override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            meetup.LoadFromMeetup();
            base.OnResultExecuting(filterContext);
        }

        private Meetup meetup = new Meetup();

        public ActionResult Index()
        {
            return View("Index");
        }

        public RedirectToRouteResult Reset()
        {
            ApplicationData.ResetWinnersAndReshuffle();
            return RedirectToAction("Index");
        }

        public RedirectToRouteResult Reload()
        {
            meetup.Reload();
            return RedirectToAction("Index");
        }

        [AllowCrossSiteJson]
        public JsonResult MemberList()
        {
            var list = ApplicationData.Attendees.Where(w => !w.Excluded).OrderBy(w => w.Name);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public EmptyResult RemoveMemberFromGettingSwag(long id)
        {
            var excludee = ApplicationData.Attendees.FirstOrDefault(w => w.MemberId == id);
            if (excludee != null)
                excludee.Excluded = true;
            return new EmptyResult();
        }

        public JsonResult NextWinner()
        {
            var winner = ApplicationData.Attendees.FirstOrDefault(w => !w.WonSwag && !w.Excluded);
            if (winner == null)
                return Json(new { MemberId = 0 }, JsonRequestBehavior.AllowGet);

            var swag = ApplicationData.Swag.FirstOrDefault(w => !w.Claimed);
            if (swag == null)
                swag = new Swag { Thing = "You choose" };

            var model = new NextWinnerViewModel
            {
                Winner = winner,
                WonSwag = swag
            };
            winner.SwagThing = swag.Thing.TruncateWithEllipsis(12);
            winner.WonSwag = true;
            swag.Claimed = true;
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Test()
        {
            return View("Test");
        }
    }
}
