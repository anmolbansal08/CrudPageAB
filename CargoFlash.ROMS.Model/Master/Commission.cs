using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Commission))]
    public class Commission
    {
        #region Public Properties
        //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,
        //NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
        public int SNo { get; set; }
        public string RefNo { get; set; }
        public string Text_OfficeSNo { get; set; }
        public int OfficeSNo { get; set; }
        public string Text_Agent { get; set; }
        public int Agent { get; set; }
        public int IsDomestic { get; set; }
    //    public string Text_Unit { get; set; }
      //  public int Unit { get; set; }
      //  public int Type { get; set; }
     //   public string Text_Type { get; set; }
        public string CustomerType { get; set; }
     //   public int CommissionType { get; set; }
     //   public string CommissionTypeText { get; set; }
     //   public decimal CommissionAmount { get; set; }
     //   public string Text_IncentiveType { get; set; }
      //  public int IncentiveType { get; set; }
     //   public decimal IncentiveAmount { get; set; }
      //  public int NetNet { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string ValidFromText { get; set; }
        public string ValidToText { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public int IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedUser { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public string UpdatedUser { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public List<CommissionTrans> CommissionTrans { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        ///////////////////////////////////////////////////
        public int AgentType { get; set; }
        public string Text_AgentType { get; set; }
        public Nullable<int> OriginCountrySNo { get; set; }
        public Nullable<int> DestinationCountrySNo { get; set; }
        public Nullable<int> OriginCitySNo { get; set; }
        public Nullable<int> DestinationCitySNo { get; set; }
        public string Text_OriginCountrySNo { get; set; }
        public string Text_DestinationCountrySNo { get; set; }
        public string Text_OriginCitySNo { get; set; }
        public string Text_DestinationCitySNo { get; set; }

        #endregion
    }
     [KnownType(typeof(CommissionTrans))]
    public class CommissionTrans
    {
        #region Public Properties

     //   public int Type { get; set; }
     //   public string Text_Type { get; set; }
        public int Sno { get; set; }
        public int CommissionTransSNo { get; set; }
        public decimal StartWeight { get; set; }
        public decimal EndWeight { get; set; }
        public int Unit { get; set; }
        public decimal Commission { get; set; }
        public decimal Incentive { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        //   public string ValidFrom_Text { get; set; }
        //   public string ValidTo_Text { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }

        //  public string SlabType { get; set; }
        #endregion
    }


}
