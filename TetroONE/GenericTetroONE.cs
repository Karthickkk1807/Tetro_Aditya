using TetroONE.Models;
using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Reflection;

namespace TetroONE
{
    public static class GenericTetroONE
    {
        public static T CreateObjectFromDataRow<T>(DataRow row)
        {
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in row.Table.Columns)
            {
                PropertyInfo property = typeof(T).GetProperty(column.ColumnName);
                if (property != null && row[column] != DBNull.Value)
                {
                    object value = Convert.ChangeType(row[column], property.PropertyType);
                    property.SetValue(obj, value);
                }
            }

            return obj;
        }


        public static List<T> DataTableToList<T>(DataTable table) where T : new()
        {
            List<T> list = new List<T>();

            foreach (DataRow row in table.Rows)
            {
                T item = new T();
                foreach (var prop in typeof(T).GetProperties())
                {
                    if (table.Columns.Contains(prop.Name) && row[prop.Name] != DBNull.Value)
                    {
                        prop.SetValue(item, Convert.ChangeType(row[prop.Name], Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType));
                    }
                }
                list.Add(item);
            }
            return list;
        }


        public static string DataTableToJSON(DataTable dt)
        {
            var rows = new List<Dictionary<string, object>>();

            foreach (DataRow dr in dt.Rows)
            {
                var row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    row[col.ColumnName] = dr[col];
                }
                rows.Add(row);
            }

            return JsonConvert.SerializeObject(rows);
        }
        public static List<T> ConvertDataTableToList<T>(DataTable dataTable)
        {
            var resultList = new List<T>();
            foreach (DataRow row in dataTable.Rows)
            {
                T item = CreateObjectFromDataRow<T>(row);
                resultList.Add(item);
            }
            return resultList;
        }

        public static object dataSetToJSON(DataSet ds)
        {
            ArrayList root = new ArrayList();
            List<Dictionary<string, object>> table;
            Dictionary<string, object> data;

            foreach (DataTable dt in ds.Tables)
            {
                table = new List<Dictionary<string, object>>();

                if (dt.Rows.Count == 0)
                {

                    data = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        data.Add(col.ColumnName, null);
                    }
                    data.Add("TetroONEnocount", null);
                    table.Add(data);
                }
                else
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        data = new Dictionary<string, object>();
                        foreach (DataColumn col in dt.Columns)
                        {
                            data.Add(col.ColumnName, dr[col]);
                        }
                        table.Add(data);
                    }
                }

                root.Add(table);
            }
            return JsonConvert.SerializeObject(root);
        }

        public static async Task<bool> IsAttachmentUploaded(IFormFileCollection file, List<AttachmentTable> lstattachment)
        {
            bool isuploaded = false;

            foreach (var item in file)
            {
                var filenameInfo = lstattachment.FirstOrDefault(x => x.AttachmentExactFileName == item.FileName);
                if (filenameInfo != null)
                {
                    var filename = filenameInfo.AttachmentFileName;
                    var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\ProfileImages\");
                    var filePath = Path.Combine(directoryPath, filename);

                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await item.CopyToAsync(stream);
                    }
                }
            }
            isuploaded = true;

            return isuploaded;
        }

        public static async Task<bool> IsAttachmentDeleted(List<AttachmentTable> lstattachment)
        {
            bool isdeleted = false;

            foreach (var item in lstattachment)
            {
                if (item.AttachmentFilePath != null)
                {
                    string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\");
                    string filePath = directoryPath + item.AttachmentFilePath.Replace("../", "\\").Replace("/", "\\");
                    File.Delete(filePath.Replace("\\\\", "\\"));
                }
            }
            isdeleted = true;

            return isdeleted;
        }
        public static async Task<bool> IsAttachmentDeletedProductionAttachmentDetails(List<ProductionAttachmentDetails> lstattachment)
        {
            bool isdeleted = false;

            foreach (var item in lstattachment)
            {
                if (item.AttachmentFilePath != null)
                {
                    string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\");
                    string filePath = directoryPath + item.AttachmentFilePath.Replace("../", "\\").Replace("/", "\\");
                    File.Delete(filePath.Replace("\\\\", "\\"));
                }
            }
            isdeleted = true;

            return isdeleted;
        }
        public static (string, string) GetFilePath(string reqfilename)
        {
            string guid = Guid.NewGuid().ToString();

            string relativePath = Path.Combine("ProfileImages");
            string fileName = guid + "@@" + reqfilename;
            string relativeFilePath = "..\\" + relativePath + "\\" + fileName;
            relativeFilePath = relativeFilePath.Replace("\\", "/");
            return (fileName, relativeFilePath);
        }

        public static object dataSetToJSON(DataSet ds, bool iscolumn)
        {
            ArrayList root = new ArrayList();
            List<Dictionary<string, object>> table;
            Dictionary<string, object> data;

            foreach (DataTable dt in ds.Tables)
            {
                table = new List<Dictionary<string, object>>();

                if (dt.Rows.Count == 0)
                {

                    data = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        data.Add(col.ColumnName, null);
                    }
                    data.Add("TetroONEnocount", null);
                    table.Add(data);
                }
                else
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        data = new Dictionary<string, object>();
                        foreach (DataColumn col in dt.Columns)
                        {
                            data.Add(col.ColumnName, dr[col]);
                        }
                        table.Add(data);
                    }
                }

                root.Add(table);
            }
            return JsonConvert.SerializeObject(root);
        }
        public static void AddParameters<TInput>(this SqlCommand command, TInput parameters)
        {
            var inputProperties = typeof(TInput).GetProperties();
            foreach (var property in inputProperties)
            {
                var paramName = "@" + property.Name;
                var paramValue = property.GetValue(parameters);
                command.Parameters.AddWithValue(paramName, paramValue ?? DBNull.Value);
            }
        }

        public static void AddParameters<TInput>(this SqlCommand command, TInput parameters, string propertyToExclude)
        {
            if (string.IsNullOrEmpty(propertyToExclude))
            {
                var inputProperties = typeof(TInput).GetProperties();
                foreach (var property in inputProperties)
                {
                    var paramName = "@" + property.Name;
                    var paramValue = property.GetValue(parameters);
                    command.Parameters.AddWithValue(paramName, paramValue ?? DBNull.Value);
                }
            }
            else
            {
                var inputProperties = typeof(TInput).GetProperties()
                .Where(p => p.Name != propertyToExclude) // Exclude the specified property
                .ToArray();
                foreach (var property in inputProperties)
                {
                    var paramName = "@" + property.Name;
                    var paramValue = property.GetValue(parameters);
                    command.Parameters.AddWithValue(paramName, paramValue ?? DBNull.Value);
                }
            }
        }

        public static void AddParameters<TInput>(this SqlCommand command, TInput parameters, string[] propertyToExclude)
        {
            if (propertyToExclude == null || propertyToExclude.Length == 0)
            {
                var inputProperties = typeof(TInput).GetProperties();
                foreach (var property in inputProperties)
                {
                    var paramName = "@" + property.Name;
                    var paramValue = property.GetValue(parameters);
                    object dbValue = (paramValue != null) ? paramValue : DBNull.Value;
                    command.Parameters.AddWithValue(paramName, dbValue);
                }
            }
            else
            {
                var inputProperties = typeof(TInput).GetProperties()
                .Where(p => !propertyToExclude.Contains(p.Name)) // Exclude the specified property
                .ToArray();
                foreach (var property in inputProperties)
                {
                    var paramName = "@" + property.Name;
                    var paramValue = property.GetValue(parameters);
                    object dbValue = (paramValue != null) ? paramValue : DBNull.Value;
                    command.Parameters.AddWithValue(paramName, dbValue);
                }
            }
        }

        public static CommonResponse GetData<TInput>(string connectionString, string spName, TInput parameters)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    AddParameters(command, parameters);

                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    response.Data = dataSetToJSON(ds);
                }
            }
            return response;
        }

        public static CommonResponse GetData<TInput>(string connectionString, string spName, TInput parameters, string[] propertiesToExclude = null)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (propertiesToExclude != null && propertiesToExclude.Length > 0)
                    {
                        AddParameters(command, parameters, propertiesToExclude);
                    }
                    else
                    {
                        AddParameters(command, parameters);
                    }
                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);

                    adapter.Fill(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                    response.Data = dataSetToJSON(ds);
                }
            }
            return response;
        }
        public static CommonResponse Execute<TInput>(string connectionString, string spName, TInput parameters)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    AddParameters(command, parameters);

                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    command.ExecuteNonQuery();

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                }
            }
            return response;
        }

        public static CommonResponse Execute<TInput>(string connectionString, string spName, TInput parameters, string propertyToExclude)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (string.IsNullOrEmpty(propertyToExclude))
                        AddParameters(command, parameters);
                    else
                        AddParameters(command, parameters, propertyToExclude);

                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    command.ExecuteNonQuery();

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                }
            }
            return response;
        }
        public static CommonResponse ExecuteReturnData<TInput>(string connectionString, string spName, TInput parameters, string propertyToExclude = null)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (string.IsNullOrEmpty(propertyToExclude))
                        AddParameters(command, parameters);
                    else
                        AddParameters(command, parameters, propertyToExclude);

                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);
                    response.Data = dataSetToJSON(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }
            }
            return response;
        }

        public static CommonResponse ExecuteReturnDataArray<TInput>(string connectionString, string spName, TInput parameters, string[] propertiesToExclude = null)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (propertiesToExclude != null && propertiesToExclude.Length > 0)
                    {
                        AddParameters(command, parameters, propertiesToExclude);
                    }
                    else
                    {
                        AddParameters(command, parameters);
                    }

                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);
                    response.Data = dataSetToJSON(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }
            }
            return response;
        }

        public static CommonResponse Execute<TInput>(string connectionString, string spName, TInput parameters, string[] propertiesToExclude = null)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    if (propertiesToExclude != null && propertiesToExclude.Length > 0)
                    {
                        AddParameters(command, parameters, propertiesToExclude);
                    }
                    else
                    {
                        AddParameters(command, parameters);
                    }

                    // Add output parameters
                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;


                    command.ExecuteNonQuery();

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                }
            }
            return response;
        }

        public static CommonResponse ExecuteReturnDataBioMetric<TInput>(string connectionString, string spName, TInput parameters, string[] propertiesToExclude = null)
        {
            CommonResponse response = new CommonResponse();

            DataSet ds = new DataSet();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (propertiesToExclude != null && propertiesToExclude.Length > 0)
                    {
                        AddParameters(command, parameters, propertiesToExclude);
                    }
                    else
                    {
                        AddParameters(command, parameters);
                    }

                    command.Parameters.Add("@Status", SqlDbType.Int).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);
                    response.Data = dataSetToJSON(ds);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }
            }
            return response;
        }


        public static List<string> GetUserViewAccessSession(string page, ISession session)
        {
            List<string> access = new List<string>();
            if (!string.IsNullOrEmpty(page) && session != null)
            {
                string serializedUserAccess = session.GetString("UserAccess");
                if (!string.IsNullOrEmpty(serializedUserAccess))
                {
                    List<UserAccess> accessData = JsonConvert.DeserializeObject<List<UserAccess>>(serializedUserAccess);
                    if (accessData != null)
                    {
                        access = accessData.Where(x => (Convert.ToBoolean(x.IsHasAccess)
                        && x.ModuleAction.ToLower() == page.ToLower())).Select(x => x.Module).ToList();
                    }
                }
            }
            return access;
        }


        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            // Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo prop in Props)
            {
                // Setting column names as Property names
                dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }

            foreach (T item in items)
            {
                var values = new object[Props.Length];

                for (int i = 0; i < Props.Length; i++)
                {
                    // Inserting property values to datatable rows
                    values[i] = Props[i].PropertyType.IsGenericType &&
                                 Props[i].PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ?
                                 Props[i].GetValue(item, null) ?? DBNull.Value :
                                 Props[i].GetValue(item, null);
                }

                dataTable.Rows.Add(values);
            }

            return dataTable;
        }

        public static UserAccessOption GetUserAccessSession(string page, ISession session)
        {
            UserAccessOption access = new UserAccessOption();

            if (!string.IsNullOrEmpty(page) && session.GetString("UserAccess") != null)
            {
                string serializedUserAccess = session.GetString("UserAccess");
                List<UserAccess> accessData = JsonConvert.DeserializeObject<List<UserAccess>>(serializedUserAccess);

                if (accessData != null)
                {
                    var data = accessData.Where(x => x.Module == page);
                    access = new UserAccessOption
                    {
                        Create = Convert.ToBoolean(data.FirstOrDefault(u => u.ModuleAction == "Create")?.IsHasAccess),
                        View = Convert.ToBoolean(data.FirstOrDefault(u => u.ModuleAction == "View")?.IsHasAccess),
                        Update = Convert.ToBoolean(data.FirstOrDefault(u => u.ModuleAction == "Update")?.IsHasAccess),
                        Delete = Convert.ToBoolean(data.FirstOrDefault(u => u.ModuleAction == "Delete")?.IsHasAccess)
                    };
                }
            }

            return access;
        }

        public static DataTable RemoveColumn(DataTable dataTable, string columnName)
        {
            if (dataTable.Columns.Contains(columnName))
            {
                dataTable.Columns.Remove(columnName);
            }
            return dataTable;
        }

        public static object GetFormattedDateTime(string requestDate)
        {
            DateTime dt;

            if (DateTime.TryParseExact(requestDate, new[] { "dd-MM-yyyy", "dd/MM/yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None, out dt))
            {
                return dt;
            }
            else
            {
                return DBNull.Value;
            }
        }

        public static string FromDateTimeParse(string originalDateString)
        {
            if (DateTime.TryParseExact(originalDateString, "dd-MM-yyyy HH:mm:ss", null, System.Globalization.DateTimeStyles.None, out DateTime date))
            {
                string formattedDateString = date.AddDays(1).ToString("yyyy-MM-dd");
                return formattedDateString;
            }
            return "";
        }

        public static object ParseInt(int? parseValue)
        {
            if (parseValue == null || parseValue == 0)
                return DBNull.Value;
            else
                return parseValue;
        }

        public static object ParseFloat(decimal? parseValue)
        {
            if (parseValue == null || parseValue == 0)
                return DBNull.Value;
            else
                return parseValue;
        }

        //public static async Task<bool> IsAttachmentDeleted(List<AttachmentDetails> lstattachment)
        //{
        //	bool isdeleted = false;
        //	try
        //	{
        //		foreach (var item in lstattachment)
        //		{
        //			if (item.AttachmentFilePath != null)
        //			{
        //				string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\");
        //				string filePath = directoryPath + item.AttachmentFilePath.Replace("../", "\\").Replace("/", "\\");
        //				File.Delete(filePath.Replace("\\\\", "\\"));
        //			}
        //		}
        //		isdeleted = true;
        //	}
        //	catch (Exception ex)
        //	{
        //		isdeleted = false;
        //	}
        //	return isdeleted;
        //}




    }
}
