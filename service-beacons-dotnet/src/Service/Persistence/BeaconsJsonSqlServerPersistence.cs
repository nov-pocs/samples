using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Data;
using PipServices3.SqlServer.Persistence;

namespace Nov.MaxSamples.Beacons.Persistence
{
    public class BeaconsJsonSqlServerPersistence
        : IdentifiableJsonSqlServerPersistence<BeaconV1, string>, IBeaconsPersistence
    {
        public BeaconsJsonSqlServerPersistence()
            : base("beacons_json")
        {
            EnsureTable();
            AutoCreateObject("ALTER TABLE [beacons_json] ADD [data_site_id] AS JSON_VALUE([data],'$.site_id')");
            EnsureIndex("beacons_json_site_id", new Dictionary<string, bool> { { "data_site_id", true } }, new IndexOptions());
            this._maxPageSize = 1000;
        }

        private string ComposeFilter(FilterParams filter)
        {
            filter = filter ?? new FilterParams();

            var filters = new List<string>();

            var id = filter.GetAsNullableString("id");
            if (id != null)
                filters.Add("JSON_VALUE([data],'$.id')='" + id + "'");

            var siteId = filter.GetAsNullableString("site_id");
            if (siteId != null)
                filters.Add("JSON_VALUE([data],'$.site_id')='" + siteId + "'");

            var label = filter.GetAsNullableString("label");
            if (label != null)
                filters.Add("JSON_VALUE([data],'$.label')='" + label + "'");

            var udi = filter.GetAsNullableString("udi");
            if (udi != null)
                filters.Add("JSON_VALUE([data],'$.udi')='" + udi + "'");

            var tempUdis = filter.GetAsString("udis");
            var udis = tempUdis != null ? tempUdis.Split(',') : null;
            if (udis != null)
                filters.Add("JSON_VALUE([data],'$.udi') IN ('" + string.Join("','", udis) + "')");

            return filters.Count > 0 ? string.Join(" AND ", filters.ToArray()) : null;
        }

        public async Task<DataPage<BeaconV1>> GetPageByFilterAsync(
            string correlationId, FilterParams filter, PagingParams paging)
        {
            return await GetPageByFilterAsync(correlationId, ComposeFilter(filter), paging, "[id]");
        }

        public async Task<BeaconV1> GetOneByUdiAsync(string correlationId, string udi)
        {
            var @params = new[] { udi };
            var query = "SELECT * FROM " + QuoteIdentifier(_tableName) + " WHERE JSON_VALUE([data],'$.udi') = @Param1";

            var result = (await ExecuteReaderAsync(query, @params)).FirstOrDefault();

            if (result == null)
            {
                _logger.Trace(correlationId, "Nothing found from {0} with udi = {1}", _tableName, udi);
                return default;
            }

            _logger.Trace(correlationId, "Retrieved from {0} with udi = {1}", _tableName, udi);

            var item = ConvertToPublic(result);

            return item;
        }
    }
}
