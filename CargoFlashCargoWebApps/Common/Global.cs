// <copyright file="Global.cs" company="Cargoflash">
//
// Created On: 14-Feb-2017
// Created By: Braj
// Description: Global
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>

namespace CargoFlashCargoWebApps.Common
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Web;
    using System.Web.Script.Serialization;
    #endregion

    /// <summary>
    /// This is used for common method and properties
    /// </summary>
    public class Global
    {
        /// <summary>
        /// This method used for converting list to datatable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <returns></returns>
        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);
            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }

        /// <summary>
        /// This method used for convert dataset to json string 
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        public static string DStoJSON(DataSet ds)
        {
            // Modified By Brajraj Singh Tomar
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> table = new List<Dictionary<string, object>>();
            if (ds != null && ds.Tables.Count > 0)
            {
                Dictionary<string, object> data;
                bool isList = false;
                DataTable dt = ds.Tables[ds.Tables.Count - 1];
                isList = dt.Columns.Contains("list");

                foreach (DataRow dr in dt.Rows)
                {
                    data = new Dictionary<string, object>();
                    foreach (DataColumn dc in dt.Columns)
                    {
                        if (dc.DataType.Name.ToUpper() == "DATETIME")
                            data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString(CargoFlash.SoftwareFactory.Data.DateFormat.DateFormatString));
                        else
                            data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                    }
                    table.Add(data);
                }

            }
            return serializer.Serialize(table);
        }


        /// <summary>
        /// This method used for only single table convert from dataset to json string 
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        public static string DStoJSON(DataSet ds, int tableId)
        {
            // Modified By Brajraj Singh Tomar
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> table = new List<Dictionary<string, object>>();
            if (ds != null && ds.Tables.Count > 0)
            {
                Dictionary<string, object> data;
                bool isList = false;
                DataTable dt = ds.Tables[tableId];
                isList = dt.Columns.Contains("list");

                foreach (DataRow dr in dt.Rows)
                {
                    data = new Dictionary<string, object>();
                    foreach (DataColumn dc in dt.Columns)
                    {
                        if (dc.DataType.Name.ToUpper() == "DATETIME")
                            data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString(CargoFlash.SoftwareFactory.Data.DateFormat.DateFormatString));
                        else
                            data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                    }
                    table.Add(data);
                }

            }
            return serializer.Serialize(table);
        }

      
    }
}