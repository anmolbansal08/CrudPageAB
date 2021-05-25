using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Schedule;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Reflection;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Schedule
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ViewEditFlightService : SignatureAuthenticate, IViewEditFlightService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
     

        public string GetFlightDetail(FlightDetail model)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@Date", model.Date), new SqlParameter("@flightNo", model.FlightNo),
                                            new SqlParameter("@Origin", model.Origin), new SqlParameter("@Destination", model.Destination) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_ViewEditFlightDetail", Parameters);

                FlightOpenService fos = new FlightOpenService();
                return fos.DStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //public string GetFlight(string FlightNo, string FlightDate)
        //{
        //    SqlParameter[] Parameters = { 
        //        new SqlParameter("@FlightNo", FlightNo),
        //       new SqlParameter("@FlightDate", FlightDate)                         };

        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDailyFlight", Parameters);

        //    return ds.Tables[0].Rows[0][0].ToString();
        //}

        public string GetEditFlightDetail(int SNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_EditFlightDetail", Parameters);

                FlightOpenService fos = new FlightOpenService();
                return fos.DStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //public string UpdateFlightDetail(String FlightNo, String FlightDate, String orgsno, String destsno, String ValidFrom, String ValidTo, String Mon, String Tue, String Wed, String Thu, String Fri, String Sat, String Sun, String FlightType, String AircraftType, String GrossWt, String VolueWt, String ETD, String ETA, String DFSNo, String Reason, String Active, String DDiff, String IsCAO, String Forwarder, String MovementNo, int UserSNo, String IsLoadedCancellation, String IsRFS)

        public List<string> UpdateFlightDetail(List<ViewEditFlight> dailyFlightDetails)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtDailyFlightAllotment = new DataTable();

                var dtDailyFlightAllotmentWithExluceCol = new DataTable();
                dtDailyFlightAllotmentWithExluceCol = CollectionHelper.ConvertTo(dailyFlightDetails, "strData");

                DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(dailyFlightDetails[0].strData), (typeof(DataTable)));

                if (dt.Rows.Count > 0)
                    dtDailyFlightAllotment = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(dailyFlightDetails[0].strData), (typeof(DataTable)));
                else
                {
                    dtDailyFlightAllotment.Columns.Add("SNo", typeof(int));
                    dtDailyFlightAllotment.Columns.Add("IsUsed", typeof(int));
                    dtDailyFlightAllotment.Columns.Add("DailyFlightSNo", typeof(int));
                    dtDailyFlightAllotment.Columns.Add("AllotmentSNo", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("HdnAllotmentTypeSNo", typeof(int));
                    dtDailyFlightAllotment.Columns.Add("AllotmentTypeSNo", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("HdnOfficeSNo", typeof(int));
                    dtDailyFlightAllotment.Columns.Add("OfficeSNo", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("HdnAccountSNo", typeof(int));
                    dtDailyFlightAllotment.Columns.Add("AccountSNo", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("GrossWeight", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("Volume", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("ReleaseGross", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("ReleaseVolume", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("GrossVariancePlus", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("GrossVarianceMinus", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("VolumeVariancePlus", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("VolumeVarianceMinus", typeof(decimal));
                    dtDailyFlightAllotment.Columns.Add("HdnSHC", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("SHC", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("IsExcludeSHC", typeof(Boolean));
                    dtDailyFlightAllotment.Columns.Add("HdnCommodity", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("Commodity", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("IsExcludeCommodity", typeof(Boolean));
                    dtDailyFlightAllotment.Columns.Add("HdnProduct", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("Product", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("IsExcludeProduct", typeof(Boolean));
                    dtDailyFlightAllotment.Columns.Add("ReleaseTimeHr", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("ReleaseTimeMin", typeof(string));
                    dtDailyFlightAllotment.Columns.Add("Active", typeof(Boolean));

                    dtDailyFlightAllotment.Rows.Add(new Object[] { 0, 0, 0, "", 0, "", 0, "", 0, "", 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, "", "", false, "", "", false, "", "", false, "0", "0", false });
                }
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@DailyFlightDetails",dtDailyFlightAllotmentWithExluceCol),
                                            new SqlParameter("@DailyFlightAllotmentDetails",dtDailyFlightAllotment),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                // DataSet DST = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateDailyFlightAllotmentDetail", Parameters);
                string result = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateDailyFlightAllotmentDetail", Parameters).Tables[0].Rows[0][0];

                if (Convert.ToInt32(result) == 2000)
                {
                    ErrorMessage.Add("Flight Edited Successfully.");
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;

        }

        public KeyValuePair<string, List<DailyFlightAllotment>> GetDailyFlightAllotmentRecord(int recid,int pageNo, int pageSize,FlightAllotment model , string sort)
        {
            try
            {
                
                DailyFlightAllotment viewEditFlight = new DailyFlightAllotment();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", pageNo), new SqlParameter("@PageSize", pageSize), 
                                                new SqlParameter("@FlightNo", model.FlightNo), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDailyFlightAllotmentRecord", Parameters);
                var dailyFlightAllotmentList = ds.Tables[0].AsEnumerable().Select(e => new DailyFlightAllotment
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    IsUsed = Convert.ToInt32(e["IsUsed"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    AllotmentSNo = Convert.ToInt32(e["AllotmentSNo"].ToString()),
                    AllotmentCode = e["AllotmentCode"].ToString(),
                    AllotmentTypeSNo = e["Text_AllotmentTypeSNo"].ToString(),
                    HdnAllotmentTypeSNo = e["AllotmentTypeSNo"].ToString(),
                    AccountSNo = e["Text_AccountSNo"].ToString(),
                    HdnAccountSNo = e["AccountSNo"].ToString(),
                    OfficeSNo = e["Text_OfficeSNo"].ToString(),
                    HdnOfficeSNo = e["OfficeSNo"].ToString(),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString()),
                    SHC = e["Text_SHC"].ToString(),
                    HdnSHC = e["SHC"].ToString(),
                    Commodity = e["Text_Commodity"].ToString(),
                    HdnCommodity = e["Commodity"].ToString(),
                    Product = e["Text_Product"].ToString(),
                    HdnProduct = e["Product"].ToString(),
                    IsExcludeSHC = Convert.ToBoolean(e["SHCExclude"].ToString()),
                    IsExcludeCommodity = Convert.ToBoolean(e["CommodityExclude"].ToString()),
                    IsExcludeProduct = Convert.ToBoolean(e["ProductExclude"].ToString()),
                    Active = Convert.ToBoolean(e["Active"].ToString()) == true ? false : true,
                    GrossVariancePlus = Convert.ToDecimal(e["GrossVariancePlus"].ToString()),
                    GrossVarianceMinus = Convert.ToDecimal(e["GrossVarianceMinus"].ToString()),
                    VolumeVariancePlus = Convert.ToDecimal(e["VolumeVariancePlus"].ToString()),
                    VolumeVarianceMinus = Convert.ToDecimal(e["VolumeVarianceMinus"].ToString()),
                    ReleaseGross = e["ReleaseGross"].ToString(),
                    ReleaseVolume = e["ReleaseVolume"].ToString(),
                    ReleaseTimeHr = e["ReleaseTimeHr"].ToString(),
                    ReleaseTimeMin = e["ReleaseTimeMin"].ToString()
                });
                return new KeyValuePair<string, List<DailyFlightAllotment>>(ds.Tables[1].Rows[0][0].ToString(), dailyFlightAllotmentList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> deleteDailyFlightAllotment(int RecordId)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDailyFlightAllotment", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ViewEditFlight");
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

        public string FlightPreviousRecord(int SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo),                                        
                                        new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spFlightPreviousRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string spGetFlightSIRemarks(int SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo),                                        
                                        new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetFlightSIRemarks", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

    }
}
