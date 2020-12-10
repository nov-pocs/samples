using PipServices3.Container;
using PipServices3.Rpc.Build;
using Nov.MaxApi.SampleFacade.Build;

namespace Nov.MaxApi.SampleFacade.Container
{
    public class FacadeProcess : ProcessContainer
    {
        public FacadeProcess() :
            base("nov-facades-application", "Sample facade for NOV")
        {
            _factories.Add(new ClientFacadeFactory());
            _factories.Add(new FacadeFactory());
            _factories.Add(new DefaultRpcFactory());
        }
    }
}