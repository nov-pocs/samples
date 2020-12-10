using PipServices3.Commons.Data;
using PipServices3.Commons.Errors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class InvitationsMemoryClientV1 : IInvitationsClientV1
	{
		private int _maxPageSize = 100;
		private List<InvitationV1> _invitations = new List<InvitationV1>();

		public async Task<List<InvitationV1>> ActivateInvitationsAsync(string correlationId, string email, string userId)
		{
			return await Task.FromResult(new List<InvitationV1>());
		}

		public async Task<InvitationV1> ApproveInvitationAsync(string correlationId, string invitationId, string role)
		{
			return await Task.FromResult<InvitationV1>(null);
		}

		public async Task<InvitationV1> CreateInvitationAsync(string correlationId, InvitationV1 invitation)
		{
			if (invitation == null)
			{
				return null;
			}

			var finded = _invitations.FirstOrDefault(x => x.Id == invitation.Id || x.InviteeEmail == invitation.InviteeEmail);
			if (finded != null)
			{
				// remove old invitation
				_invitations.Remove(finded);
			}

			invitation = Clone(invitation);

			invitation.Id = invitation.Id ?? IdGenerator.NextLong();

			_invitations.Add(invitation);

			return await Task.FromResult(invitation);
		}

		public async Task<InvitationV1> DeleteInvitationByIdAsync(string correlationId, string invitationId)
		{
			await Task.Delay(0);

			var item = _invitations.FirstOrDefault(x => x.Id == invitationId);
			if (item != null)
			{
				_invitations.Remove(item);
				return item;
			}

			return null;
		}

		public async Task<InvitationV1> DenyInvitationAsync(string correlationId, string invitationId)
		{
			return await Task.FromResult<InvitationV1>(null);
		}

		public async Task<InvitationV1> GetInvitationByIdAsync(string correlationId, string invitationId)
		{
			return await Task.FromResult(_invitations.FirstOrDefault(x => x.Id == invitationId));
		}

		private List<Func<InvitationV1, bool>> ComposeFilter(FilterParams filter)
		{
			filter = filter ?? new FilterParams();

			var id = filter.GetAsNullableString("id");
			var email = filter.GetAsNullableString("invitee_email");

			var now = DateTime.UtcNow;

			return new List<Func<InvitationV1, bool>> {
				item =>
				{
					if (id != null && id != item.Id)
						return false;
					if (email != null && email != item.InviteeEmail)
						return false;
					return true;
				}
			};
		}

		public async Task<DataPage<InvitationV1>> GetInvitationsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			var filterCurl = ComposeFilter(filter);
			var invitations = _invitations.Where(x => filterCurl.All(f => f(x))).ToList();

			// Extract a page
			paging = paging != null ? paging : new PagingParams();
			var skip = paging.GetSkip(-1);
			var take = paging.GetTake(_maxPageSize);

			long? total = null;
			if (paging.Total)
				total = invitations.Count;

			invitations = invitations.Skip((int)skip).Take((int)take).ToList();

			var page = new DataPage<InvitationV1>(invitations, total);
			return await Task.FromResult(page);
		}

		public async Task NotifyInvitationAsync(string correlationId, InvitationV1 invitation)
		{
			await Task.Delay(0);
		}

		public async Task<InvitationV1> ResendInvitationAsync(string correlationId, string invitationId)
		{
			return await Task.FromResult(_invitations.FirstOrDefault(x => x.Id == invitationId));
		}

		public async Task<InvitationV1> UpdateInvitationAsync(string correlationId, InvitationV1 invitation)
		{
			var item = _invitations.FirstOrDefault(x => x.Id == invitation.Id);
			if (item == null) return null;

			int index = _invitations.IndexOf(item);
			_invitations[index] = Clone(invitation);

			return await Task.FromResult(_invitations[index]);
		}

		private InvitationV1 Clone(InvitationV1 invitation)
		{
			return new InvitationV1
			{
				Action = invitation.Action,
				CreateTime = invitation.CreateTime,
				CreatorId = invitation.CreatorId,
				CreatorName = invitation.CreatorName,
				ExpireTime = invitation.ExpireTime,
				Id = invitation.Id,
				InviteeEmail = invitation.InviteeEmail,
				InviteeId = invitation.InviteeId,
				InviteeName = invitation.InviteeName,
				Role = invitation.Role,
				SentTime = invitation.SentTime,
				SiteId = invitation.SiteId,
				SiteName = invitation.SiteName,
			};
		}
	}
}
