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
using CargoFlash.Cargo.Model.ULD;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class ULDRepairSLAReportService : SignatureAuthenticate, IULDRepairSLAReportService
    {

        public string ReportSLA(string FromDate, string ToDate, string ULDSNo, string AirlineName)
        {
            try 
            { 
            SqlParameter[] Parameters = {   new SqlParameter("@FromDt",FromDate),
                                             new SqlParameter("@ToDt",ToDate),
                                              new SqlParameter("@ULDSNo", ULDSNo),
                                               new SqlParameter("@AirlineName", AirlineName),

                                            };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDSLARepairReport", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //public List<ULDRepairSLAReport> newFunc(ULDRepairSLAReport obj)
        //{
        //    try
        //    {
        //        List<ULDRepairSLAReport> lst = new List<ULDRepairSLAReport>();

        //        SqlParameter[] Parameters = { new SqlParameter("@ULDSno",System.Web.HttpContext.Current.Session["ULDSno"]),
        //                                        new SqlParameter("@FromDt",  System.Web.HttpContext.Current.Session["FromDate"]),
        //                                    new SqlParameter("@ToDt", System.Web.HttpContext.Current.Session["ToDate"]),
        //                                    new  SqlParameter("@AirlineName",System.Web.HttpContext.Current.Session["AirlineName"] ),
        //                                    };
        //        string procname = "GetULDSLARepairReport";
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, procname, Parameters);
        //        if (ds != null && ds.Tables.Count > 0)
        //            lst = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairSLAReport
        //            {
        //                ULDNo = Convert.ToString(e["ULDNo"]),
        //                RepairRequest = Convert.ToString(e["RepairRequest"]),
        //                CostApproval = Convert.ToString(e["CostApproval"]),
        //                MaintananceType = Convert.ToString(e["MaintananceType"]),
        //                Return = Convert.ToString(e["Return"]),
        //                Invoice = Convert.ToString(e["Invoice"]),
        //                CostApprovalSLA = Convert.ToString(e["CostApprovalSLA"]),
        //                ReturnSLA = Convert.ToString(e["ReturnSLA"]),
        //                InvoiceSLA = Convert.ToString(e["InvoiceSLA"]),
                       
        //            }).ToList();
        //        return lst;
        //        System.Web.HttpContext.Current.Session.Abandon();
        //        System.Web.HttpContext.Current.Session.Abandon();
        //        System.Web.HttpContext.Current.Session.Abandon();
        //        System.Web.HttpContext.Current.Session.Remove("ULDSno");
        //        System.Web.HttpContext.Current.Session.Remove("FromDate");
        //        System.Web.HttpContext.Current.Session.Remove("ToDate");
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}


    }
}
