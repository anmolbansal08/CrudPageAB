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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CheckListTypeService : SignatureAuthenticate, ICheckListTypeService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CheckListType>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCheckListType", Parameters);
                var WarehouseSetupList = ds.Tables[0].AsEnumerable().Select(e => new CheckListType
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Name = e["Name"].ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    AirportName = e["AirportName"].ToString(),
                    SPHCCode = e["SPHCCode"].ToString(),
                    SPHCGroupName = e["SPHCGroupName"].ToString(),
                    ISIATA = (e["ISIATA"]).ToString(),
                    ISSAS = e["ISSAS"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = WarehouseSetupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> SaveCheckListType(List<CheckListType> CheckListType)
        {
            try
            {
                DataTable dtCreateCheckListType = CollectionHelper.ConvertTo(CheckListType, "SNo,ISIATA,ISSAS,SPHCGroupName,AirportName,AirlineName,Text_AirportName,Text_AirlineName,Text_SPHCGroupName,Text_SPHCCode,Text_For,Text_SHC,Text_SPHCSubGroupSNo,Text_CopyFrom,Text_Type");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CheckListTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCheckListType;
                SqlParameter[] Parameters = { param };

                string res = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeCreate", Parameters);

                //var CLTSNo = res.Split('_')[1];

                int ret = Convert.ToInt32(res.ToString());
                //int ret = Convert.ToInt32(res.Split('-')[1]);
                //ret = res.Split('-').Length > 1 ? Convert.ToInt32(res.Split('-')[0]) : 0; //(int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSlotBooking", Parameters);
                //ErrorMessage.Add(res.Split('-')[0]);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CheckListType");
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

        public CheckListType GetCheckListTypeRecord(string recordID, string UserID)
        {
            CheckListType c = new CheckListType();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCheckListType", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.Name = dr["Name"].ToString();
                    c.For = Convert.ToInt32(dr["For"]);
                    c.Text_AirportName = dr["AirportName"].ToString();
                    c.AirportName = dr["AirportSNo"].ToString();
                    c.SHC = Convert.ToInt32(dr["SHC"]);
                    c.Text_SPHCCode = dr["SPHCCode"].ToString();
                    c.SPHCCode = dr["SPHCSNo"].ToString();
                    c.Text_AirlineName = dr["AirlineName"].ToString().ToUpper() == "" ? dr["AirlineName"].ToString().ToUpper() : dr["AirlineName"].ToString().ToUpper().Remove(dr["AirlineName"].ToString().Length - 1);
                    c.AirlineName = dr["AirlineSNo"].ToString();
                    c.Text_For = dr["Text_For"].ToString();
                    c.Text_SHC = dr["Text_SHC"].ToString();
                    c.ChecklistVersion = dr["ChecklistVersion"].ToString();
                    c.GeneralHeader = dr["GeneralHeader"].ToString();
                    c.GeneralFooter = dr["GeneralFooter"].ToString();
                    c.ColumnName1 = dr["ColumnName1"].ToString();
                    c.ColumnName2 = dr["ColumnName2"].ToString();
                    c.ColumnName3 = dr["ColumnName3"].ToString();
                    c.Type = dr["Type"].ToString();
                    c.Text_Type = dr["Text_Type"].ToString();
                    c.Text_SPHCSubGroupSNo = dr["Text_SPHCSubGroupSNo"].ToString();
                }
                dr.Close();
            }
            
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return c;
        }

        public KeyValuePair<string, List<CheckListTypeAppend>> GetCheckListTypeAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCheckListTypeAppendGetList", Parameters);
                var CheckListTypeGridAppendGridList = ds.Tables[0].AsEnumerable().Select(e => new CheckListTypeAppend
                {
                    SNo = e["SNo"].ToString(),
                    SrNo = e["SrNo"].ToString(),
                    Name = e["Name"].ToString(),
                    HideHeader = Convert.ToBoolean(e["HideHeader"]),
                    PRIORITY = Convert.ToDecimal(e["PRIORITY"].ToString()),
                    SectionHeader = e["SectionHeader"].ToString(),
                    SectionFooter = e["SectionFooter"].ToString(),
                    CLTSNo = Convert.ToInt16(e["CLTSNo"].ToString()),
                    HideHeaderTxt = e["HideHeaderTxt"].ToString(),
                    HideHeaderRead = e["HideHeaderRead"].ToString().ToUpper()
                });
                return new KeyValuePair<string, List<CheckListTypeAppend>>(ds.Tables[1].Rows[0][0].ToString(), CheckListTypeGridAppendGridList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }

        public string SaveCheckListTypenew(List<CheckListType> CheckListType)
        {
            try
            {
                DataTable dtCreateCheckListType = CollectionHelper.ConvertTo(CheckListType, "SNo,ISIATA,ISSAS,SPHCGroupName,AirportName,AirlineName,Text_AirportName,Text_CopyFrom,Text_AirlineName,Text_SPHCGroupName,Text_SPHCCode,Text_For,Text_SHC,Text_Type,Text_SPHCSubGroupSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CheckListTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCheckListType;
                SqlParameter[] Parameters = { param };

                //int res = SqlHelper.ExecuteNonQuery(connectionString, CommandType.StoredProcedure, "CheckListTypeCreate_new", Parameters);
                //  string CTRLSNO = res.ToString(); //Convert.ToString(Parameters[Parameters.Length - 1].Value);
                //  return CTRLSNO;
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckListTypeCreate_new", Parameters);
                ds.Dispose();
                return DStoJSON(ds);

            }
            catch(Exception ex)//
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> SaveCheckListTypeHeader(List<CheckListTypeAppend> data)
        {
            try
            {
                //DataTable dtEventMessageParentTrans = CollectionHelper.ConvertTo(EventMessageTransParentInfo, "EventName,MessageType,MessageTypeSNo");
                DataTable dtCheckListTypeHeader = CollectionHelper.ConvertTo(data, "HideHeaderTxt,HideHeaderRead");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = { new SqlParameter("@EnteredBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CheckListTypeHeaderTable", dtCheckListTypeHeader) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeHeader_Create", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CheckListType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> UpdateCheckListType(List<CheckListType> CheckListType)
        {
            try
            {
                DataTable dtCreateCheckListType = CollectionHelper.ConvertTo(CheckListType, "ISIATA,ISSAS,SPHCGroupName,AirportName,CopyFrom,Text_CopyFrom,AirlineName,Text_AirportName,Text_AirlineName,Text_SPHCGroupName,Text_SPHCCode,Text_For,Text_SHC,Text_Type,Text_SPHCSubGroupSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CheckListTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCheckListType;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeUpdate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CheckListType");
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

        public List<string> UpdateCheckListTypeHeader(List<CheckListTypeAppend> data)
        {
            try
            {
                DataTable dtCheckListTypeHeader = CollectionHelper.ConvertTo(data, "HideHeaderTxt,HideHeaderRead");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = { new SqlParameter("@EnteredBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CheckListTypeHeaderTable", dtCheckListTypeHeader) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeHeader_Update", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CheckListType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> SaveCheckListDetail(List<CheckListDetail> data)
        {
            try
            {
                DataTable dtCheckListDetail = CollectionHelper.ConvertTo(data, "SNo,Name,Options,YRead,NRead,NARead,RemarksRead,Column1Read,Column2Read,Column3Read,YTxt,NTxt,NATxt,RemarksTxt,Column1Txt,Column2Txt,Column3Txt,YTxt,NTxt,NATxt,RemarksTxt,vDescription");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = { new SqlParameter("@EnteredBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CheckListDetailTable", dtCheckListDetail) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListDetail_Create", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CheckListType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public KeyValuePair<string, List<CheckListDetail>> GetCheckListDetail(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCheckListDetailGetList", Parameters);
                var CheckListTypeGridAppendGridList = ds.Tables[0].AsEnumerable().Select(e => new CheckListDetail
                {
                    SNo = e["SNo"].ToString(),
                    Name = e["Name"].ToString(),
                    HdnName = e["CheckListHeaderSNo"].ToString(),
                    Description = e["Description"].ToString().Replace("~", "\""),
                    vDescription = e["Description"].ToString().Replace("~", "\"").Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;"),
                    SrNo = e["SrNo"].ToString(),
                    PRIORITY = Convert.ToInt32(e["PRIORITY"].ToString()),
                    Y = Convert.ToBoolean(e["Y"]),
                    N = Convert.ToBoolean(e["N"]),
                    NA = Convert.ToBoolean(e["NA"]),
                    Remarks = Convert.ToBoolean(e["Remarks"]),
                    Column1 = Convert.ToBoolean(e["Column1"]),
                    Column2 = Convert.ToBoolean(e["Column2"]),
                    Column3 = Convert.ToBoolean(e["Column3"]),
                    YTxt = e["YTxt"].ToString(),
                    NTxt = e["NTxt"].ToString(),
                    NATxt = e["NATxt"].ToString(),
                    RemarksTxt = e["RemarksTxt"].ToString(),
                    Column1Txt = e["Column1Txt"].ToString(),
                    Column2Txt = e["Column2Txt"].ToString(),
                    Column3Txt = e["Column3Txt"].ToString(),
                    Document = Convert.ToBoolean(e["Document"]),
                    Mandatory = Convert.ToBoolean(e["Mandatory"]),
                    YRead = e["YRead"].ToString(),
                    NRead = e["NRead"].ToString(),
                    NARead = e["NARead"].ToString(),
                    RemarksRead = e["RemarksRead"].ToString(),
                    Column1Read = e["Column1Read"].ToString(),
                    Column2Read = e["Column2Read"].ToString(),
                    Column3Read = e["Column3Read"].ToString()
                });
                return new KeyValuePair<string, List<CheckListDetail>>(ds.Tables[1].Rows[0][0].ToString(), CheckListTypeGridAppendGridList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> UpdateCheckListDetail(List<CheckListDetail> data)
        {
            try
            {
                DataTable dtCheckListDetail = CollectionHelper.ConvertTo(data, "Name,Options,YRead,NRead,NARead,RemarksRead,Column1Read,Column2Read,Column3Read,YTxt,NTxt,NATxt,RemarksTxt,Column1Txt,Column2Txt,Column3Txt,vDescription");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = { new SqlParameter("@EnteredBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CheckListDetailTable", dtCheckListDetail) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeDetail_Update", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CheckListType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> DeleteCheckListTypeHeader(string RecordId)
        {

            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteChecklistType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CheckListType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteCheckListDetail(string RecordId)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCheckListDetail", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CheckListType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteCheckListType(List<string> listID)
        {

            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCheckListTypeMaster", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CheckListType");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public string GetColumnName(string recordID)
        {
            try
            {
                SqlParameter[] Parameter = { new SqlParameter("@SNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getControlName", Parameter);
                // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(ds);
                return JSONString;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        public string getExistsRecord(string SphcSno, string SphcCode, string Name)
        {
            try
            {
                SqlParameter[] Parameter = { new SqlParameter("@SphcSno", SphcSno), new SqlParameter("@SphcCode", SphcCode), new SqlParameter("@Name", Name) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getExistsRecord", Parameter);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(ds);
                return JSONString;
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }

        //public List<Tuple<string, int>> createUpdateCheckListHeader(string strData)
        //{
        //    int ret = 0;
        //    int ret1 = 0;
        //    List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    // convert JSON string ito datatable
        //    var dtCheckList = JsonConvert.DeserializeObject<DataTable>(strData);
        //    var dtCreateCheckList = (new DataView(dtCheckList, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    var dtUpdateCheckList = (new DataView(dtCheckList, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@AirCraftInventoryTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;

        //    SqlParameter param1 = new SqlParameter();
        //    param1.ParameterName = "@EnteredBy";
        //    param1.SqlDbType = System.Data.SqlDbType.Structured;
        //    // for create new record
        //    if (dtCreateCheckList.Rows.Count > 0)
        //    {
        //        param.Value = dtCreateCheckList;
        //        param1.Value = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
        //        SqlParameter[] Parameters = { param1, param };
        //        ret1 = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeHeader_Create", Parameters);
        //    }
        //    // for update existing record
        //    if (dtUpdateCheckList.Rows.Count > 0)
        //    {
        //        param.Value = dtUpdateCheckList;
        //        param1.Value = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
        //        SqlParameter[] Parameters = { param1, param };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeHeader_Update", Parameters);
        //    }
        //    if (ret > 0 || ret1 > 0)
        //    {
        //        if (ret1 > 1000 && ret1 < 2000 && ret > 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CheckListType");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }


        //        else if (ret1 > 1000 && ret1 < 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret1, "CheckListType");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }

        //        else if (ret1 > 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CheckListType");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }

        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
        //        }
        //    }

        //    return ErrorMessage;
        //}

        //public List<Tuple<string, int>> deleteCheckListHeader(string recordID)
        //{
        //    int ret = 0;
        //    List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftInventory", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret == 547)
        //        {
        //            ret = 549;
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }
        //        else if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
        //        }
        //    }
        //    return ErrorMessage;
        //}

        //public List<Tuple<string, int>> createUpdateCheckListDetail(string strData)
        //{
        //    int ret = 0;
        //    int ret1 = 0;
        //    List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    // convert JSON string ito datatable
        //    var dtCheckList = JsonConvert.DeserializeObject<DataTable>(strData);
        //    var dtCreateCheckList = (new DataView(dtCheckList, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    var dtUpdateCheckList = (new DataView(dtCheckList, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@AirCraftInventoryTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;

        //    SqlParameter param1 = new SqlParameter();
        //    param1.ParameterName = "@EnteredBy";
        //    param1.SqlDbType = System.Data.SqlDbType.Structured;
        //    // for create new record
        //    if (dtCreateCheckList.Rows.Count > 0)
        //    {
        //        param.Value = dtCreateCheckList;
        //        param1.Value = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
        //        SqlParameter[] Parameters = { param1, param };
        //        ret1 = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListDetail_Create", Parameters);
        //    }
        //    // for update existing record
        //    if (dtUpdateCheckList.Rows.Count > 0)
        //    {
        //        param.Value = dtUpdateCheckList;
        //        param1.Value = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
        //        SqlParameter[] Parameters = { param1, param };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeDetail_Update", Parameters);
        //    }
        //    if (ret > 0 || ret1 > 0)
        //    {
        //        if (ret1 > 1000 && ret1 < 2000 && ret > 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CheckListType");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }


        //        else if (ret1 > 1000 && ret1 < 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret1, "CheckListType");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }

        //        else if (ret1 > 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CheckListType");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }

        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
        //        }
        //    }

        //    return ErrorMessage;
        //}

        //public List<Tuple<string, int>> deleteCheckListDetail(string recordID)
        //{
        //    int ret = 0;
        //    List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftInventory", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret == 547)
        //        {
        //            ret = 549;
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }
        //        else if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
        //        }
        //    }
        //    return ErrorMessage;
        //}
    }
}
