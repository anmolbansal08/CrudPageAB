using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.SoftwareFactory.WebUI
{
    /// <summary>
    /// Enum describing anything is XRAY.
    /// </summary>
    public enum XRAYTYPE
    {
        /// <summary>
        /// The MANUAL.
        /// </summary>
        MANUAL = 0,

        /// <summary>
        /// The BARCODE.
        /// </summary>
        BARCODE = 1

        ///// <summary>
        ///// The MANUAL.
        ///// </summary>
        //COOLING = 2,

        ///// <summary>
        ///// The BARCODE.
        ///// </summary>
        //HANDSEARCH = 3
    }

    public enum APPLIEDAT
    {

        /// <summary>
        /// The BOOKING.
        /// </summary>
        AWB = 0,

        /// <summary>
        /// The BILLING.
        /// </summary>
        Billing = 1
    }
    public enum PAYMENTBY
    {

        /// <summary>
        /// The Office.
        /// </summary>
        Office = 0,

        /// <summary>
        /// The Agent.
        /// </summary>
        Agent = 1
    }
    public enum VERIFIED
    {

        /// <summary>
        /// The BOOKING.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The BILLING.
        /// </summary>
        No = 1
    }
    public enum APPROVED
    {

        /// <summary>
        /// The BOOKING.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The BILLING.
        /// </summary>
        No = 1
    }
    public enum REVERSAL
    {

        /// <summary>
        /// The BOOKING.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The BILLING.
        /// </summary>
        No = 1
    }
    public enum DUETYPE
    {

        /// <summary>
        ///  DueAgent.
        /// </summary>
        DueAgent = 0,

        /// <summary>
        ///  DueCarrier.
        /// </summary>
        DueCarrier = 1
    }
    public enum TAXAPPLICABLEON
    {

        /// <summary>
        /// The BOOKING.
        /// </summary>
        All = 0,

        /// <summary>
        /// The BILLING.
        /// </summary>
        OtherCharges = 1,
        /// <summary>
        /// The BILLING.
        /// </summary>
        DueAgentCharges = 2,
        /// <summary>
        /// The BILLING.
        /// </summary>
        Commision = 3,
        /// <summary>
        /// The BILLING.
        /// </summary>
        AwbFreightRate = 4,
        /// <summary>
        /// The BILLING.
        /// </summary>
        SportRate = 5,
        /// <summary>
        /// The BILLING.
        /// </summary>
        PenalityCharges = 6,
        /// <summary>
        /// The BILLING.
        /// </summary>
        Incentive = 7

    }

    /// <summary>
    /// Enum describing anything is SCANTYPE.
    /// </summary>
    public enum SCANTYPE
    {

        /// <summary>
        /// The MANUAL.
        /// </summary>
        MANUAL = 0,

        /// <summary>
        /// The BARCODE.
        /// </summary>
        BARCODE = 1
    }
    /// <summary>
    /// Enum describing anything is SCANTYPE.
    /// </summary>
    public enum WMSPAYMENTTYPE
    {

        /// <summary>
        /// The MANUAL.
        /// </summary>
        CASH = 0,

        CREDIT = 1

    }
    public enum ULDTYPES
    {


        Container = 0,

        Pallet = 1

    }
    public enum ULDTYPE
    {


        Container = 0,

        Pallet = 1,
        Both = 2
    }

    public enum DOTYPE
    {
        COMPLETE = 0,
        PART = 1
    }

    public enum SHIPMENTTYPE
    {
        /// <summary>
        /// The MANUAL.
        /// </summary>
        //AWB = 0,
        //Courier = 1
        AWB = 1,
        Courier = 2,
        CBV = 3

    }

    public enum MEASUREMENTUNIT
    {
        INCH = 1,
        CM = 0
    }

    /// <summary>
    /// Enum describing anything is active or not.
    /// </summary>
    public enum ACTIVE
    {
        /// <summary>
        /// The yes.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The no.
        /// </summary>
        No = 1
    }

    /// <summary>
    /// Enum describing Maintenance Category Primary or Additional.
    /// </summary>
    /// 
    

    // added by arman ali 2018-01-01
    public enum COMMISSIONCUSTOMERTYPE
    {
        Domestic = 1,
        International = 0,
        Both = 2
    }
    /// <summary>
    /// Enum describing anything is active or not.
    /// </summary>
    /// 
    // Created By Om Shankar
    public enum ACTIVEWITHBOTH
    {
        Yes = 1,
        No = 2,
        Both = 3
    }




    public enum ISSECTOR
    {

        Yes = 1,
        No = 0
    }
    public enum ISACTIVE
    {
        /// <summary>
        /// The yes.
        /// </summary>
        Yes = 1,

        /// <summary>
        /// The no.
        /// </summary>
        No = 0
    }


    public enum SCM
    {

        Automatic = 0,


        Manual = 1
    }

    /// <summary>
    /// Enum return True/False
    /// </summary>
    public enum TYPEBOOLEAN
    {
        /// <summary>
        /// The true.
        /// </summary>
        True = 0,

        /// <summary>
        /// The false.
        /// </summary>
        False = 1
    }

    /// <summary>
    /// Enum for Target Type 
    /// </summary>
    public enum TARGETTYPE
    {
        /// <summary>
        /// The Revenue.
        /// </summary>
        Revenue = 1,

        /// <summary>
        /// The Weight.
        /// </summary>
        Weight = 0

    }

    /// <summary>
    /// Enum for Login Type 
    /// </summary>
    public enum LOGINTYPE
    {
        /// <summary>
        /// The admin.
        /// </summary>
        Admin = 1,

        /// <summary>
        /// The office.
        /// </summary>
        Office = 2,

        /// <summary>
        /// The agent.
        /// </summary>
        Agent = 3,

        /// <summary>
        /// The Finance.
        /// </summary>

        Finance = 4,

        /// <summary>
        /// The Sales.
        /// </summary>
        Sales = 8,

        /// <summary>
        /// The Cashier.
        /// </summary>
        Cashier = 10
    }

    /// <summary>
    /// Enum for Wt Unit  
    /// </summary>
    public enum UNIT
    {
        /// <summary>
        /// The Cms.
        /// </summary>
        Cms = 1,

        /// <summary>
        /// The Inches.
        /// </summary>
        Inches = 2
    }
    //public enum ACCEPTANCEUNIT
    //{
    //    /// <summary>
    //    /// The Cms.
    //    /// </summary>
    //    Cms = 0,

    //    /// <summary>
    //    /// The Inches.
    //    /// </summary>
    //    Inches = 1
    //}
    /// <summary>
    /// Enum for Days 
    /// </summary>
    public enum DAYS
    {
        /// <summary>
        /// All Days.
        /// </summary>
        All = 0,
        /// <summary>
        /// The Sun.
        /// </summary>
        Sun = 1,

        /// <summary>
        /// The Mon.
        /// </summary>
        Mon = 2,

        /// <summary>
        /// The Tue.
        /// </summary>
        Tue = 3,

        /// <summary>
        /// The Wed.
        /// </summary>
        Wed = 4,

        /// <summary>
        /// The Thu.
        /// </summary>
        Thu = 5,

        /// <summary>
        /// The Fri.
        /// </summary>
        Fri = 6,

        /// <summary>
        /// The Sat.
        /// </summary>
        Sat = 7
    }

    public enum PAYMENTMODE
    {
        /// <summary>
        /// The Cash.
        /// </summary>
        Cash = 1,

        /// <summary>
        /// The Cheque.
        /// </summary>
        Cheque = 2,

        /// <summary>
        /// The BankTransfer.
        /// </summary>
        BankTransfer = 3,

        /// <summary>
        /// The Others.
        /// </summary>
        Others = 4
    }
    public enum VEHICLETYPE
    {
        /// <summary>
        /// New Vehicle.
        /// </summary>
        NewVehicle = 0,
        /// <summary>
        /// Old Vehicle.
        /// </summary>
        OldVehicle = 1
    }
    public enum PAYMENTTYPE
    {
        /// <summary>
        /// The Office.
        /// </summary>
        Office = 0,
        /// <summary>
        /// The Account.
        /// </summary>
        Account = 1


    }
    public enum PAYMENTREQUESTTYPE
    {
        /// <summary>
        /// The Customer.
        /// </summary>
        Customer = 0,
        /// <summary>
        /// The Consolidator.
        /// </summary>
        Consolidator = 1,

        /// <summary>
        /// The Warehouse.
        /// </summary>
        Warehouse = 2
    }

    public enum CONTACTSTYPE
    {
        /// <summary>
        /// The office.
        /// </summary>
        Office = 0,
        /// <summary>
        /// The Account.
        /// </summary>
        Account = 1,

        /// <summary>
        /// The CTO.
        /// </summary>
        CTO = 2
    }



    public enum TRANSACTIONTYPE
    {
        /// <summary>
        /// The ActualTransaction.
        /// </summary>
        ActualTransaction = 0,

        /// <summary>
        /// The Credit.
        /// </summary>
        Credit = 1


    }
    public enum INCENTIVEBASEDON
    {
        /// <summary>
        /// The Revenue.
        /// </summary>
        Revenue = 0,

        /// <summary>
        /// The Weight.
        /// </summary>
        Weight = 1


    }
    public enum FREIGHTTYPE
    {
        /// <summary>
        /// The Prepaid.
        /// </summary>
        Prepaid = 0,

        /// <summary>
        /// The Collect.
        /// </summary>
        Collect = 1

    }
    public enum FREIGHTTYPENEW
    {
        /// <summary>
        /// The Prepaid.
        /// </summary>
        Prepaid = 0,
        /// <summary>
        /// The Collect.
        /// </summary>
        Collect = 1,
        /// <summary>
        /// The Both.
        /// </summary>
        Both = 2
    }
    public enum BILLINGONBOOKING
    {
        /// <summary>
        /// The B2C.
        /// </summary>
        B2C = 0,

        /// <summary>
        /// The Consolidator.
        /// </summary>
        Consolidator = 1,

        /// <summary>
        /// The POS.
        /// </summary>
        POS = 2,

        /// <summary>
        /// The DropBox.
        /// </summary>
        Dropbox = 3


    }
    public enum STTPTYPE
    {
        /// <summary>
        /// The Auto.
        /// </summary>
        Auto = 0,
        /// <summary>
        /// The Manual.
        /// </summary>
        Manual = 1

    }
    public enum STOTYPE
    {
        /// <summary>
        /// The POS.
        /// </summary>
        POS = 0,

        /// <summary>
        /// The DropBox.
        /// </summary>
        Dropbox = 1,

        /// <summary>
        /// The B2C.
        /// </summary>
        Customer = 2
    }

    public enum ADJUSTMENTTO
    {
        /// <summary>
        /// The OriginConsolidator.
        /// </summary>
        OriginConsolidator = 1,
        /// <summary>
        /// The DestinationConsolidator.
        /// </summary>
        DestinationConsolidator = 2,
        /// <summary>
        /// The Customer.
        /// </summary>
        Customer = 3
    }
    public enum ADJUSTMENTTYPE
    {
        /// <summary>
        /// The Credit.
        /// </summary>
        Credit = 0,
        /// <summary>
        /// The Debit.
        /// </summary>
        Debit = 1


    }


    public enum SCHEDULETYPEFOROPENFLIGHT
    {
        /// <summary>
        /// Self Flight.
        /// </summary>
        Airline = 0,
        /// <summary>
        /// Spa Airline.
        /// </summary>
        Interline = 1,
        /// <summary>
        /// Both.
        /// </summary>
        //Both = 2
        Both = 2,
        /// <summary>
        /// Trucking.
        /// </summary>
        //Trucking = 3
    }
    // added by anand
    public enum SCHEDULETYPE
    {
        /// <summary>
        /// Self Flight.
        /// </summary>
        Airline = 0,
        /// <summary>
        /// Spa Airline.
        /// </summary>
        Interline = 1,
        /// <summary>
        /// Both.
        /// </summary>
        //Both = 2

        /// <summary>
        /// Trucking.
        /// </summary>
        //Trucking = 3
    }
    // added by anand
    public enum BOOKINGTYPE
    {
        /// <summary>
        /// Cargo.
        /// </summary>
        Cargo = 0,
        /// <summary>
        /// Courier.
        /// </summary>
        Courier = 1
    }
    // added by anand
    public enum BOOKINGSOURCE
    {
        /// <summary>
        /// from City.
        /// </summary>
        City = 0,
        /// <summary>
        /// from AWB.
        /// </summary>
        AWB = 1
    }
    // added by Madhav
    public enum VALUETYPE
    {
        /// <summary>
        /// Plus Percentage
        /// </summary>
        Percentage = 0,
        /// <summary>
        /// Flat.
        /// </summary>
        Flat = 1

    }
    public enum AWBTYPE
    {
        /// <summary>
        /// 1=IATA AWB,2-Courier,3-Mail
        /// </summary>
        ISIATA = 1,
        Courier = 2,
        //Mail = 3
    }

    public enum StockAutoAWB
    {
        /// <summary>
        /// 0=Electronic ,1-Manual,2-Cpmpany Material
        /// </summary>
        Electronic = 0,
        Manual = 1,
        CompanyMaterial = 2
    }
    public enum DUECARRIERTYPE
    {
        /// <summary>
        /// Agent
        /// </summary>
        Agent = 0,
        /// <summary>
        /// Airline.
        /// </summary>
        //MasterAirline = 1
        Carrier = 1

    }
    public enum DUECARRIERFREIGHTTYPE
    {
        /// <summary>
        /// Prepaid
        /// </summary>
        Prepaid = 1,
        /// <summary>
        /// Collect.
        /// </summary>
        Collect = 2,
        /// <summary>
        /// Both.
        /// </summary>
        Both = 3

    }

    public enum AIRINECODE
    {

        AIRASIA = 3,

        TESTAIRLINE = 32,

        TEST = 39

    }
    public enum AIRCRAFTBODYTYPE
    {
        /// <summary>
        /// 1-Wide,0-Narrow
        /// </summary>
        Narrow = 0,
        Wide = 1

    }
    public enum AIRCRAFTVOLWTTYPE
    {
        /// <summary>
        /// 1-KG,2-CBM
        /// </summary>
        //KG = 1,
        CBM = 2

    }
    public enum AIRCRAFTGRWTTYPE
    {
        /// <summary>
        /// 1-KG,2-LBS
        /// </summary>
        KG = 0,
        LBS = 1

    }

    public enum AREATYPE
    {
        /// <summary>
        /// 1-KG,2-LBS
        /// </summary>
        IMPORT = 0,
        EXPORT = 1

    }

    public enum AIRCRAFTCARGOCLASIFICATION
    {
        /// <summary>
        /// 1-Freighter,2-Pax,3-Combi,4-Truck
        /// </summary>
        Freighter = 1,
        Pax = 2,
        Combi = 3,
        RFS = 4
    }
    public enum AWBQueueManagmentType
    {

        Flight = 1,

        Shipment = 2,

        Commodity = 3,

        Sphc = 4

    }

    public enum SPHC
    {

        SHC = 0,
        SHC_Group = 1

    }
    public enum RATETYPE
    {
        /// <summary>
        /// 
        /// </summary>
        //Tariff = 1,
        ///// <summary>
        ///// 
        ///// </summary>
        //Office = 2,
        ///// <summary>
        ///// 
        ///// </summary>
        //Agent = 3,
        Trucking = 1

    }
    public enum CONFIGTYPE
    {
        /// <summary>
        /// 0-Embargo,1-BTL
        /// </summary>
        Embargo = 0
        /// <summary>
        /// 
        /// </summary>

        /// <summary>
        /// 
        /// </summary>

    }

    public enum WEIGHTTYPE
    {
        /// <summary>
        /// 1-PerKG,2-Per Pcs,3-Per Pound
        /// </summary>
        PerKG = 1,
        /// <summary>
        /// 
        /// </summary>
        PerPcs = 2,
        /// <summary>
        /// 
        /// </summary>
        PerPos = 3

    }
    public enum SLABTYPE
    {
        /// <summary>
        /// Default,Airline,City
        /// </summary>
        Default = 1,
        /// <summary>
        /// 
        /// </summary>
        Airline = 2,
        /// <summary>
        /// 
        /// </summary>
        City = 3

    }

    public enum ULDINVENTORYTYPE
    {
        /// <summary>
        /// Physically Not Available.
        /// </summary>
        PhysicallyNotAvailable = 0,

        /// <summary>
        /// Physically Available
        /// </summary>
        PhysicallyAvailable = 1,

        /// <summary>
        /// Is Loaded In System - Empty
        /// </summary>
        Empty = 0,

        /// <summary>
        /// Is Loaded In System - loaded
        /// </summary>
        Loaded = 1,

        /// <summary>
        /// ULD Not Found.
        /// </summary>
        NotFound = 0,

        /// <summary>
        /// ULD Found.
        /// </summary>
        Found = 1,

        /// <summary>
        /// ULD Not Damage.
        /// </summary>
        NotDamage = 0,

        /// <summary>
        /// ULD Damage.
        /// </summary>
        Damage = 1
    }
    public enum CREATEACCOUNT
    {
        Create = 0,
    }

    public enum ISUPLOAD
    {
        IsUploadMandatory = 0
    }

    public enum SHIFTCRITERIA
    {
        TeamBased = 0,
        EmployeeBased = 1
    }
    public enum AWBLIST
    {
        FetchAWBList = 0
    }
    public enum BASEUNITTYPE
    {
        KG = 0,
        HR = 1,
        UNIT = 2

    }

    /*Enum type for Tariff*/
    public enum TARIFFSHIPMENTTYPE
    {
        General_Cargo = 0,
        PO_Mail = 1,
        Courier = 2,
        Special_Cargo = 3,
        FOC = 4,
        Trucking = 5,
        ALL = 6
    }

    public enum APPLICABLEFOR
    {
        Export = 0,
        Import = 1,
        Transit = 2,
        ALL = 3
    }

    public enum CHARGETO
    {
        Agent = 0,
        Airline = 1,
        Both = 2
    }

    public enum ISSUETYPE
    {
        Agent = 0,
       
         Airline = 1

    }
    // Add by umar FreightInvoice
    public enum ISSUEFREIGHTINVOICE
    {
        Handling = 0,
        Freight = 1,
    }
   

    public enum OWNERTYPE
    {
        Agent = 0,
        Airline = 1,
        Self = 2
    }

    public enum WALKINGRATETYPE
    {
        TACT = 0,
        PUBLISHED = 1
    }


    public enum BASEDON
    {
        Gr_Wt = 0,
        Ch_Wt = 1,
        Per_Flight = 2,
        Total_Freight_And_Valuation_Charge = 3,
        NA = 4

    }

    public enum TARIFFFOR
    {
        Country = 0,
        City = 1,
        Airport = 2,
        Terminal = 3


    }
    public enum TARIFFTYPEVALUE
    {
        Domestic = 1,
        International = 0,
        Both=2


    }

    /*End enum type*/

    public enum TARIFFTYPE
    {
        Exclude = 0,
        Include = 1
    }
    public enum COMMODITYTYPE
    {
        Include = 0,
        Exclude = 1
    }
    public enum SLITYPE
    {
        Part = 0,
        Final = 1
    }
    public enum RECIPIENTTYPE
    {
        Airline = 0,
        Office = 1,
        Agent = 2
    }

    public enum MODE
    {
        FTP = 0,
        SITA = 1,
        Email = 2
    }

    public enum ISGROUP
    {
        Code = 0,
        Group = 1
    }

    public enum PRIORAPPROVAL
    {
        /// <summary>
        /// The yes.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The no.
        /// </summary>
        No = 1
    }
    public enum INTERLINE
    {
        /// <summary>
        /// The yes.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The no.
        /// </summary>
        No = 1
    }

    public enum ISIATA
    {
        /// <summary>
        /// The yes.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The no.
        /// </summary>
        No = 1
    }

    public enum ISSAS
    {
        /// <summary>
        /// The yes.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The no.
        /// </summary>
        No = 1
    }
    public enum FOR
    {
        IATA = 0,
        CTO = 1,
        Airline = 2
    }


    public enum OTHERCHARGEAPPLICABLEON
    {
        Cargo = 0,
        Mail = 1,
        Both = 2
    }

    // Changing USERTYPE by Vkumar on 6th Jan 2017 regarding Task #38
    //public enum USERTYPE
    //{
    //    Airline = 0,
    //    Agent = 1,
    //    Self = 2
    //}

    public enum USERTYPE
    {
        GSA = 0,
        Agent = 1,
        Airline = 2
    }
    // end
    public enum SHC
    {
        SHC = 0,
        SHC_GROUP = 1
    }
    public enum SLATYPE
    {
        Airline = 0,
        Self = 1
    }
    public enum SLABASIS
    {
        STD = 0,
        ATA = 1
    }
    public enum SLAWGTORPCT
    {
        Weight = 0,
        Precentage = 1
    }
    public enum ISTEAMPERSONNEL
    {
        Team = 0,
        Personnel = 1
    }
    public enum BUILDUPTYPE
    {
        BUP = 0,
        Loose = 1,
        Both = 2
    }
    public enum SLIBUILDUPTYPE
    {
        BUP = 1,
        agentBUP = 0
    }
    public enum DOCUMENTTYPE
    {
        MAWB = 0,
        HAWB = 1
    }
    public enum AWBXrayType
    {
        Pieces = 0,
        AWB = 1
    }
    //public enum ACCEPTANCEUNIT
    //{
    //    Cms = 0,
    //    Inches = 1

    //}
    public enum MeasurementUnit
    {
        Inch = 1,
        Cms = 2,
        Feet = 3,
        Metre = 4

    }
    public enum AWBXrayFault
    {
        Failure = 0,
        Clear = 1
    }
    public enum TYPE
    {
        Export = 0,
        Import = 1
    }

    public enum MOVEMENTTYPE
    {
        Export = 0,
        Import = 1,
        Transfer = 2,
        Transit = 3,
    }

    public enum RATE_TYPE
    {
        Handling = 0,
        Inventory = 1
    }
    public enum CHARGE_TYPE
    {
        Storage = 0,
        Issuance = 1,

    }
    public enum CREDITDEBITNOTETYPE
    {
        Credit_Note = 1,
        Debit_Note = 0
    }
    public enum CNDNIssueTo
    {
        Agent = 0,
        Airline = 1
    }
    public enum EXPORTORTRANSIT
    {
        Export = 0,
        Transit = 1
    }

    public enum CHARGECATEGORY
    {
        Landside = 0,
        Airside = 1
    }
    public enum FREESURCHARGE
    {
        Free = 0,
        Surcharge = 1
    }

    public enum TRUCKSOURCE
    {
        SAS = 0,
        Vendor = 1
    }

    public enum SCHEDULETRIP
    {
        YES = 0,
        NO = 1
    }

    public enum WAREHOUSEFACILITY
    {
        Yes = 0,
        No = 1,
        NA = 2
    }
    public enum UPDATETYPE
    {
        Increase = 0,
        Decrease = 1
    }
    public enum EMPLOYEETYPE
    {
        Blue_Collar = 1,
        White_Collar = 2
    }
    public enum BUILDUPCONSUMABLETYPE
    {
        Airline = 0,
        Self = 1
    }

    public enum VENDORTYPE
    {
        SAS = 0,
        Airline = 1
    }

    public enum FLIGHTTYPE
    {
        PAX = 0,
        FREIGHTER = 1
    }

    public enum ACCOUNTTYPEID
    {
        NA = 0,
        Agent = 1,
        Vendor = 2
    }


    // Added By Lpradhan For Unit In Aircraft Dimension Matrix
    // Added on 5th Jan 2017
    public enum DIMENSIONUNIT
    {
        Inch = 0,
        CM = 1
    }
    public enum UOM
    {
        KG = 0,
        LBS = 1

    }
    //Added By KK
    public enum ACCEPTANCEUNIT
    {
        Cm = 0,
        Inch = 1
    }
    //Added By KK
    public enum SLIUNIT
    {
        Full = 0,
        Part = 1
    }
    public enum EmbargoType
    {
        Hard = 0,
        Soft = 1
    }
    public enum DEFAULT
    {
        No = 0,
        Yes = 1
    }

    //Added By Vkumar on 29 Dec 2016 Task # 17
    public enum CUSTOMERTYPE
    {
        Domestic = 1,
        International = 0
    }
    // added by arman ali
    public enum APPLICABLETYPE
    {
        Domestic = 0,
        International = 1,
        Both = 2
    }

    public enum COMMISSIONUNIT
    {
        NetNet = 0,
        Commission = 1
    }
    //Ends Task # 17

    //Added By Vkumar on 11 Jan 2017 Task # 55
    // Region Type Enum
    public enum REGIONTYPE
    {
        Rate = 1,
        Report = 0
    }

    //Ends

    //Added By VSingh on 19 Jan 2017 Task #
    // Region Type Enum
    public enum UOV
    {

        CBM = 2

    }

    //Added By VSingh on 19 Jan 2017 Task 

    //Added By Vkumar on 19 Jan 2017 Task # 72
    public enum CHARGETYPE
    {
        [Display(Name = "Due Carrier")]
        DueCarrier = 1,
        [Display(Name = "Due Agent")]
        DueAgent = 2
    }

    //Added By VSingh on 19 Jan 2017 Task 


    //added by tarun kumar singh 23/1/2017
    public enum ISEXCLUDE
    {
        Exclude = 1,
        Include = 0
    }

    public enum EXCLUDE
    {
        Exclude = 0,
        Include = 1
    }

    //Added By VSingh on 24 Jan 2017 Task 
    public enum REQUESTTYPE
    {
        Adhoc = 0,
        [Display(Name = "Service Cargo")]
        //  [EnumMember(Value = "ServiceCargo")]
        ServiceCargo = 1,
        Campaign = 2
    }
    //Added By VSingh on 24 Jan 2017 Task 
    //Added By Sakhtar on 1 Feb 2017 Task 
    public enum AIRLINECLASSRATE
    {
        IsActive = 0,

        Active = 1,
        Draft = 2
    }
    //Added By Sakhtar on 1 Feb 2017 Task 

    //Added By Vkumar on 03 Feb 2017 
    public enum COMMISSIONABLETAXABLE
    {
        IsTaxable = 0,
        IsCommissionable = 1
    }

    //Added By akash 6 march
    public enum APPROVAL
    {
        Requested = 0,
        Approved = 1,
        Rejected = 2
    }

    public enum CODETYPE
    {
        Single = 1,
        Multiple = 2,
        //  Rejected = 2
    }
    //Added By Vsingh on 06 Feb 2017 

    public enum CAMPAIGNTYPE
    {
        International = 1,
        Domestic = 2
    }

    public enum REPAIR
    {
        Repair = 0,
        Scrap = 1
    }
    public enum MAWBCHARGES
    {
        MAWB = 0,
        HAWB = 1
    }
    public enum ApprovedISACTIVE
    {
        /// <summary>
        /// The yes.
        /// </summary>
        Yes = 0,

        /// <summary>
        /// The no.
        /// </summary>
        No = 1
    }
    // Added By Pankaj Kumar Ishwar
    public enum MaintenanceCategory
    {
        /// <summary>
        /// The Primary.
        /// </summary>
        Primary = 1,

        /// <summary>
        /// The Additional.
        /// </summary>
        Additional = 2
    }
    public enum DIMENSIONMANDATORYON
    {
        Domestic = 1,
        International = 2,
        Both = 3,
        None = 4
    }
    public enum SplitShipmentAllowed
    {
        Domestic = 1,
        International = 2,
        Both = 3,
        None = 0
    }

    public enum MessageFormat
    {
        CIMP = 0,
        CXML = 1,
        AXML = 2
    }
    public enum FileType
    {
        Text = 0,
        XML = 1
    }
    /*---------*/
}

public enum BANNERTYPE
{
    Website = 0,
    Mobile = 1
}
/*---------*/

//Added By Naveen
public enum OWNER
{

    /// <summary>
    /// OWNER  Type 
    /// </summary>
    Self = 0,

    /// <summary>
    /// Self  Type
    /// </summary>
    ThirdParty = 1,
    /// <summary>
    /// Third  Party Type
    /// </summary>



}

public enum DRIVERASSOCIATEDBRANCH
{

    /// <summary>
    /// Customer Report Type
    /// </summary>
    SubConsolidator = 0,

    /// <summary>
    /// All Report Type
    /// </summary>
    Consolidator = 1,
}
