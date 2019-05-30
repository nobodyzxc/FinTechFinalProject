pragma solidity ^0.4.23;

contract Restaurant {

    enum Status { Pending, Accepted, Finished, Canceled }

    struct Order {
        address shop;
        address buyer;
        uint256 price;
        Status status;
    }

    /* owner is the system */
    address public owner;

    mapping(uint256 => Order) orders;

    event PlaceEvent(uint256 indexed id, address indexed shop, address indexed buyer, uint256 price, uint256 timestamp);
    event AcceptEvent(uint256 indexed id, address indexed shop, address indexed buyer, uint256 price, uint256 timestamp);
    event CancelEvent(uint256 indexed id, address indexed shop, address indexed buyer, uint256 price, uint256 timestamp);
    event FinishEvent(uint256 indexed id, address indexed shop, address indexed buyer, uint256 price, uint256 timestamp);

    constructor() public {
        owner = msg.sender;
    }


    modifier notExist(uint256 id) {
        require(orders[id].buyer == address(0),
                "order has existed");
        _;
    }


    modifier exist(uint256 id) {
        require(orders[id].buyer != address(0),
                "order doesn't exist");
        _;
    }

    modifier isStatus(uint256 id, Status status) {
        require(
            orders[id].status == status,
            "order is not padding.");
        _;
    }

    modifier onlyShop(uint256 id) {
        require(
            msg.sender == orders[id].shop,
            "Only restaurant can call this.");
        _;
    }

    modifier onlyParties(uint256 id) {
        require(
            msg.sender == orders[id].shop
            || msg.sender == orders[id].buyer,
            "Only restaurant or customer can call this.");
        _;
    }

    function place(uint256 id, address shop) public payable notExist(id) {
        orders[id] = Order({
            shop: shop,
            buyer: msg.sender,
            price: msg.value,
            status: Status.Pending
        });
        emit PlaceEvent(id, shop, msg.sender, msg.value, now);
    }

    function accept(uint256 id) public exist(id) onlyShop(id) isStatus(id, Status.Pending) {
        orders[id].status = Status.Accepted;
        emit AcceptEvent(id, orders[id].shop, orders[id].buyer, orders[id].price, now);
    }

    function finish(uint256 id) public exist(id) onlyShop(id) isStatus(id, Status.Accepted) {
        orders[id].shop.transfer(orders[id].price);
        orders[id].status = Status.Finished;
        emit FinishEvent(id, orders[id].shop, orders[id].buyer, orders[id].price, now);
    }

    function cancel(uint256 id) public exist(id) onlyParties(id) {
        if(msg.sender == orders[id].buyer){
            require(orders[id].status == Status.Pending);
        }
        else{
            require(orders[id].status == Status.Pending
                    || orders[id].status == Status.Accepted);
        }
        orders[id].buyer.transfer(orders[id].price);
        orders[id].status = Status.Canceled;
        emit CancelEvent(id, orders[id].shop, orders[id].buyer, orders[id].price, now);
    }
}
