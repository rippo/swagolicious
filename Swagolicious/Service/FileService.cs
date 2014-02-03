using System.Collections.Generic;
using System.IO;
using System.Web.Hosting;
using Newtonsoft.Json;
using Swagolicious.Models.dto;

namespace Swagolicious.Service
{
    public class FileService
    {
        private readonly string savePath;
        private const string SwagFileName = "swag.json";

        public FileService()
        {
            this.savePath = HostingEnvironment.MapPath("~/app_data");
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

        public List<SwagItemDto> LoadSwagFromDisc()
        {
            if (!File.Exists(Path.Combine(savePath, SwagFileName)))
                return new List<SwagItemDto>();

            var json = File.ReadAllText(Path.Combine(savePath, SwagFileName));
            var result = JsonConvert.DeserializeObject<List<SwagItemDto>>(json);
            return result;
        }
    }
}