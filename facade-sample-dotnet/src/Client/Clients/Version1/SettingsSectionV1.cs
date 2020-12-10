using PipServices3.Commons.Config;
using System;
using System.Runtime.Serialization;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
    [DataContract]
    public class SettingsSectionV1
    {
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "parameters")]
        public ConfigParams Parameters { get; set; }

        [DataMember(Name = "update_time")]
        public DateTime UpdateTime { get; set; }
    }
}
