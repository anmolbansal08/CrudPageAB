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
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region DueCarrierSpecialHandlingTrans Service Description
    /*
	*****************************************************************************
	Service Name:	DueCarrierSpecialHandlingTransService      
	Purpose:		This Service used to get details of DueCarrierSpecialHandlingTrans save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		27 Mar 2014
    Updated By:     Brajesh Kumar
	Updated On:	    29 Feb 2016
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DueCarrierSpecialHandlingTransService : SignatureAuthenticate, IDueCarrierSpecialHandlingTransService
    {
        public KeyValuePair<string, List<DueCarrierSpecialHandlingTrans>> GetDueCarrierSpecialHandlingTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                DueCarrierSpecialHandlingTrans DueCarrierSpecialHandlingTrans = new DueCarrierSpecialHandlingTrans();
                SqlParameter[] Parameters = { new SqlParameter("@DueCarrierSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDueCarrierSpecialHandlingTrans", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var DueCarrierSpecialHandlingTransList = ds.Tables[0].AsEnumerable().Select(e => new DueCarrierSpecialHandlingTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    DueCarrierSNo = Convert.ToInt32(e["DueCarrierSNo"]),
                    SpecialHandlingCodeSNo = e["Code"].ToString(),
                    HdnSpecialHandlingCodeSNo = e["SpecialHandlingCodeSNo"].ToString(),
                    Active = e["ACTIVE"].ToString(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<DueCarrierSpecialHandlingTrans>>(ds.Tables[1].Rows[0][0].ToString(), DueCarrierSpecialHandlingTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> createUpdateDueCarrierSpecialHandlingTrans(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtDueCarrierSpecialHandlingTrans = JsonConvert.DeserializeObject<DataTable>(strData);
                dtDueCarrierSpecialHandlingTrans.Columns.Remove("SpecialHandlingCodeSNo");
                var dtCreateDueCarrierSpecialHandlingTrans = (new DataView(dtDueCarrierSpecialHandlingTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateDueCarrierSpecialHandlingTrans = (new DataView(dtDueCarrierSpecialHandlingTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DueCarrierSpecialHandlingTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateDueCarrierSpecialHandlingTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateDueCarrierSpecialHandlingTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDueCarrierSpecialHandlingTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateDueCarrierSpecialHandlingTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateDueCarrierSpecialHandlingTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDueCarrierSpecialHandlingTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DueCarrierSpecialHandlingTrans");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteDueCarrierSpecialHandlingTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDueCarrierSpecialHandlingTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DueCarrierSpecialHandlingTrans");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
