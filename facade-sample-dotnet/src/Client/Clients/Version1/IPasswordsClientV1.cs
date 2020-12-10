using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
    public interface IPasswordsClientV1
    {
        Task<UserPasswordInfoV1> GetPasswordInfoAsync(string correlationId, string userId);

        Task<string> SetTempPasswordAsync(string correlationId, string userId);

        Task SetPasswordAsync(string correlationId, string userId, string password);

        Task DeletePasswordAsync(string correlationId, string userId);

        Task<bool> AuthenticateAsync(string correlationId, string userId, string password);

        Task ChangePasswordAsync(string correlationId, string userId, string oldPassword, string newPassword);

        Task<bool> ValidateCodeAsync(string correlationId, string userId, string code);

        Task ResetPasswordAsync(string correlationId, string userId, string code, string password);

        Task RecoverPasswordAsync(string correlationId, string userId);
    }
}
