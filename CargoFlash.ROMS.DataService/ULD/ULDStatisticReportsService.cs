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
          Service Name:		  ULDStatisticReports
          Purpose:		      Only View 
          Company:		      CargoFlash Infotech Pvt Ltd.
          Author:			  Sushant Kumar Nayak
          Created On:		  05-02-2018
          Updated By:    
          Updated On:
          Approved By:
          Approved On:
          *****************************************************************************
          */


    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDStatisticReportsService : SignatureAuthenticate, IULDStatisticReportsService
    {
        public KeyValuePair<string, List<ULDStatisticReports>> GetULDStatisticReports(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {



                string value = whereCondition;
                string strCode = "G126A";
                string[] lines = value.Split(new[] { strCode }, StringSplitOptions.None);

                SqlParameter[] Parameters = {
                                             new SqlParameter("@Airport",  lines[0])
                                            , new SqlParameter("@ULDId",  lines[1])
                                            , new SqlParameter("@Manufactured",  lines[2])
                                            , new SqlParameter("@Yearofwriteofdate",  lines[3])
                                            , new SqlParameter("@UldNo",  lines[4])
                                            , new SqlParameter("@AirlineC",  lines[5])
                                            , new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", "")
                                            , new SqlParameter("@OrderBy", sort)
                                         
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDStatisticULDUtilization", Parameters);
                var ULDStatisticReportss = ds.Tables[0].AsEnumerable().Select(e => new ULDStatisticReports
                 {

                     PurchasedFrom = e["PurchasedFrom"].ToString(),
                     ULDType = e["ULDType"].ToString(),
                     ULDID = e["ULDID"].ToString(),
                     TotalMovement = e["TotalMovement"].ToString(),
                     Price = e["Price"].ToString(),
                     TotalRepairCost = e["TotalRepairCost"].ToString(),
                     PurchasedDate = e["PurchasedDate"].ToString(),
                     WriteOffDate = e["WriteOffDate"].ToString(),
                     ULDTypewiseCount = e["ULDTypewiseCount"].ToString(),
                     AverageLifeDays = e["AverageLifeDays"].ToString(),

                 });
                return new KeyValuePair<string, List<ULDStatisticReports>>(ds.Tables[1].Rows[0][0].ToString(), ULDStatisticReportss.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<ULDStatisticReports> ExportExcelPdf(ULDStatisticReports obj)
        {
            try
            {
                List<ULDStatisticReports> lst = new List<ULDStatisticReports>();

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@Airport",  obj.AirportCode)
                                            , new SqlParameter("@ULDId",  obj.ULDID)
                                            , new SqlParameter("@Manufactured",  obj.PurchasedFrom)
                                            , new SqlParameter("@Yearofwriteofdate",  obj.WriteOffDate)
                                            , new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 5), new SqlParameter("@WhereCondition", "")
                                            , new SqlParameter("@OrderBy", "")
                                    
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDStatisticReportsExcelPdfPrint", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ULDStatisticReports
                    {

                        PurchasedFrom = e["PurchasedFrom"].ToString(),
                        ULDType = e["ULDType"].ToString(),
                        ULDID = e["ULDID"].ToString(),
                        TotalMovement = e["TotalMovement"].ToString(),
                        Price = e["Price"].ToString(),
                        TotalRepairCost = e["TotalRepairCost"].ToString(),
                        PurchasedDate = e["PurchasedDate"].ToString(),
                        WriteOffDate = e["WriteOffDate"].ToString(),
                        ULDTypewiseCount = e["ULDTypewiseCount"].ToString(),
                        AverageLifeDays = e["AverageLifeDays"].ToString(),

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
