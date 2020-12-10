using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
    public interface IEmailSettingsClientV1
    {
        Task<List<EmailSettingsV1>> GetSettingsByIdsAsync(string correlationId, string[] recipientIds);

        Task<EmailSettingsV1> GetSettingsByIdAsync(string correlationId, string recipientId);

        Task<EmailSettingsV1> GetSettingsByEmailSettingsAsync(string correlationId, string email);

        Task<EmailSettingsV1> SetSettingsAsync(string correlationId, EmailSettingsV1 settings);

        Task<EmailSettingsV1> SetVerifiedSettingsAsync(string correlationId, EmailSettingsV1 settings);

        Task<EmailSettingsV1> SetRecipientAsync(string correlationId, string recipientId,
            string name, string email, string language);

        Task<EmailSettingsV1> SetSubscriptionsAsync(string correlationId, string recipientId, object subscriptions);

        Task DeleteSettingsByIdAsync(string correlationId, string recipientId);

        Task ResendVerificationAsync(string correlationId, string recipientId);

        Task VerifyEmailAsync(string correlationId, string recipientId, string code);
    }
}
