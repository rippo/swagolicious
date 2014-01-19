using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using RestSharp;
using Swagolicious.Controllers;
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

                //lets fill the attendee and swag lists
                foreach (var result in results)
                {
                    MemberListForSwag.MemberList.Add(
                        new MemberForSwag
                        {
                            Name = result.Member.Name,
                            Photo = result.MemberPhoto != null ?
                                result.MemberPhoto.PhotoLink : "http://img2.meetupstatic.com/2982428616572973604/img/noPhoto_80.gif",
                            WonSwag = false,
                            SwagThing = "??",
                            MemberId = result.Member.MemberId
                        });
                }
                MemberListForSwag.MemberList.Shuffle();

                //swag
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

        //private void LoadFromFile(string swagLocation)
        //{
        //    var swagPath = GetFileLocation(swagLocation);

        //    if (!string.IsNullOrEmpty(swagPath))
        //    {
        //        if (File.Exists(swagPath))
        //        {
        //            if (!IsFileEmpty(swagPath))
        //            {
        //                var swagDoc = new XmlDocument();
        //                swagDoc.Load(swagPath);

        //                foreach (XmlNode swagElement in swagDoc.ChildNodes[1])
        //                {
        //                    var companyElement = swagElement.FirstChild as XmlElement;
        //                    var thingElement = swagElement.ChildNodes[1] as XmlElement;
        //                    Add(Swag.Create(companyElement.InnerText, thingElement.InnerText));
        //                }
        //            }
        //        }
        //    }
        //}

        //private bool IsFileEmpty(string swaglocation)
        //{
        //    return File.ReadAllLines(swaglocation).Length == 0;
        //}



    }

    public class InMemoryCache : ICacheService
    {
        public T Get<T>(string cacheId, Func<T> getItemCallback) where T : class
        {
            T item = HttpRuntime.Cache.Get(cacheId) as T;
            if (item == null)
            {
                item = getItemCallback();
                HttpContext.Current.Cache.Insert(cacheId, item);
            }
            return item;
        }

        public void Remove(string cacheId)
        {
            HttpContext.Current.Cache.Remove(cacheId);
        }
    }

    interface ICacheService
    {
        T Get<T>(string cacheId, Func<T> getItemCallback) where T : class;
        void Remove(string cacheId);
    }

    public static class ThreadSafeRandom
    {
        [ThreadStatic]
        private static Random Local;

        public static Random ThisThreadsRandom
        {
            get { return Local ?? (Local = new Random(unchecked(Environment.TickCount * 31 + Thread.CurrentThread.ManagedThreadId))); }
        }
    }

    static class MyExtensions
    {
        public static void Shuffle<T>(this IList<T> list)
        {
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = ThreadSafeRandom.ThisThreadsRandom.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }
    }

}