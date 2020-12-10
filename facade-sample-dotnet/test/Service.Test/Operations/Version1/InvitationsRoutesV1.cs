using Nov.MaxApi.SampleFacade.Clients.Version1;
using Nov.MaxApi.SampleFacade.Fixtures;
using PipServices3.Commons.Data;
using PipServices3.Commons.Refer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Nov.MaxApi.SampleFacade.Operations.Version1
{
    [Collection("Sequential")]
    public class InvitationsRoutesV1: IDisposable
	{
        InvitationV1 INVITATION1 = new InvitationV1 
        {
            Id = "1",
            Action = "activate",
            SiteId = "1",
            Role = "manager",
            CreateTime = DateTime.Now,
            CreatorId = "1",
            InviteeEmail = "test@somewhere.com"
        };
        InvitationV1 INVITATION2 = new InvitationV1 
        {
            Id = "2",
            Action = "activate",
            SiteId = "1",
            CreateTime = DateTime.Now,
            CreatorId = "1",
            InviteeEmail = "test2@somewhere.com"
        };
        InvitationV1 INVITATION3 = new InvitationV1 
        {
            Id = "3",
            Action = "notify",
            SiteId = "1",
            CreateTime = DateTime.Now,
            CreatorId = "1",
            InviteeEmail = "test2@somewhere.com"
        };

        private readonly TestReferences references;
        private readonly TestRestClient rest;

        public InvitationsRoutesV1()
        {
            rest = new TestRestClient();
            references = new TestReferences();
            references.Put(new Descriptor("iqs-services-facade", "operations", "sites", "default", "1.0"), new InvitationsOperationsV1());
            references.OpenAsync(null).Wait();
        }

        public void Dispose()
        {
            references.CloseAsync(null).Wait();
        }

        [Fact]
        public async Task It_Should_Resend_Invitations()
        {
            // Send invitation
            var invitation = await rest.PostAsUserAsync<InvitationV1>(
                    TestUsers.AdminUserSessionId,
                    "/api/v1/sites/" + INVITATION1.SiteId + "/invitations",
                    INVITATION1);

            Assert.NotNull(invitation);
            Assert.Equal(invitation.SiteId, INVITATION1.SiteId);
            Assert.Equal(invitation.InviteeEmail, INVITATION1.InviteeEmail);

            var invitation1 = invitation;

            // Send another invitation
            invitation = await rest.PostAsUserAsync<InvitationV1>(
                    TestUsers.AdminUserSessionId,
                    "/api/v1/sites/" + invitation1.SiteId + "/invitations/" + invitation1.Id + "/resend");

            Assert.NotNull(invitation);
        }

        [Fact]
        public async Task It_Should_Perform_Invitation_Operations()
        {
            var invitation = await rest.PostAsUserAsync<InvitationV1>(
                    TestUsers.AdminUserSessionId,
                    "/api/v1/sites/" + INVITATION1.SiteId + "/invitations",
                    INVITATION1);

            Assert.NotNull(invitation);
            Assert.Equal(invitation.SiteId, INVITATION1.SiteId);
            Assert.Equal(invitation.InviteeEmail, INVITATION1.InviteeEmail);

            var invitation1 = invitation;

            // Send another invitation
            invitation = await rest.PostAsUserAsync<InvitationV1>(
                    TestUsers.AdminUserSessionId,
                    "/api/v1/sites/" + INVITATION2.SiteId + "/invitations",
                    INVITATION2);

            Assert.NotNull(invitation);
            Assert.Equal(invitation.SiteId, INVITATION2.SiteId);
            Assert.Equal(invitation.InviteeEmail, INVITATION2.InviteeEmail);

            var invitation2 = invitation;

            // Get all invitations
            var page = await rest.GetAsUserAsync<DataPage<InvitationV1>>(
                    TestUsers.AdminUserSessionId,
                    "/api/v1/sites/" + INVITATION1.SiteId + "/invitations");

            Assert.NotNull(page);
            Assert.Equal(2, page.Data.Count);

            // Delete invitation
            invitation = await rest.DelAsUserAsync<InvitationV1>(
                    TestUsers.AdminUserSessionId,
                    "/api/v1/sites/" + invitation1.SiteId + "/invitations/" + invitation1.Id);

            Assert.NotNull(invitation);

            // Try to get delete invitation
            invitation = await rest.GetAsUserAsync<InvitationV1>(
                    TestUsers.AdminUserSessionId,
                    "/api/v1/sites/" + invitation1.SiteId + "/invitations/" + invitation1.Id);

            Assert.Null(invitation);
        }
    }
}
