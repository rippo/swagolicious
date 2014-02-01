using System.Collections.Generic;
using Swagolicious.Service;

namespace Swagolicious.Models
{
    public static class MemberListForSwag
    {
        static MemberListForSwag()
        {
            Initialise();
        }

        public static void Initialise()
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