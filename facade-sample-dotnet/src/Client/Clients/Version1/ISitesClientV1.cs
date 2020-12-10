using PipServices3.Commons.Data;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public interface ISitesClientV1
    {
        Task<DataPage<SiteV1>> GetSitesAsync(string correlationId, FilterParams filter, PagingParams paging);

        Task<SiteV1> GetSiteByIdAsync(string correlationId, string site_id);

        Task<SiteV1> GetSiteByCodeAsync(string correlationId, string code);

        Task<string> GenerateCodeAsync(string correlationId, string site_id);

        Task<SiteV1> CreateSiteAsync(string correlationId, SiteV1 site);

        Task<SiteV1> UpdateSiteAsync(string correlationId, SiteV1 site);

        Task<SiteV1> DeleteSiteByIdAsync(string correlationId, string site_id);
    }
}
