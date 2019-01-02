pragma solidity ^0.4.23;

contract Order {
    address public seller;
    address public buyer;
    uint public value;
    uint public orderid;
    enum State { Created, Locked, Inactive }
    State public state;

    constructor() public payable {
        seller = msg.sender;
        value = msg.value;
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "Only buyer can call this."
        );
        _;
    }

    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    /// seller abort the deal buyer reclain money

    function abort()
        public
        onlySeller
        inState(State.Locked)
    {
        emit Aborted();
        state = State.Created;
        buyer.transfer(address(this).balance);
    }

    /// buyer confirm purchase and lock the deal

    function confirmPurchase(uint256 x)
        public
        inState(State.Created)
        payable
    {
        emit PurchaseConfirmed();
        buyer = msg.sender;
        orderid = x;
        state = State.Locked;
    }

    /// buyer confirm received product and confirm transfer

    function confirmReceived()
        public
        onlyBuyer
        inState(State.Locked)
    {
        emit ItemReceived();
        state = State.Inactive;

        buyer.transfer(value);
        seller.transfer(address(this).balance);
        state = State.Created;
    }
}
