using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.House;
using CargoFlash.SoftwareFactory.WebUI;
using System.Net;


//using System.Web.Script.Serialization;

namespace CargoFlash.Cargo.DataService.House
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class HouseAcceptanceService : BaseWebUISecureObject, IHouseAcceptanceService
    {
        public HouseAcceptanceService()
            : base()
        {
        }

        //public HouseAcceptanceService(bool authenticationCheck)
        //    : base(authenticationCheck)
        //{
        //}


        // created By manoj Kumar Chaurasiya for Bind Chart
        public string[] GetHAWBProcess(Int32 HAWBSNo, Int32 ProcessSNo)
        {
            try
            {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), new SqlParameter("@ProcessSNo", ProcessSNo) };
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetAWBProcess", Parameters);
                string[] str = new string[2];
                str[0] = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                str[1] = ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString();
                //"{category:Complete,value: " + ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() + ", color: '#9de219'}," +
                //"{category:InComplete,value:" + ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString() + ",color: '#FE9D5A'}";
                //string str = "{Complete:"+ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString()+",InComplete:"+ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString()+"}";
                return str;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return null;
            //    // return ex.Message;
            //}
        }
        public string[] GetFlightChartDetails(string DailyFlightSNo)
        {
            try
            { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@FlightSNo", DailyFlightSNo) };
            //try
            //{
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
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return null;
            //    // return ex.Message;
            //}
        }
        // end



        public string SaveAcceptance(string HAWBNo, Int32 HAWBSNo, ShipmentInformation ShipmentInformation, List<HAWBSPHC> AwbSPHC,  List<HAWBSPHCTrans> AWBSPHCTrans, Int32 UpdatedBy)
        {
            try
            { 
            List<ShipmentInformation> lstShipmentInformation = new List<ShipmentInformation>();
            lstShipmentInformation.Add(ShipmentInformation);

           // List<HAWBSPHC> lstAWBSPHC = new List<HAWBSPHC>();
           // lstAWBSPHC.Add(AwbSPHC);

            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "");
            DataTable dtAWBSPHC = CollectionHelper.ConvertTo(AwbSPHC, "");
            DataTable dtAWBSPHCTrans = CollectionHelper.ConvertTo(AWBSPHCTrans, "SNo");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramShipmentInformation = new SqlParameter();
            paramShipmentInformation.ParameterName = "@ShipmentInformation";
            paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipmentInformation.Value = dtShipmentInformation;

            SqlParameter paramAWBSPHC = new SqlParameter();
            paramAWBSPHC.ParameterName = "@HAWBSPHC";
            paramAWBSPHC.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHC.Value = dtAWBSPHC;
                       
            SqlParameter paramAWBSPHCTrans = new SqlParameter();
            paramAWBSPHCTrans.ParameterName = "@HAWBSPHCTrans";
            paramAWBSPHCTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHCTrans.Value = dtAWBSPHCTrans;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@HAWBNo", HAWBNo), new SqlParameter("@HAWBSNo", HAWBSNo), paramShipmentInformation, paramAWBSPHC, paramAWBSPHCTrans, new SqlParameter("@UpdatedBy", UpdatedBy) };
            DataSet ds1 = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HousesaveAcceptance", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
        }

        public string UpdateShipperAndConsigneeInformation(Int32 HAWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno)
        {
            try
            { 
            List<ShipperInformation> lstShipperInformation = new List<ShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();

        
            List<ConsigneeInformation> lstConsigneeInformation = new List<ConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");
          

            SqlParameter paramShipperInformation = new SqlParameter();
            paramShipperInformation.ParameterName = "@ShipperInformation";
            paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipperInformation.Value = dtShipperInformation;


            SqlParameter paramConsigneeInformation = new SqlParameter();
            paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
            paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramConsigneeInformation.Value = dtConsigneeInformation;

        

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), paramShipperInformation, paramConsigneeInformation, new SqlParameter("@UpdatedBy", UpdatedBy), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno) };
            DataSet ds1 = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HouseUpdateShipperAndConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
        }

        public string UpdateOSIInfoAndHandlingMessage(Int32 HAWBSNo, HouseOSIInformation OSIInformation, List<HAWBHandlingMessage> HAWBHandlingMessage, List<HAWBOSIModel> HAWBOSIModel, List<HAWBOCIModel> HAWBOCIModel, Int32 UpdatedBy)
        {
            try
            { 
            List<HouseOSIInformation> lstOSIInformation = new List<HouseOSIInformation>();
            lstOSIInformation.Add(OSIInformation);
            DataTable dtOSIInformation = CollectionHelper.ConvertTo(lstOSIInformation, "");
            DataTable dtHAWBHandlingMessage = CollectionHelper.ConvertTo(HAWBHandlingMessage, "");
            DataTable dtHAWBOSIModel = CollectionHelper.ConvertTo(HAWBOSIModel, "");
            DataTable dtHAWBOCIModel = CollectionHelper.ConvertTo(HAWBOCIModel, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramOSIInformation = new SqlParameter();
            paramOSIInformation.ParameterName = "@OSIInformation";
            paramOSIInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSIInformation.Value = dtOSIInformation;

            SqlParameter paramHAWBHandlingMessage = new SqlParameter();
            paramHAWBHandlingMessage.ParameterName = "@HAWBHandlingMessage";
            paramHAWBHandlingMessage.SqlDbType = System.Data.SqlDbType.Structured;
            paramHAWBHandlingMessage.Value = dtHAWBHandlingMessage;

            SqlParameter paramHAWBOSIModel = new SqlParameter();
            paramHAWBOSIModel.ParameterName = "@HAWBOSIInformation";
            paramHAWBOSIModel.SqlDbType = System.Data.SqlDbType.Structured;
            paramHAWBOSIModel.Value = dtHAWBOSIModel;

            SqlParameter paramHAWBOCIModel = new SqlParameter();
            paramHAWBOCIModel.ParameterName = "@HAWBOCIInformation";
            paramHAWBOCIModel.SqlDbType = System.Data.SqlDbType.Structured;
            paramHAWBOCIModel.Value = dtHAWBOCIModel;
                         

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), paramOSIInformation,paramHAWBHandlingMessage, paramHAWBOSIModel, paramHAWBOCIModel,  new SqlParameter("@UpdatedBy", UpdatedBy) };
            DataSet ds1 = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HouseUpdateOSIInfoAndHandlingMessage", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
        }

        public string UpdateDimemsionsAndULD(Int32 HAWBSNo, List<Dimensions> Dimensions, List<HAWBULDTrans> AWBULDTrans, Int32 UpdatedBy)
        {
            try
            { 
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");
            DataTable dtAWBULDTrans = CollectionHelper.ConvertTo(AWBULDTrans, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramDimensions = new SqlParameter();
            paramDimensions.ParameterName = "@Dimensions";
            paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensions.Value = dtDimensions;

            SqlParameter paramAWBULDTrans = new SqlParameter();
            paramAWBULDTrans.ParameterName = "@HAWBULDTrans";
            paramAWBULDTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBULDTrans.Value = dtAWBULDTrans;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), paramDimensions, paramAWBULDTrans, new SqlParameter("@UpdatedBy", UpdatedBy) };
            DataSet ds1 = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HouseUpdateDimemsionsAndULD", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
        }


        public string GetAcceptanceInformation(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HouseGetAcceptanceInformation", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetShipperAndConsigneeInformation(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HouseGetShipperAndConsigneeInformation", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetOSIInfoAndHandlingMessage(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HouseGetOSIInfoAndHandlingMessage", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetDimemsionsAndULD(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HouseGetDimemsionsAndULD", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        
        public string SaveAtWeighing(Int32 HAWBSNo, List<HAWBGroup> lsAWBGroup, bool ScanType, int UpdatedBy)
        {
            try
            { 
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBGroup, "");

            SqlParameter paramAWBGroup = new SqlParameter();
            paramAWBGroup.ParameterName = "@HAWBGroup";
            paramAWBGroup.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBGroup.Value = dtAWBGroup;


            //SqlParameter paramAWBWL = new SqlParameter();
            //paramAWBWL.ParameterName = "@AWBWarehouseLocation";
            //paramAWBWL.SqlDbType = System.Data.SqlDbType.Structured;
            //paramAWBWL.Value = dtAWBGroup;


            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), paramAWBGroup, new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", UpdatedBy) };
            DataSet ds = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HouseSaveAtWeighing", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
        }
              
        public string SaveAtXRay(Int32 HAWBSNo, List<HAWBXRay> lsAWBXRay, bool ScanType, int UpdatedBy)
        {
            try
            { 
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBXRay, "");

            SqlParameter paramLocationXRay = new SqlParameter();
            paramLocationXRay.ParameterName = "@HAWBXRay";
            paramLocationXRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramLocationXRay.Value = dtAWBGroup;

            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), paramLocationXRay, new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", UpdatedBy) };
             DataSet ds = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HouseSaveAtXRay", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}        
        }

        public string SaveAtLocation(Int32 HAWBSNo, List<HAWBLocation> lsAWBLocation, List<ULDLocation> lsULDLocation, bool ScanType, int UpdatedBy)
        {
            try
            { 
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBLocation, "");
            DataTable dtUldLocation = CollectionHelper.ConvertTo(lsULDLocation, "");

            SqlParameter paramLocationXRay = new SqlParameter();
            paramLocationXRay.ParameterName = "@HAWBLocation";
            paramLocationXRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramLocationXRay.Value = dtAWBGroup;

            SqlParameter paramUldLocation = new SqlParameter();
            paramUldLocation.ParameterName = "@SLACUldLocation";
            paramUldLocation.SqlDbType = System.Data.SqlDbType.Structured;
            paramUldLocation.Value = dtUldLocation;

            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), paramLocationXRay,paramUldLocation, new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", UpdatedBy) };
            DataSet ds = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HouseSaveAtLocation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
        }

        public string GetRecordAtXray(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HouseGetRecordAtXray", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtLocation(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HouseGetRecordAtLocation", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtWeighing(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HouseGetRecordAtWeighing", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        
        public string GetCheckList(Int32 HAWBSNO)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNO", HAWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHouseCheckList", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveCheckList(Int32 HAWBSNo, List<CheckListTrans> CheckListTrans, bool XRay, string Remarks, Int32 UpdatedBy)
        {
            try
            { 
            DataTable dtCheckListTrans = CollectionHelper.ConvertTo(CheckListTrans, "");
            SqlParameter paramCheckListTrans = new SqlParameter();
            paramCheckListTrans.ParameterName = "@SCheckListTrans";
            paramCheckListTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramCheckListTrans.Value = dtCheckListTrans;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), paramCheckListTrans, new SqlParameter("@XRay", XRay), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", UpdatedBy) };
            DataSet ds1 = new DataSet();
            //try
            //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "HouseSaveCheckList", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
        }


    }
}