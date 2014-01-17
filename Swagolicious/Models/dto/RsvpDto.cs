using System.Collections.Generic;

namespace Swagolicious.Models
{
    public class RsvpDto
    {
        public List<Result> Results { get; set; }
    }

    public class MemberPhoto
    {
        public string PhotoLink { get; set; }
        public string ThumbLink { get; set; }
        public int PhotoId { get; set; }
        public string HighresLink { get; set; }
    }

    public class Member
    {
        public string Name { get; set; }
        public int MemberId { get; set; }
    }

    public class Result
    {
        public string Response { get; set; }
        public Member Member { get; set; }
        public MemberPhoto MemberPhoto { get; set; }
    }
}