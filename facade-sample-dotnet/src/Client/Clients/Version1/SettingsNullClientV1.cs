using PipServices3.Commons.Config;
using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxApi.SampleFacade.Clients.Version1
{
    public class SettingsNullClientV1 : ISettingsClientV1
    {
        public async Task<DataPage<string>> GetSectionIdsAsync(string correlationId, FilterParams filter, PagingParams paging)
        {
            return await Task.FromResult(new DataPage<string>());
        }

        public async Task<DataPage<SettingsSectionV1>> GetSectionsAsync(string correlationId, FilterParams filter, PagingParams paging)
        {
            return await Task.FromResult(new DataPage<SettingsSectionV1>());
        }

        public async Task<ConfigParams> GetSectionByIdAsync(string correlationId, string id)
        {
            return await Task.FromResult(new ConfigParams());
        }

        public async Task<ConfigParams> SetSectionAsync(string correlationId, string id, ConfigParams parameters)
        {
            return await Task.FromResult(new ConfigParams());
        }

        public async Task<ConfigParams> ModifySectionAsync(string correlationId, string id, ConfigParams updateParams, ConfigParams incrementParams)
        {
            updateParams = updateParams ?? new ConfigParams();
            incrementParams = incrementParams ?? new ConfigParams();
            updateParams = updateParams.Override(incrementParams);

            return await Task.FromResult(updateParams);
        }
	}

}
