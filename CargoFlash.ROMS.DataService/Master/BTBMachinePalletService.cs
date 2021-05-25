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
    #region AccountService Class Description

    /*
	*****************************************************************************
	Class Name:		AccountService      
	Purpose:		This class used to Extend Interface IAccountService. This Class Communicate with SQL Server for CRUD Operation.
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:		24 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class BTBMachinePalletService : SignatureAuthenticate, IBTBMachinePalletService
    {
        /// <summary>
        /// Retrieve Account infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        /// 

      

        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<BTBMachinePallet>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_SearchBTBMachinePallet", Parameters);
                var BTBMachinePalletList = ds.Tables[0].AsEnumerable().Select(e => new BTBMachinePallet
                {  SNo = Convert.ToInt32(e["Sno"]),
                   MachineName = e["MachineName"].ToString().ToUpper(),
                   Weight = Convert.ToInt32(e["palletweight"]),
                   Active=Convert.ToBoolean(e["ISActive"]) == true? "Yes" : "No"
                   
                    //----------- end here-------------------
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = BTBMachinePalletList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Save the Account Information into Account and CreditLimit Entity 
        /// </summary>
        /// <param name="Account">object of the Entity</param>
        public List<string> SaveBTBMachinePallet(List<BTBMachinePallet> BTBMachinePallet)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
              
                BaseBusiness baseBusiness = new BaseBusiness();
                System.Data.SqlClient.SqlParameter[] Parameters = {

                new System.Data.SqlClient.SqlParameter("@MachineName",BTBMachinePallet[0].MachineName),
                new System.Data.SqlClient.SqlParameter("@palletweight",BTBMachinePallet[0].Weight),
                new System.Data.SqlClient.SqlParameter("@IsActive",BTBMachinePallet[0].IsActive),
                new System.Data.SqlClient.SqlParameter("@UserSno",BTBMachinePallet[0].UserSno),



            };
              
                int ret = 0;
                ret= (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "sp_CreateandUpdateBTBMachine", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "BTBMachinePallet");
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
            catch (Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public BTBMachinePallet GetBTBMachinePalletRecord(string recordID, string UserSNo)
        {
            BTBMachinePallet BTBMachinePallet = new BTBMachinePallet();
            SqlDataReader dr = null;
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBTBMachinePalletOffice", Parameters);
                if (dr.Read())
                {
                    //BTBMachinePallet.SNo = Convert.ToInt32(dr["SNo"].ToString());
                    BTBMachinePallet.MachineName = Convert.ToString(dr["MachineName"]).ToUpper();
                    BTBMachinePallet.Weight = Convert.ToInt32(dr["palletweight"]);
                    BTBMachinePallet.IsActive = Convert.ToBoolean(dr["Isactive"]);
                   

                }
                dr.Close();
            }
            catch (Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return BTBMachinePallet;
        }
        //public List<string> UpdateBTBMachinePallet(List<BTBMachinePalletService> BTBMachinePallet)
        //{
        //    List<string> ErrorMessage = new List<string>();
        //    try
        //    {
        //        DataTable dtupdateoffice = CollectionHelper.ConvertTo(office, "Text_AirlineSNo,Text_CitySNo,Text_CurrencySNo,BankGuarantee,Self,Active,AllowedCl,UserCreatedBy,UserUpdatedBy,Text_ParentID,HeadOffice,Text_OfficeType,Text_AirportSNo,hidenOfficeType,ConsolidatedStock,CreditLimitOnAgent,CreditLimitOfOffice,Text_InvoicingCycle,Airline");
        //        BaseBusiness baseBusiness = new BaseBusiness();
        //        if (!baseBusiness.ValidateBaseBusiness("Office", dtupdateoffice, "Update"))
        //        {
        //            ErrorMessage = baseBusiness.ErrorMessage;
        //            return ErrorMessage;
        //        }
        //        SqlParameter param = new SqlParameter();
        //        param.ParameterName = "@OfficeTable";
        //        param.SqlDbType = System.Data.SqlDbType.Structured;
        //        param.Value = dtupdateoffice;
        //        SqlParameter[] Parameters = { param };
        //        int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOffice", Parameters);
        //        if (ret > 0)
        //        {
        //            if (ret > 1000)
        //            {
        //                //For Customised Validation Messages like 'Record Already Exists' etc
        //                string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Office");
        //                if (!string.IsNullOrEmpty(serverErrorMessage))
        //                    ErrorMessage.Add(serverErrorMessage);
        //            }

        //            else if (ret == 545)
        //            {
        //                ErrorMessage.Add("Office Name " + dtupdateoffice.Rows[0]["Name"] + " already exist for " + dtupdateoffice.Rows[0]["CityName"]);
        //            }
        //            else if (ret == 546)
        //            {
        //                ErrorMessage.Add("GSA Office" + " already exist for " + dtupdateoffice.Rows[0]["CityName"]);
        //            }

        //            else
        //            {
        //                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                    ErrorMessage.Add(dataBaseExceptionMessage);
        //            }
        //        }
        //    }
        //    catch (Exception ex)// //(Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return ErrorMessage;
        //}

        public List<string> UpdateBTBMachinePallet(List<BTBMachinePallet> BTBMachinePallet)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {

                BaseBusiness baseBusiness = new BaseBusiness();
                System.Data.SqlClient.SqlParameter[] Parameters = {

                new System.Data.SqlClient.SqlParameter("@MachineName",BTBMachinePallet[0].MachineName),
                new System.Data.SqlClient.SqlParameter("@palletweight",BTBMachinePallet[0].Weight),
                new System.Data.SqlClient.SqlParameter("@IsActive",BTBMachinePallet[0].IsActive),
                new System.Data.SqlClient.SqlParameter("@Sno",BTBMachinePallet[0].SNo),
                new System.Data.SqlClient.SqlParameter("@UserSno",BTBMachinePallet[0].UpdatedBy),



            };

                int ret = 0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateBTBMachinePallet", Parameters);
                if (ret > 0)
                {
                    //if (ret > 1000)
                    //{
                    //    //For Customised Validation Messages like 'Record Already Exists' etc
                    //    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "BTBMachinePallet");
                    //    if (!string.IsNullOrEmpty(serverErrorMessage))
                    //        ErrorMessage.Add(serverErrorMessage);
                    //}

                    //else if (ret == 545)
                    //{
                    //    ErrorMessage.Add("BTB Name " + dtupdateoffice.Rows[0]["Name"] + " already exist for " + dtupdateoffice.Rows[0]["CityName"]);
                    //}
                    //else if (ret == 546)
                    //{
                    //    ErrorMessage.Add("BTB Machine" + " already exist for " + dtupdateoffice.Rows[0]["CityName"]);
                    //}
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                
            }
            catch (Exception ex)// //(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteBTBMachinePallet(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@Sno", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteBTBMachinePallet", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
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
                return ErrorMessage;
            }
            catch (Exception ex)//
            {

                throw ex;
            }
        }


    }
    }



