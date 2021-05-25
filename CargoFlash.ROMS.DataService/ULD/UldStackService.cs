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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UldStackService : SignatureAuthenticate, IUldStackService
    {
        UldStackCombined uldStackCombined;
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);

            string filters = GridFilter.ProcessFilters<UldStack>(filter);
            SqlParameter[] Parameters = { 
                new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUldStack", Parameters);
            var IrregularityList = ds.Tables[0].AsEnumerable().Select(e => new UldStack
            {
                UldStackSNo = Convert.ToInt32(e["ULDStackSNo"].ToString()),
                BaseUldNo = e["BaseUldNo"].ToString(),
                CountOfStack = Convert.ToInt32(string.IsNullOrEmpty(e["CountOfStack"].ToString()) ? 0 : e["CountOfStack"]),
                ScaleWeight = Convert.ToDecimal(string.IsNullOrEmpty(e["ScaleWeight"].ToString()) ? 0.0 : e["ScaleWeight"]),
                //CreatedOn = Convert.ToDateTime(string.IsNullOrEmpty(e["CreatedOn"].ToString()) ? "01-01-1901" : e["CreatedOn"].ToString()),
                CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                Airline = e["Airline"].ToString(),
                FlightNo = e["FlightNo"].ToString().ToUpper(),
                // FlightDate = e["flightdate"].ToString(),
                FlightDate = e["flightdate"].ToString() == "" ? "" : e["flightdate"].ToString(),
                Status = e["Status"].ToString().ToUpper(),
                AirlineSNo = e["AirlineSNo"].ToString(),
                Route = e["Route"].ToString(),
                OffPoint = e["OffPoint"].ToString()


            });

            //UldStackSNo = Convert.ToInt32(string.IsNullOrEmpty(e["ULDStockSNo"].ToString()) ? 0 : e["ULDStockSNo"]),
            //    CountOfStack = Convert.ToInt32(string.IsNullOrEmpty(e["CountAsStock"].ToString()) ? 0 : e["countAsStock"]),
            //    ScaleWeight = Convert.ToDecimal(string.IsNullOrEmpty(e["ScaleWeight"].ToString()) ? 0.0 : e["ScaleWeight"]),
            //    CreatedOn = Convert.ToDateTime(string.IsNullOrEmpty(e["CreatedOn"].ToString()) ? "01-01-1901" : e["CreatedOn"].ToString()),
            //    Airline = e["AirlineCode"].ToString(),
            //    FlightNo = e["FlightNo"].ToString().ToUpper(),
            //    FlightDate = Convert.ToDateTime(string.IsNullOrEmpty(e["Flightdate"].ToString()) ? "01-01-1901" : e["flightdate"].ToString()),
            //    Status = e["Status"].ToString().ToUpper()
            ds.Dispose();
            return new DataSourceResult
            {
                Data = IrregularityList.AsQueryable().ToList(),
                Total = ds.Tables[1].Rows.Count > 0 ? Convert.ToInt16(ds.Tables[1].Rows[0][0].ToString()) : 1
            };
           }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string BaseUldData(string lstUldStack)
        {

            //DataTable dtlstUldStack = CollectionHelper.ConvertTo(lstUldStack, "");
            ////  var dtlstConsumabIssue = JsonConvert.DeserializeObject<DataTable>(lstConsumabIssue);

            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@lstUldStack", lstUldStack) };
            var ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "getUldTareWeightAndOwner", Parameters);
            return DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string CheckBaseUldData(string ChklstUldStack)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@lstUldStack", ChklstUldStack) };
            var ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "getUldTareWeightAndOwnerMultiple", Parameters);
            return DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ValidateBaseUld(string UldNo, string AirlineCode, string CityCode, int AirportSno)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@UldNo", UldNo), new SqlParameter("@AirlineCode", AirlineCode), new SqlParameter("@CityCode", CityCode), new SqlParameter("@AirportSno", AirportSno) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidatUldNo", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public List<string> SaveAndUpdateUldStack(List<UldStack> uldStackObj, List<UldStackTareWeight> objUldStackTareWeight, List<Consumables> objConsumables)
        {
            try
            { 
            List<string> ErrorMessage = new List<string>();
            DataTable dtuldStackObj = CollectionHelper.ConvertTo(uldStackObj, "CreatedOn,Text_StackUld,ActionType,StackUld,AirlineSNo,Text_ChoosenAirline,Text_OffPoint,Route");
            DataTable dtobjUldStackTareWeight = CollectionHelper.ConvertTo(objUldStackTareWeight, "");
            DataTable dtobjConsumables = CollectionHelper.ConvertTo(objConsumables, "");
            string ActionType = uldStackObj[0].ActionType;
            int RecordId = uldStackObj[0].UldStackSNo;

            //string ActionType = uldStack[0].ActionType;
            //DataTable dtUldStack = (DataTable)JsonConvert.DeserializeObject(uldStackObj, (typeof(DataTable)));
           
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ActionType",ActionType),
                                            new SqlParameter("@RecordId",RecordId),
                                            new SqlParameter("@dtuldStackObj",dtuldStackObj),
                                            new SqlParameter("@dtobjUldStackTareWeight",dtobjUldStackTareWeight),
                                            new SqlParameter("@dtobjConsumables",dtobjConsumables),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                             new SqlParameter("@LoginAirPortSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())
                                        };
                string result = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateUldStack", param).Tables[0].Rows[0][0].ToString();
                string Message = ""; int messageNumber = 0;
                if (result.Contains('?'))
                {
                    Message = result.Split('?')[1];
                    messageNumber = Convert.ToInt32(result.Split('?')[0]);
                }
                else
                    messageNumber = Convert.ToInt32(result);

                if (messageNumber > 0)
                {
                    if ((messageNumber >= 2000 && messageNumber <= 2001) || messageNumber == 2)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = messageNumber == 2 ? Message : baseBusiness.ReadServerErrorMessages(messageNumber, "UldStack");

                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(messageNumber, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }
        private static string DStoJSON(DataSet ds)
        {
            try
            { 
            StringBuilder json = new StringBuilder();
            json.Append("[");
            int lInteger = 0;
            foreach (DataRow dr in ds.Tables[0].Rows)
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
                    json.Append(dr[dc]);
                    json.Append("\"");
                    i++;
                    if (i < colcount) json.Append(",");
                }

                if (lInteger < ds.Tables[0].Rows.Count)
                {
                    json.Append("},");
                }
                else
                {
                    json.Append("}");
                }
            }
            json.Append("]");
            return json.ToString();
          }
          catch(Exception ex)//(Exception ex)
          {
              throw ex;
          }
        }
        public string assignFlightNo_FlightDate(string Airline, string FlightNo, string FlightDate, int UldStackSNo, string IsassignOrOffload, string OffPoint)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Airline", Airline), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@UldStackSNo", UldStackSNo), new SqlParameter("@IsassignOrOffload", IsassignOrOffload), new SqlParameter("@OffPoint", OffPoint) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AssignFlightNo", Parameters);
                ds.Dispose();
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public UldStack GetULDStackRecord(string recordID, string UserID)
        {
            try
            {
            UldStack stack = new UldStack();
            
                SqlParameter[] Parameters = { new SqlParameter("@UldStackSNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordUldStack", Parameters);
                if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    stack.UldStackSNo = Convert.ToInt32(ds.Tables[0].Rows[0]["SNo"]);
                    stack.BaseUldNo = ds.Tables[0].Rows[0]["BaseUldNo"].ToString();
                    stack.ScaleWeight = Convert.ToDecimal(ds.Tables[0].Rows[0]["ScaleWeight"].ToString());
                    stack.Airline = ds.Tables[0].Rows[0]["Airline"].ToString();
                    //stack.FlightDate = ds.Tables[0].Rows[0]["FlightDate"].ToString();
                    stack.FlightDate = ds.Tables[0].Rows[0]["FlightDate"].ToString() == "" ? "" : ds.Tables[0].Rows[0]["FlightDate"].ToString();
                    stack.FlightNo = ds.Tables[0].Rows[0]["FlightNo"].ToString();
                    stack.StackUld = ds.Tables[0].Rows[0]["UldStackDetailUldNo"].ToString();
                    stack.Text_StackUld = ds.Tables[0].Rows[0]["UldStackDetailUldNo"].ToString();
                    stack.ChoosenAirline = ds.Tables[0].Rows[0]["ChoosenAirline"].ToString();
                    stack.Text_ChoosenAirline = ds.Tables[0].Rows[0]["Text_ChoosenAirline"].ToString();

                }
                return stack;
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }
        public string GetULDStackRecordJSONString(string recordID)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@UldStackSNo", recordID), new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordUldStack", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetChildULDStackRecord(string recordID)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@UldStackSNo", recordID) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChildULDStackRecord", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<Consumables>> GetUldStackConsumblesRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            { 
            whereCondition = "UldStackSNo=" + recordID;
            Consumables tariffSlab = new Consumables();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetConsumables", Parameters);
            var uldStackConsumableList = ds.Tables[0].AsEnumerable().Select(e => new Consumables
            {
                StockType = e["StockType"].ToString(),
                ConsumableType = e["Item"].ToString(),
                HdnConsumableType = e["consumablesSNo"].ToString(),
                UnitQty = e["Quantity"].ToString(),


            });
            return new KeyValuePair<string, List<Consumables>>(ds.Tables[1].Rows[0][0].ToString(), uldStackConsumableList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public List<string> DeleteUldStack(List<string> listID)
        {
            try
            {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteUldStack", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UldStack");
                            if (!string.IsNullOrEmpty(serverErrorMessage))
                                ErrorMessage.Add(serverErrorMessage);
                        }
                        else
                        {
                            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(dataBaseExceptionMessage);
                        }
                    }
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string GetULDType(Int64 uldstockno)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@SNO", uldstockno) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_GetUldType", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }

}
