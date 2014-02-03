using Swagolicious.Service;

namespace Swagolicious.Models
{
    public class Attendee
    {
        public string Name { get; set; }
        public string Photo { get; set; }
        public bool WonSwag { get; set; }
        public int MemberId { get; set; }
        public string SwagThing { get; set; }
        public bool Excluded { get; set; }
        public string PaddedName
        {
            get
            {
                return Name.PaddedNameForFlapper(12);
            }
        }
    }
}