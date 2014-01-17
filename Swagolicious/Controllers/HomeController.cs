﻿using System;
using System.Collections.Generic;
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

        public JsonResult MemberList()
        {
            var list = MemberListForSwag.MemberList.OrderBy(w=>w.Name);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult NextWinner()
        {
            var winner = MemberListForSwag.MemberList.FirstOrDefault(w => !w.WonSwag);
            //if (winner == null)
            //    return PartialView("Finished");

            var swag = MemberListForSwag.Swag.FirstOrDefault(w => !w.Claimed);
            if (swag == null)
                swag = new Swag { Company = "Smart Devs", Thing = "You choose" };

            var model = new NextWinnerViewModel
            {
                Winner = winner,
                WonSwag = swag
            };
            winner.WonSwag = true;
            swag.Claimed = true;
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }

    public static class MemberListForSwag
    {
        static MemberListForSwag()
        {
            MemberList = new List<MemberForSwag>();
            Swag = new List<Swag>();
        }

        public static List<MemberForSwag> MemberList { get; set; }
        public static List<Swag> Swag { get; set; }

        public static void ResetWinnersAndReshuffle()
        {
            foreach (var item in MemberList)
            {
                item.WonSwag = false;
            }
            foreach (var swag in Swag)
            {
                swag.Claimed = false;
            }
            MemberList.Shuffle();
            Swag.Shuffle();
        }
    }

    public class MemberForSwag
    {
        public string Name { get; set; }
        public string Photo { get; set; }

        public bool WonSwag { get; set; }
        public int MemberId { get; set; }
    }

    public class Swag
    {
        public Swag()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; private set; }
        public string Company { get; set; }
        public string Thing { get; set; }
        public bool Claimed { get; set; }
    }

}
