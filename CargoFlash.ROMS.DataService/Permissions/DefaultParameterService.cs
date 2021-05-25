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
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DefaultParameterService : SignatureAuthenticate, IDefaultParameterService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public DefaultParameters GetDefaultParameterRecord(string recid, string UserID, string UserSNo)
        {
            DefaultParameters defaults = new DefaultParameters();
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                string[] tableNames = null;
                SqlHelper.FillDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSystemSettings", ds, tableNames, Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    defaults.DefaultProductSNo = Convert.ToString(ds.Tables[0].Rows[0]["DefaultProductSNo"]);
                    defaults.DefaultProductName = Convert.ToString(ds.Tables[0].Rows[0]["DefaultProductName"]);
                    defaults.DefaultAirportSNo = Convert.ToString(ds.Tables[0].Rows[0]["DefaultAirportSNo"]);
                    defaults.DefaultAirportName = Convert.ToString(ds.Tables[0].Rows[0]["DefaultAirportName"]);
                    defaults.FWBTransfer = Convert.ToString(ds.Tables[0].Rows[0]["FWB Transfer"]);
                    defaults.FWBAmendmentTime = Convert.ToString(ds.Tables[0].Rows[0]["FWBAmendmentTime"]);
                    defaults.BOEVerification = Convert.ToString(ds.Tables[0].Rows[0]["BOEVerification"]);
                    defaults.FC_AirlineName = Convert.ToString(ds.Tables[0].Rows[0]["FC_AirlineName"]);
                    defaults.FC_AllowedCity = Convert.ToString(ds.Tables[0].Rows[0]["FC_AllowedCity"]);
                    defaults.IsCheckFlightOverBooking = Convert.ToString(ds.Tables[0].Rows[0]["IsCheckFlightOverBooking"]) == "0";
                    defaults.DefaultAirportCode = Convert.ToString(ds.Tables[0].Rows[0]["DefaultAirportCode"]);
                    defaults.DomesticBookingPeriod = Convert.ToString(ds.Tables[0].Rows[0]["DomesticBookingPeriod"]);
                    defaults.CMSDivisor = Convert.ToString(ds.Tables[0].Rows[0]["CMSDivisor"]);
                    defaults.INHDivisor = Convert.ToString(ds.Tables[0].Rows[0]["INHDivisor"]);
                    defaults.InternationalBookingPeriod = Convert.ToString(ds.Tables[0].Rows[0]["InternationalBookingPeriod"]);
                    defaults.FWBOnExecution = Convert.ToString(ds.Tables[0].Rows[0]["FWBOnExecution"]) == "0";
                }
            }
            catch(Exception ex)// (Exception ex)
            {
            }
            return defaults;
        }

        public List<string> UpdateDefaultParameter(List<DefaultParameters> DefaultParameter)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable DefaultParameters = CollectionHelper.ConvertTo(DefaultParameter, "");
                DataTable dtDefaultParameters = new DataTable();
                dtDefaultParameters.Columns.Add("SysKey");
                dtDefaultParameters.Columns.Add("SysValue");
                dtDefaultParameters.Rows.Add(new object[] { "DefaultProductSNo", DefaultParameters.Rows[0]["DefaultProductSNo"] });
                dtDefaultParameters.Rows.Add(new object[] { "DefaultProductName", DefaultParameters.Rows[0]["DefaultProductName"] });
                dtDefaultParameters.Rows.Add(new object[] { "DefaultAirportSNo", DefaultParameters.Rows[0]["DefaultAirportSNo"] });
                dtDefaultParameters.Rows.Add(new object[] { "DefaultAirportName", DefaultParameters.Rows[0]["DefaultAirportName"] });
                dtDefaultParameters.Rows.Add(new object[] { "FWBTransfer", DefaultParameters.Rows[0]["FWBTransfer"] });
                dtDefaultParameters.Rows.Add(new object[] { "FWBAmendmentTime", DefaultParameters.Rows[0]["FWBAmendmentTime"] });
                dtDefaultParameters.Rows.Add(new object[] { "BOEVerification", DefaultParameters.Rows[0]["BOEVerification"] });
                dtDefaultParameters.Rows.Add(new object[] { "FC_AirlineName", DefaultParameters.Rows[0]["FC_AirlineName"] });
                dtDefaultParameters.Rows.Add(new object[] { "FC_AllowedCity", DefaultParameters.Rows[0]["FC_AllowedCity"] });
                dtDefaultParameters.Rows.Add(new object[] { "IsCheckFlightOverBooking", DefaultParameters.Rows[0]["IsCheckFlightOverBooking"] });
                dtDefaultParameters.Rows.Add(new object[] { "DefaultAirportCode", DefaultParameters.Rows[0]["DefaultAirportCode"] });
                dtDefaultParameters.Rows.Add(new object[] { "DomesticBookingPeriod", DefaultParameters.Rows[0]["DomesticBookingPeriod"] });
                dtDefaultParameters.Rows.Add(new object[] { "CMSDivisor", DefaultParameters.Rows[0]["CMSDivisor"] });
                dtDefaultParameters.Rows.Add(new object[] { "INHDivisor", DefaultParameters.Rows[0]["INHDivisor"] });
                dtDefaultParameters.Rows.Add(new object[] { "InternationalBookingPeriod", DefaultParameters.Rows[0]["InternationalBookingPeriod"] });
                dtDefaultParameters.Rows.Add(new object[] { "FWBOnExecution", DefaultParameters.Rows[0]["FWBOnExecution"] });


                if (!basebusiness.ValidateBaseBusiness("DefaultParameter", dtDefaultParameters, "UPDATE"))
                {
                    ErrorMessage = basebusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SystemSettingTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtDefaultParameters;

                SqlParameter[] Parameters = { param };
                int ret = 0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSystemSetting", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = basebusiness.ReadServerErrorMessages(ret, "DefaultParameter");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = basebusiness.ReadServerErrorMessages(ret, basebusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            catch(Exception ex)// (Exception e)
            {
            }
            return ErrorMessage;
        }
    }
}
