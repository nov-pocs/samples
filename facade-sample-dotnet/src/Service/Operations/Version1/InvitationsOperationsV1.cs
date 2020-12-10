using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Nov.MaxApi.SampleFacade.Clients.Version1;
using PipServices3.Commons.Convert;
using PipServices3.Commons.Refer;
using PipServices3.Rpc.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Operations.Version1
{
	public class InvitationsOperationsV1: RestOperations
	{
		private IInvitationsClientV1 _invitationsClient;

		public InvitationsOperationsV1()
		{
			_dependencyResolver.Put("invitations", new Descriptor("nov-services-invitations", "client", "*", "*", "1.0"));
		}

		public new void SetReferences(IReferences references)
		{ 
			base.SetReferences(references);

			_invitationsClient = _dependencyResolver.GetOneRequired<IInvitationsClientV1>("invitations");
		}

		public async Task GetInvitationsAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user,
			RouteData routeData)
		{
			var filter = GetFilterParams(request);
			var paging = GetPagingParams(request);
			var parameters = GetParameters(request);

			var siteId = parameters.GetAsString("site_id");
			filter.SetAsObject("site_id", siteId);

			var page = await _invitationsClient.GetInvitationsAsync(null, filter, paging);
			await SendResultAsync(response, page);
		}

		public async Task GetInvitationAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, 
			RouteData routeData)
		{
			var parameters = GetParameters(request);
			var invitationId = parameters.GetAsString("invitation_id");

			var beacon = await _invitationsClient.GetInvitationByIdAsync(null, invitationId);
			await SendResultAsync(response, beacon);
		}

		public async Task SendInvitationAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var invitation = JsonConverter.FromJson<InvitationV1>(parameters.RequestBody);
			var sessionUser = GetContextItem<SessionUserV1>(request, "user");

			invitation.CreateTime = DateTime.Now;
			invitation.CreatorId = sessionUser.Id;
			invitation.CreatorName = sessionUser.Name;

			invitation = await _invitationsClient.CreateInvitationAsync(null, invitation);
			await SendResultAsync(response, invitation);
		}

		public async Task DeleteInvitationAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var invitationId = routeData.Values["invitation_id"]?.ToString();

			var invitation = await _invitationsClient.DeleteInvitationByIdAsync(null, invitationId);
			await SendResultAsync(response, invitation);
		}

		public async Task ApproveInvitationAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var invitationId = parameters.GetAsString("invitation_id");
			var role = parameters.GetAsString("role");

			var invitation = await _invitationsClient.ApproveInvitationAsync(null, invitationId, role);
			await SendResultAsync(response, invitation);
		}

		public async Task DenyInvitationAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var invitationId = parameters.GetAsString("invitation_id");

			var invitation = await _invitationsClient.DenyInvitationAsync(null, invitationId);
			await SendResultAsync(response, invitation);
		}

		public async Task ResendInvitationAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var invitationId = routeData.Values["invitation_id"]?.ToString();

			var invitation = await _invitationsClient.ResendInvitationAsync(null, invitationId);
			await SendResultAsync(response, invitation);
		}

		public async Task NotifyInvitationAsync(HttpRequest request, HttpResponse response, ClaimsPrincipal user, RouteData routeData)
		{
			var parameters = GetParameters(request);
			var invitation = JsonConverter.FromJson<InvitationV1>(parameters.RequestBody);
			var sessionUser = GetContextItem<SessionUserV1>(request, "user");

			invitation.CreateTime = DateTime.Now;
			invitation.CreatorId = sessionUser.Id;
			invitation.CreatorName = sessionUser.Name;

			await _invitationsClient.NotifyInvitationAsync(null, invitation);
			await SendEmptyResultAsync(response);
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
