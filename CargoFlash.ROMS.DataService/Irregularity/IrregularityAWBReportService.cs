using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Net;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class IrregularityAWBReportService : BaseWebUISecureObject, IIrregularityAWBReportService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string ULDNo = "", string CreatedOn = "")
        {
            try
            {
                this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
                StringBuilder myCurrentForm = new StringBuilder();
                switch (this.DisplayMode)
                {
                    case DisplayModeNew:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeSearch:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeDuplicate:

                        break;
                    case DisplayModeEdit:

                        break;
                    case DisplayModeDelete:

                        break;
                    case DisplayModeIndexView:
                        //switch (processName)
                        //{
                        //    case "ULDRepair":
                        //        if (appName.ToUpper().Trim() == "ULDREPAIR")
                        //            CreateGrid(myCurrentForm, processName, ULDNo, CreatedOn);
                        //        break;

                        //    default:
                        //        break;
                        //}
                        break;
                    case DisplayModeReadView:

                        break;
                    default:
                        break;
                }
                byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public string GetIrregularityAWBReportRecordhtml(string FromDate,string ToDate,string Type)
        {
            try
            {
                //IrregularityAWBReport IrregularityAWBReport = new IrregularityAWBReport();
                SqlParameter[] Parameters = {
                                           //new SqlParameter("@awbsno", AWBSNo),
                                           new SqlParameter("@FromDate", FromDate),
                                           new SqlParameter("@ToDate", ToDate),
                                           new SqlParameter("@Type", Type =="2"?"0":Type)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityAWBReportRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {

                throw ex;
            }
        }
        public KeyValuePair<string, List<IrregularityAWBReport>> GetIrregularityAWBReportRecord(string recid, int pageNo, int pageSize, IrregularityBindAppendGrid model, string sort)
        {
            try
            {
                IrregularityAWBReport IrregularityAWBReport = new IrregularityAWBReport();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@awbsno", recid),
                                           new SqlParameter("@Type", model.Type=="2"?"0":model.Type)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityAWBReportRecord", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    var IrregularityAWBReportList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityAWBReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        IncidentCategory = e["IncidentCategory"].ToString(),
                        ReportingStation = e["ReportingStation"].ToString(),
                        AWBNo = e["AWBNo"].ToString(),
                        IrregularityStatus = e["IrregularityStatus"].ToString(),
                        UpdatedUser = e["UpdatedUser"].ToString(),
                        CreatedUser = e["CreatedUser"].ToString(),
                        FlightNo = e["FlightNo"].ToString(),
                        FlightDate = e["FlightDate"].ToString(),
                        OriginAirportCode = e["OriginAirportCode"].ToString(),
                        DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                        Commodities = e["Commodities"].ToString(),
                        TotalPieces = e["TotalPieces"].ToString(),
                        TotalGrossWeight = e["TotalGrossWeight"].ToString()
                    });
                    return new KeyValuePair<string, List<IrregularityAWBReport>>(ds.Tables[0].Rows[0][0].ToString(), IrregularityAWBReportList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new IrregularityAWBReport
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<IrregularityAWBReport>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
    }
}
