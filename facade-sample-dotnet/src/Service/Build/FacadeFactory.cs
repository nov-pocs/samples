using PipServices3.Commons.Refer;
using PipServices3.Components.Build;
using Nov.MaxApi.SampleFacade.Services.Version1;
using Nov.MaxApi.SampleFacade.Services.Version2;

namespace Nov.MaxApi.SampleFacade.Build
{
    public class FacadeFactory : Factory
    {
		public static Descriptor FacadeServiceV1Descriptor = new Descriptor("nov-facades-application", "service", "http", "*", "1.0");
		public static Descriptor FacadeServiceV2Descriptor = new Descriptor("nov-facades-application", "service", "http", "*", "2.0");


		public FacadeFactory()
        {
            RegisterAsType(FacadeServiceV1Descriptor, typeof(FacadeServiceV1));
            RegisterAsType(FacadeServiceV2Descriptor, typeof(FacadeServiceV2));
        }
    }
}