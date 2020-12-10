using System.Runtime.Serialization;

namespace Nov.MaxApi.SampleFacade.Operations.Version1
{
	[DataContract]
	public class SignupData
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }
		[DataMember(Name = "login")]
		public string Login { get; set; }
		[DataMember(Name = "name")]
		public string Name { get; set; }
		[DataMember(Name = "email")]
		public string Email { get; set; }

		[DataMember(Name = "time_zone")]
		public string TimeZone { get; set; }
		[DataMember(Name = "language")]
		public string Language { get; set; }
		[DataMember(Name = "theme")]
		public string Theme { get; set; }
		[DataMember(Name = "password")]
		public string Password { get; set; }
	}
}
