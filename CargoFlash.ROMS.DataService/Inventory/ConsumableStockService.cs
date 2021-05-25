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
using System.Net;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ConsumableStockService : SignatureAuthenticate, IConsumableStockService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ConsumableStock>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListConsumablesStock", Parameters);
                var ConsumableStockList = ds.Tables[0].AsEnumerable().Select(e => new ConsumableStock
                {
                    SNo = e["SNo"].ToString(),
                    Item = e["Item"].ToString().ToUpper(),
                    NoOfItems = Convert.ToInt32(e["NoOfItems"]),
                    //CreatedBy = e["CreatedBy"].ToString(),
                    CityCode = e["CityCode"].ToString(),
                    Numbered = e["Numbered"].ToString(),
                    ConsumablesName = e["ConsumablesName"].ToString(),
                    IsActive = e["IsActive"].ToString(),
                    Text_Owner = e["Text_Owner"].ToString(),
                    Text_OwnerName = e["Text_OwnerName"].ToString(),
                    TareWeight = e["TareWeight"].ToString(),
                    AirportName=e["AirportName"].ToString()


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ConsumableStockList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }
        //public KeyValuePair<string, List<ConsumableStock>> GetConsumableStockRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        //{
        //    List<ConsumableStock> listStock = new List<ConsumableStock>();
        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //    //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetNewRecordConsumableStock", Parameters);
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetNewRecordConsumableStock");
        //    var ViewOpendetailList = ds.Tables[0].AsEnumerable().Select(e => new ConsumableStock
        //    {
        //        SNo = Convert.ToInt32(e["SNo"].ToString()),
        //        CStockSNo = Convert.ToInt32(e["CStockSNo"].ToString()),
        //        Item = e["Item"].ToString(),
        //        Type = e["Type"].ToString(),
        //        NoOfItems = Convert.ToInt32(e["NoOfItems"].ToString()),
        //        AddStock = Convert.ToInt32(e["AddStock"].ToString())
        //    });

        //    return new KeyValuePair<string, List<ConsumableStock>>(ds.Tables[0].Rows[0][1].ToString(), ViewOpendetailList.AsQueryable().ToList());

        //}


        public string GetConsumableStockRecord(int recid, int UserID,int ConsumableStockTransSno)
        {
            try
            {

                SqlParameter[] Parameters = {
                                       new SqlParameter("@ConsumableStockSno", recid),new SqlParameter("@ConsumableStockTransSno", ConsumableStockTransSno)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetNewRecordConsumableStock", Parameters);
                ds.Dispose();

                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }

        }

        public List<string> SaveConsumableStock(string ConsumablePrefix, string ConsumableType, int ConsumableNo, int ConsumableSno, string CityCode, string NoOfItems, decimal TareWeight,int CitySno,int Airport,int Office,int Owner,int OwnerSno)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                List<string> ErrorMessage = new List<string>();
                int ret = 0;
                // DataTable dtItemList = CollectionHelper.ConvertTo(ItemList, "");
                //  var dtItemList = JsonConvert.DeserializeObject<DataTable>(ItemList);
                SqlParameter[] Parameters = {  new SqlParameter("@ConsumableSno", ConsumableSno), new SqlParameter("@CityCode", CityCode), new SqlParameter("@NoOfItems", NoOfItems),
                         new SqlParameter("@ConsumablePrefix", ConsumablePrefix),
                         new SqlParameter("@ConsumableType", ConsumableType),
                         new SqlParameter("@ConsumableNo", ConsumableNo),
                          new SqlParameter("@TareWeight", TareWeight),
                           new SqlParameter("@CitySno", CitySno),
                          new SqlParameter("@Airport", Airport),
                           new SqlParameter("@Office", Office),
                            new SqlParameter("@Owner", Owner),
                             new SqlParameter("@OwnerSno", OwnerSno),
                                   new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveConsumableStock", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConsumableStock");
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
        public List<string> UpdateConsumableStock(int ConsumableStockTransSno, int ConsumableSno, decimal TareWeight, string IsActive, string EquipmentNbr)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            int ret = 0;
            //DataTable dtItemList = CollectionHelper.ConvertTo(ItemList, "");
            // var dtItemList = JsonConvert.DeserializeObject<DataTable>(ItemList);
            SqlParameter[] Parameters = {  new SqlParameter("@ConsumableStockTransSno", ConsumableStockTransSno),
                                            new SqlParameter("@ConsumableSno", ConsumableSno),
                                            new SqlParameter("@TareWeight", TareWeight),
                                             new SqlParameter("@IsActive", IsActive),
                                              new SqlParameter("@EquipmentNbr", EquipmentNbr),
                                              new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                                        };

            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateConsumableStock", Parameters);

            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConsumableStock");
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




        public List<string> DeleteConsumableStock(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    //SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                    //                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};
                    SqlParameter[] Parameters = { new SqlParameter("@ConsumableStockSno", Convert.ToString(RecordID)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteConsumableStock", Parameters);
                    //  int ret = 0;
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConsumableStock");
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


        //public List<string> DeleteConsumablestock(int consumableStockSno)
        //{
        //    //DataTable dtCreateConsumableStock = (DataTable)JsonConvert.DeserializeObject(strData, (typeof(DataTable)));
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBusiness = new BaseBusiness();


        //    SqlParameter[] Parameters = { new SqlParameter("@ConsumableStockSno", consumableStockSno) };

        //   int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteConsumableStock", Parameters);
            
        //   // int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteConsumableStock");
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            //For Customised Validation Messages like 'Record Already Exists' etc
        //            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConsumableStock");
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


        public List<string> createUpdateConsumableStock(string strData)
        {
            try
            {
                string st = OperationContext.Current.SessionId;
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                // convert JSON string into datatable
                int NoOfItem = 0;
                int ConsumableStockSno = 0;
                string Citycode = string.Empty;
                var dtConsumableStock = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                if (dtConsumableStock.Columns.Contains("noofitem"))
                {
                    NoOfItem = Convert.ToInt32(dtConsumableStock.Rows[0]["noofitem"]);
                    dtConsumableStock.Columns.Remove("noofitem");
                    dtConsumableStock.AcceptChanges();
                }
                if (dtConsumableStock.Columns.Contains("cStockSno"))
                {
                    ConsumableStockSno = Convert.ToInt32(dtConsumableStock.Rows[0]["cStockSno"]);
                    dtConsumableStock.Columns.Remove("cStockSno");
                    dtConsumableStock.AcceptChanges();
                }
                if (dtConsumableStock.Columns.Contains("citycode"))
                {
                    Citycode = dtConsumableStock.Rows[0]["citycode"].ToString();
                    dtConsumableStock.Columns.Remove("citycode");
                    dtConsumableStock.AcceptChanges();
                }

                var dtCreateSlotBookingTrans = (new DataView(dtConsumableStock, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateSlotBookingTrans = (new DataView(dtConsumableStock, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();




                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SlotBookingTransType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateSlotBookingTrans.Rows.Count > 0)
                {

                    SqlParameter[] Parameters = { new SqlParameter("@ItemList", dtCreateSlotBookingTrans), new SqlParameter("@ConsumableSno", ConsumableStockSno), new SqlParameter("@CityCode", Citycode), new SqlParameter("@NoOfItems", NoOfItem), new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveConsumableStock", Parameters);
                    ErrorMessage.Add("Record Save Successfully");
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConsumableStock");
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
                // for update existing record
                ret = 0;
                if (dtUpdateSlotBookingTrans.Rows.Count > 0)
                {



                    SqlParameter[] Parameters = { new SqlParameter("@ItemList", dtUpdateSlotBookingTrans), new SqlParameter("@ConsumableStockSno", ConsumableStockSno), new SqlParameter("@NoOfItems", NoOfItem), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateConsumableStock", Parameters);
                    //param.Value = dtUpdateSlotBookingTrans;
                    //SqlParameter[] Parameters = { param };
                    //ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSlotBookingTrans", Parameters);
                    ErrorMessage.Add("Record Update Successfully");
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConsumableStock");
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



        public string Getofficelist(string OfficeSNo)
        {

            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", OfficeSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Getofficelist", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }



        public string GetAirportOfficeInformation(string CitySNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportOfficeInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
