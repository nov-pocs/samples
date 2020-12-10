using PipServices3.Commons.Data;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public interface IRolesClientV1
    {
        Task<DataPage<UserRolesV1>> GetRolesByFilterAsync(string correlationId, FilterParams filter, PagingParams paging);

        Task<string[]> GetRolesByIdAsync(string correlationId, string userId);

        Task<string[]> SetRolesAsync(string correlationId, string userId, string[] roles);

        Task<string[]> GrantRolesAsync(string correlationId, string userId, string[] roles);

        Task<string[]> RevokeRolesAsync(string correlationId, string userId, string[] roles);

        Task<bool> AuthorizeAsync(string correlationId, string userId, string[] roles);
    }
}
