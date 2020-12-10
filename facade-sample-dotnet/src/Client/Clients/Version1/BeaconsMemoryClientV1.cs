using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class BeaconsMemoryClientV1 : IBeaconsClientV1
	{
		private int _maxPageSize = 100;
		private List<BeaconV1> _beacons = new List<BeaconV1>();

		private List<Func<BeaconV1, bool>> ComposeFilter(FilterParams filter)
		{
			filter = filter ?? new FilterParams();

			var id = filter.GetAsNullableString("id");
			var siteId = filter.GetAsNullableString("site_id");
			var label = filter.GetAsNullableString("label");
			var udi = filter.GetAsNullableString("udi");
			var udis = ConvertToArray(filter.GetAsObject("udis"));

			return new List<Func<BeaconV1, bool>> {
				item =>
				{
					if (id != null && item.Id != id)
						return false;
					if (siteId != null && item.SiteId != siteId)
						return false;
					if (label != null && item.Label != label)
						return false;
					if (udi != null && item.Udi != udi)
						return false;
					if (udis != null && !udis.Contains(item.Udi))
						return false;
					return true;
				}
			};
		}

		private string[] ConvertToArray(object value)
		{
			if (value is string[] arr) return arr;
			if (value is string str)
			{
				return str.Split(',');
			}
			return null;
		}

		private static BeaconV1 Clone(BeaconV1 beacon)
		{
			beacon = new BeaconV1
			{
				Id = beacon.Id,
				Udi = beacon.Udi,
				Label = beacon.Label,
				Radius = beacon.Radius,
				SiteId = beacon.SiteId,
				Type = beacon.Type,
				Center = beacon.Center == null ? null : new CenterObjectV1
				{
					Type = beacon.Center.Type,
					Coordinates = beacon.Center.Coordinates
				}
			};

			return beacon;
		}

		public async Task<CenterObjectV1> CalculatePositionAsync(string correlationId, string siteId, string[] udis)
		{
			if (udis == null || udis.Length == 0) return null;

			var page = await GetBeaconsAsync(
				correlationId,
				FilterParams.FromTuples("site_id", siteId, "udis", udis),
				null
			);

			var lat = 0.0;
			var lng = 0.0;
			var count = 0;

			foreach (var beacon in page.Data)
			{
				if (beacon.Center != null
					&& beacon.Center.Type == "Point"
					&& beacon.Center.Coordinates.Length > 1)
				{
					lng += beacon.Center.Coordinates[0];
					lat += beacon.Center.Coordinates[1];
					count += 1;
				}
			}

			if (count > 0)
			{
				return new CenterObjectV1
				{
					Type = "Point",
					Coordinates = new double[] { lng / count, lat / count }
				};
			}

			return null;
		}

		public async Task<BeaconV1> CreateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			beacon.Id = beacon.Id ?? IdGenerator.NextLong();
			beacon.Type = beacon.Type ?? "unknown";

			beacon = Clone(beacon);
			_beacons.Add(beacon);

			return await Task.FromResult(beacon);
		}

		public async Task<BeaconV1> DeleteBeaconByIdAsync(string correlationId, string id)
		{
			var beacon = _beacons.FirstOrDefault(x => x.Id == id);
			if (beacon != null)
				_beacons.Remove(beacon);

			return await Task.FromResult(beacon);
		}

		public async Task<BeaconV1> GetBeaconByIdAsync(string correlationId, string id)
		{
			return await Task.FromResult(_beacons.FirstOrDefault(x => x.Id == id));
		}

		public async Task<BeaconV1> GetBeaconByUdiAsync(string correlationId, string udi)
		{
			return await Task.FromResult(_beacons.FirstOrDefault(x => x.Udi == udi));
		}

		public async Task<DataPage<BeaconV1>> GetBeaconsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			var filterCurl = ComposeFilter(filter);
			var beacons = _beacons.Where(x => filterCurl.All(f => f(x))).ToList();

			// Extract a page
			paging = paging != null ? paging : new PagingParams();
			var skip = paging.GetSkip(-1);
			var take = paging.GetTake(_maxPageSize);

			long? total = null;
			if (paging.Total)
				total = beacons.Count;

			beacons = beacons.Skip((int)skip).Take((int)take).ToList();

			var page = new DataPage<BeaconV1>(beacons, total);
			return await Task.FromResult(page);
		}

		public async Task<BeaconV1> UpdateBeaconAsync(string correlationId, BeaconV1 beacon)
		{
			var item = _beacons.FirstOrDefault(x => x.Id == beacon.Id);
			if (item == null) return null;

			int index = _beacons.IndexOf(item);
			_beacons[index] = Clone(beacon);

			return await Task.FromResult(_beacons[index]);
		}
	}
}
