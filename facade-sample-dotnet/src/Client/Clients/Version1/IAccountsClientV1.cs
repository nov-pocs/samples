using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
    public interface IAccountsClientV1
    {
        Task<DataPage<AccountV1>> GetAccountsAsync(string correlationId, FilterParams filter, PagingParams paging);

        Task<AccountV1> GetAccountByIdAsync(string correlationId, string id);

        Task<AccountV1> GetAccountByLoginAsync(string correlationId, string login);

        Task<AccountV1> GetAccountByIdOrLoginAsync(string correlationId, string idOrLogin);

        Task<AccountV1> CreateAccountAsync(string correlationId, AccountV1 account);

        Task<AccountV1> UpdateAccountAsync(string correlationId, AccountV1 account);

        Task<AccountV1> DeleteAccountByIdAsync(string correlationId, string id);
    }
}
