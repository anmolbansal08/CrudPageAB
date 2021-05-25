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
    public class IrregularityFlightReportService : BaseWebUISecureObject, IIrregularityFlightReportService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string ULDNo = "", string CreatedOn = "")
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

        public KeyValuePair<string, List<IrregularityFlightReport>> GetIrregularityFlightReportRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            { 
            IrregularityFlightReport IrregularityFlightReport = new IrregularityFlightReport();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@DailyFlightSNo", recordID)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityFlightReportRecord", Parameters);

            if (ds.Tables[0].Rows.Count != 0)
            {
                var IrregularityFlightReportList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityFlightReport
                {
                    SNo = Convert.ToInt32(e["IRRSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    TotalPieces = e["TotalPieces"].ToString(),
                    TotalGrossWeight = e["TotalGrossWeight"].ToString(),
                    Irrpieces = e["Irrpieces"].ToString(),
                    IrrWeight = e["IrrWeight"].ToString(),
                    Description = e["Description"].ToString(),
                    Action = e["Action"].ToString()

                    //FlightNo = e["FlightNo"].ToString(),
                    //FlightDate = e["FlightDate"].ToString(),
                    //OriginAirportCode = e["OriginAirportCode"].ToString(),
                    //DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                    //Commodities = e["Commodities"].ToString(),
                    
                });
                return new KeyValuePair<string, List<IrregularityFlightReport>>(ds.Tables[0].Rows[0][0].ToString(), IrregularityFlightReportList.AsQueryable().ToList());
            
            }
            var abc = ds.Tables[0].AsEnumerable().Select(e => new IrregularityFlightReport
            {
                SNo = Convert.ToInt32(e["SNo"])
            });
            return new KeyValuePair<string, List<IrregularityFlightReport>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
           }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string GetPrintData(int DailyFlightSNo)
        {
            try
            { 
            SqlParameter[] Parameters = {
                                          new SqlParameter("@DailyFlightSNo", DailyFlightSNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityFlightReportRecord", Parameters);
            ds.Dispose();

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
