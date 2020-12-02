using Microsoft.AspNetCore.Http;
using Nov.MaxSamples.Beacons.Data.Version1;
using Nov.MaxSamples.Beacons.Logic;
using PipServices3.Commons.Convert;
using PipServices3.Commons.Data;
using PipServices3.Commons.Refer;
using PipServices3.Commons.Run;
using PipServices3.Rpc.Services;
using System;
using System.IO;
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

		private async Task<object> GetBeaconsAsync(string correlationId, Parameters parameters)
		{
			var filter = FilterParams.FromValue(parameters.Get("filter"));
			var paging = PagingParams.FromValue(parameters.Get("paging"));

			return await _controller.GetBeaconsAsync(
				correlationId,
				filter,
				paging
			);
		}

		private async Task<object> GetBeaconByIdAsync(string correlationId, Parameters parameters)
		{
			var id = parameters.GetAsString("beacon_id");

			return await _controller.GetBeaconByIdAsync(
				correlationId,
				id
			);
		}

		private async Task<object> GetBeaconByUdiAsync(string correlationId, Parameters parameters)
		{
			var udi = parameters.GetAsString("udi");

			return await _controller.GetBeaconByUdiAsync(
				correlationId,
				udi
			);
		}

		private async Task<object> CalculatePositionAsync(string correlationId, Parameters parameters)
		{
			var siteId = parameters.GetAsString("site_id");
			string[] udis = ConvertToStringList(parameters.Get("udis"));

			return await _controller.CalculatePositionAsync(
				correlationId,
				siteId,
				udis
			);
		}

		private async Task<object> CreateBeaconAsync(string correlationId, Parameters parameters)
		{
			var beacon = ConvertToBeacon(parameters.GetAsObject("beacon"));

			return await _controller.CreateBeaconAsync(
				correlationId,
				beacon
			);
		}

		private async Task<object> UpdateBeaconAsync(string correlationId, Parameters parameters)
		{
			var beacon = ConvertToBeacon(parameters.GetAsObject("beacon"));

			return await _controller.UpdateBeaconAsync(
				correlationId,
				beacon
			);
		}

		private async Task<object> DeleteBeaconByIdAsync(string correlationId, Parameters parameters)
		{
			var id = parameters.GetAsString("beacon_id");

			return await _controller.DeleteBeaconByIdAsync(
				correlationId,
				id
			);
		}

		public override void Register()
		{
			RegisterRoute("post", "/get_beacons", GetBeaconsAsync);
			RegisterRoute("post", "/get_beacon_by_id", GetBeaconByIdAsync);
			RegisterRoute("post", "/get_beacon_by_udi", GetBeaconByUdiAsync);
			RegisterRoute("post", "/calculate_position", CalculatePositionAsync);
			RegisterRoute("post", "/create_beacon", CreateBeaconAsync);
			RegisterRoute("post", "/update_beacon", UpdateBeaconAsync);
			RegisterRoute("post", "/delete_beacon_by_id", DeleteBeaconByIdAsync);

			RegisterOpenApiSpecFromResource("beacons_v1.yaml");
		}

		private void RegisterRoute(string method, string route, Func<string, Parameters, Task<object>> func)
		{
			base.RegisterRoute(method, route, async (request, response, routeData) =>
			{
				string name = route.Trim('/');
				var correlationId = "";

				try
				{
					var body = string.Empty;

					using (var streamReader = new StreamReader(request.Body))
					{
						body = streamReader.ReadToEnd();
					}

					var parameters = LoadQueryParameters(request.Query);
					if (!string.IsNullOrEmpty(body))
					{
						var bodyParameters = Parameters.FromJson(body);
						foreach (var key in bodyParameters.Keys)
						{
							parameters[key] = bodyParameters[key];
						}
					}

					correlationId = parameters.GetAsStringWithDefault("correlation_id", string.Empty);

					using (var timing = Instrument(correlationId, _baseRoute + '.' + name))
					{
						var result = await func(correlationId, parameters);
						await SendResultAsync(response, result);
					}
				}
				catch (Exception ex)
				{
					InstrumentError(correlationId, _baseRoute + '.' + name, ex);
					await SendErrorAsync(response, ex);
				}
			});
		}

		private Parameters LoadQueryParameters(IQueryCollection query)
		{
			Parameters result = new Parameters();

			foreach (var key in query.Keys)
			{
				result.Add(key, query[key].ToString());
			}

			return result;
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
