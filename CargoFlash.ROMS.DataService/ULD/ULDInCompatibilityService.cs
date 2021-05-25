using
System;
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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{

        #region Charges Service Description
        /*
	*****************************************************************************
	Service Name:	ChargesService      
	Purpose:		This Service used to get details of Charges save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		26 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
        #endregion
        [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
        [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
         class ULDInCompatibilityService : SignatureAuthenticate, IULDInCompatibilityService
         {
            CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
            public ULDInCompatibility GetULDInCompatibilityRecord(string recordID, string UserID)
            {
                try
                {
                ULDInCompatibility UldIncompatibility = new ULDInCompatibility();
                SqlDataReader dr = null;
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                    dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDInCompatibility", Parameters);
                    if (dr.Read())
                    {
                        UldIncompatibility.SNo = Convert.ToInt32(dr["SNo"]);
                        UldIncompatibility.UldTypeName = Convert.ToString(dr["UldTypeSNo"]);
                        UldIncompatibility.Text_UldTypeName = Convert.ToString(dr["UldTypeName"]);
                        UldIncompatibility.SPHC1 = Convert.ToString(dr["SPHCSNo1"]);
                        UldIncompatibility.SPHC2 = Convert.ToString(dr["SPHCSNo2"]);
                        UldIncompatibility.Text_SPHC1 = Convert.ToString(dr["SPHC1"]);
                        UldIncompatibility.Text_SPHC2 = Convert.ToString(dr["SPHC2"]);
                        UldIncompatibility.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        UldIncompatibility.Active = Convert.ToString(dr["Active"]);
                        UldIncompatibility.Text_Airline = Convert.ToString(dr["AirlineName"]);
                        UldIncompatibility.Airline = Convert.ToString(dr["AirlineSno"]);
                    }
                    dr.Close();
                    return UldIncompatibility;
                }
                catch(Exception ex)//(Exception ex) 
                {
                    throw ex;
                }
            }



            //public List< ULDInCompatibilityTrans> GetULDInCompatibilityTransRecord(string recordID)
            //{
            //    List<ULDInCompatibilityTrans> charges = new List<ULDInCompatibilityTrans>();

            //    SqlDataReader dr = null;
            //    try
            //    {
            //        SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            //        dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "GetULDInCompatibilityRecordTrans", Parameters);
            //        if (dr.Read())
            //        {

            //            //charges.TransSNo = Convert.ToInt32(dr["SNo"]);
            //            charges.TransChargeName = Convert.ToString(dr["ChargeName"]);
            //            charges.TransActive = Convert.ToString(dr["Active"]);
            //            //charges.PrimaryBasisOfChargeSNo = Convert.ToString(dr["PrimaryBasisOfCharge"]);
            //            //charges.SecondaryBasisOfChargeSNo = Convert.ToString(dr["SecondaryBasisOfCharge"]);
            //            //charges.TariffDescription = Convert.ToString(dr["TariffDescription"]);
            //            //charges.TariffAccountName = Convert.ToString(dr["TariffAccountName"]);


            //           // charges.Active = Convert.ToString(dr["Active"]);
            //        }

            //    }
            //    catch(Exception ex)// (Exception e)
            //    {

            //        dr.Close();
            //    }
            //    dr.Close();
            //    return charges;
            //}

            public List<ULDInCompatibilityTrans> GetULDInCompatibilityTransRecord(string recordID)
            {
                try
                { 
                List<ULDInCompatibilityTrans> listtariffForwardRateTrans = new List<ULDInCompatibilityTrans>();
                ULDInCompatibilityTrans TariffForwardRateTrans = new ULDInCompatibilityTrans();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDInCompatibilityRecordTrans", Parameters);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        listtariffForwardRateTrans.Add(new ULDInCompatibilityTrans
                        {
                            SPHC1 = Convert.ToString(dr["SPHCSNo1"]),
                            SPHC2 = Convert.ToString(dr["SPHCSNo2"]),
                           Text_SPHC1 = Convert.ToString(dr["SPHC1"]),
                            Text_SPHC2 = Convert.ToString(dr["SPHC2"]),

                           IsActive = Convert.ToBoolean(dr["IsActive"].ToString()),
                            Active = Convert.ToString(dr["Active"].ToString()),
                        });
                    }
                }
                return listtariffForwardRateTrans;
               }
                catch(Exception ex)//(Exception ex)
                {
                    throw ex;
                }
            }


            public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
            {
                try
                { 
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ULDInCompatibility>(filter);
                
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDInCompatibility", Parameters);
                var ChargesList = ds.Tables[0].AsEnumerable().Select(e => new ULDInCompatibility
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                  //  Text_AircraftName = Convert.ToString(e["AircraftName"]),
                    UldTypeName = Convert.ToString(e["UldTypeName"].ToString().ToUpper()),
                    SPHCSNo1 = Convert.ToString(e["SPHCSNo1"]),
                    SPHCSNo2 = Convert.ToString(e["SPHCSNo2"]),
                    SPHC1 = Convert.ToString(e["SPHC1"]),
                    SPHC2=Convert.ToString(e["SPHC2"]),
                    Active = Convert.ToString(e["Active"].ToString().ToUpper())

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ChargesList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
                }
                catch(Exception ex)//(Exception ex)
                {
                    throw ex;
                }
            }
            public List<string> SaveSPHC(List<ULDInCompatibility> ULDInCompatibilityInfo)
            {
                try
                { 
                // validate Business Rule
                DataTable dtCreateSPHCRestriction = CollectionHelper.ConvertTo(ULDInCompatibilityInfo, "SNo,SPHCSNo1,SPHCSNo2,Active,Text_SPHC1,Text_SPHC2,Text_Airline,Airline");
             //   DataTable dtCreateChargesTrans = CollectionHelper.ConvertTo(ULDInCompatibilityTrans, "Active,Text_PrimaryBasisOfCharge,Text_SecondaryBasisOfCharge");

                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("ULDInCompatibility", dtCreateSPHCRestriction, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ULDInCompatibilityTable",dtCreateSPHCRestriction),
                                            // new SqlParameter("@ULDInCompatibilityTableTrans",dtCreateChargesTrans),
                                            new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDInCompatibility", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDInCompatibility");
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
            public List<string> UpdateSPHC(List<ULDInCompatibility> ULDInCompatibilityInfo)
            {
                //validate Business Rule
                try
                { 
                DataTable dtUpdateSPHCRestriction = CollectionHelper.ConvertTo(ULDInCompatibilityInfo, "SPHCSNo1,SPHCSNo2,SNo,Active,Text_SPHC1,Text_SPHC2,Text_Airline,Airline");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("ULDInCompatibility", dtUpdateSPHCRestriction, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ULDInCompatibilityTable",dtUpdateSPHCRestriction),
                                            // new SqlParameter("@ULDInCompatibilityTableTrans",dtCreateChargesTrans),
                                            new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDInCompatibility", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDInCompatibility");
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
            public List<string> DeleteULDIncompatibility(List<string> listID)
            {
                try
                { 
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDInCompatibility", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDInCompatibility");
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
                }
                return ErrorMessage;
               }
                catch(Exception ex)//(Exception ex)
                {
                    throw ex;
                }
            }
        }
    }

