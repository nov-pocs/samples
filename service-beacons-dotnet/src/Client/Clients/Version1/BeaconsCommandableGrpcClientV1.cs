using System.Threading.Tasks;
using PipServices3.Grpc.Clients;
using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Data;

namespace Nov.MaxSamples.Beacons.Clients.Version1
{
	public class BeaconsCommandableGrpcClientV1 : CommandableGrpcClient, IBeaconsClientV1
	{
		public BeaconsCommandableGrpcClientV1()
			: base("beacons_v1")
		{
		}

		public async Task<CenterObjectV1> CalculatePositionAsync(string correlationId, string siteId, string[] udis)
		{
			correlationId ??= IdGenerator.NextLong();

			return await CallCommandAsync<CenterObjectV1>("calculate_position", correlationId, new
			{
				site_id = siteId,
				udis = udis
			});
		}

		public async Task<BeaconV1> CreateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			correlationId ??= IdGenerator.NextLong();

			return await CallCommandAsync<BeaconV1>("create_beacon", correlationId, new
			{
				beacon = beacon
			});
		}

		public async Task<BeaconV1> UpdateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			correlationId ??= IdGenerator.NextLong();

			return await CallCommandAsync<BeaconV1>("update_beacon", correlationId, new
			{
				beacon = beacon
			});
		}

		public async Task<BeaconV1> DeleteBeaconByIdAsync(string correlationId, string id)
		{
			correlationId ??= IdGenerator.NextLong();

			return await CallCommandAsync<BeaconV1>("delete_beacon_by_id", correlationId, new
			{
				beacon_id = id
			});
		}

		public async Task<BeaconV1> GetBeaconByIdAsync(string correlationId, string id)
		{
			correlationId ??= IdGenerator.NextLong();

			return await CallCommandAsync<BeaconV1>("get_beacon_by_id", correlationId, new
			{
				beacon_id = id
			});
		}

		public async Task<BeaconV1> GetBeaconByUdiAsync(string correlationId, string udi)
		{
			correlationId ??= IdGenerator.NextLong();

			return await CallCommandAsync<BeaconV1>("get_beacon_by_udi", correlationId, new
			{
				udi = udi
			});
		}

		public async Task<DataPage<BeaconV1>> GetBeaconsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			correlationId ??= IdGenerator.NextLong();

			return await CallCommandAsync<DataPage<BeaconV1>>("get_beacons", correlationId, new
			{
				filter,
				paging
			});
		}
	}
}
