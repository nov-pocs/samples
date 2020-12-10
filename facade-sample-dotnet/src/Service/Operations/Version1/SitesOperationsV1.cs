using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Nov.MaxApi.SampleFacade.Clients.Version1;
using PipServices3.Commons.Refer;
using PipServices3.Rpc.Services;
using System.Linq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using PipServices3.Commons.Data;
using PipServices3.Commons.Convert;
using System;

namespace Nov.MaxApi.SampleFacade.Operations.Version1
{
	public class SitesOperationsV1: RestOperations
	{
		private IRolesClientV1 _rolesClient;
		private ISessionsClientV1 _sessionsClient;
		private ISitesClientV1 _sitesClient;

		public SitesOperationsV1()
		{
			_dependencyResolver.Put("roles", new Descriptor("pip-services-roles", "client", "*", "*", "1.0"));
			_dependencyResolver.Put("sessions", new Descriptor("pip-services-sessions", "client", "*", "*", "1.0"));
			_dependencyResolver.Put("sites", new Descriptor("nov-services-sites", "client", "*", "*", "1.0"));
		}

		public new void SetReferences(IReferences references)
		{
			base.SetReferences(references);

			_rolesClient = _dependencyResolver.GetOneRequired<IRolesClientV1>("roles");
			_sessionsClient = _dependencyResolver.GetOneRequired<ISessionsClientV1>("sessions");
			_sitesClient = _dependencyResolver.GetOneRequired<ISitesClientV1>("sites");
		}

		public async Task GetSitesAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user,
			RouteData routeData)
		{
			var filter = GetFilterParams(request);
			var paging = GetPagingParams(request);

			var page = await _sitesClient.GetSitesAsync(null, filter, paging);
			await SendResultAsync(response, page);
		}

		public async Task GetAuthorizedSitesAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user,
			RouteData routeData)
		{
			var filter = GetFilterParams(request);
			var paging = GetPagingParams(request);

			var sessionUser = GetContextItem<SessionUserV1>(request, "user");
			var roles = sessionUser?.Roles ?? new List<string>();
			var siteIds = new List<string>();

			// Get authorized site ids
			foreach (var role in roles)
			{
				var tokens = role.Split(':');
				if (tokens.Length == 2)
					siteIds.Add(tokens[0]);
			}

			// Consider ids parameter
			var oldSiteIds = filter.Get("ids");
			if (oldSiteIds != null)
				siteIds = siteIds.Intersect(siteIds).ToList();

			// If user has no sites then exit
			if (siteIds.Count == 0)
			{
				await SendResultAsync(response, new DataPage<SiteV1>());
				return;
			}

			filter.SetAsObject("ids", siteIds);

			var page = await _sitesClient.GetSitesAsync(null, filter, paging);
			await SendResultAsync(response, page);
		}

		public async Task GetSiteAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var siteId = parameters.GetAsString("site_id");

			var site = await _sitesClient.GetSiteByIdAsync(null, siteId);
			await SendResultAsync(response, site);
		}

		public async Task FindSiteByCodeAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var code = parameters.GetAsString("code");

			var site = await _sitesClient.GetSiteByCodeAsync(null, code);
			await SendResultAsync(response, site);
		}

		public async Task GenerateCodeAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var siteId = parameters.GetAsString("site_id");

			var site = await _sitesClient.GenerateCodeAsync(null, siteId);
			await SendResultAsync(response, site);
		}

		public async Task CreateSiteAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			try
			{
				var parameters = GetParameters(request);
				var data = JsonConverter.FromJson<SiteV1>(parameters.RequestBody);

				// Create a site
				var site = await _sitesClient.CreateSiteAsync(null, data);

				// Assign permissions to the owner
				var user_id = GetContextItem<string>(request, "user_id");

				if (_rolesClient != null && user_id != null)
					await _rolesClient.GrantRolesAsync(null, user_id, new[] { site.Id + ":admin" });

				// Update current user session
				var sessionUser = GetContextItem<SessionUserV1>(request, "user");
				var sessionId = GetContextItem<string>(request, "session_id");
				if (sessionUser != null && sessionId != null)
				{
					sessionUser.Roles = sessionUser.Roles ?? new List<string>();
					sessionUser.Roles.Add(site.Id + ":admin");

					sessionUser.Sites = sessionUser.Sites ?? new List<ISessionSite>();
					sessionUser.Sites.Add(new SessionSiteV1 { Id = site.Id, Name = site.Name });

					await _sessionsClient.UpdateSessionUserAsync(null, sessionId, sessionUser);
				}

				await SendResultAsync(response, site);
			}
			catch (Exception ex)
			{
				await SendErrorAsync(response, ex);
			}
		}

		public async Task UpdateSiteAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			try
			{
				var parameters = GetParameters(request);
				var data = JsonConverter.FromJson<SiteV1>(parameters.RequestBody);

				// Update site
				var site = await _sitesClient.UpdateSiteAsync(null, data);

				// Update current user session
				var sessionUser = GetContextItem<SessionUserV1>(request, "user");
				var sessionId = GetContextItem<string>(request, "session_id");
				if (sessionUser != null && sessionId != null)
				{
					sessionUser.Sites = sessionUser.Sites ?? new List<ISessionSite>();
					sessionUser.Sites = sessionUser.Sites.Where(s => s.Id != site.Id).ToList();
					sessionUser.Sites.Add(new SessionSiteV1 { Id = site.Id, Name = site.Name });

					await _sessionsClient.UpdateSessionUserAsync(null, sessionId, sessionUser);
				}

				await SendResultAsync(response, site);
			}
			catch (Exception ex)
			{
				await SendErrorAsync(response, ex);
			}
		}

		public async Task DeleteSiteAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var siteId = parameters.GetAsString("site_id");

			var site = await _sitesClient.DeleteSiteByIdAsync(null, siteId);
			await SendResultAsync(response, site);
		}

		public async Task RemoveSiteAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var siteId = parameters.GetAsString("site_id");

			var sessionUser = GetContextItem<SessionUserV1>(request, "user");
			var sessionId = GetContextItem<string>(request, "session_id");
			var userId = GetContextItem<string>(request, "user_id");

			var roles = new[]
			{
				siteId + ":admin",
				siteId + ":manager",
				siteId + ":user"
			};

			// Assign permissions to the owner
			if (_rolesClient != null && userId != null)
			{
				await _rolesClient.RevokeRolesAsync(null, userId, roles);
			}

			// Update current user session
			if (sessionUser != null && sessionId != null)
			{
				sessionUser.Roles = sessionUser.Roles ?? new List<string>();
				sessionUser.Roles = sessionUser.Roles.Except(new List<string>(roles)).ToList();

				sessionUser.Sites = sessionUser.Sites ?? new List<ISessionSite>();
				sessionUser.Sites.RemoveAll(s => s.Id == siteId);

				await _sessionsClient.UpdateSessionUserAsync(null, sessionId, sessionUser);
			}

			await SendEmptyResultAsync(response);
		}

		public async Task ValidateSiteCodeAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var code = parameters.GetAsString("code");

			var site = await _sitesClient.GetSiteByCodeAsync(null, code);
			await SendResultAsync(response, site?.Id ?? "");
		}

		private static T GetContextItem<T>(HttpRequest request, string name)
			where T : class
		{
			if (request != null && request.HttpContext.Items.TryGetValue(name, out object item))
			{
				return item as T;
			}

			return null;
		}

	}
}
