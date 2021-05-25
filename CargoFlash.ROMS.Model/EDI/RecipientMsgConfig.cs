using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System;

namespace CargoFlash.Cargo.Model.EDI
{
    [KnownType(typeof(RecipientMsgConfig))]
    public class RecipientMsgConfig
    {
        //public int SNo { get; set; }
        [Required]
        [StringLength(250)]
        public string AirlineName { get; set; }
        public string Text_AirlineName { get; set; }
        public string AirportName { get; set; }
        public string Text_AirportName { get; set; }
        public string Basis { get; set; }
        public string Text_Basis { get; set; }
        public string MessageMovementType { get; set; }
        public string Text_MessageMovementType { get; set; }
        public int CutOffMins { get; set; }

        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public string DestinationCountry { get; set; }
        public string Text_DestinationCountry { get; set; }
        public string DestinationCity { get; set; }
        public string Text_DestinationCity { get; set; }
        public string MessageTypeVersion { get; set; }
        public string Text_MessageTypeVersion { get; set; }
        public int SNo { get; set; }
        public int RecipientType { get; set; }
        public string MessageType { get; set; }
        public string Text_MessageType { get; set; }
        public string MessageVersion { get; set; }
        public string Text_MessageVersion { get; set; }
        public string  Active { get; set; }

        public bool IsActive { get; set; }
        public bool IsDoubleSignature { get; set; }

        public string ExecutionType { get; set; }
        public string Text_ExecutionType { get; set; }
        public string FlightNo { get; set; }
        public string Text_FlightNo { get; set; }
        public string OriginAirport { get; set; }
        public string RecipientType1 { get; set; }
        public string Version { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string RecipientId { get; set; }

    }


    [KnownType(typeof(RecipientMsgConfigSave))]
    public class RecipientMsgConfigSave
    {
        public int SNo { get; set; }
        public int AirlineSNo { get; set; }
        public int OfficeSNo { get; set; }
        public int AccountSNo { get; set; }
        public int DestinationCountrySNo { get; set; }
        public int DestinationCitySNo { get; set; }
        public int MessageTypeMasterSNo { get; set; }
        public int MessageVersion { get; set; }
        public int AirportSNo { get; set; }
        public string Basis { get; set; }
        public string MessageMovementType { get; set; }
        public int CutOffMins { get; set; }
        public bool IsActive { get; set; }
        public bool IsDoubleSignature { get; set; }
        public bool ExecutionType { get; set; }
        public string FlightNo { get; set; }


    }


    [KnownType(typeof(RecipientMsgConfigSaveTrans))]
    public class RecipientMsgConfigSaveTrans
    {
        public string ReceivingMode { get; set; }
        public string ReceivingID { get; set; }
        public string ReceivingUserId { get; set; }
        public string ReceivingPassword { get; set; }
        public string TriggerEvent { get; set; }
    }

    [KnownType(typeof(RecipientMsgConfigUpdateTrans))]
    public class RecipientMsgConfigUpdateTrans
    {
        public int SNo { get; set; }
        public int Mode { get; set; }
        public string ReceivingMode { get; set; }
        public string ReceivingID { get; set; }
        public string ReceivingUserId { get; set; }
        public string ReceivingPassword { get; set; }
        public int RecipientMsgConfigSNo { get; set; }
        public string TriggerEvent { get; set; }
        public string Text_TriggerEvent { get; set; }
        public int HdnTriggerEvent { get; set; }
        public string ModeText { get; set; }
        
    }

}
