using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Schedule;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Web;
using System.Net;
using System.IO;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Schedule
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SASSSIMUploadService : SignatureAuthenticate, ISASSSIMUploadService
    {
        List<string> ErrorMessage = new List<string>();
        DataSet ds = new DataSet();
        public List<string> SaveSSIMUpload(List<SSIMUpload> ssimUpload)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                DataTable dtCreateSSIMDocument = CollectionHelper.ConvertTo(ssimUpload, "ValidationMessage");
                SqlParameter[] param = { new SqlParameter("@SSIMCDocumentTable", dtCreateSSIMDocument) };

                string result = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SASCreateSSIMDocument", param).Tables[0].Rows[0][0].ToString();

                if (Convert.ToInt32(result) > 0)
                {
                    if (Convert.ToInt32(result) == 2000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(Convert.ToInt32(result), "SSIMUpload");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(Convert.ToInt32(result), baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }

            return ErrorMessage;
        }

        public string SaveSSIMData(string[] DiffBatchSNo)
        {

            DataTable DiffBatchSNoTBL = new DataTable();
            DiffBatchSNoTBL.Columns.Add("DiffBatchSNo");
            foreach (string s in DiffBatchSNo)
            {
                DataRow row = DiffBatchSNoTBL.NewRow();
                row["DiffBatchSNo"] = s;
                DiffBatchSNoTBL.Rows.Add(row);
            }

            DataSet DS = new DataSet();
            try
            {

                //BaseBusiness baseBusiness = new BaseBusiness();
                //DataTable DiffBatchSNoTBL = CollectionHelper.ConvertTo(DiffBatchSNo, "");
                SqlParameter[] param = { new SqlParameter("@DiffBatchSNoList", DiffBatchSNoTBL),
                                         new SqlParameter("@CreatedBy", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

                DS = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSSIM_CreateSchedule", param);
               // string result = DS.Tables[0].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(DS);
        }

        public string ValidateSSIM(string[] DiffBatchSNo, string IsLastRequest)
        {

            DataTable DiffBatchSNoTBL = new DataTable();
            DiffBatchSNoTBL.Columns.Add("DiffBatchSNo");
            foreach (string s in DiffBatchSNo)
            {
                DataRow row = DiffBatchSNoTBL.NewRow();
                row["DiffBatchSNo"] = s;
                DiffBatchSNoTBL.Rows.Add(row);
            }

            DataSet DS = new DataSet();
            try
            {

                //BaseBusiness baseBusiness = new BaseBusiness();
                //DataTable DiffBatchSNoTBL = CollectionHelper.ConvertTo(DiffBatchSNo, "");
                SqlParameter[] param = { new SqlParameter("@DiffBatchSNoList", DiffBatchSNoTBL),
                                         new SqlParameter("@IsLastRequest",IsLastRequest) ,
                                         new SqlParameter("@CreatedBy", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

                DS = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSSIM_ValidateBatchs", param);
                // string result = DS.Tables[0].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(DS);
        }
    }

}
