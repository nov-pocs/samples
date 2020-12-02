using Nov.MaxSamples.Beacons.Data.Version1;
using BeaconsV1;
using PipServices3.Commons.Data;
using PipServices3.Commons.Data.Mapper;
using PipServices3.Commons.Errors;
using PipServices3.Grpc.Clients;
using System;
using System.Threading.Tasks;
using BeaconV1 = Nov.MaxSamples.Beacons.Data.Version1.BeaconV1;
using PagingParams = PipServices3.Commons.Data.PagingParams;

namespace Nov.MaxSamples.Beacons.Clients.Version1
{
	public class BeaconsGrpcClientV1 : GrpcClient, IBeaconsClientV1
	{
		public BeaconsGrpcClientV1()
			: base("beacons_v1")
		{
		}

		public async Task<CenterObjectV1> CalculatePositionAsync(string correlationId, string siteId, string[] udis)
		{
			correlationId ??= IdGenerator.NextLong();

			var methodName = "calculate_position";
			var timing = Instrument(correlationId, methodName);
			try
			{
				var request = new BeaconV1PositionRequest
				{
					CorrelationId = correlationId,
					SiteId = siteId
				};
				request.Udis.AddRange(udis);

				var response = await CallAsync<BeaconV1PositionRequest, BeaconV1PositionReply>(methodName, request);

				if (response != null)
				{
					HandleError(response.Error);
					return BeaconsGrpcConverterV1.ToPosition(response.Point);
				}

				return null;
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				throw ex;
			}
			finally
			{
				timing.EndTiming();
			}
		}

		public async Task<BeaconV1> CreateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			correlationId ??= IdGenerator.NextLong();

			var methodName = "create_beacon";
			var timing = Instrument(correlationId, methodName);
			try
			{
				var request = new BeaconV1ObjectRequest
				{
					CorrelationId = correlationId,
					Beacon = BeaconsGrpcConverterV1.FromBeacon(beacon)
				};

				var response = await CallAsync<BeaconV1ObjectRequest, BeaconV1ObjectReply>(methodName, request);

				if (response != null)
				{
					HandleError(response.Error);
					return BeaconsGrpcConverterV1.ToBeacon(response.Beacon);
				}

				return null;
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				throw ex;
			}
			finally
			{
				timing.EndTiming();
			}
		}

		public async Task<BeaconV1> UpdateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			correlationId ??= IdGenerator.NextLong();

			var methodName = "update_beacon";
			var timing = Instrument(correlationId, methodName);
			try
			{
				var request = new BeaconV1ObjectRequest
				{
					CorrelationId = correlationId,
					Beacon = BeaconsGrpcConverterV1.FromBeacon(beacon)
				};

				var response = await CallAsync<BeaconV1ObjectRequest, BeaconV1ObjectReply>(methodName, request);

				if (response != null)
				{
					HandleError(response.Error);
					return BeaconsGrpcConverterV1.ToBeacon(response.Beacon);
				}

				return null;
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				throw ex;
			}
			finally
			{
				timing.EndTiming();
			}
		}

		public async Task<BeaconV1> DeleteBeaconByIdAsync(string correlationId, string id)
		{
			correlationId ??= IdGenerator.NextLong();

			var methodName = "delete_beacon_by_id";
			var timing = Instrument(correlationId, methodName);
			try
			{
				var request = new BeaconV1IdRequest
				{
					CorrelationId = correlationId,
					BeaconId = id
				};

				var response = await CallAsync<BeaconV1IdRequest, BeaconV1ObjectReply>(methodName, request);

				if (response != null)
				{
					HandleError(response.Error);
					return BeaconsGrpcConverterV1.ToBeacon(response.Beacon);
				}

				return null;
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				throw ex;
			}
			finally
			{
				timing.EndTiming();
			}
		}

		public async Task<BeaconV1> GetBeaconByIdAsync(string correlationId, string id)
		{
			correlationId ??= IdGenerator.NextLong();

			var methodName = "get_beacon_by_id";
			var timing = Instrument(correlationId, methodName);
			try
			{
				var request = new BeaconV1IdRequest
				{
					CorrelationId = correlationId,
					BeaconId = id
				};

				var response = await CallAsync<BeaconV1IdRequest, BeaconV1ObjectReply>(methodName, request);

				if (response != null)
				{
					HandleError(response.Error);
					return BeaconsGrpcConverterV1.ToBeacon(response.Beacon);
				}

				return null;
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				throw ex;
			}
			finally
			{
				timing.EndTiming();
			}
		}

		public async Task<BeaconV1> GetBeaconByUdiAsync(string correlationId, string udi)
		{
			correlationId ??= IdGenerator.NextLong();

			var methodName = "get_beacon_by_udi";
			var timing = Instrument(correlationId, methodName);
			try
			{
				var request = new BeaconV1UdiRequest
				{
					CorrelationId = correlationId,
					BeaconUdi = udi
				};

				var response = await CallAsync<BeaconV1UdiRequest, BeaconV1ObjectReply>(methodName, request);

				if (response != null)
				{
					HandleError(response.Error);
					return BeaconsGrpcConverterV1.ToBeacon(response.Beacon);
				}

				return null;
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				throw ex;
			}
			finally
			{
				timing.EndTiming();
			}
		}

		public async Task<DataPage<BeaconV1>> GetBeaconsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			correlationId ??= IdGenerator.NextLong();

			var methodName = "get_beacons";
			var timing = Instrument(correlationId, methodName);
			try
			{
				var request = new BeaconV1PageRequest
				{
					CorrelationId = correlationId,
					Paging = BeaconsGrpcConverterV1.FromPaging(paging),
				};

				BeaconsGrpcConverterV1.SetMap(request.Filter, filter);

				var response = await CallAsync<BeaconV1PageRequest, BeaconV1PageReply>(methodName, request);

				if (response != null)
				{
					HandleError(response.Error);
					return BeaconsGrpcConverterV1.ToBeaconsPage(response.Page);
				}

				return null;
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				throw ex;
			}
			finally
			{
				timing.EndTiming();
			}
		}

		private void HandleError(BeaconsV1.ErrorDescription error)
		{
			// Handle error response
			if (error != null)
			{
				var errorDescription = ObjectMapper.MapTo<PipServices3.Commons.Errors.ErrorDescription>(error);
				throw ApplicationExceptionFactory.Create(errorDescription);
			}
		}
	}
}
