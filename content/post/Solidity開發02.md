---
title: "Solidity開發02"
date: 2021-12-25T14:06:01+08:00
draft: false

tags: ["Solidity"]
categories: ["區塊鏈"]
author: "w0x7ce"
---

```
pragma solidity ^0.4.25;
contract Meow_test{
    int cc;
    string namename;
    string name;
    address owner;
    uint public rename_counter;
    bool isVaild;

    uint balance;
    string information;

    event LogCreate(string information,uint balance);
    event LogCreateINdex(string indexed information,uint indexed balance);
    event LogCreate_name_balance(string name,uint balance);
    event LogCreate_b(uint b);

    constructor() public {
        name="unknown";
        owner=msg.sender;
        rename_counter=0;
        isVaild = true;

        information = "default";
        balance = 100;

        emit LogCreate(information,balance);
        emit LogCreateINdex(information,balance);
        
    }


    function fb() public payable{
        //emit LogCreate_name_balance(name,balance);
        emit LogCreate_b(address(this).balance);
    }

    //fallback function 收钱 未定义函数
    function() public payable{
        emit LogCreate_b(address(this).balance);
    }


   // name = namename;
    function setname(string _name) public returns(string){
        if(msg.sender == owner){
            name=_name;
        }
        else{
            revert("WTF");
        }
        return name;
    }

    //view 可读 但是不修改
    //pure 不可读不可修改 纯函数

    function setname_view(string _name) public view returns(string){
        if(msg.sender == owner){
            name=_name;
            rename_counter+=1;
        }
        else{
            revert("WTF");
        }
        return name;
    }
 
    function getname()public view  returns (string){
        return name ;
       // return address(this).balance;  
    }


    //better way to change name


    modifier Change_name(){
        require(msg.sender==owner,"WTF U CANT");
        rename_counter+=1;
        _;
    }

    function setname_better(string _name) public Change_name returns(string ){
        name=_name;
    }


    //////
    modifier Change_name_fix(address _addr){
        require(_addr==owner,"WTF U CANT");
        rename_counter+=1;
        _;
    }
    function setname_better_fix(string _name) public Change_name_fix(msg.sender) returns(string ){
        name=_name;
    }
    ////
 

    ///
    function fail_1() public returns(int){
        isVaild = false;
        require(isVaild,"REQUIRE");
    }

    function fail_2() public returns(int){
        isVaild = false;
        revert("REVERT");
    }

    function fail_3() public returns(int){
        isVaild = false;
        assert(isVaild);
    }

    function hi() public  returns (int gg){
       gg=cc; 
    }

    function hi_pub(int a,int c) public pure returns (int bb){
        bb=a+1;
       // cc=bb;

    }
    function hi_ext(int a,int c) external returns (int bb){
        bb=a+1;
        cc=cc+1;
    }

   
}

```