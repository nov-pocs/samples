using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class PasswordsNullClientV1 : IPasswordsClientV1
	{
		public async Task<bool> AuthenticateAsync(string correlationId, string userId, string password)
		{
			return await Task.FromResult(true);
		}

		public async Task ChangePasswordAsync(string correlationId, string userId, string oldPassword, string newPassword)
		{
			await Task.Delay(0);
		}

		public async Task DeletePasswordAsync(string correlationId, string userId)
		{
			await Task.Delay(0);
		}

		public async Task<UserPasswordInfoV1> GetPasswordInfoAsync(string correlationId, string userId)
		{
			return await Task.FromResult((UserPasswordInfoV1)null);
		}

		public async Task RecoverPasswordAsync(string correlationId, string userId)
		{
			await Task.Delay(0);
		}

		public async Task ResetPasswordAsync(string correlationId, string userId, string code, string password)
		{
			await Task.Delay(0);
		}

		public async Task SetPasswordAsync(string correlationId, string userId, string password)
		{
			await Task.Delay(0);
		}

		public async Task<string> SetTempPasswordAsync(string correlationId, string userId)
		{
			return await Task.FromResult("123");
		}

		public async Task<bool> ValidateCodeAsync(string correlationId, string userId, string code)
		{
			return await Task.FromResult(true);
		}
	}
}
