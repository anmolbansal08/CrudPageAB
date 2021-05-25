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
    public class CargoRankingService : SignatureAuthenticate, ICargoRankingService
    {
        public KeyValuePair<string, List<CargoRanking>> GetCargoRankingRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try
            {
                string FDt = whereCondition.Split('*')[0];
                string TDt = whereCondition.Split('*')[1];

                whereCondition = "";

                CargoRanking CargoRanking = new CargoRanking();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", Convert.ToDateTime(FDt)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(TDt)),
                                               new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            
                                            //,
                                            //new SqlParameter("@PageNo", page), 
                                            //new SqlParameter("@PageSize", pageSize), 
                                            //new SqlParameter("@WhereCondition", whereCondition), 
                                            //new SqlParameter("@OrderBy", sort) 
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentCargoRanking", Parameters);
                var CargoRankingList = ds.Tables[0].AsEnumerable().Select(e => new CargoRanking
                {
                    AgentCode = Convert.ToString(e["AgentCode"].ToString()),
                    Agent = Convert.ToString(e["Agent"].ToString()),
                    Export = Convert.ToString(e["Export"].ToString()),

                    ERank = Convert.ToString(e["ERank"].ToString()),

                    Import = Convert.ToString(e["Import"].ToString()),
                    IRank = Convert.ToString(e["IRank"].ToString()),
                    Total = Convert.ToString(e["Total"].ToString()),
                    Rank = Convert.ToString(e["TRank"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString())
                });
                return new KeyValuePair<string, List<CargoRanking>>(ds.Tables[1].Rows[0][0].ToString(), CargoRankingList.AsQueryable().ToList());

            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetAgentCargoRanking"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<CargoRanking> SearchData(CargoRanking obj)
        {
            try
            {
                List<CargoRanking> lst = new List<CargoRanking>();


                SqlParameter[] Parameters = { new SqlParameter("@FromDt", Convert.ToDateTime(obj.FromDate)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(obj.ToDate)),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentCargoRanking", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new CargoRanking
                    {

                        AgentCode = Convert.ToString(e["AgentCode"].ToString()),
                        Agent = Convert.ToString(e["Agent"].ToString()),
                        Export = Convert.ToString(e["Export"].ToString()),
                        ERank = Convert.ToString(e["ERank"].ToString()),
                        Import = Convert.ToString(e["Import"].ToString()),
                        IRank = Convert.ToString(e["IRank"].ToString()),
                        Total = Convert.ToString(e["Total"].ToString()),
                        Rank = Convert.ToString(e["TRank"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString())
                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetAgentCargoRanking"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

    }
}
