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
using CargoFlash.Cargo.Model.Roster;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Globalization;

namespace CargoFlash.Cargo.DataService.Roster
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RosterResourceAllocationService : SignatureAuthenticate, IRosterResourceAllocationService
    {
        public List<RosterEmployeeAllocation> GetEmployee(string employee, string designation, string dutyArea, string start, string end, string staffStatus)
        {
            DateTime startdate = DateTime.Parse(start, new CultureInfo("en-us"));
            DateTime enddate = DateTime.Parse(end, new CultureInfo("en-us"));
            List<RosterEmployeeAllocation> lstEmployee = new List<RosterEmployeeAllocation>();
            SqlParameter[] Parameters = { new SqlParameter("@Employee", employee),
                                             new SqlParameter("@DutyArea", dutyArea),
                                        new SqlParameter("@Designation", designation),
                                         new SqlParameter("@StaffStatus", staffStatus),
                                          new SqlParameter("@StartTime", startdate),
                                             new SqlParameter("@EndTime",enddate)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ResourceAllocationEmployee", Parameters);
            lstEmployee = ds.Tables[0].AsEnumerable().Select(e => new RosterEmployeeAllocation
            {
                value = e["SNo"].ToString(),
                text = e["Name"].ToString().ToUpper()
            }).ToList();

            return lstEmployee;
        }

        public string GetDutyAreaName()
        {
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDutyAreaName");
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public List<DutyArea> GetDutyArea()
        {
            List<DutyArea> lstDutyArea = new List<DutyArea>();
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ResourceAllocationDutyArea");
            lstDutyArea = ds.Tables[0].AsEnumerable().Select(e => new DutyArea
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                AreaName = e["AreaName"].ToString().ToUpper(),
            }).ToList();

            return lstDutyArea;
        }

        public List<RosterResourceAllocation> GetAllocatedDuty(string employee, string designation, string dutyArea, string start, string end, string staffStatus)
        {
            string[] arrEmp = new string[1];
            //arrEmp[0] = "3";
            DateTime startdate = DateTime.Parse(start, new CultureInfo("en-us"));
            DateTime enddate = DateTime.Parse(end, new CultureInfo("en-us"));
            List<RosterResourceAllocation> lst = new List<RosterResourceAllocation>();
            SqlParameter[] Parameters = { new SqlParameter("@Employee", employee), new SqlParameter("@Designation", designation),
                                            new SqlParameter("@DutyArea", dutyArea),
                                                new SqlParameter("@StartTime", startdate),
                                             new SqlParameter("@EndTime",enddate),
                                                new SqlParameter("@StaffStatus", staffStatus)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetResourceAllocation", Parameters);
            lst = ds.Tables[0].AsEnumerable().Select(e => new RosterResourceAllocation
            {
                MeetingID = Convert.ToInt32(e["SNo"].ToString()),
                Attendees = new string[] { arrEmp[0] = e["EmpSNo"].ToString() },
                Title = e["Title"].ToString(),
                Description = "",
                Start = Convert.ToDateTime(e["StartTime"].ToString()),
                End = Convert.ToDateTime(e["EndTime"].ToString()),
                EndTimezone = "",
                PunchInTime = (Convert.ToString(e["PunchInTime"]) == "") ? "" : e["PunchInTime"].ToString(),
                PunchOutTime = (Convert.ToString(e["PunchOutTime"]) == "") ? "" : e["PunchOutTime"].ToString(),
                IsAllDay = Convert.ToBoolean(e["IsAllDay"].ToString()),
                ReportingShiftTime = (e["ReportingShiftTime"] == DBNull.Value) ? false : Convert.ToBoolean(e["ReportingShiftTime"]),
                isdisabled = (Convert.ToString(e["PunchInTime"]) == "") ? true : false,
                Color = e["Color"].ToString(),
                DutyAreaSNo = Convert.ToInt32(e["DutyAreaSNo"].ToString()),
                DutyArea = new DutyArea { SNo = Convert.ToInt32(e["DutyAreaSNo"].ToString()), AreaName = e["Title"].ToString() }
            }).ToList();

            return lst;
        }

        public List<SchedulerMessage> SaveAllocation(RosterResourceAllocation models)
        {

            bool status = false;
            string error = "";
            List<SchedulerMessage> SchedulerMessage = new List<SchedulerMessage>();
            try
            {
                SqlParameter[] param = {
                                           new SqlParameter("@SNo",models.MeetingID),
                                           new SqlParameter("@EmpSNo",models.Attendees[0]),
                                           new SqlParameter("@DutyAreaSNo",models.DutyAreaSNo),
                                           new SqlParameter("@StartTime",models.Start),
                                           new SqlParameter("@EndTime",models.End),
                                           new SqlParameter("@AllocationType","1"),
                                           new SqlParameter("@IsAllDay","0"),
                                           new SqlParameter("@ReportingShiftTime",models.ReportingShiftTime),
                                           new SqlParameter("@UpdatedBy","1"),
                                            new SqlParameter("@EroorMsg",SqlDbType.VarChar,500){Direction=ParameterDirection.Output}
                                       };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreateResourceAllocation", param);
                error = Convert.ToString(param[param.Length - 1].Value);
                status = true;
            }
            catch(Exception ex)// (Exception ex)
            {
                status = false;
            }
            //return status;
            SchedulerMessage.Add(new SchedulerMessage() { Status = "Save", Result = "Success", Error = error });
            return SchedulerMessage;
        }
        public bool DeleteAllocation(RosterResourceAllocation models)
        {
            bool status = false;
            try
            {
                SqlParameter[] param = {
                                           new SqlParameter("@SNo",models.MeetingID),                                           
                                       };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "DeleteResourceAllocation", param);
                status = Convert.ToBoolean(ds.Tables[0].Rows[0][0]);
            }
            catch(Exception ex)// (Exception ex)
            {
                status = false;
            }
            return status;
        }
    }
}
