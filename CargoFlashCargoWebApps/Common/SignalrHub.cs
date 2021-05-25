using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;


namespace CargoFlashCargoWebApps.Common
{
    [HubName("signalrHub")]
    public class SignalrHub : Hub
    {
        static List<ProcessLocking> lstProcessLocking = new List<ProcessLocking>();
        public void AlertOnValidation()
        {
            Clients.All.checkLocking();
        }
        public void UserEnterInProcess(ProcessLocking ProcessList)
        {
            ProcessList.ConnectionID = Context.ConnectionId;
            ProcessLocking lstExists = lstProcessLocking.Where(x => x.GroupFlightSNo == ProcessList.GroupFlightSNo && x.ProcessSNo == ProcessList.ProcessSNo && ProcessList.EventType == "SAVE").FirstOrDefault();
            ProcessLocking lstNotExists = lstProcessLocking.Where(x => x.GroupFlightSNo == ProcessList.GroupFlightSNo && x.ProcessSNo != ProcessList.ProcessSNo && ProcessList.EventType == "OPEN").FirstOrDefault();
            ProcessLocking lstOpenExists = lstProcessLocking.Where(x => x.GroupFlightSNo == ProcessList.GroupFlightSNo && x.ProcessSNo == ProcessList.ProcessSNo && ProcessList.EventType == "OPEN").FirstOrDefault();

            if (lstExists != null && lstNotExists == null)
            {
                lstProcessLocking.Remove(lstExists);
            }
            if (lstOpenExists == null)
            {
                ProcessList.ProcessOpenTime = DateTime.Now;
                lstProcessLocking.Add(ProcessList);
                //lst.ProcessSaveTime = ProcessList.ProcessSaveTime;
                //ProcessList = lst;
                //lstProcessLocking.Remove(lst);
            }
            else
            {
                ProcessList.ProcessOpenTime = DateTime.Now;
                lstOpenExists.ProcessOpenTime = DateTime.Now;
                lstProcessLocking.Remove(lstOpenExists);
                lstProcessLocking.Add(lstOpenExists);
            }




            ////ProcessLocking lst= new ProcessLocking();
            //foreach (var x in lstProcessLocking)
            //{
            //    if (ProcessList.UserSNo == x.UserSNo && ProcessList.GroupFlightSNo == x.GroupFlightSNo && ProcessList.ProcessSNo == x.ProcessSNo && ProcessList.EventType != x.EventType)
            //    {
            //        lst = x;
            //        lst.ProcessSaveTime = ProcessList.ProcessSaveTime;
            //        ProcessList = lst;
            //    }

            //}


            //ProcessList.ConnectionID= Context.ConnectionId;
            // lstProcessLocking.Add(ProcessList);
            Clients.Others.updateProcessList(ProcessList);
            Clients.Caller.getProcessList(lstProcessLocking);
        }
        public void UpdateProcessStatus(ProcessLocking ProcessList)
        {
            ProcessList.ConnectionID = Context.ConnectionId;
            var lst = lstProcessLocking.Where(x => x.GroupFlightSNo == ProcessList.GroupFlightSNo && x.ProcessSNo == ProcessList.ProcessSNo && x.EventType != ProcessList.EventType).FirstOrDefault();
            if (lst != null)
            {
                lst.ProcessSaveTime = DateTime.Now;
                lst.EventType = "SAVE";
                ProcessList = lst;
                lstProcessLocking.Remove(lst);
                lstProcessLocking.Add(ProcessList);
            }
            Clients.Others.updateProcessList(ProcessList);
            Clients.Caller.getProcessList(lstProcessLocking);
        }


    }
    public class ProcessLocking
    {
        public string GroupFlightSNo { get; set; }
        public int ProcessSNo { get; set; }
        public Nullable<DateTime> ProcessOpenTime { get; set; }
        public Nullable<DateTime> ProcessSaveTime { get; set; }
        public string ConnectionID { get; set; }
        //  public int UserSNo { get; set; }
        public string EventType { get; set; }
    }
}