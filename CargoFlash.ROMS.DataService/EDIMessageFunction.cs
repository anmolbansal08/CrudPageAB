using Microsoft.VisualBasic;
using System.Data;
using System.Linq;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.IO;
using System;
using System.Collections;



public class EDIMessageFunctions {
    
    private int mModuleIDandReturnCode = -10;
    
    private string mProcName = "";
    
    private string mModuleName = "EDIMessageFunction";
    
   // private BL_Common_Functions Bl = new BL_Common_Functions();
    
    public DataSet mMessageData = new DataSet();
    
    public DataSet mOutPutDataSet = new DataSet();
    
  //  public DataSet mProcessExecutionResult = Bl.GetResultTableStructure;

    //struct lMessageDetails
    //{

        public string lMessageType;

        public int lMessageVersion;

        public string lMsgSubType;

        public long lCharaterCount;

        public long lLinesCount;

        public string[] lLinesData;

        public string[] lCarimpRefId;
   // }

  //  ArrayList MessageDetails = new ArrayList();
  //  public lMessageDetails MessageDetails = new lMessageDetails();
     public  struct GroupInfo
        {

            private string StartCARImp;

            private string EndCARImp;

            private int CurrentGroupCycleCount;

            private int MaxGroupCount;

            private string CurrentCARIMPRefNo;

            private string FIRSTGroupOccuranceAfterCARImp;

            private string NEXTGroupOccuranceAfterCARImp;

            private string ADDRowsCARIMPStart;

            private string ADDRowsCARIMPEnd;
        }

        ArrayList Preserves = new ArrayList();
    
    private string[] mLogs;
    
    private bool mLog = false;
    
    private int mLengthOfEachLine = 69;
    
    // Dim mLengthOfEachMessage As Integer = 1600
    private int mLengthOfEachMessage = 50000;
    
    private string mSeperator = "/";

    //void CreateLog(string vLogItem, string vProcedure)
    //{
    // // Preserves.Add(mLogs[mLogs.Length]);
    //    mLogs[(mLogs.Length - 1)] = vLogItem.ToString();
    //}

    //public string ProcessMessageValidation(string vFileName, string vMessageText) {
    //    mMessageData.Clear();
    //    // Warning!!! Optional parameters not supported
    //    // Warning!!! Optional parameters not supported
    //    bool lProcessResult = false;
    //    if ((vMessageText != ""))
    //    {
    //        lProcessResult = ReadTextAndPopulateStructureMessageDetails(vMessageText.ToUpper().ToString());
    //    }
       
        
    //    if ((lProcessResult == false)) {
    //        return "false";
            
    //    }
    //    else if ((lProcessResult == true)) {
    //        lProcessResult = this.ValidateMessageArrayDetails();
    //        // If lProcessResult = False Then
    //        //     ProcessMessageValidation = False : Exit Function
    //        // End If
    //    }
        
    //    //if ((this.ParseMessageContent() == false)) {
         
    //    //    return "false";
            
    //    //}
    //    //else {
    //    //    int lCnt;
    //    //    int lLineId;
    //    //    for (lCnt = (mMessageData.Tables[0].Rows.Count - 1); (lCnt > 0); lCnt = (lCnt + -1)) {
    //    //        if (mMessageData.Tables[0].Rows[0]["MessageDefinition"].ToString()==null)
    //    //        {//mMessageData.Tables[0].Rows[lCnt].Item["MessageDefinition"] == null
    //    //            continue;
    //    //        }
                
    //    //        if (((mMessageData.Tables[0].Rows[lCnt]["DataFound"].ToString()) == null)) {
    //    //            mMessageData.Tables[0].Rows[lCnt]["DataFound"] = "False";
    //    //        }
                
    //    //        if ((mMessageData.Tables[0].Rows[lCnt]["LineIdentifier"].ToString() != Convert.ToString(lLineId))) {
    //    //            if (((mMessageData.Tables[0].Rows[lCnt]["MessageDefinition"].ToString() == "CRLF") 
    //    //                        && (mMessageData.Tables[0].Rows[lCnt]["DataFound"].ToString() == "False"))) {
    //    //                lLineId = Convert.ToInt32(mMessageData.Tables[0].Rows[lCnt]["LineIdentifier"].ToString());
    //    //            }
    //    //            else {
                        
    //    //            }
                    
    //    //        }
                
    //    //        if ((mMessageData.Tables[0].Rows[lCnt]["LineIdentifier"].ToString() == lLineId.ToString())) {
    //    //            // If mMessageData.Tables(0).Rows(lCnt).Item("DataFound") = False Then mMessageData.Tables(0).Rows(lCnt).Delete()
    //    //        }
                
                
    //    //    }
            
    //    //    return "true";
    //    //}
        
    //}

    //public bool ReadTextAndPopulateStructureMessageDetails(string vMessageText)
    //{
    //    vMessageText = vMessageText.TrimEnd();
    //    mProcName = "ReadTextAndPopulateStructureMessageDetails";
    //    lLinesData[0] = "";

    //    if (vMessageText.Contains("\r\n"))
    //    {
    //        lLinesData = vMessageText.Split('\r');
    //    }
    //    else if (vMessageText.Contains("\n"))
    //    {
    //        lLinesData = vMessageText.Split('\n');
    //    }
    //    else if (vMessageText.Contains("\r"))
    //    {
    //        lLinesData = vMessageText.Split('\r');
    //    }

    //    if ((lLinesData[(lLinesData.Length - 1)] == ""))
    //    {
    //        //  object Preserve;
    //        lLinesData[(lLinesData.Length - 2)] = "";
    //    }

    //    lCarimpRefId[0] = "";
    //    for (int lcnt = 0; (lcnt <= lLinesData.Length); lcnt++)
    //    {
    //        lCarimpRefId[lcnt] = "";
    //    }

    //    return true;
    //}

    //internal bool ValidateMessageArrayDetails()
    //{
    //    for (int lCnt = 0; (lCnt <= lLinesData.Length); lCnt++)
    //    {
    //        lLinesData[lCnt] = (((lLinesData[lCnt].Substring(0, 1)) == "10") ? lLinesData[lCnt].Substring(1) : lLinesData[lCnt]).Trim();
    //        lLinesCount = (lLinesCount + 1);
    //        if ((lLinesData[lCnt].Length > mLengthOfEachLine))
    //        {
    //            // Length of each line cannot be greater than @1 chars, line no @2 has @3 chars.
    //            string lParametersToPassToError;
    //            lParametersToPassToError = mLengthOfEachLine.ToString();
    //            lParametersToPassToError = (lParametersToPassToError + (";"
    //                        + (lCnt + (";" + lLinesData[lCnt].Length))));
    //            //    mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 11, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //            return false;

    //        }

    //        lCharaterCount = (lCharaterCount + lLinesData[lCnt].Length);

    //        return true;
    //    }

    //    if ((lCharaterCount > mLengthOfEachMessage))
    //    {
    //        // Length of each message cannot be greater than @1 chars, current msg has @3 chars.
    //        string lParametersToPassToError;
    //        lParametersToPassToError = mLengthOfEachMessage.ToString();
    //        lParametersToPassToError = (lParametersToPassToError + (";" + lCharaterCount));
    //        //  mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 12, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //        return false;

    //    }
    //    return true;
    //}

   // ArrayList vGroupInfo = new ArrayList();

   //public void AddGroupInfo(ref GroupInfo vGroupInfo,string vValue)
   // {
   //     // STARTCARImp:4.8;ENDCARImp:9.10;MAXCOUNT:-1;FIRSTGroupOccuranceAfterCARImp:3.3;NEXTGroupOccuranceAfterCARImp:9.10;ADDRowsCARIMPStart:4.1;ADDRowsCARIMPEnd:9.10
   //     // "[A-Z]{3}/(?'versionnumber'([0-9]*))").Groups("versionnumber").Value
   //   //  object Preserve;
   //    // ArrayList vGroupInfo = new ArrayList();
   //     //vGroupInfo((UBound(vGroupInfo) + 1));
       

   //     Match lRegGroupInfos;
   //     lRegGroupInfos = Regex.Match(vValue, @"STARTCARImp:(?'StartSEQ'([0-9. -OR]*));ENDCARImp:(?'EndSEQ'([0-9.]*));MAXCOUNT:(?'MaxCount'([0-9.-]*));FIRSTGroupOccuranceAfterCARImp:(?'FIRSTGroupOccuranceAfterCARImp'([0-9. -OR]*));NEXTGroupOccuranceAfterCARImp:(?'NEXTGroupOccuranceAfterCARImp'([0-9. -OR]*));ADDRowsCARIMPStart:(?'ADDRowsCARIMPStart'([0-9.-]*));ADDRowsCARIMPEnd:(?'ADDRowsCARIMPEnd'([0-9.-]*));");
       
   //    //vgr .StartCARImp = lRegGroupInfos.Groups["StartSEQ"].Value;
   //    // vGroupInfo(UBound(vGroupInfo)).EndCARImp = lRegGroupInfos.Groups["EndSEQ"].Value;
   //    // vGroupInfo(UBound(vGroupInfo)).MaxGroupCount = lRegGroupInfos.Groups["MaxCount"].Value;
   //    // vGroupInfo(UBound(vGroupInfo)).FIRSTGroupOccuranceAfterCARImp = lRegGroupInfos.Groups["FIRSTGroupOccuranceAfterCARImp"].Value;
   //    // vGroupInfo(UBound(vGroupInfo)).NEXTGroupOccuranceAfterCARImp = lRegGroupInfos.Groups["NEXTGroupOccuranceAfterCARImp"].Value;
   //    // vGroupInfo(UBound(vGroupInfo)).ADDRowsCARIMPStart = lRegGroupInfos.Groups["ADDRowsCARIMPStart"].Value;
   //    // vGroupInfo(UBound(vGroupInfo)).ADDRowsCARIMPEnd = lRegGroupInfos.Groups["ADDRowsCARIMPEnd"].Value;
   // }
    
    //internal bool PopulateDatainGroupFromMessageIntoDataset(ref DataRow vCurrentRow, string vStringToMatch, string vRegExString, ref GroupInfo[] vGroupInfo) {
    //    // vStartProcessFromNextInternalGroupId is added on July 01 10 as we needed to start RTD line to start on the next line
    //    // Dim lMatch As Match = Regex.Match(vStringToMatch, vRegExString)
    //    // AddRowsinTablesBasedOnGroup(vGroupInfo)
    //    Regex rgx = new Regex(vRegExString);
    //    Match match = rgx.Match(vStringToMatch);
    //    //  If match.Success Then ShowMatches(rgx, match)
    //    string[] names = rgx.GetGroupNames();
    //    foreach (lName in names) {
    //        DataRow[] lDataRow = mMessageData.Tables[0].Select(("CarImpAlphaNo = \'" 
    //                        + (lName + "\'")), "SeqNumber desc");
    //        if ((lDataRow.Length > 0)) {
    //            // With...
    //            lDataRow[0].Item["DataFoundText"] = true;
    //        }
            
    //    }
        
    //}
    
    //void AddRowsinTablesBasedOnGroup(ref GroupInfo[] vGroupInfo) {
    //    // With...
    //    Decimal lStartId = mMessageData.Tables[0].Select(("CarImpRefNo = \'" 
    //                    + (vGroupInfo((vGroupInfo.Count - 1)).ADDRowsCARIMPStart + "\'")), "SEQNumber Asc")[0].Item["SEQNumber"];
    //    Decimal lEndId = mMessageData.Tables[0].Select(("CarImpRefNo = \'" 
    //                    + (vGroupInfo((vGroupInfo.Count - 1)).ADDRowsCARIMPEnd + "\'")), "SEQNumber Asc")[0].Item["SEQNumber"];
    //    DataRow[] lArrDataRow = mMessageData.Tables[0].Select(("SEQNumber >= " 
    //                    + (lStartId + (" and SEQNumber <= " + lEndId))));
    //    if ((vGroupInfo((vGroupInfo.Count - 1)).CurrentGroupCycleCount == 0)) {
    //        if (!vGroupInfo((vGroupInfo.Count - 1)).FIRSTGroupOccuranceAfterCARImp.ToString.Contains) {
    //            "OR CarImpRefNo";
    //            vGroupInfo((vGroupInfo.Count - 1)).FIRSTGroupOccuranceAfterCARImp = vGroupInfo((vGroupInfo.Count - 1)).FIRSTGroupOccuranceAfterCARImp.Replace;
    //            " OR ";
    //            "\' OR CarImpRefNo = \'";
    //        }
            
    //        lStartId = mMessageData.Tables[0].Select(("CarImpRefNo = \'" 
    //                        + (vGroupInfo((vGroupInfo.Count - 1)).FIRSTGroupOccuranceAfterCARImp + "\'")), "SEQNumber Desc")[0].Item["SEQNumber"];
    //    }
    //    else {
    //        if (!vGroupInfo((vGroupInfo.Count - 1)).NEXTGroupOccuranceAfterCARImp.ToString.Contains) {
    //            "OR CarImpRefNo";
    //            vGroupInfo((vGroupInfo.Count - 1)).NEXTGroupOccuranceAfterCARImp = vGroupInfo((vGroupInfo.Count - 1)).NEXTGroupOccuranceAfterCARImp.Replace;
    //            " OR ";
    //            "\' OR CarImpRefNo = \'";
    //        }
            
    //        lStartId = mMessageData.Tables[0].Select(("CarImpRefNo = \'" 
    //                        + (vGroupInfo((vGroupInfo.Count - 1)).NEXTGroupOccuranceAfterCARImp + "\'")), "SEQNumber Desc")[0].Item["SEQNumber"];
    //    }
        
    //    // lStartId = lStartId - 1
    //    foreach (lRow in lArrDataRow) {
    //        // lRow.Item("DataFoundText") = ""
    //        mMessageData.Tables[0].Rows.InsertAt(mMessageData.Tables[0].NewRow, lStartId);
    //        foreach (DataColumn lColumn in mMessageData.Tables[0].Columns) {
    //            if ((lColumn.ColumnName != "DataFoundText")) {
    //                mMessageData.Tables[0].Rows[lStartId].Item[lColumn.ColumnName] = lRow.Item[lColumn.ColumnName];
    //                mMessageData.Tables[0].Rows[lStartId].Item["DataFoundText"] = "";
    //            }
    //            else {
    //                mMessageData.Tables[0].Rows[lStartId].Item[lColumn.ColumnName] = "~RAHIM~";
    //            }
                
    //        }
            
    //        lStartId = (lStartId + 1);
    //    }
        
    //    long lSeqNumber = 1;
    //    // mMessageData.Tables(0).Rows(0).Item("SeqNumber")
    //    for (lCnt = 0; (lCnt 
    //                <= (mMessageData.Tables[0].Rows.Count - 1)); lCnt++) {
    //        mMessageData.Tables[0].Rows[lCnt].Item["SeqNumber"] = lSeqNumber;
    //        lSeqNumber = (lSeqNumber + 1);
    //    }
        
    //}
    
    //internal bool ParseMessageContent() {
    //    try {
    //        string lParametersToPassToError = "";
    //        mProcName = "ParseMessageContent";
    //        if ((MessageDetails.lLinesData(0).Length < 3)) {
    //            lParametersToPassToError = "1";
    //            lParametersToPassToError = (lParametersToPassToError + (";" + MessageDetails.lLinesData(0)));
    //            mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 1, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //            return false;
                
    //        }
            
    //        // Identify the message type
    //        if ((Regex.IsMatch(MessageDetails.lLinesData(0), "[A-Z]{3}") == false)) {
    //            lParametersToPassToError = "1";
    //            lParametersToPassToError = (lParametersToPassToError + (";" + Regex.Match(MessageDetails.lLinesData(0), "[A-Z]{3}").Value));
    //            mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 1, mProcName, mModuleName, "ENGLISH"));
    //            return false;
                
    //        }
            
    //        MessageDetails.lMessageType = MessageDetails.lLinesData(0).Substring(0, 3);
    //        if ((MessageDetails.lMessageType == "SSM")) {
    //            MessageDetails.lMsgSubType = MessageDetails.lLinesData(3).Substring(0, 3);
    //            mMessageData = Bl.Bl_Listdb(("Select MessageID from EDIMessage where StandardMessageIdentifier = \'" 
    //                            + (MessageDetails.lMessageType + ("\' and SubMessageIdentifier = \'" 
    //                            + (MessageDetails.lMsgSubType + "\'")))));
    //        }
    //        else {
    //            mMessageData = Bl.Bl_Listdb(("Select MessageID from EDIMessage where StandardMessageIdentifier = \'" 
    //                            + (MessageDetails.lMessageType + "\'")));
    //        }
            
    //        if ((mMessageData.Tables[0].Rows.Count == 0)) {
    //            // This message Type is not supported.
    //            lParametersToPassToError = ("1;" + MessageDetails.lMessageType);
    //            mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 2, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //            return false;
                
    //        }
            
    //        // Find Message Version
    //        if ((MessageDetails.lLinesData(0).ToString.Substring(0, 3) == "UNB")) {
    //            goto SKIPUNB;
    //        }
            
    //        if ((MessageDetails.lLinesData(0).Length == 3)) {
    //            // There is no version number specified, check in the database if this is supported
    //            mMessageData = Bl.Bl_Listdb(("Select * from EDIMessage where StandardMessageIdentifier = \'" 
    //                            + (MessageDetails.lMessageType + "\' and MessageVersion = \',0,\'")));
    //            if ((mMessageData.Tables[0].Rows.Count == 0)) {
    //                // This message does not support NO versions, version number is mandatory
    //                mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 3, mProcName, mModuleName, "ENGLISH"));
    //                return false;
                    
    //            }
                
    //        }
    //        else {
    //            if ((Regex.IsMatch(MessageDetails.lLinesData(0), "^[A-Z]{3}/[0-9]{1,2}$") == false)) {
    //                // No seperator on the first line
    //                lParametersToPassToError = ("1;" + MessageDetails.lLinesData(0));
    //                mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 4, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                return false;
                    
    //            }
                
    //            MessageDetails.lMessageVersion = Regex.Match(MessageDetails.lLinesData(0), "[A-Z]{3}/(?\'versionnumber\'([0-9]*))").Groups["versionnumber"].Value;
    //        }
            
    //        // Read the messagestructure from DB
    //        // There is no version number specified, check in the database if this is supported
    //    SKIPUNB:
    //        DataSet ldsStructureInfo = new DataSet();
    //        if ((MessageDetails.lMessageType == "SSM")) {
    //            ldsStructureInfo = Bl.Bl_Listdb((@"Select  ( row_number() OVER (ORDER BY SEQNumber)) as    RowNumber,LineNumberInMessage, LineIdentifier, SEQNumber, RegExString,IsElementMandatory, IsMandatory, CarImpRefNo,DataGroupId, LineIdentifier, '1' as InternalGroupId,IsRepeatable, RepeatCount,MinRepeatCount,NextLineMessagREGEX,RepeatCarIMPId,CarImpAlphaNo,SeqOfGroupCountWithinElement,IsGroupMandatory, LinesIncluded, IncludedLinesMinCount, IncludedLinesMaxCount, IncludedLineRepeatCondition, IncludedLineMessagREGEX,IsThisImmediateChild,IsHorizontallyRepeted,GroupInfo FROM EDIMessageDetails WHERE (CharacterFormat = 'CRLF')  and FkMessageTypeId = (Select MessageId from EDIMessage where SubMessageIdentifier = '" 
    //                            + (MessageDetails.lMsgSubType + ("\' and StandardMessageIdentifier = \'" 
    //                            + (MessageDetails.lMessageType + ("\' and CharIndex(\'" + ("," 
    //                            + (MessageDetails.lMessageVersion + ",\',MessageVersion)>0) and rtrim(RegExString)<>\'\' ORDER BY SEQNumber"))))))));
    //            // LineNumberInMessage ASC,Datagroupid ASC, DataElementId ASC, InternalGroupId DESC")
    //        }
    //        else {
    //            ldsStructureInfo = Bl.Bl_Listdb((@"Select  ( row_number() OVER (ORDER BY SEQNumber)) as    RowNumber,LineNumberInMessage, LineIdentifier, SEQNumber, RegExString,IsElementMandatory, IsMandatory, CarImpRefNo,DataGroupId, LineIdentifier, '1' as InternalGroupId,IsRepeatable, RepeatCount,MinRepeatCount,NextLineMessagREGEX,RepeatCarIMPId,CarImpAlphaNo,SeqOfGroupCountWithinElement,IsGroupMandatory, LinesIncluded, IncludedLinesMinCount, IncludedLinesMaxCount, IncludedLineRepeatCondition, IncludedLineMessagREGEX,IsThisImmediateChild,IsHorizontallyRepeted,GroupInfo FROM EDIMessageDetails WHERE (CharacterFormat = 'CRLF')  and FkMessageTypeId = (Select MessageId from EDIMessage where  StandardMessageIdentifier = '" 
    //                            + (MessageDetails.lMessageType + ("\' and CharIndex(\'" + ("," 
    //                            + (MessageDetails.lMessageVersion + ",\',MessageVersion)>0) and rtrim(RegExString)<>\'\' ORDER BY SEQNumber"))))));
    //            // LineNumberInMessage ASC,Datagroupid ASC, DataElementId ASC, InternalGroupId DESC")
    //        }
            
    //        if ((ldsStructureInfo.Tables[0].Rows.Count == 0)) {
    //            // This message is not configured in the system and hence cannnot be supported
    //            lParametersToPassToError = "1";
    //            lParametersToPassToError = (lParametersToPassToError + (";" 
    //                        + (MessageDetails.lMessageType + (";" + MessageDetails.lMessageVersion))));
    //            mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 5, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //            goto ProcessedButWithErr;
    //        }
            
    //        if ((MessageDetails.lMessageType == "SSM")) {
    //            mMessageData = Bl.Bl_Listdb((@"Select CarImpRefNo,MessageDefinition, DataFoundText, '' as sucess,Regexstring, SEQNumber,CarImpAlphaNo ,LineNumberInMessage, DataGroupId,DataElementId,LineIdentifier, '1' as InternalGroupId,IsRepeatable, RepeatCount,MinRepeatCount,NextLineMessagREGEX,RepeatCarIMPId,SeqOfGroupCountWithinElement,IsGroupMandatory, LinesIncluded, IncludedLinesMinCount, IncludedLinesMaxCount, IncludedLineRepeatCondition, IncludedLineMessagREGEX,IsThisImmediateChild,DataFound FROM EDIMessageDetails where FkMessageTypeId = (Select MessageId from EDIMessage where SubMessageIdentifier = '" 
    //                            + (MessageDetails.lMsgSubType + ("\' and StandardMessageIdentifier = \'" 
    //                            + (MessageDetails.lMessageType + ("\' and CharIndex(\'" + ("," 
    //                            + (MessageDetails.lMessageVersion + ",\',MessageVersion)>0) ORDER BY SEQNumber"))))))));
    //            // LineNumberInMessage ASC, DataElementId ASC, InternalGroupId DESC")
    //        }
    //        else {
    //            mMessageData = Bl.Bl_Listdb((@"Select CarImpRefNo,MessageDefinition, DataFoundText, '' as sucess,Regexstring, SEQNumber,CarImpAlphaNo ,LineNumberInMessage, DataGroupId,DataElementId,LineIdentifier, '1' as InternalGroupId,IsRepeatable, RepeatCount,MinRepeatCount,NextLineMessagREGEX,RepeatCarIMPId,SeqOfGroupCountWithinElement,IsGroupMandatory, LinesIncluded, IncludedLinesMinCount, IncludedLinesMaxCount, IncludedLineRepeatCondition, IncludedLineMessagREGEX,IsThisImmediateChild,DataFound FROM EDIMessageDetails where FkMessageTypeId = (Select MessageId from EDIMessage where StandardMessageIdentifier = '" 
    //                            + (MessageDetails.lMessageType + ("\' and CharIndex(\'" + ("," 
    //                            + (MessageDetails.lMessageVersion + ",\',MessageVersion)>0) ORDER BY SEQNumber"))))));
    //            // LineNumberInMessage ASC, DataElementId ASC, InternalGroupId DESC")
    //        }
            
    //        // Compare Db with 
    //        DataRow lRow;
    //        int lMessageLineCnt = 0;
    //        int lDataBaselineCnt = 0;
    //        bool lMatch = false;
    //        GroupInfo[] lGroupInfo;
    //        object lGroupInfo;
    //        for (lDataBaselineCnt = 0; (lDataBaselineCnt 
    //                    <= (ldsStructureInfo.Tables[0].Rows.Count - 1)); lDataBaselineCnt++) {
    //            20;
    //            // With...
    //            if ((UBound(MessageDetails.lLinesData) < lMessageLineCnt)) {
    //                if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                    ("IsElementMandatory".ToString.Trim != "M");
    //                    // Or .Item("IsElementMandatory").ToString.Trim <> "C" Then
    //                    goto 10;
    //                }
    //                else {
    //                    lParametersToPassToError = lMessageLineCnt;
    //                    lParametersToPassToError = (lParametersToPassToError + (";" + ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item));
    //                    "CARIMPRefNo";
    //                    mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 9, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                    goto ProcessedButWithErr;
    //                }
                    
    //            }
                
    //            lMatch = Regex.IsMatch(MessageDetails.lLinesData(lMessageLineCnt), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "RegExString");
    //            Debug.Print(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, ("CarImpRefNo" + ("  " 
    //                            + (MessageDetails.lLinesData(lMessageLineCnt) + ("  -  " 
    //                            + (lDataBaselineCnt + ("  Match = " + lMatch)))))));
    //            if ((lMatch == false)) {
    //                if ((lGroupInfo.Count > 1)) {
    //                    // Group Exists 
    //                    // Check if the current record and last record in group are same.
    //                    if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                        "CarImpRefNo" = lGroupInfo[(lGroupInfo.Count - 1)].StartCARImp;
    //                        // lDataBaselineCnt = ldsStructureInfo.Tables(0).Select("SEQNumber = " & lGroupInfo(lGroupInfo.Count - 1).StartCARImp)(0).Item("RowNumber") - 1
    //                        if (((MessageDetails.lMessageType == "FFM") 
    //                                    && ((MessageDetails.lMessageVersion.ToString == "7") 
    //                                    || (MessageDetails.lMessageVersion.ToString == "8")))) {
    //                            if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                "CarImpRefNo" = "9.10";
    //                                object Preserve;
    //                                lGroupInfo[(lGroupInfo.Count - 2)];
    //                                goto 20;
    //                            }
                                
    //                            // Check if the next line is the group again, that means that there is a repeated group with the parent group hence do not start pointer at the parent group but the next group
    //                            int lNextGroupLine = ldsStructureInfo.Tables[0].Select(("CarImpRefNo = \'" 
    //                                            + (lGroupInfo[(lGroupInfo.Count - 1)].EndCARImp + "\'")))[0].Item["RowNumber"];
    //                            if (!IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lNextGroupLine).Item["GroupInfo"])) {
    //                                object Preserve;
    //                                lGroupInfo[(lGroupInfo.Count - 2)];
    //                                lDataBaselineCnt = lNextGroupLine;
    //                                goto 20;
    //                            }
    //                            else {
    //                                object Preserve;
    //                                lGroupInfo[(lGroupInfo.Count - 2)];
    //                                if ((lGroupInfo.Count > 1)) {
    //                                    lDataBaselineCnt = (ldsStructureInfo.Tables[0].Select(("CarImpRefNo = \'" 
    //                                                    + (lGroupInfo[(lGroupInfo.Count - 1)].StartCARImp + "\'")))[0].Item["RowNumber"] - 1);
    //                                }
                                    
    //                                goto 20;
    //                            }
                                
    //                        }
                            
    //                        // If lGroupInfo.Count > 1 Then
    //                        //     'Group Exists 
    //                        //     'Check if the current record and last record in group are same.
    //                        //     If .Item("CarImpRefNo") = lGroupInfo(lGroupInfo.Count - 1).StartCARImp Then
    //                        //         'lDataBaselineCnt = ldsStructureInfo.Tables(0).Select("SEQNumber = " & lGroupInfo(lGroupInfo.Count - 1).StartCARImp)(0).Item("RowNumber") - 1
    //                        //         ReDim Preserve lGroupInfo(lGroupInfo.Count - 2)
    //                        //         If lGroupInfo.Count > 1 Then lDataBaselineCnt = ldsStructureInfo.Tables(0).Select("CarImpRefNo = '" & lGroupInfo(lGroupInfo.Count - 1).StartCARImp & "'")(0).Item("RowNumber") - 1 : GoTo 20
    //                        //     End If
    //                        // End If
    //                    }
                        
    //                ElementaryStart:
    //                    switch (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                        case "IsElementMandatory".ToString.Trim:
    //                            break;
    //                        case "O":
    //                        case "C":
    //                            if ((lGroupInfo.Count > 1)) {
    //                                // Group Exists 
    //                                // Check if the current record and last record in group are same.
    //                                if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                    "CarImpRefNo" = lGroupInfo[(lGroupInfo.Count - 1)].EndCARImp;
    //                                    lDataBaselineCnt = (ldsStructureInfo.Tables[0].Select(("CarImpRefNo = \'" 
    //                                                    + (lGroupInfo[(lGroupInfo.Count - 1)].StartCARImp + "\'")))[0].Item["RowNumber"] - 1);
    //                                    // ReDim Preserve lGroupInfo(lGroupInfo.Count - 2)
    //                                    goto 20;
    //                                }
                                    
    //                            }
                                
    //                            // If this is the first element and the LINE is optional than you will need to go and check the next line
    //                            // goto next line
    //                            if (((UBound(MessageDetails.lLinesData) == lMessageLineCnt) 
    //                                        && (lDataBaselineCnt 
    //                                        == (ldsStructureInfo.Tables[0].Rows.Count - 1)))) {
    //                                // If this is the last statement and data is not found then raise an error
    //                            SkipLastLine:
    //                                lParametersToPassToError = (lMessageLineCnt + 1);
    //                                lParametersToPassToError = (lParametersToPassToError + (";" + MessageDetails.lLinesData(lMessageLineCnt)));
    //                                mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 6, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                goto ProcessedButWithErr;
    //                            }
                                
    //                            if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "SeqOfGroupCountWithinElement")) {
    //                                ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                            }
                                
    //                            "SeqOfGroupCountWithinElement" = 0;
    //                            if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                "SeqOfGroupCountWithinElement" = (1 | ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item);
    //                                "SeqOfGroupCountWithinElement" = 0;
    //                                // If the group starts with an optional line and that one  is missing then go to next line
    //                                // if AGT line is missing then goto next line of the database
    //                                // the 1 above means that this element is for first line only.
    //                                bool lLineFound = false;
    //                                do {
    //                                    "LineIdentifier";
    //                                    lDataBaselineCnt = (lDataBaselineCnt + 1);
    //                                    // CODE BY SHOYEB 15NOV16 TO CATER OPTIONAL LAST LINE
    //                                    if ((lDataBaselineCnt 
    //                                                > (ldsStructureInfo.Tables[0].Rows.Count - 1))) {
    //                                        goto SkipLastLine;
    //                                    }
                                        
    //                                    lLineFound = true;
    //                                } while ((ldsStructureInfo.Tables[0].Rows[lDataBaselineCnt].Item["LineIdentifier"] > ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item));
                                    
    //                                if ((lLineFound == true)) {
    //                                    lDataBaselineCnt = (lDataBaselineCnt - 1);
    //                                }
    //                                else {
    //                                    //  If the element is not first line then check the data group if that is mandatory
    //                                    if ((Trim(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IsGroupMandatory") == "M")) {
    //                                        lParametersToPassToError = (lMessageLineCnt + 1);
    //                                        lParametersToPassToError = (lParametersToPassToError + (";" + MessageDetails.lLinesData(lMessageLineCnt)));
    //                                        mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 7, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                        goto ProcessedButWithErr;
    //                                    }
                                        
    //                                }
                                    
    //                                "C";
    //                                if (((UBound(MessageDetails.lLinesData) == lMessageLineCnt) 
    //                                            && (lDataBaselineCnt 
    //                                            == (ldsStructureInfo.Tables[0].Rows.Count - 1)))) {
    //                                    // If this is the last statement and data is not found then raise an error
    //                                    lParametersToPassToError = (lMessageLineCnt + 1);
    //                                    lParametersToPassToError = (lParametersToPassToError + (";" + MessageDetails.lLinesData(lMessageLineCnt)));
    //                                    mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 6, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                    goto ProcessedButWithErr;
    //                                }
                                    
    //                                "M";
    //                                if ((lGroupInfo.Count > 1)) {
    //                                    // Group Exists 
    //                                    if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                        "CarImpRefNo" = lGroupInfo[(lGroupInfo.Count - 1)].EndCARImp;
    //                                        lDataBaselineCnt = (ldsStructureInfo.Tables[0].Select(("CarImpRefNo = \'" 
    //                                                        + (lGroupInfo[(lGroupInfo.Count - 1)].StartCARImp + "\'")))[0].Item["RowNumber"] - 1);
    //                                        lGroupInfo[(lGroupInfo.Count - 1)].CurrentGroupCycleCount = (lGroupInfo[(lGroupInfo.Count - 1)].CurrentGroupCycleCount + 1);
    //                                        // ReDim Preserve lGroupInfo(lGroupInfo.Count - 2)
    //                                        goto 20;
    //                                    }
                                        
    //                                    // 'Check if the current record and last record in group are same.
    //                                    // If .Item("CARIMPRefNo") = lGroupInfo(lGroupInfo.Count - 1).CARIMPRefNo Then
    //                                    //     'Its the first line which has failed
    //                                    //     If lGroupInfo(lGroupInfo.Count - 1).CurrentGroupCycleCount > 0 And lGroupInfo(lGroupInfo.Count - 1).CurrentGroupCycleCount > lGroupInfo(lGroupInfo.Count - 1).MaxGroupCount Then
    //                                    //         lDataBaselineCnt = ldsStructureInfo.Tables(0).Select("SEQNumber = " & lGroupInfo(lGroupInfo.Count - 1).StartCARImp)(0).Item("RowNumber") - 1
    //                                    //         GoTo 20
    //                                    //     End If
    //                                    // End If
    //                                }
                                    
    //                                if ((UBound(MessageDetails.lLinesData) == lMessageLineCnt)) {
    //                                    if ((MessageDetails.lMessageType == "FFM")) {
    //                                        if (((MessageDetails.lLinesData(lMessageLineCnt) == "LAST") 
    //                                                    || (MessageDetails.lLinesData(lMessageLineCnt) == "CONT"))) {
    //                                            lDataBaselineCnt = (ldsStructureInfo.Tables[0].Rows.Count - 1);
    //                                            goto 20;
    //                                        }
                                            
    //                                    }
                                        
    //                                }
                                    
    //                                string lExactIssueAt = "";
    //                                lExactIssueAt = IdentifyRegexFailureGroup(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "RegExString", MessageDetails.lLinesData(lMessageLineCnt));
    //                                if ((lExactIssueAt != "")) {
    //                                    lExactIssueAt = lExactIssueAt.Substring(0, ((lExactIssueAt.IndexOf("==", 0) + 1) 
    //                                                    - 1));
    //                                    if (lExactIssueAt.Contains("\'")) {
    //                                        lExactIssueAt = lExactIssueAt.Replace("\'", "\'\'");
    //                                    }
                                        
    //                                    lExactIssueAt = mMessageData.Tables[0].Select(("Regexstring =\'" 
    //                                                    + (lExactIssueAt + "\'")))[0].Item["MessageDefinition"];
    //                                }
                                    
    //                                lParametersToPassToError = (lMessageLineCnt + 1);
    //                                lParametersToPassToError = (lParametersToPassToError + (";" 
    //                                            + (MessageDetails.lLinesData(lMessageLineCnt) + ("  Possible issue at : " + lExactIssueAt))));
    //                                mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 7, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                // mProcessExecutionResult.Tables("ExecutionResult").ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 7, mProcName, mModuleName, "ENGLISH", lParametersToPassToError).ItemArray)
    //                                ParseMessageContent = false;
    //                                goto ProcessedButWithErr;
    //                            }
    //                            else {
                                    
    //                            }
                                
    //                            lMatch = true;
    //                            // lDataBaselineCnt = lDataBaselineCnt + 1
    //                            MessageDetails.lCarimpRefId(lMessageLineCnt) = ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                            "CarImpRefNo";
    //                            if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IsRepeatable")) {
    //                                ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                            }
                                
    //                            "IsRepeatable" = false;
    //                            if (!IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "GroupInfo")) {
    //                                if ((lGroupInfo.Count > 1)) {
    //                                    if ((lGroupInfo[(lGroupInfo.Count - 1)].StartCARImp != ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item)) {
    //                                        "CarImpRefNo";
    //                                        this.AddGroupInfo(lGroupInfo, ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "GroupInfo");
    //                                        this.AddRowsinTablesBasedOnGroup(lGroupInfo);
    //                                    }
    //                                    else {
    //                                        lGroupInfo[UBound(lGroupInfo)].CurrentGroupCycleCount = (lGroupInfo[UBound(lGroupInfo)].CurrentGroupCycleCount + 1);
    //                                        this.AddRowsinTablesBasedOnGroup(lGroupInfo);
    //                                    }
                                        
    //                                }
    //                                else {
    //                                    this.AddGroupInfo(lGroupInfo, ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "GroupInfo");
    //                                    this.AddRowsinTablesBasedOnGroup(lGroupInfo);
    //                                }
                                    
    //                            }
                                
    //                            if ((lGroupInfo.Count > 1)) {
    //                                if ((lGroupInfo[UBound(lGroupInfo)].CurrentGroupCycleCount >= 1)) {
    //                                    this.PopulateDatainGroupFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lMessageLineCnt), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "RegExString", lGroupInfo);
    //                                }
    //                                else {
    //                                    this.PopulateDatainGroupFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lMessageLineCnt), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "RegExString", lGroupInfo);
    //                                    // PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables(0).Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lMessageLineCnt), .Item("RegExString"), IIf(.Item("IsRepeatable") = True, 0, -1), .Item("IsRepeatable"))
    //                                }
                                    
    //                            }
    //                            else {
    //                                PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lMessageLineCnt), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "RegExString", IIf(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, ("IsRepeatable" == true), 0, -1), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IsRepeatable");
    //                            }
                                
    //                            lMessageLineCnt = (lMessageLineCnt + 1);
    //                            if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "LinesIncluded")) {
    //                                ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                            }
                                
    //                            "LinesIncluded" = false;
    //                            if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IsThisImmediateChild")) {
    //                                ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                            }
                                
    //                            "IsThisImmediateChild" = false;
    //                            int lCounterForIncludedDataCalled = 0;
    //                            int lTotalCounterOfIncludedRows = 0;
    //                            int lCntIncludedLinesMinGroupCount = 0;
    //                            int lCntIncludedLinesMaxGroupCount = 0;
    //                            if ((lGroupInfo.Count > 1)) {
    //                                // Group Exists 
    //                                if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                    "CarImpRefNo" = lGroupInfo[(lGroupInfo.Count - 1)].EndCARImp;
    //                                    lDataBaselineCnt = (ldsStructureInfo.Tables[0].Select(("CarImpRefNo = \'" 
    //                                                    + (lGroupInfo[(lGroupInfo.Count - 1)].StartCARImp + "\'")))[0].Item["RowNumber"] - 1);
    //                                    lGroupInfo[UBound(lGroupInfo)].CurrentGroupCycleCount = (lGroupInfo[UBound(lGroupInfo)].CurrentGroupCycleCount + 1);
    //                                    // ReDim Preserve lGroupInfo(lGroupInfo.Count - 2)
    //                                    goto 20;
    //                                }
                                    
    //                            }
                                
    //                            if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                "LinesIncluded" = true;
    //                            startIncludedLines:
    //                                if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IncludedLinesMinCount")) {
    //                                    ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                                }
                                    
    //                                "IncludedLinesMinCount" = "0";
    //                                lCntIncludedLinesMinGroupCount = int.Parse(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item)["IncludedLinesMinCount"];
    //                                lCntIncludedLinesMaxGroupCount = int.Parse(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item)["IncludedLinesMaxCount"];
    //                                int lInternalNextMessageLineID = lMessageLineCnt;
    //                                if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IncludedLineMessagREGEX")) {
    //                                    ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                                }
                                    
    //                                "IncludedLineMessagREGEX" = "  ";
    //                                for (lCnt = 0; (lCnt 
    //                                            <= (lCntIncludedLinesMaxGroupCount - 1)); lCnt++) {
    //                                    if (((UBound(MessageDetails.lLinesData) < lInternalNextMessageLineID) 
    //                                                && ((lCntIncludedLinesMinGroupCount > lCnt) 
    //                                                && (lCntIncludedLinesMinGroupCount != 0)))) {
    //                                        // If this is the last statement and data is not found then raise an error
    //                                        lParametersToPassToError = lInternalNextMessageLineID;
    //                                        lParametersToPassToError = (lParametersToPassToError + (";" + MessageDetails.lLinesData(lInternalNextMessageLineID)));
    //                                        mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 7, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                        ParseMessageContent = false;
    //                                        goto ProcessedButWithErr;
    //                                    }
                                        
    //                                    lMatch = Regex.IsMatch(MessageDetails.lLinesData(lInternalNextMessageLineID), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IncludedLineMessagREGEX");
    //                                    if ((lMatch == true)) {
    //                                        // AddRowsInTables(mMessageData, lDataBaselineCnt, .Item("RepeatCarIMPId"), .Item("DataGroupId"), -1)
    //                                        MessageDetails.lCarimpRefId(lInternalNextMessageLineID) = ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                                        "CarImpRefNo";
    //                                        if ((lCounterForIncludedDataCalled <= 0)) {
    //                                            PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lInternalNextMessageLineID), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IncludedLineMessagREGEX", lCounterForIncludedDataCalled, true, true);
    //                                        }
    //                                        else {
    //                                            PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lInternalNextMessageLineID), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IncludedLineMessagREGEX", lCounterForIncludedDataCalled, true, true, ,, (lCounterForIncludedDataCalled + 1));
    //                                        }
                                            
    //                                        lInternalNextMessageLineID = (lInternalNextMessageLineID + 1);
    //                                        lMessageLineCnt = lInternalNextMessageLineID;
    //                                        lTotalCounterOfIncludedRows = (lTotalCounterOfIncludedRows + 1);
    //                                    }
    //                                    else if (((lCntIncludedLinesMinGroupCount > lCnt) 
    //                                                && (lCntIncludedLinesMinGroupCount != 0))) {
    //                                        // This is an error that mandatory info is missing
    //                                    }
    //                                    else {
    //                                        // This is ok as optional data is not found
    //                                        // lMessageLineCnt = lInternalNextMessageLineID - 1
    //                                        // lDataBaselineCnt = lDataBaselineCnt - 1
    //                                        // lInternalNextMessageLineID = lInternalNextMessageLineID - 1
    //                                        break;
    //                                    }
                                        
    //                                }
                                    
    //                                // If lCntIncludedLinesMaxGroupCount < lTotalCounterOfIncludedRows Then MsgBox("here")
    //                            }
                                
    //                            if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                "IsRepeatable" = true;
    //                                if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "MinRepeatCount")) {
    //                                    ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                                }
                                    
    //                                "MinRepeatCount" = "0";
    //                                int lCntMinGroupCount = int.Parse(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item)["MinRepeatCount"];
    //                                int lCntMaxGroupCount = int.Parse(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item)["RepeatCount"];
    //                                if ((Regex.IsMatch(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item["NextLineMessagREGEX"].ToString, "^GOTOLINE(?\'LineNo\'[0-9]{1,3})$") == true)) {
    //                                    lDataBaselineCnt = ldsStructureInfo.Tables[0].Rows.IndexOf(ldsStructureInfo.Tables[0].Select(("SEQNumber = " + Regex.Match(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item["NextLineMessagREGEX"].ToString, "^GOTOLINE(?\'LineNo\'[0-9]{1,3})$").Groups["LineNo"].Value))[0]);
    //                                    goto 20;
    //                                }
                                    
    //                                // Is there are group in the next line then match the next line with the group regex
    //                                int lInternalNextMessageLineID = lMessageLineCnt;
    //                                if (IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "NextLineMessagREGEX")) {
    //                                    ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                                }
                                    
    //                                "NextLineMessagREGEX" = "  ";
    //                                for (lCnt = 0; (lCnt 
    //                                            <= (lCntMaxGroupCount - 1)); lCnt++) {
    //                                    if ((UBound(MessageDetails.lLinesData) < lInternalNextMessageLineID)) {
    //                                        if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                            "IsElementMandatory".ToString.Trim = ("O" | ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item);
    //                                            "IsElementMandatory".ToString.Trim = "C";
    //                                            goto 10;
    //                                        }
    //                                        else {
    //                                            lParametersToPassToError = lInternalNextMessageLineID;
    //                                            lParametersToPassToError = lParametersToPassToError;
    //                                            mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 8, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                            ParseMessageContent = false;
    //                                            goto ProcessedButWithErr;
    //                                        }
                                            
    //                                    }
                                        
    //                                    lMatch = Regex.IsMatch(MessageDetails.lLinesData(lInternalNextMessageLineID), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "NextLineMessagREGEX");
    //                                    Debug.Print(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "CarImpRefNo");
    //                                    if ((lMatch == true)) {
    //                                        // AddRowsInTables(mMessageData, lDataBaselineCnt, .Item("RepeatCarIMPId"), .Item("DataGroupId"), -1)
    //                                        MessageDetails.lCarimpRefId(lInternalNextMessageLineID) = ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item;
    //                                        "CarImpRefNo";
    //                                        if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                            "LinesIncluded" = true;
    //                                            lCounterForIncludedDataCalled = (lCounterForIncludedDataCalled + 1);
    //                                            if ((lTotalCounterOfIncludedRows >= lCntMaxGroupCount)) {
    //                                                lParametersToPassToError = lMessageLineCnt;
    //                                                lParametersToPassToError = (lParametersToPassToError + (";" + ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item["CarImpRefNo"]));
    //                                                mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 9, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                                ParseMessageContent = false;
    //                                                goto ProcessedButWithErr;
    //                                            }
                                                
    //                                            lTotalCounterOfIncludedRows = (lTotalCounterOfIncludedRows + 1);
    //                                            PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item((lDataBaselineCnt + 1)), MessageDetails.lLinesData(lInternalNextMessageLineID), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "NextLineMessagREGEX", IIf(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, ("LinesIncluded" == true), lCounterForIncludedDataCalled, (lCnt + 1)), false, IIf(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, ("LinesIncluded" == true), true, false));
    //                                        }
    //                                        else if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                            "IsThisImmediateChild" = true;
    //                                            PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lInternalNextMessageLineID), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "NextLineMessagREGEX", 3, false, false, true);
    //                                        }
    //                                        else {
    //                                            PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt), MessageDetails.lLinesData(lInternalNextMessageLineID), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "NextLineMessagREGEX", (lCnt + 1), false);
    //                                        }
                                            
    //                                        lInternalNextMessageLineID = (lInternalNextMessageLineID + 1);
    //                                        lMessageLineCnt = lInternalNextMessageLineID;
    //                                        if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                            "LinesIncluded" = true;
    //                                            goto startIncludedLines;
    //                                        }
                                            
    //                                    }
    //                                    else {
    //                                        if ((lGroupInfo.Count > 1)) {
    //                                            // Group Exists 
    //                                            // Check if the current record and last record in group are same.
    //                                            if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                                "CarImpRefNo" = lGroupInfo[(lGroupInfo.Count - 1)].EndCARImp;
    //                                                lDataBaselineCnt = (ldsStructureInfo.Tables[0].Select(("CarImpRefNo = \'" 
    //                                                                + (lGroupInfo[(lGroupInfo.Count - 1)].StartCARImp + "\'")))[0].Item["RowNumber"] - 1);
    //                                                // ReDim Preserve lGroupInfo(lGroupInfo.Count - 2)
    //                                                goto 20;
    //                                            }
                                                
    //                                        }
                                            
    //                                        if (((lCntMinGroupCount > lCnt) 
    //                                                    && (lCntMinGroupCount != 0))) {
    //                                            // This is an error that mandatory info is missing
    //                                        }
    //                                        else {
    //                                            // This is ok as optional data is not found
    //                                            if (ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item) {
    //                                                "LinesIncluded" = true;
    //                                                lDataBaselineCnt = (lDataBaselineCnt + 1);
    //                                                // lMessageLineCnt = lInternalNextMessageLineID - 1
    //                                                break;
    //                                            }
                                                
    //                                        }
                                            
    //                                    }
                                        
    //                                    if (!IsDBNull(ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IsHorizontallyRepeted")) {
    //                                        // If .Item("IsHorizontallyRepeted") = True Then
    //                                        //     Dim lMatchCollection As MatchCollection
    //                                        //     lMatchCollection = Regex.Matches(MessageDetails.lLinesData(lMessageLineCnt - 1), .Item("RegExString"))
    //                                        // End If
    //                                        PopulateDataFromMessageIntoDataset(ldsStructureInfo.Tables[0].Rows.Item((lDataBaselineCnt - 1)), MessageDetails.lLinesData((lMessageLineCnt - 1)), ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "RegExString", 2, ldsStructureInfo.Tables[0].Rows.Item(lDataBaselineCnt).Item, "IsRepeatable");
    //                                        // AddRowsInTables(mMessageData, .Item("LineIdentifier"), .Item("DataGroupId"), 2)
    //                                    }
                                        
    //                                    // With...
    //                                    if ((lMessageLineCnt 
    //                                                < (UBound(MessageDetails.lLinesData) + 1))) {
    //                                        // meaning not all the lines were processed
    //                                        lParametersToPassToError = lMessageLineCnt;
    //                                        lParametersToPassToError = (lParametersToPassToError + (";" + MessageDetails.lLinesData(lMessageLineCnt)));
    //                                        mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 6, mProcName, mModuleName, "ENGLISH", lParametersToPassToError));
    //                                        ParseMessageContent = false;
    //                                        goto ProcessedButWithErr;
    //                                        MsgBox(("No correspoding data found for :" + MessageDetails.lLinesData(lMessageLineCnt)));
    //                                        goto ProcessedButWithErr;
    //                                    }
                                        
    //                                    return true;
                                        
    //                                ProcessedButWithErr:
    //                                    return false;
                                        
    //                                ErrFound:
    //                                    ((Exception)(EX));
    //                                    mProcessExecutionResult.Tables["ExecutionResult"].ImportRow(Bl.RegisterError(mModuleIDandReturnCode, 10, mProcName, mModuleName, "ENGLISH"));
    //                                    // Throw EX
    //                                    ((bool)(PopulateDataFromMessageIntoDataset(ref ((DataRow)(vCurrentRow)), ((string)(vStringToMatch)), ((string)(vRegExString)), Optional, vInternalGroupIdWillAddrowsAsInteger=-1, Optional, vIsthisFirstRowOfAGroupAsBoolean=False, Optional, vBasedOnLineNumberInMessageOnlyAsBoolean=False, Optional, vAddOnlySingleGroupsAsBoolean=False, Optional, vStartProcessFromNextInternalGroupIdAsSingle=-1)));
    //                                    // vStartProcessFromNextInternalGroupId is added on July 01 10 as we needed to start RTD line to start on the next line
    //                                    Match lMatch = Regex.Match(vStringToMatch, vRegExString);
    //                                    int lCnt;
    //                                    bool lGroupFound = false;
    //                                    int lGroupLineIdentifier = 0;
    //                                    int lGroupInternalGroupId = 0;
    //                                    int lNoOfRowsToBeAdded = 0;
    //                                    int lTotalRowsAddedForGroup = 0;
    //                                    int lInternalGroupId = 0;
    //                                    int lMatchId = -1;
    //                                    bool lIsAnyDataPopulated = false;
    //                                    for (lCnt = 0; (lCnt <= mMessageData.Tables[0].Rows.Count); lCnt++) {
    //                                        if ((mMessageData.Tables[0].Rows[lCnt].Item["CarImpRefNo"].ToString == vCurrentRow.Item["CarImpRefNo"].ToString)) {
    //                                            if ((vStartProcessFromNextInternalGroupId != -1)) {
    //                                                if ((mMessageData.Tables[0].Rows[lCnt].Item["InternalGroupId"].ToString == vStartProcessFromNextInternalGroupId)) {
    //                                                    break;
    //                                                }
                                                    
    //                                            }
    //                                            else {
    //                                                break;
    //                                            }
                                                
    //                                        }
                                            
    //                                    }
                                        
    //                                    if ((vBasedOnLineNumberInMessageOnly == true)) {
    //                                        //     lCnt = lCnt + 1
    //                                        // There is no group to be added
    //                                        while (!(lCnt == 0)) {
    //                                            if ((mMessageData.Tables[0].Rows[lCnt].Item["LineIdentifier"].ToString != vCurrentRow.Item["LineIdentifier"].ToString)) {
    //                                                // lCnt = lCnt + 1
    //                                                if ((vBasedOnLineNumberInMessageOnly == true)) {
    //                                                    lCnt = (lCnt + 1);
    //                                                }
                                                    
    //                                                lCnt = (lCnt + ( (vInternalGroupIdWillAddrows < 0) ? 0 : ((vInternalGroupIdWillAddrows * lNoOfRowsToBeAdded) 
    //                                                            + ( (vInternalGroupIdWillAddrows == 0) ? 0 : -1 )) ));
    //                                                break; //Warning!!! Review that break works as 'Exit Do' as it could be in a nested instruction like switch
    //                                            }
                                                
    //                                            lCnt = (lCnt - 1);
    //                                            lNoOfRowsToBeAdded = (lNoOfRowsToBeAdded + 1);
    //                                        }
                                            
    //                                    }
    //                                    else if ((vAddOnlySingleGroups == true)) {
    //                                        lCnt = (lCnt - 1);
    //                                    }
    //                                    else if ((vInternalGroupIdWillAddrows <= 0)) {
    //                                        // There is no group to be added
    //                                        while (!(lCnt == 0)) {
    //                                            if ((mMessageData.Tables[0].Rows[lCnt].Item["LineNumberInMessage"].ToString != vCurrentRow.Item["LineNumberInMessage"].ToString)) {
    //                                                lCnt = (lCnt + 1);
    //                                                if ((vBasedOnLineNumberInMessageOnly == true)) {
    //                                                    lCnt = (lCnt + 1);
    //                                                }
                                                    
    //                                                break; //Warning!!! Review that break works as 'Exit Do' as it could be in a nested instruction like switch
    //                                            }
                                                
    //                                            lCnt = (lCnt - 1);
    //                                            lNoOfRowsToBeAdded = (lNoOfRowsToBeAdded + 1);
    //                                        }
                                            
    //                                    }
    //                                    else {
    //                                        while (!(lCnt == 0)) {
    //                                            if ((mMessageData.Tables[0].Rows[lCnt].Item["DataGroupId"].ToString != vCurrentRow.Item["DataGroupId"].ToString)) {
    //                                                lCnt = (lCnt + 2);
    //                                                break; //Warning!!! Review that break works as 'Exit Do' as it could be in a nested instruction like switch
    //                                            }
                                                
    //                                            lCnt = (lCnt - 1);
    //                                            lNoOfRowsToBeAdded = (lNoOfRowsToBeAdded + 1);
    //                                        }
                                            
    //                                    }
                                        
    //                                    int lMsgRow;
    //                                    10;
    //                                    for (lMsgRow = lCnt; (lMsgRow 
    //                                                <= (mMessageData.Tables[0].Rows.Count - 1)); lMsgRow++) {
    //                                        if ((vBasedOnLineNumberInMessageOnly == true)) {
    //                                            if ((mMessageData.Tables[0].Rows[lMsgRow].Item["LineIdentifier"].ToString != vCurrentRow.Item["LineIdentifier"].ToString)) {
    //                                                if ((lIsAnyDataPopulated == true)) {
    //                                                    mMessageData.Tables[0].Rows[(lMsgRow - 1)].Item["DataFound"] = "True";
    //                                                }
                                                    
    //                                                goto Complete;
    //                                            }
                                                
    //                                        }
    //                                        else if ((mMessageData.Tables[0].Rows[lMsgRow].Item["LineNumberInMessage"].ToString != vCurrentRow.Item["LineNumberInMessage"].ToString)) {
    //                                            if ((lIsAnyDataPopulated == true)) {
    //                                                mMessageData.Tables[0].Rows[(lMsgRow - 1)].Item["DataFound"] = "True";
    //                                            }
                                                
    //                                            goto Complete;
    //                                        }
                                            
    //                                        int lTotalGroupCount = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Captures.Count;
    //                                        if (((lTotalGroupCount > 1) 
    //                                                    || ((lGroupFound == true) 
    //                                                    && ((lGroupLineIdentifier == mMessageData.Tables[0].Rows[lMsgRow].Item["LineIdentifier"]) 
    //                                                    && (lGroupInternalGroupId == mMessageData.Tables[0].Rows[lMsgRow].Item["DataGroupId"]))))) {
    //                                            DataRow[] lDsLocalGroupDataRow = mMessageData.Tables[0].Select(("LineIdentifier = " 
    //                                                            + (mMessageData.Tables[0].Rows[lMsgRow].Item["LineIdentifier"] + (" and DataGroupId = " + mMessageData.Tables[0].Rows[lMsgRow].Item["DataGroupId"]))));
    //                                            if ((lGroupFound == false)) {
    //                                                if ((vAddOnlySingleGroups == true)) {
    //                                                    lTotalRowsAddedForGroup = AddRowsInTables(mMessageData, lMsgRow, mMessageData.Tables[0].Rows[lMsgRow].Item["DataGroupId"], lTotalGroupCount, ,, ,, true);
    //                                                    lTotalRowsAddedForGroup = (lTotalRowsAddedForGroup + 1);
    //                                                    lMsgRow = (lMsgRow + 1);
    //                                                    lInternalGroupId = (lInternalGroupId + 1);
    //                                                    lMatchId = -1;
    //                                                }
    //                                                else {
    //                                                    // lMsgRow = lDsLocalGroupDataRow(0).Item("SEQNumber")
    //                                                    AddRowsInTables(mMessageData, (lMsgRow + 1), mMessageData.Tables[0].Rows[lMsgRow].Item["DataGroupId"], (lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Captures.Count - 2));
    //                                                }
                                                    
    //                                                // AddRowsInTables(mMessageData, lMsgRow + 1, mMessageData.Tables(0).Rows(lMsgRow).Item("CarImpAlphaNo"), mMessageData.Tables(0).Rows(lMsgRow).Item("DataGroupId"), lMatch.Groups(mMessageData.Tables(0).Rows(lMsgRow).Item("CarImpAlphaNo")).Captures.Count - 2)
    //                                                // find the number of attibutes in this group
    //                                                // find if all attributes have the same number count as the parent
    //                                                // This change is to accomodate RTG/FNCTP/BOM/HYDTT where /BOM/HYDTT are part of group but the Carrier is optional. The groups collection just gives count 0 for TT and and application treats it as as first group
    //                                                int lParentGroupCount = lMatch.Groups[lDsLocalGroupDataRow[0].Item["CarImpAlphaNo"]].captures.count;
    //                                                foreach (DataRow lDatarow in lDsLocalGroupDataRow) {
    //                                                    if ((lMatch.Groups[lDatarow.Item["CarImpAlphaNo"]].captures.count != lParentGroupCount)) {
    //                                                        // mMessageData.Tables(0).Rows.
    //                                                        int lStartLocOfTextWithinGroup = 0;
    //                                                        int lLengthOfOptionalField = 0;
    //                                                        for (int lLoopStartCount = 1; (lLoopStartCount <= UBound(lDsLocalGroupDataRow)); lLoopStartCount++) {
    //                                                            if ((lDatarow.Item["CarImpAlphaNo"] == lDsLocalGroupDataRow[lLoopStartCount].Item["CarImpAlphaNo"])) {
    //                                                                lLengthOfOptionalField = lMatch.Groups[lDsLocalGroupDataRow[lLoopStartCount].Item["CarImpAlphaNo"]].length;
    //                                                            }
                                                                
    //                                                            break;
    //                                                            lStartLocOfTextWithinGroup = (lStartLocOfTextWithinGroup + lMatch.Groups[lDsLocalGroupDataRow[lLoopStartCount].Item["CarImpAlphaNo"]].length);
    //                                                        }
                                                            
    //                                                        if ((lStartLocOfTextWithinGroup == 0)) {
    //                                                            lStartLocOfTextWithinGroup = 1;
    //                                                        }
                                                            
    //                                                        for (int lLoopStartCount = 0; (lLoopStartCount 
    //                                                                    <= (lMatch.Groups[lDsLocalGroupDataRow[0].Item["CarImpAlphaNo"]].captures.count - 1)); lLoopStartCount++) {
    //                                                            if ((lMatch.Groups[lDsLocalGroupDataRow[0].Item["CarImpAlphaNo"]].captures(lLoopStartCount).value.ToString.Length 
    //                                                                        >= (lStartLocOfTextWithinGroup + lLengthOfOptionalField))) {
    //                                                                mMessageData.Tables[0].Rows[((lMsgRow - 1) 
    //                                                                            + ((lLoopStartCount + 1) 
    //                                                                            * (UBound(lDsLocalGroupDataRow) + 1)))].Item["DataFoundText"] = lMatch.Groups[lDsLocalGroupDataRow[0].Item["CarImpAlphaNo"]].captures(lLoopStartCount).value.ToString.Substring(lStartLocOfTextWithinGroup, lLengthOfOptionalField);
    //                                                                mMessageData.Tables[0].Rows[((lMsgRow - 1) 
    //                                                                            + ((lLoopStartCount + 1) 
    //                                                                            * (UBound(lDsLocalGroupDataRow) + 1)))].Item["DataFound"] = "True";
    //                                                                lIsAnyDataPopulated = true;
    //                                                            }
    //                                                            else {
    //                                                                mMessageData.Tables[0].Rows[((lMsgRow - 1) 
    //                                                                            + ((lLoopStartCount + 1) 
    //                                                                            * (UBound(lDsLocalGroupDataRow) + 1)))].Item["DataFoundText"] = "";
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        // The below loop is for managing issues like repeating group views with a parent key not repeating
    //                                                        // Meaning that the group is repeated and along with it one of the parent key needs to be repeated as well
    //                                                        //  for example Other charges has repeating Other Charge codes but we need to have the P/C indicator also repeated for each group
    //                                                        // OTH/C/AWC25.00LAC5.50CHC12.00
    //                                                        // /P/AWC25.00LAC5.50CHC12.00
    //                                                        //  For lCnt = lMsgRow To lMsgRow + (7 * lParentGroupCount)
    //                                                        for (lCnt = lMsgRow; (lCnt 
    //                                                                    <= (lMsgRow 
    //                                                                    + (lDsLocalGroupDataRow.Length * lParentGroupCount))); lCnt++) {
    //                                                            if ((mMessageData.Tables[0].Rows[lCnt].Item["CarImpAlphaNo"] == lDatarow.Item["CarImpAlphaNo"])) {
    //                                                                if ((lMatch.Groups[lDatarow.Item["CarImpAlphaNo"]].captures(0).ToString != "")) {
    //                                                                    mMessageData.Tables[0].Rows[lCnt].Item["DataFoundText"] = lMatch.Groups[lDatarow.Item["CarImpAlphaNo"]].captures(0).ToString;
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        break;
    //                                                    }
                                                        
    //                                                }
                                                    
    //                                                lGroupLineIdentifier = mMessageData.Tables[0].Rows[lMsgRow].Item["LineIdentifier"];
    //                                                lGroupInternalGroupId = mMessageData.Tables[0].Rows[lMsgRow].Item["DataGroupId"];
    //                                                lGroupFound = true;
    //                                            }
                                                
    //                                            // If mMessageData.Tables(0).Rows(lMsgRow).Item("InternalGroupId") = "" Then mMessageData.Tables(0).Rows(lMsgRow).Item("InternalGroupId") = 0
    //                                            if ((vAddOnlySingleGroups == false)) {
    //                                                // Problem
    //                                                if ((lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].captures.count 
    //                                                            > (mMessageData.Tables[0].Rows[lMsgRow].Item["InternalGroupId"] - 1))) {
    //                                                    if (IsDBNull(mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"])) {
    //                                                        mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].captures((mMessageData.Tables[0].Rows[lMsgRow].Item["InternalGroupId"] - 1)).value;
    //                                                        mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                                        lIsAnyDataPopulated = true;
    //                                                    }
    //                                                    else {
    //                                                        if ((mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] == "~RAHIM~")) {
    //                                                            mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].captures((mMessageData.Tables[0].Rows[lMsgRow].Item["InternalGroupId"] - 1)).value;
    //                                                            mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                                            lIsAnyDataPopulated = true;
    //                                                        }
                                                            
    //                                                        // If mMessageData.Tables(0).Rows(lMsgRow).Item("DataFoundText") <> "MSGDataNotFoundInGroup" Then mMessageData.Tables(0).Rows(lMsgRow).Item("DataFoundText") = lMatch.Groups(mMessageData.Tables(0).Rows(lMsgRow).Item("CarImpAlphaNo")).captures(mMessageData.Tables(0).Rows(lMsgRow).Item("InternalGroupId") - 1).value
    //                                                    }
                                                        
    //                                                }
                                                    
    //                                            }
    //                                            else if ((vAddOnlySingleGroups == true)) {
    //                                                if ((mMessageData.Tables[0].Rows[lMsgRow].Item["InternalGroupId"] != lInternalGroupId)) {
    //                                                    lMatchId = (lMatchId + 1);
    //                                                    lInternalGroupId = mMessageData.Tables[0].Rows[lMsgRow].Item["InternalGroupId"];
    //                                                }
                                                    
    //                                                if (IsDBNull(mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"])) {
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].captures(lMatchId).value;
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                                    lIsAnyDataPopulated = true;
    //                                                }
    //                                                else {
    //                                                    if ((mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] == "~RAHIM~")) {
    //                                                        mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].captures(lMatchId).value;
    //                                                        mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                                        lIsAnyDataPopulated = true;
    //                                                    }
                                                        
    //                                                    // If mMessageData.Tables(0).Rows(lMsgRow).Item("DataFoundText") <> "MSGDataNotFoundInGroup" Then mMessageData.Tables(0).Rows(lMsgRow).Item("DataFoundText") = lMatch.Groups(mMessageData.Tables(0).Rows(lMsgRow).Item("CarImpAlphaNo")).captures(mMessageData.Tables(0).Rows(lMsgRow).Item("InternalGroupId") - 1).value
    //                                                }
                                                    
    //                                                // lMsgRow = lMsgRow + 1
    //                                            }
                                                
    //                                        }
    //                                        else if ((((vIsthisFirstRowOfAGroup == true) 
    //                                                    && (vInternalGroupIdWillAddrows == -1)) 
    //                                                    || ((vIsthisFirstRowOfAGroup == false) 
    //                                                    && (vInternalGroupIdWillAddrows > -1)))) {
    //                                            int lMaxGroupCountWithinRegex;
    //                                            for (xcnt = 0; (xcnt <= lMatch.Groups.Count); xcnt++) {
    //                                                if ((lMaxGroupCountWithinRegex < lMatch.Groups[xcnt].Captures.Count)) {
    //                                                    lMaxGroupCountWithinRegex = lMatch.Groups[xcnt].Captures.Count;
    //                                                }
                                                    
    //                                            }
                                                
    //                                            // lMaxGroupCountWithinRegex = lMaxGroupCountWithinRegex - 1
    //                                            if ((lGroupFound == false)) {
    //                                                if ((vBasedOnLineNumberInMessageOnly == true)) {
    //                                                    int TempVal = (AddRowsInTables(mMessageData, lMsgRow, vCurrentRow.Item["DataGroupId"], 0, vInternalGroupIdWillAddrows, vIsthisFirstRowOfAGroup, vBasedOnLineNumberInMessageOnly, vBasedOnLineNumberInMessageOnly, vAddOnlySingleGroups) * vInternalGroupIdWillAddrows);
    //                                                }
    //                                                else if ((vAddOnlySingleGroups == true)) {
    //                                                    int TempVal = (AddRowsInTables(mMessageData, lMsgRow, vCurrentRow.Item["DataGroupId"], lMaxGroupCountWithinRegex, vInternalGroupIdWillAddrows, vIsthisFirstRowOfAGroup, vBasedOnLineNumberInMessageOnly, vBasedOnLineNumberInMessageOnly, vAddOnlySingleGroups) * vInternalGroupIdWillAddrows);
    //                                                    if ((lMaxGroupCountWithinRegex > 0)) {
    //                                                        lMsgRow = (lMsgRow + 1);
    //                                                        // TempVal/lMaxGroupCountWithinRegex 
    //                                                    }
                                                        
    //                                                }
    //                                                else {
    //                                                    int TempVal = (AddRowsInTables(mMessageData, lMsgRow, vCurrentRow.Item["DataGroupId"], 0, vInternalGroupIdWillAddrows, vIsthisFirstRowOfAGroup, vBasedOnLineNumberInMessageOnly, vBasedOnLineNumberInMessageOnly, vAddOnlySingleGroups) * vInternalGroupIdWillAddrows);
    //                                                    lMsgRow = (lMsgRow 
    //                                                                + (TempVal - 1));
    //                                                }
                                                    
    //                                                lGroupFound = true;
    //                                            }
                                                
    //                                            mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Value;
    //                                            mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                            lIsAnyDataPopulated = true;
    //                                        }
    //                                        else {
    //                                            // No Group information 
    //                                            lGroupFound = false;
    //                                            if (IsDBNull(mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"])) {
    //                                                if ((lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Value != "")) {
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Value;
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                                    lIsAnyDataPopulated = true;
    //                                                }
                                                    
    //                                            }
    //                                            else if ((mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] == "~RAHIM~")) {
    //                                                if ((lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Value != "")) {
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Value;
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                                    lIsAnyDataPopulated = true;
    //                                                }
                                                    
    //                                                // mMessageData.Tables(0).Rows(lMsgRow).Item("DataFoundText") = lMatch.Groups(mMessageData.Tables(0).Rows(lMsgRow).Item("CarImpAlphaNo")).Value
    //                                            }
    //                                            else {
    //                                                if ((lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Value != "")) {
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFoundText"] = lMatch.Groups[mMessageData.Tables[0].Rows[lMsgRow].Item["CarImpAlphaNo"]].Value;
    //                                                    mMessageData.Tables[0].Rows[lMsgRow].Item["DataFound"] = "True";
    //                                                    lIsAnyDataPopulated = true;
    //                                                }
                                                    
    //                                                // mMessageData.Tables(0).Rows(lMsgRow).Item("DataFoundText") = lMatch.Groups(mMessageData.Tables(0).Rows(lMsgRow).Item("CarImpAlphaNo")).Value
    //                                            }
                                                
    //                                            lGroupLineIdentifier = 0;
    //                                            lGroupInternalGroupId = 0;
    //                                        }
                                            
    //                                    }
                                        
    //                                    if ((lMsgRow 
    //                                                < (mMessageData.Tables[0].Rows.Count - 1))) {
    //                                        lCnt = lMsgRow;
    //                                    }
                                        
    //                                    goto 10;
    //                                Complete:
                                    
    //                                    ((int)(AddRowsInTables(ref ((DataSet)(lMessageData)), ((int)(lPositionTOAddRow)), ((int)(lDataGroupId)), ((int)(lCountOfRowsToAdd)), Optional, vNoOfGroupFromNextLineAddedAsInteger=-1, Optional, vIsThisFirstLineOfARepetableGroupAsBoolean=False, Optional, vBasedOnLineNumberInMessageAsBoolean=False, Optional, vBasedOnLineNumberInMessageOnlyAsBoolean=False, Optional, vAddASingleGroupOnlyAsBoolean=False)));
    //                                    string lFilterText = "";
    //                                    DataRow[] lDataRow;
    //                                    if ((vBasedOnLineNumberInMessage == true)) {
    //                                        lFilterText = ("LineIdentifier = " + lMessageData.Tables[0].Rows[lPositionTOAddRow].Item["LineIdentifier"]);
    //                                        if (((vNoOfGroupFromNextLineAdded != -1) 
    //                                                    && (vNoOfGroupFromNextLineAdded > 1))) {
    //                                            lFilterText = (lFilterText + " and InternalGroupId = \'1\'");
    //                                        }
                                            
    //                                        lDataRow = lMessageData.Tables[0].Select(lFilterText);
    //                                    }
    //                                    else {
    //                                        lFilterText = ("LineNumberInMessage = " 
    //                                                    + (lMessageData.Tables[0].Rows[lPositionTOAddRow].Item["LineNumberInMessage"] + (" and DataGroupId = " + lMessageData.Tables[0].Rows[lPositionTOAddRow].Item["DataGroupId"])));
    //                                        if (((vAddASingleGroupOnly == true) 
    //                                                    || ((vNoOfGroupFromNextLineAdded != -1) 
    //                                                    && (vNoOfGroupFromNextLineAdded > 1)))) {
    //                                            lFilterText = (lFilterText + " and InternalGroupId = \'1\'");
    //                                        }
                                            
    //                                        lDataRow = lMessageData.Tables[0].Select(lFilterText, "InternalGroupId");
    //                                    }
                                        
    //                                    int lInternalCounter = 0;
    //                                    bool lInternal = false;
    //                                    if ((vBasedOnLineNumberInMessageOnly == true)) {
    //                                        lPositionTOAddRow = (lPositionTOAddRow + 1);
    //                                        if ((vNoOfGroupFromNextLineAdded > 1)) {
    //                                            lInternal = true;
    //                                        }
    //                                        else if ((vAddASingleGroupOnly == true)) {
    //                                            vNoOfGroupFromNextLineAdded = lMessageData.Tables[0].Rows[lPositionTOAddRow].Item["InternalGroupId"];
    //                                            lPositionTOAddRow = (lPositionTOAddRow + 1);
    //                                            lCountOfRowsToAdd = (lCountOfRowsToAdd - 1);
    //                                            lInternal = true;
    //                                        }
    //                                        else if (((vNoOfGroupFromNextLineAdded != -1) 
    //                                                    && (vNoOfGroupFromNextLineAdded > 1))) {
    //                                            lPositionTOAddRow = (lPositionTOAddRow 
    //                                                        + (((UBound(lDataRow) + 1) 
    //                                                        * vNoOfGroupFromNextLineAdded) 
    //                                                        - 1));
    //                                            if ((vNoOfGroupFromNextLineAdded > 1)) {
    //                                                lInternal = true;
    //                                            }
    //                                            else {
    //                                                lPositionTOAddRow = (lPositionTOAddRow + UBound(lDataRow));
    //                                            }
                                                
    //                                            if ((lCountOfRowsToAdd <= 0)) {
    //                                                lCountOfRowsToAdd = 0;
    //                                            }
                                                
    //                                            int lCnt;
    //                                            for (lInternalCounter = 0; (lInternalCounter <= lCountOfRowsToAdd); lInternalCounter++) {
    //                                                for (lCnt = 0; (lCnt <= UBound(lDataRow)); lCnt++) {
    //                                                    lMessageData.Tables[0].Rows.InsertAt(lMessageData.Tables[0].NewRow, lPositionTOAddRow);
    //                                                    foreach (DataColumn lColumn in lMessageData.Tables[0].Columns) {
    //                                                        if ((lColumn.ColumnName != "DataFoundText")) {
    //                                                            lMessageData.Tables[0].Rows[lPositionTOAddRow].Item[lColumn.ColumnName] = lDataRow[lCnt].Item[lColumn.ColumnName];
    //                                                        }
    //                                                        else {
    //                                                            lMessageData.Tables[0].Rows[lPositionTOAddRow].Item[lColumn.ColumnName] = "~RAHIM~";
    //                                                        }
                                                            
    //                                                    }
                                                        
    //                                                    if (((lInternal == false) 
    //                                                                || (vIsThisFirstLineOfARepetableGroup == true))) {
    //                                                        lMessageData.Tables[0].Rows[(lPositionTOAddRow 
    //                                                                    - (UBound(lDataRow) - 1))].Item["InternalGroupId"] = 1;
    //                                                    }
                                                        
    //                                                    if (((vNoOfGroupFromNextLineAdded < 1) 
    //                                                                || (vNoOfGroupFromNextLineAdded == -1))) {
    //                                                        lMessageData.Tables[0].Rows[lPositionTOAddRow].Item["InternalGroupId"] = (lInternalCounter + 2);
    //                                                    }
    //                                                    else {
    //                                                        lMessageData.Tables[0].Rows[lPositionTOAddRow].Item["InternalGroupId"] = (vNoOfGroupFromNextLineAdded + 1);
    //                                                    }
                                                        
    //                                                    lPositionTOAddRow = (lPositionTOAddRow + 1);
    //                                                }
                                                    
    //                                                if ((vAddASingleGroupOnly == true)) {
    //                                                    vNoOfGroupFromNextLineAdded = (vNoOfGroupFromNextLineAdded + 1);
    //                                                }
                                                    
    //                                                lInternal = true;
    //                                            }
                                                
    //                                            long lSeqNumber = 1;
    //                                            // mMessageData.Tables(0).Rows(0).Item("SeqNumber")
    //                                            for (lCnt = 0; (lCnt 
    //                                                        <= (mMessageData.Tables[0].Rows.Count - 1)); lCnt++) {
    //                                                mMessageData.Tables[0].Rows[lCnt].Item["SeqNumber"] = lSeqNumber;
    //                                                lSeqNumber = (lSeqNumber + 1);
    //                                            }
                                                
    //                                            AddRowsInTables = (UBound(lDataRow) + 1);
    //                                        }
                                            
                                         
    //                                        ((bool)(ConvertTextMessageToDBFormat()));
    //                                        int lCnt;
    //                                        string lSQLString = "";
    //                                        string lCurrentLineNumber = "";
    //                                        string lInternalGroupId = "";
    //                                        mOutPutDataSet = new DataSet();
    //                                        DataTable ldatatable;
    //                                        DataTable lRegistryDT = Bl.Bl_Listdb("Select * from System_Registry where Registry_Name=\'EDIMSGSOURCEDB\' ").Tables[0].Copy();
    //                                        DataSet lMessageLinkDataSet;
    //                                        if ((lRegistryDT.Rows.Count > 0)) {
    //                                            if ((lRegistryDT.Rows[0].Item["Registry_Data_Value"] == "CF")) {
    //                                                if ((MessageDetails.lMessageType == "SSM")) {
    //                                                    lMessageLinkDataSet = Bl.Bl_Listdb(("SELECT CargoFlashCommaSeparatedEntityName FROM EDIMessage WHERE (MessageVersion like \'%," 
    //                                                                    + (MessageDetails.lMessageVersion + (",%\' and SubMessageIdentifier = \'" 
    //                                                                    + (MessageDetails.lMsgSubType + ("\' and StandardMessageIdentifier = \'" 
    //                                                                    + (MessageDetails.lMessageType + "\')")))))));
    //                                                }
    //                                                else {
    //                                                    lMessageLinkDataSet = Bl.Bl_Listdb(("SELECT CargoFlashCommaSeparatedEntityName FROM EDIMessage WHERE (MessageVersion like \'%," 
    //                                                                    + (MessageDetails.lMessageVersion + (",%\' and StandardMessageIdentifier = \'" 
    //                                                                    + (MessageDetails.lMessageType + "\')")))));
    //                                                }
                                                    
    //                                                string[] lArr = lMessageLinkDataSet.Tables[0].Rows[0].Item["CargoFlashCommaSeparatedEntityName"].ToString.Split(",");
    //                                                string[,] lArrToSQl;
    //                                                for (x = 0; (x 
    //                                                            <= (lArr.Length - 1)); x++) {
    //                                                    if ((lArr[0] != "")) {
    //                                                        object Preserve;
    //                                                    }
                                                        
    //                                                    lArr[UBound(lArr)];
    //                                                    if ((lArrToSQl[0] != "")) {
    //                                                        object Preserve;
    //                                                    }
                                                        
    //                                                    lArrToSQl[UBound(lArrToSQl)];
    //                                                    //  Dim lstr As String = "Select * From "
    //                                                    // lArrToSQl(x) = lstr & lArr(x).ToString & " where 1=2"
    //                                                    lArrToSQl[x] = ("Select * from " 
    //                                                                + (( (lArr[x] == "Airwaybill_Flight_Temp") ? "AirwayBill_Routing as Airwaybill_Flight_Temp" : lArr[x] ) + " where 1=2"));
    //                                                }
                                                    
    //                                                mOutPutDataSet = Bl.Bl_ListdbMultipleSQL(lArrToSQl, ,, "CFServer");
    //                                                // mOutPutDataSet = Bl.Bl_ListdbMultipleSQL(lArrToSQl)
    //                                                lCnt = 0;
    //                                                foreach (string lstr in lArr) {
    //                                                    mOutPutDataSet.Tables[lCnt].TableName = lstr;
    //                                                    lCnt = (lCnt + 1);
    //                                                }
                                                    
    //                                            }
    //                                            else {
    //                                                lMessageLinkDataSet = Bl.Bl_Listdb(("SELECT CommaSeparatedEntityName FROM EDIMessage WHERE (StandardMessageIdentifier = \'" 
    //                                                                + (MessageDetails.lMessageType + "\')")));
    //                                                string[] lArr = lMessageLinkDataSet.Tables[0].Rows[0].Item["CommaSeparatedEntityName"].ToString.Split(",");
    //                                                string[,] lArrToSQl;
    //                                                for (x = 0; (x 
    //                                                            <= (lArr.Length - 1)); x++) {
    //                                                    if ((lArr[0] != "")) {
    //                                                        object Preserve;
    //                                                    }
                                                        
    //                                                    lArr[UBound(lArr)];
    //                                                    if ((lArrToSQl[0] != "")) {
    //                                                        object Preserve;
    //                                                    }
                                                        
    //                                                    lArrToSQl[UBound(lArrToSQl)];
    //                                                    //  Dim lstr As String = "Select * From "
    //                                                    // lArrToSQl(x) = lstr & lArr(x).ToString & " where 1=2"
    //                                                    lArrToSQl[x] = ("Select * from " 
    //                                                                + (( (lArr[x] == "Airwaybill_Flight_Temp") ? "AirwayBill_Routing as Airwaybill_Flight_Temp" : lArr[x] ) + " where 1=2"));
    //                                                }
                                                    
    //                                                mOutPutDataSet = Bl.Bl_ListdbMultipleSQL(lArrToSQl);
    //                                                lCnt = 0;
    //                                                foreach (string lstr in lArr) {
    //                                                    mOutPutDataSet.Tables[lCnt].TableName = lstr;
    //                                                    lCnt = (lCnt + 1);
    //                                                }
                                                    
    //                                            }
                                                
    //                                        }
                                            
    //                                        if ((lRegistryDT.Rows[0].Item["Registry_Data_Value"] == "CF")) {
    //                                            if (((MessageDetails.lMessageType == "ASM") 
    //                                                        || ((MessageDetails.lMessageType == "FFR") 
    //                                                        || ((MessageDetails.lMessageType == "FSU") 
    //                                                        || ((MessageDetails.lMessageType == "CSI") 
    //                                                        || ((MessageDetails.lMessageType == "FMB") 
    //                                                        || ((MessageDetails.lMessageType == "FWB") 
    //                                                        || ((MessageDetails.lMessageType == "FZB") 
    //                                                        || (MessageDetails.lMessageType == "FHL"))))))))) {
    //                                                lMessageLinkDataSet = Bl.Bl_Listdb(("Select * from Message_Entity_Link where FKMessageTypeID = (Select MessageID from EDIMessage where Mes" +
    //                                                    "sageVersion like \'%," 
    //                                                                + (MessageDetails.lMessageVersion + (",%\' and StandardMessageIdentifier = \'" 
    //                                                                + (MessageDetails.lMessageType + "\' and SourceDataBase = \'CF\') order by entity_name, Seqnumber")))));
    //                                            }
    //                                            else if ((MessageDetails.lMessageType == "SSM")) {
    //                                                lMessageLinkDataSet = Bl.Bl_Listdb(("Select * from Message_Entity_Link where FKMessageTypeID = (Select MessageID from EDIMessage where Mes" +
    //                                                    "sageVersion like \'%," 
    //                                                                + (MessageDetails.lMessageVersion + (",%\' and StandardMessageIdentifier = \'" 
    //                                                                + (MessageDetails.lMessageType + ("\' and SubMessageIdentifier = \'" 
    //                                                                + (MessageDetails.lMsgSubType + "\' and SourceDataBase = \'CF\') order by entity_name,Seqnumber")))))));
    //                                            }
    //                                            else {
    //                                                // lMessageLinkDataSet = Bl.Bl_Listdb("Select * from Message_Entity_Link where FKMessageTypeID = (Select MessageID from EDIMessage where StandardMessageIdentifier = '" & MessageDetails.lMessageType & "' and SourceDataBase = 'CF') order by Seqnumber") ' ValueSourceFilterCriteria DESC") 'entity_name, Seqnumber")
    //                                                lMessageLinkDataSet = Bl.Bl_Listdb(("Select * from Message_Entity_Link where FKMessageTypeID = (Select MessageID from EDIMessage where Mes" +
    //                                                    "sageVersion like \'%," 
    //                                                                + (MessageDetails.lMessageVersion + (",%\' and StandardMessageIdentifier = \'" 
    //                                                                + (MessageDetails.lMessageType + "\' and SourceDataBase = \'CF\') order by Seqnumber")))));
    //                                            }
                                                
    //                                        }
    //                                        else {
    //                                            // lMessageLinkDataSet = Bl.Bl_Listdb("Select * from Message_Entity_Link where FKMessageTypeID = (Select MessageID from EDIMessage where StandardMessageIdentifier = '" & MessageDetails.lMessageType & "' and SourceDataBase = 'DS') order by entity_name, Seqnumber")
    //                                            lMessageLinkDataSet = Bl.Bl_Listdb(("Select * from Message_Entity_Link where FKMessageTypeID = (Select MessageID from EDIMessage where Mes" +
    //                                                "sageVersion like \'%," 
    //                                                            + (MessageDetails.lMessageVersion + (",%\' and StandardMessageIdentifier = \'" 
    //                                                            + (MessageDetails.lMessageType + "\' and SourceDataBase = \'CF\') order by entity_name, Seqnumber")))));
    //                                        }
                                            
    //                                        string lLastEntityAccessed = "";
    //                                        bool lValueAdded = false;
    //                                        int lLineCounter = -1;
    //                                        for (lOuterCounter = 0; (lOuterCounter 
    //                                                    <= (lMessageLinkDataSet.Tables[0].Rows.Count - 1)); lOuterCounter++) {
    //                                            DataRow lLinkDataRow = lMessageLinkDataSet.Tables[0].Rows[lOuterCounter];
    //                                            Debug.Print(lLinkDataRow.Item["SEQNumber"]);
    //                                            if (IsDBNull(lLinkDataRow.Item["Column_Name"])) {
    //                                                goto 10;
    //                                            }
                                                
    //                                            if ((lLastEntityAccessed != lLinkDataRow.Item["Entity_name"])) {
    //                                                if ((lLastEntityAccessed != "")) {
    //                                                    if (((mOutPutDataSet.Tables[lLastEntityAccessed].Rows.Count == 1) 
    //                                                                && (lValueAdded == false))) {
    //                                                        mOutPutDataSet.Tables[lLastEntityAccessed].Rows[0].Delete();
    //                                                    }
                                                        
    //                                                }
                                                    
    //                                                lLastEntityAccessed = lLinkDataRow.Item["Entity_name"];
    //                                                lValueAdded = false;
    //                                            }
                                                
    //                                            bool lOneRowAdded = false;
    //                                            DataRow[] lArrDataRows = null;
    //                                            if (((MessageDetails.lMessageType == "FFR") 
    //                                                        || ((MessageDetails.lMessageType == "FSU") 
    //                                                        || ((MessageDetails.lMessageType == "CSI") 
    //                                                        || ((MessageDetails.lMessageType == "FMC") 
    //                                                        || ((MessageDetails.lMessageType == "FMB") 
    //                                                        || ((MessageDetails.lMessageType == "UNB") 
    //                                                        || ((MessageDetails.lMessageType == "ASM") 
    //                                                        || ((MessageDetails.lMessageType == "FNA") 
    //                                                        || ((MessageDetails.lMessageType == "FMA") 
    //                                                        || ((MessageDetails.lMessageType == "FWB") 
    //                                                        || ((MessageDetails.lMessageType == "UCM") 
    //                                                        || (MessageDetails.lMessageType == "FFM"))))))))))))) {
    //                                                if ((lLinkDataRow.Item["ValueSourceFilterCriteria"].ToString.Length > 0)) {
    //                                                    lArrDataRows = mMessageData.Tables[0].Select((lLinkDataRow.Item["ValueSourceFilterCriteria"] + " and DataFoundText <> \'\'"), "SEQNumber asc");
    //                                                }
                                                    
    //                                                // and DataFoundText <> '' and DataFound = 'True'
    //                                            }
    //                                            else {
    //                                                if ((lLinkDataRow.Item["ValueSourceFilterCriteria"].ToString.Length > 0)) {
    //                                                    lArrDataRows = mMessageData.Tables[0].Select((lLinkDataRow.Item["ValueSourceFilterCriteria"] + " and DataFoundTEXT <> \'\'"));
    //                                                }
                                                    
    //                                                // and DataFound = 'True'")
    //                                            }
                                                
    //                                            if ((mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count == 0)) {
    //                                                mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.Add(mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].NewRow);
    //                                                lLineCounter = 0;
    //                                                //  lLineCounter + 1
    //                                                lOneRowAdded = true;
    //                                            }
                                                
    //                                            if (!(lArrDataRows == null)) {
    //                                                if ((lArrDataRows.Length == 1)) {
    //                                                    if (((MessageDetails.lMessageType == "FFM") 
    //                                                                && ((MessageDetails.lMessageVersion.ToString == "7") 
    //                                                                || (MessageDetails.lMessageVersion.ToString == "8")))) {
    //                                                        if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'12.1.1\'")) {
    //                                                            if (((lArrDataRows.Length > 0) 
    //                                                                        && (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count >= lArrDataRows.Length))) {
    //                                                                goto AddNewRows;
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'13.3.1\'")) {
    //                                                            if (((lArrDataRows.Length > 0) 
    //                                                                        && (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count >= lArrDataRows.Length))) {
    //                                                                goto AddNewRows;
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'14.1.2\'")) {
    //                                                            if (((lArrDataRows.Length > 0) 
    //                                                                        && (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count >= lArrDataRows.Length))) {
    //                                                                goto AddNewRows;
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'17.9\'")) {
    //                                                            // If lArrDataRows.Length > 0 And mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows.count >= lArrDataRows.Length Then
    //                                                            goto AddNewRows;
    //                                                            // End If
    //                                                        }
                                                            
    //                                                    }
                                                        
    //                                                    // If MessageDetails.lMessageType = "FMB" Then
    //                                                    //     If lLinkDataRow.Item("ValueSourceFilterCriteria") = "CarImpRefNo = '4.3.2'" Or lLinkDataRow.Item("ValueSourceFilterCriteria") = "CarImpRefNo = '5.3.2''" Or lLinkDataRow.Item("ValueSourceFilterCriteria") = "CarImpRefNo = '6.3.2'" Or lLinkDataRow.Item("ValueSourceFilterCriteria") = "CarImpRefNo = '7.3.2'" Then
    //                                                    //         GoTo AddNewRows
    //                                                    //     End If
    //                                                    // End If
    //                                                }
                                                    
    //                                                if ((lArrDataRows.Length > 1)) {
    //                                                    int lCntAddedRows = 0;
    //                                                    if ((lOneRowAdded == true)) {
    //                                                        lCntAddedRows = 1;
    //                                                    }
                                                        
    //                                                    // need to add more rows
    //                                                    if (((MessageDetails.lMessageType == "FSU") 
    //                                                                || ((MessageDetails.lMessageType == "FWB") 
    //                                                                || ((MessageDetails.lMessageType == "FMB") 
    //                                                                || (MessageDetails.lMessageType == "CSI"))))) {
    //                                                        // need to add more rows
    //                                                        if ((mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count < lArrDataRows.Length)) {
    //                                                            // Meaning rows are not added and hence should be added
    //                                                            for (lCnt = 1; (lCnt <= lArrDataRows.Length); lCnt++) {
    //                                                                // For lCnt1 = lCntAddedRows To lArrDataRows.Length - 1
    //                                                                mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.Add(mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].NewRow);
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                    }
    //                                                    else {
    //                                                        // need to add more rows
    //                                                        if (((MessageDetails.lMessageType == "FFM") 
    //                                                                    && ((MessageDetails.lMessageVersion.ToString == "7") 
    //                                                                    || (MessageDetails.lMessageVersion.ToString == "8")))) {
    //                                                            if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'12.1.1\'")) {
    //                                                                if (((lArrDataRows.Length > 0) 
    //                                                                            && (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count >= lArrDataRows.Length))) {
    //                                                                    goto AddNewRows;
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                            if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'13.3.1\'")) {
    //                                                                //    If lArrDataRows.Length > 0 And mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows.count >= lArrDataRows.Length Then
    //                                                                goto AddNewRows;
    //                                                                // End If
    //                                                            }
                                                                
    //                                                            if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'14.1.2\'")) {
    //                                                                if (((lArrDataRows.Length > 0) 
    //                                                                            && (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count >= lArrDataRows.Length))) {
    //                                                                    goto AddNewRows;
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                            if ((lLinkDataRow.Item["ValueSourceFilterCriteria"] == "CarImpRefNo =   \'17.9\'")) {
    //                                                                // If lArrDataRows.Length > 0 And mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows.count >= lArrDataRows.Length Then
    //                                                                goto AddNewRows;
    //                                                                // End If
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        if ((mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count < lArrDataRows.Length)) {
    //                                                            // Meaning rows are not added and hence should be added
    //                                                            // For lCnt = 2 To lArrDataRows.Length
    //                                                        AddNewRows:
    //                                                            for (lCnt1 = lCntAddedRows; (lCnt1 
    //                                                                        <= (lArrDataRows.Length - 1)); lCnt1++) {
    //                                                                mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.Add(mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].NewRow);
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                    }
                                                        
    //                                                }
                                                    
    //                                                if ((lLinkDataRow.Item["Entity_name"] == "EdiMessage_FSU_Ent")) {
    //                                                    lCnt = (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count - 1);
    //                                                    if ((lCnt >= 1)) {
    //                                                        mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[lCnt].Item["AirlinePrefix"] = mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[0].Item["AirlinePrefix"];
    //                                                        mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[lCnt].Item["AWBSerialNumber"] = mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[0].Item["AWBSerialNumber"];
    //                                                        mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[lCnt].Item["Airport_of_Origin"] = mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[0].Item["Airport_of_Origin"];
    //                                                        mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[lCnt].Item["Airport_of_Destination"] = mOutPutDataSet.Tables["EdiMessage_FSU_Ent"].Rows[0].Item["Airport_of_Destination"];
    //                                                    }
                                                        
    //                                                    //   ElseIf lLinkDataRow.Item("Entity_name") = "EDIMessage_FMB_Carriage_Restrictions" Or lLinkDataRow.Item("Entity_name") = "EDIMessage_FMB_Routes" Or lLinkDataRow.Item("Entity_name") = "EDIMessage_FMB_Justification" Or lLinkDataRow.Item("Entity_name") = "EDIMessage_FMB_Commodities" Then
    //                                                }
    //                                                else {
    //                                                    lCnt = 0;
    //                                                }
                                                    
    //                                                // mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows.count - 1
    //                                                // lLineCounter = 0
    //                                                foreach (DataRow lDataRowtemp in lArrDataRows) {
    //                                                    DataRow[] lMessageLineDataRow = lMessageLinkDataSet.Tables[0].Select(("ValueSourceFilterCriteria like " + ("\'%" 
    //                                                                    + (lDataRowtemp.Item["CarImpRefNo"] + "%\'"))), "Seqnumber asc");
    //                                                    if (!IsDBNull(lMessageLineDataRow[0].Item["GroupData"])) {
    //                                                        // lLineCounter = 0
    //                                                        if (lMessageLineDataRow[0].Item["GroupData"].ToString.Contains(".")) {
    //                                                            goto 10;
    //                                                        }
                                                            
    //                                                        foreach (DataRow lArrDataRowInArray in lMessageLinkDataSet.Tables[0].Select(("GroupData like \'" 
    //                                                                        + (lMessageLineDataRow[0].Item["GroupData"] + (".%\' or GroupData = \'" 
    //                                                                        + (lMessageLineDataRow[0].Item["GroupData"] + "\'")))), "SEQNumber ASC")) {
    //                                                            int lCounter;
    //                                                            string lLocalAdditionalFilter = lArrDataRowInArray.Item["AddtionalFilter"].ToString;
    //                                                            lLocalAdditionalFilter = lLocalAdditionalFilter.Replace("#BetweenCurrentSEQAndRange#", (" and SeqNumber >= " 
    //                                                                            + (lDataRowtemp.Item["SEQNumber"] + ("  and SeqNumber <= " 
    //                                                                            + (lDataRowtemp.Item["SEQNumber"] + lMessageLineDataRow[0].Item["RangeString"])))));
    //                                                            lLocalAdditionalFilter = lLocalAdditionalFilter.Replace("#LessThanCurrentSEQ#", (" and SeqNumber <= " + lDataRowtemp.Item["SEQNumber"]));
    //                                                            lLocalAdditionalFilter = lLocalAdditionalFilter.Replace("#VariantCurrentSEQ#", (" and SeqNumber >= " 
    //                                                                            + (lDataRowtemp.Item["SEQNumber"] + ("  and SeqNumber <= " 
    //                                                                            + (lDataRowtemp.Item["SEQNumber"] + lArrDataRowInArray.Item["RangeString"])))));
    //                                                            // Dim lArrMessageDataRow() As DataRow = mMessageData.Tables(0).Select(lArrDataRowInArray.Item("ValueSourceFilterCriteria") & " and DataFound = 'True' " & IIf(lLocalAdditionalFilter = "", "", lLocalAdditionalFilter), IIf(lArrDataRowInArray.Item("OrderBy").ToString = "", "", lArrDataRowInArray.Item("OrderBy").ToString))
    //                                                            DataRow[] lArrMessageDataRow;
    //                                                            if (((MessageDetails.lMessageType == "ASM") 
    //                                                                        || ((MessageDetails.lMessageType == "FBL") 
    //                                                                        || ((MessageDetails.lMessageType == "FHL") 
    //                                                                        || (MessageDetails.lMessageType == "FFM"))))) {
    //                                                                lArrMessageDataRow = mMessageData.Tables[0].Select((lArrDataRowInArray.Item["ValueSourceFilterCriteria"] + ("  and DataFoundText <> \'\' " + ( (lLocalAdditionalFilter == "") ? "" : lLocalAdditionalFilter ))), ( (lArrDataRowInArray.Item["OrderBy"].ToString == "") ? "" : lArrDataRowInArray.Item["OrderBy"].ToString ));
    //                                                            }
    //                                                            else {
    //                                                                lArrMessageDataRow = mMessageData.Tables[0].Select((lArrDataRowInArray.Item["ValueSourceFilterCriteria"] + (" and DataFound = \'True\' " + ( (lLocalAdditionalFilter == "") ? "" : lLocalAdditionalFilter ))), ( (lArrDataRowInArray.Item["OrderBy"].ToString == "") ? "" : lArrDataRowInArray.Item["OrderBy"].ToString ));
    //                                                            }
                                                                
    //                                                            if ((lArrMessageDataRow.Count > 0)) {
    //                                                                switch (lArrDataRowInArray.Item["ValueSourceType"]) {
    //                                                                    case "CONST":
    //                                                                        if ((lArrDataRowInArray.Item["ValueSourceLocation"] == "NULLFIELD")) {
    //                                                                            // mOutPutDataSet.Tables(lArrDataRowInArray.Item("Entity_name")).Rows(lCnt).item(lArrDataRowInArray.Item("Column_Name")) = vbNull
    //                                                                        }
    //                                                                        else {
    //                                                                            mOutPutDataSet.Tables[lArrDataRowInArray.Item["Entity_name"]].Rows[lLineCounter].item[lArrDataRowInArray.Item["Column_Name"]] = lArrDataRowInArray["ValueSourceLocation"];
    //                                                                            //  lArrMessageDataRow(0).Item("ValueSourceLocation") 'lArrMessageDataRow(0).Item(lArrDataRowInArray("ValueSourceLocation")) 'lArrMessageDataRow(0).Item("ValueSourceLocation")
    //                                                                        }
                                                                            
    //                                                                        break;
    //                                                                    case "MESSAGEFILTER":
    //                                                                        if (!IsDBNull(lDataRowtemp.Item[lArrDataRowInArray["ValueSourceLocation"]])) {
    //                                                                            if ((lDataRowtemp.Item[lArrDataRowInArray["ValueSourceLocation"]] != "")) {
    //                                                                                // If mOutPutDataSet.Tables(lArrDataRowInArray.Item("Entity_name")).columns(lArrDataRowInArray.Item("Column_Name")).datatype.name.ToString = "String" Then
    //                                                                                if ((lArrMessageDataRow[0].Item[lArrDataRowInArray["ValueSourceLocation"]] != "")) {
    //                                                                                    mOutPutDataSet.Tables[lArrDataRowInArray.Item["Entity_name"]].Rows[lLineCounter].item[lArrDataRowInArray.Item["Column_Name"]] = lArrMessageDataRow[0].Item[lArrDataRowInArray["ValueSourceLocation"]];
    //                                                                                    lValueAdded = true;
    //                                                                                }
                                                                                    
    //                                                                                // End If
    //                                                                            }
                                                                                
    //                                                                        }
                                                                            
    //                                                                        break;
    //                                                                    case "DATE":
    //                                                                        if (!IsDBNull(lDataRowtemp.Item[lArrDataRowInArray["ValueSourceLocation"]])) {
    //                                                                            if ((lDataRowtemp.Item[lArrDataRowInArray["ValueSourceLocation"]] != "")) {
    //                                                                                // If mOutPutDataSet.Tables(lArrDataRowInArray.Item("Entity_name")).columns(lArrDataRowInArray.Item("Column_Name")).datatype.name.ToString = "String" Then
    //                                                                                //     mOutPutDataSet.Tables(lArrDataRowInArray.Item("Entity_name")).Rows(lCnt).item(lArrDataRowInArray.Item("Column_Name")) = lArrMessageDataRow(0).Item(lArrDataRowInArray("ValueSourceLocation")) & "-" & Now.Month & "-" & Now.Year
    //                                                                                mOutPutDataSet.Tables[lArrDataRowInArray.Item["Entity_name"]].Rows[lCnt].item[lArrDataRowInArray.Item["Column_Name"]] = (Now.Year + ("-" 
    //                                                                                            + (Now.Month + ("-" + lArrMessageDataRow[0].Item[lArrDataRowInArray["ValueSourceLocation"]]))));
    //                                                                                lValueAdded = true;
    //                                                                            }
                                                                                
    //                                                                        }
                                                                            
    //                                                                        break;
    //                                                                    case "NEWLINE":
    //                                                                        if (!IsDBNull(lDataRowtemp.Item[lArrDataRowInArray["ValueSourceLocation"]])) {
    //                                                                            if ((mOutPutDataSet.Tables[lArrDataRowInArray.Item["Entity_name"]].Rows.count > 0)) {
    //                                                                                int lInnerCnt = lCnt;
    //                                                                                if ((lCnt >= 1)) {
    //                                                                                    lInnerCnt = (lInnerCnt - 1);
    //                                                                                }
                                                                                    
    //                                                                                if (!IsDBNull(mOutPutDataSet.Tables[lArrDataRowInArray.Item["Entity_name"]].Rows[lInnerCnt].item[lArrDataRowInArray.Item["Column_Name"]])) {
    //                                                                                    mOutPutDataSet.Tables[lArrDataRowInArray.Item["Entity_name"]].Rows.Add(mOutPutDataSet.Tables[lArrDataRowInArray.Item["Entity_name"]].NewRow);
    //                                                                                }
                                                                                    
    //                                                                            }
                                                                                
    //                                                                        }
                                                                            
    //                                                                        break;
    //                                                                }
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        lLineCounter = (lLineCounter + 1);
    //                                                        lCnt = (lCnt + 1);
    //                                                        //   If lLineCounter > mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows.count - 1 Then If lMessageLineDataRow.Count > 1 Then If lMessageLineDataRow(1).Item("GroupData").ToString.Contains(".") Then If (lMessageLineDataRow(1).Item("SeqNumber").ToString.Contains("148.02") And lMessageLineDataRow(1).Item("Column_Name").ToString = "DIM_Weight_Code") Then lOuterCounter = lOuterCounter + 1 Else If lMessageLineDataRow(1).Item("GroupData").ToString.Contains(".") Then If (lMessageLineDataRow(1).Item("SeqNumber").ToString.Contains("78") And lMessageLineDataRow(1).Item("Column_Name").ToString = "ISO_Country_Code") Then lOuterCounter = lOuterCounter + 1 Else lOuterCounter = lOuterCounter + lLineCounter : Exit For Else Exit For
    //                                                        //   If lLineCounter > mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows.count - 1 Then If lMessageLineDataRow.Count > 1 Then If lMessageLineDataRow(1).Item("GroupData").ToString.Contains(".") Then If (lMessageLineDataRow(1).Item("SeqNumber").ToString.Contains("148.02") And lMessageLineDataRow(1).Item("Column_Name").ToString = "DIM_Weight_Code") Or (lMessageLineDataRow(1).Item("SeqNumber").ToString.Contains("149.02") And lMessageLineDataRow(1).Item("Column_Name").ToString = "ISO_Country_Code") Then lOuterCounter = lOuterCounter + 1 Else lOuterCounter = lOuterCounter + lLineCounter : Exit For Else Exit For
    //                                                        //  If lLineCounter > mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows.count - 1 Then If lMessageLineDataRow.Count > 1 Then If lMessageLineDataRow(1).Item("GroupData").ToString.Contains(".") Then If (lMessageLineDataRow(1).Item("SeqNumber").ToString.Contains("149.02") And lMessageLineDataRow(1).Item("Column_Name").ToString = "ISO_Country_Code") Then lOuterCounter = lOuterCounter + 1 Else lOuterCounter = lOuterCounter + lLineCounter : Exit For Else Exit For
    //                                                        if ((MessageDetails.lMessageType == "FHL")) {
    //                                                            if ((lLineCounter 
    //                                                                        > (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count - 1))) {
    //                                                                if ((lMessageLineDataRow.Count > 1)) {
    //                                                                    if (lMessageLineDataRow[1].Item["GroupData"].ToString.Contains(".")) {
    //                                                                        lOuterCounter = (lOuterCounter + 1);
    //                                                                    }
                                                                        
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                            break;
    //                                                        }
    //                                                        else {
    //                                                            break;
    //                                                        }
                                                            
    //                                                    }
    //                                                    else {
    //                                                        if ((lLineCounter 
    //                                                                    > (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count - 1))) {
    //                                                            if ((lMessageLineDataRow.Count > 1)) {
    //                                                                if (lMessageLineDataRow[1].Item["GroupData"].ToString.Contains(".")) {
    //                                                                    lOuterCounter = (lOuterCounter + lLineCounter);
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        break;
    //                                                    }
                                                        
    //                                                    break;
    //                                                    switch (lLinkDataRow.Item["ValueSourceType"].ToUpper()) {
    //                                                        case "CONST":
    //                                                            if ((lLinkDataRow.Item["ValueSourceLocation"] == "NULLFIELD")) {
    //                                                                // mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows(lCnt).item(lLinkDataRow.Item("Column_Name")) = vbNull
    //                                                            }
    //                                                            else {
    //                                                                mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows[lCnt].item[lLinkDataRow.Item["Column_Name"]] = lLinkDataRow.Item["ValueSourceLocation"];
    //                                                                lValueAdded = true;
    //                                                            }
                                                                
    //                                                            break;
    //                                                        case "MESSAGEFILTER":
    //                                                            if (!IsDBNull(lDataRowtemp.Item[lLinkDataRow["ValueSourceLocation"]])) {
    //                                                                if ((lDataRowtemp.Item[lLinkDataRow["ValueSourceLocation"]] != "")) {
    //                                                                    // If mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).columns(lLinkDataRow.Item("Column_Name")).datatype.name.ToString = "String" Then
    //                                                                    mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows[lCnt].item[lLinkDataRow.Item["Column_Name"]] = lDataRowtemp.Item[lLinkDataRow["ValueSourceLocation"]];
    //                                                                    lValueAdded = true;
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                            break;
    //                                                        case "DATE":
    //                                                            if (!IsDBNull(lDataRowtemp.Item[lLinkDataRow["ValueSourceLocation"]])) {
    //                                                                if ((lDataRowtemp.Item[lLinkDataRow["ValueSourceLocation"]] != "")) {
    //                                                                    // If mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).columns(lLinkDataRow.Item("Column_Name")).datatype.name.ToString = "String" Then  
    //                                                                    //  mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows(lCnt).item(lLinkDataRow.Item("Column_Name")) = lDataRowtemp.Item(lLinkDataRow("ValueSourceLocation")) & "-" & Now.Month & "-" & Now.Year
    //                                                                    mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows[lCnt].item[lLinkDataRow.Item["Column_Name"]] = (Now.Year + ("-" 
    //                                                                                + (Now.Month + ("-" + lDataRowtemp.Item[lLinkDataRow["ValueSourceLocation"]]))));
    //                                                                    // lDataRowtemp.Item(lLinkDataRow("ValueSourceLocation")) & "-" & Now.Month & "-" & Now.Year
    //                                                                    lValueAdded = true;
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                            break;
    //                                                        case "NEWLINE":
    //                                                            if (!IsDBNull(lDataRowtemp.Item[lLinkDataRow["ValueSourceLocation"]])) {
    //                                                                if ((mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count > 0)) {
    //                                                                    int lInnerCnt = lCnt;
    //                                                                    if ((lCnt >= 1)) {
    //                                                                        lInnerCnt = (lInnerCnt - 1);
    //                                                                    }
                                                                        
    //                                                                    if (!IsDBNull(mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows[lInnerCnt].item[lLinkDataRow.Item["Column_Name"]])) {
    //                                                                        mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.Add(mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].NewRow);
    //                                                                    }
                                                                        
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                            break;
    //                                                    }
    //                                                    lCnt = (lCnt + 1);
    //                                                    if ((lCnt 
    //                                                                > (mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows.count - 1))) {
    //                                                        break;
    //                                                    }
                                                        
    //                                                }
                                                    
    //                                            }
    //                                            else if ((lArrDataRows == null)) {
    //                                                switch (lLinkDataRow.Item["ValueSourceType"].ToUpper()) {
    //                                                    case "CONST":
    //                                                        lCnt = 0;
    //                                                        if ((lLinkDataRow.Item["ValueSourceLocation"] == "NULLFIELD")) {
    //                                                            // mOutPutDataSet.Tables(lLinkDataRow.Item("Entity_name")).Rows(lCnt).item(lLinkDataRow.Item("Column_Name")) = vbNull
    //                                                        }
    //                                                        else {
    //                                                            mOutPutDataSet.Tables[lLinkDataRow.Item["Entity_name"]].Rows[lCnt].item[lLinkDataRow.Item["Column_Name"]] = lLinkDataRow.Item["ValueSourceLocation"];
    //                                                            lValueAdded = true;
    //                                                        }
                                                            
    //                                                        break;
    //                                                }
    //                                            }
                                                
    //                                            10;
    //                                        }
                                            
    //                                        lCnt = 0;
    //                                        // TODO: Exit Function: Warning!!! Need to return the value
    //                                        return;
    //                                        //         For Each lDatarow As DataRow In lClsValidateMessage.mMessageData.Tables(0).Rows
    //                                        //             If IsDBNull(lDatarow.Item("Entity_name")) Then GoTo 10
    //                                        //             If lDatarow.Item("Entity_name") = "" Then GoTo 10
    //                                        //             If lCurrentLineNumber = "" Then lCurrentLineNumber = lDatarow.Item("LineIdentifier").ToString
    //                                        //             If lInternalGroupId = "" Then lInternalGroupId = lDatarow.Item("InternalGroupId").ToString
    //                                        //             If mOutPutDataSet.Tables.IndexOf(lDatarow.Item("Entity_name")) = -1 Then
    //                                        //                 'Table does not exits
    //                                        //                 'Create new table
    //                                        //                 ldatatable = bl.Bl_Listdb("select * from " & lDatarow.Item("Entity_name") & " where 1 = 2").Tables(0).Clone
    //                                        //                 ldatatable.TableName = lDatarow.Item("Entity_name")
    //                                        //                 mOutPutDataSet.Tables.Add(ldatatable)
    //                                        //                 mOutPutDataSet.Tables(lDatarow.Item("Entity_name")).Rows.Add(ldatatable.NewRow)
    //                                        //             Else
    //                                        //                 If lCurrentLineNumber = lDatarow.Item("LineIdentifier").ToString And lInternalGroupId <> lDatarow.Item("InternalGroupId").ToString Then
    //                                        //                     ldatatable = mOutPutDataSet.Tables(mOutPutDataSet.Tables.IndexOf(lDatarow.Item("Entity_name")))
    //                                        //                     mOutPutDataSet.Tables(lDatarow.Item("Entity_name")).Rows.Add(ldatatable.NewRow)
    //                                        //                     lInternalGroupId = lDatarow.Item("InternalGroupId").ToString
    //                                        //                 End If
    //                                        //             End If
    //                                        //             mOutPutDataSet.Tables(lDatarow.Item("Entity_name")).Rows(mOutPutDataSet.Tables(lDatarow.Item("Entity_name")).Rows.count - 1).Item(lDatarow.Item("Entity_column")) = lClsValidateMessage.mMessageData.Tables(0).Select("CarImpRefNo = '" & lDatarow.Item("CarImpRefNo") & "'" & IIf(lInternalGroupId <> "", " and InternalGroupId = " & lInternalGroupId, ""))(0).Item("DataFoundText")
    //                                        //             lCurrentLineNumber = lDatarow.Item("LineIdentifier").ToString
    //                                        //             lInternalGroupId = lDatarow.Item("InternalGroupId").ToString
    //                                        // 10:     Next
    //                                        //         Me.DvOutput.DataSource = mOutPutDataSet.Tables(1)
    //                                        //         Me.DvOutput.DataBind()
    //                                    }
                                        
    //                                    CreateDescriptionString(ref ((DataSet)(vDataset)));
    //                                    DataTable lDataTable = Bl.Bl_Listdb("Select * from Audit_Configuration_Ent where FK_Mastername=\'FSU_Ent\'").Tables[0];
    //                                    string lString = "";
    //                                    foreach (DataRow lRow in vDataset.Tables[0].Rows) {
    //                                        foreach (DataColumn lCol in vDataset.Tables[0].Columns) {
    //                                            if (!IsDBNull(lRow.Item[lCol.ColumnName])) {
    //                                                foreach (DataRow lConfiRow in lDataTable.Select(("Column_Technical_Name=\'" 
    //                                                                + (lCol.ColumnName + "\'")))) {
    //                                                    // If lConfiRow.Item("Column_Technical_Name") = lCol.ColumnName Then
    //                                                    lString = (lString 
    //                                                                + (lConfiRow.Item["Column_Display_Name"] + (":" 
    //                                                                + (lRow.Item[lCol.ColumnName] + ";"))));
    //                                                }
                                                    
    //                                            }
                                                
    //                                        }
                                            
    //                                        lRow.Item["Description_String"] = lString;
    //                                    }
                                        
    //                                    ((string)(IdentifyRegexFailureGroup(((string)(vRegex)), ((string)(lValue)))));
    //                                    try {
    //                                        object lRegexArr = vRegex.Split("^");
    //                                        int lGroupSuccessfulCounter = 0;
    //                                        int lMatchGroupCount = 0;
    //                                        int lCount = 1;
    //                                        int lCountOfCloseBrackets = 0;
    //                                        int lCountOfOpenBrackets = 0;
    //                                        string[,] lGroupArray;
    //                                        string lConcatStr = "";
    //                                        int x = 0;
    //                                        string lArryConcatStr = "";
    //                                        bool lValid = false;
    //                                        bool lValidj = false;
    //                                        string lLastSucessfullStringValue = "";
    //                                        string lLastCompleteSucessfullRegex = "";
    //                                        string lErrorAt = "";
    //                                        string lConcatSubGroupStr = "";
    //                                        string[,] lSubGroupArray;
    //                                        string lArrySubConcatStr = "";
    //                                        string lSubValue = "";
    //                                        string lLastSucessfullSubStringValue = "";
    //                                        string lLastCompleteSubSucessfullRegex = "";
    //                                        int lMatchSubGroupCount = 0;
    //                                        bool lMultipleSubGroup = false;
    //                                        bool lMultipleGroup = false;
    //                                        string lRegex;
    //                                        //  Dim lRegexSplitCount As Integer = 0
    //                                        object lGroupCount = 0;
    //                                        for (int lRegexSplitCount = 0; (lRegexSplitCount 
    //                                                    <= (lRegexArr.Length - 1)); lRegexSplitCount++) {
    //                                            lRegex = lRegexArr[lRegexSplitCount];
    //                                            if ((lRegex.ToString == "")) {
    //                                                lRegex = lRegexArr[(lRegexSplitCount + 1)];
    //                                            }
                                                
    //                                        }
                                            
    //                                        for (int i = 0; (i 
    //                                                    <= (lRegex.Length - 1)); i++) {
    //                                            char c = lRegex[i];
    //                                            Console.WriteLine(c);
    //                                            lConcatStr = (lConcatStr + c);
    //                                            if ((c == "(")) {
    //                                                lCount = (lCount + 1);
    //                                                lValid = true;
    //                                            }
                                                
    //                                            if ((c == ")")) {
    //                                                lCount = (lCount - 1);
    //                                                lValid = true;
    //                                            }
                                                
    //                                            if ((lValid == true)) {
    //                                                if ((lCount == 1)) {
    //                                                    lGroupArray[x] = lConcatStr;
    //                                                    if ((lMultipleGroup == true)) {
    //                                                        if (((lGroupArray[x].Split("(").Length - 1) 
    //                                                                    > 1)) {
    //                                                            lMatchGroupCount = (lMatchGroupCount 
    //                                                                        + (lGroupArray[x].Split("(").Length - 2));
    //                                                        }
    //                                                        else {
    //                                                            lMatchGroupCount = (lMatchGroupCount + 1);
    //                                                        }
                                                            
    //                                                    }
    //                                                    else {
    //                                                        lMatchGroupCount = (lMatchGroupCount + 1);
    //                                                    }
                                                        
    //                                                    lArryConcatStr = (lArryConcatStr + lGroupArray[x]);
    //                                                    lConcatStr = "";
    //                                                    lArryConcatStr = lArryConcatStr.Replace("^", "");
    //                                                    lArryConcatStr = lArryConcatStr.Replace("$|", "");
    //                                                    lArryConcatStr = lArryConcatStr.Replace("$", "");
    //                                                    Match lmatch = Regex.Match(lValue, ("^" 
    //                                                                    + (lArryConcatStr + ".*$")));
    //                                                    if ((lmatch.Success == false)) {
    //                                                        lGroupArray[x] = lGroupArray[x].Replace("$|^", "");
    //                                                        if ((lGroupArray[x].Split("(").Length == lGroupArray[x].Split(")").Length)) {
    //                                                            if (((lGroupArray[x].Split("(").Length - 1) 
    //                                                                        == 1)) {
    //                                                                goto ErrorAt;
    //                                                            }
                                                                
    //                                                        }
                                                            
    //                                                        if ((lMultipleSubGroup == false)) {
    //                                                            lGroupArray[x] = lGroupArray[x].Substring(1);
    //                                                            lGroupArray[x] = lGroupArray[x].Remove((lGroupArray[x].Length - 1), 1);
    //                                                        }
                                                            
    //                                                        for (int j = 0; (j 
    //                                                                    <= (lGroupArray[x].Length - 1)); j++) {
    //                                                            char d = lGroupArray[x][j];
    //                                                            Console.WriteLine(d);
    //                                                            lConcatSubGroupStr = (lConcatSubGroupStr + d);
    //                                                            if ((d == "(")) {
    //                                                                lCount = (lCount + 1);
    //                                                                lValidj = true;
    //                                                            }
                                                                
    //                                                            if ((d == ")")) {
    //                                                                lCount = (lCount - 1);
    //                                                                lValidj = true;
    //                                                            }
                                                                
    //                                                            if ((lValidj == true)) {
    //                                                                if ((lCount == 1)) {
    //                                                                    lSubValue = lValue.Substring(lLastSucessfullStringValue.Length);
    //                                                                    lSubGroupArray[j] = lConcatSubGroupStr;
    //                                                                    lArrySubConcatStr = lSubGroupArray[j];
    //                                                                    //   lArrySubConcatStr = lArrySubConcatStr & lSubGroupArray(j)
    //                                                                    lConcatSubGroupStr = "";
    //                                                                    if ((lArrySubConcatStr.StartsWith("(") == false)) {
    //                                                                        lArrySubConcatStr = lArrySubConcatStr.Substring(lArrySubConcatStr.IndexOf("("));
    //                                                                    }
                                                                        
    //                                                                    lArrySubConcatStr = lArrySubConcatStr.Replace("^", "");
    //                                                                    lArrySubConcatStr = lArrySubConcatStr.Replace("$", "");
    //                                                                    Match lmatchSubGroup = Regex.Match(lSubValue, ("^" 
    //                                                                                    + (lArrySubConcatStr + ".*$")));
    //                                                                    if ((lmatchSubGroup.Success == false)) {
    //                                                                        lErrorAt = lValue.Substring(lLastSucessfullStringValue.Length);
    //                                                                        IdentifyRegexFailureGroup = (lArrySubConcatStr + ("==" + lErrorAt));
    //                                                                        // TODO: Exit Function: Warning!!! Need to return the value
    //                                                                        return;
    //                                                                    }
    //                                                                    else {
    //                                                                        lMultipleSubGroup = true;
    //                                                                        lMatchSubGroupCount = (lMatchSubGroupCount + 1);
    //                                                                        if ((lMatchSubGroupCount == 1)) {
    //                                                                            lLastSucessfullStringValue = (lLastSucessfullStringValue + lmatchSubGroup.Groups[lMatchSubGroupCount].Value);
    //                                                                        }
    //                                                                        else {
    //                                                                            lLastSucessfullStringValue = (lLastSucessfullStringValue + lmatchSubGroup.Groups[(lmatchSubGroup.Groups.Count - 1)].Value);
    //                                                                            //   lLastSucessfullStringValue = lLastSucessfullStringValue & lmatchSubGroup.Groups(lMatchSubGroupCount - 1).Value
    //                                                                            //    lLastSucessfullSubStringValue = lLastSucessfullSubStringValue & lmatchSubGroup.Groups(lmatchSubGroup.Groups.Count - 1).Value
    //                                                                            lLastCompleteSubSucessfullRegex = lArrySubConcatStr;
    //                                                                        }
                                                                            
    //                                                                        j = (j - 1);
    //                                                                    }
                                                                        
    //                                                                    j = (j + 1);
    //                                                                }
                                                                    
    //                                                            }
                                                                
    //                                                            lValidj = false;
    //                                                        }
                                                            
    //                                                    }
    //                                                    else {
    //                                                        if ((lMultipleGroup == true)) {
    //                                                            lGroupSuccessfulCounter = (lGroupSuccessfulCounter + 1);
    //                                                        }
                                                            
    //                                                        if ((lMatchGroupCount == 1)) {
    //                                                            lLastSucessfullStringValue = (lLastSucessfullStringValue + lmatch.Groups[lMatchGroupCount].Value);
    //                                                        }
    //                                                        else {
    //                                                            lLastSucessfullStringValue = (lLastSucessfullStringValue + lmatch.Groups[lGroupCount].Value);
    //                                                            //    lLastSucessfullStringValue = lLastSucessfullStringValue & lmatch.Groups((lmatch.Groups.Count - lMatchGroupCount + (IIf(lGroupSuccessfulCounter = 1 And lMultipleGroup = False, 0, lGroupSuccessfulCounter)))).Value   'lmatch.Groups((lmatch.Groups.Count - lMatchGroupCount)).Value
    //                                                            // lLastSucessfullStringValue = lLastSucessfullStringValue & lmatch.Groups(lmatch.Groups.Count - (lmatch.Groups.Count - lMatchGroupCount)).Value
    //                                                            lLastCompleteSucessfullRegex = lArryConcatStr;
    //                                                        }
                                                            
    //                                                        lGroupCount = lmatch.Groups.Count;
    //                                                        lMultipleGroup = true;
    //                                                    }
                                                        
    //                                                    x = (x + 1);
    //                                                    if ((lConcatStr.Split("(").Length == lConcatStr.Split(")").Length)) {
    //                                                        if (((lConcatStr.Split("(").Length - 1) 
    //                                                                    == 1)) {
    //                                                        ErrorAt:
    //                                                            lErrorAt = lValue.Substring(lLastSucessfullStringValue.Length);
    //                                                            IdentifyRegexFailureGroup = lErrorAt;
    //                                                            // lArryConcatStr & "==" & lErrorAt
    //                                                            // TODO: Exit Function: Warning!!! Need to return the value
    //                                                            return;
    //                                                        }
                                                            
    //                                                    }
                                                        
    //                                                }
                                                    
    //                                            }
                                                
    //                                            lValid = false;
    //                                        }
                                            
    //                                    }
    //                                    catch (Exception ex) {
    //                                        string l;
    //                                    }
                                      
    //                                }
                                    
    //                            }
                                
    //                            break;
    //                    }
    //                }
                    
    //            }
                
    //        }
            
    //    }
        
    //}
}