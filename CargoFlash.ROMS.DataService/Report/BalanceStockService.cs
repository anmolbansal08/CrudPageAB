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
    public class BalanceStockService : SignatureAuthenticate, IBalanceStockService
    {
        public KeyValuePair<string, List<BalanceStock>> GetBalanceStockRecord(string recordID, int page, int pageSize, BalanceStockRequest model, string sort)
        {
            try
            {
                string rpt = model.rpt;
                string agt = model.agent;
                string air = model.airline;

                model = null;



                Consume Consume = new Consume();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@OwnerType", rpt),
                                            new SqlParameter("@Agent",agt),
                                            new SqlParameter("@Airline", air),                                            
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBalanceStock", Parameters);
                var BalanceStockList = ds.Tables[0].AsEnumerable().Select(e => new BalanceStock
                {

                    Owner = Convert.ToString(e["Owner"].ToString()),
                    Item = Convert.ToString(e["item"].ToString()),
                    City = Convert.ToString(e["City"].ToString()),
                    Ownertype = Convert.ToString(e["OwnerType"].ToString()),
                    Consumble = Convert.ToString(e["Consumble"].ToString()),
                    Utilized = Convert.ToString(e["Utilized"].ToString()),
                    Balance = Convert.ToString(e["Balance"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString())
                });
                return new KeyValuePair<string, List<BalanceStock>>(ds.Tables[1].Rows[0][0].ToString(), BalanceStockList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetBalanceStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<BalanceStock> SearchData(BalanceStock obj)
        {
            try
            {
                List<BalanceStock> lst = new List<BalanceStock>();





                SqlParameter[] Parameters = { 
                                            new SqlParameter("@OwnerType", obj.Rpt),
                                            new SqlParameter("@Agent",obj.Agt),
                                            new SqlParameter("@Airline", obj.Air),                                            
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                             
                                             
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBalanceStock", Parameters);

                if (ds.Tables != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new BalanceStock
                    {
                        Owner = Convert.ToString(e["Owner"].ToString()),
                        Item = Convert.ToString(e["item"].ToString()),
                        City = Convert.ToString(e["City"].ToString()),
                        Ownertype = Convert.ToString(e["OwnerType"].ToString()),
                        Consumble = Convert.ToString(e["Consumble"].ToString()),
                        Utilized = Convert.ToString(e["Utilized"].ToString()),
                        Balance = Convert.ToString(e["Balance"].ToString()),

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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetBalanceStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


    }
}
