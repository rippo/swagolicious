
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Swagolicious.Models;
using Swagolicious.Models.dto;

namespace Swagolicious.Service
{
    public class FileService
    {
        private readonly string savePath;
        private const string SwagFileName = "swag.json";

        public FileService(string savePath)
        {
            this.savePath = savePath;
        }

        public void SaveSwagToDisc(IEnumerable<SwagItemDto> swag)
        {
            var serializer = new JsonSerializer
            {
                NullValueHandling = NullValueHandling.Ignore,
                Formatting = Formatting.Indented
            };
            using (var sw = new StreamWriter(Path.Combine(savePath, SwagFileName)))
            using (var writer = new JsonTextWriter(sw))
            {
                serializer.Serialize(writer, swag);
            }
        }

    }
}