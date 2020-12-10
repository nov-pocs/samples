using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	[DataContract]
	public class AccountV1: IStringIdentifiable
	{
		public AccountV1()
		{ 
		}

		public AccountV1(string id, string login, string name)
		{ 
			Id = id ?? IdGenerator.NextLong();
			Login = login;
			Name = name;

			CreateTime = DateTime.Now;
			Active = true;
		}
		
		// Identification
		[DataMember(Name = "id")]
		public string Id { get; set; }
		[DataMember(Name = "login")]
		public string Login { get; set; }
		[DataMember(Name = "name")]
		public string Name { get; set; }

		// Activity tracking
		[DataMember(Name = "create_time")]
		public DateTime CreateTime { get; set; }
		[DataMember(Name = "deleted")]
		public bool? Deleted { get; set; }
		[DataMember(Name = "active")]
		public bool Active { get; set; }

		// User preferences
		[DataMember(Name = "time_zone")]
		public string TimeZone { get; set; }
		[DataMember(Name = "language")]
		public string Language { get; set; }
		[DataMember(Name = "theme")]
		public string Theme { get; set; }

		// Custom fields
		[DataMember(Name = "custom_hdr")]
		public object CustomHdr { get; set; }
		[DataMember(Name = "custom_dat")]
		public object CustomDat { get; set; }



	}
}
