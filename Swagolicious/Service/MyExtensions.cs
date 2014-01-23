using System.Collections.Generic;

namespace Swagolicious.Service
{
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

        public static string PaddedNameForFlapper(this string value, int totalLength)
        {
            var stringToCenter = value.ToUpper();
            if (stringToCenter.Length > totalLength)
                return stringToCenter.Substring(0, totalLength);
            var stringToCenterLength = stringToCenter.Length;
            return stringToCenter.PadLeft(((totalLength - stringToCenterLength) / 2) + stringToCenterLength).PadRight(totalLength);

        }

        public static string FirstNameAndSurnameInitial(this string fullName)
        {
            var nameParts = fullName.Split(' ');
            var name = nameParts[0].Trim();
            if (nameParts.Length <= 1) return name;

            var surname = nameParts[nameParts.Length - 1].Trim();
            if (!string.IsNullOrWhiteSpace(surname))
                name += " " + surname.Substring(0, 1);
            return name;
        }
    }
}