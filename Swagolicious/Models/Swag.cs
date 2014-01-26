using System;
using Swagolicious.Service;

namespace Swagolicious.Models
{
    public class Swag
    {
        public Swag()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; private set; }
        public string Thing { get; set; }
        public bool Claimed { get; set; }
        public string PaddedName
        {
            get { return Thing.PaddedNameForFlapper(12); }
        }

        public string TruncatedName
        {
            get { return Thing.TruncateWithEllipsis(12); }
        }

    }
}