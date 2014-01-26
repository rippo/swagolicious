using System.Collections.Generic;
using Swagolicious.Controllers;
using Swagolicious.Service;

namespace Swagolicious.Models
{
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
                item.Excluded = false;
                item.SwagThing = "?";
            }
            foreach (var swag in Swag)
            {
                swag.Claimed = false;
            }
            MemberList.Shuffle();
            Swag.Shuffle();
        }
    }
}