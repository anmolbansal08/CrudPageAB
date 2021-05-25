using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Runtime.Serialization;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TrackingService : SignatureAuthenticate, ITrackingService
    {


        public string GetChoiceOfTracking(string recordID)
        {
            try
            {
                DataSet ds = null;
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", recordID) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChoiceOfTracking", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public Tracking GetTracking(string recordID, int Type, int TrackType, int AWBSNo, string TrackingType)
        {
            Tracking obj = new Tracking();

            DataSet ds = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", recordID),
                    new SqlParameter("@Type", Type),
                    new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    new SqlParameter("@TrackType", TrackType),
                    new SqlParameter("@AWBSNo", AWBSNo),
                    new SqlParameter("@TrackingType",TrackingType)};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spTracking", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow drwh = ds.Tables[0].Rows[0];

                        obj.SNo = Convert.ToInt32(drwh["Sno"]);
                        obj.AWB = drwh["AWBNo"].ToString();
                        obj.AWBSNo = drwh["AWBSNo"].ToString();
                        obj.AWBDate = drwh["AWBDate"].ToString();
                        obj.SLI = drwh["SLINo"].ToString();
                        obj.Origin = drwh["Origin"].ToString();
                        obj.Destination = drwh["Destination"].ToString();
                        obj.TotalPieces = drwh["TotalPieces"].ToString();
                        obj.GrossWt = drwh["GrossWeight"].ToString();
                        obj.Shipper = drwh["Shipper"].ToString();
                        obj.Consignee = drwh["Consignee"].ToString();
                        obj.SHC = drwh["SHC"].ToString();
                        obj.NatureOfGoods = drwh["NatureOfGoods"].ToString();
                        obj.HAWB = drwh["HAWBCount"].ToString();
                        obj.SLICustomerType = drwh["SLICustomerType"].ToString();
                        obj.BOE = drwh["BOE"].ToString() == "True" ? "Yes" : "No";
                        obj.IsImportAWB = drwh["IsImportAWB"].ToString();
                        obj.IsAgentBuildUp = drwh["IsAgentBuildUp"].ToString();
                        obj.OnHold = drwh["OnHold"].ToString();
                        obj.AcceptedPieces = drwh["AcceptedPcs"].ToString();
                        obj.PlannedPieces = drwh["PlannedPcs"].ToString();
                        obj.DepartedPieces = drwh["DepartedPcs"].ToString();
                        obj.LyingPieces = drwh["LayingPcs"].ToString();
                        obj.ReceivedPieces = drwh["ReceivedPieces"].ToString();
                        obj.DOReceivedPieces = drwh["DOReceivedPieces"].ToString();
                        obj.BalancePieces = drwh["BalancePieces"].ToString();
                        obj.DOBalancePieces = drwh["DOBalancePieces"].ToString();
                        obj.Shipmenttype = drwh["Shipmenttype"].ToString();

                        obj.TrackingTrans = ds.Tables[1].AsEnumerable().Select(e => new TrackingTrans
                        {
                            SNo = Convert.ToInt32(e["SNo"]),
                            SLISNo = e["SLISNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["SLISNo"]),
                            SLINo = e["SLINo"].ToString(),
                            TrackingStagesSNo = e["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TrackingStagesSNo"]),
                            StageName = e["StageName"] == DBNull.Value ? "" : e["StageName"].ToString(),
                            ModuleName = e["ModuleName"] == DBNull.Value ? "" : e["ModuleName"].ToString(),
                            StageDate = e["StageDate"].ToString(),
                            Pieces = e["Pieces"] == DBNull.Value ? 0 : Convert.ToInt32(e["Pieces"]),
                            Weight = e["Weight"].ToString(),
                            Terminal = e["Terminal"] == DBNull.Value ? "" : e["Terminal"].ToString().ToUpper(),
                            EventDetails = e["EventDetails"] == DBNull.Value ? "" : e["EventDetails"].ToString(),
                            EventDateTime = e["EventDateTime"].ToString(),
                            FlightInfo = e["FlightInfo"] == DBNull.Value ? "" : e["FlightInfo"].ToString(),
                            UserID = e["UserID"].ToString(),
                            BGColorCode = e["BGColorCode"] == DBNull.Value ? "" : e["BGColorCode"].ToString(),
                            ColorCode = e["ColorCode"] == DBNull.Value ? "" : e["ColorCode"].ToString(),
                            IsPopup = e["IsPopup"] == DBNull.Value ? false : Convert.ToBoolean(e["IsPopup"])
                        }).ToList();
                    }


                }

            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return obj;
        }
        public Tracking GetHistoryTracking(string recordID, int TrackType, int AWBSNo)
        {
            Tracking obj = new Tracking();

            DataSet ds = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", recordID), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@TrackType", TrackType), new SqlParameter("@AWBSNo", AWBSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spHistoryTracking", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow drwh = ds.Tables[0].Rows[0];

                        obj.SNo = Convert.ToInt32(drwh["Sno"]);
                        obj.AWB = drwh["AWBNo"].ToString();
                        obj.AWBDate = drwh["AWBDate"].ToString();
                        obj.SLI = drwh["SLINo"].ToString();
                        obj.Origin = drwh["Origin"].ToString();
                        obj.Destination = drwh["Destination"].ToString();
                        obj.TotalPieces = drwh["TotalPieces"].ToString();
                        obj.GrossWt = drwh["GrossWeight"].ToString();
                        obj.Shipper = drwh["Shipper"].ToString();
                        obj.Consignee = drwh["Consignee"].ToString();
                        obj.SHC = drwh["SHC"].ToString();
                        obj.NatureOfGoods = drwh["NatureOfGoods"].ToString();
                        obj.HAWB = drwh["HAWBCount"].ToString();
                        obj.SLICustomerType = drwh["SLICustomerType"].ToString();
                        obj.ReceivedPieces = drwh["ReceivedPieces"].ToString();
                        obj.DOReceivedPieces = drwh["DOReceivedPieces"].ToString();
                        obj.BalancePieces = drwh["BalancePieces"].ToString();
                        obj.DOBalancePieces = drwh["DOBalancePieces"].ToString();
                        obj.BOE = drwh["BOE"].ToString() == "True" ? "Yes" : "No";
                        obj.TrackingTrans = ds.Tables[1].AsEnumerable().Select(e => new TrackingTrans
                        {
                            SNo = Convert.ToInt32(e["SNo"]),
                            SLISNo = e["SLISNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["SLISNo"]),
                            SLINo = e["SLINo"].ToString(),
                            TrackingStagesSNo = e["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TrackingStagesSNo"]),
                            StageName = e["StageName"].ToString(),
                            ModuleName = e["ModuleName"].ToString(),
                            StageDate = e["StageDate"].ToString(),
                            Pieces = e["Pieces"] == DBNull.Value ? 0 : Convert.ToInt32(e["Pieces"]),
                            Weight = e["Weight"].ToString(),
                            Terminal = e["Terminal"].ToString().ToUpper(),
                            EventDetails = e["EventDetails"].ToString(),
                            EventDateTime = e["EventDateTime"].ToString(),
                            FlightInfo = e["FlightInfo"].ToString(),
                            UserID = e["UserID"].ToString(),
                            BGColorCode = e["BGColorCode"].ToString(),
                            ColorCode = e["ColorCode"].ToString(),
                        }).ToList();
                    }


                }

            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return obj;
        }
        public Tracking GetConsolidateTracking(string recordID, string AWBPrefix)
        {
            Tracking obj = new Tracking();
            //Tracking obj1 = new Tracking();
            DataSet ds = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", recordID), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@AWBPre", AWBPrefix) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spConsolidateTracking", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow drwh = ds.Tables[0].Rows[0];

                        obj.SNo = Convert.ToInt32(drwh["Sno"]);
                        obj.AWB = drwh["AWBNo"].ToString();
                        obj.AWBSNo = drwh["AWBSNo"].ToString();
                        obj.AWBDate = drwh["AWBDate"].ToString();
                        obj.SLI = drwh["SLINo"].ToString();
                        obj.Origin = drwh["Origin"].ToString();
                        obj.Destination = drwh["Destination"].ToString();
                        obj.TotalPieces = drwh["TotalPieces"].ToString();
                        obj.GrossWt = drwh["GrossWeight"].ToString();
                        // obj.VolumeWeight = drwh["VolumeWeight"].ToString();
                        obj.Shipper = drwh["Shipper"].ToString();
                        obj.Consignee = drwh["Consignee"].ToString();
                        obj.SHC = drwh["SHC"].ToString();
                        obj.NatureOfGoods = drwh["NatureOfGoods"].ToString();
                        obj.HAWB = drwh["HAWBCount"].ToString();
                        obj.SLICustomerType = drwh["SLICustomerType"].ToString();
                        obj.BOE = drwh["BOE"].ToString() == "True" ? "Yes" : "No";
                        obj.IsImportAWB = drwh["IsImportAWB"].ToString();
                        obj.IsAgentBuildUp = drwh["IsAgentBuildUp"].ToString();
                        obj.OnHold = drwh["OnHold"].ToString();
                        obj.AcceptedPieces = drwh["AcceptedPcs"].ToString();
                        obj.PlannedPieces = drwh["PlannedPcs"].ToString();
                        obj.DepartedPieces = drwh["DepartedPcs"].ToString();
                        obj.LyingPieces = drwh["LayingPcs"].ToString();
                        obj.ReceivedPieces = drwh["ReceivedPieces"].ToString();
                        obj.DOReceivedPieces = drwh["DOReceivedPieces"].ToString();
                        obj.BalancePieces = drwh["BalancePieces"].ToString();
                        obj.DOBalancePieces = drwh["DOBalancePieces"].ToString();
                        obj.Shipmenttype = drwh["Shipmenttype"].ToString();
                        obj.IsRepriced = drwh["IsRepriced"].ToString();
                        obj.NumberOfReprice = drwh["NumberOfReprice"].ToString();
                        //obj.TrackingStagesSNo = drwh["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(drwh["TrackingStagesSNo"]);

                        obj.TrackingTrans = ds.Tables[1].AsEnumerable().Select(e => new TrackingTrans
                        {
                            SNo = Convert.ToInt32(e["SNo"]),
                            SLISNo = e["SLISNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["SLISNo"]),
                            SLINo = e["SLINo"].ToString(),
                            TrackingStagesSNo = e["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TrackingStagesSNo"]),
                            StageName = e["StageName"].ToString(),
                            ModuleName = e["ModuleName"].ToString(),
                            StageDate = e["StageDate"].ToString(),
                            Pieces = e["Pieces"] == DBNull.Value ? 0 : Convert.ToInt32(e["Pieces"]),
                            Weight = e["Weight"].ToString(),
                            VolumeWeight = e["VolumeWeight"].ToString(),
                            Terminal = e["Terminal"].ToString().ToUpper(),
                            EventDetails = e["EventDetails"].ToString(),
                            EventDateTime = e["EventDateTime"].ToString(),
                            FlightInfo = e["FlightInfo"].ToString(),
                            UserID = e["UserID"].ToString(),
                            BGColorCode = e["BGColorCode"].ToString(),
                            ColorCode = e["ColorCode"].ToString(),
                            IsPopup = e["IsPopup"] == DBNull.Value ? false : Convert.ToBoolean(e["IsPopup"]),
                            ActualMessage = e["ActualMessage"].ToString(),
                            CurrentAirport = e["CurrentAirport"].ToString() //added by devendra

                        }).ToList();
                      
                    }
                    //else if (ds.Tables[1].Rows.Count > 0)
                    //{
                    //    obj.TrackingTrans = ds.Tables[1].AsEnumerable().Select(e => new TrackingTrans
                    //    {
                    //        SNo = Convert.ToInt32(e["SNo"]),
                    //        SLISNo = e["SLISNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["SLISNo"]),
                    //        SLINo = e["SLINo"].ToString(),
                    //        TrackingStagesSNo = e["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TrackingStagesSNo"]),
                    //        StageName = e["StageName"].ToString(),
                    //        ModuleName = e["ModuleName"].ToString(),
                    //        StageDate = e["StageDate"].ToString(),
                    //        Pieces = e["Pieces"] == DBNull.Value ? 0 : Convert.ToInt32(e["Pieces"]),
                    //        Weight = e["Weight"].ToString(),
                    //        VolumeWeight = e["VolumeWeight"].ToString(),
                    //        Terminal = e["Terminal"].ToString().ToUpper(),
                    //        EventDetails = e["EventDetails"].ToString(),
                    //        EventDateTime = e["EventDateTime"].ToString(),
                    //        FlightInfo = e["FlightInfo"].ToString(),
                    //        UserID = e["UserID"].ToString(),
                    //        BGColorCode = e["BGColorCode"].ToString(),
                    //        ColorCode = e["ColorCode"].ToString(),
                    //        IsPopup = e["IsPopup"] == DBNull.Value ? false : Convert.ToBoolean(e["IsPopup"]),
                    //        ActualMessage = e["ActualMessage"].ToString(),
                    //        CurrentAirport = e["CurrentAirport"].ToString() //added by devendra

                    //    }).ToList();
                       
                    //}

                }

            }
            catch(Exception ex)//
            {
                throw ex;
            }
           
                return obj;
           
           

        }

        public Tracking GetPOMailTracking(string recordID,string POMailPrefix)
        {
            Tracking obj = new Tracking();

            DataSet ds = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CN38No", recordID), new SqlParameter("@POMailPrefix", POMailPrefix), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spConsolidateTracking_POMailDetail", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow drwh = ds.Tables[0].Rows[0];

                        obj.SNo = Convert.ToInt32(drwh["Sno"]);
                        obj.AWB = drwh["AWBNo"].ToString();
                        obj.AWBSNo = drwh["POMailSNo"].ToString();
                        obj.AWBDate = drwh["AWBDate"].ToString();
                        //obj.SLI = drwh["SLINo"].ToString();
                        obj.Origin = drwh["Origin"].ToString();
                        obj.Destination = drwh["Destination"].ToString();
                        obj.TotalPieces = drwh["TotalPieces"].ToString();
                        obj.GrossWt = drwh["GrossWeight"].ToString();
                        obj.Shipper = drwh["Shipper"].ToString();
                        obj.Consignee = drwh["Consignee"].ToString();
                        obj.SHC = drwh["SHC"].ToString();
                        obj.NatureOfGoods = drwh["NatureOfGoods"].ToString();
                        obj.HAWB = drwh["HAWBCount"].ToString();
                        obj.SLICustomerType = drwh["SLICustomerType"].ToString();
                        obj.BOE = drwh["BOE"].ToString() == "True" ? "Yes" : "No";
                        obj.IsImportAWB = drwh["IsImportAWB"].ToString();
                        obj.IsAgentBuildUp = drwh["IsAgentBuildUp"].ToString();
                        //obj.OnHold = drwh["OnHold"].ToString();
                        obj.AcceptedPieces = drwh["AcceptedPcs"].ToString();
                        obj.PlannedPieces = drwh["PlannedPcs"].ToString();
                        obj.DepartedPieces = drwh["DepartedPcs"].ToString();
                        obj.LyingPieces = drwh["LayingPcs"].ToString();
                        obj.ReceivedPieces = drwh["ReceivedPieces"].ToString();
                        obj.DOReceivedPieces = drwh["DOReceivedPieces"].ToString();
                        obj.BalancePieces = drwh["BalancePieces"].ToString();
                        obj.DOBalancePieces = drwh["DOBalancePieces"].ToString();
                        obj.Shipmenttype = drwh["Shipmenttype"].ToString();
                        //obj.TrackingStagesSNo = drwh["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(drwh["TrackingStagesSNo"]);

                        obj.TrackingTrans = ds.Tables[1].AsEnumerable().Select(e => new TrackingTrans
                        {
                            SNo = Convert.ToInt32(e["SNo"]),
                            SLISNo = e["SLISNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["SLISNo"]),
                            SLINo = e["SLINo"].ToString(),
                            TrackingStagesSNo = e["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TrackingStagesSNo"]),
                            StageName = e["StageName"].ToString(),
                            ModuleName = e["ModuleName"].ToString(),
                            StageDate = e["StageDate"].ToString(),
                            Pieces = e["Pieces"] == DBNull.Value ? 0 : Convert.ToInt32(e["Pieces"]),
                            Weight = e["Weight"].ToString(),
                            Terminal = e["Terminal"].ToString().ToUpper(),
                            EventDetails = e["EventDetails"].ToString(),
                            EventDateTime = e["EventDateTime"].ToString(),
                            FlightInfo = e["FlightInfo"].ToString(),
                            UserID = e["UserID"].ToString(),
                            BGColorCode = e["BGColorCode"].ToString(),
                            ColorCode = e["ColorCode"].ToString(),
                            IsPopup = e["IsPopup"] == DBNull.Value ? false : Convert.ToBoolean(e["IsPopup"]),
                            ActualMessage = e["ActualMessage"].ToString(),


                        }).ToList();
                    }


                }

            }
            catch (Exception ex)//
            {
                throw ex;
            }
            return obj;
        }

        public string GetAWBRecord(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        // Changes by Vipin Kumar
        //public string GetFlightRecord(string FlightNo, string FlightDate, string Origin, string Destination, string TrackingType)
        public FlightRecord GetFlightRecord(FlightRecord flightRecord)
        // Ends
        {
            FlightRecord obj = new FlightRecord();
            try
            {
                
                SqlParameter[] Parameters = { new SqlParameter("@FlightNo", flightRecord.FlightNo),
                new SqlParameter("@FlightDate", Convert.ToString(flightRecord.FlightDate)),
                new SqlParameter("@Origin",flightRecord.Origin),
                new SqlParameter("@Destination", flightRecord.Destination),
                new SqlParameter("@TrackingType",flightRecord.TrackingType),
                new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlighttrackingRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    obj.FlightRecordTrans = ds.Tables[0].AsEnumerable().Select(e => new FlightRecordTrans
                    {
                       
                        TrackingStagesSNo = e["TrackingStagesSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TrackingStagesSNo"]),
                        StageName = e["StageName"].ToString(),
                        //ModuleName = e["ModuleName"].ToString(),
                        StageDate = e["StageDate"].ToString(),
                        GrossWeight = e["GrossWeight"].ToString(),
                        VolumeWeight = e["VolumeWeight"].ToString(),
                        EventDetails = e["EventDetails"].ToString(),
                        EventDateTime = e["EventDateTime"].ToString(),
                        Route = e["Route"].ToString(),
                        FlightStation = e["FlightStation"].ToString(),
                        WayBillCount = e["WayBillCount"].ToString(),
                        ULDCount = e["ULDCount"].ToString(),
                        CBM = e["CBM"].ToString(),
                        MessageType = e["MessageType"].ToString(),

                        UserID = e["UserID"].ToString(),
                        //BGColorCode = e["BGColorCode"].ToString(),
                       // ColorCode = e["ColorCode"].ToString(),
                        //IsPopup = e["IsPopup"] == DBNull.Value ? false : Convert.ToBoolean(e["IsPopup"]),
                        //ActualMessage = e["ActualMessage"].ToString(),
                        //CurrentAirport = e["CurrentAirport"].ToString() //added by devendra

                    }).ToList();
                }
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
               
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return obj;

        }
        public string GetMOPRecord(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetMOPData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        //Changes by Vipin Kumar
        //public string GetLocationDetails(string AWBSNo, string IsImport, int tstage)
        public string GetLocationDetails(LocationRecord model)
        //Ends
        {
            try
            {
                DataSet ds = null;
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", model.AWBSNo),
                                          new SqlParameter("@IsImport",model.IsImport),
                                        new SqlParameter("@tstage",model.Tstage)};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spTracking_GetLocationDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetAWBHoldDetails(string AWBSNo, string IsImport)
        {
            try
            {
                DataSet ds = null;
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@IsImport",IsImport)};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spTracking_GetHoldTypeDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetHAWBDetails(string AWBSNo, string IsImport, string HAWBNo)
        {

            try
            {
                DataSet ds = null;
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@IsImport",IsImport=="False"?0:1),
                                          new SqlParameter("@HAWBNo",HAWBNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spTracking_GetHAWBDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        // Changes by Vipin Kumar
        //public string GetULDRecord(string uldStockSNo, string TrackingType)
        public string GetULDRecord(ULDRecord uldRecord)
        // Ends 
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UldStockSNo", uldRecord.UldStockSNo),
            new SqlParameter("@TrackingType", uldRecord.TrackingType),
            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDtrackingRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
// Ends 
        ////added by preeti deep
        //public string GetPOMailRecord(string POMailNo)
        
        //{
        //    try
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@CN38No", POMailNo),
        //   // new SqlParameter("@TrackingType", uldRecord.TrackingType),
        //    new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spConsolidateTracking_POMailDetail", Parameters);
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }
        //    catch (Exception ex)//
        //    {
        //        throw ex;
        //    }
        //}
        

    }
}
