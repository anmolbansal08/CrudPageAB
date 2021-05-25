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
    public class UWSPendingService : SignatureAuthenticate, IUWSPendingService
    {
        public KeyValuePair<string, List<UWSPending>> GetUWSPendingRecord(string recordID, int page, int pageSize, UWSPendingRequest model, string sort)
        {
            //string Equipment = whereCondition.Split('*')[0];
            //string Destination = whereCondition.Split('*')[1];
            //string Airline = whereCondition.Split('*')[2];
            //string FlightNumber = whereCondition.Split('*')[3];
            //string FlightDt = whereCondition.Split('*')[4];
            //string ULD = whereCondition.Split('*')[5];
            //string AwbNo = whereCondition.Split('*')[6];

            //DateTime todt;

           // whereCondition = "";



            //String tdt = "01/01/1900";
            //if (FlightDt == "")
            //{

            //    todt = Convert.ToDateTime(tdt);
            //}
            //else
            //{
            //    todt = Convert.ToDateTime(FlightDt);
            //}



            try
            {
                UWSPending UWSPending = new UWSPending();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@Equipment",model.Equipment),
                                            new SqlParameter("@Destination",model.Destination),
                                               new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                   new SqlParameter("@Airline",model.Airline),
                                              new SqlParameter("@FlightNo",model.FlightNumber),
                                               new SqlParameter("@FlightDt",model.FlightDt),
                                                new SqlParameter("@ULD",model.ULD),
                                                new SqlParameter("@AwbNo",model.AwbNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUWSPending", Parameters);
                var UWSPendingList = ds.Tables[0].AsEnumerable().Select(e => new UWSPending
                {

                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    Load = Convert.ToString(e["Text_LoadType"].ToString()),
                    EquipmentNo = Convert.ToString(e["EquipmentNo"].ToString()),
                    Issued = Convert.ToString(e["issued"].ToString()),
                    ULDNo = Convert.ToString(e["Shipment"].ToString()),
                    Origin = Convert.ToString(e["OriginCode"].ToString()),
                    Destination = Convert.ToString(e["DestinationCode"].ToString()),
                    Process = Convert.ToString(e["Process"].ToString()),
                    ScaleWt = Convert.ToString(e["ScaleWeight"].ToString()),
                    TareWt = Convert.ToString(e["TareWeight"].ToString()),
                    TotalWt = Convert.ToString(e["TotalShipWeight"].ToString()),
                    NetWt = Convert.ToString(e["NetWeight"].ToString()),
                    Variance = Convert.ToString(e["Variance"].ToString()),
                    Manual = Convert.ToString(e["Manual"].ToString()),
                    Remark = Convert.ToString(e["Remarks"].ToString()),
                    SHC = Convert.ToString(e["SHC"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString()),
                    AwbNo = Convert.ToString(e["AWBNo"].ToString())
                });
                return new KeyValuePair<string, List<UWSPending>>(ds.Tables[1].Rows[0][0].ToString(), UWSPendingList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetUWSPending"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<UWSPending> SearchData(UWSPending obj)
        {
            try
            {
                List<UWSPending> lst = new List<UWSPending>();
         

                DateTime todt;

                String tdt = "01/01/1900";
                if (obj.FlightDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(obj.FlightDt);
                }


                SqlParameter[] Parameters = { 
                                                new SqlParameter("@Equipment",obj.Equipment),
                                                new SqlParameter("@Destination",obj.DestCode),  
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                             new SqlParameter("@Airline",obj.Airline),
                                              new SqlParameter("@FlightNo",obj.FlightNumber),
                                               new SqlParameter("@FlightDt",todt),
                                                new SqlParameter("@ULD",obj.ULD),
                                                 new SqlParameter("@AwbNo",obj.AwbNo)
                                            };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUWSPending", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new UWSPending
                    {

                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        Load = Convert.ToString(e["Text_LoadType"].ToString()),
                        EquipmentNo = Convert.ToString(e["EquipmentNo"].ToString()),
                        Issued = Convert.ToString(e["issued"].ToString()),
                        ULDNo = Convert.ToString(e["Shipment"].ToString()),
                        Origin = Convert.ToString(e["OriginCode"].ToString()),
                        Destination = Convert.ToString(e["DestinationCode"].ToString()),
                        Process = Convert.ToString(e["Process"].ToString()),
                        ScaleWt = Convert.ToString(e["ScaleWeight"].ToString()),
                        TareWt = Convert.ToString(e["TareWeight"].ToString()),
                        TotalWt = Convert.ToString(e["TotalShipWeight"].ToString()),
                        NetWt = Convert.ToString(e["NetWeight"].ToString()),
                        Variance = Convert.ToString(e["Variance"].ToString()),
                        Manual = Convert.ToString(e["Manual"].ToString()),
                        Remark = Convert.ToString(e["Remarks"].ToString()),
                        SHC = Convert.ToString(e["SHC"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString()),
                        AwbNo = Convert.ToString(e["AWBNo"].ToString())
                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetUWSPending"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

    }
}
