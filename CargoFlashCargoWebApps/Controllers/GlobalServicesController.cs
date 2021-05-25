using CargoFlash.Cargo.Model;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class GlobalServicesController : Controller
    {
        
      
        [HttpPost]
        [AllowAnonymous]
        public DataSourceResult AutoComplete(int pageSize, GridFilter filter, string autoCompleteName, List<CargoFlash.Cargo.Business.SQLParameterList> Parameters = null)
        {
            try
            {
                CargoFlash.Cargo.Business.AutoCompleteNGen autocomplete = CargoFlash.Cargo.Business.Common.AutoCompletes.Where(s => s.AutoCompleteName == autoCompleteName && s.IsAccessOutSide==true).FirstOrDefault();

                string filters = "";
                autocomplete.ProcName = (autocomplete.TableName == "" ? autocomplete.ProcName : "AutoCompleteGetList");
                if (filter != null)
                {
                    try
                    {
                        GridFilter.ProcessFilter(filter, ref filters);
                    }
                    catch (Exception ex)// (Exception ex)
                    {
                        string strerror = ex.Message;
                    }
                }
                string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
                if (autocomplete.TemplateColumn != null && autocomplete.TemplateColumn.Split(',').Count() > 1)
                {
                    foreach (string strColName in autocomplete.TemplateColumn.Split(','))
                    {
                        templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                    }
                    if (filters.Contains("like") && filters.IndexOf("%") != -1)
                    {
                        var newFilter = "";
                        if (autocomplete.TableName == "vAccountForAgent_Reservation")
                        {
                            newFilter = ReplaceFirst(filters, ") ) or  (", ") or ");
                        }
                        else
                            newFilter = ReplaceFirst(filters, "%", "");
                        var res = GetAutoCompleteRecord(pageSize, newFilter, autocomplete.TableName, autocomplete.keyColumn, autocomplete.TextColumn, templateColName, autocomplete.ProcName, autocomplete.TemplateColumn.Split(',').ToList(), Parameters);
                        if (res.Total > 0)
                            return res;
                        else
                            return GetAutoCompleteRecord(pageSize, filters, autocomplete.TableName, autocomplete.keyColumn, autocomplete.TextColumn, templateColName, autocomplete.ProcName, autocomplete.TemplateColumn.Split(',').ToList(), Parameters);
                    }
                }
                else
                {
                    if (filters.Contains("like") && filters.IndexOf("%") != -1)
                    {
                        var newFilter1 = "";
                        if (autocomplete.TableName == "vAccountForAgent_Reservation")
                        {
                            newFilter1 = ReplaceFirst(filters, ") ) or  (", ") or ");
                            filters = newFilter1;
                        }
                    }
                    templateColName = "CAST(" + autocomplete.TextColumn + " AS VARCHAR(MAX))";
                }
                return GetAutoCompleteRecord(pageSize, filters, autocomplete.TableName, autocomplete.keyColumn, autocomplete.TextColumn, templateColName, autocomplete.ProcName, autocomplete.TemplateColumn.Split(',').ToList(), Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {

                return new DataSourceResult
                {
                    Data = new List<AutoComplete>(),
                    Total = 0
                };
            }
        }

        private string ReplaceFirst(string text, string search, string replace)
        {
            int pos = text.IndexOf(search);
            if (pos < 0)
            {
                return text;
            }
            return text.Substring(0, pos) + replace + text.Substring(pos + search.Length);
        }


        private DataSourceResult GetAutoCompleteRecord(int pageSize, string filters, string tableName, string keyColumn, string textColumn, string templateColName, string procedureName, List<string> templateColumn, List<CargoFlash.Cargo.Business.SQLParameterList> Parameters = null)
        {

            // SqlParameter[] Parameters = { new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@TableName", tableName), new SqlParameter("@KeyColumn", keyColumn), new SqlParameter("@TextColumn", textColumn), new SqlParameter("@TemplateColumn", templateColName) };
            List<SqlParameter> ParameterList = new List<SqlParameter>();
            if (Parameters != null)
            {
                foreach (CargoFlash.Cargo.Business.SQLParameterList lst in Parameters)
                {
                    ParameterList.Add(new SqlParameter("@" + lst.ParameterName, lst.ParameterValue));
                }

            }
            else
            {
                ParameterList.Add(new SqlParameter("@PageSize", pageSize));
                ParameterList.Add(new SqlParameter("@WhereCondition", filters));
                ParameterList.Add(new SqlParameter("@TableName", tableName));
                ParameterList.Add(new SqlParameter("@KeyColumn", keyColumn));
                ParameterList.Add(new SqlParameter("@TextColumn", textColumn));
                ParameterList.Add(new SqlParameter("@TemplateColumn", templateColName));
            }

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, ParameterList.ToArray());
            textColumn = textColumn.Replace("@", "");// REMOVE @ FROM AUTOCOMPLETE TO WHICH DISPLAY CODE ON SELECT

            var groupList = ds.Tables[0].AsEnumerable().Select(e => new AutoComplete
            {
                Key = e[keyColumn].ToString(),
                Text = e[textColumn].ToString(),
                TemplateColumn = (templateColumn == null || templateColumn.Count == 0 ? e[textColumn].ToString() : e["templateColumn"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = groupList.AsQueryable().ToList(),
                Total = groupList.AsQueryable().ToList().Count
            };
        }

               
    }
}