using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
    public interface IInvitationsClientV1
    {
        Task<DataPage<InvitationV1>> GetInvitationsAsync(string correlationId, FilterParams filter, PagingParams paging);

        Task<InvitationV1> GetInvitationByIdAsync(string correlationId, string invitationId);

        Task<InvitationV1> CreateInvitationAsync(string correlationId, InvitationV1 invitation);

        Task<InvitationV1> UpdateInvitationAsync(string correlationId, InvitationV1 invitation);

        Task<InvitationV1> DeleteInvitationByIdAsync(string correlationId, string invitationId);

        Task<List<InvitationV1>> ActivateInvitationsAsync(string correlationId, string email, string userId);

        Task<InvitationV1> ApproveInvitationAsync(string correlationId, string invitationId, string role);

        Task<InvitationV1> DenyInvitationAsync(string correlationId, string invitationId);

        Task<InvitationV1> ResendInvitationAsync(string correlationId, string invitationId);

        Task NotifyInvitationAsync(string correlationId, InvitationV1 invitation);
    }
}
