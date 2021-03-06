var testFoundationContract = "0xdd1c6c4fff2efd226f5f4df60b6ae5848b7973d6";

var DebtData = artifacts.require("./DebtData.sol");
var FriendData = artifacts.require("./FriendData.sol");
var DebtReader = artifacts.require("./DebtReader.sol");
var FriendReader = artifacts.require("./FriendReader.sol");
var Flux = artifacts.require("./Flux.sol");
var Fid = artifacts.require("./Fid.sol");

var ropstenFoundationContract = "0x406b716b01ab7c0acc75ceb9fadcc48ce39f5550";

var oneGwei = 1000000000; //9 zeros
var fiveGwei = 5000000000; //9 zeros
var tenGwei = 10000000000; //10 zeros
var contractGasLimit = 4390000; //4.39M
var fnGasLimit = 1000000; //1.0M

var instance;
var admin = "timgalebach";
var metamaskAddr = "0x406Dd5315e6B63d6F1bAd0C4ab9Cd8EBA6Bb1bD2";
var currency = "USD";

module.exports = function(deployer, network, accounts) {
    if ( network == "testrpc" ) {
        var user2 = "timg"; //also admin2
        var user3 = "jaredb";
        var account1 = accounts[0];
        var account2 = accounts[1];
        var account3 = accounts[2];
        var flux;

        deployer.deploy(DebtData, account2, {from: account1}).then(function() {
            return deployer.deploy(FriendData, account2, {from: account1});
        }).then(function() {
            return deployer.deploy(FriendReader, FriendData.address);
        }).then(function() {
            return deployer.deploy(DebtReader, DebtData.address, FriendReader.address, testFoundationContract);
        }).then(function() {
            return deployer.deploy(Flux, admin, DebtData.address, FriendData.address, FriendReader.address, testFoundationContract);
        }).then(function() {
            return deployer.deploy(Fid, admin, testFoundationContract, DebtData.address, FriendReader.address);
        });
        deployer.then(function() {
            return DebtData.deployed();
        }).then(function(dd) {
            return dd.setFluxContract(Flux.address, {from: account1});
        }).then(function(tx) {
            return FriendData.deployed();
        }).then(function(fd) {
            return fd.setFluxContract(Flux.address, {from: account1});
        }).then(function(tx) {
            return Fid.deployed();
        }).then(function(fid) {
            return fid.setIdUcac(Fid.address, {from: account1});
        }).then(function(tx) {
            return Flux.deployed();
        }).then(function(f) {
            flux = f;
            return flux.addFriend(Fid.address, user2, user3, {from: account2});
        }).then(function(tx) {
            return flux.addFriend(Fid.address, user3, user2, {from: account3});
        });
    }

    if ( network == "ropsten" ) {
        var contractData =  {from: accounts[0],
                             gas: contractGasLimit,
                             gasPrice: fiveGwei};
        var fnData = {from: accounts[0],
                      gas: fnGasLimit,
                      gasPrice: fiveGwei};

        deployer.deploy(DebtData, metamaskAddr, contractData).then(function() {
            return deployer.deploy(FriendData, metamaskAddr, contractData);
        }).then(function() {
            return deployer.deploy(FriendReader, FriendData.address, contractData);
        }).then(function() {
            return deployer.deploy(DebtReader, DebtData.address, FriendReader.address, ropstenFoundationContract, contractData);
        }).then(function() {
            return deployer.deploy(Flux, admin, DebtData.address, FriendData.address, FriendReader.address, ropstenFoundationContract, contractData);
        }).then(function() {
            return deployer.deploy(Fid, admin, ropstenFoundationContract, DebtData.address, FriendReader.address, contractData);
        });
        deployer.then(function() {
            return DebtData.deployed();
        }).then(function(dd) {
            return dd.setFluxContract(Flux.address, fnData);
        }).then(function(tx) {
            return FriendData.deployed();
        }).then(function(fd) {
            return fd.setFluxContract(Flux.address, fnData);
        }).then(function(tx) {
            return Fid.deployed();
        }).then(function(fid) {
            return fid.setIdUcac(Fid.address, fnData);
        });
    }

    if ( network == "ropstenNoData" ) {
        var contractData =  {from: accounts[0],
                             gas: contractGasLimit,
                             gasPrice: fiveGwei};
        var fnData = {from: accounts[0],
                      gas: fnGasLimit,
                      gasPrice: fiveGwei};

        var ddataContract   = "0xb86341e3330abc4221552635ba20f1e6fbd41c9f";
        var fdataContract   = "0x3719413d1bda8a80f3bcbba49b6c48d5de88a3d7";
        var idUcac          = "0xeedb62eb265d2b42556ecd83324fe020d4731c19";

        deployer.deploy(FriendReader, fdataContract, contractData).then(function() {
            return deployer.deploy(DebtReader, ddataContract, FriendReader.address, ropstenFoundationContract, contractData);
        }).then(function() {
            return deployer.deploy(Flux, admin, ddataContract, fdataContract, FriendReader.address, ropstenFoundationContract, contractData);
        }).then(function() {
            return deployer.deploy(Fid, admin, ropstenFoundationContract, ddataContract, FriendReader.address, contractData);
        });
        deployer.then(function() {
            return DebtData.at(ddataContract);
        }).then(function(r) {
            return r.setFluxContract(Flux.address, fnData);
        }).then(function(tx) {
            return FriendData.at(fdataContract);
        }).then(function(r) {
            return r.setFluxContract(Flux.address, fnData);
        }).then(function(d) {
            return Fid.deployed();
        }).then(function(r) {
            return r.setIdUcac(idUcac, fnData);
        });
    }

    if ( network == "ropstenFidOnly" ) {
        var contractData =  {from: accounts[0],
                             gas: contractGasLimit,
                             gasPrice: fiveGwei};
        var fnData = {from: accounts[0],
                      gas: fnGasLimit,
                      gasPrice: fiveGwei};

        var ddataContract   = "0xb86341e3330abc4221552635ba20f1e6fbd41c9f";
        var freaderContract = "0xe1ee0b302912b9261db349dfa153b50165dcf616";
        var idUcac          = "0xeedb62eb265d2b42556ecd83324fe020d4731c19";

        deployer.deploy(Fid, admin, ropstenFoundationContract, ddataContract, freaderContract, contractData);
        deployer.then(function() {
            return Fid.deployed();g
        }).then(function(r) {
            return r.setIdUcac(idUcac, fnData);
        });
    }
};
