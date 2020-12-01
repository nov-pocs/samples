using PipServices3.Commons.Config;
using PipServices3.Rpc.Clients;
using System.Net.Http;
using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Data;

namespace Nov.MaxSamples.Beacons.Clients.Version1
{
	public class BeaconsRestClientV1 : RestClient, IBeaconsClientV1
	{
		public BeaconsRestClientV1(object config = null)
		{
			_baseRoute = "v1/beacons";

			if (config != null)
				Configure(ConfigParams.FromValue(config));
		}

		public async Task<CenterObjectV1> CalculatePositionAsync(string correlationId, string siteId, string[] udis)
		{
			using (Instrument(correlationId, "beacons.calculate_position"))
			{
				return await ExecuteAsync<CenterObjectV1>(correlationId, HttpMethod.Post, "/calculate_position", new
				{
					site_id = siteId,
					udis = udis
				});
			}
		}

		public async Task<BeaconV1> CreateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			using (Instrument(correlationId, "beacons.create_beacon"))
			{
				return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Post, "/create_beacon", new
				{
					beacon = beacon
				});
			}
		}

		public async Task<BeaconV1> UpdateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			using (Instrument(correlationId, "beacons.update_beacon"))
			{
				return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Post, "/update_beacon", new
				{
					beacon = beacon
				});
			}
		}

		public async Task<BeaconV1> DeleteBeaconByIdAsync(string correlationId, string id)
		{
			using (Instrument(correlationId, "beacons.delete_beacon_by_id"))
			{
				return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Post, "/delete_beacon_by_id", new
				{
					beacon_id = id
				});
			}
		}

		public async Task<BeaconV1> GetBeaconByIdAsync(string correlationId, string id)
		{
			using (Instrument(correlationId, "beacons.get_beacon_by_id"))
			{
				return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Post, "/get_beacon_by_id", new
				{
					beacon_id = id
				});
			}
		}

		public async Task<BeaconV1> GetBeaconByUdiAsync(string correlationId, string udi)
		{
			using (Instrument(correlationId, "beacons.get_beacon_by_udi"))
			{
				return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Post, "/get_beacon_by_udi", new
				{
					udi = udi
				});
			}
		}

		public async Task<DataPage<BeaconV1>> GetBeaconsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			using (Instrument(correlationId, "beacons.get_beacons"))
			{
				return await ExecuteAsync<DataPage<BeaconV1>>(correlationId, HttpMethod.Post, "/get_beacons", new
				{
					filter,
					paging
				});
			}
		}
	}
}
