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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Shipment;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AWBTrackingService : SignatureAuthenticate, IAWBTrackingService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
     
        public string GetAWBTrackingRecord(string AWBNo, int BasedOn, int AccountSNo, int flag, string CarrierCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@BasedOn", BasedOn), new SqlParameter("@AccountSNo", AccountSNo), new SqlParameter("@flag", flag), new SqlParameter("@CarrierCode", CarrierCode) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBTrackingRecord", Parameters);
                if (ds.Tables["Table"].Rows.Count > 0)
                {
                    DataTable dt = ds.Tables["Table2"];
                    DataTable dt3 = ds.Tables["Table3"];
                    var Table1 = from row in dt.AsEnumerable()
                                 group row by new
                                 {
                                     awb = row.Field<string>("AWBNo"),
                                     trackawb = row.Field<string>("TrackAWBNo"),
                                     Ref = row.Field<string>("ReferenceNumber"),
                                     origin = row.Field<string>("Origin"),
                                     des = row.Field<string>("Destination"),
                                     Station = row.Field<string>("Station"),
                                     FlightNo = row.Field<string>("FlightNo"),
                                     FlightDate = row.Field<string>("FlightDate"),
                                     Action = row.Field<string>("Action"),
                                     createdon = row.Field<string>("createdon"),
                                     ActualPieces = row.Field<int>("TotalPieces")
                                 } into grp

                                 select new
                                 {
                                     Action = grp.Key.Action,
                                     Station = grp.Key.Station,
                                     FlightNo = grp.Key.FlightNo,
                                     FlightDate = grp.Key.FlightDate,
                                     Origin = grp.Key.origin,
                                     Destination = grp.Key.des,
                                     createdon = grp.Key.createdon,
                                     ReferenceNumber = grp.Key.Ref,
                                     AWBNo = grp.Key.awb,
                                     ActualPieces=grp.Key.ActualPieces,
                                     Pieces = grp.Sum(r => r.Field<Int32>("Pieces")),
                                     Weight = grp.Sum(r => r.Field<Decimal>("Weight")),
                                     cbm = grp.Sum(r => r.Field<Decimal>("cbm"))
                                 };


                    ds.Tables.Remove(dt);
                    DataTable dt1 = CollectionHelper.CreateTable<Table2>("");
                    foreach (var item in Table1)
                    {
                        dt1.Rows.Add(item.Action, item.Station, item.FlightNo, item.FlightDate, item.Origin, item.Destination, item.createdon, item.ReferenceNumber, item.AWBNo,item.ActualPieces , item.Pieces, item.Weight, item.cbm);
                    }
                    ds.Tables.Remove(ds.Tables["Table3"]);
                    ds.Tables.Add(dt1);
                    ds.Tables.Add(dt3);
                }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

            }
        
        public string SaveEmailId(string EmailAddress, string AWBNo, string MailSubject, string MailBody, string BodyFormat, int GenerateBy, string GeneratedAt, int IsSend)
        {
           
            try
            {
                SqlParameter[] Parameters = {
                                               new SqlParameter("@EmailAddress", CargoFlash.Cargo.Business.Common.Base64ToString(EmailAddress)),
                                               new SqlParameter("@AWBNo",AWBNo),
                                               new SqlParameter("@MailSubject",MailSubject),
                                               new SqlParameter("@MailBody",CargoFlash.Cargo.Business.Common.Base64ToString(MailBody)),
                                               new SqlParameter("@BodyFormat",BodyFormat ),
                                               new SqlParameter("@GenerateBy", GenerateBy),
                                               new SqlParameter("@GeneratedAt", GeneratedAt),
                                               new SqlParameter("@IsSend",IsSend) };
                                               
                                               //new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Sp_SendEmailForAWB", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

    }

    public class Table2
    {
        public string Action { get; set; }
        public string Station { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string createdon { get; set; }
        public string ReferenceNumber { get; set; }
        public string AWBNo { get; set; }
        public Int32 ActualPieces { get; set; }
        public Int32 Pieces { get; set; }
        public decimal Weight { get; set; }
        public decimal cbm { get; set; }
    }
}

