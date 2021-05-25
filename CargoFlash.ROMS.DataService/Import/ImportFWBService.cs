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
using CargoFlash.Cargo.Model.Import;
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
namespace CargoFlash.Cargo.DataService.Import
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ImportFWBService : BaseWebUISecureObject, IImportFWBService
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
            catch(Exception ex)// (Exception ex)
            {
                return null;
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
            catch(Exception ex)// (Exception ex)
            {
                return null;
            }
        }

        public string SaveFWB(string AWBNo, Int32 AWBSNo, ShipmentInformation ShipmentInformation, List<AWBSPHC> lstAWBSPHC, List<ItineraryInformation> listItineraryInformation, List<DGRArray> AWBDGRTrans, string isAmmendment, string isAmmendmentCharges, string IsDocReceived, string IsLateAccepTance, string ArrivedShimentSNo, List<NOGArray> NOGArray, string Attachawbno, int Attachawbsno)
        {
            List<ShipmentInformation> lstShipmentInformation = new List<ShipmentInformation>();
            lstShipmentInformation.Add(ShipmentInformation);

            //List<AWBSPHC> lstAWBSPHC = new List<AWBSPHC>();
            //lstAWBSPHC.Add(AwbSPHC);
           // List<CustomPermission> CustomPermission = new List<CustomPermission>();
           // CustomPermission.Add(customPermission);

            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "");
            DataTable dtAWBSPHC = CollectionHelper.ConvertTo(lstAWBSPHC, "");
            DataTable dtItineraryInformation = CollectionHelper.ConvertTo(listItineraryInformation, "");
            DataTable dtAWBSPHCTrans = CollectionHelper.ConvertTo(AWBDGRTrans, "SNo");
            DataTable dtNOG = CollectionHelper.ConvertTo(NOGArray, "");
            DataTable dt = CollectionHelper.ConvertTo(NOGArray, "");
           
            BaseBusiness baseBusiness = new BaseBusiness();

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBNo", AWBNo),
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ShipmentInformation", dtShipmentInformation),
                                            new SqlParameter("@AWBSPHC", dtAWBSPHC),
                                            new SqlParameter("@ItineraryInformation", dtItineraryInformation),
                                            new SqlParameter("@AWBSPHCTrans", dtAWBSPHCTrans),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@isAmmendment", isAmmendment) ,
                                            new SqlParameter("@isAmmendmentCharges", isAmmendmentCharges) ,
                                            new SqlParameter("@IsDocReceived", IsDocReceived) ,
                                            new SqlParameter("@IsLateAccepTance", IsLateAccepTance),
                                            new SqlParameter("@ArrivedShimentSNo", ArrivedShimentSNo),
                                            new SqlParameter("@AWBNOGTrans", dtNOG),
                                            new SqlParameter("@AttachedAWBNo", Attachawbno),
                                            new SqlParameter("@AttachedAWBSNo", Attachawbsno)
                                       

                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveIFWB", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveIDGRDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
        }

        public string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, NotifyDetails NotifyModel, NominyDetails NominyModel, Int32 ShipperSno, Int32 ConsigneeSno, int IsShipperEnable, int IsConsigneeEnable, string isAmmendment, string isAmmendmentCharges, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId)
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

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ShipperInformation", dtShipperInformation),
                                            new SqlParameter("@ConsigneeInformation", dtConsigneeInformation),
                                            new SqlParameter("@NotifyDetails", dtNotifyDetails),
                                            new SqlParameter("@NominyDetails", dtNominyDetails),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@IsShipperEnable", IsShipperEnable),
                                            new SqlParameter("@IsConsigneeEnable", IsConsigneeEnable),
                                            new SqlParameter("@isAmmendment", isAmmendment),
                                            new SqlParameter("@isAmmendmentCharges", isAmmendmentCharges),
                                              new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneeTaxParticipants",CreateConsigneeTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneeTaxId",CreateConsigneeTaxId)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateIShipperAndConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
        }

        public string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, OSIInformation OSIInformation, List<AWBHandlingMessage> AWBHandlingMessage, List<AWBOSIModel> AWBOSIModel, List<AWBOCIModel> AWBOCIModel, string isAmmendment, string isAmmendmentCharges)
        {
            List<OSIInformation> lstOSIInformation = new List<OSIInformation>();
            lstOSIInformation.Add(OSIInformation);
            DataTable dtOSIInformation = CollectionHelper.ConvertTo(lstOSIInformation, "");
            DataTable dtAWBHandlingMessage = CollectionHelper.ConvertTo(AWBHandlingMessage, "");
            DataTable dtAWBOSIModel = CollectionHelper.ConvertTo(AWBOSIModel, "");
            DataTable dtAWBOCIModel = CollectionHelper.ConvertTo(AWBOCIModel, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                          new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@OSIInformation", dtOSIInformation),
                                          new SqlParameter("@AWBHandlingMessage", dtAWBHandlingMessage),
                                          new SqlParameter("@AWBOSIInformation", dtAWBOSIModel),
                                          new SqlParameter("@AWBOCIInformation", dtAWBOCIModel),
                                          new SqlParameter("@isAmmendment", isAmmendment),
                                          new SqlParameter("@isAmmendmentCharges", isAmmendmentCharges),
                                          new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateIOSIInfoAndHandlingMessage", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
        }

        public string UpdateAWBDimemsions(Int32 AWBSNo, List<Dimensions> Dimensions, string isAmmendment, string isAmmendmentCharges)
        {
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                           new SqlParameter("@DimensionsType", dtDimensions),
                                           new SqlParameter("@isAmmendment", isAmmendment),
                                           new SqlParameter("@isAmmendmentCharges", isAmmendmentCharges),
                                           new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBDimemsions", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
            catch(Exception ex)// (Exception ex)
            {
                return 0;
            }
        }

        public string GetIFWBInformation(Int32 AWBSNO, int POMailSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@POMailSNo", POMailSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIFWBInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetOriginDest(Int32 AttachAWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@attahawbsno", AttachAWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOriginDest", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetOriginDestAWBStock(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@awbno", AWBNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetOriginDestAWBStock", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetShipperAndConsigneeInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIShipperAndConsigneeInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        //added for getshipperandconsignee based on taxid
        public string GetShipperAndConsigneeInformation_TaxId(Int32 AWBSNO,string UserType,string Taxid)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@UserType", UserType), new SqlParameter("@Taxid", Taxid) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIShipperAndConsigneeInformation_TaxID", Parameters);
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
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIOSIInfoAndHandlingMessage", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAWBSummary(Int32 AWBSNO, string OfficeSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@OfficeSNo", OfficeSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIAWBSummary", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAWBRateDetails(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIAWBRateDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
            {
                throw ex;
            }
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
            catch(Exception ex)// (Exception ex)
            {

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
            catch(Exception ex)//
            {
                return dt;
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
            catch(Exception ex)//
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
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
            catch(Exception ex)//
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
            catch(Exception ex)//
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
            catch(Exception ex)//
            {
                return "";
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
            catch(Exception ex)//
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, LoggedInCity: LoggedInCity);
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

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "")
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
                        case "ImportFWB":
                            CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity);
                            break;
                        default:
                            break;
                    }
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

        private void CreateGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Import FWB";
                g.DefaultPageSize = 5;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsDisplayOnly = false;
                g.IsActionRequired = false;
                g.IsSortable = true;
                g.IsAllowedFiltering = true;
                g.IsShowGridHeader = false;
                g.ProcessName = ProcessName;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                //g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 60, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ATA", Title = "ATA", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "EnteredType", Title = "EnteredType", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "searchAirline", Value = "0" });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = AWBNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchIncludeTransitAWB", Value = LoggedInCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchExcludeDeliveredAWB", Value = "0" });
                g.InstantiateIn(Container);

            }

            //using (Grid g = new Grid())
            //{
            //    g.PageName = this.MyPageName;
            //    g.PrimaryID = this.MyPrimaryID;
            //    g.ModuleName = this.MyModuleID;
            //    g.AppsName = this.MyAppID;
            //    g.IsActionRequired = false;

            //    g.DataSoruceUrl = "Services/Import/ImportFWBService.svc/GetImportFWBGridData";
            //    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
            //    g.ServiceModuleName = this.MyModuleID;
            //    g.UserID = this.MyUserID;
            //    g.FormCaptionText = "Import FWB";
            //    g.DefaultPageSize = 5;
            //    g.IsDisplayOnly = false;
            //    g.IsProcessPart = true;
            //    g.IsVirtualScroll = false;
            //    g.IsAllowedFiltering = true;
            //    g.ProcessName = ProcessName;
            //    g.IsFormHeader = false;
            //    g.SuccessGrid = "BindSubProcess";

            //    g.Column = new List<GridColumn>();
            //    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
            //    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
            //    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 40 });
            //    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Destination", DataType = GridDataType.String.ToString(), Width = 35 });
            //    g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
            //    g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
            //    g.Column.Add(new GridColumn { Field = "ChWt", Title = "Ch. Wt", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
            //    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
            //    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
            //    g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });
            //    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
            //    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });

            //    g.ExtraParam = new List<GridExtraParam>();
            //    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
            //    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
            //    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
            //    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
            //    g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
            //    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
            //    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
            //    g.InstantiateIn(Container);
            //}
        }

        public DataSourceResult GetImportFWBGridData(string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "GetListImportFWB";
                string filters = GridFilter.ProcessFilters<ImportFWBGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@searchAirline", searchAirline), new SqlParameter("@searchFlightNo", searchFlightNo), new SqlParameter("@searchAWBNo", searchAWBNo), new SqlParameter("@searchFromDate", searchFromDate), new SqlParameter("@searchToDate", searchToDate), new SqlParameter("@LoggedInCity", "") };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var FWBImportList = ds.Tables[0].AsEnumerable().Select(e => new ImportFWBGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    AWBDate = e["AWBDate"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Gross = Convert.ToDecimal(e["Gross"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    FlightNo = e["FlightNo"].ToString(),
                    //FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("yyyy/MM/dd"),
                    FlightDate = Convert.ToString(e["FlightDate"]),
                    //   FlightOrigin = e["FlightOrigin"].ToString(),
                    CommodityCode = e["CommodityCode"].ToString(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = FWBImportList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateHAWBGrid(StringBuilder Container, string AWBSNo = "")
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

        private void CreateEDIGrid(StringBuilder Container, string AWBNo = "", string FlightDate = "", string FlightNo = "")
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

        private void CreateShippingBillGrid(StringBuilder Container, string AWBSNo = "", string HAWBSNo = "")
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

        private void CreateCheckListDetailGrid(StringBuilder Container, string AWBSNo = "", string HAWBSNo = "", string CheckListTypeSNo = "")
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

        public string UpdateAWBSummary(Int32 AWBSNo, List<SummaryArray> Summary, string isAmmendment, string isAmmendmentCharges)
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
                                          new SqlParameter("@AWBSummaryType", dtSummary),
                                          new SqlParameter("@isAmmendment", isAmmendment),
                                          new SqlParameter("@isAmmendmentCharges", isAmmendmentCharges),
                                          new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateIAWBSummary", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
        }

        public string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<DimensionsArray> Dimensions, List<ULDDimensionsArray> ULDDimension, List<AWBOtherChargeArray> OtherCharge, List<AWBRateArray> RateArray, List<TactRateArray> TactRateArray, string isAmmendment, string isAmmendmentCharges)
        {
            if (Dimensions == null)
            {
                Dimensions = new List<DimensionsArray>();
            }
            if (ULDDimension == null)
            {
                ULDDimension = new List<ULDDimensionsArray>();
            }
            if (OtherCharge == null)
            {
                OtherCharge = new List<AWBOtherChargeArray>();
            }
            if (TactRateArray == null)
            {
                TactRateArray = new List<TactRateArray>();
            }

            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "hdnChildData");//hdnChildData
            DataTable dtAWBULDTrans = CollectionHelper.ConvertTo(ULDDimension, "");
            List<ChildData> lstChildData = new List<ChildData>();
            DataTable dtDimensionTrans = CollectionHelper.ConvertTo(lstChildData, "");
            DataTable dtOtherCharge = CollectionHelper.ConvertTo(OtherCharge, "");
            DataTable dtAWBRate = CollectionHelper.ConvertTo(RateArray, "");
            DataTable dtTactRateArray = CollectionHelper.ConvertTo(TactRateArray, "");

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                          new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@RateDimensions", dtDimensions),
                                          new SqlParameter("@RateDimensionsTrans", dtDimensionTrans),
                                          new SqlParameter("@ULDRateDimensions", dtAWBULDTrans),
                                          new SqlParameter("@OtherCharge", dtOtherCharge),
                                          new SqlParameter("@AwbRate", dtAWBRate),
                                          new SqlParameter("@TactRate", dtTactRateArray),
                                          new SqlParameter("@isAmmendment", isAmmendment),
                                          new SqlParameter("@isAmmendmentCharges", isAmmendmentCharges),
                                          new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateIRateDimemsionsAndULD", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

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

        public KeyValuePair<string, List<GetFDimemsionsAndULDNew>> GetFDimemsionsAndULDNew(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                GetFDimemsionsAndULDNew officeCommision = new GetFDimemsionsAndULDNew();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIDimemsionsAndULDNew", Parameters);
                var GetFDimemsionsAndULDNewList = ds.Tables[0].AsEnumerable().Select(e => new GetFDimemsionsAndULDNew
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
                return new KeyValuePair<string, List<GetFDimemsionsAndULDNew>>(ds.Tables[1].Rows[0][0].ToString(), GetFDimemsionsAndULDNewList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<GetFDimemsionsAndULDRate>> GetFDimemsionsAndULDRate(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                GetFDimemsionsAndULDRate officeCommision = new GetFDimemsionsAndULDRate();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIDimemsionsAndULDRate", Parameters);
                var GetFDimemsionsAndULDRateList = ds.Tables[0].AsEnumerable().Select(e => new GetFDimemsionsAndULDRate
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
                return new KeyValuePair<string, List<GetFDimemsionsAndULDRate>>(ds.Tables[1].Rows[0][0].ToString(), GetFDimemsionsAndULDRateList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<GetAWBOtherChargeData>> GetAWBOtherChargeData(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                GetAWBOtherChargeData officeCommision = new GetAWBOtherChargeData();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIAWBOtherChargeData", Parameters);
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
            catch(Exception ex)//
            {
                throw ex;
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

        public List<string> UpdateReadyToUnloading(string strData)
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

        public string CheckIsAWBUsable(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckIsAWBUsable", Parameters);
                ds.Dispose();
                //string JSONString = string.Empty;
                //JSONString = JsonConvert.SerializeObject(ds);
                return JsonConvert.SerializeObject(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string ValidateFlight(string AWBSNo)
        {
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "IValidateFlight", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetFWBType(int AWBSNo, int POMailSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@AwbSNo", AWBSNo),
                                       new SqlParameter("@POMailSNo", POMailSNo)
                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFWBType", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
        }

        public string GetExchangeRate(string FromCurrency, string ToCurrency)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@FromCurrency", FromCurrency),
                                       new SqlParameter("@ToCurrency", ToCurrency)
                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetExchangeRate", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
        }
        public string CheckTaxId(string TaxId, string UserType, int CountrySno)
        {
            try
            {
                SqlParameter[] Parameters = {
                                        new SqlParameter("@TaxId", TaxId),new SqlParameter("@UserType", UserType),new SqlParameter("@countrySno", CountrySno)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckTaxId", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}