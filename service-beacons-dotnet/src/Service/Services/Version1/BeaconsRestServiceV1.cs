using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Nov.MaxSamples.Beacons.Data.Version1;
using Nov.MaxSamples.Beacons.Logic;
using PipServices3.Commons.Convert;
using PipServices3.Commons.Data;
using PipServices3.Commons.Refer;
using PipServices3.Commons.Run;
using PipServices3.Rpc.Auth;
using PipServices3.Rpc.Services;
using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
	public class BeaconsRestServiceV1 : RestService
	{
		private IBeaconsController _controller;

		public BeaconsRestServiceV1()
		{
			_baseRoute = "v1/beacons";
			_dependencyResolver.Put("controller", new Descriptor("beacons", "controller", "default", "*", "*"));
		}

		public override void SetReferences(IReferences references)
		{
			base.SetReferences(references);
			_controller = _dependencyResolver.GetOneRequired<IBeaconsController>("controller");
		}

		private async Task GetBeaconsAsync(HttpRequest request, HttpResponse response, RouteData routeData)
		{
			var correlationId = GetCorrelationId(request);
			var methodName = $"{_baseRoute}.get_beacons";

			try
			{
				var filter = GetFilterParams(request);
				var paging = GetPagingParams(request);

				using var timing = Instrument(correlationId, methodName);
				var result = await _controller.GetBeaconsAsync(
					correlationId,
					filter,
					paging
				);

				await SendResultAsync(response, result);
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				await SendErrorAsync(response, ex);
			}
		}

		private async Task GetBeaconByIdAsync(HttpRequest request, HttpResponse response, RouteData routeData)
		{
			var correlationId = GetCorrelationId(request);
			var methodName = $"{_baseRoute}.get_beacon_by_id";
			
			try
			{
				var parameters = GetParameters(request);
				var id = parameters.GetAsString("id");

				var result = await _controller.GetBeaconByIdAsync(
					correlationId,
					id
				);

				await SendResultAsync(response, result);
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				await SendErrorAsync(response, ex);
			}
		}

		private async Task GetBeaconByUdiAsync(HttpRequest request, HttpResponse response, RouteData routeData)
		{
			var correlationId = GetCorrelationId(request);
			var methodName = $"{_baseRoute}.get_beacon_by_udi";

			try
			{
				var parameters = GetParameters(request);
				var udi = parameters.GetAsString("udi");

				var result = await _controller.GetBeaconByUdiAsync(
					correlationId,
					udi
				);

				await SendResultAsync(response, result);
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				await SendErrorAsync(response, ex);
			}
		}

		private async Task CalculatePositionAsync(HttpRequest request, HttpResponse response, RouteData routeData)
		{
			var correlationId = GetCorrelationId(request);
			var methodName = $"{_baseRoute}.calculate_position";

			try
			{
				var parameters = GetParameters(request);
				var siteId = parameters.GetAsString("site_id");
				string[] udis = ConvertToStringList(parameters.Get("udis"));

				var result = await _controller.CalculatePositionAsync(
					correlationId,
					siteId,
					udis
				);

				await SendResultAsync(response, result);
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				await SendErrorAsync(response, ex);
			}
		}

		private async Task CreateBeaconAsync(HttpRequest request, HttpResponse response, RouteData routeData)
		{
			var correlationId = GetCorrelationId(request);
			var methodName = $"{_baseRoute}.create_beacon";

			try
			{
				var parameters = GetParameters(request);
				var beacon = ConvertToBeacon(parameters.GetAsObject("beacon"));

				var result = await _controller.CreateBeaconAsync(
					correlationId,
					beacon
				);

				await SendResultAsync(response, result);
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				await SendErrorAsync(response, ex);
			}
		}

		private async Task UpdateBeaconAsync(HttpRequest request, HttpResponse response, RouteData routeData)
		{
			var correlationId = GetCorrelationId(request);
			var methodName = $"{_baseRoute}.update_beacon";

			try
			{
				var parameters = GetParameters(request);
				var beacon = ConvertToBeacon(parameters.GetAsObject("beacon"));

				var result = await _controller.UpdateBeaconAsync(
					correlationId,
					beacon
				);

				await SendResultAsync(response, result);
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				await SendErrorAsync(response, ex);
			}
		}

		private async Task DeleteBeaconByIdAsync(HttpRequest request, HttpResponse response, RouteData routeData)
		{
			var correlationId = GetCorrelationId(request);
			var methodName = $"{_baseRoute}.delete_beacon_by_id";

			try
			{
				var parameters = GetParameters(request);
				var id = parameters.GetAsString("id");

				var result = await _controller.DeleteBeaconByIdAsync(
					correlationId,
					id
				);

				await SendResultAsync(response, result);
			}
			catch (Exception ex)
			{
				InstrumentError(correlationId, methodName, ex);
				await SendErrorAsync(response, ex);
			}
		}

		public override void Register()
		{
			RegisterRoute("get", "/", GetBeaconsAsync);
			RegisterRoute("get", "/{id}", GetBeaconByIdAsync);
			RegisterRoute("get", "/udi/{udi}", GetBeaconByUdiAsync);
			RegisterRoute("post", "/", CreateBeaconAsync);
			RegisterRoute("put", "/", UpdateBeaconAsync);
			RegisterRoute("delete", "/{id}", DeleteBeaconByIdAsync);
			RegisterRoute("post", "/calculate_position", CalculatePositionAsync);

			RegisterOpenApiSpecFromResource("beacons_rest_v1.yaml");
		}

		private BeaconV1 ConvertToBeacon(object value)
		{
			return JsonConverter.FromJson<BeaconV1>(JsonConverter.ToJson(value));
		}

		private string[] ConvertToStringList(object value)
		{
			return JsonConverter.FromJson<string[]>(JsonConverter.ToJson(value));
		}
	}
}
