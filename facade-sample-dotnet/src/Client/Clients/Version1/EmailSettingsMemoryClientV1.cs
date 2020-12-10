using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class EmailSettingsMemoryClientV1 : IEmailSettingsClientV1
	{
		private List<EmailSettingsV1> _settings = new List<EmailSettingsV1>();

		public async Task DeleteSettingsByIdAsync(string correlationId, string recipientId)
		{
			_settings.RemoveAll(s => s.Id == recipientId);
			await Task.Delay(0);
		}

		public async Task<EmailSettingsV1> GetSettingsByEmailSettingsAsync(string correlationId, string email)
		{
			return await Task.FromResult(_settings.FirstOrDefault(s => s.Email == email));
		}

		public async Task<EmailSettingsV1> GetSettingsByIdAsync(string correlationId, string recipientId)
		{
			return await Task.FromResult(_settings.FirstOrDefault(s => s.Id == recipientId));
		}

		public async Task<List<EmailSettingsV1>> GetSettingsByIdsAsync(string correlationId, string[] recipientIds)
		{
			return await Task.FromResult(_settings.Where(s => recipientIds.Contains(s.Id)).ToList());
		}

		public async Task ResendVerificationAsync(string correlationId, string recipientId)
		{
			await Task.Delay(0);
		}

		public async Task<EmailSettingsV1> SetRecipientAsync(string correlationId, string recipientId, string name, string email, string language)
		{
			var settings = await GetSettingsByIdAsync(correlationId, recipientId);
			if (settings != null)
			{
				settings.Name = name;
				settings.Email = email;
				settings.Language = language;
			}
			else
			{
				settings = new EmailSettingsV1
				{
					Id = recipientId,
					Name = name,
					Email = email,
					Language = language,
					Verified = false,
					Subscriptions = null
				};

				_settings.Add(settings);
			}

			return settings;
		}

		public async Task<EmailSettingsV1> SetSettingsAsync(string correlationId, EmailSettingsV1 settings)
		{
			settings.Verified = false;
			settings.Subscriptions = settings.Subscriptions ?? null;

			_settings.RemoveAll(s => s.Id == settings.Id);
			_settings.Add(settings);

			return await Task.FromResult(settings);
		}

		public async Task<EmailSettingsV1> SetSubscriptionsAsync(string correlationId, string recipientId, object subscriptions)
		{
			var settings = await GetSettingsByIdAsync(correlationId, recipientId);
			if (settings != null)
			{
				settings.Subscriptions = subscriptions;
			}
			else
			{
				settings = new EmailSettingsV1
				{
					Id = recipientId,
					Name = null,
					Email = null,
					Language = null,
					Verified = false,
					Subscriptions = subscriptions
				};

				_settings.Add(settings);
			}

			return settings;
		}

		public async Task<EmailSettingsV1> SetVerifiedSettingsAsync(string correlationId, EmailSettingsV1 settings)
		{
			settings.Verified = true;
			settings.Subscriptions = settings.Subscriptions ?? null;

			_settings.RemoveAll(s => s.Id == settings.Id);
			_settings.Add(settings);

			return await Task.FromResult(settings);
		}

		public async Task VerifyEmailAsync(string correlationId, string recipientId, string code)
		{
			var settings = await GetSettingsByIdAsync(correlationId, recipientId);
			if (settings != null && settings.VerCode == code)
			{
				settings.Verified = true;
				settings.VerCode = null;
			}

			await Task.Delay(0);
		}
	}
}
