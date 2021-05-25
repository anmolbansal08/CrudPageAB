using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Schedule;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class UCMDiscrepancyReportService : BaseWebUISecureObject, IUCMDiscrepancyReportService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try 
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<UCMDiscrepancyReportGrid>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters.Replace("FilterFlightdate", "Flightdate")), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UCMDiscrepancyReport_GetGridRecord", Parameters);
            var obj = ds.Tables[0].AsEnumerable().Select(e => new UCMDiscrepancyReportGrid
            {
                SNo = e["SNo"].ToString(),
                Airline = e["Airline"].ToString(),
                Flightdate = e["Flightdate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["Flightdate"]), DateTimeKind.Utc),             
                Flightno = e["Flightno"].ToString(),
                UCMType = e["UCMType"].ToString(),
                ReceivedUCM = e["ReceivedUCM"].ToString(),
                ProcessedUCM = e["ProcessedUCM"].ToString(),
                DiscepancyULD = e["DiscepancyULD"].ToString(),
                notificationsentto = e["notificationsentto"].ToString(),
                EDI_UCM_ID = e["EDI_UCM_ID"].ToString(),
                UCMAmendmentSNo = e["UCMAmendmentSNo"].ToString(),
                OriginAirPort = e["OriginAirPort"].ToString(),
                NotificationStatus = e["NotificationStatus"].ToString(),
                utimestamp = e["utimestamp"].ToString(),
                //  DestinationAirPort = e["DestinationAirPort"].ToString(),
            });
            ds.Dispose();
            var res = new DataSourceResult { Data = obj.AsQueryable().ToList(), Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) };
            return res;
           }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UCMDiscrepancyReportDetail(int UCMDiscrepancyReportSNo)
        {
            try 
            { 
            SqlParameter[] Parameters = {   new SqlParameter("@UCMDiscrepancyReportSNo",UCMDiscrepancyReportSNo),                                    
                                          };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMDiscrepancyReport_DetailsPage", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UCMDiscrepancyExicute(string Edi_UCMID)
        {
            try 
            { 
            SqlParameter[] Parameters = {   new SqlParameter("@Edi_UCMID",Edi_UCMID),                                    
                                          };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpgetmessageUCm", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string BtnUCMCiscrepancytUpdate(string Edi_UCMID)
        {
            try 
            { 
            SqlParameter[] Parameters = {   new SqlParameter("@Edi_UCMID",Edi_UCMID),                                    
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUpdateUCMRemarks", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UCMDiscrepency_saveULDTracking(string UCMType,string Flightno,string FlightDate,string Usersno,string Updationtype,string ULDNo)
        {
            try
            {
                SqlParameter[] Parameters = {new SqlParameter("@UCMType",UCMType),new SqlParameter("@Flightno",Flightno),new SqlParameter("@FlightDate",FlightDate),
                    new SqlParameter("@Usersno",Usersno),new SqlParameter("@Updationtype",Updationtype),new SqlParameter("@ULDNo",ULDNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UCMDiscrepency_saveULDTracking", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

    }
}
