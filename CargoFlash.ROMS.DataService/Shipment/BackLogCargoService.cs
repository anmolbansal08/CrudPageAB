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
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.DataService.Common;

using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.IO;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class BackLogCargoService : SignatureAuthenticate, IBackLogCargoService
    {
        public KeyValuePair<string, List<BackLogCargo>> GetBackLogCargoRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            string Airline = whereCondition.Split('*')[0];
            string Status = whereCondition.Split('*')[1];
            string Origin = whereCondition.Split('*')[2];
            string Destination = whereCondition.Split('*')[3];
            string SHC = whereCondition.Split('*')[4];
            string AWBNo = whereCondition.Split('*')[5];
            string ULD = whereCondition.Split('*')[6];
            string Dt = whereCondition.Split('*')[7];
            string Range = whereCondition.Split('*')[8];
            whereCondition = "";
            try
            {
                BackLogCargo BackLogCargo = new BackLogCargo();
                SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", Airline),
                                            new SqlParameter("@Status", Status),
                                            new SqlParameter("@Origin", Origin),
                                            new SqlParameter("@Destination", Destination),
                                            new SqlParameter("@SHC", SHC),
                                            new SqlParameter("@AWBNo", AWBNo),
                                            new SqlParameter("@ULD", ULD),
                                            new SqlParameter("@Dt", Dt),
                                            new SqlParameter("@Range", Range),
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", whereCondition),
                                            new SqlParameter("@OrderBy", sort),
                                            new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBackLogCargoRecord", Parameters);
                var BackLogCargoList = ds.Tables[0].AsEnumerable().Select(e => new BackLogCargo
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Airline = Convert.ToString(e["AirlineName"].ToString()),
                    Origin = Convert.ToString(e["OriginAirportCode"].ToString()),
                    Destination = Convert.ToString(e["DestinationAirportCode"].ToString()),
                    Station = Convert.ToString(e["Station"].ToString()),
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    //FlightDate = Convert.ToDateTime(e["FlightDate"]),
                    //FlightDate = Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd MMMM yyyy"),
                    FlightDate = e["FlightDate"] == DBNull.Value ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd-MMM-yyyy"),
                    AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                    Pieces = Convert.ToString(e["Pieces"].ToString()),
                    TotalPc = Convert.ToString(e["TotalPc"].ToString()),
                    LyingPc = Convert.ToString(e["LyingPc"].ToString()),
                    GrossWeight = Convert.ToString(e["GrossWeight"].ToString()),
                    VolumeWeight = Convert.ToString(e["VolumeWeight"].ToString()),
                    //ULD = Convert.ToString(e["ULD"].ToString()),
                    SHC = Convert.ToString(e["SPHC"].ToString()),
                    Status = Convert.ToString(e["Status"].ToString()),
                    ULD = Convert.ToString(e["ULDName"].ToString()),
                    OffloadSince = Convert.ToString(e["OffloadSince"].ToString()),
                    Diffdays = Convert.ToString(e["Diffdays"].ToString()),
                    SLI = Convert.ToString(e["SLI"].ToString()),
                    OffloadFrom = Convert.ToString(e["OffloadFrom"].ToString()),
                    NOG = Convert.ToString(e["NOG"].ToString())
                });
                return new KeyValuePair<string, List<BackLogCargo>>(ds.Tables[1].Rows[0][0].ToString(), BackLogCargoList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<BackLogCargo> SearchData(BackLogCargo obj)
        {
            try
            {
                List<BackLogCargo> lst = new List<BackLogCargo>();
         

                SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", obj.Airline),
                                            new SqlParameter("@Status", obj.Status),
                                            new SqlParameter("@Origin", obj.Origin),
                                            new SqlParameter("@Destination", obj.Destination),
                                            new SqlParameter("@SHC", obj.SHC),
                                            new SqlParameter("@AWBNo", obj.AWBNo),
                                            new SqlParameter("@ULD", obj.ULD),
                                            new SqlParameter("@Dt", obj.FlightDate),
                                             new SqlParameter("@Usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBackLogCargo", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new BackLogCargo
                    {
                        Airline = Convert.ToString(e["AirlineName"].ToString()),
                        Origin = Convert.ToString(e["OriginAirportCode"].ToString()),
                        Destination = Convert.ToString(e["DestinationAirportCode"].ToString()),
                        Station = Convert.ToString(e["Station"].ToString()),
                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),

                        FlightDate = e["FlightDate"] == DBNull.Value ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd-MMM-yyyy"),
                        AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                        Pieces = Convert.ToString(e["Pieces"].ToString()),
                        TotalPc = Convert.ToString(e["TotalPc"].ToString()),
                        LyingPc = Convert.ToString(e["LyingPc"].ToString()),
                        GrossWeight = Convert.ToString(e["GrossWeight"].ToString()),
                        VolumeWeight = Convert.ToString(e["VolumeWeight"].ToString()),
                        SHC = Convert.ToString(e["SPHC"].ToString()),
                        Status = Convert.ToString(e["Status"].ToString()),
                        ULD = Convert.ToString(e["ULDName"].ToString()),
                        OffloadSince = Convert.ToString(e["OffloadSince"].ToString()),
                        Diffdays = Convert.ToString(e["Diffdays"].ToString()),
                        SLI = Convert.ToString(e["SLI"].ToString()),
                        OffloadFrom = Convert.ToString(e["OffloadFrom"].ToString()),
                        NOG = Convert.ToString(e["NOG"].ToString())
                    }).ToList();
                return lst;
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public List<BackLogCargo> SendData(BackLogCargoMailModel obj)
        {
            try
            {
                List<BackLogCargo> lst = new List<BackLogCargo>();
          

                SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", obj.BackLogCargo.Airline),
                                            new SqlParameter("@Status", obj.BackLogCargo.Status),
                                            new SqlParameter("@Origin", obj.BackLogCargo.Origin),
                                            new SqlParameter("@Destination", obj.BackLogCargo.Destination),
                                            new SqlParameter("@SHC", obj.BackLogCargo.SHC),
                                            new SqlParameter("@AWBNo", obj.BackLogCargo.AWBNo),
                                            new SqlParameter("@ULD", obj.BackLogCargo.ULD),
                                            new SqlParameter("@Dt", obj.BackLogCargo.FlightDate),
                                          new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session ["UserDetail"])).UserSNo.ToString())
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBackLogCargoMail", Parameters);
                CommonService c = new CommonService();


                if (ds.Tables[0].Rows.Count > 0)
                {
                    string fileName = c.ExportDataSetToExcel(ds.Tables[0], "_LyingList.xls");

                    SqlParameter[] para = {
                                            new SqlParameter("@CarrierCode", obj.BackLogCargo.Airline),
                                            new SqlParameter("@Status", obj.BackLogCargo.Status),
                                            new SqlParameter("@Origin", obj.BackLogCargo.Origin),
                                            new SqlParameter("@Destination", obj.BackLogCargo.Destination),
                                            new SqlParameter("@SHC", obj.BackLogCargo.SHC),
                                            new SqlParameter("@AWBNo", obj.BackLogCargo.AWBNo),
                                            new SqlParameter("@ULD", obj.BackLogCargo.ULD),
                                            new SqlParameter("@Dt", obj.BackLogCargo.FlightDate),
                                            new SqlParameter("@FileName", fileName),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session ["UserDetail"])).UserSNo.ToString()),
                                            new  SqlParameter ("@MailTo", obj.MailTo),
                                            new  SqlParameter ("@Cc",obj.CC),
                                            new  SqlParameter ("@Subject", obj.Subject),
                                            new  SqlParameter ("@Content", obj.Content)
                                        };
                    DataSet ds1 = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "LyingListMail", para);
                }


                if (ds != null && ds.Tables.Count > 0)


                    lst = ds.Tables[0].AsEnumerable().Select(e => new BackLogCargo
                    {
                        //Airline = Convert.ToString(e["AirlineName"].ToString()),
                        //Origin = Convert.ToString(e["OriginAirportCode"].ToString()),
                        //Destination = Convert.ToString(e["DestinationAirportCode"].ToString()),
                        //FlightNo = Convert.ToString(e["FlightNo"].ToString()),

                        //FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        //AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                       // Pieces = Convert.ToString(e["Pieces"].ToString()),
                        //GrossWeight = Convert.ToString(e["GrossWeight"].ToString()),
                        //VolumeWeight = Convert.ToString(e["VolumeWeight"].ToString()),
                        //SHC = Convert.ToString(e["SPHC"].ToString()),
                        //Status = Convert.ToString(e["Status"].ToString()),
                        //ULD = Convert.ToString(e["ULDName"].ToString()),
                        //OffloadSince = Convert.ToDateTime(e["OffloadSince"].ToString()).ToString("dd MMMM yyyy"),
                        //Diffdays = Convert.ToString(e["Diffdays"].ToString()),
                      SLI = Convert.ToString(e["SLI"].ToString())
                    }).ToList();
                return lst;

            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }
        //public string SendMail(string MailTo, string Cc, string Subject, string Content)
        //{
        //    SqlParameter param = new SqlParameter();

        //    SqlParameter[] Parameters = { new SqlParameter("@MailTo", MailTo),    //new SqlParameter("@EmailAddress", EmailAddress), new SqlParameter("@UCMMessage", SCMMessage),
        //                                new SqlParameter("@Cc", Cc),
        //                                new SqlParameter("@Subject", Subject),
        //                                new SqlParameter("@Content", Content)
        //                                };
        //    string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SendMailLyingList", Parameters);
        //    return ret;
        //}

      public string deletefromoffload(List<deleteoffload> obj)
        {
            
                try
                {
                    List<string> ErrorMessage = new List<string>();
                  
                DataTable dtofflPieceInfo = CollectionHelper.ConvertTo(obj, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramoffldPieceInfo = new SqlParameter();
                paramoffldPieceInfo.ParameterName = "@offldPieceInfo";
                paramoffldPieceInfo.SqlDbType = System.Data.SqlDbType.Structured;
                paramoffldPieceInfo.Value = dtofflPieceInfo;
                          string Airpodecode = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString();
                           string NewTerminalName = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).NewTerminalName.ToString();
                              SqlParameter[] Parameters = {paramoffldPieceInfo,
                                new SqlParameter("@Airpodecode", Airpodecode),
                                  new SqlParameter("@TerName",NewTerminalName )
                
            };
                 
                                    string ret = Convert.ToString(SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "deletefromoffload", Parameters));
                                   return CargoFlash.Cargo.Business.Common.Base64ToString(ret);
            }
                catch (Exception ex)//
                {
                    throw ex;
                }
            }
        

    }
}
