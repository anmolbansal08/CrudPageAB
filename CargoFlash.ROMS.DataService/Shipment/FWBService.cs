using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;
namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class FWBService : BaseWebUISecureObject, IFWBService
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveAcceptance(string AWBNo, Int32 AWBSNo, ShipmentInformation ShipmentInformation, List<AWBSPHC> lstAWBSPHC, List<ItineraryInformation> listItineraryInformation, List<DGRArray> AWBDGRTrans, Int32 UpdatedBy, string isAmmendment, string IsLateAccepTance, List<NOGArray> NOGArray, List<SHCSubGroupArray> SHCSubGroupArray, string isChargableAmendment)
        {
            List<ShipmentInformation> lstShipmentInformation = new List<ShipmentInformation>();
            lstShipmentInformation.Add(ShipmentInformation);

            //List<AWBSPHC> lstAWBSPHC = new List<AWBSPHC>();
            //lstAWBSPHC.Add(AwbSPHC);

            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "");
            DataTable dtAWBSPHC = CollectionHelper.ConvertTo(lstAWBSPHC, "");
            DataTable dtItineraryInformation = CollectionHelper.ConvertTo(listItineraryInformation, "");
            DataTable dtAWBSPHCTrans = CollectionHelper.ConvertTo(AWBDGRTrans, "SNo");
            DataTable dtNOG = CollectionHelper.ConvertTo(NOGArray, "");
            DataTable dtSHCSubGroupArray = CollectionHelper.ConvertTo(SHCSubGroupArray, "");

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
            paramAWBSPHCTrans.Value = dtAWBSPHCTrans;

            SqlParameter paramNOGTrans = new SqlParameter();
            paramNOGTrans.ParameterName = "@AWBNOGTrans";
            paramNOGTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramNOGTrans.Value = dtNOG;

            SqlParameter paramSHCSubGroupTrans = new SqlParameter();
            paramSHCSubGroupTrans.ParameterName = "@AWBSHCSubGroupTrans";
            paramSHCSubGroupTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramSHCSubGroupTrans.Value = dtSHCSubGroupArray;

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
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@isAmmendment", isAmmendment) ,
                                            new SqlParameter("@IsLateAccepTance", IsLateAccepTance),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveAcceptance", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveTransitAcceptance(string AWBNo, Int32 AWBSNo, ShipmentInformation ShipmentInformation, List<AWBSPHC> lstAWBSPHC, List<ItineraryInformation> listItineraryInformation, List<DGRArray> AWBDGRTrans, Int32 UpdatedBy, string isAmmendment, string IsLateAccepTance, List<NOGArray> NOGArray, List<SHCSubGroupArray> SHCSubGroupArray, string isChargableAmendment, List<SHCTemp> SHCTemp)
        {
            List<ShipmentInformation> lstShipmentInformation = new List<ShipmentInformation>();
            lstShipmentInformation.Add(ShipmentInformation);

            //List<AWBSPHC> lstAWBSPHC = new List<AWBSPHC>();
            //lstAWBSPHC.Add(AwbSPHC);

            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "NoofBup");
            DataTable dtAWBSPHC = CollectionHelper.ConvertTo(lstAWBSPHC, "");
            DataTable dtItineraryInformation = CollectionHelper.ConvertTo(listItineraryInformation, "");
            DataTable dtAWBSPHCTrans = CollectionHelper.ConvertTo(AWBDGRTrans, "SNo");
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
            paramAWBSPHCTrans.Value = dtAWBSPHCTrans;

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
                                            new SqlParameter("@isAmmendment", isAmmendment) ,
                                            new SqlParameter("@IsLateAccepTance", IsLateAccepTance),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveAcceptanceTransit", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveTransitDGRDetails(Int32 AWBSNo, List<DGRArraySeprate> AWBDGRTrans)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, NotifyDetails NotifyModel, NominyDetails NominyModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string isAmmendment, string isChargableAmendment, string CreateShipperParticipants, string CreateConsigneerParticipants)
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
                                            new SqlParameter("@CreateConsigneerParticipants",CreateConsigneerParticipants)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateShipperAndConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateTransitShipperAndConsigneeInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, AgentInfo AgentInfo, NotifyDetails NotifyModel, NominyDetails NominyModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string isAmmendment, string isChargableAmendment, string CreateShipperParticipants, string CreateConsigneerParticipants)
        {
            List<ShipperInformation> lstShipperInformation = new List<ShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            List<ConsigneeInformation> lstConsigneeInformation = new List<ConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

            List<AgentInfo> lstAgentInfo = new List<AgentInfo>();
            lstAgentInfo.Add(AgentInfo);
            DataTable dtAgentInfo = CollectionHelper.ConvertTo(lstAgentInfo, "");

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

            SqlParameter paramAgentInformation = new SqlParameter();
            paramAgentInformation.ParameterName = "@AgentInfo";
            paramAgentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramAgentInformation.Value = dtAgentInfo;

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
                                            paramAgentInformation,
                                            paramNotifyDetails,
                                            paramNominyDetails,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), 
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@isAmmendment", isAmmendment),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment),
                                            new SqlParameter("@CreateShipperParticipants",CreateShipperParticipants),
                                            new SqlParameter("@CreateConsigneerParticipants",CreateConsigneerParticipants)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateTransitShipperAndConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateTransitOSIInfoAndHandlingMessage(Int32 AWBSNo, OSIInformation OSIInformation, List<AWBHandlingMessage> AWBHandlingMessage, List<AWBOSIModel> AWBOSIModel, List<AWBOCIModel> AWBOCIModel, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment)
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
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateTransitOSIInfoAndHandlingMessage", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateAWBDimemsions(Int32 AWBSNo, List<Dimensions> Dimensions, Int32 UpdatedBy)
        {
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramDimensions = new SqlParameter();
            paramDimensions.ParameterName = "@DimensionsType";
            paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensions.Value = dtDimensions;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramDimensions, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBDimemsions", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetTransitAcceptanceInformation(Int32 AWBSNO,string AWBReferenceNumber)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@AWBReferenceNumber", AWBReferenceNumber), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CDCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTransitAcceptanceInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetTransitShipperAndConsigneeInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTransitShipperAndConsigneeInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetTransitOSIInfoAndHandlingMessage(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOSIInfoAndHandlingMessage", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetDimemsionsAndULD(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULD", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string FBLHandlingCharges(Int32 AWBSNO, string CityCode)
        {
            try
            {
                //SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@CityCode", CityCode) };
                SqlParameter[] Parameters = { new SqlParameter("@AwbSNo", AWBSNO), new SqlParameter("@CityCode", CityCode), new SqlParameter("@MovementType", "0"), new SqlParameter("@ShipmentType", "0"), new SqlParameter("@HAWBSNo", "") };
                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "WMS_FBLHandlingCharges", Parameters);
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingCharges", Parameters);
                //SqlParameter[] Parameters = { new SqlParameter("@PageSize", "0"), new SqlParameter("@WhereCondition", ""), new SqlParameter("@TableName", ""), new SqlParameter("@KeyColumn", ""), new SqlParameter("@TextColumn", ""), new SqlParameter("@TemplateColumn", ""), new SqlParameter("@AwbSNo", AWBSNO), new SqlParameter("@ChargeTo", 0), new SqlParameter("@CityCode", CityCode), new SqlParameter("@MovementType", 2), new SqlParameter("@HAWBSNo", ""), new SqlParameter("@LoginSNo", 2) };
                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "WMSFBLHandlingCharges", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return Message;
        }

        public string SaveAtXRay(Int32 AWBSNo, List<AWBXRay> lsAWBXRay, List<AWBULDXRay> lstULDXrayArray, List<ECSDArray> lstECSDArray, bool ScanType, int UpdatedBy)
        {
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBXRay, "");
            DataTable dtAWBULDXRay = CollectionHelper.ConvertTo(lstULDXrayArray, "");
            DataTable dtECSDArray = CollectionHelper.ConvertTo(lstECSDArray, "");
            SqlParameter paramLocationXRay = new SqlParameter();
            paramLocationXRay.ParameterName = "@AWBXRay";
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
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramLocationXRay, paramULDRay, paramecdaxRay, new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAtXRay", Parameters);
                try
                {
                    if (ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() == "")
                    {
                        SendFSU(AWBSNo.ToString());
                    }
                }
                catch(Exception ex) { }
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetRecordAtXray(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtXray", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetTransitAWBSummary(Int32 AWBSNO, string OfficeSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@OfficeSNo", OfficeSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBSummary", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        // public string SaveAtPayment(List<HandlingCharge> lstHandlingCharge, List<AgentBranchCheque> lstAgentBranchCheque, List<AWBCheque> lstAWBCheque, string CityCode, int UpdatedBy)
        public string SaveAtPayment(string AWBSNo, string TotalCash, string TotalCredit, List<HandlingCharge> lstHandlingCharge, List<AWBCheque> lstAWBCheque, string CityCode, int UpdatedBy)
        {
           
            string Message = "";
            DataTable dtHandlingCharge = CollectionHelper.ConvertTo(lstHandlingCharge, "");
            //DataTable dtAgentBranchCheque = CollectionHelper.ConvertTo(lstAgentBranchCheque, "");
            DataTable dtAWBCheque = CollectionHelper.ConvertTo(lstAWBCheque, "");

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
            SqlParameter[] Parameters = { paramHandlingCharge, new SqlParameter("@CityCode", CityCode), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
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
                catch(Exception ex){ }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return Message;
        }

        /// <summary>
        /// Send FSU
        /// </summary>
        /// <param name="AWBSno"></param>
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
                            edicom.InsertRecordMessagecount(dtupload);
                        }
                    }
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            // string FlightNo, DateTime FlightDate, string CarrierCode = "", string Destination = "", string AWBNo = "", string origin = ""
            // DataTable dtedi = GetMessageList(CarrierCode, Destination, MessageName);
        }

        public DataTable GetMessageList(string CarrierCode, string Destination, string MessageName)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@Destination", Destination), new SqlParameter("@MessageName", MessageName) };
                dt = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "EdiAutomaticConfig", Parameters).Tables[0];
                return dt;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCheckList(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCheckList", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveCheckList(Int32 AWBSNo, List<CheckListTrans> CheckListTrans, bool XRay, string Remarks, Int32 UpdatedBy)
        {
            DataTable dtCheckListTrans = CollectionHelper.ConvertTo(CheckListTrans, "");
            SqlParameter paramCheckListTrans = new SqlParameter();
            paramCheckListTrans.ParameterName = "@SCheckListTrans";
            paramCheckListTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramCheckListTrans.Value = dtCheckListTrans;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramCheckListTrans, new SqlParameter("@XRay", XRay), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveCheckList", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveAWBEDoxDetail(Int32 AWBSNo, List<AWBEDoxDetail> AWBEDoxDetail, string AllEDoxReceived, string Remarks, Int32 UpdatedBy)
        {
            DataTable dtAWBEDoxDetail = CollectionHelper.ConvertTo(AWBEDoxDetail, "");
            SqlParameter paramAWBEDoxDetail = new SqlParameter();
            paramAWBEDoxDetail.ParameterName = "@AWBEDoxDetail";
            paramAWBEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBEDoxDetail.Value = dtAWBEDoxDetail;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramAWBEDoxDetail, new SqlParameter("@AllEDoxReceived", AllEDoxReceived), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAWBEDoxDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AcceptanceNoteData", Parameters);
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest, string GrossWeight, string VolumeWeight, string AWBSNo, string SPHC)
        {
            DataSet ds;
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@DailyFlightSNo", DlyFlghtSno), 
                                            new SqlParameter("@Origin", Origin), 
                                            new SqlParameter("@Dest", Dest) ,
                                            new SqlParameter("@GrossWeight", GrossWeight), 
                                            new SqlParameter("@VolumeWeight", VolumeWeight), 
                                            new SqlParameter("@AWBSNo", AWBSNo) ,
                                            new SqlParameter("@SPHC", SPHC),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) 
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateCutoffTime", Parameters);
                return ds.Tables[0].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string OutwardFlightNo, string OutwardFlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, string Arrived, string DaysNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, OutwardFlightNo: OutwardFlightNo, OutwardFlightDate: OutwardFlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, LoggedInCity: LoggedInCity, Arrived:Arrived, DaysNo: DaysNo);
        }

        public Stream GetHouseAcceptanceGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string HAWBNo, string LoggedInCity)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, HAWBNo: HAWBNo, LoggedInCity: LoggedInCity);
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
        public Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string PageName = "", string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string OutwardFlightNo = "", string OutwardFlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "", string Arrived="", string DaysNo ="0")
        {

            try
            {
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
                            case "FWB":
                                if (appName.ToUpper().Trim() == "BOOKING")
                                    CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity);
                                else if (appName.ToUpper().Trim() == "HOUSEWAYBILL")
                                    CreateHAWBGrid(myCurrentForm, AWBSNo);
                                else if (appName.ToUpper().Trim() == "SHIPPINGBILL")
                                    CreateShippingBillGrid(myCurrentForm, AWBSNo: AWBSNo);
                                else if (appName.ToUpper().Trim() == "CHECKLIST")
                                    CreateCheckListDetailGrid(myCurrentForm, AWBSNo: AWBSNo, CheckListTypeSNo: "5");
                                //-- RH 030815 starts
                                else if (appName.ToUpper().Trim() == "CHECKLIST_SPHC")
                                    CreateCheckListDetailGrid(myCurrentForm, AWBSNo: AWBSNo, CheckListTypeSNo: "-1");
                                else if (appName.ToUpper().Trim() == "EDIDETAILS")
                                    CreateEDIGrid(myCurrentForm, AWBNo, FlightDate, FlightNo);
                                //-- RH 030815 ends
                                break;
                            case "TRANSITFWB":
                                if (appName.ToUpper().Trim() == "BOOKING")
                                    CreateTransitGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, OutwardFlightNo,  OutwardFlightDate, AWBPrefix, AWBNo, LoggedInCity, Arrived, DaysNo, isV2: true);
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public DataSourceResult GetFWBTransitGridData(BookingGetTranistFWBGrid model, string PageName, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "GetListTransitFWB_NewTransit";
                string filters = GridFilter.ProcessFilters<WMSTransitFWBGridData>(filter);

                SqlParameter[] Parameters = {
                                                 new SqlParameter("@PageNo", page),
                                                 new SqlParameter("@PageSize", pageSize),
                                                 new SqlParameter("@WhereCondition", filters.Replace("FlightDate", "FlightDateSearch").Replace("AWBDate", "AWBDateSearch")),
                                                 new SqlParameter("@OrderBy", sorts),
                                                 new SqlParameter("@OriginCity", model.OriginCity),
                                                 new SqlParameter("@DestinationCity", model.DestinationCity),
                                                 new SqlParameter("@FlightNo", model.FlightNo),
                                                 new SqlParameter("@FlightDate", model.FlightDate),
                                                 new SqlParameter("@AWBPrefix", model.AWBPrefix),
                                                 new SqlParameter("@AWBNo", model.AWBNo),
                                                 new SqlParameter("@LoggedInCity", model.LoggedInCity),
                                                 new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), 
                                               /*For MultCity */  new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()),  /*For MultCity */ 
                                                 new SqlParameter("@IsSLI", "0")   ,
                                                 new SqlParameter("@MovementType", "0"),
                                                 new SqlParameter("@Arrived", model.Arrived),
                                                 new SqlParameter("@DaysNo", model.DaysNo),
                                                  new SqlParameter("@OutwardFlightNo", model.OutwardFlightNo),
                                                 new SqlParameter("@OutwardFlightDate", model.OutwardFlightDate)
                                            };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSTransitFWBGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    AWBReferenceNumber = e["AWBReferenceNumber"].ToString(),
                    TimeDifference= e["TimeDifference"].ToString(),                    
                    AWBOD = e["AWBOD"].ToString(),
                    OperationalSector = e["OperationalSector"].ToString(),
                    TransitGrWt = Convert.ToInt32(e["TransitGrWt"]),
                    TransitPieces = Convert.ToInt32(e["TransitPieces"]),
                    InwardFlightNo = e["InwardFlightNo"].ToString(),
                    InwardFlightDate = e["InwardFlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["InwardFlightDate"]), DateTimeKind.Utc),                    
                    InwardFlightSector = e["InwardFlightSector"].ToString(),
                    OutwardFlightNo = e["OutwardFlightNo"].ToString(),
                    OutwardFlightDate = e["OutwardFlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["OutwardFlightDate"]), DateTimeKind.Utc),
                    OutwardFlightSector = e["OutwardFlightSector"].ToString(),
                    SLINo = e["SLINo"].ToString(),
                    AWBDate = e["AWBDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["AWBDate"]), DateTimeKind.Utc),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Gross = Convert.ToDecimal(e["Gross"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    FlightOrigin = e["FlightOrigin"].ToString(),
                    FlightDestination = e["FlightDestination"].ToString(),
                    Status = e["Status"].ToString(),
                    CommodityCode = e["CommodityCode"].ToString(),
                    ProductName = e["ProductName"].ToString(),
                    NoOfHouse = e["NoOfHouse"].ToString(),
                    AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                    AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                    AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
                    Shipper = "",
                    Consignee = "",
                    HandlingInfo = "",
                    XRay = "",
                    Location = "",
                    Payment = "",
                    Dimension = "",
                    Weight = "",
                    Reservation = "",
                    HAWB = "",
                    ShippingBill = "",
                    Document = "",
                    IsWarning = Convert.ToBoolean(e["IsWarning"]),
                    WarningRemarks = e["WarningRemarks"].ToString(),
                    FBLWt = Convert.ToDecimal(e["FBLWt"].ToString() == "" ? "0" : e["FBLWt"].ToString()),
                    FWBWt = Convert.ToDecimal(e["FWBWt"].ToString() == "" ? "0" : e["FWBWt"].ToString()),
                    RCSWt = Convert.ToDecimal(e["RCSWt"].ToString() == "" ? "0" : e["RCSWt"].ToString()),
                    SPHC = e["SPHC"].ToString(),
                    Arrived= e["Arrived"].ToString(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
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

                    g.DataSoruceUrl = "Services/Shipment/BookingService.svc/FWBGetWMSWaybillGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "FWB";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsAllowedFiltering = true;
                    g.ProcessName = ProcessName;
                    g.IsFormHeader = false;
                    g.IsShowGridHeader = false;
                    g.SuccessGrid = "BindSubProcess";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "Warning!!", DataType = GridDataType.String.ToString(), Template = "#if(IsWarning==true){#<img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\">#}#", Width = 20, Filterable = "False" });
                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = "Lot No", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "ShipmentDestination", IsLocked = false, Title = "Final Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "Status", IsLocked = false, Title = "Status", DataType = GridDataType.String.ToString(), Width = 40 });

                    g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80, Template = "# if( AWBDate==null) {# # } else {# #= kendo.toString(new Date(data.AWBDate.getTime() + data.AWBDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ChWt", Title = "Ch. Wt", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flt Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });

                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AccPcs", Title = "AccPcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccGrWt", Title = "AccGrWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccVolWt", Title = "AccVolWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "FBLWt", Title = "FBLWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                    g.Column.Add(new GridColumn { Field = "FWBWt", Title = "FWBWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                    g.Column.Add(new GridColumn { Field = "RCSWt", Title = "RCSWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15

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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Container"></param>
        /// <param name="ProcessName"></param>
        /// <param name="OriginCity"></param>
        /// <param name="DestinationCity"></param>
        /// <param name="FlightNo"></param>
        /// <param name="FlightDate"></param>
        /// <param name="OutwardFlightNo"></param>
        /// <param name="OutwardFlightDate"></param>
        /// <param name="AWBPrefix"></param>
        /// <param name="AWBNo"></param>
        /// <param name="LoggedInCity"></param>
        /// <param name="Arrived"></param> varified by Braj Tomar
        /// <param name="DaysNo"></param> varified by Braj Tomars
        /// <param name="isV2"></param>
        private void CreateTransitGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string OutwardFlightNo = "", string OutwardFlightDate = "", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "",string Arrived="", string DaysNo ="0", bool isV2=false)
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

                    g.DataSoruceUrl = "Services/Shipment/FWBService.svc/GetFWBTransitGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Transit FWB";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsAllowedFiltering = true;
                    g.ProcessName = ProcessName;
                    g.IsFormHeader = false;
                    g.IsShowGridHeader = false;
                    g.SuccessGrid = "BindSubProcess";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    //g.Column.Add(new GridColumn { Field = "SNo", Title = "Warning!!", DataType = GridDataType.String.ToString(), Template = "#if(IsWarning==true){#<img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\">#}#", Width = 20, Filterable = "False" });
                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "AWBReferenceNumber", IsLocked = false, Title = "AWB Reference No", DataType = GridDataType.String.ToString(), Width = 75 });
                    //// g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = "Lot No", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, IsHidden = true, Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, IsHidden = true, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    //g.Column.Add(new GridColumn { Field = "ShipmentDestination", IsLocked = false, Title = "Final Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    ////g.Column.Add(new GridColumn { Field = "Status", IsLocked = false, Title = "Status", DataType = GridDataType.String.ToString(), Width = 40 });

                    g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = true, DataType = GridDataType.Date.ToString(), Width = 80, Template = "# if( AWBDate==null) {# # } else {# #= kendo.toString(new Date(data.AWBDate.getTime() + data.AWBDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "ChWt", Title = "Ch. Wt", IsHidden = true, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    //g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    //g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flt Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "AWBOD", IsLocked = false, Title = "AWB OD", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 20 });
                    g.Column.Add(new GridColumn { Field = "Gross", Title = "Gross Wt.", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 30, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 20 });
                    g.Column.Add(new GridColumn { Field = "OperationalSector", IsLocked = false, Title = "Operational Sector", DataType = GridDataType.String.ToString(), Width = 50, IsHidden=true });
                   
                    g.Column.Add(new GridColumn { Field = "TransitPieces", Title = "Transit Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "TransitGrWt", Title = "Transit GrWt.", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "InwardFlightNo", IsLocked = false, Title = "Inward Flight No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "InwardFlightDate", IsLocked = false, Title = "Inward Flight Date", DataType = GridDataType.Date.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "InwardFlightSector", Title = "Inward Flight Sector", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 40  });
                    g.Column.Add(new GridColumn { Field = "OutwardFlightNo", IsLocked = false, Title = "Outward Flight No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "OutwardFlightDate", IsLocked = false, Title = "Outward Flight Date", DataType = GridDataType.Date.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "OutwardFlightSector", IsLocked = false, Title = "Outward Flight Sector", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "TimeDifference", IsLocked = false, Title = "Connecting Time", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Arrived", Title = "Arrived", DataType = GridDataType.String.ToString(), Width = 30 });

                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flt Date", IsHidden = true, DataType = GridDataType.Date.ToString(), Width = 80, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });

                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AccPcs", Title = "AccPcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccGrWt", Title = "AccGrWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccVolWt", Title = "AccVolWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "FBLWt", Title = "FBLWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                    g.Column.Add(new GridColumn { Field = "FWBWt", Title = "FWBWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                    g.Column.Add(new GridColumn { Field = "RCSWt", Title = "RCSWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "OutwardFlightNo", Value = OutwardFlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "OutwardFlightDate", Value = OutwardFlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "Arrived", Value = Arrived });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DaysNo", Value = DaysNo.ToString() });
                    g.InstantiateIn(Container, isV2);
                }
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private void CreateCheckListDetailGrid(StringBuilder Container, string AWBSNo = "", string HAWBSNo = "", string CheckListTypeSNo = "")
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
                        g.DataSoruceUrl = "Services/Shipment/BookingService.svc/GetWMSCheckListGridData";
                    else
                        g.DataSoruceUrl = "Services/House/HouseService.svc/GetHouseCheckListGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;

                    g.FormCaptionText = "Check List Details";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "SrNo", Title = "Sr. No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Description", Title = "Description", Template = "<span style=\"width:400px;\">#= Description #<span>", DataType = GridDataType.String.ToString(), Width = 400 });
                    g.Column.Add(new GridColumn { Field = "Y", Title = "Y", Template = "# if( Y==1) {#<input type=\"radio\" id=\"rbtnY\" value=\"Y\" onclick=\"MarkSelected(this);\"/># } else if(Y==2){#<input type=\"radio\" id=\"rbtnY\" value=\"Y\"  checked=\"1\" onclick=\"MarkSelected(this);\"/># } #", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "N", Title = "N", Template = "# if( N==1) {#<input type=\"radio\" id=\"rbtnN\" value=\"N\" onclick=\"MarkSelected(this);\"/>#} else if(N==2){#<input type=\"radio\" id=\"rbtnN\" value=\"N\"  checked=\"1\" onclick=\"MarkSelected(this);\"/># }  #", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "NA", Title = "NA", DataType = GridDataType.String.ToString(), Template = "# if( NA==1) {#<input type=\"radio\" id=\"rbtnNA\" value=\"NA\" onclick=\"MarkSelected(this);\"/># } else if(NA==2){#<input type=\"radio\" id=\"rbtnNA\" value=\"NA\"  checked=\"1\" onclick=\"MarkSelected(this);\"/># } #", Width = 50 });

                    g.ExtraParam = new List<GridExtraParam>();
                    if (AWBSNo != "")
                        g.ExtraParam.Add(new GridExtraParam { Field = "AWBSNo", Value = AWBSNo });
                    else
                        g.ExtraParam.Add(new GridExtraParam { Field = "HAWBSNo", Value = HAWBSNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "CheckListTypeSNo", Value = CheckListTypeSNo });

                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//(Exception ex)
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
                                            new SqlParameter("@isAmmendment", isAmmendment) ,
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment) 
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBSummary", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateTransitAWBSummary(Int32 AWBSNo, List<SummaryArray> Summary, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment)
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
                                            new SqlParameter("@isAmmendment", isAmmendment) ,
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment) 
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateTransitAWBSummary", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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

            SqlParameter paramisAmmendment = new SqlParameter();
            paramisAmmendment.ParameterName = "@isAmmendment";
            paramisAmmendment.SqlDbType = System.Data.SqlDbType.Structured;
            paramisAmmendment.Value = isAmmendment;

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
                                            paramisAmmendment, 
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateTransitRateDimemsionsAndULD(Int32 AWBSNo, List<DimensionsArray> Dimensions, List<ULDDimensionsArray> ULDDimension, List<AWBOtherChargeArray> OtherCharge, List<AWBRateArray> RateArray, List<TactRateArray> TactRateArray, Int32 UpdatedBy, string isAmmendment, string PrintRateCode, string PublishedRate, string UserRate, string RateDiffRemarks, string isChargableAmendment)
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

            SqlParameter paramisAmmendment = new SqlParameter();
            paramisAmmendment.ParameterName = "@isAmmendment";
            paramisAmmendment.SqlDbType = System.Data.SqlDbType.Structured;
            paramisAmmendment.Value = isAmmendment;

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
                                            paramisAmmendment, 
                                            new SqlParameter("@PrintRateCode", PrintRateCode), 
                                            new SqlParameter("@PublishedRate", PublishedRate), 
                                            new SqlParameter("@UserRate", UserRate), 
                                            new SqlParameter("@RateDiffRemarks", RateDiffRemarks),
                                            new SqlParameter("@isChargableAmendment", isChargableAmendment)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateTransitRateDimemsionsAndULD", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //#region HOUSE ACCEPTANCE GRID

        //private void CreateHouseAcceptanceGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "")
        //{
        //    using (Grid g = new Grid())
        //    {
        //        g.Height = 100;
        //        g.PageName = this.MyPageName;
        //        g.PrimaryID = this.MyPrimaryID;
        //        g.ModuleName = this.MyModuleID;
        //        g.AppsName = this.MyAppID;
        //        g.IsDisplayOnly = true;
        //        g.DefaultPageSize = 5;
        //        g.IsAllowCopy = false;
        //        g.DataSoruceUrl = "Services/House/HouseService.svc/GetWMSHouseGridData";
        //        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //        g.ServiceModuleName = this.MyModuleID;
        //        g.UserID = this.MyUserID;
        //        g.FormCaptionText = "House Acceptance";
        //        g.IsPageable = true;
        //        g.IsAllowedPaging = true;
        //        g.IsProcessPart = true;
        //        g.IsRowChange = true;//added by Manoj Kumar
        //        g.IsRowDataBound = true;//added by Manoj Kumar
        //        g.IsPageSizeChange = false;
        //        g.IsPager = false;
        //        g.IsOnlyTotalDisplay = true;
        //        g.ProcessName = ProcessName;

        //        g.Column = new List<GridColumn>();
        //        g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "HAWBNo", Title = "House No", DataType = GridDataType.String.ToString(), Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "HAWBDate", Title = "House Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
        //        g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
        //        g.Column.Add(new GridColumn { Field = "DestinationCity", Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
        //        g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
        //        g.Column.Add(new GridColumn { Field = "ChargeableWeight", Title = "Ch. Wt", IsHidden = true, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
        //        g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });

        //        g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "AccPcs", Title = "AccPcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
        //        g.Column.Add(new GridColumn { Field = "AccGrWt", Title = "AccGrWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
        //        g.Column.Add(new GridColumn { Field = "AccVolWt", Title = "AccVolWt", DataType = GridDataType.Number.ToString(), IsHidden = true });

        //        g.ExtraParam = new List<GridExtraParam>();
        //        g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "HAWBNo", Value = HAWBNo });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
        //        g.InstantiateIn(Container);

        //    }
        //}
        //#endregion

        #region FlightOperation

        public Stream GetFlightGridData(string processName, string moduleName, string appName, string BoardingPoint, string EndPoint, string FlightNo, string FlightDate, string LoggedInCity, string FlightStatus)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: BoardingPoint, DestinationCity: EndPoint, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: "A~A", AWBNo: "A~A", LoggedInCity: LoggedInCity, FlightStatus: FlightStatus);
        }

        public Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", FlightSNo: FlightSNo);
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


        //private void CreateFlightControlGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string FlightStatus = "", string LoggedInCity = "")
        //{
        //    using (Grid g = new Grid())
        //    {
        //        g.Height = 100;
        //        g.PageName = this.MyPageName;
        //        g.PrimaryID = this.MyPrimaryID;
        //        g.ModuleName = this.MyModuleID;
        //        g.AppsName = this.MyAppID;
        //        g.IsDisplayOnly = true;
        //        g.DefaultPageSize = 5;
        //        g.IsAllowCopy = false;
        //        g.DataSoruceUrl = "Services/FlightOperation/FlightControlService.svc/GetFlightControlGridData";
        //        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //        g.ServiceModuleName = this.MyModuleID;
        //        g.UserID = this.MyUserID;
        //        g.FormCaptionText = "Flight Control";
        //        g.IsPageable = true;
        //        g.IsAllowedPaging = true;
        //        g.IsProcessPart = true;
        //        g.IsRowChange = true;
        //        g.IsRowDataBound = false;
        //        g.IsPageSizeChange = false;
        //        g.IsPager = false;
        //        g.IsOnlyTotalDisplay = true;
        //        g.ProcessName = "FlightControl";

        //        g.Column = new List<GridColumn>();
        //        g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.Number.ToString(), Width = 90 });

        //        g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "FlightRoute", IsLocked = false, Title = "Flight Route ", DataType = GridDataType.String.ToString(), Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "BoardingPoint", IsLocked = false, Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 90 });
        //        //  g.Column.Add(new GridColumn { Field = "BoardingPoint", IsLocked = false, Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 35 });
        //        g.Column.Add(new GridColumn { Field = "ETD", IsLocked = false, Title = "ETD", DataType = GridDataType.String.ToString(), Width = 40 });
        //        g.Column.Add(new GridColumn { Field = "EndPoint", Title = "End Point", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
        //        g.Column.Add(new GridColumn { Field = "ETA", Title = "ETA", DataType = GridDataType.Number.ToString(), Width = 40 });
        //        g.Column.Add(new GridColumn { Field = "DAY", Title = "Day", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
        //        g.Column.Add(new GridColumn { Field = "ACType", Title = "A/C Type", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
        //        g.Column.Add(new GridColumn { Field = "CAO", Title = "CAO", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
        //        g.Column.Add(new GridColumn { Field = "FlightStatus", Title = "Flight Status", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
        //        g.Column.Add(new GridColumn { Field = "BookedGrossWeight", Title = "BookedGrossWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "BookedVolumeWeight", Title = "BookedVolumeWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "BookedCBMWeight", Title = "BookedCBMWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "AvilableVolumeWeight", Title = "AvilableVolumeWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "AvilableGrossWeight", Title = "AvilableGrossWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
        //        g.Column.Add(new GridColumn { Field = "AvilableCBMWeight", Title = "AvilableCBMWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });

        //        g.ExtraParam = new List<GridExtraParam>();
        //        g.ExtraParam.Add(new GridExtraParam { Field = "BoardingPoint", Value = OriginCity });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "EndPoint", Value = DestinationCity });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "FlightStatus", Value = FlightStatus });
        //        g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
        //        g.InstantiateIn(Container);

        //    }
        //}

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
                    StartUTime = e["StartUTime"].ToString(),
                    EndUTime = e["EndUTime"].ToString()
                });
                return new KeyValuePair<string, List<ReadyToUnloading>>(ds.Tables[0].Rows[0][0].ToString(), readyToUnloadingList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckIsAWBUsable(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckIsAWBUsable", Parameters);
                ds.Dispose();
                //string JSONString = string.Empty;
                //JSONString = JsonConvert.SerializeObject(ds);
                return JsonConvert.SerializeObject(ds);
            }
            catch(Exception ex)//(Exception ex)
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}