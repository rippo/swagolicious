using System;
using System.Web;

namespace Swagolicious.Service
{
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
}