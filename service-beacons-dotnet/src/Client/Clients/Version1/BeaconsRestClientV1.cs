using PipServices3.Commons.Config;
using PipServices3.Rpc.Clients;
using System.Net.Http;
using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Data;
using System;

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
			var methodName = "beacons.calculate_position";
			try
			{
				using (Instrument(correlationId, methodName))
				{
					return await ExecuteAsync<CenterObjectV1>(correlationId, HttpMethod.Post, "/calculate_position", new
					{
						site_id = siteId,
						udis = udis
					});
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex, true);
				return null;
			}
		}

		public async Task<BeaconV1> CreateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			var methodName = "beacons.create_beacon";
			try
			{
				using (Instrument(correlationId, methodName))
				{
					return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Post, "", new
					{
						beacon = beacon
					});
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex, true);
				return null;
			}
		}

		public async Task<BeaconV1> UpdateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			var methodName = "beacons.update_beacon";
			try
			{
				using (Instrument(correlationId, methodName))
				{
					return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Put, "", new
					{
						beacon = beacon
					});
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex, true);
				return null;
			}
		}

		public async Task<BeaconV1> DeleteBeaconByIdAsync(string correlationId, string id)
		{
			var methodName = "beacons.delete_beacon_by_id";
			try
			{
				using (Instrument(correlationId, methodName))
				{
					return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Delete, $"/{id}", new { });
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex, true);
				return null;
			}
		}

		public async Task<BeaconV1> GetBeaconByIdAsync(string correlationId, string id)
		{
			var methodName = "beacons.get_beacon_by_id";
			try
			{
				using (Instrument(correlationId, methodName))
				{
					return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Get, $"/{id}", new { });
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex, true);
				return null;

			}
		}

		public async Task<BeaconV1> GetBeaconByUdiAsync(string correlationId, string udi)
		{
			var methodName = "beacons.get_beacon_by_udi";
			try
			{
				using (Instrument(correlationId, methodName))
				{
					return await ExecuteAsync<BeaconV1>(correlationId, HttpMethod.Get, $"/udi/{udi}", new { });
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex, true);
				return null;
			}
		}

		public async Task<DataPage<BeaconV1>> GetBeaconsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			var methodName = "beacons.get_beacons";
			try
			{
				using (Instrument(correlationId, methodName))
				{
					return await ExecuteAsync<DataPage<BeaconV1>>(correlationId, HttpMethod.Get, "/", new
					{
						filter,
						paging
					});
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex, true);
				return null;
			}
		}
	}
}
