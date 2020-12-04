using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Data;

namespace Nov.MaxSamples.Beacons.Clients.Version1
{
    public class BeaconsNullClientV1 : IBeaconsClientV1
    {
        public async Task<DataPage<BeaconV1>> GetBeaconsAsync(
            string correlationId, FilterParams filter, PagingParams paging)
        {
            return await Task.FromResult(new DataPage<BeaconV1>());
        }

        public async Task<BeaconV1> GetBeaconByIdAsync(string correlationId, string id)
        {
            return await Task.FromResult<BeaconV1>(null);
        }

        public async Task<BeaconV1> GetBeaconByUdiAsync(string correlationId, string udi)
        {
            return await Task.FromResult<BeaconV1>(null);
        }

        public async Task<CenterObjectV1> CalculatePositionAsync(
            string correlationId, string siteId, string[] udis)
        {
            return await Task.FromResult<CenterObjectV1>(null);
        }

        public async Task<BeaconV1> CreateBeaconAsync(string correlationId, BeaconV1 beacon)
        {
            return await Task.FromResult<BeaconV1>(null);
        }

        public async Task<BeaconV1> UpdateBeaconAsync(string correlationId, BeaconV1 beacon)
        {
            return await Task.FromResult<BeaconV1>(null);
        }

        public async Task<BeaconV1> DeleteBeaconByIdAsync(string correlationId, string id)
        {
            return await Task.FromResult<BeaconV1>(null);
        }
    }
}
