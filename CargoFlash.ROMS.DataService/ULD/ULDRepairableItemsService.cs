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
    #region ULDRepairableItems Service Description
    /*
	*****************************************************************************
	Service Name:	ULDRepairableItemsService      
	Purpose:		This Service used to get details of ULDRepairableItems save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shivang Srivastava.
	Created On:		05 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDRepairableItemsService : SignatureAuthenticate, IULDRepairableItemsService
    {
        public ULDRepairableItems GetULDRepairableItemsRecord(string recordID, string UserSNo)
        {
            ULDRepairableItems ULDRepairableItems = new ULDRepairableItems();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDRepairableItems", Parameters);
                if (dr.Read())
                {
                    ULDRepairableItems.SNo = Convert.ToInt32(dr["SNo"]);
                    ULDRepairableItems.ItemName = dr["ItemName"].ToString();
                    ULDRepairableItems.ItemDescription = dr["ItemDescription"].ToString();
                    ULDRepairableItems.ULDType = Convert.ToString(dr["ULDType"]);
                    ULDRepairableItems.Text_ULDTypes = dr["Text_ULDTypes"].ToString();
                    ULDRepairableItems.CreatedBy = Convert.ToString(dr["CreatedUser"]);
                    ULDRepairableItems.UpdatedBy = Convert.ToString(dr["UpdatedUser"]);

                }
                dr.Close();
                return ULDRepairableItems;
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
                dr.Close();
            }

        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {


                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ULDRepairableItems>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDRepairableItems", Parameters);
                var ULDRepairableItemsList = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairableItems
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ItemName = e["ItemName"].ToString(),
                    ItemDescription = e["ItemDescription"].ToString(),
                    ULDType = e["ULDType"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ULDRepairableItemsList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveULDRepairableItems(List<ULDRepairableItems> ULDRepairableItems)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                //validate Business Rule

                DataTable dtCreateULDRepairableItems = CollectionHelper.ConvertTo(ULDRepairableItems, "Text_ULDTypes");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ULDRepairableItems", dtCreateULDRepairableItems, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDRepairableItemsTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDRepairableItems;


                SqlParameter[] Parameters = { param };


                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDRepairableItems", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDRepairableItems");
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

            catch (Exception ex)//
            {
                throw ex;
            }

        }
        public List<string> UpdateULDRepairableItems(List<ULDRepairableItems> ULDRepairableItems)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateULDRepairableItems = CollectionHelper.ConvertTo(ULDRepairableItems, "Text_ULDTypes");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ULDRepairableItems", dtCreateULDRepairableItems, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDRepairableItemsTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDRepairableItems;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDRepairableItems", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDRepairableItems");
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
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> DeleteULDRepairableItems(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDRepairableItems", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDRepairableItems");
                            if (!string.IsNullOrEmpty(serverErrorMessage))
                                ErrorMessage.Add(serverErrorMessage);
                        }
                        else
                        {  //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
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