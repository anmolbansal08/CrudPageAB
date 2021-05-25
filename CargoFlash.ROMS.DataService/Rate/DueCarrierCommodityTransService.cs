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
    #region DueCarrierCommodityTrans Service Description
    /*
	*****************************************************************************
	Service Name:	DueCarrierCommodityTransService      
	Purpose:		This Service used to get details of DueCarrierCommodityTrans save update and delete
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
    public class DueCarrierCommodityTransService : SignatureAuthenticate, IDueCarrierCommodityTransService
    {
        public KeyValuePair<string, List<DueCarrierCommodityTrans>> GetDueCarrierCommodityTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                DueCarrierCommodityTrans DueCarrierCommodityTrans = new DueCarrierCommodityTrans();
                SqlParameter[] Parameters = { new SqlParameter("@DueCarrierSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDueCarrierCommodityTrans", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var DueCarrierCommodityTransList = ds.Tables[0].AsEnumerable().Select(e => new DueCarrierCommodityTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    DueCarrierSNo = Convert.ToInt32(e["DueCarrierSNo"]),
                    CommoditySNo = e["CommodityCode"].ToString(),
                    HdnCommoditySNo = e["CommoditySNo"].ToString(),
                    Active = e["ACTIVE"].ToString(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<DueCarrierCommodityTrans>>(ds.Tables[1].Rows[0][0].ToString(), DueCarrierCommodityTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> createUpdateDueCarrierCommodityTrans(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtDueCarrierCommodityTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtDueCarrierCommodityTrans.Columns.Remove("CommoditySNo");
                var dtCreateDueCarrierCommodityTrans = (new DataView(dtDueCarrierCommodityTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateDueCarrierCommodityTrans = (new DataView(dtDueCarrierCommodityTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DueCarrierCommodityTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateDueCarrierCommodityTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateDueCarrierCommodityTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDueCarrierCommodityTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateDueCarrierCommodityTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateDueCarrierCommodityTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDueCarrierCommodityTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DueCarrierCommodityTrans");
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
        public List<string> deleteDueCarrierCommodityTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDueCarrierCommodityTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DueCarrierCommodityTrans");
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
