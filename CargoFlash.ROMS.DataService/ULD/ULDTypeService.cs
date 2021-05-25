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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;


namespace CargoFlash.Cargo.DataService.ULD
{
    #region ULDType Service Description
    /*
    *****************************************************************************
    Service Name:	ULDTypeService      
    Purpose:		This Service used to get details of ULDType save update and delete
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Swati Rastogi.
    Created On:		19 Nov 2015
    Updated By:    
    Updated On:	
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDTypeService : SignatureAuthenticate, IULDTypeService
    {
        public ULDType GetULDTypeRecord(int recordID, string UserID)
        {
            try
            {

                ULDType utype = new ULDType();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDType", Parameters);
                if (dr.Read())
                {
                    utype.SNo = Convert.ToInt32(dr["SNo"]);
                    utype.ULDCode = dr["ULDName"].ToString().ToUpper();
                    utype.RateClassSno = Convert.ToInt32(dr["RateClassSno"]);
                    utype.Text_RateClassSno = dr["RateClass"].ToString().ToUpper();
                    utype.Text_ULDTypeSno = dr["ULDType"].ToString().ToUpper();
                    utype.ULDTypeSno = Convert.ToInt32(dr["ULDTypeSno"]);
                    utype.GrossWeight = Convert.ToDecimal(dr["GrossWeight"]);
                    utype.VolumeWeight = Convert.ToDecimal(dr["VolumeWeight"]);
                    utype.Length = Convert.ToDecimal(dr["Length"]);
                    utype.Width = Convert.ToDecimal(dr["Width"]);
                    utype.Height = dr["Height"].ToString();
                    utype.Unit = Convert.ToBoolean(dr["Unit"]) == false ? 1 : 0;
                    utype.EmptyWeight = Convert.ToDecimal(dr["EmptyWeight"]);
                    utype.PivotWeight = Convert.ToDecimal(dr["PivotWeight"]);
                    utype.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    utype.Active = dr["ACTIVE"].ToString();

                    utype.IsULdtype = Convert.ToInt32(dr["IsULDType"]);
                    //utype.IsULdtype = Convert.ToBoolean(dr["IsULDType"]) == false ? 1 : 0;
                    //utype.ULdtype = dr["ULDTYPE1"].ToString();
                    utype.CreatedBy = dr["CreatedUser"].ToString();
                    utype.UpdatedBy = dr["UpdatedUser"].ToString();
                    utype.CommonDesignation = dr["CommonDesignation"].ToString();
                    utype.ULDdescription = dr["ULDdescription"].ToString();
                    utype.AirlineSno = Convert.ToInt32(dr["AirlineSno"]);
                    utype.Text_AirlineSno = dr["Airline"].ToString().ToUpper();
                    utype.Text_Units = dr["Unit"].ToString() == "False" ? "INCH" : "CM";
                    utype.Text_IsActive = dr["IsActive"].ToString() == "False" ? "No" : "Yes";
                }
                dr.Close();
                return utype;
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<ULDType>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDType", Parameters);
            var IrrList = ds.Tables[0].AsEnumerable().Select(e => new ULDType
            {
                SNo = Convert.ToInt32(e["SNo"]),
                ULDCode = e["ULDCode"].ToString().ToUpper(),
                Airline = e["Airline"].ToString().ToUpper(),
                GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                Length = Convert.ToDecimal(e["Length"]),
                Width = Convert.ToDecimal(e["Width"]),
                EmptyWeight = Convert.ToDecimal(e["EmptyWeight"]),
                PivotWeight = Convert.ToDecimal(e["PivotWeight"]),
                CommonDesignation = e["CommonDesignation"].ToString().ToUpper(),
                ULDTypes = e["ULDTypes"].ToString().ToUpper(),
                Units = Convert.ToString(e["Units"]),
                Active = Convert.ToString(e["Active"]),
                ULdPalletType = Convert.ToString(e["ULdPalletType"]),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = IrrList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveULDType(List<ULDType> ULDType)
        {
            try 
            { 
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(ULDType, "IsULdtype,Active,Airline,Text_AirlineSno,Units,Text_Units,Text_IsActive,ULDTypes,Text_ULDTypeSno,RateClass,Text_RateClassSno,ULdPalletType");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ULDType", dtCreateIrr, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@ULDTypeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrr;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDType");
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

            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> UpdateULDType(List<ULDType> ULDType)
        {
            try 
            { 
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(ULDType, "IsULdtype,Active,Airline,Text_AirlineSno,Units,Text_Units,Text_IsActive,ULDTypes,Text_ULDTypeSno,RateClass,Text_RateClassSno,ULdPalletType");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ULDType", dtCreateIrr, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@ULDTypeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrr;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDType");
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

            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> DeleteULDType(List<string> listID)
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

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDType");
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

            catch(Exception ex)//
            {
                throw ex;
            }
        }

    }
}
