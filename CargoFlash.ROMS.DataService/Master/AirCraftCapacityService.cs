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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region AirCraftCapacity Service Description
    /*
	*****************************************************************************
	Service Name:	    AirCraftCapacityService      
	Purpose:		    This Service used to get details of AirCraftCapacity save update and delete
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    06 May 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirCraftCapacityService : SignatureAuthenticate, IAirCraftCapacityService
    {
        public AirCraftCapacity GetAirCraftCapacityRecord(string recordID, string UserSNo)
        {
            AirCraftCapacity AirCraftCapacity = new AirCraftCapacity();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftCapacity", Parameters);
                if (dr.Read())
                {
                   
                    AirCraftCapacity.SNo = Convert.ToInt32(recordID);
                    AirCraftCapacity.AirlineSNo =Convert.ToInt32(dr["AirlineSNo"]);
                    AirCraftCapacity.Text_AirlineSNo = Convert.ToString(dr["Text_AirlineSNo"]).ToUpper();
                    AirCraftCapacity.AirCraftSNo = Convert.ToString(dr["AirCraftSNo"]).ToUpper();
                    AirCraftCapacity.Text_AirCraftSNo = Convert.ToString(dr["Text_AirCraftSNo"]).ToUpper();
                    AirCraftCapacity.Text_AirCraftInventorySNo = Convert.ToString(dr["Text_AirCraftInventorySNo"]).ToUpper();
                    AirCraftCapacity.Text_OriginSNo = Convert.ToString(dr["Text_OriginSNo"]).ToUpper();
                    AirCraftCapacity.Text_DestinationSNo = Convert.ToString(dr["Text_DestinationSNo"]).ToUpper();
                    AirCraftCapacity.AirCraftInventorySNo = Convert.ToString(dr["AirCraftInventorySNo"]).ToUpper();
                    AirCraftCapacity.OriginSNo = Convert.ToString(dr["OriginSNo"]).ToUpper();
                    AirCraftCapacity.DestinationSNo = Convert.ToString(dr["DestinationSNo"]).ToUpper();
                    AirCraftCapacity.FlyingMinutesStart = Convert.ToString(dr["FlyingMinutesStart"]);
                    AirCraftCapacity.FlyingMinuteEnd = Convert.ToString(dr["FlyingMinuteEnd"]);
                    AirCraftCapacity.VolumeWeight = Convert.ToString(dr["VolumeWeight"]);
                    AirCraftCapacity.VolumeWeightType = Convert.ToString(dr["VolumeWeightType"]);
                    if (!String.IsNullOrEmpty(dr["VolumeWeightType"].ToString()))
                    {
                        AirCraftCapacity.strVolumeWeightType = dr["strVolumeWeightType"].ToString().ToUpper();
                    }
                    AirCraftCapacity.GrossWeight = Convert.ToString(dr["GrossWeight"]);
                    AirCraftCapacity.GrossWeightType = Convert.ToString(dr["GrossWeightType"]);
                    if (!String.IsNullOrEmpty(dr["GrossWeightType"].ToString()))
                    {
                        AirCraftCapacity.strGrossWeightType = dr["strGrossWeightType"].ToString().ToUpper();
                    }
                    AirCraftCapacity.MaxGrossWtPiece = Convert.ToString(dr["MaxGrossWtPiece"]);
                    AirCraftCapacity.ReportGrossWeight = Convert.ToString(dr["ReportGrossWeight"]);

                    AirCraftCapacity.AlertVolumeWeight = Convert.ToString(dr["AlertVolumeWeight"]);
                    AirCraftCapacity.AlertGrossWeight = Convert.ToString(dr["AlertGrossWeight"]);
                    AirCraftCapacity.LeverageGrossWeight = Convert.ToString(dr["LeverageGrossWeight"]);
                    AirCraftCapacity.LeverageVolumeWeight = Convert.ToString(dr["LeverageVolumeWeight"]);
                    AirCraftCapacity.LeverageAlertGrossWeight = Convert.ToString(dr["LeverageAlertGrossWeight"]);
                    AirCraftCapacity.LeverageAlertVolumeWeight = Convert.ToString(dr["LeverageAlertVolumeWeight"]);
                    AirCraftCapacity.LowerDeckPalletQty = Convert.ToString(dr["LowerDeckPalletQty"]);
                    AirCraftCapacity.UpperDeckPalletQty = Convert.ToString(dr["UpperDeckPalletQty"]);
                    AirCraftCapacity.LowerDeckContainerQty = Convert.ToString(dr["LowerDeckContainerQty"]);
                    AirCraftCapacity.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        AirCraftCapacity.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        AirCraftCapacity.Active = dr["Active"].ToString().ToUpper();
                    }
                    AirCraftCapacity.CreatedBy = Convert.ToString(dr["CreatedUser"]);
                    AirCraftCapacity.UpdatedBy = Convert.ToString(dr["UpdatedUser"]);
                }
            }
            
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return AirCraftCapacity;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AirCraftCapacity>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                    new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirCraftCapacity", Parameters);
                var AirCraftCapacityList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftCapacity
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Text_AirlineSNo = (e["Text_AirlineSNo"]).ToString().ToUpper(),
                    Text_AirCraftSNo = e["Text_AirCraftSNo"].ToString().ToUpper(),
                    Text_AirCraftInventorySNo = e["Text_AirCraftInventorySNo"].ToString().ToUpper(),
                    Text_OriginSNo = e["Text_OriginSNo"].ToString().ToUpper(),
                    Text_DestinationSNo = e["Text_DestinationSNo"].ToString().ToUpper(),
                    strVolumeWeightType = e["strVolumeWeightType"].ToString().ToUpper(),
                    strGrossWeightType = e["strGrossWeightType"].ToString().ToUpper(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    //VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    //GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    //MaxGrossWtPiece = Convert.ToDecimal(e["MaxGrossWtPiece"]),
                    Active = e["Active"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirCraftCapacityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }

        public List<string> SaveAirCraftCapacity(List<AirCraftCapacity> AirCraftCapacity)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
               
                DataTable dtCreateAirCraftCapacity = CollectionHelper.ConvertTo(AirCraftCapacity, "Active,Text_AirCraftSNo,Text_AirCraftInventorySNo,Text_OriginSNo,Text_DestinationSNo,strGrossWeightType,strVolumeWeightType,Text_AirlineSNo");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AirCraftCapacity", dtCreateAirCraftCapacity, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter paramAirCraftCapacity = new SqlParameter();
                paramAirCraftCapacity.ParameterName = "@AirCraftCapacityTable";
                paramAirCraftCapacity.SqlDbType = System.Data.SqlDbType.Structured;
                paramAirCraftCapacity.Value = dtCreateAirCraftCapacity;
                SqlParameter[] Parameters = { paramAirCraftCapacity };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftCapacity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirCraftCapacity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> UpdateAirCraftCapacity(List<AirCraftCapacity> AirCraftCapacity)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
                
                DataTable dtCreateAirCraftCapacity = CollectionHelper.ConvertTo(AirCraftCapacity, "Active,Text_AirCraftSNo,Text_AirCraftInventorySNo,Text_OriginSNo,Text_DestinationSNo,strGrossWeightType,strVolumeWeightType,Text_AirlineSNo");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AirCraftCapacity", dtCreateAirCraftCapacity, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftCapacityTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirCraftCapacity;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftCapacity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirCraftCapacity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }

                
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteAirCraftCapacity(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftCapacity", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacity");
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
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                    //Error
                }
              
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        #region AirCraft Capacity Door  Created By Tarun on 18 Dec 2015
        public KeyValuePair<string, List<AirCraftCapacityDoor>> GetAirCraftCapacityDoorRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftCapacityDoor AirCraftCapacityDoor = new AirCraftCapacityDoor();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftCapacitySNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftCapacityDoor", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftCapacityDoorList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftCapacityDoor
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftCapacitySNo = Convert.ToInt32(e["AirCraftCapacitySNo"]),
                    DoorName = e["DoorName"].ToString().ToUpper(),
                    UnitType = e["UnitType"].ToString() == "True" ? 1 : 0,
                    strUnitType = e["strUnitType"].ToString().ToUpper(),
                    Height = e["Height"].ToString(),
                    Width = e["Width"].ToString(),
                    Active = e["ACTIVE"].ToString().ToUpper(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AirCraftCapacityDoor>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftCapacityDoorList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirCraftCapacityDoor(string strData)
        {
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            try
            {
                int ret = 0;
                
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftCapacityDoor = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //var dtCreateAirCraftCapacityDoor = (new DataView(dtAirCraftCapacityDoor, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateAirCraftCapacityDoor = (new DataView(dtAirCraftCapacityDoor, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftCapacityDoorTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                for (int i = 0; i < dtAirCraftCapacityDoor.Rows.Count; i++)
                {
                    if (dtAirCraftCapacityDoor.Rows[i]["SNo"].ToString() == "undefined")
                    {
                        dtAirCraftCapacityDoor.Rows[i].Delete();
                        i--;
                    }
                }

                // for create new record
                //if (dtCreateAirCraftCapacityDoor.Rows.Count > 0)
                //{
                //    param.Value = dtCreateAirCraftCapacityDoor;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftCapacityDoor", Parameters);
                //}
                //// for update existing record
                //if (dtUpdateAirCraftCapacityDoor.Rows.Count > 0)
                //{
                //    param.Value = dtUpdateAirCraftCapacityDoor;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftCapacityDoor", Parameters);
                //}
                //if (ret > 0)
                //{
                //    if (ret > 1000)
                //    {
                //        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityDoor");
                //        if (!string.IsNullOrEmpty(serverErrorMessage))
                //            ErrorMessage.Add(serverErrorMessage);
                //    }
                //    else
                //    {
                //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                //        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                //            ErrorMessage.Add(dataBaseExceptionMessage);
                //    }
                //}
                //return ErrorMessage;
                if (dtAirCraftCapacityDoor.Rows.Count > 0)
                {
                    param.Value = dtAirCraftCapacityDoor;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAirCraftCapacityDoor", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 548)
                    {
                        ret = 1003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                    }
                }
                
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> deleteAirCraftCapacityDoor(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftCapacityDoor", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityDoor");
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
                
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        #endregion

        #region AirCraft Capacity ULD  Created By Tarun on 16 Dec 2015
        public KeyValuePair<string, List<AirCraftCapacityULD>> GetAirCraftCapacityULDRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftCapacityULD AirCraftCapacityULD = new AirCraftCapacityULD();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftCapacitySNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftCapacityULD", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftCapacityULDList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftCapacityULD
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftCapacitySNo = Convert.ToInt32(e["AirCraftCapacitySNo"]),
                    ULDTypeSNo = e["ULDName"].ToString().ToUpper(),
                    DeckType = e["DeckType"].ToString().ToUpper(),
                    ContourType = e["ContourType"].ToString().ToUpper(),
                    HdnContourType = e["ContourTypeSNo"].ToString(),
                    Unit = Convert.ToInt32(e["Unit"]),
                    strDeckType = e["strDeckType"].ToString().ToUpper(),
                    HdnULDTypeSNo = e["ULDTypeSNo"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    Active = e["ACTIVE"].ToString().ToUpper(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AirCraftCapacityULD>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftCapacityULDList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirCraftCapacityULD(string strData)
        {
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftCapacityULD = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //if (dtAirCraftCapacityULD.Columns.Contains("ULDTypeSNo"))
                //    dtAirCraftCapacityULD.Columns.Remove("ULDTypeSNo");
                dtAirCraftCapacityULD.Columns.Remove("ULDTypeSNo");
                dtAirCraftCapacityULD.Columns.Remove("ContourType");

                //var dtCreateAirCraftCapacityULD = (new DataView(dtAirCraftCapacityULD, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateAirCraftCapacityULD = (new DataView(dtAirCraftCapacityULD, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftCapacityULDTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                for (int i = 0; i < dtAirCraftCapacityULD.Rows.Count; i++)
                {
                    if (dtAirCraftCapacityULD.Rows[i]["SNo"].ToString() == "undefined")
                    {
                        dtAirCraftCapacityULD.Rows[i].Delete();
                        i--;
                    }
                }
                // for update existing record
                //if (dtUpdateAirCraftCapacityULD.Rows.Count > 0)
                //{
                //    param.Value = dtUpdateAirCraftCapacityULD;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftCapacityULD", Parameters);
                //}
                // for create new record
                //if (dtCreateAirCraftCapacityULD.Rows.Count > 0)
                //{
                //    param.Value = dtCreateAirCraftCapacityULD;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftCapacityULD", Parameters);
                //}

                //if (ret > 0)
                //{
                //    if (ret > 1000)
                //    {
                //        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
                //        if (!string.IsNullOrEmpty(serverErrorMessage))
                //            ErrorMessage.Add(serverErrorMessage);
                //    }
                //    else
                //    {
                //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                //        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                //            ErrorMessage.Add(dataBaseExceptionMessage);
                //    }
                //}
                //return ErrorMessage;

                if (dtAirCraftCapacityULD.Rows.Count > 0)
                {
                    param.Value = dtAirCraftCapacityULD;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAirCraftCapacityULD", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 548)
                    {
                        ret = 1003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                    }
                }
               
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> deleteAirCraftCapacityULD(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
                
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftCapacityULD", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
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
               
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        //public List<Tuple<string, int>>CreateUpdateAirCraftcapacityULD(string strData)
        //{
        //    int ret = 0;
        //    List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    // convert JSON string ito datatable
        //     var dtAirCraftCapacityULD = JsonConvert.DeserializeObject<DataTable>(strData);
        //     if (dtAirCraftCapacityULD.Columns.Contains("ULDTypeSNo"))
        //        dtAirCraftCapacityULD.Columns.Remove("ULDTypeSNo");
        //    var dtCreateAirCraftCapacityULD = (new DataView(dtAirCraftCapacityULD, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //   var dtUpdateAirCraftCapacityULD = (new DataView(dtAirCraftCapacityULD, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@AirCraftCapacityULDTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
          
        //    if ( dtAirCraftCapacityULD.Rows.Count > 0)
        //    {
        //        param.Value =  dtAirCraftCapacityULD;
        //        SqlParameter[] Parameters = { param };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAirCraftcapacityULD", Parameters);
        //    }
        //    if (ret > 0)
        //    {
        //        if (ret == 548)
        //        {
        //            ret = 1003;
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }

        //        if (ret == 1001)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }
        //        if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacityULD");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
        //        }
        //    }
        //    return ErrorMessage;
        //}








        #endregion

        #region AirCraft Capacity SPHC  Created By Tarun on 17 Dec 2015
        public KeyValuePair<string, List<AirCraftCapacitySPHC>> GetAirCraftCapacitySPHCRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftCapacitySPHC AirCraftCapacitySPHC = new AirCraftCapacitySPHC();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftCapacitySNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                // DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetRecordAirCraftCapacitySPHC", Parameters); //
                //DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetRecordAirCraftSPHC", Parameters);

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftCapacitySPHC_tep", Parameters);

                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftCapacitySPHCList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftCapacitySPHC
                {
                    //SNo = Convert.ToInt32(e["AirCraftCapacitySNo"]),
                    //AirCraftCapacitySNo = Convert.ToInt32(e["AirCraftCapacitySNo"]),
                    //HdnSPHCSNo = e["SPHCSNo"].ToString(),
                    //SPHCSNo = e["Code"].ToString(),
                    //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo

                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftCapacitySNo = Convert.ToInt32(e["AirCraftCapacitySNo"]),
                    HdnSPHCSNo = e["SPHCSNo"].ToString(),
                    SPHCSNo = e["SPHCCode"].ToString().ToUpper(),
                    Compatible = e["Compatible"].ToString().ToUpper(),
                    IsCompatible = e["IsCompatible"].ToString(),
                    AFT = e["AFT"].ToString().ToUpper(),
                    FWD = e["FWD"].ToString().ToUpper(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo



                });
                return new KeyValuePair<string, List<AirCraftCapacitySPHC>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftCapacitySPHCList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirCraftCapacitySPHC(string strData)
        {
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            try
            {
                int ret = 0;
                
                // List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftCapacitySPHC = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                if (dtAirCraftCapacitySPHC.Columns.Contains("SPHCSNo"))
                    dtAirCraftCapacitySPHC.Columns.Remove("SPHCSNo");

                for (int i = 0; i < dtAirCraftCapacitySPHC.Rows.Count; i++)
                {
                    if (dtAirCraftCapacitySPHC.Rows[i]["SNo"].ToString() == "undefined")
                    {
                        dtAirCraftCapacitySPHC.Rows[i].Delete();
                        i--;
                    }
                }
                //  var dtCreateAirCraftCapacitySPHC = (new DataView(dtAirCraftCapacitySPHC, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //  var dtUpdateAirCraftCapacitySPHC = (new DataView(dtAirCraftCapacitySPHC, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftCapacitySPHCTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                //if (dtCreateAirCraftCapacitySPHC.Rows.Count > 0)
                //{
                //    param.Value = dtCreateAirCraftCapacitySPHC;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftCapacitySPHC_tem", Parameters);
                //}
                // for update existing record         

                if (dtAirCraftCapacitySPHC.Rows.Count > 0)
                {
                    param.Value = dtAirCraftCapacitySPHC;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAirCraftcapacitySPHC", Parameters);
                }

                if (ret > 0)
                {
                    if (ret == 548)
                    {
                        ret = 1003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacitySPHC");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacitySPHC");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacitySPHC");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacitySPHC");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                }
               
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> deleteAirCraftCapacitySPHC(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftCapacitySPHC_tep", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftCapacitySPHC");
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
                
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        #endregion

        #region AirCraft Capacity Passenger Capacity Created By Tarun on 22 Dec 2015
        public string BindPassengerCapacity(string AirCraftCapacitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                       new SqlParameter("@AirCraftCapacitySNo", AirCraftCapacitySNo)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirCraftCapacityPassengerDetail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string UpdatePassengerCapacity(int AirCraftCapacitySNo, int PassengerCapacity, String BaggageWeight, int AdultMale, int AdultFemale, int Child, int Infant, int NoofBaggageImperial, int NoofBaggageBusiness, int NoofBaggagePremiumEconomy, int NoofBaggageTouristEconomy, int NoofBaggageTotal, int NoofBaggageAllowanceImperial, int NoofBaggageAllowanceBusiness, int NoofBaggageAllowancePremiumEconomy, int NoofBaggageAllowanceTouristEconomy, int NoofBaggageAllowanceTotal, int CreatedBy)
        {
            try
            {
                DataSet ds = new DataSet();
                // convert JSON string into datatable
                //var dtULDBreakdown = JsonConvert.DeserializeObject<DataTable>(DivData);
                SqlParameter[] Parameters = { 
                //new SqlParameter("@ULDBreakdown",dtULDBreakdown),
                new SqlParameter("@AirCraftCapacitySNo", AirCraftCapacitySNo),
                new SqlParameter("@PassengerCapacity", PassengerCapacity),
                new SqlParameter("@BaggageWeight", BaggageWeight),
                new SqlParameter("@AdultMale", AdultMale),
                new SqlParameter("@AdultFemale", AdultFemale),
                new SqlParameter("@Child", Child),
                new SqlParameter("@Infant", Infant), 
                new SqlParameter("@NoofBaggageImperial", NoofBaggageImperial),
                new SqlParameter("@NoofBaggageBusiness", NoofBaggageBusiness),
                new SqlParameter("@NoofBaggagePremiumEconomy", NoofBaggagePremiumEconomy),
                new SqlParameter("@NoofBaggageTouristEconomy", NoofBaggageTouristEconomy),
                new SqlParameter("@NoofBaggageTotal", NoofBaggageTotal),
                new SqlParameter("@NoofBaggageAllowanceImperial", NoofBaggageAllowanceImperial),
                new SqlParameter("@NoofBaggageAllowanceBusiness", NoofBaggageAllowanceBusiness), 
                new SqlParameter("@NoofBaggageAllowancePremiumEconomy", NoofBaggageAllowancePremiumEconomy),
                new SqlParameter("@NoofBaggageAllowanceTouristEconomy", NoofBaggageAllowanceTouristEconomy),
                new SqlParameter("@NoofBaggageAllowanceTotal", NoofBaggageAllowanceTotal),
                new SqlParameter("@CreatedBy", CreatedBy)};
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateAirCraftCapacityPassenger", Parameters);
                //Finish:
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        #endregion
    }
}