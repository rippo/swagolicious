using System.Collections.Generic;
using System.Linq;
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

                //Get RSVP list from first event
                request = new RestRequest { Resource = Settings.MeetupRsvpUrl };
                request.AddUrlSegment("eventid", events.Results.First().Id);
                var rsvpList = api.Execute<RsvpDto>(request);

                //exclude coordinators
                var results = rsvpList.Results
                    .Where(w => !Settings.AttendeesExcludeList.Contains(w.Member.Name))
                    .ToList();

                MemberListForSwag.Initialise();

                //lets fill the attendee and swag lists
                foreach (var result in results)
                {

                    MemberListForSwag.MemberList.Add(
                        new MemberForSwag
                        {
                            Name = result.Member.Name.FirstNameAndSurnameInitial(),
                            Photo = result.MemberPhoto != null ?
                                result.MemberPhoto.PhotoLink : "http://img2.meetupstatic.com/2982428616572973604/img/noPhoto_80.gif",
                            WonSwag = false,
                            SwagThing = "?",
                            MemberId = result.Member.MemberId
                        });
                }
                MemberListForSwag.MemberList.Shuffle();

                //swag
                MemberListForSwag.Swag.Add(new Swag { Thing = "A very long name here", Claimed = false });
                MemberListForSwag.Swag.Add(new Swag { Thing = "A very long name here", Claimed = false });
                MemberListForSwag.Swag.Add(new Swag { Thing = "A very long name here", Claimed = false });
                MemberListForSwag.Swag.Add(new Swag { Thing = "A very long name here", Claimed = false });
                MemberListForSwag.Swag.Add(new Swag { Thing = "TShirt1", Claimed = false });
                MemberListForSwag.Swag.Add(new Swag { Thing = "TShirt2", Claimed = false });
                MemberListForSwag.Swag.Add(new Swag { Thing = "TShirt3", Claimed = false });
                
                MemberListForSwag.Swag.Shuffle();

                return results;
            });
        }

        public void Reload()
        {
            new InMemoryCache().Remove("Meetup.Attendees");
            LoadFromMeetup();
        }

    }
}