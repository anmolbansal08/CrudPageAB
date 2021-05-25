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
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Common;
using System.Web;
using CargoFlash.Cargo.DataService;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class EmailAlertService : SignatureAuthenticate, IEmailAlertService
    {
        /*
       *****************************************************************************
       I Name:		      EmailAlert
       Purpose:		    
       Company:		      CargoFlash Infotech Pvt Ltd.
       Author:			  Sushant Kumar Nayak
       Created On:		  22-01-2018
       Updated By:    
       Updated On:
       Approved By:
       Approved On:
       *****************************************************************************
       */

        public DataSourceResult GetGridData(int EmailAlertSNo, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<EmailAlert>(filter);
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_EmailAlert", Parameters);

            var EmailAlert = ds.Tables[0].AsEnumerable().Select(e => new EmailAlert
            {

                SNo = Convert.ToInt32(e["SNo"]),
                AirlineName = e["AirlineName"].ToString(),
                Process = e["Process"].ToString(),
                CityCountry = e["CityCountry"].ToString(),
                frequency = e["frequency"].ToString().ToUpper(),
                intervals = e["intervals"].ToString(),


            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = EmailAlert.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public string SaveEmailAlert(EmailAlertCollection obj)
        {

            try
            {
                SqlParameter[] Parameters = {
                                               new SqlParameter("@AirlineSNo", obj.Airline),
                                               new SqlParameter("@ProcessSNo", obj.Process),
                                               new SqlParameter("@CityCountryType", obj.CityCountryType),
                                               new SqlParameter("@CityCountry", obj.CityCountry),
                                               new SqlParameter("@Frequency", obj.Occurs),
                                               new SqlParameter("@Hours", obj.Hours),
                                               new SqlParameter("@DailyTime", obj.DailyTime),
                                               new SqlParameter("@Weekly", obj.Weekly),
                                               new SqlParameter("@WeeklyTime", obj.WeeklyTime),
                                               new SqlParameter("@Month",obj.Month),
                                               new SqlParameter("@MonthTime",obj.MonthTime),
                                               new SqlParameter("@EmailAddress",obj.EmailAddress),
                                               new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "saveESSCharges", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

    }
}
