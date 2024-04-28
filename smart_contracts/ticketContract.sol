// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


/**
 * @title Owner
 * @dev Set & change owner
 */
contract Owner {

    address private owner;

    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }

    /**
     * @dev Change owner
     * @param newOwner address of new owner
     */
    function changeOwner(address newOwner) public isOwner {
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
} 

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Ticket is Owner {

    error cantBuyMore(uint _ticketId,address user);
    error notAuthorized(uint _ticketId,address user);
    event ticketCreated(uint _ticketId, uint256 _ticketAmt);
    event ticketPurchased(uint _ticketId,uint32 _ticketLeft,address _buyer);
    uint ticketCnt=1; //ticketId
    mapping(uint=>address) public vendors; // ticketId => vendor address
    mapping(uint256 => uint32) public tickets; // ticketId => ticket amount
    mapping(address => uint256[]) public ticketOwners; // owner address => [purchased ticketIds]

    function createTicket(uint32 _ticketAmt,address _vendor) external isOwner {
        require(_ticketAmt > 0,"tickets must be greater than 0.");
        vendors[ticketCnt] = _vendor;
        tickets[ticketCnt++] = _ticketAmt;
        emit ticketCreated(ticketCnt-1,_ticketAmt);
    }

    function isTicketOwner(uint _ticketId,address userAdd) internal view returns (bool){
        for(uint i=0;i<ticketOwners[userAdd].length;i++){
            if(ticketOwners[userAdd][i]==_ticketId){
                return true;
            }
        }
        return false;
    }

    function isTicketVendor(uint _ticketId) internal view returns (bool){
        if(vendors[_ticketId]==msg.sender){
            return true;
        }
        return false;
    }

    function transferTicket(uint32 _ticketId,address _to) external {
        require(tickets[_ticketId] > 0,"sorry no tickets left");
        if(isTicketOwner(_ticketId, _to)){
            revert cantBuyMore(_ticketId,_to);
        }
        if(!isTicketVendor(_ticketId)){
            revert notAuthorized(_ticketId,msg.sender);
        }
        ticketOwners[_to].push(_ticketId);
        tickets[_ticketId] -= 1;
        emit ticketPurchased(_ticketId,tickets[_ticketId],_to);
    }
}