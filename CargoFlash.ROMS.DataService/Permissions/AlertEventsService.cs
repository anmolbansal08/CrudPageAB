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
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlash.Cargo.DataService.Permissions
{
  [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
  [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
  [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
  public class AlertEventsService : SignatureAuthenticate, IAlertEventsService
  {
    CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();


    public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
    {
      string sorts = GridSort.ProcessSorting(sort);
      string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Permissions.AlertEvents>(filter);
      SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
      DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetAlertEvents", Parameters);
      var AlertEventsList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Permissions.AlertEvents
      {
        SNo = Convert.ToInt32(e["SNo"].ToString()),
        RefNo = Convert.ToString(e["RefNo"]),
        Text_OfficeSNo = e["Text_OfficeSNo"].ToString().ToUpper(),
        Text_AlertEventSNo = e["Text_AlertEventSNo"].ToString().ToUpper(),
      });
      ds.Dispose();
      return new DataSourceResult
      {
        Data = AlertEventsList.AsQueryable().ToList(),
        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
      };

    }

    public AlertEvents GetAlertEventsRecord(string recordID, string UserSNo)
    {
      AlertEvents alertEvents = new AlertEvents();
      SqlDataReader dr = null;
      try
      {
        SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
        dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAlertEventsRecord", Parameters);
        if (dr.Read())
        {
          alertEvents.SNo = Convert.ToInt32(dr["SNo"]);
          alertEvents.RefNo = Convert.ToString(dr["RefNo"]);
          alertEvents.CitySNo = Convert.ToInt32(dr["CitySNo"] == "" ? 0 : dr["CitySNo"]);
          alertEvents.Text_CitySNo = dr["CityCode"].ToString().ToUpper();
          alertEvents.OfficeSNo = Convert.ToInt32(dr["OfficeSNo"] == "" ? 0 : dr["OfficeSNo"]);
          alertEvents.Text_OfficeSNo = dr["OfficeName"].ToString().ToUpper();
          alertEvents.AirlineSNo = dr["AirlineSNo"].ToString().ToUpper();
          alertEvents.Text_AirlineSNo = dr["AirlineName"].ToString().ToUpper();
          alertEvents.TransactionType = dr["TransactionType"].ToString().ToUpper();
          alertEvents.Text_TransactionType = dr["TypeTrans"].ToString().ToUpper();
          alertEvents.SPHCType = dr["SPHCType"].ToString().ToUpper();
          alertEvents.Text_SPHCType = dr["Text_SPHCType"].ToString().ToUpper();
          alertEvents.SPHCCode = dr["SPHCSNo"].ToString().ToUpper();
          alertEvents.Text_SPHCCode = dr["SPHCCode"].ToString().ToUpper();
          alertEvents.SPHCSubGroupSNo = dr["SPHCSubGroupSNo"].ToString() == "0" ? "" : dr["SPHCSubGroupSNo"].ToString();
          alertEvents.Text_SPHCSubGroupSNo = dr["Text_SPHCSubGroupSNo"].ToString().ToUpper();
          alertEvents.AlertEventSNo = Convert.ToInt32(dr["AlertEventSNo"]);
          alertEvents.Text_AlertEventSNo = dr["AlertEvent"].ToString().ToUpper();
          alertEvents.TriggerEventTypeSNo = Convert.ToInt32(dr["TriggerEventTypeSNo"]);  //Added by Shivam
          alertEvents.Text_TriggerEventTypeSNo = dr["Text_TriggerEventTypeSNo"].ToString().ToUpper(); //Added by Shivam
          alertEvents.TriggerNameSNo = Convert.ToInt32(dr["TriggerNameSNo"]);
          alertEvents.Text_TriggerNameSNo = dr["Text_TriggerNameSNo"].ToString().ToUpper();
          alertEvents.Email = dr["Email"].ToString();
          alertEvents.Message = dr["Message"].ToString();
          alertEvents.UpdatedBy = dr["UpdatedBy"].ToString().ToUpper();
          alertEvents.CommoditySNo = dr["CommoditySNo"].ToString().ToUpper();
          alertEvents.Text_CommoditySNo = dr["CommodityName"].ToString().ToUpper();
          alertEvents.Active = dr["Active"].ToString().ToUpper();
          alertEvents.IsActive = Convert.ToBoolean(dr["IsActive"]);
                }
      }
      catch (Exception ex)// (Exception ex)
      {
        dr.Close();
      }
      return alertEvents;
    }

    public List<string> SaveAlertEvents(AlertEventsPost alertEvents)
    {
      //validate Business Rule
      DataTable dtAlertEventTrans = CollectionHelper.ConvertTo(alertEvents.TransData, "RefNo");
      List<string> ErrorMessage = new List<string>();
      BaseBusiness baseBusiness = new BaseBusiness();

      //if (!baseBusiness.ValidateBaseBusiness("AlertEvents", dtcreateoffice, "SAVE"))
      //   {
      //       ErrorMessage = baseBusiness.ErrorMessage;
      //       return ErrorMessage;
      //   }

      SqlParameter[] Parameters = { new SqlParameter("@CitySNo",alertEvents.CitySNo),
                                    new SqlParameter("@OfficeSNo",alertEvents.OfficeSNo),
                                    new SqlParameter("@AirlineSNo",alertEvents.AirlineSNo),
                                    new SqlParameter("@TransactionType",alertEvents.TransactionType),
                                    new SqlParameter("@SPHCType",alertEvents.SPHCType),
                                    new SqlParameter("@SPHCSNo",alertEvents.SPHCSNo),
                                    new SqlParameter("@SPHCSubGroupSNo",alertEvents.SPHCSubGroupSNo),
                                    new SqlParameter("@AlertEventSNo",alertEvents.AlertEventSNo),
                                    new SqlParameter("@TriggerEventTypeSNo",alertEvents.TriggerEventTypeSNo),  //Added by Shivam
                                    new SqlParameter("@TriggerNameSNo",alertEvents.TriggerNameSNo),
                                    new SqlParameter("@Message",alertEvents.Message),
                                    new SqlParameter("@Email",CargoFlash.Cargo.Business.Common.Base64ToString(alertEvents.Email)),
                                    new SqlParameter("@UpdatedBy",alertEvents.UpdatedBy),
                                    new SqlParameter("@CommoditySNo",alertEvents.CommoditySNo),
                                    new SqlParameter("@IsActive",alertEvents.IsActive),
                                    new SqlParameter("@AlertEventTrans",SqlDbType.Structured){Value=dtAlertEventTrans}
                                    };

      int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAlertEvents", Parameters);
      if (ret > 0)
      {
        if (ret > 1000)
        {
          //For Customised Validation Messages like 'Record Already Exists' etc
          string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AlertEvents");
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

    public List<string> UpdateAlertEvents(AlertEventsPost alertEvents)
    {
      //validate Business Rule
      DataTable dtAlertEventTrans = CollectionHelper.ConvertTo(alertEvents.TransData, "RefNo");
      List<string> ErrorMessage = new List<string>();
      BaseBusiness baseBusiness = new BaseBusiness();

      SqlParameter[] Parameters = { new SqlParameter("@AlertSNo",alertEvents.AlertSNo),
                                    new SqlParameter("@CitySNo",alertEvents.CitySNo),
                                    new SqlParameter("@OfficeSNo",alertEvents.OfficeSNo),
                                    new SqlParameter("@AirlineSNo",alertEvents.AirlineSNo),
                                    new SqlParameter("@TransactionType",alertEvents.TransactionType),
                                    new SqlParameter("@SPHCType",alertEvents.SPHCType),
                                    new SqlParameter("@SPHCSNo",alertEvents.SPHCSNo),
                                    new SqlParameter("@SPHCSubGroupSNo",alertEvents.SPHCSubGroupSNo),
                                    new SqlParameter("@AlertEventSNo",alertEvents.AlertEventSNo),
                                    new SqlParameter("@TriggerEventTypeSNo",alertEvents.TriggerEventTypeSNo),  //Added by Shivam
                                    new SqlParameter("@TriggerNameSNo",alertEvents.TriggerNameSNo),
                                    new SqlParameter("@Messsage",alertEvents.Message),
                                    new SqlParameter("@Email",CargoFlash.Cargo.Business.Common.Base64ToString(alertEvents.Email)),
                                    new SqlParameter("@UpdatedBy",alertEvents.UpdatedBy),
                                    new SqlParameter("@CommoditySNo",alertEvents.CommoditySNo),
                                      new SqlParameter("@IsActive",alertEvents.IsActive),
                                    new SqlParameter("@AlertEventTrans",SqlDbType.Structured){Value=dtAlertEventTrans}
                                    };



      int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAlertEvents", Parameters);
      if (ret > 0)
      {
        if (ret > 1000)
        {
          //For Customised Validation Messages like 'Record Already Exists' etc
          string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Tax");
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

    public List<string> DeleteAlertEvents(List<string> listID)
    {
      List<string> ErrorMessage = new List<string>();
      BaseBusiness baseBussiness = new BaseBusiness();
      if (listID.Count > 0)
      {
        string RecordId = listID[0].ToString();
        string UserId = listID[1].ToString();
        SqlParameter[] Parameters = { new SqlParameter("@AlertSNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
        int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAlertEvents", Parameters);

        if (ret > 0)
        {
          if (ret > 1000)
          {
            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AlertEvents");
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

    //Binding AppendGrid
    public KeyValuePair<string, List<AlertEventsTrans>> GetAlertEventsSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
    {

      whereCondition = "AlertEventSNo=" + recordID;
      AlertEventsTrans alertEvents = new AlertEventsTrans();
      SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
      DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAlertEventsSlabRecord", Parameters);
      var AlertEventsSlabList = ds.Tables[0].AsEnumerable().Select(e => new AlertEventsTrans
      {
        SNo = e["SNo"].ToString(),
        RecipientType = Convert.ToInt32(e["RecipientType"]),
        HdnName = Convert.ToInt32(e["RecipientTypeSNo"]),
        Name = e["Name"].ToString(),
        EmailId = e["EmailAddress"].ToString(),
        MobileNo = e["MobileNo"].ToString(),
      });
      return new KeyValuePair<string, List<AlertEventsTrans>>("SNo", AlertEventsSlabList.AsQueryable().ToList());


    }

    public List<string> DeleteAlertEventsSlabRecord(string RecordID)
    {
      List<string> ErrorMessage = new List<string>();
      BaseBusiness baseBussiness = new BaseBusiness();
      try
      {

        SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)) };
        int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAlertEventsSlabRecord", Parameters);
        if (ret > 0)
        {
          if (ret > 1000)
          {
            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AlertEvents");
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
        else
        {
          //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
          string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
          if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
            ErrorMessage.Add(dataBaseExceptionMessage);
        }
      }
      catch (Exception ex)// (Exception e)
      {

      }
      return ErrorMessage;
    }
  }
}


