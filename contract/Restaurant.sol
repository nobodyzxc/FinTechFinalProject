pragma solidity ^0.4.25;

contract Restaurant {

    enum Status { Padding, Finished, Canceled }

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
    event CancelEvent(uint256 indexed id, address indexed shop, address indexed buyer, uint256 price, uint256 timestamp);
    event FinishEvent(uint256 indexed id, address indexed shop, address indexed buyer, uint256 price, uint256 timestamp);

    constructor() public {
        owner = msg.sender;
    }

    modifier isPadding(uint256 id) {
        require(
            orders[id].status == Status.Padding ,
            "order is not padding."
        );
        _;
    }

    modifier onlyShop(uint256 id) {
        require(
            msg.sender == orders[id].shop,
            "Only restaurant can call this."
        );
        _;
    }

    function place(uint256 id, address shop) public payable{
        require(orders[id].buyer == address(0),
                "order has existed");
        orders[id] = Order({
            shop: shop,
            buyer: msg.sender,
            price: msg.value,
            status: Status.Padding
        });
        emit PlaceEvent(id, shop, msg.sender, msg.value, now);
    }


    function finish(uint256 id) public onlyShop(id) isPadding(id) {
        require(orders[id].buyer != address(0),
                "order doesn't exist");
        orders[id].shop.transfer(orders[id].price);
        orders[id].status = Status.Finished;
        emit FinishEvent(id, orders[id].shop, orders[id].buyer, orders[id].price, now);
    }

    function cancel(uint256 id) public onlyShop(id) isPadding(id) {
        require(orders[id].buyer != address(0),
                "order doesn't exist");
        orders[id].buyer.transfer(orders[id].price);
        orders[id].status = Status.Canceled;
        emit CancelEvent(id, orders[id].shop, orders[id].buyer, orders[id].price, now);
    }
}
