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
    public class OfficeTargetService : SignatureAuthenticate, IOfficeTargetService
    {


        /// <summary>
        ///  Get list of the records to be shown in the grid on Pageload
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<OfficeTarget>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListOfficeTarget", Parameters);

                var OfficeList = ds.Tables[0].AsEnumerable().Select(e => new OfficeTarget
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirportCode = e["AirportCode"].ToString().ToUpper(),
                    OfficeName = e["Name"].ToString().ToUpper(),
                    OfficeTargetType = e["TargetType"].ToString() == "0" ? "Weight" : "Revenue",
                    TargetName = e["TargetName"].ToString().ToUpper(),
                    ValidFrom = DateTime.Parse(e["ValidFrom"].ToString()),
                    ValidTo = DateTime.Parse(e["ValidTo"].ToString()),
                    Active = e["Active"].ToString(),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = OfficeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

       /// <summary>
       /// 
       /// </summary>
       /// <param name="recordID"></param>
       /// <param name="UserID"></param>
       /// <returns></returns>
        public OfficeTarget GetOfficeTargetRecord(string recordID, string UserID)
        {
            OfficeTarget officeTarget = new OfficeTarget();
            SqlDataReader dr = null;
            try
            {
                

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordOfficeTarget", Parameters);
                if (dr.Read())
                {
                    officeTarget.SNo = Convert.ToInt32(dr["SNo"]);
                    officeTarget.AirPortSNo = int.Parse(dr["AirPortSNo"].ToString());
                    officeTarget.AirportCode = dr["AirportCode"].ToString().ToUpper();
                    officeTarget.Text_AirPortSNo = dr["AirportCode"].ToString().ToUpper();
                    officeTarget.OfficeSNo= int.Parse(dr["OfficeSNo"].ToString());
                    officeTarget.Text_OfficeSNo = dr["OfficeName"].ToString().ToUpper();
                    officeTarget.OfficeName = dr["OfficeName"].ToString().ToUpper();
                    officeTarget.TargetType = int.Parse(dr["TargetType"].ToString());
                    officeTarget.OfficeTargetType = dr["TargetType"].ToString() == "0" ? "KG" : "Percentage";
                    officeTarget.TargetName = dr["TargetName"].ToString().ToUpper();
                    officeTarget.ProductSNo = int.Parse(dr["ProductSNo"].ToString());
                    officeTarget.Text_ProductSNo = dr["ProductName"].ToString().ToUpper();
                    officeTarget.FlightTypeSNo =int.Parse(dr["FlightTypeSNo"].ToString());
                    officeTarget.Text_FlightTypeSNo = dr["FlightTypeName"].ToString().ToUpper();
                    officeTarget.NoOfFlight =int.Parse(dr["NoofFlight"].ToString());
                    officeTarget.AverageWeightPerFlight =Decimal.Parse(dr["AverageWeightPerFlight"].ToString());
                    officeTarget.CurrencySNo = int.Parse(dr["CurrencySNo"].ToString());
                    officeTarget.Text_CurrencySNo = dr["CurrencyCode"].ToString();
                    officeTarget.ValidFrom = DateTime.Parse(dr["ValidFrom"].ToString());
                    officeTarget.ValidTo = DateTime.Parse(dr["ValidTo"].ToString());
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        officeTarget.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        officeTarget.Active = dr["Active"].ToString().ToUpper();
                    }

                    officeTarget.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    officeTarget.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();


                }
                dr.Close();

            }
            catch(Exception ex)//// (Exception ex)
            {
                dr.Close();
                throw ex;

            }
            return officeTarget;
        }
        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="office"></param>
        ///// <returns></returns>
        public List<string> SaveOfficeTarget(List<OfficeTarget> officeTarget)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {

                DataTable dtcreateofficetarget = CollectionHelper.ConvertTo(officeTarget, "AirportCode,Text_AirPortSNo,Text_OfficeSNo,OfficeName,Text_ProductSNo,Text_FlightTypeSNo,Text_CurrencySNo,Active,OfficeTargetType");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("OfficeTarget", dtcreateofficetarget, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeTargetTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtcreateofficetarget;
                //int loginsno=int.Parse(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                //SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateOfficeTarget", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "OfficeTarget");
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
            catch(Exception ex)// //(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="officeTarget"></param>
        /// <returns></returns>
        public List<string> UpdateOfficeTarget(List<OfficeTarget> officeTarget)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtcreateofficetarget = CollectionHelper.ConvertTo(officeTarget, "AirportCode,Text_AirPortSNo,Text_OfficeSNo,OfficeName,Text_ProductSNo,Text_FlightTypeSNo,Text_CurrencySNo,Active,OfficeTargetType");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("OfficeTarget", dtcreateofficetarget, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeTargetTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtcreateofficetarget;
                SqlParameter[] Parameters = { param};
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOfficeTarget", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "OfficeTarget");
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
            catch(Exception ex)// //(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;


        }

        
        /// <summary>
        /// Below Mtheod used in Create  and update officeTargetcomm trans
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public List<string> CreateUpdateOfficeTargetCommTrans(string strDate)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtOfficeTargetCommTran = JsonConvert.DeserializeObject<DataTable>(strDate);
                var dtCreateTargetCommTran = (new DataView(dtOfficeTargetCommTran, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdatedtTargetCommTran = (new DataView(dtOfficeTargetCommTran, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();



                SqlParameter param = new SqlParameter();
                param.ParameterName = "@fficeTargetCommTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateTargetCommTran.Rows.Count > 0)
                {

                    param.Value = dtCreateTargetCommTran;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateOfficeTargetCommTrans", Parameters);
                }
                // for update existing record
                if (dtUpdatedtTargetCommTran.Rows.Count > 0)
                {

                    param.Value = dtUpdatedtTargetCommTran;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOfficeTargetCommision", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Officetarget");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Below Method used to fetch record for edit and view for officetargetCommtrans
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="whereCondition"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public KeyValuePair<string, List<OfficeTargetCommTrans>> GetOfficeTargetCommTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                OfficeTargetCommTrans officeCommision = new OfficeTargetCommTrans();
                SqlParameter[] Parameters = { new SqlParameter("@OfficeTargetSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOfficeTargetCommTransRecord", Parameters);
                var OfficeTargetCommTransList = ds.Tables[0].AsEnumerable().Select(e => new OfficeTargetCommTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    OfficeTargetSNo = Convert.ToInt32(e["OfficeTargetSNo"]),
                    CommisionType = Convert.ToInt32(e["CommisionType"].ToString()),
                    CommisionTypeOffice = e["CommisionType"].ToString() == "1" ? "Percentage" : e["CommisionType"].ToString() == "2" ? "Kg" : "Revenue",
                    CommisionValue = Convert.ToDecimal(e["CommisionValue"].ToString()),
                    TargetStartValue = Convert.ToDecimal(e["TargetStartValue"].ToString()),
                    TargetEndValue = Convert.ToDecimal(e["TargetEndValue"].ToString()),
                    ValidFrom = e["ValidFrom"].ToString() == "" ? "" : (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    //ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = e["ValidTo"].ToString() == "" ? "" : (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),

                });
                return new KeyValuePair<string, List<OfficeTargetCommTrans>>(ds.Tables[1].Rows[0][0].ToString(), OfficeTargetCommTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// delte  the perticular office Commision Trans
        /// </summary>
        /// <param name="RecordID">Id of that OfficeTarget</param>
        public List<string> DeleteOfficeTargetCommTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOfficeTargetCommTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "OfficeTarget");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        ///// <summary>
        ///// Below Mtheod used in Create  and update OfficeTarget Penaltytrans
        ///// </summary>
        ///// <param name="strDate"></param>
        ///// <returns></returns>
        public List<string> CreateUpdateOfficeTargetPenaltyTrans(string strDate)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtOfficeTargetPenaltyTrans = JsonConvert.DeserializeObject<DataTable>(strDate);
                var dtCreateOfficeTargetPenaltyTrans = (new DataView(dtOfficeTargetPenaltyTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdatedtOfficeTargetPenaltyTrans = (new DataView(dtOfficeTargetPenaltyTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeTargetPenaltyTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateOfficeTargetPenaltyTrans.Rows.Count > 0)
                {

                    param.Value = dtCreateOfficeTargetPenaltyTrans;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateOfficeTargetPenaltyTrans", Parameters);
                }
                // for update existing record
                if (dtUpdatedtOfficeTargetPenaltyTrans.Rows.Count > 0)
                {

                    param.Value = dtUpdatedtOfficeTargetPenaltyTrans;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOfficeTargetPenaltyTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Officetarget");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Below Method used to fetch record for edit and view for OfficeTargetPenaltyTrans
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="whereCondition"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public KeyValuePair<string, List<OfficeTargetPenaltyTrans>> GetOfficeTargetPenaltyTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                OfficeTargetPenaltyTrans officeCommision = new OfficeTargetPenaltyTrans();
                SqlParameter[] Parameters = { new SqlParameter("@OfficeTargetSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOfficeTargetPenaltyTransRecord", Parameters);
                var OfficeTargetPenaltyTrans = ds.Tables[0].AsEnumerable().Select(e => new OfficeTargetPenaltyTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    OfficeTargetSNo = Convert.ToInt32(e["OfficeTargetSNo"]),
                    PenaltyType = Convert.ToInt32(e["PenaltyType"].ToString()),
                    PenaltyOfficeType = e["PenaltyOfficeType"].ToString(),
                    PenaltyValue = Convert.ToDecimal(e["PenaltyValue"].ToString()),
                    TargetStartValue = Convert.ToDecimal(e["TargetStartValue"].ToString()),
                    TargetEndValue = Convert.ToDecimal(e["TargetEndValue"].ToString()),
                    ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),

                });
                return new KeyValuePair<string, List<OfficeTargetPenaltyTrans>>(ds.Tables[1].Rows[0][0].ToString(), OfficeTargetPenaltyTrans.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        /// <summary>
        /// delte  the perticular office Commision Trans
        /// </summary>
        /// <param name="RecordID">Id of that OfficeTarget</param>
        public List<string> DeleteOfficeTargetPenaltyTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOfficeTargetPenaltyTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "OfficeTarget");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



     
     
    }
}
