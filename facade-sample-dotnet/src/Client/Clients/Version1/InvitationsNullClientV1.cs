using PipServices3.Commons.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class InvitationsNullClientV1 : IInvitationsClientV1
	{
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
			return await Task.FromResult<InvitationV1>(null);
		}

		public async Task<InvitationV1> DeleteInvitationByIdAsync(string correlationId, string invitation_id)
		{
			return await Task.FromResult<InvitationV1>(null);
		}

		public async Task<InvitationV1> DenyInvitationAsync(string correlationId, string invitationId)
		{
			return await Task.FromResult<InvitationV1>(null);
		}

		public async Task<InvitationV1> GetInvitationByIdAsync(string correlationId, string invitation_id)
		{
			return await Task.FromResult<InvitationV1>(null);
		}

		public async Task<DataPage<InvitationV1>> GetInvitationsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			return await Task.FromResult(new DataPage<InvitationV1>());
		}

		public async Task NotifyInvitationAsync(string correlationId, InvitationV1 invitation)
		{
			await Task.Delay(0);
		}

		public async Task<InvitationV1> ResendInvitationAsync(string correlationId, string invitationId)
		{
			return await Task.FromResult<InvitationV1>(null);
		}

		public async Task<InvitationV1> UpdateInvitationAsync(string correlationId, InvitationV1 invitation)
		{
			return await Task.FromResult(invitation);
		}
	}
}
