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
    #region AirCraft Service Description
    /*
	*****************************************************************************
	Service Name:	    AirCraftService      
	Purpose:		    This Service used to get details of AirCraft save update and delete
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    17 Apr 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirCraftService : SignatureAuthenticate, IAirCraftService
    {
        #region Aircraft
        public AirCraft GetAirCraftRecord(string recordID, string UserSNo)
        {
            AirCraft AirCraft = new AirCraft();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraft", Parameters);
                if (dr.Read())
                {
                    AirCraft.SNo = Convert.ToInt32(recordID);
                    AirCraft.AircraftType = Convert.ToString(dr["AircraftType"]).ToUpper();
                    AirCraft.VolumeWeight = Convert.ToDecimal(dr["VolumeWeight"].ToString() == "" ? "0" : dr["VolumeWeight"]);
                    AirCraft.VolumeWeightType = Convert.ToInt32(dr["VolumeWeightType"]);
                    if (!String.IsNullOrEmpty(dr["VolumeWeightType"].ToString()))
                    {
                        AirCraft.strVolumeWeightType = dr["strVolumeWeightType"].ToString().ToUpper();
                    }
                    AirCraft.GrossWeightType = Convert.ToInt32(dr["GrossWeightType"]);
                    if (!String.IsNullOrEmpty(dr["GrossWeightType"].ToString()))
                    {
                        AirCraft.strGrossWeightType = dr["strGrossWeightType"].ToString().ToUpper();
                    }
                    AirCraft.StructuralCapacity = Convert.ToInt32(dr["StructuralCapacity"].ToString() == "" ? "0" : dr["StructuralCapacity"]);
                    AirCraft.GrossWeight = Convert.ToDecimal(dr["GrossWeight"].ToString() == "" ? "0" : dr["GrossWeight"]);
                    AirCraft.MaxGrossWtPiece = Convert.ToDecimal(dr["MaxGrossWtPiece"].ToString() == "" ? "0" : dr["MaxGrossWtPiece"]);
                    AirCraft.MaxVolumePiece = Convert.ToDecimal(dr["MaxVolumePiece"].ToString() == "" ? "0" : dr["MaxVolumePiece"]);
                    AirCraft.BodyType = Convert.ToBoolean(dr["BodyType"]);
                    if (!String.IsNullOrEmpty(dr["BodyType"].ToString()))
                    {
                        AirCraft.strBodyType = dr["strBodyType"].ToString().ToUpper();
                    }
                    AirCraft.CargoClassification = Convert.ToInt32(dr["CargoClassification"]);
                    AirCraft.strCargoClassification = dr["strCargoClassification"].ToString();
                    AirCraft.AircraftVersion = Convert.ToString(dr["AircraftVersion"]).ToUpper();
                    AirCraft.LowerDeckPalletQty = Convert.ToString(dr["LowerDeckPalletQty"]);
                    AirCraft.UpperDeckPalletQty = Convert.ToString(dr["UpperDeckPalletQty"]);
                    AirCraft.LowerDeckContainerQty = Convert.ToString(dr["LowerDeckContainerQty"]);
                    AirCraft.Position = Convert.ToString(dr["Position"]);
                    AirCraft.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        AirCraft.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        AirCraft.Active = dr["Active"].ToString().ToUpper();
                    }
                    AirCraft.ABBRCodeSNo = Convert.ToString(dr["ABBRCodeSNo"]);
                    AirCraft.Text_ABBRCodeSNo = Convert.ToString(dr["ABBRCode"]);
                    AirCraft.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    AirCraft.Text_AirlineSNo = dr["AirlineName"].ToString().ToUpper();
                   
                    //AirCraft.AirCraftInventorySNo = Convert.ToInt32(dr["AirCraftInventorySNo"]);
                    //AirCraft.AirCraftInventoryAirCraftSNo = Convert.ToInt32(dr["AirCraftInventoryAirCraftSNo"]);
                    //AirCraft.AirCraftInventoryRegistrationNo = Convert.ToString(dr["AirCraftInventoryRegistrationNo"]);
                    //AirCraft.AirCraftInventoryIsActive = Convert.ToBoolean(dr["AirCraftInventoryIsActive"]);
                    //if (!String.IsNullOrEmpty(dr["AirCraftInventoryIsActive"].ToString()))
                    //{
                    //    AirCraft.AirCraftInventoryIsActive = Convert.ToBoolean(dr["AirCraftInventoryIsActive"]);
                    //    AirCraft.AirCraftInventoryActive = dr["AirCraftInventoryActive"].ToString().ToUpper();
                    //}
                    //AirCraft.AirCraftInventoryPaxFactorPaxStart = Convert.ToInt32(dr["AirCraftInventoryPaxFactorPaxStart"]);
                    //AirCraft.AirCraftInventoryPaxFactorPaxEnd = Convert.ToInt32(dr["AirCraftInventoryPaxFactorPaxEnd"]);
                    //AirCraft.AirCraftInventoryPaxFactorIncreaseFactor = Convert.ToDecimal(dr["AirCraftInventoryPaxFactorIncreaseFactor"].ToString() == "" ? "0" : dr["AirCraftInventoryPaxFactorIncreaseFactor"]);
                    //if (!String.IsNullOrEmpty(dr["AirCraftInventoryPaxFactorIsActive"].ToString()))
                    //{
                    //    AirCraft.AirCraftInventoryPaxFactorIsActive = Convert.ToBoolean(dr["AirCraftInventoryPaxFactorIsActive"]);
                    //    AirCraft.AirCraftInventoryPaxFactorActive = dr["AirCraftInventoryPaxFactorActive"].ToString().ToUpper();
                    //}
                    AirCraft.CreatedBy = Convert.ToString(dr["CreatedUser"]);
                    AirCraft.UpdatedBy = Convert.ToString(dr["UpdatedUser"]);
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return AirCraft;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AirCraft>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                 new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirCraft", Parameters);
                var AirCraftList = ds.Tables[0].AsEnumerable().Select(e => new AirCraft
                {

                    Text_AirlineSNo = (e["Text_AirlineSNo"]).ToString().ToUpper(),
                    AircraftType = e["AircraftType"].ToString().ToUpper(),
                    strCargoClassification = e["strCargoClassification"].ToString().ToUpper(),
                    SNo = Convert.ToInt32(e["SNo"]),
                    UpdatedBy = Convert.ToString(e["UpdatedBy"]),
                    Active = e["Active"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirCraftList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }

        public List<string> SaveAirCraft(List<AirCraft> AirCraft)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirCraft = CollectionHelper.ConvertTo(AirCraft, "Active,strVolumeWeightType,strGrossWeightType,strBodyType,AirCraftInventoryActive,AirCraftInventoryPaxFactorActive,AirCraftInventorySNo,AirCraftInventoryAirCraftSNo,AirCraftInventoryPaxFactorSNo,AirCraftInventoryPaxFactorAirCraftInventorySNo,strCargoClassification,Text_ABBRCodeSNo,Text_AirlineSNo,Airline,AirlineName");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AirCraft", dtCreateAirCraft, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter paramAccount = new SqlParameter();
                paramAccount.ParameterName = "@AirCraftTable";
                paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
                paramAccount.Value = dtCreateAirCraft;
                SqlParameter[] Parameters = { paramAccount };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraft", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirCraft");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }

        public List<string> UpdateAirCraft(List<AirCraft> AirCraft)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirCraft = CollectionHelper.ConvertTo(AirCraft, "Active,strVolumeWeightType,strGrossWeightType,strBodyType,AirCraftInventoryActive,AirCraftInventoryPaxFactorActive,AirCraftInventorySNo,AirCraftInventoryAirCraftSNo,AirCraftInventoryPaxFactorSNo,AirCraftInventoryPaxFactorAirCraftInventorySNo,strCargoClassification,Text_ABBRCodeSNo,Text_AirlineSNo,Airline,AirlineName");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AirCraft", dtCreateAirCraft, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirCraft;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraft", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirCraft");
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

                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
              
                throw ex;
            }
        }

        public List<string> DeleteAirCraft(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@AirCraft", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraft", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraft");
                            if (!string.IsNullOrEmpty(serverErrorMessage))
                                ErrorMessage.Add(serverErrorMessage);
                        }
                        else
                        {
                            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                            ret = 548;
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }
        #endregion

        #region Aircraft Inventory
        public KeyValuePair<string, List<AirCraftInventory>> GetAirCraftInventoryRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftInventory AirCraftInventory = new AirCraftInventory();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftInventory", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftInventoryList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftInventory
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftSNo = Convert.ToInt32(e["AirCraftSNo"]),
                    RegistrationNo = e["RegistrationNo"].ToString().ToUpper(),
                    Active = e["ACTIVE"].ToString(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AirCraftInventory>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftInventoryList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirCraftInventory(string strData)
        {
            int ret = 0;
            int ret1 = 0;
            try
            {
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftInventory = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                var dtCreateAirCraftInventory = (new DataView(dtAirCraftInventory, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateAirCraftInventory = (new DataView(dtAirCraftInventory, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftInventoryTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateAirCraftInventory.Rows.Count > 0)
                {
                    param.Value = dtCreateAirCraftInventory;
                    SqlParameter[] Parameters = { param };
                    ret1 = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftInventory123", Parameters);
                }
                // for update existing record
                if (dtUpdateAirCraftInventory.Rows.Count > 0)
                {
                    param.Value = dtUpdateAirCraftInventory;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftInventory", Parameters);
                }
                if (ret > 0 || ret1 > 0)
                {
                    if (ret == 547 || ret1 == 547)
                    {
                        ret = 548;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    else if (ret1 == 2000)
                    {
                        ret = 2000;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }

                    else if (ret < 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    else if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
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

                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }

        public List<Tuple<string, int>> deleteAirCraftInventory(string recordID)
        {
            int ret = 0;
            try
            {
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftInventory", Parameters);
                if (ret > 0)
                {
                    if (ret == 547)
                    {
                        ret = 549;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventory");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
               
                throw ex;
            }

        }
        #endregion

        #region AirCraft Inventory Pax Factor
        public KeyValuePair<string, List<AirCraftInventoryPaxFactor>> GetAirCraftInventoryPaxFactorRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftInventoryPaxFactor AirCraftInventoryPaxFactor = new AirCraftInventoryPaxFactor();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftInventoryPaxFactor", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftInventoryPaxFactorList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftInventoryPaxFactor
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftInventorySNo = e["RegistrationNo"].ToString(),
                    HdnAirCraftInventorySNo = e["AirCraftInventorySNo"].ToString(),
                    PaxStart = Convert.ToInt32(e["PaxStart"]),
                    PaxEnd = Convert.ToInt32(e["PaxEnd"]),
                    IncreaseFactor = e["IncreaseFactor"].ToString(),
                    Active = e["ACTIVE"].ToString(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AirCraftInventoryPaxFactor>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftInventoryPaxFactorList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }

        public List<string> createUpdateAirCraftInventoryPaxFactor(string strData)
        {
            int ret = 0;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftInventoryPaxFactor = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtAirCraftInventoryPaxFactor.Columns.Remove("AirCraftInventorySNo");
                var dtCreateAirCraftInventoryPaxFactor = (new DataView(dtAirCraftInventoryPaxFactor, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateAirCraftInventoryPaxFactor = (new DataView(dtAirCraftInventoryPaxFactor, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftInventoryPaxFactorTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateAirCraftInventoryPaxFactor.Rows.Count > 0)
                {
                    param.Value = dtCreateAirCraftInventoryPaxFactor;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftInventoryPaxFactor", Parameters);
                }
                // for update existing record
                if (dtUpdateAirCraftInventoryPaxFactor.Rows.Count > 0)
                {
                    param.Value = dtUpdateAirCraftInventoryPaxFactor;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftInventoryPaxFactor", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventoryPaxFactor");
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

        public List<string> deleteAirCraftInventoryPaxFactor(string recordID)
        {
            int ret = 0;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftInventoryPaxFactor", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftInventoryPaxFactor");
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
        #endregion

        #region AirCraft Door
        public KeyValuePair<string, List<AirCraftDoor>> GetAirCraftDoorRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftDoor AirCraftDoor = new AirCraftDoor();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftDoor", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftDoorList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftDoor
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftSNo = Convert.ToInt32(e["AirCraftSNo"]),
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
                return new KeyValuePair<string, List<AirCraftDoor>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftDoorList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                      throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirCraftDoor(string strData)
        {
            int ret = 0;
            try
            {
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftDoor = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //var dtCreateAirCraftDoor = (new DataView(dtAirCraftDoor, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateAirCraftDoor = (new DataView(dtAirCraftDoor, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftDoorTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                for (int i = 0; i < dtAirCraftDoor.Rows.Count; i++)
                {
                    if (dtAirCraftDoor.Rows[i]["SNo"].ToString() == "undefined")
                    {
                        dtAirCraftDoor.Rows[i].Delete();
                        i--;
                    }
                }
                // for create new record
                //if (dtCreateAirCraftDoor.Rows.Count > 0)
                //{
                //    param.Value = dtCreateAirCraftDoor;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftDoor", Parameters);
                //}
                //// for update existing record
                //if (dtUpdateAirCraftDoor.Rows.Count > 0)
                //{
                //    param.Value = dtUpdateAirCraftDoor;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftDoor", Parameters);
                //}
                //if (ret > 0)
                //{
                //    if (ret > 1000)
                //    {
                //        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
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


                if (dtAirCraftDoor.Rows.Count > 0)
                {
                    param.Value = dtAirCraftDoor;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAirCraftDoor", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 548)
                    {
                        ret = 1003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }

        }

        public List<string> deleteAirCraftDoor(string recordID)
        {
            int ret = 0;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftDoor", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
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
        #endregion

        #region AirCraft ULD
        public KeyValuePair<string, List<AirCraftULD>> GetAirCraftULDRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftULD AirCraftULD = new AirCraftULD();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftULD", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftULDList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftULD
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftSNo = Convert.ToInt32(e["AirCraftSNo"]),
                    ULDTypeSNo = e["ULDName"].ToString().ToUpper(),
                    ContourType = e["ContourType"].ToString().ToUpper(),
                    HdnContourType = e["ContourTypeSNo"].ToString(),
                    DeckType = e["DeckType"].ToString().ToUpper(),
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
                return new KeyValuePair<string, List<AirCraftULD>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftULDList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirCraftULD(string strData)
        {
            int ret = 0;
            try
            {
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftULD = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtAirCraftULD.Columns.Remove("ULDTypeSNo");
                dtAirCraftULD.Columns.Remove("ContourType");
                // var dtCreateAirCraftULD = (new DataView(dtAirCraftULD, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateAirCraftULD = (new DataView(dtAirCraftULD, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftULDTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                for (int i = 0; i < dtAirCraftULD.Rows.Count; i++)
                {
                    if (dtAirCraftULD.Rows[i]["SNo"].ToString() == "undefined")
                    {
                        dtAirCraftULD.Rows[i].Delete();
                        i--;
                    }
                }
                // for create new record
                //if (dtCreateAirCraftULD.Rows.Count > 0)
                //{
                //    param.Value = dtCreateAirCraftULD;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftULD", Parameters);
                //}
                //// for update existing record
                //if (dtUpdateAirCraftULD.Rows.Count > 0)
                //{
                //    param.Value = dtUpdateAirCraftULD;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftULD", Parameters);
                //}
                if (dtAirCraftULD.Rows.Count > 0)
                {
                    param.Value = dtAirCraftULD;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAirCraftULD", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 548)
                    {
                        ret = 1003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftULD");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftULD");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftULD");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public List<string> deleteAirCraftULD(string recordID)
        {
            int ret = 0;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftULD", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftULD");
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
        #endregion
        
        #region AirCraft SPHC Created By krishan Kant Agarwal
        public KeyValuePair<string, List<AirCraftSPHC>> GetAirCraftSPHCRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftSPHC AirCraftSPHC = new AirCraftSPHC();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirCraftSPHC", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftSPHCList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftSPHC
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftSNo = Convert.ToInt32(e["AirCraftSNo"]),
                    HdnSPHCSNo = e["SPHCSNo"].ToString(),
                    SPHCSNo = e["SPHCCode"].ToString().ToUpper(),
                    Compatible = e["Compatible"].ToString().ToUpper(),
                    IsCompatible = e["IsCompatible"].ToString(),
                    AFT = e["AFT"].ToString().ToUpper(),
                    FWD = e["FWD"].ToString().ToUpper(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo
                });
                return new KeyValuePair<string, List<AirCraftSPHC>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftSPHCList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        //public List<Tuple<string, int>> createUpdateAirCraftSPHC(string strData)
        //{
        //    int ret = 0;
        //    int ret1 = 0;
        //    List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    // convert JSON string ito datatable
        //    var dtAirCraftSPHC = JsonConvert.DeserializeObject<DataTable>(strData);
        //    if (dtAirCraftSPHC.Columns.Contains("SPHCSNo"))
        //        dtAirCraftSPHC.Columns.Remove("SPHCSNo");
        //    var dtCreateAirCraftSPHC = (new DataView(dtAirCraftSPHC, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    var dtUpdateAirCraftSPHC = (new DataView(dtAirCraftSPHC, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@AirCraftSPHCTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    // for create new record
        //    if (dtCreateAirCraftSPHC.Rows.Count > 0)
        //    {
        //        param.Value = dtCreateAirCraftSPHC;
        //        SqlParameter[] Parameters = { param };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftSPHC", Parameters);
        //    }
        //    // for update existing record
        //    if (dtUpdateAirCraftSPHC.Rows.Count > 0)
        //    {
        //        param.Value = dtUpdateAirCraftSPHC;
        //        SqlParameter[] Parameters = { param };
        //        ret1 = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftSPHC", Parameters);
        //    }
        //    if (ret > 0 || ret1 > 0)
        //    {
        //        if (ret == 548 || ret1 == 547)
        //        {
        //            ret = 1001;
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }

        //        else if (ret1 > 0)
        //        {
        //            //ret = 2001;
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret1, "AirCraftSPHC");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
        //        }
        //        else if (ret1 < 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret1, "AirCraftSPHC");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //        }

        //        else if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
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

        //    //if (ret > 0)
        //    //{
        //    //    if (ret > 1000)
        //    //    {
        //    //        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
        //    //        if (!string.IsNullOrEmpty(serverErrorMessage))
        //    //            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
        //    //    }
        //    //    else
        //    //    {
        //    //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //    //        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //    //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //    //            ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
        //    //    }
        //    //}
        //    return ErrorMessage;
        //}



        public List<Tuple<string, int>> createUpdateAirCraftSPHC(string strData)
        {
            int ret = 0;
            try
            {
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();

                // convert JSON string ito datatable
                var dtAirCraftSPHC = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));

                //if (dtAirCraftSPHC.Columns.Contains("SPHCSNo"))
                dtAirCraftSPHC.Columns.Remove("SPHCSNo");
                //var a = dtAirCraftSPHC.Rows.Count;
                for (int i = 0; i < dtAirCraftSPHC.Rows.Count; i++)
                {
                    if (dtAirCraftSPHC.Rows[i]["SNo"].ToString() == "undefined")
                    {
                        dtAirCraftSPHC.Rows[i].Delete();
                        i--;
                    }
                }

                //var dtCreateAirCraftSPHC = (new DataView(dtAirCraftSPHC, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateAirCraftSPHC = (new DataView(dtAirCraftSPHC, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftSPHCTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                //if (dtCreateAirCraftSPHC.Rows.Count > 0)
                //{
                //    param.Value = dtCreateAirCraftSPHC;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftSPHC", Parameters);
                //}
                //// for update existing record
                //if (dtUpdateAirCraftSPHC.Rows.Count > 0)
                //{
                //    param.Value = dtUpdateAirCraftSPHC;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftSPHC", Parameters);
                //}
                //if (ret > 0)
                //{
                //    if (ret > 1000)
                //    {
                //        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
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


                if (dtAirCraftSPHC.Rows.Count > 0)
                {
                    param.Value = dtAirCraftSPHC;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAirCraftSPHC", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 548)
                    {
                        ret = 1003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }

        }

        public List<string> deleteAirCraftSPHC(string recordID)
        {
            int ret = 0;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftSPHC", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftSPHC");
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
        #endregion

        #region AirCraft Passenger Capacity Created By Tarun on 21 Dec 2015
        public string BindPassengerCapacity(string AirCraftSNo)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                       new SqlParameter("@AirCraftSNo", AirCraftSNo)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirCraftPassengerDetail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string UpdatePassengerCapacity(int AirCraftSNo, int PassengerCapacity, String BaggageWeight, int AdultMale, int AdultFemale, int Child, int Infant, int NoofBaggageImperial, int NoofBaggageBusiness, int NoofBaggagePremiumEconomy, int NoofBaggageTouristEconomy, int NoofBaggageTotal, int NoofBaggageAllowanceImperial, int NoofBaggageAllowanceBusiness, int NoofBaggageAllowancePremiumEconomy, int NoofBaggageAllowanceTouristEconomy, int NoofBaggageAllowanceTotal, int CreatedBy)
        {
            DataSet ds = new DataSet();
            // convert JSON string into datatable
            //var dtULDBreakdown = JsonConvert.DeserializeObject<DataTable>(DivData);
            try
            {
                SqlParameter[] Parameters = { 
                //new SqlParameter("@ULDBreakdown",dtULDBreakdown),
                new SqlParameter("@AirCraftSNo", AirCraftSNo),
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
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateAirCraftPassenger", Parameters);
                //Finish:
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }
        #endregion

        #region AirCraft Dimension Matrix Information Created By Laxmikanta on 20 jan 2017
        public string BindDimensionMatrix(string RecordID, int HoldType, int Unit)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                //if (!baseBusiness.ValidateBaseBusiness("", dtCreateAirline, ""))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}
                DataSet dsDimnsionMatrix = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordID), new SqlParameter("@HoldType", HoldType), new SqlParameter("@Unit", Unit) };
                dsDimnsionMatrix = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ReadAircraftMatrixInformation", Parameters);
                if (dsDimnsionMatrix != null)
                {
                    if (dsDimnsionMatrix.Tables[0].Rows[0][0].ToString() == "22")
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(22, "AirCraft");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    if (dsDimnsionMatrix.Tables[0].Rows[0][0].ToString() == "25")
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(25, "AirCraft");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }

                }

                dsDimnsionMatrix.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsDimnsionMatrix);
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }

        }
        #endregion

        #region AirCraft Sector Wise Capacity Created By Devendra Singh Sikarwar
        public KeyValuePair<string, List<AirCraftSectorWiseCapacity>> GetAircraftSectorWiseCapacityRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirCraftSectorWiseCapacity AirCraftSPHC = new AirCraftSectorWiseCapacity();
                SqlParameter[] Parameters = { new SqlParameter("@AirCraftSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAircraftSectorWiseCapacityRecord", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AirCraftSPHCList = ds.Tables[0].AsEnumerable().Select(e => new AirCraftSectorWiseCapacity
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirCraftSNo = Convert.ToString(e["AirCraftSNo"]),
                    Origin = Convert.ToString(e["OriAirportName"]),
                    Destination = Convert.ToString(e["DestAirportName"]),
                    HdnOrigin = Convert.ToString(e["OriAirportSNo"]),
                    HdnDestination = Convert.ToString(e["DestAirportSNo"]),
                    VolumeWeightUnit = Convert.ToString(e["VolumeWeightType"]),
                    VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                    Text_GrossWeightUnit = Convert.ToString(e["Text_GrossWeightType"]),
                    Text_VolumeWeightUnit= Convert.ToString(e["Text_VolumeWeightType"]),
                    GrossWeightUnit = Convert.ToString(e["GrossWeightType"]),
                    GrossWeight= Convert.ToString(e["GrossWeight"]),
                    StructuralCapacity = Convert.ToString(e["StructuralCapacity"]),
                    MaxGrossWtPiece = Convert.ToString(e["MaxGrossWtPiece"]),
                    MaxVolumePerPiece = Convert.ToString(e["MaxVolumePiece"]),
                    Active = Convert.ToString(e["Active"]),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo
                });
                return new KeyValuePair<string, List<AirCraftSectorWiseCapacity>>(ds.Tables[1].Rows[0][0].ToString(), AirCraftSPHCList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirCraftSectorWiseCapacity(string strData)
        {
            int ret = 0;
            try
            {
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAirCraftSectorWiseCapacity = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //var dtCreateAirCraftDoor = (new DataView(dtAirCraftDoor, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateAirCraftDoor = (new DataView(dtAirCraftDoor, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AircraftSectorCapacity";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                for (int i = 0; i < dtAirCraftSectorWiseCapacity.Rows.Count; i++)
                {
                    if (dtAirCraftSectorWiseCapacity.Rows[i]["SNo"].ToString() == "undefined")
                    {
                        dtAirCraftSectorWiseCapacity.Rows[i].Delete();
                        i--;
                    }
                }
                

                if (dtAirCraftSectorWiseCapacity.Rows.Count > 0)
                {
                    dtAirCraftSectorWiseCapacity.Columns.Remove("Origin");
                    dtAirCraftSectorWiseCapacity.Columns.Remove("Destination");
                    param.Value = dtAirCraftSectorWiseCapacity;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateAircraftSectorWiseCapacity", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 548)
                    {
                        ret = 1003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
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
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }

        }
        public List<Tuple<string, int>> DeleteAirCraftSectorWiseCapacity(string recordID)
        {
            int ret = 0;
            try
            {
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirCraftSectorWiseCapacity", Parameters);
                if (ret > 0)
                {
                    if (ret == 547)
                    {
                        ret = 549;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraftDoor");
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
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }

        }
        #endregion

    }
}
