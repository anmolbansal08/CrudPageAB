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
    public class ULDOutService : SignatureAuthenticate, IULDOutService
    {
        public KeyValuePair<string, List<ULDOut>> GetULDOutRecord(string recordID, int page, int pageSize, ULDOutRequest model, string sort)
        {
            try 
            { 
            string FDt   = model.FDate;
            string TDt   = model.TDate;
            string Issue = model.Issue;
            string ULD   = model.ULD;
            string UCR   = model.UCR;
            string Recd  = model.Recd;

            model =null;

            String tdt = "01/01/1900";
            DateTime fdt;
            DateTime todt;

            if (FDt == "")
            {

                fdt = Convert.ToDateTime(tdt);
            }
            else
            {
                fdt = Convert.ToDateTime(FDt);
            }

            if (TDt == "")
            {

                todt = Convert.ToDateTime(tdt);
            }
            else
            {
                todt = Convert.ToDateTime(TDt);
            }

            int i = 0;
            if (Issue == "")
            {
                i = -1;
            }
            else
            {
                i = Convert.ToInt32(Issue);
            }

            int u = 0;
            if (ULD == "")
            {
                u = 0;
            }
            else
            {
                u = Convert.ToInt32(ULD);
            }


          
            ULDOut ULDOut = new ULDOut();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@ULDsno", u),
                                            new SqlParameter("@Issue", i),
                                            new SqlParameter("@FromDt", fdt),
                                            new SqlParameter("@ToDt", todt) ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                              new SqlParameter("@UCR", UCR),
                                              new SqlParameter("@RecdSno", Recd)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDOut", Parameters);
            var ULDOutList = ds.Tables[0].AsEnumerable().Select(e => new ULDOut
            {

                ULDNo = Convert.ToString(e["ULDNo"].ToString()),
                IssuanceDate = Convert.ToString(e["IssuanceDate"].ToString()),
                UCRReceiptNo = Convert.ToString(e["UCRReceiptNo"].ToString()),
                Destination = Convert.ToString(e["Destination"].ToString()),
                UserName = Convert.ToString(e["UserName"].ToString()),
                TransfredBy = Convert.ToString(e["TransfredBy"].ToString()),
                ReceivedBy = Convert.ToString(e["RecivedBy"].ToString()),
                IssuedTo = Convert.ToString(e["IssuedTo"].ToString()),
                Dt = Convert.ToString(e["Dt"].ToString()),
                Remarks = Convert.ToString(e["Remarks"].ToString()),
                Amount = Convert.ToString(e["Amount"].ToString()),
            });
            return new KeyValuePair<string, List<ULDOut>>(ds.Tables[1].Rows[0][0].ToString(), ULDOutList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetULDOut"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            }


        public List<ULDOut> SearchData(ULDOut obj)
        {
            try
            {
                List<ULDOut> lst = new List<ULDOut>();
       

                String tdt = "01/01/1900";
                DateTime fdt;
                DateTime todt;

                if (obj.FromDt == "")
                {

                    fdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    fdt = Convert.ToDateTime(obj.FromDt);
                }

                if (obj.ToDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(obj.ToDt);
                }

                int i = 0;
                if (obj.Issue == "")
                {
                    i = -1;
                }
                else
                {
                    i = Convert.ToInt32(obj.Issue);
                }

                int u = 0;
                if (obj.ULD == "")
                {
                    u = 0;
                }
                else
                {
                    u = Convert.ToInt32(obj.ULD);
                }


                SqlParameter[] Parameters = { 
                                            new SqlParameter("@ULDsno", u),
                                            new SqlParameter("@Issue",i),
                                            new SqlParameter("@FromDt", fdt),
                                            new SqlParameter("@ToDt", todt) ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@UCR", obj.UCR),
                                              new SqlParameter("@RecdSno", obj.Recd)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDOut", Parameters);

                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ULDOut
                    {
                        ULDNo = Convert.ToString(e["ULDNo"].ToString()),
                        IssuanceDate = Convert.ToString(e["IssuanceDate"].ToString()),
                        UCRReceiptNo = Convert.ToString(e["UCRReceiptNo"].ToString()),
                        Destination = Convert.ToString(e["Destination"].ToString()),
                        UserName = Convert.ToString(e["UserName"].ToString()),
                        TransfredBy = Convert.ToString(e["TransfredBy"].ToString()),
                        ReceivedBy = Convert.ToString(e["RecivedBy"].ToString()),
                        IssuedTo = Convert.ToString(e["IssuedTo"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString()),
                        Remarks = Convert.ToString(e["Remarks"].ToString()),
                        Amount = Convert.ToString(e["Amount"].ToString()),
                      
                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetULDOut"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


    }
}
