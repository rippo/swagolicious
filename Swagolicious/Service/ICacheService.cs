using System;

namespace Swagolicious.Service
{
    interface ICacheService
    {
        T Get<T>(string cacheId, Func<T> getItemCallback) where T : class;
        void Remove(string cacheId);
    }
}