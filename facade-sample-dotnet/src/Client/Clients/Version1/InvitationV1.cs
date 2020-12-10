using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
    [DataContract]
	public class InvitationV1: IStringIdentifiable
	{
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "action")]
        public string Action { get; set; }
        [DataMember(Name = "site_id")]
        public string SiteId { get; set; }
        [DataMember(Name = "site_name")]
        public string SiteName { get; set; }
        [DataMember(Name = "role")]
        public string Role { get; set; }

        [DataMember(Name = "create_time")]
        public DateTime CreateTime { get; set; }
        [DataMember(Name = "creator_name")]
        public string CreatorName { get; set; }
        [DataMember(Name = "creator_id")]
        public string CreatorId { get; set; }

        [DataMember(Name = "invitee_name")]
        public string InviteeName { get; set; }
        [DataMember(Name = "invitee_email")]
        public string InviteeEmail { get; set; }
        [DataMember(Name = "invitee_id")]
        public string InviteeId { get; set; }

        [DataMember(Name = "sent_time")]
        public DateTime SentTime { get; set; }
        [DataMember(Name = "expire_time")]
        public DateTime ExpireTime { get; set; }
    }
}
