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
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region DueCarrier Service Description
    /*
	*****************************************************************************
	Service Name:	DueCarrierService      
	Purpose:		This Service used to get details of DueCarrier save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		26 Mar 2014
    Updated By:     Brajesh Kumar
	Updated On:	   29 Feb 2016
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DueCarrierService : SignatureAuthenticate, IDueCarrierService
    {
        public DueCarrier GetDueCarrierRecord(string recordID, string UserID)
        {
            DueCarrier DueCarrier = new DueCarrier();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDueCarrier", Parameters);
                if (dr.Read())
                {
                    DueCarrier.SNo = Convert.ToInt32(dr["SNo"]);
                    DueCarrier.Code = dr["Code"].ToString();
                    DueCarrier.Name = dr["Name"].ToString();
                    DueCarrier.FreightType = dr["FreightType"].ToString();
                    DueCarrier.TempFreightType = dr["TempFreightType"].ToString();
                    if (!String.IsNullOrEmpty(dr["IsCarrier"].ToString()))
                    {
                        DueCarrier.IsCarrier = Convert.ToBoolean(dr["IsCarrier"]);
                        DueCarrier.Carrier = dr["Carrier"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsMandatory"].ToString()))
                    {
                        DueCarrier.IsMandatory = Convert.ToBoolean(dr["IsMandatory"]);
                        DueCarrier.Mandatory = dr["Mandatory"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        DueCarrier.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        DueCarrier.Active = dr["Active"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsEditable"].ToString()))
                    {
                        DueCarrier.IsEditable = Convert.ToBoolean(dr["IsEditable"]);
                        DueCarrier.Editable = dr["Editable"].ToString().ToUpper();
                    }


                    //Added by indra pratap sigh//
                    if (!String.IsNullOrEmpty(dr["IsShowOnCSR"].ToString()))
                    {
                        DueCarrier.IsShowOnCSR = Convert.ToBoolean(dr["IsShowOnCSR"]);
                        DueCarrier.ShowOnCSR = dr["ShowOnCSR"].ToString().ToUpper();
                    }

                    DueCarrier.UpdatedBy = dr["UpdatedUser"].ToString();
                    DueCarrier.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }
            return DueCarrier;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<DueCarrier>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDueCarrier", Parameters);
                var DueCarrierList = ds.Tables[0].AsEnumerable().Select(e => new DueCarrier
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Code = e["Code"].ToString().ToUpper(),
                    Name = e["Name"].ToString().ToUpper(),
                    TempFreightType = e["TempFreightType"].ToString().ToUpper(),
                    Carrier = e["Carrier"].ToString().ToUpper(),
                    Mandatory = e["Mandatory"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),
                    Editable = e["Editable"].ToString().ToUpper(),
                   ShowOnCSR= e["ShowOnCSR"].ToString().ToUpper(),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DueCarrierList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public List<string> SaveDueCarrier(List<DueCarrier> DueCarrier)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateDueCarrier = CollectionHelper.ConvertTo(DueCarrier, "Active,Carrier,Mandatory,TempFreightType,Editable,ShowOnCSR,IsShowOnCSR");//----added by indra 
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("DueCarrier", dtCreateDueCarrier, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
               /// DueCarrier[0].IsShowOnCSR
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DueCarrierTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateDueCarrier;
                SqlParameter[] Parameters = { param, new SqlParameter("@IsShowOnCSR", DueCarrier[0].IsShowOnCSR) };//-------added by indra pratap singh--------//
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDueCarrier", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DueCarrier");
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
        public List<string> UpdateDueCarrier(List<DueCarrier> DueCarrier)
        {
            try
            {
                //validate Business Rule
                DataTable dtUpdateDueCarrier = CollectionHelper.ConvertTo(DueCarrier, "Active,Carrier,Mandatory,TempFreightType,Editable,ShowOnCSR,IsShowOnCSR");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("DueCarrier", dtUpdateDueCarrier, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DueCarrierTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateDueCarrier;
                SqlParameter[] Parameters = { param, new SqlParameter("@IsShowOnCSR", DueCarrier[0].IsShowOnCSR) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDueCarrier", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DueCarrier");
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
        public List<string> DeleteDueCarrier(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDueCarrier", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DueCarrier");
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
