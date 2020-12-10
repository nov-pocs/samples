using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	[DataContract]
	public class SessionV1: IStringIdentifiable
	{
		// Identification
		[DataMember(Name = "id")]
		public string Id { get; set; }
		[DataMember(Name = "user_id")]
		public string UserId { get; set; }
		[DataMember(Name = "user_name")]
		public string UserName { get; set; }

		// Session info
		[DataMember(Name = "active")]
		public bool Active { get; set; }
		[DataMember(Name = "open_time")]
		public DateTime OpenTime { get; set; }
		[DataMember(Name = "close_time")]
		public DateTime CloseTime { get; set; }
		[DataMember(Name = "request_time")]
		public DateTime RequestTime { get; set; }
		[DataMember(Name = "address")]
		public string Address { get; set; }
		[DataMember(Name = "client")]
		public string Client { get; set; }

		// Cached content
		[DataMember(Name = "user")]
		public object User { get; set; }
		[DataMember(Name = "data")]
		public object Data { get; set; }

		public SessionV1(string id, string user_id, string user_name,
			string address, string client)
		{
			Id = id ?? IdGenerator.NextLong();
			UserId = user_id;
			UserName = user_name;
			Active = true;
			OpenTime = DateTime.Now;
			RequestTime = DateTime.Now;
			Address = address;
			Client = client;
		}
	}
}
