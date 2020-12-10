using PipServices3.Commons.Data;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public interface ISessionsClientV1
    {
        Task<DataPage<SessionV1>> GetSessionsAsync(string correlationId, FilterParams filter, PagingParams paging);

        Task<SessionV1> GetSessionByIdAsync(string correlationId, string sessionId);

        Task<SessionV1> OpenSessionAsync(string correlationId, string user_id, string user_name,
            string address, string client, object user, object data);

        Task<SessionV1> StoreSessionDataAsync(string correlationId, string sessionId, object data);

        Task<SessionV1> UpdateSessionUserAsync(string correlationId, string sessionId, object user);

        Task<SessionV1> CloseSessionAsync(string correlationId, string sessionId);

        Task<SessionV1> DeleteSessionByIdAsync(string correlationId, string sessionId);
    }
}
