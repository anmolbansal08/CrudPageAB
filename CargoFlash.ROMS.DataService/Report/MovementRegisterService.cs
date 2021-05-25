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
    public class MovementRegisterService : SignatureAuthenticate, IMovementRegisterService
    {
        public KeyValuePair<string, List<MovementRegister>> GetMovementImportRegisterRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string FromDt = whereCondition.Split('*')[0];
                string ToDt = whereCondition.Split('*')[1];
                string reporttype = whereCondition.Split('*')[2];
                string ISRFS = whereCondition.Split('*')[3];

                DateTime frdt, todt;

                whereCondition = "";

                String tdt = "01/01/1900";
                if (FromDt == "")
                {

                    frdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    frdt = Convert.ToDateTime(FromDt);
                }


                if (ToDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(ToDt);
                }




                MovementRegister MovementRegister = new MovementRegister();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDate",frdt),
                                            new SqlParameter("@ToDate",todt),
                                              new SqlParameter("@IsRFS",ISRFS),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetImportMovementRegister", Parameters);

                var MovementRegisterList = ds.Tables[0].AsEnumerable().Select(e => new MovementRegister
                {
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    ATA = Convert.ToString(e["ATA"].ToString()),
                    MovementNo = Convert.ToString(e["MovementNo"].ToString()),
                    MovementDate = Convert.ToString(e["MvtReceiveDate"].ToString()),
                    RFS = Convert.ToString(e["IsRFS"].ToString()),
                    Origin = Convert.ToString(e["Origin"].ToString()),
                    AWB = Convert.ToString(e["AWB"].ToString()),
                    CRP = Convert.ToString(e["CRP"].ToString()),
                    ULD = Convert.ToString(e["ULD"].ToString()),
                    DPY = Convert.ToString(e["DPY"].ToString()),
                    Pieces = Convert.ToString(e["Pieces"].ToString()),
                    ArivedWt = Convert.ToString(e["ArivedWt"].ToString()),
                    CargoWt = Convert.ToString(e["CargoWt"].ToString()),
                    Agent = Convert.ToString(e["Agent"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString())
                });



                return new KeyValuePair<string, List<MovementRegister>>(ds.Tables[1].Rows[0][0].ToString(), MovementRegisterList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetImportMovementRegister"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<MovementRegister> SearchImportData(MovementRegister obj)
        {
            try
            {
                List<MovementRegister> lst = new List<MovementRegister>();






                DateTime frdt, todt;

                String tdt = "01/01/1900";
                if (obj.FromDt == "")
                {

                    frdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    frdt = Convert.ToDateTime(obj.FromDt);
                }


                if (obj.ToDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(obj.ToDt);
                }




                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDate",frdt),
                                            new SqlParameter("@ToDate",todt),
                                            new SqlParameter("@IsRFS",obj.ISRFS),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };




                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetImportMovementRegister", Parameters);

                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new MovementRegister
                    {
                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        ATA = Convert.ToString(e["ATA"].ToString()),
                        MovementNo = Convert.ToString(e["MovementNo"].ToString()),
                        MovementDate = Convert.ToString(e["MvtReceiveDate"].ToString()),
                        RFS = Convert.ToString(e["IsRFS"].ToString()),
                        Origin = Convert.ToString(e["Origin"].ToString()),
                        AWB = Convert.ToString(e["AWB"].ToString()),
                        CRP = Convert.ToString(e["CRP"].ToString()),
                        ULD = Convert.ToString(e["ULD"].ToString()),
                        DPY = Convert.ToString(e["DPY"].ToString()),
                        Pieces = Convert.ToString(e["Pieces"].ToString()),
                        ArivedWt = Convert.ToString(e["ArivedWt"].ToString()),
                        CargoWt = Convert.ToString(e["CargoWt"].ToString()),
                        Agent = Convert.ToString(e["Agent"].ToString()),
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetImportMovementRegister"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }



        public KeyValuePair<string, List<MovementRegister>> GetMovementExportRegisterRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                string FromDt = whereCondition.Split('*')[0];
                string ToDt = whereCondition.Split('*')[1];
                string reporttype = whereCondition.Split('*')[2];
                string ISRFS = whereCondition.Split('*')[3];

                DateTime frdt, todt;

                whereCondition = "";

                String tdt = "01/01/1900";
                if (FromDt == "")
                {

                    frdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    frdt = Convert.ToDateTime(FromDt);
                }


                if (ToDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(ToDt);
                }



                MovementRegister MovementRegister = new MovementRegister();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDate",frdt),
                                            new SqlParameter("@ToDate",todt),
                                              new SqlParameter("@IsRFS",ISRFS),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetExportMovementRegister", Parameters);

                var MovementRegisterList = ds.Tables[0].AsEnumerable().Select(e => new MovementRegister
                {
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    FlightStatus = Convert.ToString(e["FlightStatus"].ToString()),
                    MnfPc = Convert.ToString(e["MnfPieces"].ToString()),
                    MnfWt = Convert.ToString(e["MnfWt"].ToString()),
                    RFS = Convert.ToString(e["ISRFS"].ToString()),
                    OffPc = Convert.ToString(e["OffPieces"].ToString()),
                    OffWt = Convert.ToString(e["OffWt"].ToString()),
                    LBdPc = Convert.ToString(e["LBDPc"].ToString()),
                    CGOWt = Convert.ToString(e["CGOWt"].ToString()),
                    UpliftPc = Convert.ToString(e["UpliftPieces"].ToString()),
                    UpliftWt = Convert.ToString(e["UpliftWt"].ToString()),
                    AWB = Convert.ToString(e["AWB"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString())


                });



                return new KeyValuePair<string, List<MovementRegister>>(ds.Tables[1].Rows[0][0].ToString(), MovementRegisterList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetExportMovementRegister"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<MovementRegister> SearchExportData(MovementRegister obj)
        {
            try
            {
                List<MovementRegister> lst = new List<MovementRegister>();






                DateTime frdt, todt;

                String tdt = "01/01/1900";
                if (obj.FromDt == "")
                {

                    frdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    frdt = Convert.ToDateTime(obj.FromDt);
                }


                if (obj.ToDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(obj.ToDt);
                }




                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDate",frdt),
                                            new SqlParameter("@ToDate",todt),
                                            new SqlParameter("@IsRFS",obj.ISRFS),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };




                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetExportMovementRegister", Parameters);

                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new MovementRegister
                    {
                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        FlightStatus = Convert.ToString(e["FlightStatus"].ToString()),
                        MnfPc = Convert.ToString(e["MnfPieces"].ToString()),
                        MnfWt = Convert.ToString(e["MnfWt"].ToString()),
                        RFS = Convert.ToString(e["ISRFS"].ToString()),
                        OffPc = Convert.ToString(e["OffPieces"].ToString()),
                        OffWt = Convert.ToString(e["OffWt"].ToString()),
                        LBdPc = Convert.ToString(e["LBDPc"].ToString()),
                        CGOWt = Convert.ToString(e["CGOWt"].ToString()),
                        UpliftPc = Convert.ToString(e["UpliftPieces"].ToString()),
                        UpliftWt = Convert.ToString(e["UpliftWt"].ToString()),
                        AWB = Convert.ToString(e["AWB"].ToString()),
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetExportMovementRegister"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


    }
}
