using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
	public class BeaconsGrpcConverterV1
	{
		public static BeaconsV1.BeaconV1 FromBeacon(Data.Version1.BeaconV1 item)
		{
			if (item == null) return null;

			var beacon = new BeaconsV1.BeaconV1
			{
				Id = item.Id,
				Udi = item.Udi,
				Label = item.Label,
				Radius = Convert.ToSingle(item.Radius),
				SiteId = item.SiteId,
				Type = item.Type,
				Center = FromPosition(item.Center)
			};

			return beacon;
		}

		public static Data.Version1.BeaconV1 ToBeacon(BeaconsV1.BeaconV1 item)
		{
			if (item == null) return null;

			var beacon = new Data.Version1.BeaconV1
			{
				Id = item.Id,
				Udi = item.Udi,
				Label = item.Label,
				Radius = item.Radius,
				SiteId = item.SiteId,
				Type = item.Type,
				Center = ToPosition(item.Center)
			};

			return beacon;
		}

		public static BeaconsV1.BeaconV1Page FromBeaconsPage(DataPage<Data.Version1.BeaconV1> page)
		{
			if (page == null) return null;

			var beaconPage = new BeaconsV1.BeaconV1Page()
			{
				Total = page.Total ?? 0
			};

			beaconPage.Data.AddRange(page.Data.Select(x => FromBeacon(x)));

			return beaconPage;
		}

		public static DataPage<Data.Version1.BeaconV1> ToBeaconsPage(BeaconsV1.BeaconV1Page page)
		{
			if (page == null) return null;

			var beaconPage = new DataPage<Data.Version1.BeaconV1>(page.Data.Select(x => ToBeacon(x)).ToList(), page.Total);

			return beaconPage;
		}

		public static BeaconsV1.GeoPointV1 FromPosition(Data.Version1.CenterObjectV1 item)
		{
			if (item == null) return null;

			var point = new BeaconsV1.GeoPointV1()
			{
				Type = item.Type
			};

			if (item.Coordinates != null)
			{
				var array = new BeaconsV1.InternalArray();
				array.InternalArray_.AddRange(item.Coordinates.Select(x => Convert.ToSingle(x)));

				point.Coordinates.Add(array);
			}

			return point;
		}

		private static Data.Version1.CenterObjectV1 ToPosition(BeaconsV1.GeoPointV1 item)
		{
			if (item == null) return null;

			var point = new Data.Version1.CenterObjectV1()
			{
				Type = item.Type
			};

			if (item.Coordinates != null)
			{
				List<double> coordinates = new List<double>();

				foreach (BeaconsV1.InternalArray array in item.Coordinates)
				{
					coordinates.AddRange(array.InternalArray_.Select(x => Convert.ToDouble(x)));
				}

				point.Coordinates = coordinates.ToArray();
			}

			return point;
		}
	}
}
