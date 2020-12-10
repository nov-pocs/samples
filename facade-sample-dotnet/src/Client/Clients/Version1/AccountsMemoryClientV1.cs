using PipServices3.Commons.Data;
using PipServices3.Commons.Errors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
	public class AccountsMemoryClientV1 : IAccountsClientV1
	{
		private int _maxPageSize = 100;
		private List<AccountV1> _accounts;

		public AccountsMemoryClientV1()
			: this(null)
		{ 
		}

		public AccountsMemoryClientV1(List<AccountV1> accounts)
		{
			_accounts = accounts ?? new List<AccountV1>();
		}

		private bool MatchString(string value, string search)
		{
			if (value == null && search == null)
				return true;
			if (value == null || search == null)
				return false;
			return value.ToLower().IndexOf(search) >= 0;
		}

		private bool MatchSearch(AccountV1 item, string search)
		{
			search = search.ToLower();
			if (MatchString(item.Name, search))
				return true;
			return false;
		}

		private List<Func<AccountV1, bool>> ComposeFilter(FilterParams filter)
		{
			filter = filter ?? new FilterParams();

			var search = filter.GetAsNullableString("search");
			var id = filter.GetAsNullableString("id");
			var name = filter.GetAsNullableString("name");
			var login = filter.GetAsNullableString("login");
			var active = filter.GetAsNullableBoolean("active");
			var deleted = filter.GetAsBooleanWithDefault("deleted", false);
			var fromCreateTime = filter.GetAsNullableDateTime("from_create_time");
			var toCreateTime = filter.GetAsNullableDateTime("to_create_time");

			var now = DateTime.UtcNow;

			return new List<Func<AccountV1, bool>> {
				item =>
				{
					if (search != null && !MatchSearch(item, search))
						return false;
					if (id != null && id != item.Id)
						return false;
					if (name != null && name != item.Name)
						return false;
					if (login != null && login != item.Login)
						return false;
					if (active != null && active != item.Active)
						return false;
					if (fromCreateTime != null && item.CreateTime >= fromCreateTime)
						return false;
					if (toCreateTime != null && item.CreateTime < toCreateTime)
						return false;
					if (!deleted && item.Deleted.HasValue && item.Deleted.Value)
						return false;
					return true;
				}
			};
		}

		public async Task<AccountV1> CreateAccountAsync(string correlationId, AccountV1 account)
		{
			if (account == null)
			{
				return null;
			}

			var finded = _accounts.FirstOrDefault(x => x.Id == account.Id || x.Login == account.Login);
			if (finded != null)
			{
				throw new BadRequestException(correlationId, "DUPLICATE_LOGIN", "Found account with duplicate login");
			}

			account = Clone(account);

			account.Id = account.Id ?? IdGenerator.NextLong();

			_accounts.Add(account);

			return await Task.FromResult(account);
		}

		private static AccountV1 Clone(AccountV1 account)
		{
			account = new AccountV1(account.Id, account.Login, account.Name)
			{
				Active = account.Active,
				CreateTime = account.CreateTime,
				CustomDat = account.CustomDat,
				CustomHdr = account.CustomHdr,
				Deleted = account.Deleted,
				Language = account.Language,
				Theme = account.Theme,
				TimeZone = account.TimeZone,
			};
			return account;
		}

		public async Task<AccountV1> DeleteAccountByIdAsync(string correlationId, string id)
		{
			await Task.Delay(0);

			var item = _accounts.FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				item.Deleted = true;
				return item;
			}

			return null;
		}

		public async Task<AccountV1> GetAccountByIdAsync(string correlationId, string id)
		{
			return await Task.FromResult(_accounts.FirstOrDefault(x => x.Id == id));
		}

		public async Task<AccountV1> GetAccountByIdOrLoginAsync(string correlationId, string idOrLogin)
		{
			return await Task.FromResult(_accounts.FirstOrDefault(x => x.Id == idOrLogin || x.Login == idOrLogin));
		}

		public async Task<AccountV1> GetAccountByLoginAsync(string correlationId, string login)
		{
			return await Task.FromResult(_accounts.FirstOrDefault(x => x.Login == login));
		}

		public async Task<DataPage<AccountV1>> GetAccountsAsync(string correlationId, FilterParams filter, PagingParams paging)
		{
			var filterCurl = ComposeFilter(filter);
			var accounts = _accounts.Where(x => filterCurl.All(f => f(x))).ToList();

			// Extract a page
			paging = paging != null ? paging : new PagingParams();
			var skip = paging.GetSkip(-1);
			var take = paging.GetTake(_maxPageSize);

			long? total = null;
			if (paging.Total)
				total = accounts.Count;

			accounts = accounts.Skip((int)skip).Take((int)take).ToList();

			var page = new DataPage<AccountV1>(accounts, total);
			return await Task.FromResult(page);
		}

		public async Task<AccountV1> UpdateAccountAsync(string correlationId, AccountV1 account)
		{
			var item = _accounts.FirstOrDefault(x => x.Id == account.Id);
			if (item == null) return null;

			int index = _accounts.IndexOf(item);
			_accounts[index] = Clone(account);

			return await Task.FromResult(_accounts[index]);
		}
	}
}
