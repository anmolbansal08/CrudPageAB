using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Rate;

using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region Short Acceptance Service Description
    /*
	*****************************************************************************
	Service Name:	ShortAcceptanceService      
	Purpose:		This Service used to get details of Booking and by pass Acceptance
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		04 July 2017
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ShortAcceptanceService : BaseWebUISecureObject, IShortAcceptanceService
    {
        public string GetSearchResultData(int AcceptanceType, Int64 AWBSNo, string FlightNo, Int64 FlightOrigin, Int64 FlightDestination, string FlightDate,int AirlineSno)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@AcceptanceType", AcceptanceType),
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@FlightNo", FlightNo),
                                            new SqlParameter("@FlightOrigin", FlightOrigin),
                                            new SqlParameter("@FlightDestination", FlightDestination),
                                            new SqlParameter("@FlightDate", FlightDate),
                                                new SqlParameter("@AirlineSno", AirlineSno),
                                            new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ShortAcceptance_GetSearchResultData", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveResult(string AWBSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ShortAcceptance_SaveResult", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveShortAcceptance(List<ShortAcceptanceData> ShortAcceptanceDataArray)
        {
            BaseBusiness baseBusiness = new BaseBusiness();

            DataTable dtCheckedShortAcceptanceData = CollectionHelper.ConvertTo(ShortAcceptanceDataArray, "");

            SqlParameter paramShortAcceptanceData = new SqlParameter();
            paramShortAcceptanceData.ParameterName = "@ShortAcceptanceData";
            paramShortAcceptanceData.SqlDbType = System.Data.SqlDbType.Structured;
            paramShortAcceptanceData.Value = dtCheckedShortAcceptanceData;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            paramShortAcceptanceData,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ShortAcceptance_SaveShortAcceptance", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
