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
using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class ReturnConsumableService : SignatureAuthenticate, IReturnConsumableService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ReturnConsumableGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListReturnConsumables", Parameters);
                var ReturnConsumableList = ds.Tables[0].AsEnumerable().Select(e => new ReturnConsumableGrid
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    Item = e["Item"].ToString(),
                    ReturnType = e["ReturnType"].ToString(),
                    ReturnFrom = e["ReturnFrom"].ToString(),
                    NoOFItem = e["NoOfItem"].ToString(),
                    // ReturnDate = e["ReturnDate"].ToString(),
                    ReturnDate = e["ReturnDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ReturnDate"]), DateTimeKind.Utc),

                    Type = e["Type"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ReturnConsumableList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
        public ReturnConsumableTrans GetReturnConsumableRecord(string recordID)
        {

            ReturnConsumableTrans RC = new ReturnConsumableTrans();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordReturnConsumable", Parameters);
                if (dr.Read())
                {
                    RC.SNo = Convert.ToInt32(dr["SNo"].ToString());
                    RC.ReturnableItem = dr["Item"].ToString();
                    RC.Text_ReturnableItem = dr["Text_Item"].ToString();
                    RC.NoOFItems = dr["NoOfItem"].ToString();
                    RC.ReturnType = dr["ReturnType"].ToString();
                    RC.Text_ReturnFrom = dr["Text_ReturnFrom"].ToString();
                    RC.ReturnFrom = dr["ReturnFrom"].ToString();
                    RC.Text_ReturnType = (dr["ReturnType"].ToString() == "False" ? "FORWARDER (AGENT)" : "AIRLINE");

                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return RC;
        }


        public string GetReturnConsumableTransRecord(int Sno)
        {
            try
            {

                SqlParameter[] Parameters = {
                                       new SqlParameter("@Sno", Sno)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordReturnConsumable", Parameters);
                ds.Dispose();

                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }

        }


        public static string CompleteDStoJSON(DataSet ds)
        {
            StringBuilder json = new StringBuilder();
            if (ds != null && ds.Tables.Count > 0)
            {
                json.Append("{");
                for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
                {
                    if (tblCount > 0)
                        json.Append(",");
                    json.Append("\"Table" + tblCount.ToString() + "\":");
                    int lInteger = 0;
                    json.Append("[");
                    foreach (DataRow dr in ds.Tables[tblCount].Rows)
                    {
                        lInteger = lInteger + 1;
                        json.Append("{");
                        int i = 0;
                        int colcount = dr.Table.Columns.Count;
                        foreach (DataColumn dc in dr.Table.Columns)
                        {
                            json.Append("\"");
                            json.Append(dc.ColumnName);
                            json.Append("\":\"");
                            json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                            json.Append("\"");
                            i++;
                            if (i < colcount) json.Append(",");
                        }

                        if (lInteger < ds.Tables[tblCount].Rows.Count)
                        {
                            json.Append("},");
                        }
                        else
                        {
                            json.Append("}");
                        }
                    }
                    json.Append("]");
                }
                json.Append("}");
            }
            else
            {
                json.Append("[");
                json.Append("]");
            }


            return json.ToString();
        }

        public List<string> SaveReturnConsumable(List<ReturnConsumable> ReturnConsumable)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtReturnConsumable = CollectionHelper.ConvertTo(ReturnConsumable, "ReturnDate,Text_AirlineSNo,AirlineCode,,Text_AircraftSNo,Text_ProductSNo,ProductName,Text_ConnectionTypeSNo,AircraftType,Text_SPHCSNo,SPHCode,AcceptanceCutoffTypeName,BaseSetting,AcceptanceActive,Text_AcceptanceCutoffType,Active,Text_AirportCode,DayLightSaving,Text_CityCode,Text_CountryCode");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ReturnConsumable", dtReturnConsumable, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ReturnConsumableType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtReturnConsumable;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateReturnConsumable", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ReturnConsumable");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public string CreateReturnConsumables(List<ReturnConsumablesList> lstConsumabReturn)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            int ret = 0;
            try
            {
                DataTable dtlstConsumabReturn = CollectionHelper.ConvertTo(lstConsumabReturn, "");
                //  var dtlstConsumabIssue = JsonConvert.DeserializeObject<DataTable>(lstConsumabIssue);


                SqlParameter[] Parameters = { new SqlParameter("@ReturnConsumableType", dtlstConsumabReturn), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateReturnConsumable", Parameters);


            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return ret.ToString();
        }



        public string GetConsumableIssueRecordForRetun(int ConsumableSno, int NoOfItems, string ReturnType, string ReturnFrom)
        {
            try
            {

                SqlParameter[] Parameters = {
                                       new SqlParameter("@SNo", ConsumableSno),new SqlParameter("@NoOfItems", NoOfItems),new SqlParameter("@ReturnType", ReturnType)
                                        ,new SqlParameter("@ReturnFrom", ReturnFrom)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIssueStockListRecordForReturn", Parameters);
                ds.Dispose();

                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
    }
}
