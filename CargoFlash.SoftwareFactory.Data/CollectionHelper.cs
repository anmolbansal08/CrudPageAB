using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.ComponentModel;
using System.Reflection;

namespace CargoFlash.SoftwareFactory.Data
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, Inherited = true, AllowMultiple = false)]
    [ImmutableObject(true)]
    public sealed class OrderAttribute : Attribute
    {
        private readonly int order;
        public int Order { get { return order; } }
        public OrderAttribute(int order) { this.order = order; }
    }

    public class CollectionHelper
    {
        private CollectionHelper()
        {
        }

        public static DataTable ConvertTo<T>(IList<T> list, string excludeColumns)
        {
            excludeColumns = (excludeColumns == "" ? "Errors,ErrorValue,ErrorMessage,CreatedUser,UpdatedUser" : "Errors,ErrorValue,ErrorMessage,CreatedUser,UpdatedUser," + excludeColumns);
            DataTable table = CreateTable<T>(excludeColumns);
            Type entityType = typeof(T);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

            foreach (T item in list)
            {
                DataRow row = table.NewRow();
                string[] excludeColumn = excludeColumns.Split(',');
                foreach (PropertyDescriptor prop in properties)
                {
                    if (!excludeColumn.Contains(prop.Name))
                        row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                }

                table.Rows.Add(row);
            }

            return table;
        }
        
        public static DataTable CreateTable<T>(string excludeColumns)
        {
            string[] excludeColumn = excludeColumns.Split(',');
            Type entityType = typeof(T);
            DataTable table = new DataTable(entityType.Name);

            

            var props = typeof(T)
   .GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
   .Select(x => new
   {
       Property = x,
       Attribute = (OrderAttribute)Attribute.GetCustomAttribute(x, typeof(OrderAttribute), true)
   })
        .OrderBy(x => x.Attribute != null ? x.Attribute.Order : -1)
        .Select(x => x.Property)
        .ToArray();
            
            foreach (PropertyInfo prop in props)
            {
                if (!excludeColumn.Contains(prop.Name))
                {
                    table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);}

            }

            return table;
        }

        public static IList<T> ConvertTo<T>(IList<DataRow> rows)
        {
            IList<T> list = null;

            if (rows != null)
            {
                list = new List<T>();

                foreach (DataRow row in rows)
                {
                    T item = CreateItem<T>(row);
                    list.Add(item);
                }
            }

            return list;
        }

        public static IList<T> ConvertTo<T>(DataTable table)
        {
            if (table == null)
            {
                return null;
            }

            List<DataRow> rows = new List<DataRow>();

            foreach (DataRow row in table.Rows)
            {
                rows.Add(row);
            }

            return ConvertTo<T>(rows);
        }

        public static T CreateItem<T>(DataRow row)
        {
            T obj = default(T);
            if (row != null)
            {

                obj = Activator.CreateInstance<T>();

                foreach (DataColumn column in row.Table.Columns)
                {
                    PropertyInfo prop = obj.GetType().GetProperty(column.ColumnName);
                    try
                    {
                        object value = row[column.ColumnName];
                        prop.SetValue(obj, value, null);
                    }
                    catch
                    {
                        // You can log something here
                        throw;
                    }
                }
            }

            return obj;
        }
    }
}
