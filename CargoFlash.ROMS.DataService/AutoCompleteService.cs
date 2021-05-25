//Modified By Manoj Kumar Chaurasiya on 27DEC 2017 Add List of SQLParameters in AutoCompleteDataSourceV2,GetAutoCompleteRecord and WMSAutoCompleteDataSource;
//Modified By jitendra kumar,10oct 2017 method ImportFBLAutoCompleteDataSource

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Import;

namespace CargoFlash.Cargo.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AutoCompleteService : SignatureAuthenticate, IAutoCompleteService
    {

        public DataSourceResult AutoCompleteDataSourceV2(int pageSize, GridFilter filter, string autoCompleteName, List<CargoFlash.Cargo.Business.SQLParameterList> Parameters = null)
        {
            try
            {
                CargoFlash.Cargo.Business.AutoCompleteNGen autocomplete = CargoFlash.Cargo.Business.Common.AutoCompletes.Where(s => s.AutoCompleteName == autoCompleteName).FirstOrDefault();

                string filters = "";
                string procName = autocomplete.ProcName;
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

                        if (!string.IsNullOrEmpty(procName) && Parameters != null)
                            return GetAutoCompleteRecord(pageSize, newFilter, autocomplete.TableName, autocomplete.keyColumn, autocomplete.TextColumn, templateColName, autocomplete.ProcName, autocomplete.TemplateColumn.Split(',').ToList(), Parameters);


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

        public DataSourceResult AutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "")
        {
            string filters = "";
            procedureName = (tableName == "" ? procedureName : "AutoCompleteGetList");
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
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
                if (filters.Contains("like") && filters.IndexOf("%") != -1)
                {
                    var newFilter = "";
                    if (tableName == "vAccountForAgent_Reservation")
                    {
                        newFilter = ReplaceFirst(filters, ") ) or  (", ") or ");
                    }
                    else
                        newFilter = ReplaceFirst(filters, "%", "");
                    var res = GetAutoCompleteRecord(pageSize, newFilter, tableName, keyColumn, textColumn, templateColName, procedureName, templateColumn);
                    if (res.Total > 0)
                        return res;
                    else
                        return GetAutoCompleteRecord(pageSize, filters, tableName, keyColumn, textColumn, templateColName, procedureName, templateColumn);
                }
            }
            else
            {
                if (filters.Contains("like") && filters.IndexOf("%") != -1)
                {
                    var newFilter1 = "";
                    if (tableName == "vAccountForAgent_Reservation")
                    {
                        newFilter1 = ReplaceFirst(filters, ") ) or  (", ") or ");
                        filters = newFilter1;
                    }
                }
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }
            return GetAutoCompleteRecord(pageSize, filters, tableName, keyColumn, textColumn, templateColName, procedureName, templateColumn);
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

            List<SqlParameter> ParameterList = new List<SqlParameter>();


            ParameterList.Add(new SqlParameter("@PageSize", pageSize));
            ParameterList.Add(new SqlParameter("@WhereCondition", filters));
            if (Parameters == null)
                ParameterList.Add(new SqlParameter("@TableName", tableName));
            ParameterList.Add(new SqlParameter("@KeyColumn", keyColumn));
            ParameterList.Add(new SqlParameter("@TextColumn", textColumn));
            ParameterList.Add(new SqlParameter("@TemplateColumn", templateColName));
            if (Parameters != null)
            {
                ParameterList.Add(new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo));
                foreach (CargoFlash.Cargo.Business.SQLParameterList lst in Parameters)
                {
                    ParameterList.Add(new SqlParameter("@" + lst.ParameterName, lst.ParameterValue));
                }
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

        public DataSourceResult WMSFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }

            DataSet ds = new DataSet();
            if (procedureName == "GetImportSPHCCheckList")
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", awbSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }
            else
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType!=""?movementType:"2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo", 1) ,
                                            new SqlParameter("@SubProcessSNo", 7) ,
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),
                                            new SqlParameter("@IsESS", 1)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }

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

        public DataSourceResult ExportESSWMSFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string GrWT = "", string Pieces = "", string cityChangeFlag = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }

            DataSet ds = new DataSet();
            if (procedureName == "GetImportSPHCCheckList")
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", awbSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }
            else
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", "2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", 1),
                                            new SqlParameter("@SubProcessSNo", 7),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()) ,
                                            new SqlParameter("@GrWT",GrWT),
                                            new SqlParameter("@VolWt",0),
                                            new SqlParameter("@ChWt",chWt),
                                            new SqlParameter("@Pieces",Pieces),
                                            new SqlParameter("@Remarks","")
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }

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

        public DataSourceResult ImportESSFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", List<DOShipmentInfo> ShipmentDetailArray = null, string cityChangeFlag = "", string Remarks = "")
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(ShipmentDetailArray, "ULDSNo");
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }

            DataSet ds = new DataSet();
            if (procedureName == "GetImportSPHCCheckList")
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", awbSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }
            else
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType!=""?movementType:"2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo",22 ) ,
                                            new SqlParameter("@SubProcessSNo", 2135) ,
                                              new SqlParameter("@PartShipmentType",dtShipmentInfo),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),

                                            new SqlParameter("@Remarks", Remarks)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }

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

        public DataSourceResult ImportFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", List<DOShipmentInfo> ShipmentDetailArray = null, string ProcessSNo = "", string subprocesssno = "", string cityChangeFlag = "", string Remarks = "")
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(ShipmentDetailArray, "ULDSNo");
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }

            DataSet ds = new DataSet();
            if (procedureName == "GetImportSPHCCheckList")
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", awbSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }
            else
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType!=""?movementType:"2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo",ProcessSNo ) ,
                                            new SqlParameter("@SubProcessSNo", subprocesssno) ,
                                              new SqlParameter("@PartShipmentType",dtShipmentInfo),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@Remarks", Remarks)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }

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


        public DataSourceResult AutoCompleteResourceEmployee(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string employee = "", string staffStatus = "", string degination = "", string dutyarea = "", string start = "", string end = "")
        {

            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }
            SqlParameter[] Parameters = {
                                               new SqlParameter("@Employee", employee),
                                                  new SqlParameter("@Designation", degination),
                                                        new SqlParameter("@DutyArea", dutyarea),
                                                         new SqlParameter("@StaffStatus", staffStatus),
                                                          new SqlParameter("@StartTime", start),
                                                           new SqlParameter("@EndTime", end),
                                                        new SqlParameter("@filters",filters)

                                        };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);

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
        public DataSourceResult WMSRFSAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }
            //SqlParameter[] Parameters = { new SqlParameter("@AwbSNo", awbSNo), new SqlParameter("@CityCode", cityCode), new SqlParameter("@MovementType", movementType == "" ? 2 : Convert.ToInt32(movementType)), new SqlParameter("@ShipmentType", "0"), new SqlParameter("@HAWBSNo", hawbSNo) };


            SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType!=""?movementType:"2"),
                                            new SqlParameter("@ShipmentType", "5"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo", 33) ,
                                            new SqlParameter("@SubProcessSNo", 2297) ,
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),
                                            new SqlParameter("@IsESS", 1)
                                        };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);

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

        public DataSourceResult SLIESAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }
            //SqlParameter[] Parameters = { new SqlParameter("@AwbSNo", awbSNo), new SqlParameter("@CityCode", cityCode), new SqlParameter("@MovementType", movementType == "" ? 2 : Convert.ToInt32(movementType)), new SqlParameter("@ShipmentType", "0"), new SqlParameter("@HAWBSNo", hawbSNo) };


            SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType!=""?movementType:"3"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo", 14) ,
                                            new SqlParameter("@SubProcessSNo", 1055) ,
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString())
                                        };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);

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

        public DataSourceResult POMailAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }
            //SqlParameter[] Parameters = { new SqlParameter("@AwbSNo", awbSNo), new SqlParameter("@CityCode", cityCode), new SqlParameter("@MovementType", movementType == "" ? 2 : Convert.ToInt32(movementType)), new SqlParameter("@ShipmentType", "0"), new SqlParameter("@HAWBSNo", hawbSNo) };


            SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType!=""?movementType:"0"),
                                            new SqlParameter("@ShipmentType", "1"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo", 17) ,
                                            new SqlParameter("@SubProcessSNo", 2195) ,
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString())
                                        };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);

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

        public DataSourceResult WMSAutoCompleteDataSource(int pageSize, GridFilter filter, string autoCompleteName, List<CargoFlash.Cargo.Business.SQLParameterList> Parameters)
        {
            try
            {
                CargoFlash.Cargo.Business.AutoCompleteNGen autocomplete = CargoFlash.Cargo.Business.Common.AutoCompletes.Where(s => s.AutoCompleteName == autoCompleteName).FirstOrDefault();


                string filters = "";
                autocomplete.ProcName = (!string.IsNullOrEmpty(autocomplete.ProcName) ? autocomplete.ProcName : "AutoCompleteGetList");
                if (filter != null)
                {
                    try
                    {
                        //if (tableName == "vBuidupOtherPallet")// Used in Build Up Page
                        //{
                        //    var filtersNew = filter.Filters;
                        //    var parameters = new List<object>();
                        //    for (int i = 0; i < filtersNew[0].Filters.Count; i++)
                        //    {
                        //        GridFilter f = filtersNew[0].Filters[i];

                        //        if (f.Field == "BaseULD")
                        //        {
                        //            filters = "(BaseULD=" + f.Value + " or BaseULD=0)" + (filters == "" ? "" : " and " + filters);
                        //        }
                        //        else
                        //        {
                        //            if (f.Value != "#")
                        //                filters = (filters == "" ? "" : filters + " and ") + "ULDNo<>'" + f.Value + "'";
                        //            else
                        //                filters = (filters == "" ? "" : filters + " and ") + "ULDNo='" + f.Value + "'";
                        //        }
                        //    }
                        //}
                        //else
                        {
                            int totalFilter = filter.Filters.Count;
                            GridFilter.WMSProcessFilter(filter, ref filters, filter.Logic, ref totalFilter);
                        }
                    }
                    catch (Exception ex)// (Exception ex)
                    {
                        string strerror = ex.Message;
                    }
                }
                string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
                if (!string.IsNullOrEmpty(autocomplete.TemplateColumn) && autocomplete.TemplateColumn.Split(',').Count() > 1)
                {
                    foreach (string strColName in autocomplete.TemplateColumn.Split(','))
                    {
                        templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                    }
                }
                else
                {
                    templateColName = "CAST(" + autocomplete.TextColumn + " AS VARCHAR(MAX))";
                }
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
                    ParameterList.Add(new SqlParameter("@TableName", autocomplete.TableName));
                    ParameterList.Add(new SqlParameter("@KeyColumn", autocomplete.keyColumn));
                    ParameterList.Add(new SqlParameter("@TextColumn", autocomplete.TextColumn));
                    ParameterList.Add(new SqlParameter("@TemplateColumn", templateColName));
                }
                // SqlParameter[] Parameters = { new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@TableName", autocomplete.TableName), new SqlParameter("@KeyColumn", autocomplete.keyColumn), new SqlParameter("@TextColumn", autocomplete.TextColumn), new SqlParameter("@TemplateColumn", templateColName) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, autocomplete.ProcName, ParameterList.ToArray());

                var groupList = ds.Tables[0].AsEnumerable().Select(e => new AutoComplete
                {
                    Key = e[autocomplete.keyColumn].ToString(),
                    Text = e[autocomplete.TextColumn].ToString(),
                    TemplateColumn = (autocomplete.TemplateColumn == null || autocomplete.TemplateColumn.Split(',').Count() == 1 ? e[autocomplete.TextColumn].ToString() : e["templateColumn"].ToString())
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = groupList.AsQueryable().ToList(),
                    Total = groupList.AsQueryable().ToList().Count
                };
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

        public DataSourceResult AutoCompleteDataSourcebyAWB(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string currentawbsno = "", string StartTemp = "", string EndTemp = "")
        {
            string filters = "";
            procedureName = (tableName == "" ? procedureName : "AutoCompleteGetList");
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
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", currentawbsno), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@TableName", tableName), new SqlParameter("@KeyColumn", keyColumn), new SqlParameter("@TextColumn", textColumn), new SqlParameter("@TemplateColumn", templateColName), new SqlParameter("@StartTemp", StartTemp), new SqlParameter("@EndTemp", EndTemp) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);

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

        public DataSourceResult ESSAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }

            DataSet ds = new DataSet();

            if (procedureName == "GetImportSPHCCheckList")
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", awbSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }
            else
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType!=""?movementType:"2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo", 1004) ,
                                            new SqlParameter("@SubProcessSNo", 2306) ,
                                            // new SqlParameter("@RateType", chargeTo) ,
                                            //new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),
                                            //new SqlParameter("@IsESS", 1)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }

            var groupList = ds.Tables[0].AsEnumerable().Select(e => new AutoComplete
            {
                Key = e[keyColumn].ToString(),
                Text = e[textColumn].ToString(),
                //TemplateColumn = (templateColumn == null || templateColumn.Count == 0 ? e[textColumn].ToString() : e["templateColumn"].ToString())
                TemplateColumn = (templateColumn == null || templateColumn.Count == 0 ? e[textColumn].ToString() : e[templateColumn[0]].ToString() + (e[templateColumn[1]].ToString() == null ? "" : "-" + e[templateColumn[1]].ToString())
                )
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = groupList.AsQueryable().ToList(),
                Total = groupList.AsQueryable().ToList().Count
            };

        }

        public DataSourceResult CTMAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "", string FlightSNo = "", string CTMSNo = "", string ProcessSNo = "", string SubProcessSNo = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }

            DataSet ds = new DataSet();

            if (procedureName == "GetImportSPHCCheckList")
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", awbSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }
            else
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo", ProcessSNo) ,
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo) ,
                                            new SqlParameter("@DOSNo", FlightSNo) ,
                                            new SqlParameter("@PDSNo", CTMSNo) ,
                                             new SqlParameter("@RateType", chargeTo) ,
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),

                                            new SqlParameter("@IsESS", 0)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }

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

        public DataSourceResult LUCAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "", string FlightSNo = "", string CTMSNo = "", string ProcessSNo = "", string SubProcessSNo = "")
        {
            string filters = "";
            procedureName = (!string.IsNullOrEmpty(procedureName) ? procedureName : "AutoCompleteGetList");
            if (filter != null)
            {
                try
                {
                    int totalFilter = filter.Filters.Count;
                    GridFilter.ProcessFilter(filter, ref filters);
                }
                catch (Exception ex)// (Exception ex)
                {
                    string strerror = ex.Message;
                }
            }
            string templateColName = "";//'CAST("+templateColumn+" AS VARCHAR(MAX))'   
            if (templateColumn != null && templateColumn.Count > 0)
            {
                foreach (string strColName in templateColumn)
                {
                    templateColName = templateColName + (templateColName == "" ? "" : "+'-'+") + "CAST(" + strColName + " AS VARCHAR(MAX))";
                }
            }
            else
            {
                templateColName = "CAST(" + textColumn + " AS VARCHAR(MAX))";
            }

            DataSet ds = new DataSet();

            if (procedureName == "GetImportSPHCCheckList")
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", awbSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }
            else
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", awbSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", movementType),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", hawbSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", filters) ,
                                            new SqlParameter("@ProcessSNo", ProcessSNo) ,
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo) ,
                                            new SqlParameter("@DOSNo", FlightSNo) ,
                                            new SqlParameter("@PDSNo", CTMSNo) ,
                                             new SqlParameter("@RateType", chargeTo) ,
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),

                                            new SqlParameter("@IsESS", 0)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procedureName, Parameters);
            }

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
