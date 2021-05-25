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
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.EDI
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class EventMessageTransService : SignatureAuthenticate, IEventMessageTransService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<EventMessageTrans>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListEventMessageTrans", Parameters);
            var EventMessageTransList = ds.Tables[0].AsEnumerable().Select(e => new EventMessageTrans
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AirlineName = e["AirlineName"].ToString(),
               // SubProcess = e["SubProcess"].ToString(),
                MessageType = e["MessageType"].ToString(),
                CreatedBy=e["CreatedBy"].ToString(),
                UpdatedBy =e["UpdatedBy"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = EventMessageTransList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> SaveEventMessageTrans(EventMessageTransSave data)
        {
            try { 
            DataTable dtEventMessageTrans = CollectionHelper.ConvertTo(data.EventTransData, "");

            //Remove column which is not required in Table Type
            dtEventMessageTrans.Columns.Remove("SNo");
            dtEventMessageTrans.Columns.Remove("SubProcessName");
            dtEventMessageTrans.Columns.Remove("MessageType");
            dtEventMessageTrans.Columns.Remove("Origin");
            dtEventMessageTrans.Columns.Remove("Destination");

            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = { new SqlParameter("@AirlineSNo", data.AirlineSNo),
                    new SqlParameter("@UpdatedBy", data.UserSNo),new SqlParameter("@tt", dtEventMessageTrans) };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spEventMessageTrans_Create", param);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "EventMessageTrans");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
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

        public EventMessageTrans GetEventMessageTransRecord(string recordID, string UserID)
        {
            SqlDataReader dr = null;
            try { 
            EventMessageTrans c = new EventMessageTrans();
           
            //try
            //{
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordEventMessageTrans", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["AirlineSNo"]);
                    //c.MessageType = dr["MessageType"].ToString();
                    c.Text_AirlineName = dr["AirlineName"].ToString();
                    c.AirlineName = dr["AirlineSNo"].ToString();
                    c.UpdatedBy = dr["UpdatedBy"].ToString();
                    c.CreatedBy = dr["CreatedBy"].ToString();
                    //c.Version = dr["Version"].ToString();
                }
            //}
            //catch(Exception ex)//(Exception ex) (Exception ex)
            //{
            //    dr.Close();
            //}
            return c;
            }
            catch(Exception ex)//(Exception ex)
            {
                dr.Close();
                throw ex;
            }
        }

        //public List<EventMessageGridAppendGrid> GetEventMessageTransRecordAppendGrid(string recordID, string whereCondition)
        //{
        //    List<EventMessageGridAppendGrid> listtariffForwardRateTrans = new List<EventMessageGridAppendGrid>();
        //    EventMessageGridAppendGrid TariffForwardRateTrans = new EventMessageGridAppendGrid();

        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", whereCondition) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordEventMessageTransAppendGrid", Parameters);

        //    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //    {
        //        foreach (DataRow dr in ds.Tables[0].Rows)
        //        {
        //            listtariffForwardRateTrans.Add(new EventMessageGridAppendGrid
        //            {
        //                //RowNo = Convert.ToInt32(dr["RowNo"]),
        //                SNo = Convert.ToInt32(dr["SNo"]),
        //                SubProcessName = dr["SubProcess"].ToString(),
        //                HdnSubProcessName = dr["HdnSubProcessName"].ToString(),
        //                MessageType = dr["MessageType"].ToString(),
        //                HdnMessageType = dr["HdnMessageType"].ToString()
        //            });
        //        }
        //    }
        //    return listtariffForwardRateTrans;

        //}


        public KeyValuePair<string, List<EventMessageGridAppendGrid>> GetEventMessageGridAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try { 
            EventMessageGridAppendGrid AirCraftCapacitySPHC = new EventMessageGridAppendGrid();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordEventMessageTransAppendGrid1", Parameters);
            // return resultData.Tables[0].AsEnumerable().ToList();
            var EventMessageGridAppendGridList = ds.Tables[0].AsEnumerable().Select(e => new EventMessageGridAppendGrid
            {
                //SNo = Convert.ToInt32(e["AirCraftCapacitySNo"]),
                //AirCraftCapacitySNo = Convert.ToInt32(e["AirCraftCapacitySNo"]),
                //HdnSPHCSNo = e["SPHCSNo"].ToString(),
                //SPHCSNo = e["Code"].ToString(),
                //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo


                //SNo = Convert.ToInt32(e["SNo"]),
                EventName = e["EventName"].ToString(),
                SubProcessName = e["SubProcess"].ToString(),
                HdnSubProcessName = e["HdnSubProcessName"].ToString(),
                MessageType = e["MessageType"].ToString(),
                HdnMessageType = e["HdnMessageType"].ToString(),
                MessageExecutionType = e["MessageExecutionType"].ToString(),
                Origin=e["Origin"].ToString(),
                HdnOrigin=e["HdnOrigin"].ToString(),
                Destination=e["Destination"].ToString(),
                HdnDestination=e["HdnDestination"].ToString()
            });
            return new KeyValuePair<string, List<EventMessageGridAppendGrid>>(ds.Tables[1].Rows[0][0].ToString(), EventMessageGridAppendGridList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateEventMessageTrans(EventMessageTransSave data)
        {
            try { 
            //DataTable dtEventMessageParentTrans = CollectionHelper.ConvertTo(EventMessageTransParentInfo, "EventName,MessageType,MessageTypeSNo");
            DataTable dtEventMessageTrans = CollectionHelper.ConvertTo(data.EventTransData, "");

            //Remove column which is not required in Table Type
            dtEventMessageTrans.Columns.Remove("SNo");
            dtEventMessageTrans.Columns.Remove("SubProcessName");
            dtEventMessageTrans.Columns.Remove("MessageType");
            dtEventMessageTrans.Columns.Remove("Origin");
            dtEventMessageTrans.Columns.Remove("Destination");

                List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = { new SqlParameter("@AirlineSNo", data.AirlineSNo),
                    new SqlParameter("@UpdatedBy", data.UserSNo),new SqlParameter("@tt", dtEventMessageTrans) };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spEventMessageTrans_Update", param);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "EventMessageTrans");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
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

        public List<string> DeleteEventMessageTrans(List<string> listID)
        {
            try { 
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID))
                                            };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spEventMessageTrans_Delete", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "EventMessageTrans");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



    }
}
