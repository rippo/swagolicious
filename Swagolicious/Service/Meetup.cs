using System.Collections.Generic;
using System.Linq;
using System.Web.Hosting;
using RestSharp;
using Swagolicious.Models;

namespace Swagolicious.Service
{
    public class Meetup
    {
        public List<Result> LoadFromMeetup()
        {
            return new InMemoryCache().Get("Meetup.Attendees", () =>
            {
                var api = new MeetupApiCall(Settings.MeetupApiKey);

                //Get upcoming events
                var request = new RestRequest { Resource = Settings.MeetupEventsUrl };
                request.AddUrlSegment("groupname", Settings.MeetupGroupName);

                var events = api.Execute<EventDto>(request);
                var nextEvent = events.Results.First();

                //Get RSVP list from first event
                request = new RestRequest { Resource = Settings.MeetupRsvpUrl };
                request.AddUrlSegment("eventid", nextEvent.Id);
                var rsvpList = api.Execute<RsvpDto>(request);

                //Do we have any guests?
                var guestCount = nextEvent.YesRsvpCount - rsvpList.Results.Count;

                //exclude coordinators
                var results = rsvpList.Results
                    .Where(w => !Settings.AttendeesExcludeList.Contains(w.Member.Name))
                    .ToList();

                BuildMemberModel(results, guestCount);
                BuildSwagModel();

                return results;
            });
        }

        private void BuildSwagModel()
        {
            var result = new FileService().LoadSwagFromDisc();

            if (result.Count == 0)
            {
                //Default swag
                ApplicationData.Swag.Add(new Swag { Thing = "TShirt", Claimed = false });
                ApplicationData.Swag.Add(new Swag { Thing = "TShirt", Claimed = false });
                ApplicationData.Swag.Add(new Swag { Thing = "TShirt", Claimed = false });
            }
            else
            {
                foreach (var dto in result)
                {
                    for (var i = 0; i < dto.Quantity; i++)
                    {
                        ApplicationData.Swag.Add(new Swag { Claimed = false, Thing = dto.Name });
                    }
                }
            }

            ApplicationData.Swag.Shuffle();
        }

        private void BuildMemberModel(IEnumerable<Result> results, int guestCount)
        {
            ApplicationData.Initialise();

            //lets fill the attendee and swag lists
            foreach (var result in results)
            {
                ApplicationData.Attendees.Add(
                    new Attendee
                    {
                        Name = result.Member.Name.FirstNameAndSurnameInitial(),
                        Photo = result.MemberPhoto != null ?
                            result.MemberPhoto.PhotoLink : "http://img2.meetupstatic.com/img/2982428616572973604/noPhoto_80.gif",
                        WonSwag = false,
                        SwagThing = "?",
                        MemberId = result.Member.MemberId
                    });
            }

            for (var i = 1; i <= guestCount; i++)
            {
                ApplicationData.Attendees.Add(
                    new Attendee
                    {
                        Name = "Guest " + i,
                        Photo = "http://img2.meetupstatic.com/img/2982428616572973604/noPhoto_80.gif",
                        WonSwag = false,
                        SwagThing = "?",
                        MemberId = -i
                    });

            }

            ApplicationData.Attendees.Shuffle();
        }

        public void Reload()
        {
            new InMemoryCache().Remove("Meetup.Attendees");
            LoadFromMeetup();
        }

    }
}