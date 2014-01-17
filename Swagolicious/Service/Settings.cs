using System.Configuration;

namespace Swagolicious.Service
{
    public static class Settings
    {
        public static string MeetupGroupName { get { return GetAppConfig("MeetupGroupName"); } }
        public static string AttendeesExcludeList { get { return GetAppConfig("AttendeesExcludeList"); } }
        public static string MeetupRsvpUrl { get { return GetAppConfig("MeetupRsvpUrl"); } }
        public static string MeetupEventsUrl { get { return GetAppConfig("MeetupEventsUrl"); } }
        public static string MeetupApiKey { get { return GetAppConfig("MeetupApiKey"); } }

        public static string GetAppConfig(string key)
        {
            return ConfigurationManager.AppSettings[key] ?? string.Empty;
        }

    }
}