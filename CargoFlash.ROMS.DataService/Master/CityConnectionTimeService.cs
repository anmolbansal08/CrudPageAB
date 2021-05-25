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
using System.Net;
using Newtonsoft.Json;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CityConnectionTimeService : SignatureAuthenticate, ICityConnectionTimeService
    {
        /// <summary>
        /// Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pagesize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pagesize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CityConnectionTime>(filter);
                SqlParameter[] Parameters = {   new SqlParameter("@PageNo", page), 
                                                new SqlParameter("@PageSize", pagesize), 
                                                new SqlParameter("@WhereCondition", filters), 
                                                new SqlParameter("@OrderBy", sorts), 
                                                new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCityConnectionTime", Parameters);
                var CityConnectionTimeList = ds.Tables[0].AsEnumerable().Select(e => new CityConnectionTime
                    {
                        RefNo = e["RefNo"].ToString().ToUpper(),
                        SNo = Convert.ToInt32(e["SNo"].ToString()),
                        ProductName = e["ProductName"].ToString().ToUpper(),
                        AirportCode = e["AirportCode"].ToString().ToUpper(),
                        ConnectionTypeName = e["ConnectionTypeName"].ToString().ToUpper(),
                        AircraftType = Convert.ToString(e["AircraftType"]).ToUpper(),
                        SPHCode = Convert.ToString(e["SPHCode"]) == "" ? "" : Convert.ToString(e["SPHCode"]).ToUpper(),
                        //ConnectionTimeMax = Convert.ToInt32(e["ConnectionTimeMax"].ToString()),
                        //UldConnectionTimeMin = Convert.ToInt32(e["UldConnectionTimeMin"].ToString()),
                        //UldConnectionTimeMax = Convert.ToInt32(e["UldConnectionTimeMax"].ToString()),
                        //ExpressConnectionTime = Convert.ToInt32(e["UldConnectionTimeMax"].ToString()),
                        //UldExpressConnectionTime = Convert.ToInt32(e["UldExpressConnectionTime"].ToString()),
                        Root = e["Root"].ToString(),
                        Text_BasedOn = e["Text_BasedOn"].ToString(),
                        Text_IsInternational = e["Text_IsInternational"].ToString(),
                        Active = e["Active"].ToString(),
                        userCreatedBy = Convert.ToString(e["userCreatedBy"]).ToUpper(),
                        userUpdatedBy = Convert.ToString(e["userUpdatedBy"]).ToUpper(),
                         ConnectionTime = (e["ConnectionTime"]).ToString(),
                        Text_AirlineCodeSNo = e["Text_AirlineCodeSNo"].ToString().ToUpper(),


                    });
                ds.Dispose();
                return new DataSourceResult
                {

                    Data = CityConnectionTimeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())

                };
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }

        }
        /// <summary>
        /// Get Record on the basis of recordID from CityConnectionTime
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public CityConnectionTime GetCityConnectionTimeRecord(string recordID, string UserID)
        {
            try
            {
                CityConnectionTime CityConnectionTime = new CityConnectionTime();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCityConnectionTime", Parameters);
                if (dr.Read())
                {
                    CityConnectionTime.RefNo = Convert.ToString(dr["RefNo"]);
                    CityConnectionTime.SNo = Convert.ToInt32(dr["SNo"]);
                    CityConnectionTime.ProductSNo = dr["ProductSNo"] == DBNull.Value ? 0 : Convert.ToInt32(dr["ProductSNo"]);
                    CityConnectionTime.ProductName = Convert.ToString(dr["ProductName"]).ToUpper();
                    CityConnectionTime.AirportSNo = dr["AirportSNo"] == DBNull.Value ? "" : Convert.ToString(dr["AirportSNo"]);
                    CityConnectionTime.AirportCode = Convert.ToString(dr["AirportCode"]).ToUpper();
                    CityConnectionTime.AircraftSNo = dr["AircraftSNo"] == DBNull.Value ? "" : Convert.ToString(dr["AircraftSNo"]);
                    CityConnectionTime.AircraftType = Convert.ToString(dr["AircraftType"]).ToUpper();
                    CityConnectionTime.SPHCSNo = dr["SPHCSNo"] == null ? "" : (dr["SPHCSNo"]).ToString();
                    CityConnectionTime.SPHCode = Convert.ToString(dr["SPHCode"]).ToUpper();
                    CityConnectionTime.ConnectionTypeName = Convert.ToString(dr["ConnectionTypeName"]).ToUpper();
                    CityConnectionTime.ConnectionTypeSNo = Convert.ToInt32(dr["ConnectionType"]);
                    CityConnectionTime.Text_ConnectionTypeSNo = Convert.ToString(dr["ConnectionTypeName"]).ToUpper();
                    CityConnectionTime.Text_ProductSNo = Convert.ToString(dr["ProductName"]).ToUpper();
                    CityConnectionTime.Text_AirportSNo = Convert.ToString(dr["AirportCode"]).ToUpper();
                    CityConnectionTime.Text_AircraftSNo = Convert.ToString(dr["AircraftType"]).ToUpper();
                    CityConnectionTime.Text_SPHCSNo = Convert.ToString(dr["SPHCode"]).ToUpper();
                    CityConnectionTime.ConnectionTime = (dr["ConnectionTime"]).ToString();
                    CityConnectionTime.ConnectionTimeHr = Convert.ToInt32(dr["ConnectionTimeHr"]);
                    CityConnectionTime.ConnectionTimeMin = Convert.ToInt32(dr["ConnectionTimeMin"]);
                    CityConnectionTime.IsInternational = dr["IsInternational"] == DBNull.Value ? true : Convert.ToBoolean(dr["IsInternational"]);
                    CityConnectionTime.Text_IsInternational = Convert.ToString(dr["Text_IsInternational"]);
                    if (!String.IsNullOrEmpty(dr["IsRoot"].ToString()))
                    {
                        CityConnectionTime.IsRoot = Convert.ToBoolean(dr["IsRoot"]);
                        CityConnectionTime.Root = dr["Root"].ToString().ToUpper();
                    }
                    CityConnectionTime.BasedOn = dr["BasedOn"] == DBNull.Value ? 0 : Convert.ToInt32(dr["BasedOn"]);
                    CityConnectionTime.Text_BasedOn = Convert.ToString(dr["Text_BasedOn"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        CityConnectionTime.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        CityConnectionTime.Active = dr["Active"].ToString().ToUpper();
                    }

                    CityConnectionTime.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    CityConnectionTime.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    CityConnectionTime.AirlineSNo = dr["AirlineCodeSNo"].ToString();
                    CityConnectionTime.Text_AirlineCodeSNo = Convert.ToString(dr["Text_AirlineCodeSNo"]).ToUpper();
                    CityConnectionTime.OtherAirlineAccess = dr["OtherAirlineAccess"] == null ? "" : (dr["OtherAirlineAccess"]).ToString();
                    CityConnectionTime.Text_OtherAirlineAccess = Convert.ToString(dr["Text_OtherAirlineAccess"]).ToUpper();
                    CityConnectionTime.AdjustableWeight = Convert.ToDecimal((dr["AdjustableWeight"]).ToString() == "" ? "0" : (dr["AdjustableWeight"]).ToString()); 
                    CityConnectionTime.Text_AdjustableWeight= dr["AdjustableWeight"].ToString() == "" ? "0" : (dr["AdjustableWeight"]).ToString();
                    CityConnectionTime.AgentSNo = dr["AgentSNo"] == null ? "" : (dr["AgentSNo"]).ToString(); ;
                    CityConnectionTime.Text_AgentSNo = dr["Text_AgentSNo"] == null ? "" : (dr["Text_AgentSNo"]).ToString();
                }
                dr.Close();
                return CityConnectionTime;

            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }
        /// <summary>
        /// Save the CityConnectionTime Information into CityConnectionTime 
        /// </summary>
        /// <param name="CityConnectionTime"></param>
        /// <returns></returns>
        public List<string> SaveCityConnectionTime(List<CityConnectionTime> CityConnectionTime)
        {
            try
            {
               
                List<string> ErroMessage = new List<string>();
                DataTable dtCreateCityConnectionTime = CollectionHelper.ConvertTo(CityConnectionTime, "Active,RefNo,Root,Text_AircraftSNo,SPHCode,Text_SPHCSNo,Text_ConnectionTypeSNo,Text_AirportSNo,Text_ProductSNo,Text_IsInternational,Text_BasedOn,Text_AirlineCodeSNo,ConnectionTimeHr,ConnectionTimeMin,userCreatedBy,userUpdatedBy,Text_OtherAirlineAccess,Text_AdjustableWeight,Text_AgentSNo,CCTSlabs");
               

                DataTable dtcityConnectionSlabltrans =new DataTable();
                if (CityConnectionTime[0].CCTSlabs!=null)
                { 

                 dtcityConnectionSlabltrans = CollectionHelper.ConvertTo(CityConnectionTime[0].CCTSlabs, "Active");

                }

                BaseBusiness basebusiness = new BaseBusiness();
                if (!basebusiness.ValidateBaseBusiness("CityConnectionTime", dtCreateCityConnectionTime, "SAVE"))
                {
                    ErroMessage = basebusiness.ErrorMessage;
                    return ErroMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CityConnectionTimeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCityConnectionTime;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@CityConnectionTimeSlab";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtcityConnectionSlabltrans;

                SqlParameter[] Parameters = { param, param1 };


                
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCityConnectionTime", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = basebusiness.ReadServerErrorMessages(ret, "CityConnectionTime");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErroMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = basebusiness.ReadServerErrorMessages(ret, basebusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErroMessage.Add(dataBaseExceptionMessage);
                    }

                }
                return ErroMessage;
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }
        /// <summary>
        ///  Delete CityConnectionTime record on the basis of ID
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteCityConnectionTime(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCityConnectionTime", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CityConnectionTime");
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
                    //Error
                }
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }
        /// <summary>
        /// Update CityConnectionTime record on the basis of ID
        /// </summary>
        /// <param name="CityConnectionTime"></param>
        /// <returns></returns>

       


        public List<string> UpdateCityConnectionTime(List<CityConnectionTime> CityConnectionTime)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
                
                DataTable dtCityConnectionTime = CollectionHelper.ConvertTo(CityConnectionTime, "Active,RefNo,Root,Text_AircraftSNo,SPHCode,Text_SPHCSNo,Text_ConnectionTypeSNo,Text_AirportSNo,Text_ProductSNo,Text_IsInternational,Text_BasedOn,Text_AirlineCodeSNo,ConnectionTimeHr,ConnectionTimeMin,userCreatedBy,userUpdatedBy,Text_OtherAirlineAccess,CCTSlabs,Text_AdjustableWeight,Text_AgentSNo");

                //dtCityConnectionTime.Rows[0]["AdjustableWeight"] = 50;
                DataTable dtcityConnectionSlabltrans = CollectionHelper.ConvertTo(CityConnectionTime[0].CCTSlabs, "Active");



                BaseBusiness baseBusiness = new BaseBusiness();


            


                if (!baseBusiness.ValidateBaseBusiness("CityConnectionTime", dtCityConnectionTime, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CityConnectionTimeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCityConnectionTime;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@CityConnectionTimeSlab";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtcityConnectionSlabltrans;

                SqlParameter[] Parameters = { param, param1 };



             
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCityConnectionTime", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CityConnectionTime");
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
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
            return ErrorMessage;
        }


        //Added by mukesh

        //public KeyValuePair<string, List<Connec>> GetCustomsOtherInformationTabRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
        //{
        //    try
        //    {
        //        CustomsOtherInformationTab CustomsOtherInformationTab = new CustomsOtherInformationTab();
        //        SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomsOtherInformationTab", Parameters);
        //        var CustomsOtherInformationTabList = ds.Tables[0].AsEnumerable().Select(e => new CustomsOtherInformationTab
        //        {
        //            SNo = Convert.ToInt32(e["SNo"]),
        //            AWBSNo = e["AWBSNo"].ToString(),
        //            OSI = e["SCI"].ToString(),
        //            BookingSNo = e["AWBReferenceBookingSNo"].ToString(),
        //            BookingRefNo = e["BookingRefNo"].ToString(),
        //            CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
        //        });
        //        return new KeyValuePair<string, List<CustomsOtherInformationTab>>(ds.Tables[1].Rows[0][0].ToString(), CustomsOtherInformationTabList.AsQueryable().ToList());
        //    }
        //    catch (Exception ex)//(Exception ex)
        //    {
        //        throw ex;
        //    }
        //}



        public List<string> createUpdateCityConnectionTimeSlab(string strData)
        {
           
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtCustomsOtherInformationTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //dtCustomsOtherInformationTab.Columns.Remove("BookingSNo");
                var dtCreateCustomsOtherInformationTab = (new DataView(dtCustomsOtherInformationTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateCustomsOtherInformationTab = (new DataView(dtCustomsOtherInformationTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomsOtherInformationTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateCustomsOtherInformationTab.Rows.Count > 0)
                {
                    param.Value = dtCreateCustomsOtherInformationTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomsOtherInformationTab", Parameters);
                }
                //for update existing record
                if (dtUpdateCustomsOtherInformationTab.Rows.Count > 0)
                {
                    param.Value = dtUpdateCustomsOtherInformationTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomsOtherInformationTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteCityConnectionTimeSlab(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomsOtherInformationTab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }





        public string GetDefault(int id)
        {
            try
            {
                DataSet ds = new DataSet();
                // var FormElement = System.Web.HttpContext.Current.Request.Form;
                //var connectionType = 6;//Convert.ToInt32(FormElement["ConnectionTypeSNo"]);
                SqlParameter[] Parameters = { new SqlParameter("@SNo", id) };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDefaultConnectionType", Parameters);

                return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public List<string> createUpdateCityConnectionTimeSlab(List<CityConnectionTimeSlab> CityConnectionTime)
        {
            throw new NotImplementedException();
        }


        public KeyValuePair<string, List<CityConnectionTimeSlab>> GetCityConnectionTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "CityConnectionTimeSNo=" + recordID;
                CityConnectionTimeSlab commissionTrans = new CityConnectionTimeSlab();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityConnectionTransRecord", Parameters);
                var cityConnectionTransList = ds.Tables[0].AsEnumerable().Select(e => new CityConnectionTimeSlab
                {
                    SNo = Convert.ToInt32(e["Sno"]),
                    CityConnectionTimeSNo = Convert.ToInt32(e["CityConnectionTimeSNo"]),
                    StartWeight = Convert.ToInt32(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToInt32(e["EndWeight"].ToString()),
                    GrossWtVariancePlus = e["GrossWtVariancePlus"] == DBNull.Value ? (int?)null : Convert.ToInt32(e["GrossWtVariancePlus"]),
                    GrossWtVarianceminus = e["GrossWtVarianceminus"] == DBNull.Value ? (int?)null : Convert.ToInt32(e["GrossWtVarianceminus"]),                 
                    VoluemeWeightPlus = e["VoluemeWeightPlus"] == DBNull.Value ? (int?)null : Convert.ToInt32(e["VoluemeWeightPlus"]),
                    VoluemeWeightminus = e["VoluemeWeightminus"] == DBNull.Value ? (int?)null : Convert.ToInt32(e["VoluemeWeightminus"]),
                  
                });
                return new KeyValuePair<string, List<CityConnectionTimeSlab>>(ds.Tables[1].Rows[0][0].ToString(), cityConnectionTransList.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {

                throw ex;
            }
        }


    }
}
