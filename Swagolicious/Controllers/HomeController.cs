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
            MemberListForSwag.ResetWinnersAndReshuffle();
            return RedirectToAction("Index");
        }

        public RedirectToRouteResult Reload()
        {
            meetup.Reload();
            return RedirectToAction("Index");
        }

        public JsonResult MemberList()
        {
            var list = MemberListForSwag.MemberList.Where(w => !w.Excluded).OrderBy(w => w.Name);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public EmptyResult RemoveMemberFromGettingSwag(long id)
        {
            var excludee = MemberListForSwag.MemberList.FirstOrDefault(w => w.MemberId == id);
            if (excludee != null)
                excludee.Excluded = true;
            return new EmptyResult();
        }

        public JsonResult NextWinner()
        {
            var winner = MemberListForSwag.MemberList.FirstOrDefault(w => !w.WonSwag && !w.Excluded);
            if (winner == null)
                return Json(new { MemberId = 0 }, JsonRequestBehavior.AllowGet);

            var swag = MemberListForSwag.Swag.FirstOrDefault(w => !w.Claimed);
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
