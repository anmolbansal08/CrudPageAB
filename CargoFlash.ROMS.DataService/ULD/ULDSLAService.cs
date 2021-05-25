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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDSLAService : SignatureAuthenticate, IULDSLAService
    {
        /// <summary>
        /// Retrieve ULDSLA information from the database
        /// </summary>
        /// <param name="recordID">record ID according to which the touple is to be retrieved</param>
        /// <returns></returns>
        public ULDSLA GetULDSLARecord(int recordID, string UserID)
        {
            try
            {
                ULDSLA Usla = new ULDSLA();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDSLA", Parameters);
                if (dr.Read())
                {
                    Usla.SNo = Convert.ToInt32(dr["SNo"]);

                    Usla.Text_CustomerSNo = Convert.ToString(dr["Vendor"]);
                    Usla.CustomerSNo = Convert.ToString(dr["SNoAgreementNo"]);

                    Usla.Text_EventSNo = Convert.ToString(dr["EventName"]);
                    Usla.EventSNo = Convert.ToString(dr["EventSNo"]);

                    Usla.Text_BasisSNo = Convert.ToString(dr["BasisName"]);
                    Usla.BasisSNo = Convert.ToString(dr["BasisSNo"]);

                    Usla.Text_MaintenanceTypeSNo = Convert.ToString(dr["MaintenanceTypeName"]);
                    Usla.MaintenanceTypeSNo = Convert.ToString(dr["MaintenanceTypeSNO"]);

                    Usla.CutOffDay = Convert.ToString(dr["CutOffDay"]);

                    //Usla.ManHrsCost = Convert.ToDecimal(dr["ManHrsCost"].ToString() == "" ? "0" : dr["ManHrsCost"]);


                    Usla.UpdatedBy = dr["Updatedby"].ToString();
                    Usla.CreatedBy = dr["Createdby"].ToString();

                }

                dr.Close();
                return Usla;
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }

        /// <summary>
        /// Get the list of records to be shown n the database
        /// </summary>
        /// <param name="skip">no. of records to be Skipped</param>
        /// <param name="take">no. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">size of the page i.e. No of record to be displayed at once</param>
        /// <param name="sort">column no according to which records are to be Ordered</param>
        /// <param name="filter">values/parameter according to which record are to be Filtered</param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ULDSLA>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDSLA", Parameters);

                var ULDSLAList = ds.Tables[0].AsEnumerable().Select(e => new ULDSLA
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Vendor = Convert.ToString(e["Vendor"]),
                    EventName = Convert.ToString(e["EventName"]),
                    BasisName = Convert.ToString(e["BasisName"]),
                    MaintenanceTypeName = Convert.ToString(e["MaintenanceTypeName"]),
                    CutOffDay = Convert.ToString(e["CutOffDay"]),


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ULDSLAList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }

        /// <summary>
        /// Save the entity into the database
        /// </summary>
        /// <param name="ULDSLA"></param>
        public List<string> SaveULDSLA(List<ULDSLA> Uldsla)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateULDSLA = CollectionHelper.ConvertTo(Uldsla, "Text_CustomerSNo,Text_EventSNo,Text_BasisSNo,Text_MaintenanceTypeSNo,AgreementNumber,Vendor,EventName,BasisName,MaintenanceTypeName");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ULDSLA", dtCreateULDSLA, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDSLA";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDSLA;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDSLA", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDSLA");
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

        /// <summary>
        /// Update the Entity into the database
        /// </summary>
        /// <param name=""></param>

        public List<string> UpdateULDSLA(List<ULDSLA> Uldsla)
        {
            // 
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateULDSLA = CollectionHelper.ConvertTo(Uldsla, "Text_CustomerSNo,Text_EventSNo,Text_BasisSNo,Text_MaintenanceTypeSNo,AgreementNumber,Vendor,EventName,BasisName,MaintenanceTypeName");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ULDSLA", dtCreateULDSLA, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDSLATab";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDSLA;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDSLA", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDSLA");
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

        /// <summary>
        /// Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>

        public List<string> DeleteULDSLA(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDSLA", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDSLA");
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
            catch (Exception ex)//
            {
                throw ex;
            }
        }
    }
}
