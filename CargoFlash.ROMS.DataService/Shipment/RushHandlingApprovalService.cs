using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Export;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Reflection;
using ClosedXML;
using ClosedXML.Excel;
using Microsoft.Office.Interop.Excel;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RushHandlingApprovalService : BaseWebUISecureObject, IRushHandlingApprovalService
        {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RushHandlindlingApprovalGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRushHandlindlingApproval", Parameters);
                var TaxRateList = ds.Tables[0].AsEnumerable().Select(e => new RushHandlindlingApprovalGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]).ToUpper(),
                    Origin = Convert.ToString(e["Origin"]).ToUpper(),
                    Destination = Convert.ToString(e["Destination"]).ToUpper(),
                    ApproveStatus = Convert.ToString(e["ApproveStatus"]).ToUpper(),
                    //Convert.ToDecimal(FormElement["Rate"] == "" ? "0" : FormElement["Rate"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    Grossweight = Convert.ToDecimal(e["Grossweight"]),
                    Chargeableweight = Convert.ToDecimal(e["Chargeableweight"]),
                    Requestedby = Convert.ToString(e["Requestedby"]).ToUpper(),
                    Approvedby = Convert.ToString(e["Approvedby"]).ToUpper(),
                   

                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TaxRateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetRushHandlingApprovalRecord(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBSNo",SNo)                                            
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_GetRushHandlingAppravalRecord", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_GetRushHandlingAppravalRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string UpdateRushHandlingApproval(int SNo, List<SaveRushHandlingApproval> SaveRush)
        {
            DataSet ds = new DataSet();
            try
            {
                int ret = 0;
                System.Data.DataTable DtCCA = CollectionHelper.ConvertTo(SaveRush, "");
                //var Approve = string.Join(",", ApproveType);

                SqlParameter[] Parameters = { 
                                            
                                            new SqlParameter("@RUSHTable", SqlDbType.Structured){Value=DtCCA} ,
                                         
                                            new SqlParameter("@UserSno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                            
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRush_saveRushHandlingApproval", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spRush_saveRushHandlingApproval"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
        }
    }
}
