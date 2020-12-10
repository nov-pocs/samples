using PipServices3.Commons.Data;
using System;
using System.Runtime.Serialization;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	[DataContract]
	public class SiteV1: IStringIdentifiable
	{
        [DataMember(Name = "id")] public string Id { get; set; }
        [DataMember(Name = "code")] public string Code { get; set; }
        [DataMember(Name = "create_time")] public DateTime? CreateTime { get; set; }
        [DataMember(Name = "creator_id")] public string CreatorId { get; set; }
        [DataMember(Name = "deleted")] public bool? Deleted { get; set; }
        [DataMember(Name = "active")] public bool? Active { get; set; }

        [DataMember(Name = "name")] public string Name { get; set; }
        [DataMember(Name = "description")] public string Description { get; set; }
        [DataMember(Name = "address")] public string Address { get; set; }

        [DataMember(Name = "center")] public CenterObjectV1 Center { get; set; } // GeoJSON
        [DataMember(Name = "radius")] public int? Radius { get; set; } // In km
        [DataMember(Name = "geometry")] public object Geometry { get; set; } //GeoJSON
        [DataMember(Name = "boundaries")] public object Boundaries { get; set; } //GeoJSON

        [DataMember(Name = "language")] public string Language { get; set; }
        [DataMember(Name = "timezone")] public string Timezone { get; set; }
        [DataMember(Name = "industry")] public string Industry { get; set; }
        [DataMember(Name = "org_size")] public int? OrgSize { get; set; }
        [DataMember(Name = "total_sites")] public int? TotalSites { get; set; }
        [DataMember(Name = "purpose")] public string Purpose { get; set; }
        [DataMember(Name = "params")] public object Params { get; set; }
    }
}
