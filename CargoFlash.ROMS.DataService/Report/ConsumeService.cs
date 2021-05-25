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
    public class ConsumeService : SignatureAuthenticate, IConsumeService
    {
        public KeyValuePair<string, List<Consume>> GetConsumeRecord(string recordID, int page, int pageSize, ConsumeRequest model, string sort)
        {

            try
            {
                string rpt = model.rpt;
                string agt = model.agent;
                string air = model.airline;
                string citem = model.citem;
                //  whereCondition = "";
                model = null;



                Consume Consume = new Consume();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@OwnerType", rpt),
                                            new SqlParameter("@Agent",agt),
                                            new SqlParameter("@Airline", air),                                            
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                              new SqlParameter("@CItem", citem)

                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetConsumble", Parameters);
                var ConsumeList = ds.Tables[0].AsEnumerable().Select(e => new Consume
                {

                    Owner = Convert.ToString(e["Owner"].ToString()),
                    Item = Convert.ToString(e["item"].ToString()),
                    City = Convert.ToString(e["City"].ToString()),
                    Ownertype = Convert.ToString(e["OwnerType"].ToString()),
                    Consumble = Convert.ToString(e["Consumble"].ToString()),
                    ULDOut = Convert.ToString(e["ULDOut"].ToString()),
                    ULDStack = Convert.ToString(e["ULDStack"].ToString()),
                    BuildUp = Convert.ToString(e["BuildUp"].ToString()),
                    Balance = Convert.ToString(e["Balance"].ToString()),

                    Dt = Convert.ToString(e["Dt"].ToString())
                });
                return new KeyValuePair<string, List<Consume>>(ds.Tables[1].Rows[0][0].ToString(), ConsumeList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetConsumble"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<Consume> SearchData(Consume obj)
        {
            try
            {
                List<Consume> lst = new List<Consume>();





                SqlParameter[] Parameters = { 
                                            new SqlParameter("@OwnerType", obj.Rpt),
                                            new SqlParameter("@Agent",obj.Agt),
                                            new SqlParameter("@Airline", obj.Air),                                            
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                              new SqlParameter("@CItem", obj.CItem)
                                             
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetConsumble", Parameters);

                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new Consume
                    {
                        Owner = Convert.ToString(e["Owner"].ToString()),
                        Item = Convert.ToString(e["item"].ToString()),
                        City = Convert.ToString(e["City"].ToString()),
                        Ownertype = Convert.ToString(e["OwnerType"].ToString()),
                        Consumble = Convert.ToString(e["Consumble"].ToString()),
                        ULDOut = Convert.ToString(e["ULDOut"].ToString()),
                        ULDStack = Convert.ToString(e["ULDStack"].ToString()),
                        BuildUp = Convert.ToString(e["BuildUp"].ToString()),
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetConsumble"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


    }
}
