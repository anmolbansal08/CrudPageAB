using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AcceptanceService : BaseWebUISecureObject, IAcceptanceService
    {



        // created By manoj Kumar Chaurasiya for Bind Chart
        public string[] GetAWBProcess(Int32 AWBSNo, Int32 ProcessSNo)
        {

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ProcessSNo", ProcessSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetAWBProcess", Parameters);
                string[] str = new string[2];
                str[0] = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                str[1] = ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString();
                //"{category:Complete,value: " + ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() + ", color: '#9de219'}," +
                //"{category:InComplete,value:" + ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString() + ",color: '#FE9D5A'}";
                //string str = "{Complete:"+ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString()+",InComplete:"+ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString()+"}";
                return str;
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return null;
            //    // return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string[] GetFlightChartDetails(string DailyFlightSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@FlightSNo", DailyFlightSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetFlightChartDetails", Parameters);
                string[] str = new string[3];
                str[0] = ds.Tables[ds.Tables.Count - 1].Rows[0]["FlightNo"].ToString();//FlightNo Array
                str[1] = ds.Tables[ds.Tables.Count - 1].Rows[0]["BookingGWT"].ToString();//BookingWT Array 
                str[2] = ds.Tables[ds.Tables.Count - 1].Rows[0]["AccptanceGWT"].ToString();//AccptedWT array
                //"{category:Complete,value: " + ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() + ", color: '#9de219'}," +
                //"{category:InComplete,value:" + ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString() + ",color: '#FE9D5A'}";
                //string str = "{Complete:"+ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString()+",InComplete:"+ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString()+"}";
                return str;
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return null;
            //    // return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        // end



        public string SaveAcceptance(string AWBNo, Int32 AWBSNo, ShipmentInformation ShipmentInformation, List<AWBSPHC> lstAWBSPHC, List<ItineraryInformation> listItineraryInformation, List<DGRArray> AWBDGRTrans, Int32 UpdatedBy, string isAmmendment, string IsLateAccepTance, List<NOGArray> NOGArray, List<SHCSubGroupArray> SHCSubGroupArray, string isChargableAmendment, string IsDirectAcceptance, List<SHCTemp> SHCTemp, string IsReservation)
        {
            List<ShipmentInformation> lstShipmentInformation = new List<ShipmentInformation>();
            lstShipmentInformation.Add(ShipmentInformation);

            //List<AWBSPHC> lstAWBSPHC = new List<AWBSPHC>();
            //lstAWBSPHC.Add(AwbSPHC);

            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "");
            DataTable dtAWBSPHC = CollectionHelper.ConvertTo(lstAWBSPHC, "");
            DataTable dtItineraryInformation = CollectionHelper.ConvertTo(listItineraryInformation, "");
            DataTable dtAWBDGRTrans = CollectionHelper.ConvertTo(AWBDGRTrans, "SNo");
            DataTable dtNOG = CollectionHelper.ConvertTo(NOGArray, "");
            DataTable dtSHCSubGroupArray = CollectionHelper.ConvertTo(SHCSubGroupArray, "");
            DataTable dtSHCTemp = CollectionHelper.ConvertTo(SHCTemp, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramShipmentInformation = new SqlParameter();
            paramShipmentInformation.ParameterName = "@ShipmentInformation";
            paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipmentInformation.Value = dtShipmentInformation;

            SqlParameter paramAWBSPHC = new SqlParameter();
            paramAWBSPHC.ParameterName = "@AWBSPHC";
            paramAWBSPHC.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHC.Value = dtAWBSPHC;

            SqlParameter paramItineraryInformation = new SqlParameter();
            paramItineraryInformation.ParameterName = "@ItineraryInformation";
            paramItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramItineraryInformation.Value = dtItineraryInformation;

            SqlParameter paramAWBSPHCTrans = new SqlParameter();
            paramAWBSPHCTrans.ParameterName = "@AWBSPHCTrans";
            paramAWBSPHCTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHCTrans.Value = dtAWBDGRTrans;

            SqlParameter paramNOGTrans = new SqlParameter();
            paramNOGTrans.ParameterName = "@AWBNOGTrans";
            paramNOGTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramNOGTrans.Value = dtNOG;

            SqlParameter paramSHCSubGroupTrans = new SqlParameter();
            paramSHCSubGroupTrans.ParameterName = "@AWBSHCSubGroupTrans";
            paramSHCSubGroupTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramSHCSubGroupTrans.Value = dtSHCSubGroupArray;

            SqlParameter paramdtSHCTemp = new SqlParameter();
            paramdtSHCTemp.ParameterName = "@SHCTemp";
            paramdtSHCTemp.SqlDbType = System.Data.SqlDbType.Structured;
            paramdtSHCTemp.Value = dtSHCTemp;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBNo", AWBNo),
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramShipmentInformation,
                                            paramAWBSPHC,
                                            paramItineraryInformation,
                                            paramAWBSPHCTrans,
                                            paramNOGTrans,
                                            paramSHCSubGroupTrans,
                                            paramdtSHCTemp,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@isAmmendment", isAmmendment),
                                            new SqlParameter("@IsLateAccepTance", IsLateAccepTance),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment),
                                            new SqlParameter("@IsDirectAcceptance",IsDirectAcceptance),
                                            new SqlParameter("@IsReservation",IsReservation)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveAcceptance", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveDGRDetails(Int32 AWBSNo, List<DGRArraySeprate> AWBDGRTrans)
        {

            DataTable dtAWBDGRTrans = CollectionHelper.ConvertTo(AWBDGRTrans, "SNo");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramAWBSPHCTrans = new SqlParameter();
            paramAWBSPHCTrans.ParameterName = "@AWBSPHCTrans";
            paramAWBSPHCTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHCTrans.Value = dtAWBDGRTrans;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramAWBSPHCTrans,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveDGRDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdateShipperInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, Int32 UpdatedBy)
        {

            List<ShipperInformation> lstShipperInformation = new List<ShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramShipperInformation = new SqlParameter();
            paramShipperInformation.ParameterName = "@ShipperInformation";
            paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipperInformation.Value = dtShipperInformation;



            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramShipperInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateShipperInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, NotifyDetails NotifyModel, NominyDetails NominyModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string isAmmendment, string isChargableAmendment, string CreateShipperParticipants, string CreateConsigneerParticipants, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId)
        {
            List<ShipperInformation> lstShipperInformation = new List<ShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();


            List<ConsigneeInformation> lstConsigneeInformation = new List<ConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

            List<NotifyDetails> lstNotifyInformation = new List<NotifyDetails>();
            lstNotifyInformation.Add(NotifyModel);
            DataTable dtNotifyDetails = CollectionHelper.ConvertTo(lstNotifyInformation, "");

            List<NominyDetails> lstNominyInformation = new List<NominyDetails>();
            lstNominyInformation.Add(NominyModel);
            DataTable dtNominyDetails = CollectionHelper.ConvertTo(lstNominyInformation, "");


            SqlParameter paramShipperInformation = new SqlParameter();
            paramShipperInformation.ParameterName = "@ShipperInformation";
            paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipperInformation.Value = dtShipperInformation;

            SqlParameter paramConsigneeInformation = new SqlParameter();
            paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
            paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramConsigneeInformation.Value = dtConsigneeInformation;

            SqlParameter paramNotifyDetails = new SqlParameter();
            paramNotifyDetails.ParameterName = "@NotifyDetails";
            paramNotifyDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramNotifyDetails.Value = dtNotifyDetails;

            SqlParameter paramNominyDetails = new SqlParameter();
            paramNominyDetails.ParameterName = "@NominyDetails";
            paramNominyDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramNominyDetails.Value = dtNominyDetails;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramShipperInformation,
                                            paramConsigneeInformation,
                                            paramNotifyDetails,
                                            paramNominyDetails,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@isAmmendment", isAmmendment),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment),
                                            new SqlParameter("@CreateShipperParticipants",CreateShipperParticipants),
                                            new SqlParameter("@CreateConsigneerParticipants",CreateConsigneerParticipants),
                                               new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneeTaxParticipants",CreateConsigneeTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneeTaxId",CreateConsigneeTaxId)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateShipperAndConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateConsigneeInformation(Int32 AWBSNo, ConsigneeInformation ConsigneeInformation, Int32 UpdatedBy)
        {

            List<ConsigneeInformation> lstConsigneeInformation = new List<ConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramConsigneeInformation = new SqlParameter();
            paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
            paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramConsigneeInformation.Value = dtConsigneeInformation;



            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramConsigneeInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, OSIInformation OSIInformation, List<AWBHandlingMessage> AWBHandlingMessage, List<AWBOSIModel> AWBOSIModel, List<AWBOCIModel> AWBOCIModel, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment)
        {
            List<OSIInformation> lstOSIInformation = new List<OSIInformation>();
            lstOSIInformation.Add(OSIInformation);
            DataTable dtOSIInformation = CollectionHelper.ConvertTo(lstOSIInformation, "");
            DataTable dtAWBHandlingMessage = CollectionHelper.ConvertTo(AWBHandlingMessage, "");
            DataTable dtAWBOSIModel = CollectionHelper.ConvertTo(AWBOSIModel, "");
            DataTable dtAWBOCIModel = CollectionHelper.ConvertTo(AWBOCIModel, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramOSIInformation = new SqlParameter();
            paramOSIInformation.ParameterName = "@OSIInformation";
            paramOSIInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSIInformation.Value = dtOSIInformation;

            SqlParameter paramAWBHandlingMessage = new SqlParameter();
            paramAWBHandlingMessage.ParameterName = "@AWBHandlingMessage";
            paramAWBHandlingMessage.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBHandlingMessage.Value = dtAWBHandlingMessage;

            SqlParameter paramAWBOSIModel = new SqlParameter();
            paramAWBOSIModel.ParameterName = "@AWBOSIInformation";
            paramAWBOSIModel.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBOSIModel.Value = dtAWBOSIModel;

            SqlParameter paramAWBOCIModel = new SqlParameter();
            paramAWBOCIModel.ParameterName = "@AWBOCIInformation";
            paramAWBOCIModel.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBOCIModel.Value = dtAWBOCIModel;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramOSIInformation,
                                            paramAWBHandlingMessage,
                                            paramAWBOSIModel,
                                            paramAWBOCIModel,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@isAmmendment", isAmmendment),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateOSIInfoAndHandlingMessage", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateAWBDimemsions(Int32 AWBSNo, List<Dimensions> Dimensions, List<AWBULDTypeDetails> ULDTypeArr, Int32 UpdatedBy, int IsLateAcceptance, int IsHold)
        {
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "oldPieces");
            DataTable dtAWBULDTypeTrans = CollectionHelper.ConvertTo(ULDTypeArr, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramDimensions = new SqlParameter();
            paramDimensions.ParameterName = "@DimensionsType";
            paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensions.Value = dtDimensions;

            SqlParameter paramAWBULDTypeTrans = new SqlParameter();
            paramAWBULDTypeTrans.ParameterName = "@AWBULDTypeTrans";
            paramAWBULDTypeTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBULDTypeTrans.Value = dtAWBULDTypeTrans;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramDimensions, paramAWBULDTypeTrans, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsLateAcceptance", IsLateAcceptance), new SqlParameter("@IsHold", IsHold) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBDimemsions", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateAWBDimemsions_NEW(Int32 AWBSNo, List<Dimensions> Dimensions, List<AWBULDTypeDetails> ULDTypeArr, List<FlightDetails> FlightDetails, Int32 UpdatedBy, int IsLateAcceptance, int IsHold, int Action, int UpdatedPcs, int HAWBSNo, List<EmbargoResultArray> EmbargoResultArray, int DimsSHCandCommodityPermission, Int32 DimsCommodity, string DimsSPHC, string AmmendmentSpecialPermissionOfDIM)
        {
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "oldPieces");
            DataTable dtAWBULDTypeTrans = CollectionHelper.ConvertTo(ULDTypeArr, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            DataTable dtFlightDetails = CollectionHelper.ConvertTo(FlightDetails, "");

            DataTable dtEmbargoArray = CollectionHelper.ConvertTo(EmbargoResultArray, "");

            SqlParameter paramEmbargoArray = new SqlParameter();
            paramEmbargoArray.ParameterName = "@EmbargoArray";
            paramEmbargoArray.SqlDbType = System.Data.SqlDbType.Structured;
            paramEmbargoArray.Value = dtEmbargoArray;

            SqlParameter paramFlightDetailsInformation = new SqlParameter();
            paramFlightDetailsInformation.ParameterName = "@FlightDetailsInformation";
            paramFlightDetailsInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramFlightDetailsInformation.Value = dtFlightDetails;

            SqlParameter paramDimensions = new SqlParameter();
            paramDimensions.ParameterName = "@DimensionsType";
            paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensions.Value = dtDimensions;

            SqlParameter paramAWBULDTypeTrans = new SqlParameter();
            paramAWBULDTypeTrans.ParameterName = "@AWBULDTypeTrans";
            paramAWBULDTypeTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBULDTypeTrans.Value = dtAWBULDTypeTrans;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramDimensions, paramAWBULDTypeTrans, paramFlightDetailsInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsLateAcceptance", IsLateAcceptance), new SqlParameter("@IsHold", IsHold), new SqlParameter("@Action", Action), new SqlParameter("@UpdatedPcs", UpdatedPcs), new SqlParameter("@HAWBSNo", HAWBSNo), paramEmbargoArray, new SqlParameter("@DimsSHCandCommodityPermission", DimsSHCandCommodityPermission), new SqlParameter("@DimsCommodity", DimsCommodity), new SqlParameter("@DimsSPHC", DimsSPHC), new SqlParameter("@AmmendmentSpecialPermissionOfDIM", AmmendmentSpecialPermissionOfDIM) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBDimemsionsNew", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateAWBDimemsionsULDInfo(Int32 AWBSNo, List<AWBULDTrans> AWBULDTrans, Int32 UpdatedBy)
        {
            //DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");
            DataTable dtAWBULDTrans = CollectionHelper.ConvertTo(AWBULDTrans, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            //SqlParameter paramDimensions = new SqlParameter();
            //paramDimensions.ParameterName = "@DimensionsType";
            //paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            //paramDimensions.Value = dtDimensions;

            SqlParameter paramAWBULDTrans = new SqlParameter();
            paramAWBULDTrans.ParameterName = "@AWBULDTransType";
            paramAWBULDTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBULDTrans.Value = dtAWBULDTrans;



            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramAWBULDTrans, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBDimemsionsULDInfo", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateAWBDimemsionsULDDetails(Int32 AWBSNo, List<AWBULDDetails> AWBULDDetails, Int32 UpdatedBy)
        {
            DataTable dtAWBULDDetails = CollectionHelper.ConvertTo(AWBULDDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramULDDetails = new SqlParameter();
            paramULDDetails.ParameterName = "@ULDDetailsType";
            paramULDDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDDetails.Value = dtAWBULDDetails;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramULDDetails, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBDimemsionsULDDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public int GetAWBSNofromAWBNo(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo) };
                int AWBSNo = Convert.ToInt32(SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBSNoFromAWBNo", Parameters));
                return AWBSNo;
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return 0;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string GetAcceptanceInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAcceptanceInformation", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetShipperAndConsigneeInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperAndConsigneeInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetOSIInfoAndHandlingMessage(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOSIInfoAndHandlingMessage", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetDimemsionsAndULD(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULD", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string GetULDDimensionInfo(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDDimensionInfo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string GetULDDimensionDetails(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDDimensionDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }

        public string GetFBLHandlingCharges(Int32 TariffSNO, Int32 AWBSNO, string CityCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ParmTariffCodeSNO", TariffSNO), new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@CityCode", CityCode) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "WMSFblHandlingChargesByTCSNo", Parameters);

                //SqlParameter[] Parameters = { new SqlParameter("@PageSize", "0"), new SqlParameter("@WhereCondition", ""), new SqlParameter("@TableName", ""), new SqlParameter("@KeyColumn", ""), new SqlParameter("@TextColumn", ""), new SqlParameter("@TemplateColumn", ""), new SqlParameter("@AwbSNo", AWBSNO), new SqlParameter("@ChargeTo", 0), new SqlParameter("@CityCode", CityCode), new SqlParameter("@MovementType", 2), new SqlParameter("@HAWBSNo", ""), new SqlParameter("@LoginSNo", 2) };

                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "WMSFBLHandlingCharges", Parameters);

                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string FBLHandlingCharges(Int32 AWBSNO, Int32 HAWBSNo)
        {
            //((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()try
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNO),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", "2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", 1),
                                            new SqlParameter("@SubProcessSNo", 7),
                                            new SqlParameter("@ChargeType", "Acceptance"),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()) ,
                                            new SqlParameter("@GrWT",0),
                                            new SqlParameter("@VolWt",0),
                                            new SqlParameter("@ChWt",0),
                                            new SqlParameter("@Pieces",0),
                                            new SqlParameter("@Remarks","")
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string WMSFBLHandlingCharges(Int32 AWBSNO, string CityCode)
        {
            try
            {
                //SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@ChargeTo", 0), new SqlParameter("@CityCode", CityCode), new SqlParameter("@MovementType", 2), new SqlParameter("@HAWBSNo", ""), new SqlParameter("@LoginSNo", 2) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "WMSFBLHandlingCharges");
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        //public string UpdateULDStatusByAWBSNo(string awbSNo, string CityCode, int MovementType, string IsAvailable)
        //{
        //    DataTable dt = new DataTable();
        //    string ErrorMessage = "";
        //    try
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AwbSNo", awbSNo), new SqlParameter("@CityCode", CityCode), new SqlParameter("@MovementType", MovementType), new SqlParameter("@IsAvailable", IsAvailable) };

        //        SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateULDStatusByAWBSNo", Parameters);
        //        //Check if dt table is blank then reflect error number and error message
        //        if (dt == null)
        //        {
        //            ErrorMessage = "Unable to modify uld status.";

        //        }
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {

        //        ErrorMessage = ex.Message;

        //    }
        //    return ErrorMessage;

        //}

        //public string SaveAWBSPHCTrans(List<AWBSPHCTrans> lstawbSPHCTrans)
        //{

        //    string Message = "";
        //    DataTable dtAWBSPHCTrans = CollectionHelper.ConvertTo(lstawbSPHCTrans, "");

        //    SqlParameter paramSPHC = new SqlParameter();
        //    paramSPHC.ParameterName = "@AWBSPHCTrans";
        //    paramSPHC.SqlDbType = System.Data.SqlDbType.Structured;
        //    paramSPHC.Value = dtAWBSPHCTrans;



        //    SqlParameter[] Parameters = { paramSPHC };
        //    DataSet ds1 = new DataSet();
        //    try
        //    {
        //        Message = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAWBSPHC", Parameters).ToString();


        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        Message = ex.Message;
        //    }
        //    return Message;
        //}

        public string SaveAtWeighing(Int32 AWBSNo, List<AWBGroup> lsAWBGroup, List<ULDWeightModel> lstUldWeigh, bool ScanType, int UpdatedBy)
        {
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBGroup, "");
            DataTable dtULDWeightModel = CollectionHelper.ConvertTo(lstUldWeigh, "");

            SqlParameter paramAWBGroup = new SqlParameter();
            paramAWBGroup.ParameterName = "@AWBGroup";
            paramAWBGroup.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBGroup.Value = dtAWBGroup;


            SqlParameter paramAWBULDWeight = new SqlParameter();
            paramAWBULDWeight.ParameterName = "@AWBULDWeight";
            paramAWBULDWeight.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBULDWeight.Value = dtULDWeightModel;


            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramAWBGroup, paramAWBULDWeight, new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAtWeighing", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        //operationType:Location/Xray:
        public string SaveAtLocationXRay(Int32 AWBSNo, List<AWBLocationXRay> lsAWBAWBLocationXRay, string operationType, bool ScanType, int UpdatedBy)
        {
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBAWBLocationXRay, "");

            SqlParameter paramLocationXRay = new SqlParameter();
            paramLocationXRay.ParameterName = "@AWBLocationXRay";
            paramLocationXRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramLocationXRay.Value = dtAWBGroup;


            //SqlParameter paramAWBWL = new SqlParameter();
            //paramAWBWL.ParameterName = "@AWBWarehouseLocation";
            //paramAWBWL.SqlDbType = System.Data.SqlDbType.Structured;
            //paramAWBWL.Value = dtAWBGroup;


            SqlParameter[] Parameters = { paramLocationXRay, new SqlParameter("@type", operationType), new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                Message = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAtLocationXRay", Parameters).ToString();


            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    Message = ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
            return Message;
        }

        public string SaveAtXRay(Int32 AWBSNo, List<AWBXRay> lsAWBXRay, List<AWBULDXRay> lstULDXrayArray, List<ECSDArray> lstECSDArray, bool ScanType, bool AWBScanType, int UpdatedBy)
        {
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBXRay, "");
            DataTable dtAWBULDXRay = CollectionHelper.ConvertTo(lstULDXrayArray, "");
            DataTable dtECSDArray = CollectionHelper.ConvertTo(lstECSDArray, "");

            List<XrayChildData> lstChildData = new List<XrayChildData>();
            DataTable dtXrayTrans = CollectionHelper.ConvertTo(lstChildData, "");
            GetXrayTransData(dtAWBGroup, dtXrayTrans);

            List<ULDXrayFailureData> lstULDXrayFailureData = new List<ULDXrayFailureData>();
            DataTable dtULDXrayFailureData = CollectionHelper.ConvertTo(lstULDXrayFailureData, "");

            GetULDFailureData(dtAWBULDXRay, dtULDXrayFailureData);

            SqlParameter paramLocationXRay = new SqlParameter();
            paramLocationXRay.ParameterName = "@AWBXRayNew";
            paramLocationXRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramLocationXRay.Value = dtAWBGroup;

            SqlParameter paramULDRay = new SqlParameter();
            paramULDRay.ParameterName = "@AWBULDXRay";
            paramULDRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDRay.Value = dtAWBULDXRay;

            SqlParameter paramecdaxRay = new SqlParameter();
            paramecdaxRay.ParameterName = "@AWBECSDAXRay";
            paramecdaxRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramecdaxRay.Value = dtECSDArray;

            SqlParameter paramXrayFailure = new SqlParameter();
            paramXrayFailure.ParameterName = "@XrayFailure";
            paramXrayFailure.SqlDbType = System.Data.SqlDbType.Structured;
            paramXrayFailure.Value = dtXrayTrans;

            SqlParameter paramULDXrayFailure = new SqlParameter();
            paramULDXrayFailure.ParameterName = "@ULDXrayFailure";
            paramULDXrayFailure.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDXrayFailure.Value = dtULDXrayFailureData;

            // ScanType= true (MANUAL) ,false (BARCODE)
            // AWBScanType= true (Pieces) ,false (AWB)
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                            paramLocationXRay,
                                            paramULDRay,
                                            paramecdaxRay,
                                            paramXrayFailure,
                                            paramULDXrayFailure,
                                            new SqlParameter("@ScanType", ScanType),
                                            new SqlParameter("@XRayScanType",AWBScanType),
                                            new SqlParameter("@IsFromHHT",false),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAtXRay", Parameters);
                //try
                //{
                //    if (ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() == "")
                //    {
                //        SendFSU(AWBSNo.ToString());
                //    }
                //}
                //catch(Exception ex)// { }
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private void GetXrayTransData(DataTable dtAWBGroup, DataTable dtXrayTrans)
        {
            try
            {
                for (int j = 0; j < dtAWBGroup.Rows.Count; j++)
                {
                    if (dtAWBGroup.Rows[j]["FaultData"].ToString() != "")
                    {
                        DataTable Temp = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(Convert.ToString(dtAWBGroup.Rows[j]["FaultData"])), (typeof(DataTable)));
                        foreach (DataRow dtRow in Temp.Rows)
                        {
                            DataRow dr = dtXrayTrans.NewRow();
                            dr["XrayRowNo"] = dtAWBGroup.Rows[j]["SNo"];
                            dr["FaultGroupSno"] = dtRow["FaultGroupSno"].ToString();
                            dr["Pieces"] = dtRow["Pieces"].ToString();
                            dr["Remarks"] = dtRow["Remarks"].ToString();
                            dr["Action"] = dtRow["Action"].ToString();
                            dr["Date"] = dtRow["Date"].ToString();
                            dr["CreatedBy"] = dtRow["CreatedBy"].ToString();
                            dtXrayTrans.Rows.Add(dr);
                        }
                    }

                }
                dtAWBGroup.Columns.Remove("FaultData");

                dtAWBGroup.AcceptChanges();
                dtXrayTrans.AcceptChanges();
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }

        private void GetULDFailureData(DataTable UldXray, DataTable UldFailureXray)
        {
            try
            {
                for (int j = 0; j < UldXray.Rows.Count; j++)
                {
                    if (UldXray.Rows[j]["ULDFailure"].ToString() != "")
                    {
                        DataTable Temp = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(Convert.ToString(UldXray.Rows[j]["ULDFailure"])), (typeof(DataTable)));
                        foreach (DataRow dtRow in Temp.Rows)
                        {
                            UldFailureXray.ImportRow(dtRow);
                        }
                    }

                }
                UldXray.Columns.Remove("ULDFailure");

                UldXray.AcceptChanges();
                UldFailureXray.AcceptChanges();
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveAtLocation(Int32 AWBSNo, List<AWBLocation> lsAWBLocation, List<ULDLocation> lsULDLocation, bool ScanType, int UpdatedBy)
        {
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBLocation, "");
            DataTable dtUldLocation = CollectionHelper.ConvertTo(lsULDLocation, "");

            SqlParameter paramLocationXRay = new SqlParameter();
            paramLocationXRay.ParameterName = "@AWBLocation";
            paramLocationXRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramLocationXRay.Value = dtAWBGroup;

            SqlParameter paramUldLocation = new SqlParameter();
            paramUldLocation.ParameterName = "@SLACUldLocation";
            paramUldLocation.SqlDbType = System.Data.SqlDbType.Structured;
            paramUldLocation.Value = dtUldLocation;

            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramLocationXRay, paramUldLocation, new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAtLocation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtXray(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtXray", Parameters);
                ds.Dispose();
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string ProcessAWBXray(string AWBNO)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBNO", AWBNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ProcessAWBXray", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetRecordAtXrayBarcode(string AWBNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNO", AWBNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtXrayBarcode", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAWBSummary(Int32 AWBSNO, string OfficeSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@OfficeSNo", OfficeSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBSummary", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string GetAWBRateDetails(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBRateDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAWBRateDefaultValues(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBRateDefaultValues", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetDGRInfo(string SPHCSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SPHCSNo", SPHCSNo.Replace(",,", ",")) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDGRInfo", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetDGRInfoByID(string SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ID", SNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDGRInfoByID", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetMaxQty(string UNNo, string PackGroup, string PackInst)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UNNo", UNNo),
                                            new SqlParameter("@PackGroup", PackGroup),
                                            new SqlParameter("@PackInst", PackInst)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetMaxQty", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetFieldsFromTable(string Fields, string Table, string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Fields", Fields), new SqlParameter("@Table", Table), new SqlParameter("@SNo", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFieldsFromTable", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetFWBSaveDetails(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFWBSaveDetails", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetChargeForPrimarySecoundry(string AWBSNo, string ChagreCode, string PrimaryBasis, string SecondaryBasis)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", "2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", "0"),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", 1),
                                            new SqlParameter("@SubProcessSNo", 7),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()) ,
                                            new SqlParameter("@TariffSNo",Convert.ToInt32(ChagreCode)),
                                            new SqlParameter("@PrimaryValue", Convert.ToInt32(Convert.ToDouble(PrimaryBasis))),
                                            new SqlParameter("@SecondaryValue",Convert.ToInt32(Convert.ToDouble(SecondaryBasis))),
                                            new SqlParameter("@IsESS", 1)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }

        public string GetAWBChecklistFooter(string AWBSNo, string SPHCSNo, string ChecklistTypeSno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@SPHCSNo", SPHCSNo), new SqlParameter("@ChecklistTypeSno", ChecklistTypeSno) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBChecklistFooter", Parameters);
                ds.Dispose();
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(ds);
                return JSONString;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetTemperatureControlledInfo(string SPHCSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SPHCSNo", SPHCSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTemperatureControlledInfo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string ValidateFlight(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateFlight", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtLocation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtLocation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtWeighing(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtWeighing", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtPayment(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtPayment", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        // public string SaveAtPayment(List<HandlingCharge> lstHandlingCharge, List<AgentBranchCheque> lstAgentBranchCheque, List<AWBCheque> lstAWBCheque, string CityCode, int UpdatedBy)
        //public string SaveAtPayment(string AWBSNo, string TotalCash, string TotalCredit, List<HandlingCharge> lstHandlingCharge, List<AWBCheque> lstAWBCheque, string CityCode, int UpdatedBy, string BilltoAccount, string Shippername, string DONumber, string HAWBSNo)
        public string SaveAtPayment(string strData)
        {
            SaveAtPaymentRequest savePaymentRequest = JsonConvert.DeserializeObject<SaveAtPaymentRequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));

            string Message = "";
            DataTable dtHandlingCharge = CollectionHelper.ConvertTo(savePaymentRequest.lstHandlingCharge, "AWBNo,HAWBNo");
            //DataTable dtAgentBranchCheque = CollectionHelper.ConvertTo(lstAgentBranchCheque, "");
            DataTable dtAWBCheque = CollectionHelper.ConvertTo(savePaymentRequest.lstAWBCheque, "");

            SqlParameter paramHandlingCharge = new SqlParameter();
            paramHandlingCharge.ParameterName = "@HandlingCharge";
            paramHandlingCharge.SqlDbType = System.Data.SqlDbType.Structured;
            paramHandlingCharge.Value = dtHandlingCharge;



            //SqlParameter paraAWBBranchCheque = new SqlParameter();
            //paraAWBBranchCheque.ParameterName = "@AgentBranchCheque";
            //paraAWBBranchCheque.SqlDbType = System.Data.SqlDbType.Structured;
            //paraAWBBranchCheque.Value = dtAgentBranchCheque;


            SqlParameter paramAWBCheque = new SqlParameter();
            paramAWBCheque.ParameterName = "@AWBCheque";
            paramAWBCheque.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBCheque.Value = dtAWBCheque;


            //SqlParameter[] Parameters = { paramHandlingCharge, paraAWBBranchCheque, paramAWBCheque, new SqlParameter("@CityCode", CityCode), new SqlParameter("@UpdatedBy", UpdatedBy) };
            SqlParameter[] Parameters = { paramHandlingCharge,
                                            new SqlParameter("@CityCode", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@MovementType", 2),
                                            new SqlParameter("@Process", 1),
                                            new SqlParameter("@DOSNo", 0),
                                            new SqlParameter("@PDSNo", 0),
                                            new SqlParameter("@SubProcessSNo", 7),
                                            new SqlParameter("@ChargeToSNo", 0),
                                            new SqlParameter("@IsESS",0),
                                            new SqlParameter("@BilltoAccountSNo",savePaymentRequest.BilltoAccount),
                                            new SqlParameter("@Shippername",savePaymentRequest.Shippername),
                                            new SqlParameter("@DONumber",savePaymentRequest.DONumber),
                                            new SqlParameter("@HAWBSNo",savePaymentRequest.HAWBSNo),
                                            new SqlParameter("@AirMailSNo_Payment",0)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                //Message = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAtPayment", Parameters).ToString();
                Message = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAtPaymentInvoice", Parameters).ToString();
                try
                {
                    if (Message == "0")
                    {

                        //     SendFSU(dtHandlingCharge.Rows[0]["AWBSNo"].ToString());


                    }
                }
                catch (Exception ex) { }


            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    Message = ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
            return Message;
        }

        /// <summary>
        /// //
        /// </summary>
        /// <param name="FlightNo"></param>
        /// <param name="FlightDate"></param>
        /// <param name="CarrierCode"></param>
        /// <param name="Destination"></param>
        /// <param name="AWBNo"></param>
        /// <param name="origin"></param>
        public void SendFSU(string AWBSno)
        {
            EDICommon edicom = new EDICommon();
            DataTable dtedimessage = new DataTable();
            FSUManagement fsu = new FSUManagement();
            try
            {
                SqlParameter AWBParam = new SqlParameter("@AWBSNo", AWBSno);
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRCSDetail", AWBParam);
                if (Convert.ToString(ds.Tables[0].Rows[0]["Flag"]).Equals("0"))
                {

                    fsu.GenerateFsuMessage("RCS", ds.Tables[0].Rows[0]["AWBNo"].ToString(), string.Empty, string.Empty, Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]), "6", ds.Tables[0].Rows[0]["OriginCity"].ToString());

                    if (fsu.FsuMessageTable != null)
                        dtedimessage.Merge(fsu.FsuMessageTable);
                    FHLManagement fhl = new FHLManagement();
                    fhl.EmailFrom = "Admin";
                    if (dtedimessage.Rows.Count > 0)
                    {
                        for (int j = 0; j < dtedimessage.Rows.Count; j++)
                        {
                            var emaiadd = "rvig@cargoflash.com";
                            string strSitaAddress = "";
                            string strEmailAddress = emaiadd;
                            DataTable dtedifsu = GetMessageList(ds.Tables[0].Rows[0]["FlightNo"].ToString().Split('-')[0], ds.Tables[0].Rows[0]["DestinationCity"].ToString(), "FSU");
                            if (dtedifsu != null && dtedifsu.Rows.Count > 0)
                            {
                                emaiadd = emaiadd + "," + Convert.ToString(dtedifsu.Rows[0]["EmailAddress"]);
                                strSitaAddress = dtedifsu.Rows[0]["SitaAddress"].ToString();
                                strEmailAddress = emaiadd;
                            }
                            var ediFilefsu = new EDIFileTransmitter();
                            ediFilefsu.ManuallyRead(dtedimessage.Rows[j]["XMLFile"].ToString());
                            //
                            edicom.UploadFileOnFtp(dtedimessage.Rows[j]["XMLFile"].ToString());
                            edicom.SendMailonSitaAndEmailAddress("", dtedimessage.Rows[j]["XMLFile"].ToString(), "nGen - System Generated Message", emaiadd, "");
                            var dtupload = edicom.MakeEdiMessageCountTable();
                            var messageformat = edicom.MakeMailMessageFormat(strSitaAddress, string.Empty, string.Empty);
                            var strfmessageText = messageformat + dtedimessage.Rows[j]["XMLFile"].ToString().Replace("<br/>", "\r\n").Replace(
                                                    "\r\n", Environment.NewLine);
                            DataRow dataRow = dtupload.NewRow();
                            dataRow["FlightNo"] = ds.Tables[0].Rows[0]["FlightNo"];
                            dataRow["UpdatedOn"] = DateTime.Now;
                            dataRow["AWBNo"] = ds.Tables[0].Rows[0]["AWBNo"];
                            dataRow["CarrierCode"] = ds.Tables[0].Rows[0]["FlightNo"].ToString().Split('-')[0];
                            dataRow["FlightDate"] = Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]);
                            dataRow["FlightOrigin"] = ds.Tables[0].Rows[0]["OriginCity"];
                            dataRow["FlightDestination"] = ds.Tables[0].Rows[0]["DestinationCity"];
                            dataRow["CityCode"] = ds.Tables[0].Rows[0]["OriginCity"];
                            dataRow["MovementType"] = 2;
                            dataRow["IsUploaded"] = 1;
                            dataRow["SentAddress"] = strSitaAddress;
                            dataRow["MessageType"] = dtedimessage.Rows[j]["EDIMessage"].ToString();
                            dataRow["GeneratedXml"] = strfmessageText;
                            dataRow["SentAddress"] = strSitaAddress;
                            dataRow["UpdateBy"] = 2;
                            dtupload.Rows.Add(dataRow);
                            //
                            edicom.InsertRecordMessagecount(dtupload);
                            //

                        }

                    }
                }
            }
            //catch(Exception ex)// (Exception ex)
            //{

            //}
            catch (Exception ex)//
            {
                throw ex;
            }
            // string FlightNo, DateTime FlightDate, string CarrierCode = "", string Destination = "", string AWBNo = "", string origin = ""
            // DataTable dtedi = GetMessageList(CarrierCode, Destination, MessageName);

        }


        ///////////
        public DataTable GetMessageList(string CarrierCode, string Destination, string MessageName)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@Destination", Destination), new SqlParameter("@MessageName", MessageName) };
                dt = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "EdiAutomaticConfig", Parameters).Tables[0];
                return dt;
            }
            //catch(Exception ex)//
            //{
            //    return dt;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetSPHCCheckList(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSPHCCheckList", Parameters);
                ds.Dispose();
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(ds);
                return JSONString;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
            //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);      
        }

        public string SaveCheckList(Int32 AWBSNo, List<CheckListTrans> CheckListTrans, List<FooterArray> FooterArray, bool XRay, string Remarks, Int32 UpdatedBy)
        {
            DataTable dtCheckListTrans = CollectionHelper.ConvertTo(CheckListTrans, "");
            DataTable dtFooterArray = CollectionHelper.ConvertTo(FooterArray, "");

            SqlParameter paramCheckListTrans = new SqlParameter();
            paramCheckListTrans.ParameterName = "@CheckListTransType";
            paramCheckListTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramCheckListTrans.Value = dtCheckListTrans;

            SqlParameter paramFooterArray = new SqlParameter();
            paramFooterArray.ParameterName = "@FooterArray";
            paramFooterArray.SqlDbType = System.Data.SqlDbType.Structured;
            paramFooterArray.Value = dtFooterArray;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramCheckListTrans, paramFooterArray, new SqlParameter("@XRay", XRay), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveCheckList", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }



        public static void DeleteSelectedFiles()
        {
            try
            {
                if (System.IO.Directory.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/")))
                {
                    string[] files = System.IO.Directory.GetFiles(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/"));
                    foreach (string s in files)
                    {
                        if (s.Split('\\').Last().Split('_')[0] == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                        {
                            File.Delete(s);
                        }
                    }
                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public static byte[] ReadFile(string imageLocation)
        {
            try
            {
                byte[] imageData = null;
                FileInfo fileInfo = new FileInfo(imageLocation);
                long imageFileLength = fileInfo.Length;
                FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
                BinaryReader br = new BinaryReader(fs);
                imageData = br.ReadBytes((int)imageFileLength);
                fs.Dispose();
                br.Dispose();
                return imageData;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtAWBEDox(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtAWBEDox", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult AcceptanceNoteData(Int32 AWBSNo)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AcceptanceNoteData", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["Sno"].ToString());
                    cur.Add(dr["ShipperName"].ToString());
                    cur.Add(dr["UpdatedOn"].ToString());
                    cur.Add(dr["OriginCity"].ToString());
                    cur.Add(dr["Pieces"].ToString());
                    cur.Add(dr["GrossWeight"].ToString());
                    cur.Add(dr["VolumeWeight"].ToString());
                    cur.Add(dr["OriginCity"].ToString());
                    cur.Add(dr["DestinationCity"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest, string GrossWeight, string VolumeWeight, string AWBSNo, string SPHC, string FreightType, string Pieces, string ProductSno, string AgentSNo, string AirlineSNo, string CommoditySNo)
        {
            DataSet ds;
            SqlParameter[] Parameters = {
                                            new SqlParameter("@DailyFlightSNo", DlyFlghtSno),
                                            new SqlParameter("@Origin", Origin),
                                            new SqlParameter("@Dest", Dest),
                                            new SqlParameter("@GrossWeight", GrossWeight),
                                            new SqlParameter("@VolumeWeight", VolumeWeight),
                                            new SqlParameter("@AWBSNo", AWBSNo) ,
                                            new SqlParameter("@SPHC", SPHC),
                                            new SqlParameter("@FreightType", FreightType),
                                            new SqlParameter("@Pieces", Pieces),
                                            new SqlParameter("@ProductSNo", ProductSno),
                                            new SqlParameter("@AgntEmb", AgentSNo),
                                            new SqlParameter("@AirLineEmb", AirlineSNo),
                                            new SqlParameter("@CommoditySNoEmb", CommoditySNo),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateCutoffTime", Parameters);
                // return ds.Tables[0].Rows[0][0].ToString();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            //catch(Exception ex)//
            //{
            //    return "";
            //}
            catch (Exception ex)//
            {
                throw ex;
            }

        }

        public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetShipperConsigneeDetails_TaxID(string UserType, string TaxId, Int32 SNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@TaxId", TaxId), new SqlParameter("@SNO", 0) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetails_TaxID", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string GetProcessSequence(string ProcessName)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequence", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        // Add By Sushant On 31-05-2018
        public string PagerightsCheck(string GroupSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@MenuSNo", ""), new SqlParameter("@GroupSNo", GroupSNo)
                                                , new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                              , new SqlParameter("@PageName", "Acceptance")};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageRightsAcceptance", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        //public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        public Stream GetWebForm(AcceptanceGetWebForm model)
        {
            try
            {
                return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, LoggedInCity: LoggedInCity);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetHouseAcceptanceGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string HAWBNo, string LoggedInCity)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, HAWBNo: HAWBNo, LoggedInCity: LoggedInCity);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        // Created by Manoj Kumar on 16.7.2015 for FlightControl

        //public Stream GetFlightGridData(string processName, string moduleName, string appName, string BoardingPoint, string EndPoint, string FlightNo, string FlightDate, string LoggedInCity, string FlightStatus)
        //{
        //    return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: BoardingPoint, DestinationCity: EndPoint, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: "A~A", AWBNo: "A~A", LoggedInCity: LoggedInCity, FlightStatus: FlightStatus);
        //}
        //public Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo)
        //{
        //    return BuildWebForm(processName, moduleName, appName, "IndexView", FlightSNo: FlightSNo);
        //}
        // End
        public Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo, string SPHCSNo = "", string ChecklistTypeName = "", string Column1Name = "", string Column2Name = "", string Column3Name = "")
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo, SPHCSNo: SPHCSNo, ChecklistTypeName: ChecklistTypeName, Column1Name: Column1Name, Column2Name: Column2Name, Column3Name: Column3Name);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "", string SPHCSNo = "", string ChecklistTypeName = "", string Column1Name = "", string Column2Name = "", string Column3Name = "")
        {
            try
            {
                LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
                this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
                StringBuilder myCurrentForm = new StringBuilder();
                switch (this.DisplayMode)
                {
                    case DisplayModeNew:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeSearch:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeDuplicate:

                        break;
                    case DisplayModeEdit:

                        break;
                    case DisplayModeDelete:

                        break;
                    case DisplayModeIndexView:
                        switch (processName)
                        {
                            case "HOUSE":
                                if (appName.ToUpper().Trim() == "BOOKING")
                                    CreateHouseAcceptanceGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, HAWBNo, LoggedInCity);
                                else if (appName.ToUpper().Trim() == "SHIPPINGBILL")
                                    CreateShippingBillGrid(myCurrentForm, HAWBSNo: AWBSNo);
                                else if (appName.ToUpper().Trim() == "CHECKLIST")
                                    CreateCheckListDetailGrid(myCurrentForm, HAWBSNo: AWBSNo, CheckListTypeSNo: "5");
                                else if (appName.ToUpper().Trim() == "CHECKLIST_SPHC")
                                    CreateCheckListDetailGrid(myCurrentForm, HAWBSNo: AWBSNo, CheckListTypeSNo: "-1");
                                break;
                            case "ACCEPTANCE":
                                if (appName.ToUpper().Trim() == "BOOKING")
                                    CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity);
                                else if (appName.ToUpper().Trim() == "HOUSEWAYBILL")
                                    CreateHAWBGrid(myCurrentForm, AWBSNo);
                                else if (appName.ToUpper().Trim() == "SHIPPINGBILL")
                                    CreateShippingBillGrid(myCurrentForm, AWBSNo: AWBSNo);
                                else if (appName.ToUpper().Trim() == "CHECKLIST")
                                    CreateCheckListDetailGrid(myCurrentForm, AWBSNo: AWBSNo, CheckListTypeSNo: "5", ChecklistTypeName: ChecklistTypeName, Column1Name: Column1Name, Column2Name: Column2Name, Column3Name: Column3Name);
                                //-- RH 030815 starts
                                else if (appName.ToUpper().Trim() == "CHECKLIST_SPHC")
                                    CreateCheckListDetailGrid(myCurrentForm, AWBSNo: AWBSNo, CheckListTypeSNo: "-1", SPHCSNo: SPHCSNo, ChecklistTypeName: ChecklistTypeName, Column1Name: Column1Name, Column2Name: Column2Name, Column3Name: Column3Name);
                                else if (appName.ToUpper().Trim() == "EDIDETAILS")
                                    CreateEDIGrid(myCurrentForm, AWBNo, FlightDate, FlightNo);
                                //-- RH 030815 ends
                                break;
                            case "FLIGHTOPERATION":
                                if (appName.ToUpper().Trim() == "FLIGHTCONTROL")
                                    CreateFlightControlGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, FlightDate, FlightStatus, LoggedInCity);
                                else if (appName.ToUpper().Trim() == "FLIGHTAWB")
                                    CreateFlightAWBGrid(myCurrentForm, FlightSNo);
                                else if (appName.ToUpper().Trim() == "FLIGHTLYING")
                                {
                                    CreateFlightLyingListSearch(myCurrentForm);
                                    CreateFlightLyingGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, AWBNo);

                                }
                                break;
                            default:
                                break;
                        }
                        if (processName == "HOUSE" && appName.ToUpper().Trim() == "BOOKING")
                        {

                        }


                        //else if (appName.ToUpper().Trim() == "FLIGHTCONTROL")
                        //    CreateFlightControlGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, FlightDate,FlightStatus, LoggedInCity);
                        //else if (appName.ToUpper().Trim() == "FLIGHTAWB")
                        //    CreateFlightAWBGrid(myCurrentForm,FlightSNo);
                        break;
                    case DisplayModeReadView:

                        break;
                    default:
                        break;
                }
                byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "")
        {
            try
            {
                using (Grid g = new Grid())
                {

                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsActionRequired = false;

                    g.DataSoruceUrl = "Services/Shipment/BookingService.svc/GetWMSWaybillGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;

                    //g.UserID = ((Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
                    g.FormCaptionText = "Acceptance";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsAllowedFiltering = true;
                    g.ProcessName = ProcessName;
                    g.IsFormHeader = false;
                    g.IsShowGridHeader = false;
                    g.IsSortable = false;
                    g.SuccessGrid = "BindSubProcess";

                    //  string Userid= ((Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    string SLICaption = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["SLICaption"].ToString();
                    string SLiNo, SLIStatus;
                    SLiNo = SLICaption + " No";
                    SLIStatus = SLICaption + " Status";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "Warning!!", IsHidden = false, DataType = GridDataType.String.ToString(), Template = "#if(IsWarning==true && LateAWBHoldSNo>0 ){#<a onclick=\"CheckRequestApproval(#=LateAWBHoldSNo#,#=IsApprovedLateAWBHold#);\" style=\"cursor:pointer;\" ><img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\"></a>#} else if(IsWarning==true) {#<img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\">#}#", Width = 20, Filterable = "false" });

                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 75 });
                    if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "GA")
                    {
                        g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = SLiNo, DataType = GridDataType.String.ToString(), IsHidden = false, Width = 60 });
                    }
                    else
                    {
                        g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = SLiNo, DataType = GridDataType.String.ToString(), Width = 60 });
                    }
                    //g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = SLiNo, DataType = GridDataType.String.ToString(), Width = 60 });
                    //g.Column.Add(new GridColumn { Field = "SLIStatus", IsLocked = false, Title = SLIStatus, DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "AgentName", IsLocked = false, Title = "Agent Name", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });

                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ShipmentDestination", IsLocked = false, Title = "Final Dest", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Status", IsLocked = false, Title = "Status", DataType = GridDataType.String.ToString(), Width = 45 });
                    g.Column.Add(new GridColumn { Field = "AdviceCode", IsLocked = false, Title = "Advice Code", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 70, Template = "# if( AWBDate==null) {# # } else {# #= kendo.toString(new Date(data.AWBDate.getTime() + data.AWBDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "Pcs", IsHidden = true, Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Gross", IsHidden = true, Title = "Gross Weight", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Volume", IsHidden = true, Title = "Volume Weight", DataType = GridDataType.String.ToString(), Width = 40 });

                    var temp = ((Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ClientEnvironment"].ToString().ToUpper().Trim() == "TH" ? "<span title='AWB (Total pc/wt)'>AWB (Total pc/wt)</span>" : "<span title='FWB (Pcs / Wt)'>FWB (Pcs / Wt)</span>";
                    g.Column.Add(new GridColumn { Field = "FWBPCSWT", IsLocked = false, HeaderTemplate = temp, Title = temp, DataType = GridDataType.String.ToString(), Width = 70 });

                    g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "SPHC", IsLocked = false, Title = "SHC", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flt Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 70, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "ETD", Title = "ETD", DataType = GridDataType.String.ToString(), IsHidden = false, Width = 70 });
                    g.Column.Add(new GridColumn { Field = "ETA", Title = "ETA", DataType = GridDataType.String.ToString(), IsHidden = false, Width = 70 });

                    g.Column.Add(new GridColumn { Field = "AcceptanceTime", Title = "Acceptance Time", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AcceptanceDate", Title = "Acceptance Date", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "UserName", Title = "USER", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "TerminalName", Title = "Terminal", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "InternationalORDomestic", Title = "Type", DataType = GridDataType.String.ToString(), IsHidden = false, Width = 40 });

                    //g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    //g.Column.Add(new GridColumn { Field = "ChWt", Title = "Ch. Wt", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });

                    //g.Column.Add(new GridColumn { Field = "SLIPCSWT", IsLocked = false, Title = "FWB (Pcs / Wt)", DataType = GridDataType.String.ToString(), Width = 70 });



                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });

                    g.Column.Add(new GridColumn { Field = "AccPcs", Title = "AccPcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccGrWt", Title = "AccGrWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccVolWt", Title = "AccVolWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "FBLWt", Title = "FBLWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                    g.Column.Add(new GridColumn { Field = "FWBWt", Title = "FWBWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                    g.Column.Add(new GridColumn { Field = "RCSWt", Title = "RCSWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                    g.Column.Add(new GridColumn { Field = "IsDirectAcceptance", Title = "IsDirectAcceptance", DataType = GridDataType.String.ToString(), IsHidden = true });// Added by RH 19-01-17 for direct awb flag

                    g.Column.Add(new GridColumn { Field = "TransactionType", Title = "TransactionType", DataType = GridDataType.Number.ToString(), IsHidden = true });// Added by Jk 12 July 2017 for Transactiontype in account
                    g.Column.Add(new GridColumn { Field = "AccountTypeSNo", Title = "AccountTypeSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });// Added by Jk 18 oct 2017 for AccountTypeSNo in account

                    g.Column.Add(new GridColumn { Field = "OriginAirportCode", Title = "OriginAirportCode", DataType = GridDataType.String.ToString(), IsHidden = true });// Added by Tarun 05/01//18 
                    g.Column.Add(new GridColumn { Field = "DestinationAirportCode", Title = "DestinationAirportCode", DataType = GridDataType.String.ToString(), IsHidden = true });// Added by Tarun 05/01//18 
                    g.Column.Add(new GridColumn { Field = "SLISNo", Title = "SLISNo", DataType = GridDataType.String.ToString(), IsHidden = true });// Added by Tarun 10/07//18 
                    g.Column.Add(new GridColumn { Field = "RECEIPTSNO", Title = "RECEIPTSNO", DataType = GridDataType.String.ToString(), IsHidden = true });// Added by jk 24/12//18 
                    g.Column.Add(new GridColumn { Field = "WOSNO", Title = "WOSNO", DataType = GridDataType.String.ToString(), IsHidden = true });// Added by jk 24/12//18 
                    g.Column.Add(new GridColumn { Field = "INVOICESNO", Title = "INVOICESNO", DataType = GridDataType.String.ToString(), IsHidden = true });// Added by jk 24/12//18 

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container);

                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateHAWBGrid(StringBuilder Container, string AWBSNo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/Shipment/BookingService.svc/GetWMSHAWBGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "HAWB Details";
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "HAWBNo", IsLocked = true, Title = "HAWBNo", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "OriginCity", IsLocked = true, Title = "Org", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "DestinationCity", IsLocked = true, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gr. Wt.", DataType = GridDataType.Number.ToString(), Width = 90, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Vol. Wt.", DataType = GridDataType.Number.ToString(), Width = 90, Format = "n" });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBSNo", Value = AWBSNo });

                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateEDIGrid(StringBuilder Container, string AWBNo = "", string FlightDate = "", string FlightNo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/Shipment/BookingService.svc/GetEDIGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "EDI Message Details";
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "CarrierCode", Title = "Carrier Code", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "MessageType", Title = "Type", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No.", DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "FlightOrigin", Title = "Org.", DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "FlightDestination", Title = "Dest.", DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "SentAddress", Title = "Address", DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "UpdatedOn", Title = "Message Date", DataType = GridDataType.String.ToString(), Width = 100 });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateShippingBillGrid(StringBuilder Container, string AWBSNo = "", string HAWBSNo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    if (AWBSNo != "")
                        g.DataSoruceUrl = "Services/Shipment/BookingService.svc/GetWMSShipppingBillGridData";
                    else
                        g.DataSoruceUrl = "Services/House/HouseService.svc/GetHousehipppingBillGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Shipping Bill Details";
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ShippingBillNo", IsLocked = true, Title = "ShippingBill No", DataType = GridDataType.String.ToString(), Width = 100 });
                    g.Column.Add(new GridColumn { Field = "MessageType", IsLocked = true, Title = "Message Type", DataType = GridDataType.String.ToString(), Width = 100 });
                    if (AWBSNo != "")
                    {
                        g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = true, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                        g.Column.Add(new GridColumn { Field = "AWBType", IsLocked = true, Title = "AWB Type", DataType = GridDataType.String.ToString(), Width = 90 });
                    }
                    else
                    {
                        g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = true, Title = "House No", DataType = GridDataType.String.ToString(), Width = 90 });
                    }
                    g.Column.Add(new GridColumn { Field = "LEONo", Title = "LEO No", DataType = GridDataType.String.ToString(), Width = 90 });

                    g.ExtraParam = new List<GridExtraParam>();
                    if (AWBSNo != "")
                        g.ExtraParam.Add(new GridExtraParam { Field = "AWBSNo", Value = AWBSNo });
                    else
                        g.ExtraParam.Add(new GridExtraParam { Field = "HAWBSNo", Value = HAWBSNo });

                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateCheckListDetailGrid(StringBuilder Container, string AWBSNo = "", string HAWBSNo = "", string CheckListTypeSNo = "", string SPHCSNo = "", string ChecklistTypeName = "", string Column1Name = "", string Column2Name = "", string Column3Name = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 500;
                    g.IsAllowCopy = false;
                    if (AWBSNo != "")
                        g.DataSoruceUrl = "Services/Shipment/BookingService.svc/GetWMSCheckListGridData";
                    else
                        g.DataSoruceUrl = "Services/House/HouseService.svc/GetHouseCheckListGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;

                    //g.IsRefresh = false;
                    //g.IsPager = false;
                    //g.IsPageable = false;
                    //g.IsPageSizeChange = false;
                    g.SuccessGrid = "HideHeaderSno";

                    g.FormCaptionText = ChecklistTypeName == "0" ? "CHECK LIST DETAILS" : ChecklistTypeName;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "CheckListTypeSNo", Title = "CheckListTypeSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    // g.Column.Add(new GridColumn { Field = "SrNo", Title = "Sr. No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "SrNo", Title = "Sr. No", Template = "<span>#= SrNo #<span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Description", Title = "Description", Template = "<span style=\"width:400px;\">#= Description #<span>", DataType = GridDataType.String.ToString(), Width = 400 });
                    g.Column.Add(new GridColumn { Field = "Y", Title = "Y", Template = "# if( Y==1) {#<input type=\"radio\" id=\"rbtnY\" value=\"Y\" onclick=\"MarkSelectedChecklist(this);\"/># } else if(Y==2){#<input type=\"radio\" id=\"rbtnY\" value=\"Y\"  checked=\"1\" onclick=\"MarkSelectedChecklist(this);\"/># } #", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "N", Title = "N", Template = "# if( N==1) {#<input type=\"radio\" id=\"rbtnN\" value=\"N\" onclick=\"MarkSelectedChecklist(this);\"/>#} else if(N==2){#<input type=\"radio\" id=\"rbtnN\" value=\"N\"  checked=\"1\" onclick=\"MarkSelectedChecklist(this);\"/># } #", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "NA", Title = "NA", DataType = GridDataType.String.ToString(), Template = "# if( NA==1) {#<input type=\"radio\" id=\"rbtnNA\" value=\"NA\" onclick=\"MarkSelectedChecklist(this);\"/># } else if(NA==2){#<input type=\"radio\" id=\"rbtnNA\" value=\"NA\"  checked=\"1\" onclick=\"MarkSelectedChecklist(this);\"/># } #", Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Remarks", Title = "Remarks", Template = "# if( Remarks != \"@\" ) {#<input type=\"text\" id=\"txt_Remarks\" value=\"#=Remarks#\"  style=\"text-transform: uppercase;width: 120px;\"  /># } #", DataType = GridDataType.String.ToString(), Width = 120 });
                    if (Column1Name != "0")
                    {
                        g.Column.Add(new GridColumn { Field = "Column1", Title = Column1Name, Template = "# if( Column1 != \"@\" ) {#<input type=\"text\" id=\"txt_Column1\" value=\"#=Column1#\"  style=\"text-transform: uppercase;width: 65px;\"  /># } #", DataType = GridDataType.String.ToString(), Width = 80 });
                    }
                    if (Column2Name != "0")
                    {
                        g.Column.Add(new GridColumn { Field = "Column2", Title = Column2Name, Template = "# if( Column2 != \"@\" ) {#<input type=\"text\" id=\"txt_Column2\" value=\"#=Column2#\"  style=\"text-transform: uppercase;width: 65px;\"  /># } #", DataType = GridDataType.String.ToString(), Width = 80 });
                    }
                    if (Column3Name != "0")
                    {
                        g.Column.Add(new GridColumn { Field = "Column3", Title = Column3Name, Template = "# if( Column3 != \"@\" ) {#<input type=\"text\" id=\"txt_Column3\" value=\"#=Column3#\"  style=\"text-transform: uppercase;width: 65px;\"  /># } #", DataType = GridDataType.String.ToString(), Width = 80 });
                    }



                    g.ExtraParam = new List<GridExtraParam>();
                    if (AWBSNo != "")
                        g.ExtraParam.Add(new GridExtraParam { Field = "AWBSNo", Value = AWBSNo });
                    else
                        g.ExtraParam.Add(new GridExtraParam { Field = "HAWBSNo", Value = HAWBSNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "CheckListTypeSNo", Value = CheckListTypeSNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SPHCSNo", Value = SPHCSNo });

                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdateAWBSummary(Int32 AWBSNo, List<SummaryArray> Summary, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment)
        {
            DataTable dtSummary = CollectionHelper.ConvertTo(Summary, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramAWBSummary = new SqlParameter();
            paramAWBSummary.ParameterName = "@AWBSummaryType";
            paramAWBSummary.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSummary.Value = dtSummary;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramAWBSummary,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@isAmmendment", isAmmendment),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBSummary", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<DimensionsArray> Dimensions, List<ULDDimensionsArray> ULDDimension, List<AWBOtherChargeArray> OtherCharge, List<AWBRateArray> RateArray, List<TactRateArray> TactRateArray, Int32 UpdatedBy, string isAmmendment, string PrintRateCode, string PublishedRate, string UserRate, string RateDiffRemarks, string isChargableAmendment)
        {
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");//hdnChildData
            DataTable dtAWBULDTrans = CollectionHelper.ConvertTo(ULDDimension, "");
            List<ChildData> lstChildData = new List<ChildData>();
            DataTable dtDimensionTrans = CollectionHelper.ConvertTo(lstChildData, "");
            DataTable dtOtherCharge = CollectionHelper.ConvertTo(OtherCharge, "");
            DataTable dtAWBRate = CollectionHelper.ConvertTo(RateArray, "");
            DataTable dtTactRateArray = CollectionHelper.ConvertTo(TactRateArray, "");

            GetDimensionTransData(dtDimensionTrans, dtDimensions, dtAWBULDTrans);

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramDimensions = new SqlParameter();
            paramDimensions.ParameterName = "@RateDimensions";
            paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensions.Value = dtDimensions;

            SqlParameter paramDimensionsTrans = new SqlParameter();
            paramDimensionsTrans.ParameterName = "@RateDimensionsTrans";
            paramDimensionsTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensionsTrans.Value = dtDimensionTrans;

            SqlParameter paramAWBULDTrans = new SqlParameter();
            paramAWBULDTrans.ParameterName = "@ULDRateDimensions";
            paramAWBULDTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBULDTrans.Value = dtAWBULDTrans;

            SqlParameter paramOtherCharge = new SqlParameter();
            paramOtherCharge.ParameterName = "@OtherCharge";
            paramOtherCharge.SqlDbType = System.Data.SqlDbType.Structured;
            paramOtherCharge.Value = dtOtherCharge;

            SqlParameter paramAwbRate = new SqlParameter();
            paramAwbRate.ParameterName = "@AwbRate";
            paramAwbRate.SqlDbType = System.Data.SqlDbType.Structured;
            paramAwbRate.Value = dtAWBRate;

            SqlParameter paramTactRateArray = new SqlParameter();
            paramTactRateArray.ParameterName = "@TactRate";
            paramTactRateArray.SqlDbType = System.Data.SqlDbType.Structured;
            paramTactRateArray.Value = dtTactRateArray;




            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramDimensions,
                                            paramDimensionsTrans,
                                            paramAWBULDTrans,
                                            paramOtherCharge,
                                            paramAwbRate,
                                            paramTactRateArray,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@isAmmendment", isAmmendment),
                                            new SqlParameter("@PrintRateCode", PrintRateCode),
                                            new SqlParameter("@PublishedRate", PublishedRate),
                                            new SqlParameter("@UserRate", UserRate),
                                            new SqlParameter("@RateDiffRemarks", RateDiffRemarks),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateRateDimemsionsAndULD", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        private void GetDimensionTransData(DataTable dtDimensionTrans, DataTable dtDimensions, DataTable dtAWBULDTrans)
        {
            try
            {
                for (int j = 0; j < dtDimensions.Rows.Count; j++)
                {
                    if (dtDimensions.Rows[j]["hdnChildData"].ToString() != "")
                    {
                        DataTable Temp = (DataTable)JsonConvert.DeserializeObject(dtDimensions.Rows[j]["hdnChildData"].ToString(), (typeof(DataTable)));
                        foreach (DataRow dtRow in Temp.Rows)
                        {
                            DataRow dr = dtDimensionTrans.NewRow();
                            dr["SNo"] = dtDimensions.Rows[j]["SNo"];
                            dr["AWBSNo"] = dtRow["AWBSNo"].ToString();
                            dr["Length"] = dtRow["Length"].ToString();
                            dr["Width"] = dtRow["Width"].ToString();
                            dr["Height"] = dtRow["Height"].ToString();
                            dr["MeasurementUnitCode"] = dtRow["MeasurementUnitCode"].ToString();
                            dr["Pieces"] = dtRow["Pieces"].ToString();
                            dr["VolumeWeight"] = dtRow["VolumeWeight"].ToString();
                            dr["VolumeUnit"] = dtRow["VolumeUnit"].ToString();
                            dr["AWBRateDescriptionSNo"] = dtRow["AWBRateDescriptionSNo"].ToString();
                            dtDimensionTrans.Rows.Add(dr);

                        }
                    }

                }
                dtDimensions.Columns.Remove("hdnChildData");
                for (int i = 0; i < dtAWBULDTrans.Rows.Count; i++)
                {
                    dtAWBULDTrans.Rows[i]["ChargeLineCount"] = i + 1;
                }
                dtDimensionTrans.AcceptChanges();
                dtDimensions.AcceptChanges();
                dtAWBULDTrans.AcceptChanges();
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }
        #region HOUSE ACCEPTANCE GRID

        private void CreateHouseAcceptanceGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/House/HouseService.svc/GetWMSHouseGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "House Acceptance";
                    g.IsPageable = true;
                    g.IsAllowedPaging = true;
                    g.IsProcessPart = true;
                    g.IsRowChange = true;//added by Manoj Kumar
                    g.IsRowDataBound = true;//added by Manoj Kumar
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;
                    g.ProcessName = ProcessName;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "HAWBNo", Title = "House No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "HAWBDate", Title = "House Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "DestinationCity", Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ChargeableWeight", Title = "Ch. Wt", IsHidden = true, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });

                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AccPcs", Title = "AccPcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccGrWt", Title = "AccGrWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccVolWt", Title = "AccVolWt", DataType = GridDataType.Number.ToString(), IsHidden = true });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "HAWBNo", Value = HAWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container);

                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        #endregion

        #region FlightOperation

        public Stream GetFlightGridData(string processName, string moduleName, string appName, string BoardingPoint, string EndPoint, string FlightNo, string FlightDate, string LoggedInCity, string FlightStatus)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: BoardingPoint, DestinationCity: EndPoint, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: "A~A", AWBNo: "A~A", LoggedInCity: LoggedInCity, FlightStatus: FlightStatus);
        }

        public Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", FlightSNo: FlightSNo);
        }

        private void CreateFlightAWBGrid(StringBuilder Container, string FlightSNo = "")
        {
            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/FlightOperation/FlightControlService.svc/GetWMSFlightAWBGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "AWB Details";
                g.IsPageSizeChange = false;
                g.IsPager = false;
                g.IsOnlyTotalDisplay = true;
                g.SuccessGrid = "BindULDType";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==true) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\" onclick=\"MarkSelected(this);\"/># } else {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"   onclick=\"MarkSelected(this);\"/># } #", DataType = GridDataType.Boolean.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.Decimal.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", DataType = GridDataType.String.ToString(), Width = 110 });
                g.Column.Add(new GridColumn { Field = "PlannedPieces", Title = "Planned Pieces", Template = "<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" style=\"width:30px;\" onkeyup=\"fn_CheckNum(this);\" />", DataType = GridDataType.Number.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Planned G/V/CBM", Template = "<input type=\"text\" id=\"txtPG\" value=\"#=PG#\" style=\"width:30px;\" />/<input type=\"text\" id=\"txtPV\" value=\"#=PV#\" style=\"width:30px;\" />/<input type=\"text\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:30px;\" />", DataType = GridDataType.String.ToString(), Width = 110 });
                g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 60 });
                // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Agent", Title = "Agent", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Template = " <select id=\"txtPriority\" ></select><input type=\"hidden\" value=\"#=Priority#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD Type", Template = " <select id=\"SULDType\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", Template = "<input type=\"text\" id=\"txt_ULDGroupNo\" value=\"#=ULDGroupNo#\" style=\"width:30px;\" />", DataType = GridDataType.String.ToString(), Width = 60 });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightSNo", Value = FlightSNo });

                g.InstantiateIn(Container);
            }
        }
        private void CreateFlightLyingGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string AWBNo = "")
        {
            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/FlightOperation/FlightControlService.svc/GetLyingListGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Lying List";
                g.IsPageSizeChange = false;
                g.IsPager = false;
                g.IsOnlyTotalDisplay = true;
                g.SuccessGrid = "BindULDType";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==true) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\" onclick=\"MarkSelected(this);\"/># } else {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"   onclick=\"MarkSelected(this);\"/># } #", DataType = GridDataType.Boolean.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                // g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.Decimal.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", DataType = GridDataType.String.ToString(), Width = 110 });
                g.Column.Add(new GridColumn { Field = "PlannedPieces", Title = "Planned Pieces", Template = "<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" style=\"width:30px;\" onkeyup=\"fn_CheckNum(this);\" />", DataType = GridDataType.Number.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Planned G/V/CBM", Template = "<input type=\"text\" id=\"txtPG\" value=\"#=PG#\" style=\"width:30px;\" />/<input type=\"text\" id=\"txtPV\" value=\"#=PV#\" style=\"width:30px;\" />/<input type=\"text\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:30px;\" />", DataType = GridDataType.String.ToString(), Width = 110 });
                g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 60 });
                // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Agent", Title = "Agent", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Template = " <select id=\"txtPriority\" ></select><input type=\"hidden\" value=\"#=Priority#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD Type", Template = " <select id=\"SULDType\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", Template = "<input type=\"text\" id=\"txt_ULDGroupNo\" value=\"#=ULDGroupNo#\" style=\"width:30px;\" />", DataType = GridDataType.String.ToString(), Width = 60 });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });


                g.InstantiateIn(Container);
            }
        }

        public KeyValuePair<string, List<GetDimemsionsAndULDNew>> GetDimemsionsAndULDNew(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            GetDimemsionsAndULDNew officeCommision = new GetDimemsionsAndULDNew();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDNew", Parameters);
            var GetDimemsionsAndULDNewList = ds.Tables[0].AsEnumerable().Select(e => new GetDimemsionsAndULDNew
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                HAWBSNo = Convert.ToInt32(e["HAWBSNo"]),
                NoOfPieces = Convert.ToInt32(e["NoOfPieces"]),
                WeightCode = e["WeightCode"].ToString(),
                GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString() == "" ? "0" : e["GrossWeight"].ToString()),
                hdnVolWeight = Convert.ToDecimal(e["hdnVolWeight"].ToString() == "" ? "0" : e["hdnVolWeight"].ToString()),
                RateClassCode = e["txtRateClassCode"].ToString(),
                HdnRateClassCode = e["RateClassCode"].ToString(),
                CommodityItemNumber = Convert.ToInt32(e["CommodityItemNumber"]),
                ChargeableWeight = Convert.ToDecimal(e["ChargeableWeight"].ToString() == "" ? "0" : e["ChargeableWeight"].ToString()),
                Charge = Convert.ToDecimal(e["Charge"].ToString() == "" ? "0" : e["Charge"].ToString()),
                ChargeAmount = Convert.ToDecimal(e["ChargeAmount"].ToString() == "" ? "0" : e["ChargeAmount"].ToString()),
                HarmonisedCommodityCode = e["HarmonisedCommodityCode"].ToString(),
                HdnCountry = Convert.ToInt32(e["CountrySNo"].ToString()),
                Country = e["txtCountry"].ToString(),
                NatureOfGoods = e["NatureOfGoods"].ToString(),
                ConsolDesc = e["ConsolDesc"].ToString(),
                hdnChildData = e["hdnChildData"].ToString(),

            });
            return new KeyValuePair<string, List<GetDimemsionsAndULDNew>>(ds.Tables[1].Rows[0][0].ToString(), GetDimemsionsAndULDNewList.AsQueryable().ToList());
        }

        public KeyValuePair<string, List<GetDimemsionsAndULDRate>> GetDimemsionsAndULDRate(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            GetDimemsionsAndULDRate officeCommision = new GetDimemsionsAndULDRate();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDRate", Parameters);
            var GetDimemsionsAndULDRateList = ds.Tables[0].AsEnumerable().Select(e => new GetDimemsionsAndULDRate
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                WeightCode = e["WeightCode"].ToString(),
                RateClassCode = e["txtRateClassCode"].ToString(),
                HdnRateClassCode = e["RateClassCode"].ToString(),
                SLAC = Convert.ToInt32(e["SLAC"]),
                HdnULD = Convert.ToInt32(e["ULDTypeSNo"]),
                ULD = e["ULDTypeCode"].ToString(),
                ULDNo = e["ULDSNo"].ToString(),
                Charge = Convert.ToDecimal(e["Charge"].ToString()),
                ChargeAmount = Convert.ToDecimal(e["ChargeAmount"].ToString()),
                HarmonisedCommodityCode = Convert.ToInt32(e["HarmonisedCommodityCode"].ToString()),
                HdnCountry = Convert.ToInt32(e["CountrySNo"].ToString()),
                Country = e["txtCountry"].ToString(),
                NatureOfGoods = e["NatureOfGoods"].ToString(),
            });
            return new KeyValuePair<string, List<GetDimemsionsAndULDRate>>(ds.Tables[1].Rows[0][0].ToString(), GetDimemsionsAndULDRateList.AsQueryable().ToList());
        }

        public KeyValuePair<string, List<GetAWBOtherChargeData>> GetAWBOtherChargeData(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            GetAWBOtherChargeData officeCommision = new GetAWBOtherChargeData();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBOtherChargeData", Parameters);
            var GetAWBOtherChargeDataList = ds.Tables[0].AsEnumerable().Select(e => new GetAWBOtherChargeData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                Type = e["Type"].ToString(),
                OtherCharge = e["OtherChargeCode"].ToString(),
                HdnOtherCharge = e["OtherChargeCode"].ToString(),
                DueType = e["DueType"].ToString(),
                Amount = Convert.ToDecimal(e["ChargeAmount"]),
            });
            return new KeyValuePair<string, List<GetAWBOtherChargeData>>(ds.Tables[1].Rows[0][0].ToString(), GetAWBOtherChargeDataList.AsQueryable().ToList());
        }


        private void CreateFlightControlGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string FlightStatus = "", string LoggedInCity = "")
        {
            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/FlightOperation/FlightControlService.svc/GetFlightControlGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Flight Control";
                g.IsPageable = true;
                g.IsAllowedPaging = true;
                g.IsProcessPart = true;
                g.IsRowChange = true;
                g.IsRowDataBound = false;
                g.IsPageSizeChange = false;
                g.IsPager = false;
                g.IsOnlyTotalDisplay = true;
                g.ProcessName = "FlightControl";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.Number.ToString(), Width = 90 });

                g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "FlightRoute", IsLocked = false, Title = "Flight Route ", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "BoardingPoint", IsLocked = false, Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 90 });
                //  g.Column.Add(new GridColumn { Field = "BoardingPoint", IsLocked = false, Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "ETD", IsLocked = false, Title = "ETD", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "EndPoint", Title = "End Point", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "ETA", Title = "ETA", DataType = GridDataType.Number.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "DAY", Title = "Day", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                g.Column.Add(new GridColumn { Field = "ACType", Title = "A/C Type", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "CAO", Title = "CAO", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "FlightStatus", Title = "Flight Status", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "BookedGrossWeight", Title = "BookedGrossWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "BookedVolumeWeight", Title = "BookedVolumeWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "BookedCBMWeight", Title = "BookedCBMWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "AvilableVolumeWeight", Title = "AvilableVolumeWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "AvilableGrossWeight", Title = "AvilableGrossWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "AvilableCBMWeight", Title = "AvilableCBMWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "BoardingPoint", Value = OriginCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "EndPoint", Value = DestinationCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightStatus", Value = FlightStatus });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.InstantiateIn(Container);

            }
        }

        private void CreateFlightLyingListSearch(StringBuilder container)
        {
            container.Append(@"<div class='mfs_rel_wrapper make_relative append_bottom5 clearfix'>
                <div class='modify_search noneAll'>
                    <div class='modify_top col-md-12 col-sm-12 hidden-xs visible-stb ng-scope'>
                        <div class='row'>
                            <div class='col-xs-12 col-sm-12'>
                                <!-- city and country -->
                                <a class='col-xs-12 col-sm-12 has_fade' style='padding-left:2px;padding-right:2px;'>
                                    <table id='tblSearch'>
                                        <tr>
                                            <td><input id='txtFlightNo' type='text' maxlength='10' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 100px; height:25px; position: relative; vertical-align: top; background-color: transparent; ' placeholder='Flight No' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><input id='txtAWBNo' type='text' maxlength='15' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 120px; height:25px; position: relative; vertical-align: top; background-color: transparent;' placeholder='AWB No'></td>
                                            <td>&nbsp;</td>
                                            <td><input id='txtOriginCity' type='text' class='input-md form-control tt-input' maxlength='10' style='font-family: Verdana; font-size: 12px;  height: 25px; width: 100px; position: relative; vertical-align: top; background-color: transparent;' placeholder='Origin City' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><input id='txtDestinationCity' type='text' maxlength='10' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 120px; height:25px; position: relative; vertical-align: top; background-color: transparent;' placeholder='Destination City' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><button class='btn btn-block btn-primary' style='margin-top:0px;' id='btnLyingListSearch' onclick='SearchLyingLst();' >Search</button></td>
                                            
                                        </tr>
                                    </table>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>");
        }


        #endregion

        public KeyValuePair<string, List<ReadyToUnloading>> GetReadyToUnloadingRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                ReadyToUnloading readyToUnloading = new ReadyToUnloading();
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetReadyToUnloadingRecord");
                var readyToUnloadingList = ds.Tables[0].AsEnumerable().Select(e => new ReadyToUnloading
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Sli = Convert.ToInt32(e["Sli"].ToString()),
                    AWBNo = e["AWBNo"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    Verified = e["Verified"].ToString(),
                    TruckNo = e["TruckNo"].ToString(),
                    ManPower = e["ManPower"].ToString(),
                    BuildEquipment = e["BuildEquipment"].ToString(),
                    HdnBuildEquipment = e["BuildEquipmentSNo"].ToString(),
                    Location = e["Location"].ToString(),
                    HdnLocation = e["LocationSNo"].ToString(),
                    StartUTime = e["StartUTime"].ToString(),
                    EndUTime = e["EndUTime"].ToString()
                });
                return new KeyValuePair<string, List<ReadyToUnloading>>(ds.Tables[0].Rows[0][0].ToString(), readyToUnloadingList.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> UpdateReadyToUnloading(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // Convert JSON string into datatable
                var dt = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                DataTable dtReadyToLoading = new DataTable();
                dtReadyToLoading.Columns.Add("SNo");
                dtReadyToLoading.Columns.Add("SLISNo");
                dtReadyToLoading.Columns.Add("TruckNo");
                dtReadyToLoading.Columns.Add("ManPower");
                dtReadyToLoading.Columns.Add("BuildEquipment");
                dtReadyToLoading.Columns.Add("StartUTime");
                dtReadyToLoading.Columns.Add("EndUTime");
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drRow = dtReadyToLoading.NewRow();
                    drRow["SNo"] = dr["SNo"];
                    drRow["SLISNo"] = dr["Sli"];
                    drRow["TruckNo"] = dr["TruckNo"];
                    drRow["ManPower"] = dr["ManPower"];
                    drRow["BuildEquipment"] = dr["HdnBuildEquipment"];
                    drRow["StartUTime"] = dr["StartUTime"];
                    drRow["EndUTime"] = dr["EndUTime"];
                    dtReadyToLoading.Rows.Add(drRow);
                }
                var dtUpdateReadyToUnloading = (new DataView(dtReadyToLoading, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ReadyToLoadingType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for update existing record
                if (dtUpdateReadyToUnloading.Rows.Count > 0)
                {
                    param.Value = dtUpdateReadyToUnloading;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateReadyToUnloading", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = "Update Successfuly";
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string CheckBOENoExist(string BOENo, string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@BOENo", BOENo) ,
                                            new SqlParameter("@AWBSNo", AWBSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckAWBBOENoExist", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAgentCreditLimt(string AccountSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AccountSNo", AccountSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentCreditLimt", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string BOEVerification(string BarcodeValue, string UserId)
        {
            try
            {
                bool returnVal = false;

                var g = new GTGetBillsClient();
                DataSet ds = g.GetBillOfEntryDetailsByBarcode(BarcodeValue);

                if (ds != null && ds.Tables.Count > 0)
                {
                    SqlParameter[] param = { new SqlParameter("@BOEVerification", SqlDbType.Structured) { Value = ds.Tables[0] },
                                        new SqlParameter("@RequestedBy",UserId)};
                    SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAcceptance_BOEVerificationLog", param);
                    returnVal = ds.Tables[0].Rows[0]["BILL_STAT"].ToString().ToUpper() == "VALID" ? true : false;
                    ds.Dispose();
                    return ds.Tables[0].Rows[0]["DEC_DATE"].ToString(); //CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                }
                return null;
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }


        public string ClearAllDimensions(string AWBSNO, int UserSNo, bool IsAmendment)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNO", AWBSNO),
                                            new SqlParameter("@UserSNo", UserSNo),
                                            new SqlParameter("@IsAmendment", IsAmendment)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAcceptance_ClearAll", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetHAWBDetails(string HAWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@HAWBSNo", HAWBSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAcceptance_GetHAWBDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return null;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string GetULDTareWt(string ULDSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ULDSNo", ULDSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAcceptance_GetULDTareWeight", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return null;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }



        public string SaveAWBEDoxDetail(int AWBSNo, List<AWBEDoxDetail> AWBEDoxDetail, List<SPHCDoxArray> SPHCDoxArray, string AllEDoxReceived, string Remarks, string PriorApproval, int UpdatedBy, string isFOC, string FOCTypeSNo, string FocRemarks)
        {
            DataTable dtAWBEDoxDetail = CollectionHelper.ConvertTo(AWBEDoxDetail, "");
            DataTable dtSPHCDoxArray = CollectionHelper.ConvertTo(SPHCDoxArray, "");

            SqlParameter paramAWBEDoxDetail = new SqlParameter();
            paramAWBEDoxDetail.ParameterName = "@AWBEDoxDetail";
            paramAWBEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBEDoxDetail.Value = dtAWBEDoxDetail;

            dtSPHCDoxArray.Columns.Add("FileBinary", typeof(byte[]));
            foreach (DataRow dr in dtSPHCDoxArray.Rows)
            {
                if (dr["AltDocName"].ToString() != "")
                {
                    var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr["AltDocName"].ToString());
                    dr["FileBinary"] = ReadFile(serverPath);
                }
            }

            SqlParameter paramAWBSPHCEDoxDetail = new SqlParameter();
            paramAWBSPHCEDoxDetail.ParameterName = "@SPHCDocDetails";
            paramAWBSPHCEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHCEDoxDetail.Value = dtSPHCDoxArray;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramAWBEDoxDetail,
                                            paramAWBSPHCEDoxDetail,
                                            new SqlParameter("@AllEDoxReceived", AllEDoxReceived),
                                            new SqlParameter("@Remarks", Remarks),
                                            new SqlParameter("@PriorApproval", PriorApproval), 
                                           // new SqlParameter("@BOEVerification", BOEVerification), 
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            //new SqlParameter("@BOENo",BOENo),
                                            //new SqlParameter("@BOEDate",BOEDate),
                                            new SqlParameter("@isFOC",isFOC),
                                            new SqlParameter("@FOCTypeSNo",FOCTypeSNo),
                                            new SqlParameter("@FocRemarks",FocRemarks)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAWBEDoxDetails", Parameters);
                DeleteSelectedFiles();
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveCustomReference(string AWBSNo, string BOEVerification, string UpdatedBy, string BOENo, string BOEDate)
        {//spAcceptance_SaveCustomeDetails
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo.ToString()),
                                            new SqlParameter("@BOEVerification", BOEVerification),
                                             new SqlParameter("@UpdatedBy", UpdatedBy),
                                            new SqlParameter("@BOENo",BOENo),
                                            new SqlParameter("@BOEDate",BOEDate)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spAcceptance_SaveCustomeDetails", Parameters);

                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string GetDimemsionsULDType(int AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsULDType", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string ValidateCutoffTimeforDim(string AWBSNo)
        {

            DataSet ds;
            SqlParameter[] Parameters = {   new SqlParameter("@AWBSNo", AWBSNo) ,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateCutoffTimeforDim", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            //catch(Exception ex)//
            //{
            //    return "";
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string CheckWtVarrience(string AWBSNo, string GrossWeight, string VolumeWeight)
        {
            DataSet ds;
            SqlParameter[] Parameters = {   new SqlParameter("@AWBSNo", AWBSNo) ,
                                            new SqlParameter("@GrossWeight", GrossWeight),
                                            new SqlParameter("@VolumeWeight", VolumeWeight),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAcceptance_CheckWtVarrience", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            //catch(Exception ex)//
            //{
            //    return "";
            //}
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string CheckEmbargoParam(Int32 AWBSNo, List<Dimensions> Dimensions, List<FlightDetails> FlightDetails, int Action, int UpdatedPcs, int DimsSHCandCommodityPermission, Int32 DimsCommodity, string DimsSPHC)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "oldPieces");
                DataTable dtFlightDetails = CollectionHelper.ConvertTo(FlightDetails, "");

                SqlParameter paramFlightDetailsInformation = new SqlParameter();
                paramFlightDetailsInformation.ParameterName = "@FlightDetailsInformation";
                paramFlightDetailsInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramFlightDetailsInformation.Value = dtFlightDetails;

                SqlParameter paramDimensions = new SqlParameter();
                paramDimensions.ParameterName = "@DimensionsType";
                paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
                paramDimensions.Value = dtDimensions;


                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                    paramDimensions,
                    paramFlightDetailsInformation,
                    new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    new SqlParameter("@Action", Action),
                    new SqlParameter("@UpdatedPcs", UpdatedPcs),
                    new SqlParameter("@DimsSHCandCommodityPermission", DimsSHCandCommodityPermission),
                    new SqlParameter("@DimsCommodity", DimsCommodity),
                    new SqlParameter("@DimsSPHC", DimsSPHC) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Acceptance_CheckEmbargoAll", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ApproveLateAcceptance(Int64 LateAWBHoldSNo)
        {//spAcceptance_SaveCustomeDetails
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@LateAWBHoldSNo", LateAWBHoldSNo),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                                             )
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveApproveLateAcceptance", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string saveSLIEquipment_Acceptance(List<SLIEquipment> SLIEqDetailsTrans)
        {
            DataTable dtSLIEqDetailsTrans = CollectionHelper.ConvertTo(SLIEqDetailsTrans, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramTempDetails = new SqlParameter();
            paramTempDetails.ParameterName = "@equipment";
            paramTempDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramTempDetails.Value = dtSLIEqDetailsTrans;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                          paramTempDetails
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLIEquipment_Acceptance", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string FillCommoditySHC(Int32 CommoditySNo, string SPHC)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CommoditySNo", CommoditySNo),
                                                new SqlParameter("@SPHC", SPHC)
                                            };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Acceptance_FillCommoditySHC", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckULDSHCCompatibality(string UldType, Int64 UldNos, Int64 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UldType", UldType),
                                            new SqlParameter("@UldNos", UldNos),
                                            new SqlParameter("@AWBSNo", AWBSNo)
                };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Acceptance_CheckULDSHCCompatibality", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetInvoicedetails(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetInvoicedetails", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string AmmendmentSpecialPermissionOfDIM(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) ,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Acceptance_AmmendmentSpecialPermissionOfDIM", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckTaxId(string TaxId, string UserType, int CountrySno)
        {
            try
            {
                SqlParameter[] Parameters = {
                                        new SqlParameter("@TaxId", TaxId),new SqlParameter("@UserType", UserType),new SqlParameter("@CountrySno", CountrySno)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Acceptance_CheckTaxId", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }


    public class SLIEquipment_Acceptance
    {
        [Order(1)]
        public string EqType { get; set; }
        [Order(2)]
        public string Equipment { get; set; }
        [Order(3)]
        public string EqNo { get; set; }
        [Order(4)]
        public int Count { get; set; }
        [Order(5)]
        public decimal TareWt { get; set; }
        [Order(6)]
        public int UpdatedBy { get; set; }
        [Order(7)]
        public string ESLINo { get; set; }
        [Order(8)]
        public string ESLISNo { get; set; }
        [Order(9)]
        public string EULDNo { get; set; }
        [Order(10)]
        public string LooseSNo { get; set; }


    }

    public class SaveAtPaymentRequest
    {

        public string AWBSNo { get; set; }
        public string TotalCash { get; set; }
        public string TotalCredit { get; set; }
        public List<HandlingCharge> lstHandlingCharge { get; set; }
        public List<AWBCheque> lstAWBCheque { get; set; }
        public string CityCode { get; set; }
        public int UpdatedBy { get; set; }
        public string BilltoAccount { get; set; }
        public string Shippername { get; set; }
        public string DONumber { get; set; }
        public string HAWBSNo { get; set; }
    }

    public class EmbargoResultArray
    {
        public string AWBSNo { get; set; }
        public string DailyFlightSNo { get; set; }
        public string IsEmbargo { get; set; }
        public string EmbMessage { get; set; }

    }
}