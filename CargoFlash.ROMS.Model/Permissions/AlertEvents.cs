using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
  [KnownType(typeof(AlertEvents))]
  public class AlertEvents
  {
    public int SNo { get; set; }
    public string RefNo { get; set; }
    public int CitySNo { get; set; }
    public string Text_CitySNo { get; set; }
    public string CityCode { get; set; }
    public int OfficeSNo { get; set; }
    public string Text_OfficeSNo { get; set; }

    public string AirlineSNo { get; set; }
    public string Text_AirlineSNo { get; set; }
    public string TransactionType { get; set; }
    public string Text_TransactionType { get; set; }
    //public string SPHCSNo { get; set; }
    //public string Text_SPHCSNo { get; set; }

    public string SPHCType { get; set; }
    public string Text_SPHCType { get; set; }
    public string SPHCCode { get; set; }
    public string Text_SPHCCode { get; set; }
    public string SPHCSubGroupSNo { get; set; }
    public string Text_SPHCSubGroupSNo { get; set; }


    public int AlertEventSNo { get; set; }
    public string Text_AlertEventSNo { get; set; }

    //Added By Shivam
    public int TriggerEventTypeSNo { get; set; }
    public string Text_TriggerEventTypeSNo { get; set; }

    public int TriggerNameSNo { get; set; }
    public string Text_TriggerNameSNo { get; set; }

    public string Message { get; set; }

    public string Email { get; set; }

    public List<AlertEventsTrans> TransData { get; set; }
    public string CreatedBy { get; set; }

    public string UpdatedBy { get; set; }

    public string CommoditySNo { get; set; }
    public string Text_CommoditySNo { get; set; }
        public string Active { get; set; }
        public bool IsActive { get; set; }
    }

  [KnownType(typeof(AlertEventsPost))]
  public class AlertEventsPost
  {
    public int AlertSNo { get; set; }

    public int CitySNo { get; set; }

    public int OfficeSNo { get; set; }

    public string AirlineSNo { get; set; }
    public string CommoditySNo { get; set; }

    public string TransactionType { get; set; }
    public string SPHCType { get; set; }
    public string SPHCSNo { get; set; }
    public string SPHCSubGroupSNo { get; set; }

    public int AlertEventSNo { get; set; }

    public int TriggerEventTypeSNo { get; set; }  //Added By Shivam
    public int TriggerNameSNo { get; set; }

    public string Message { get; set; }

    public string Email { get; set; }

    public List<AlertEventsTrans> TransData { get; set; }

    public int UpdatedBy { get; set; }
    public bool IsActive { get; set; }
       
    }

  //  [KnownType(typeof(AlertEventsTrans))]
  public class AlertEventsTrans
  {
    public string SNo { get; set; }
    public int RecipientType { get; set; }
    public int HdnName { get; set; }
    public string Name { get; set; }
    public string EmailId { get; set; }
    public string MobileNo { get; set; }
  }

}
