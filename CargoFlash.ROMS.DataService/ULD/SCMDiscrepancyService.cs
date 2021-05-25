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
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SCMDiscrepancyService : SignatureAuthenticate, ISCMDiscrepancyService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<SCMDiscrepancy>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GETSCMDiscrepancy", Parameters);
                var IrrList = ds.Tables[0].AsEnumerable().Select(e => new SCMDiscrepancy
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Airport = e["Airport"].ToString().ToUpper(),
                    ScmDate = e["ScmDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ScmDate"]), DateTimeKind.Utc),
                    ReqULDs = e["ReqULDs"].ToString().ToUpper(),
                    ProULDs = e["ProULDs"].ToString().ToUpper(),
                    DisULDs = e["DisULDs"].ToString().ToUpper(),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    Remarks = e["Remarks"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = IrrList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string ScmiscrepancyReportDetail(int scmdiscrepancysno)
        {
            try
            {
                SqlParameter[] Parameters = {   new SqlParameter("@scmdiscrepancysno",scmdiscrepancysno),                                    
                                          };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetScmiscrepancy_DetailsHeader", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ScmiCiscrepancytUpdate(string id, string Type)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@id", id), new SqlParameter("@Type", Type) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUpdateSCMRemarks", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ScmUldDetail(string ULDnumber)
        {
            try
            {
                SqlParameter[] Parameters = {   new SqlParameter("@ULDnumber",ULDnumber),       
                                                 new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                          };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetScmULd_Details", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string reexecuteEdiScm(string EdiScmID)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@EdiScmID", EdiScmID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpReexecuteEdi_Scm", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<SCMDiscrepancy>> GetScmiscrepancyReportDetail(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                string[] tokens = whereCondition.Split('-');
                var remarks = tokens[0];
                var uldno = tokens[1];
              
                SqlParameter[] Parameters = { new SqlParameter("@scmdiscrepancysno", recordID)
                                            , new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@remarks", remarks),new SqlParameter("@uldno", uldno)
                                            , new SqlParameter("@OrderBy", sort)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetScmiscrepancy_DetailsPage", Parameters);
                var SCMDiscrepancys = ds.Tables[0].AsEnumerable().Select(e => new SCMDiscrepancy
                {

                    SNo = Convert.ToInt32(e["SNo"]),
                    currentinventory = e["CurrentInventory"].ToString(),
                    ReqULDs = e["ReqULD"].ToString(),
                    ProULDs = e["ProULD"].ToString(),
                    DisULDs = e["DisULD"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    scmstatus = e["SCMStatus"].ToString(),
                    EDI_SCMSno = e["EDI_SCMSno"].ToString(),
                    IsClosedDiscrepancy = e["IsClosedDiscrepancy"].ToString(),



                });
                return new KeyValuePair<string, List<SCMDiscrepancy>>(ds.Tables[1].Rows[0][0].ToString(), SCMDiscrepancys.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }



    }
}
