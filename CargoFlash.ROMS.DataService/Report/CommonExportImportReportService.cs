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
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Report
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CommonExportImportReportService : SignatureAuthenticate, ICommonExportImportReportService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();


        public CommonExportImportReport GetRecord(string recordID, string UserID)
        {
            throw new NotImplementedException();
        }


        public KeyValuePair<string, List<ExportImportReport>> GetReport(string recordID, int page, int pageSize, CommonExportImportRequest model, string sort)
        {
            try
            {
                //whereCondition = recordID;
                //string[] wher = whereCondition.Split('@');
                //whereCondition = "";

                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort), new SqlParameter("@Type", wher[0]), new SqlParameter("@ReportType", wher[1]), new SqlParameter("@ReportNameSNo", wher[2]), new SqlParameter("@AirlineSNo", wher[3]), new SqlParameter("@Month", wher[4]), new SqlParameter("@Year", wher[5]) };
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort), new SqlParameter("@Type", model.EIType), new SqlParameter("@ReportType", model.type), new SqlParameter("@ReportNameSNo", model.ReportNameSNo), new SqlParameter("@AirlineSNo", model.AirlineSNo), new SqlParameter("@Month", model.Month), new SqlParameter("@Year", model.Year) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReport_CommonExportImportReport", Parameters);
                var List = ds.Tables[0].AsEnumerable().Select(e => new ExportImportReport
                {
                    SNo = "1",//e["SNo"].ToString(),
                    Code = e["Code"].ToString(),
                    Name = e["Name"].ToString(),
                    Cons = e["Cons"].ToString(),
                    Pkgs = e["Pkgs"].ToString(),
                    GRSWt = e["GRSWt"].ToString(),
                    CHRGWt = e["CHRGWt"].ToString(),

                });
                return new KeyValuePair<string, List<ExportImportReport>>(ds.Tables[1].Rows[0][0].ToString(), List.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_CommonExportImportReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }
        public KeyValuePair<string, List<ExportImportDetails>> GetDetails(string recordID, int page, int pageSize, CommonExportImportRequest model, string sort)
        {
            //string[] wher = whereCondition.Split('@');
            //whereCondition = "";
            try
            {
                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort), new SqlParameter("@Type", wher[0]), new SqlParameter("@ReportType", wher[1]), new SqlParameter("@ReportNameSNo", wher[2]), new SqlParameter("@AirlineSNo", wher[3]), new SqlParameter("@Month", wher[4]), new SqlParameter("@Year", wher[5]) };
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort), new SqlParameter("@Type", model.EIType), new SqlParameter("@ReportType", model.type), new SqlParameter("@ReportNameSNo", model.ReportNameSNo), new SqlParameter("@AirlineSNo", model.AirlineSNo), new SqlParameter("@Month", model.Month), new SqlParameter("@Year", model.Year) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReport_CommonExportImportReportDetails", Parameters);
                var List = ds.Tables[0].AsEnumerable().Select(e => new ExportImportDetails
                {
                    SNo = "1",//e["SNo"].ToString(),
                    Code = e["Code"].ToString(),
                    Name = e["Name"].ToString(),
                    Cons = e["Cons"].ToString(),
                    Pkgs = e["Pkgs"].ToString(),
                    GRSWt = e["GRSWt"].ToString(),
                    CHRGWt = e["CHRGWt"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    OriginAirport = e["OriginAirport"].ToString(),
                    DestinationAirport = e["DestinationAirport"].ToString(),

                });
                return new KeyValuePair<string, List<ExportImportDetails>>(ds.Tables[1].Rows[0][0].ToString(), List.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_CommonExportImportReportDetails"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}
