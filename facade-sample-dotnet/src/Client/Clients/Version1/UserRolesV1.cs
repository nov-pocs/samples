using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	[DataContract]
	public class UserRolesV1
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }

		[DataMember(Name = "roles")]
		public List<string> Roles { get; set; }

		[DataMember(Name = "update_time")]
		public DateTime UpdateTime { get; set; }

		public UserRolesV1(string id, List<string> roles)
		{
			Id = id;
			Roles = roles ?? new List<string>();
			UpdateTime = DateTime.Now;
		}
	}
}
