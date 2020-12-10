using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class SitesMemoryClientV1 : ISitesClientV1
	{
		private int _maxPageSize = 100;
		private List<SiteV1> _sites = new List<SiteV1>();

		private bool MatchString(string value, string search)
		{
			if (value == null && search == null)
				return true;
			if (value == null || search == null)
				return false;
			return value.ToLower().IndexOf(search) >= 0;
		}

		private bool MatchSearch(SiteV1 item, string search)
		{
			search = search.ToLower();
			if (MatchString(item.Id, search))
				return true;
			if (MatchString(item.Name, search))
				return true;
			return false;
		}

		private List<Func<SiteV1, bool>> ComposeFilter(FilterParams filter)
		{
			filter = filter ?? new FilterParams();

			var search = filter.GetAsNullableString("search");
			var id = filter.GetAsNullableString("id");
			var code = filter.GetAsNullableString("code");
			var active = filter.GetAsNullableBoolean("active");
			var deleted = filter.GetAsBooleanWithDefault("deleted", false);

			var now = DateTime.UtcNow;

			return new List<Func<SiteV1, bool>> {
				item =>
				{
					if (search != null && !MatchSearch(item, search))
						return false;
					if (id != null && id != item.Id)
						return false;
					if (code != null && code != item.Code)
						return false;
					if (active != null && active != item.Active)
						return false;
					if (!deleted && item.Deleted.HasValue && item.Deleted.Value)
						return false;
					return true;
				}
			};
		}

		public async Task<SiteV1> CreateSiteAsync(string correlationId, SiteV1 site)
		{
			site.Id = site.Id ?? IdGenerator.NextLong();
			site.CreateTime = DateTime.Now;
			site.Active = true;

			_sites.Add(site);
			return await Task.FromResult(site);
		}

		public async Task<SiteV1> DeleteSiteByIdAsync(string correlationId, string site_id)
		{
			var site = _sites.FirstOrDefault(x => x.Id == site_id);
			if (site != null) site.Deleted = true;
			return await Task.FromResult(site);
		}

		public async Task<string> GenerateCodeAsync(string correlationId, string site_id)
		{
			return await Task.FromResult(site_id);
		}

		public async Task<SiteV1> GetSiteByCodeAsync(string correlationId, string code)
		{
			return await Task.FromResult(_sites.FirstOrDefault(x => x.Code == code));
		}

		public async Task<SiteV1> GetSiteByIdAsync(string correlationId, string site_id)
		{
			return await Task.FromResult(_sites.FirstOrDefault(x => x.Id == site_id));
		}

		public async Task<DataPage<SiteV1>> GetSitesAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			var filterCurl = ComposeFilter(filter);
			var sites = _sites.Where(x => filterCurl.All(f => f(x))).ToList();

			// Extract a page
			paging = paging != null ? paging : new PagingParams();
			var skip = paging.GetSkip(-1);
			var take = paging.GetTake(_maxPageSize);

			long? total = null;
			if (paging.Total)
				total = sites.Count;

			sites = sites.Skip((int)skip).Take((int)take).ToList();

			var page = new DataPage<SiteV1>(sites, total);
			return await Task.FromResult(page);
		}

		public async Task<SiteV1> UpdateSiteAsync(string correlationId, SiteV1 site)
		{
			var item = _sites.FirstOrDefault(x => x.Id == site.Id);
			if (item == null) return null;

			int index = _sites.IndexOf(item);
			_sites[index] = Clone(site);

			return await Task.FromResult(_sites[index]);
		}

		private SiteV1 Clone(SiteV1 site)
		{
			return new SiteV1
			{
				Id = site.Id,
				Deleted = site.Deleted,
				Active = site.Active,
				Address = site.Address,
				Boundaries = site.Boundaries,
				Center = site.Center,
				Code = site.Code,
				CreateTime = site.CreateTime,
				CreatorId = site.CreatorId,
				Description = site.Description,
				Geometry = site.Geometry,
				Industry = site.Industry,
				Language = site.Language,
				Name = site.Name,
				OrgSize = site.OrgSize,
				Params = site.Params,
				Purpose = site.Purpose,
				Radius = site.Radius,
				Timezone = site.Timezone,
				TotalSites = site.TotalSites
			};
		}
	}
}
