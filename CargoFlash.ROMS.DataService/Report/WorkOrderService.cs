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
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Report
{
    #region Work Order Service Description
    /*
	*****************************************************************************
	Service Name:	    WorkOrderService      
	Purpose:		    This Service used to get details of Work Order
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    05 Feb 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class WorkOrderService : SignatureAuthenticate, IWorkOrderService
    {
        public DataSourceResult GetGridData(string Type, string AgentAirline, string FlightNo, string FlightDate, string AWB, string AWBType, string ULD, string SLI, string AgentAirlineName, string AWBNo, string ULDNo, string SLINo, string FromDate, string ToDate, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                var Agent = "";
                var Airline = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                if (Type == "0")
                {
                    Agent = AgentAirline;

                }
                if (Type == "1")
                {
                    Airline = AgentAirline;

                }

                String tdt = "01/01/1900";
                DateTime fdt;
                DateTime todt;

                if (FromDate == "")
                {

                    fdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    fdt = Convert.ToDateTime(FromDate);
                }

                if (ToDate == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(ToDate);
                }


                //,/*For Multicity*/ new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()), new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString())

                string filters = GridFilter.ProcessFilters<WorkOrder>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@Agent", Agent), 
                                            new SqlParameter("@Airline", Airline), 
                                            new SqlParameter("@FlightNo", FlightNo),
                                            //new SqlParameter("@FlightDate", FlightDate),
                                            new SqlParameter("@AWB", AWB),
                                            new SqlParameter("@AWBType", AWBType),
                                            new SqlParameter("@ULD", ULD),
                                            new SqlParameter("@SLI", SLI),
                                            new SqlParameter("@FromDate", fdt),
                                            new SqlParameter("@ToDate", todt),
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize),
                                            //new SqlParameter("@WhereCondition",""),
                                            new SqlParameter("@WhereCondition", (filters!=string.Empty?(FlightDate != string.Empty ? filters+" AND "+"FlightDate='" + FlightDate + "'" : filters):(FlightDate != string.Empty ? "FlightDate='" + FlightDate + "'" : string.Empty))), 
                                            new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListWorkOrder", Parameters);
                var WorkOrderList = ds.Tables[0].AsEnumerable().Select(e => new WorkOrder
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AWBNo = e["AWBNo"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    SLINo = e["SLINo"].ToString(),
                    FlightNo1 = e["FlightNo1"].ToString(),
                    InvoiceNo = e["InvoiceNo"].ToString(),
                    DoNo = (e["DoNo"].ToString() == "0" ? "" : e["DoNo"].ToString()),
                    DOSNo = Convert.ToInt32(e["DOSNo"]),
                    //  InvoiceDate = Convert.ToDateTime(e["InvoiceDate"].ToString()),
                    InvoiceDate = e["InvoiceDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["InvoiceDate"]), DateTimeKind.Utc),
                    TotalAmount = e["TotalAmount"].ToString(),
                    RoundOffAmount = e["RoundOffAmount"].ToString(),
                    BalanceReceivable = e["BalanceReceivable"].ToString(),
                    GrandTotal = e["GrandTotal"].ToString(),
                    TotalReceivable = e["TotalReceivable"].ToString(),
                    // CreatedOn = Convert.ToDateTime(e["CreatedOn"].ToString()),
                    CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    ProcessName = e["ProcessName"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = WorkOrderList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = "GetListWorkOrder"
                };
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetListWorkOrder"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public string WorkOrderTable(Int32 SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "WorkOrderGetRecord", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","WorkOrderGetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public string GetWorkOrderPrintRecord(string InvoiceSNo, string UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", InvoiceSNo),
                                        new SqlParameter("@UserSNo", UserSNo)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetWorkOrderPrintRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetWorkOrderPrintRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}
