using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class RolesMemoryClientV1 : IRolesClientV1
	{
		private int _maxPageSize = 100;
		private List<UserRolesV1> _roles = new List<UserRolesV1>();

		public RolesMemoryClientV1()
		{ 
		}

		public async Task<bool> AuthorizeAsync(string correlationId, string userId, string[] roles)
		{
			if (roles.Length == 0) return true;

			var existingRoles = await GetRolesByIdAsync(correlationId, userId);
			var authorized = !roles.Except(existingRoles).Any() && !existingRoles.Except(roles).Any();

			return authorized;
		}

		private List<Func<UserRolesV1, bool>> ComposeFilter(FilterParams filter)
		{
			filter = filter ?? new FilterParams();

			var id = filter.GetAsNullableString("id");
			var ids = ConvertToArray(filter.GetAsObject("ids"));
			var exceptIds = ConvertToArray(filter.GetAsObject("except_ids"));
			var roles = ConvertToArray(filter.GetAsObject("roles"));
			var exceptRoles = ConvertToArray(filter.GetAsObject("except_roles"));

			return new List<Func<UserRolesV1, bool>> {
				item =>
				{
					if (id != null && item.Id != id)
						return false;
					if (ids != null && !ids.Contains(item.Id))
						return false;
					if (exceptIds != null && !exceptIds.Contains(item.Id))
						return false;
					if (roles != null && !Contains(roles, item.Roles.ToArray()))
						return false;
					if (exceptRoles != null && Contains(exceptRoles, item.Roles.ToArray()))
						return false;
					return true;
				}
			};
		}

		private bool Contains(string[] array1, string[] array2)
		{
			if (array1 == null || array2 == null) return false;

			for (int i1 = 0; i1 < array1.Length; i1++)
			{
				for (int i2 = 0; i2 < array2.Length; i2++)
					if (array1[i1] == array2[i2])
						return true;
			}

			return false;
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

		public async Task<DataPage<UserRolesV1>> GetRolesByFilterAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			var filterCurl = ComposeFilter(filter);
			var roles = _roles.Where(x => filterCurl.All(f => f(x))).ToList();

			// Extract a page
			paging = paging != null ? paging : new PagingParams();
			var skip = paging.GetSkip(-1);
			var take = paging.GetTake(_maxPageSize);

			long? total = null;
			if (paging.Total)
				total = roles.Count;

			roles = roles.Skip((int)skip).Take((int)take).ToList();

			var page = new DataPage<UserRolesV1>(roles, total);
			return await Task.FromResult(page);
		}

		public async Task<string[]> GetRolesByIdAsync(string correlationId, string userId)
		{
			return await Task.FromResult(_roles.FirstOrDefault(x => x.Id == userId)?.Roles.ToArray());
		}

		public async Task<string[]> GrantRolesAsync(string correlationId, string userId, string[] roles)
		{
			// If there are no roles then skip processing
			if (roles.Length == 0)
			{
				return null;
			}

			var existingRoles = await GetRolesByIdAsync(correlationId, userId);

			var newRowles = roles.Union(existingRoles).ToArray();

			return await SetRolesAsync(correlationId, userId, newRowles);
		}

		public async Task<string[]> RevokeRolesAsync(string correlationId, string userId, string[] roles)
		{
			// If there are no roles then skip processing
			if (roles.Length == 0)
			{
				return null;
			}

			var existingRoles = await GetRolesByIdAsync(correlationId, userId);

			var newRowles = roles.Except(existingRoles).ToArray();

			return await SetRolesAsync(correlationId, userId, newRowles);
		}

		public async Task<string[]> SetRolesAsync(string correlationId, string userId, string[] roles)
		{
			roles = roles ?? new string[] { };

			var userRoles = _roles.FirstOrDefault(d => d.Id == userId);
			if (userRoles != null)
			{
				userRoles.Roles = new List<string>(roles);
				userRoles.UpdateTime = DateTime.Now;
			}
			else
			{
				userRoles = new UserRolesV1(userId, new List<string>(roles));
				_roles.Add(userRoles);
			}

			return await Task.FromResult(roles);
		}
	}
}
