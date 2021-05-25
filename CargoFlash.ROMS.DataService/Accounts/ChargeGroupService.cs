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
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Master;
using System.Net;

namespace CargoFlash.Cargo.DataService.Accounts
{
    #region  Charge Group Service Description
    /*
	*****************************************************************************
	Service Name:	ChargeGroupService      
	Purpose:		This Service used to get details of Charge Group save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:	    14 Dec 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ChargeGroupService : SignatureAuthenticate, IChargeGroupService
    {
        public ChargeGroup GetChargeGroupRecord(int recordID, string UserID)
        {
            try
            {
                ChargeGroup ChargeGroup = new ChargeGroup();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordChargeGroup", Parameters);
                if (dr.Read())
                {
                    ChargeGroup.SNo = Convert.ToInt32(dr["SNo"]);
                    ChargeGroup.GroupCode = dr["GroupCode"].ToString().ToUpper();
                    ChargeGroup.GroupName = dr["GroupName"].ToString().ToUpper();
                    ChargeGroup.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    ChargeGroup.Active = dr["ACTIVE"].ToString();
                    ChargeGroup.LedgerSno = dr["LedgerSno"].ToString();
                    ChargeGroup.Text_LedgerSno = dr["Ledger"].ToString();
                    ChargeGroup.UpdatedBy = dr["UpdatedUser"].ToString();
                    ChargeGroup.CreatedBy = dr["CreatedUser"].ToString();

                }
                dr.Close();
                return ChargeGroup;
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
                string filters = GridFilter.ProcessFilters<ChargeGroup>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListChargeGroup", Parameters);
                var ChargeList = ds.Tables[0].AsEnumerable().Select(e => new ChargeGroup
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    GroupCode = e["GroupCode"].ToString().ToUpper(),
                    GroupName = e["GroupName"].ToString().ToUpper(),
                    Ledger = e["Ledger"].ToString().ToUpper(),
                    Active = Convert.ToString(e["Active"]),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ChargeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


   
        public List<string> SaveChargeGroup(List<ChargeGroup> ChargeGroup)
        {
            try
            {

                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrr = CollectionHelper.ConvertTo(ChargeGroup, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ChargeGroup", dtCreateIrr, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }


                SqlParameter[] Parameters = {   new SqlParameter("@GroupCode", ChargeGroup[0].GroupCode),
                                            new SqlParameter("@GroupName",ChargeGroup[0].GroupName)  ,
                                            new SqlParameter("@IsActive",Convert.ToByte(ChargeGroup[0].IsActive))  ,
                                            new SqlParameter("@LedgerSno",(ChargeGroup[0].LedgerSno)),
                                            new  SqlParameter("@CreatedBy",ChargeGroup[0].CreatedBy)
                                            };



                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateChargeGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ChargeGroup");
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
        public List<string> UpdateChargeGroup(List<ChargeGroup> ChargeGroup)
        {
            try
            {

                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrr = CollectionHelper.ConvertTo(ChargeGroup, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ChargeGroup", dtCreateIrr, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }



                SqlParameter[] Parameters = { new SqlParameter("@Sno", Convert.ToInt32(ChargeGroup[0].SNo)),
                                            new SqlParameter("@GroupCode", ChargeGroup[0].GroupCode),
                                            new SqlParameter("@GroupName",ChargeGroup[0].GroupName)  ,
                                            new SqlParameter("@LedgerSno",ChargeGroup[0].LedgerSno)  ,
                                            new SqlParameter("@IsActive",Convert.ToByte(ChargeGroup[0].IsActive))  ,
                                            new  SqlParameter("@UpdatedBy",ChargeGroup[0].CreatedBy)
                                            };



                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateChargeGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ChargeGroup");
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
        public List<string> DeleteChargeGroup(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteChargeGroup", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ChargeGroup");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
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
      
    }
}
