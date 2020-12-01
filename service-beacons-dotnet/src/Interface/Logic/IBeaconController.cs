using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Data;

namespace Nov.MaxSamples.Beacons.Logic
{
    public interface IBeaconsController
    {
        Task<DataPage<BeaconV1>> GetBeaconsAsync(string correlationId, FilterParams filter, PagingParams paging);
        Task<BeaconV1> GetBeaconByIdAsync(string correlationId, string id);
        Task<BeaconV1> GetBeaconByUdiAsync(string correlationId, string udi);
        Task<CenterObjectV1> CalculatePositionAsync(string correlationId, string siteId, string[] udis);
        Task<BeaconV1> CreateBeaconAsync(string correlationId, BeaconV1 beacon);
        Task<BeaconV1> UpdateBeaconAsync(string correlationId, BeaconV1 beacon);
        Task<BeaconV1> DeleteBeaconByIdAsync(string correlationId, string id);
    }
}
