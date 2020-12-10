using PipServices3.Commons.Data;
using System;
using System.Runtime.Serialization;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	[DataContract]
	public class UserPasswordInfoV1: IStringIdentifiable
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }
		[DataMember(Name = "change_time")]
		public DateTime ChangeTime { get; set; }
		[DataMember(Name = "locked")]
		public bool Locked { get; set; }
		[DataMember(Name = "lock_time")]
		public DateTime LockTime { get; set; }
	}
}
