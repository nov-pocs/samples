using Nov.MaxSamples.Beacons.Logic;
using BeaconsV1;
using Grpc.Core;
using PipServices3.Commons.Data;
using PipServices3.Commons.Data.Mapper;
using PipServices3.Commons.Errors;
using PipServices3.Commons.Refer;
using PipServices3.Grpc.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
	public class BeaconsGrpcServiceV1 : GrpcService
	{
		private IBeaconsController _controller;

		public BeaconsGrpcServiceV1()
			: this("beacons_v1")
		{
		}

		public BeaconsGrpcServiceV1(string name)
			: base(name)
		{
			_dependencyResolver.Put("controller", new Descriptor("beacons", "controller", "default", "*", "*"));
		}

		public override void SetReferences(IReferences references)
		{
			base.SetReferences(references);
			_controller = _dependencyResolver.GetOneRequired<IBeaconsController>("controller");
		}

		private async Task<BeaconV1PageReply> GetBeaconsAsync(BeaconV1PageRequest request, ServerCallContext context)
		{
			var correlationId = request.CorrelationId;
			var methodName = _serviceName + ".get_beacons";

			var response = new BeaconV1PageReply();

			var filter = new FilterParams(request.Filter);
			var paging = new PipServices3.Commons.Data.PagingParams(request.Paging.Skip, request.Paging.Take, request.Paging.Total);

			try
			{
				using (var timing = Instrument(correlationId, methodName))
				{
					var result = await _controller.GetBeaconsAsync(
						correlationId,
						filter,
						paging
					);

					response.Page = BeaconsGrpcConverterV1.FromBeaconsPage(result);
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				response.Error = ObjectMapper.MapTo<BeaconsV1.ErrorDescription>(ErrorDescriptionFactory.Create(ex));
			}

			return response;
		}

		private async Task<BeaconV1ObjectReply> GetBeaconByIdAsync(BeaconV1IdRequest request, ServerCallContext context)
		{
			var correlationId = request.CorrelationId;
			var methodName = _serviceName + ".get_beacon_by_id";

			var response = new BeaconV1ObjectReply();

			try
			{
				using (var timing = Instrument(correlationId, methodName))
				{
					var result = await _controller.GetBeaconByIdAsync(
						correlationId,
						request.BeaconId
					);

					response.Beacon = BeaconsGrpcConverterV1.FromBeacon(result);
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				response.Error = ObjectMapper.MapTo<BeaconsV1.ErrorDescription>(ErrorDescriptionFactory.Create(ex));
			}

			return response;
		}

		private async Task<BeaconV1ObjectReply> GetBeaconByUdiAsync(BeaconV1UdiRequest request, ServerCallContext context)
		{
			var correlationId = request.CorrelationId;
			var methodName = _serviceName + ".get_beacon_by_id";

			var response = new BeaconV1ObjectReply();

			try
			{
				using (var timing = Instrument(correlationId, methodName))
				{
					var result = await _controller.GetBeaconByUdiAsync(
						correlationId,
						request.BeaconUdi
					);

					response.Beacon = BeaconsGrpcConverterV1.FromBeacon(result);
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				response.Error = ObjectMapper.MapTo<BeaconsV1.ErrorDescription>(ErrorDescriptionFactory.Create(ex));
			}

			return response;
		}

		private async Task<BeaconV1PositionReply> CalculatePositionAsync(BeaconV1PositionRequest request, ServerCallContext context)
		{
			var correlationId = request.CorrelationId;
			var methodName = _serviceName + ".calculate_position";

			var response = new BeaconV1PositionReply();

			try
			{
				using (var timing = Instrument(correlationId, methodName))
				{
					var result = await _controller.CalculatePositionAsync(
						correlationId,
						request.SiteId,
						request.Udis.ToArray()
					);

					response.Point = BeaconsGrpcConverterV1.FromPosition(result);
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				response.Error = ObjectMapper.MapTo<BeaconsV1.ErrorDescription>(ErrorDescriptionFactory.Create(ex));
			}

			return response;
		}

		private async Task<BeaconV1ObjectReply> CreateBeaconAsync(BeaconV1ObjectRequest request, ServerCallContext context)
		{
			var correlationId = request.CorrelationId;
			var methodName = _serviceName + ".create_beacon";

			var response = new BeaconV1ObjectReply();

			try
			{
				using (var timing = Instrument(correlationId, methodName))
				{
					var result = await _controller.CreateBeaconAsync(
						correlationId,
						BeaconsGrpcConverterV1.ToBeacon(request.Beacon)
					);

					response.Beacon = BeaconsGrpcConverterV1.FromBeacon(result);
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				response.Error = ObjectMapper.MapTo<BeaconsV1.ErrorDescription>(ErrorDescriptionFactory.Create(ex));
			}

			return response;
		}

		private async Task<BeaconV1ObjectReply> UpdateBeaconAsync(BeaconV1ObjectRequest request, ServerCallContext context)
		{
			var correlationId = request.CorrelationId;
			var methodName = _serviceName + ".update_beacon";

			var response = new BeaconV1ObjectReply();

			try
			{
				using (var timing = Instrument(correlationId, methodName))
				{
					var result = await _controller.UpdateBeaconAsync(
						correlationId,
						BeaconsGrpcConverterV1.ToBeacon(request.Beacon)
					);

					response.Beacon = BeaconsGrpcConverterV1.FromBeacon(result);
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				response.Error = ObjectMapper.MapTo<BeaconsV1.ErrorDescription>(ErrorDescriptionFactory.Create(ex));
			}

			return response;
		}


		private async Task<BeaconV1ObjectReply> DeleteBeaconByIdAsync(BeaconV1IdRequest request, ServerCallContext context)
		{
			var correlationId = request.CorrelationId;
			var methodName = _serviceName + ".delete_beacon_by_id";

			var response = new BeaconV1ObjectReply();

			try
			{
				using (var timing = Instrument(correlationId, methodName))
				{
					var result = await _controller.DeleteBeaconByIdAsync(
						correlationId,
						request.BeaconId
					);

					response.Beacon = BeaconsGrpcConverterV1.FromBeacon(result);
				}
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				response.Error = ObjectMapper.MapTo<BeaconsV1.ErrorDescription>(ErrorDescriptionFactory.Create(ex));
			}

			return response;
		}

		protected override void OnRegister()
		{
			RegisterMethod<BeaconV1PageRequest, BeaconV1PageReply>("get_beacons", GetBeaconsAsync);
			RegisterMethod<BeaconV1IdRequest, BeaconV1ObjectReply>("get_beacon_by_id", GetBeaconByIdAsync);
			RegisterMethod<BeaconV1UdiRequest, BeaconV1ObjectReply>("get_beacon_by_udi", GetBeaconByUdiAsync);
			RegisterMethod<BeaconV1PositionRequest, BeaconV1PositionReply>("calculate_position", CalculatePositionAsync);
			RegisterMethod<BeaconV1ObjectRequest, BeaconV1ObjectReply>("create_beacon", CreateBeaconAsync);
			RegisterMethod<BeaconV1ObjectRequest, BeaconV1ObjectReply>("update_beacon", UpdateBeaconAsync);
			RegisterMethod<BeaconV1IdRequest, BeaconV1ObjectReply>("delete_beacon_by_id", DeleteBeaconByIdAsync);
		}
	}
}
