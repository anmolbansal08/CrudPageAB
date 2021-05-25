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

    public class IssueConsumablesService : IIssueConsumablesService
    {
        public IssueConsumables GetIssueConsumablesRecord(string recordID)
        {

            IssueConsumables c = new IssueConsumables();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID.Split('-')[0])) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIssueConsumablesTrans", Parameters);
                if (dr.Read())
                {
                    c.SNo =(dr["Sno"].ToString());
                    c.IssueType =(dr["IssuedType"].ToString()=="True"?"1":"0");// == true ? "Airline" : "Agent";
                    c.IssuedType = Convert.ToBoolean(dr["IssuedType"]) == true ? "AIRLINE" : "FORWARDER (AGENT)";
                    c.IssuedTo = dr["IssuedTo"].ToString();
                    c.Text_IssuedTo = dr["Text_IssuedTo"].ToString();
                    c.IssuableItem = dr["IssueableItem"].ToString();
                    c.Text_IssuableItem = dr["Text_IssuableItem"].ToString();
                    c.NoOfItems = Convert.ToInt32(dr["NoOfItems"].ToString());
                    c.IssuableItems = dr["IssueableItem"].ToString();

                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return c;
        }

        public string GetIssueConsumablesTransRecord(int ConsumableSno)
        {

            try
            {
                SqlParameter[] Parameters = {
                                       new SqlParameter("@Sno", ConsumableSno)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIssueConsumablesTrans", Parameters);
                ds.Dispose();

                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }

        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<IssueConsumables>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListIssueConsumables", Parameters);
                var IssueConsumablesList = ds.Tables[0].AsEnumerable().Select(e => new IssueConsumables
                {
                    SNo = e["SNo"].ToString(),
                    Item = e["Item"].ToString(),
                    IssuedType = e["IssuedType"].ToString(),
                    IssuedTo = e["IssuedTo"].ToString(),
                    NoOfItem = Convert.ToInt32(e["NoOfItem"].ToString()),
                    // IssuedDate=e["IssuedDate"].ToString(),
                    IssuedDate = e["IssuedDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["IssuedDate"]), DateTimeKind.Utc),
                    Type = e["Type"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = IssueConsumablesList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public List<string> SaveIssueConsumables(List<IssueConsumablesList> IssueConsumables)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateIssueConsumables = CollectionHelper.ConvertTo(IssueConsumables, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                //if (!baseBusiness.ValidateBaseBusiness("IssueConsumables", dtCreateIssueConsumables, "SAVE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@IssueConsumablesTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateIssueConsumables;
                SqlParameter[] Parameters = { param };
                //SqlParameter[] param = { new SqlParameter("@IssueConsumablesTable",dtCreateIssueConsumables),new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateIssueConsumables", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IssueConsumables");
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
        //public List<string> UpdateIssueConsumables(List<IssueConsumables> IssueConsumables)
        //{
        //    //validate Business Rule
        //    DataTable dtUpdateIssueConsumables = CollectionHelper.ConvertTo(IssueConsumables, "");
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBusiness = new BaseBusiness();
        //    if (!baseBusiness.ValidateBaseBusiness("IssueConsumables", dtUpdateIssueConsumables, "UPDATE"))
        //    {
        //        ErrorMessage = baseBusiness.ErrorMessage;
        //        return ErrorMessage;
        //    }
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@IssueConsumablesTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    param.Value = dtUpdateIssueConsumables;
        //    SqlParameter[] Parameters = { param };

        //    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIssueConsumables", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            //For Customised Validation Messages like 'Record Already Exists' etc
        //            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityPacking");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(serverErrorMessage);
        //        }
        //        else
        //        {

        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }
        //    }

        //    return ErrorMessage;
        //}
        public List<string> DeleteIssueConsumables(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIssueConsumables", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IssueConsumables");
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

                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                    //Error
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }
        public KeyValuePair<string, List<IssueConsumables>> ViewGrid(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                List<IssueConsumables> listIssueConsumables = new List<IssueConsumables>();

                string issuedTo = whereCondition;
                whereCondition = "";

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition),
                                         new SqlParameter("@IssuedTo", issuedTo) ,  new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetGridRecordIssueConsumables", Parameters);

                var ViewOpendetailList = ds.Tables[0].AsEnumerable().Select(e => new IssueConsumables

                {
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    Item = e["Item"].ToString(),
                    //  Qty = Convert.ToInt32(e["Qty"]),
                    //  IssuedDate = e["IssuedDate"].ToString(),
                    IssuedDate = Convert.ToDateTime(e["IssuedDate"]),
                    //   ULDNo = e["ULDNo"].ToString()
                });
                return new KeyValuePair<string, List<IssueConsumables>>(ds.Tables[1].Rows[0][0].ToString(), ViewOpendetailList.AsQueryable().ToList());

                //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetNewRecordConsumableStock", Parameters);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }

        }



        //public KeyValuePair<string, List<IssueConsumablesList>> GetIssueConsumablesRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        //{
        //    List<IssueConsumablesList> listIssueConsumables = new List<IssueConsumablesList>();
        // //   TimeZoneTrans ConsolidatorBranchContact = new TimeZoneTrans();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTimeZoneTransRecord", Parameters);
        //    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //    {
        //        foreach (DataRow dr in ds.Tables[0].Rows)
        //        {
        //            listIssueConsumables.Add(new IssueConsumablesList
        //            {
        //                SNo = Convert.ToInt32(dr["SNo"]),
        //                ConsumablePrefix = dr["ConsumablePrefix"].ToString(),
        //                ConsumableType = dr["ConsumableType"].ToString(),
        //                ConsumableNo = dr["ConsumableNo"].ToString(),
        //                NoOfItems = Convert.ToInt32(dr["NoOfItems"].ToString()),
        //                IssueType = "0",
        //                IssuedToSNo =0,
        //                ConsumableSNo = Convert.ToInt32(dr["ConsumableStockSno"].ToString()),
        //            }
        //            );
        //        }
        //    }

        //    return new KeyValuePair<string, List<IssueConsumablesList>>(ds.Tables[1].Rows[0][0].ToString(), listIssueConsumables.AsQueryable().ToList());

        //}


        public string GetConsumableIssueStockRecord(int ConsumableSno, int NoOfItems)
        {
            try
            {

                SqlParameter[] Parameters = {
                                       new SqlParameter("@Sno", ConsumableSno),new SqlParameter("@NoOfItems", NoOfItems)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIssueStockListRecord", Parameters);
                ds.Dispose();

                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public string CreateIssueConsumables(List<IssueConsumablesList> lstConsumabIssue)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            int ret = 0;
            try
            {
                DataTable dtlstConsumabIssue = CollectionHelper.ConvertTo(lstConsumabIssue, "");
              //  var dtlstConsumabIssue = JsonConvert.DeserializeObject<DataTable>(lstConsumabIssue);


                SqlParameter[] Parameters = { new SqlParameter("@IssueConsumablesTable", dtlstConsumabIssue), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateIssueConsumables", Parameters);


            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return ret.ToString();
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


    }
}
