using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class SessionsMemoryClientV1 : ISessionsClientV1
	{
		public List<SessionV1> _sessions = new List<SessionV1>();

		public async Task<SessionV1> CloseSessionAsync(string correlationId, string sessionId)
		{
			var session = _sessions.FirstOrDefault(x => x.Id == sessionId);
			if (session != null)
			{
				session.Active = false;
				return session;
			}

			await Task.Delay(0);
			return null;
		}

		public async Task<SessionV1> DeleteSessionByIdAsync(string correlationId, string sessionId)
		{
			var session = _sessions.FirstOrDefault(x => x.Id == sessionId);
			if (session != null)
			{
				_sessions.Remove(session);
				return session;
			}

			await Task.Delay(0);
			return null;
		}

		public async Task<SessionV1> GetSessionByIdAsync(string correlationId, string sessionId)
		{
			return await Task.FromResult(_sessions.FirstOrDefault(x => x.Id == sessionId));
		}

		public async Task<DataPage<SessionV1>> GetSessionsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			return await Task.FromResult(new DataPage<SessionV1>(_sessions, _sessions.Count));
		}

		public async Task<SessionV1> OpenSessionAsync(string correlationId, string user_id, string user_name, string address, string client, object user, object data)
		{
			var session = new SessionV1(null, user_id, user_name, address, client)
			{
				User = user,
				Data = data
			};

			_sessions.Add(session);
			return await Task.FromResult(session);
		}

		public async Task<SessionV1> StoreSessionDataAsync(string correlationId, string sessionId, object data)
		{
			return await Task.FromResult((SessionV1)null);
		}

		public async Task<SessionV1> UpdateSessionUserAsync(string correlationId, string sessionId, object user)
		{
			var session = _sessions.FirstOrDefault(x => x.Id == sessionId);
			if (session != null)
			{
				session.User = user;
				return session;
			}

			await Task.Delay(0);
			return null;
		}
	}
}
