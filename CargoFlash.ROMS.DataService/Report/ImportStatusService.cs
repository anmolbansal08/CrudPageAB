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
    public class ImportStatusService : SignatureAuthenticate, IImportStatusService
    {
        public KeyValuePair<string, List<ImportStatus>> GetImportStatusRecord(string recordID, int page, int pageSize, ImportStatusRequest model, string sort)
        {
            try
            {

                string FromDate = model.FromDate;
                string ToDate = model.ToDate;

                DateTime todt;
                DateTime fromdt;

                model = null;

                String tdt = "01/01/1900";
                if (FromDate == "")
                {

                    fromdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    fromdt = Convert.ToDateTime(FromDate);
                }

                if (ToDate == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(ToDate);
                }



                ImportStatus ImportStatus = new ImportStatus();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@Fromdt",fromdt),
                                            new SqlParameter("@Todt",todt),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetImportStatus", Parameters);
                var ImportStatusList = ds.Tables[0].AsEnumerable().Select(e => new ImportStatus
                {

                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    ETA = Convert.ToString(e["ETA"].ToString()),
                    ATA = Convert.ToString(e["ATA"].ToString()),
                    NILArrived = Convert.ToString(e["NILArrived"].ToString()),
                    FCCompleted = Convert.ToString(e["FCCompleted"].ToString()),
                    AWBCount = Convert.ToString(e["AWBCount"].ToString()),
                    FWBCount = Convert.ToString(e["FWBCount"].ToString()),
                    FWBCreatedOn = Convert.ToString(e["FWBCreatedOn"].ToString()),
                    FHLCreatedOn = Convert.ToString(e["FHLCreatedOn"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString())
                });
                return new KeyValuePair<string, List<ImportStatus>>(ds.Tables[1].Rows[0][0].ToString(), ImportStatusList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetImportStatus"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<ImportStatus> SearchData(ImportStatus obj)
        {
            try
            {
                List<ImportStatus> lst = new List<ImportStatus>();
             


                DateTime fromdt;
                DateTime todt;

                String tdt = "01/01/1900";
                if (obj.FromDate == "")
                {

                    fromdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    fromdt = Convert.ToDateTime(obj.FromDate);
                }


                if (obj.ToDate == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(obj.ToDate);
                }



                SqlParameter[] Parameters = { 
                                            new SqlParameter("@Fromdt",fromdt),
                                                  new SqlParameter("@Todt",todt),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetImportStatus", Parameters);

                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ImportStatus
                    {
                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        ETA = Convert.ToString(e["ETA"].ToString()),
                        ATA = Convert.ToString(e["ATA"].ToString()),
                        NILArrived = Convert.ToString(e["NILArrived"].ToString()),
                        FCCompleted = Convert.ToString(e["FCCompleted"].ToString()),
                        AWBCount = Convert.ToString(e["AWBCount"].ToString()),
                        FWBCount = Convert.ToString(e["FWBCount"].ToString()),
                        FWBCreatedOn = Convert.ToString(e["FWBCreatedOn"].ToString()),
                        FHLCreatedOn = Convert.ToString(e["FHLCreatedOn"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString()) 
     
                    }).ToList();



                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }

        }

    }
}
