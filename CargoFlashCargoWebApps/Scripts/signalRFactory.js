var signalRHub;
var connection;
var signalR = {
    startHub: function () {
        if (!connection) {
            signalRHub = $.connection.signalrHub;
            connection = $.connection.hub.start().done(function () {
                console.log("Connection Started!");
            });
        }
    },
    ////////////////////// SERVER METHODS////////////////////
    //checkConnection: function () {
    //    connection.done(function () {
    //        signalRHub.server.checkHubConnection();
    //    });
    //},
    userEnterInProcess: function (processObject) {
        connection.done(function () {
            signalRHub.server.userEnterInProcess(processObject);
        });
    },
    updateProcessStatus: function (processObject) {
        connection.done(function () {
            signalRHub.server.updateProcessStatus(processObject);
        });
    },
    ////////////////////// CLIENT METHODS////////////////////
    //testConnection: function (callback) {
    //    signalRHub.client.testConnection = callback;
    //}
    updateProcessList: function (callback) {
        signalRHub.client.updateProcessList = callback;
    },
    getProcessList: function (callback) {
        signalRHub.client.getProcessList = callback;
    }
}

