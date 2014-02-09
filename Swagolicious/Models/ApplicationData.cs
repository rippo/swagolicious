using System.Collections.Generic;
using Swagolicious.Service;

namespace Swagolicious.Models
{
    public static class ApplicationData
    {
        static ApplicationData()
        {
            Initialise();
        }

        public static void Initialise()
        {
            Attendees = new List<Attendee>();
            Swag = new List<Swag>();
        }
        public static List<Attendee> Attendees { get; set; }
        public static List<Swag> Swag { get; set; }
        public static void ResetWinnersAndReshuffle()
        {
            foreach (var item in Attendees)
            {
                item.WonSwag = false;
                item.Excluded = false;
                item.SwagThing = "?";
            }
            foreach (var swag in Swag)
            {
                swag.Claimed = false;
            }
            Attendees.Shuffle();
            Swag.Shuffle();
        }
    }
}