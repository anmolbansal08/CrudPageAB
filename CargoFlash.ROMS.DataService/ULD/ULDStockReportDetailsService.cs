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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;
using System.Web.Script.Serialization;
using ClosedXML.Excel;
using System.IO;
using System.Web;


namespace CargoFlash.Cargo.DataService.ULD
{
    /*
          *****************************************************************************
          Service Name:		  ULDStockReportDetailsService
          Purpose:		      Only View 
          Company:		      CargoFlash Infotech Pvt Ltd.
          Author:			  Sushant Kumar Nayak
          Created On:		  18-11-2017
          Updated By:    
          Updated On:
          Approved By:
          Approved On:
          *****************************************************************************
          */


    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDStockReportDetailsService : SignatureAuthenticate, IULDStockReportDetailsService
    {
        public KeyValuePair<string, List<ULDStockReportDetails>> GetULDStockReportDetailsService(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                string[] ULDStockReportDetails = whereCondition.Split('-');
                whereCondition = "";

                SqlParameter[] Parameters = { new SqlParameter("@AirLine", ULDStockReportDetails[0])
                                            , new SqlParameter("@Airport",  ULDStockReportDetails[1])
                                            , new SqlParameter("@Ownership",  ULDStockReportDetails[2]) 
                                            , new SqlParameter("@ULDId",  ULDStockReportDetails[3])
                                            , new SqlParameter("@IdleDays",  ULDStockReportDetails[4])
                                            , new SqlParameter("@IdleDaysval",  ULDStockReportDetails[5])
                                            , new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition)
                                            , new SqlParameter("@OrderBy", sort)
                                            ,new SqlParameter("@Lost", ULDStockReportDetails[6])
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDStockReportDetails", Parameters);
                var ULDStockReportDetailss = ds.Tables[0].AsEnumerable().Select(e => new ULDStockReportDetails
                 {

                     AirportCode = e["AirportCode"].ToString(),
                     ULDType = e["ULDType"].ToString(),
                     ULDCategory = e["ULDCategory"].ToString(),
                     ULDNo = e["ULDNo"].ToString(),
                     FlightNo = e["FlightNo"].ToString().ToUpper(),
                     FlightDate = e["FlightDate"].ToString(),
                     Status = e["Status"].ToString(),
                     Condition = e["Condition"].ToString(),
                     Idledays = e["Idledays"].ToString(),
                     AddOncount = e["AddOncount"].ToString(),
                     TypeCount = e["TypeCount"].ToString(),
                     TotalULD = e["TotalULD"].ToString(),
                     LostRemarks = e["LostRemarks"].ToString(),



                 });
                return new KeyValuePair<string, List<ULDStockReportDetails>>(ds.Tables[1].Rows[0][0].ToString(), ULDStockReportDetailss.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<ULDStockReportDetails> ExportExcelPdf(ULDStockReportDetails obj)
        {
            try
            {
                List<ULDStockReportDetails> lst = new List<ULDStockReportDetails>();

                SqlParameter[] Parameters = { new SqlParameter("@AirLine", obj.AirLine)
                                            , new SqlParameter("@Airport",  obj.AirportCode)
                                            , new SqlParameter("@Ownership", obj.Ownership)   
                                            , new SqlParameter("@ULDId",  obj.ULDId)
                                            , new SqlParameter("@IdleDays",  obj.IdleDays)
                                            , new SqlParameter("@IdleDaysval",  obj.IdleDaysval)
                                            , new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 5), new SqlParameter("@WhereCondition", "")
                                            , new SqlParameter("@OrderBy", "")
                                            , new SqlParameter("@Lost", obj.LostRemarks)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDStockReportDetailsExcelPdfPrint", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ULDStockReportDetails
                    {

                        AirportCode = e["AirportCode"].ToString(),
                        ULDType = e["ULDType"].ToString(),
                        ULDCategory = e["ULDCategory"].ToString(),
                        ULDNo = e["ULDNo"].ToString(),
                        FlightNo = e["FlightNo"].ToString().ToUpper(),
                        FlightDate = e["FlightDate"].ToString(),
                        Status = e["Status"].ToString(),
                        Condition = e["Condition"].ToString(),
                        Idledays = e["Idledays"].ToString(),
                        AddOncount = e["AddOncount"].ToString(),
                        TypeCount = e["TypeCount"].ToString(),
                        TotalULD = e["TotalULD"].ToString(),
                        LostRemarks = e["LostRemarks"].ToString(),

                    }).ToList();
                return lst;

            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


    }
}
