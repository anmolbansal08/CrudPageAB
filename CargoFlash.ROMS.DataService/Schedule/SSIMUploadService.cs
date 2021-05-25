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
using System.ServiceModel.Web;
namespace CargoFlash.Cargo.DataService.Schedule
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SSIMUploadService : SignatureAuthenticate, ISSIMUploadService
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

                string result = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateSSIMDocument", param).Tables[0].Rows[0][0].ToString();

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

    }
}
