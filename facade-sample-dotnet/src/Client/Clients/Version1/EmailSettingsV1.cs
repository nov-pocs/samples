using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	[DataContract]
	public class EmailSettingsV1: IStringIdentifiable
	{
        /* Recipient information */
        [DataMember(Name = "id")]
        public string Id { get; set; }
        [DataMember(Name = "name")]
        public string Name { get; set; }
        [DataMember(Name = "email")]
        public string Email { get; set; }
        [DataMember(Name = "language")]
        public string Language { get; set; }

        /* Email management */
        [DataMember(Name = "subscriptions")]
        public object Subscriptions { get; set; }
        [DataMember(Name = "verified")]
        public bool? Verified { get; set; }
        [DataMember(Name = "ver_code")]
        public string VerCode { get; set; }
        [DataMember(Name = "ver_expire_time")]
        public DateTime? VerExpireTime { get; set; }

        /* Custom fields */
        [DataMember(Name = "custom_hdr")]
        public object CustomHdr { get; set; }
        [DataMember(Name = "custom_dat")]
        public object CustomDat { get; set; }
    }
}
