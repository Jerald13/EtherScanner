// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract durianSupplyChain {
    address public owner;

    uint256 public stockUnit = 0;

    mapping(uint256 => durian) durians;

    enum State {
        ProduceByHarvester,
        PurchasedByDistributor,
        PurchasedByRetailer,
        PurchasedByConsumer,
        RatingByConsumer
    }

    State constant defaultState = State.ProduceByHarvester;

    uint256[] public durianCodeArray;

    struct durian {
        address ownerID;
        uint256 durianCode;
        string durianTree;
        string durianFarm;
        uint256 harvestedDurianPrice;
        uint256 harvestedTime;
        State durianState;
        uint8 taste;
        uint8 creaminess;
    }

    event ProduceByHarvester(uint256 durianCode);
    event PurchasedByDistributor(uint256 durianCode);
    event PurchasedByRetailer(uint256 durianCode);
    event PurchasedByConsumer(uint256 durianCode);
    event RatingByConsumer(uint256 durianCode);

    modifier only_Owner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier verifyCaller(address _address) {
        require(msg.sender == _address, "Only the verified caller can perform this action.");
        _;
    }

    modifier produceByHarvester(uint256 _durianCode) {
        require(
            durians[_durianCode].durianState == State.ProduceByHarvester,
            "Durian is not in the ProduceByHarvester state."
        );
        _;
    }

    modifier purchasedByDistributor(uint256 _durianCode) {
        require(
            durians[_durianCode].durianState == State.PurchasedByDistributor,
            "Durian is not in the PurchasedByDistributor state."
        );
        _;
    }

    modifier purchasedByRetailer(uint256 _durianCode) {
        require(
            durians[_durianCode].durianState == State.PurchasedByRetailer,
            "Durian is not in the PurchasedByRetailer state."
        );
        _;
    }

    modifier purchasedByConsumer(uint256 _durianCode) {
        require(
            durians[_durianCode].durianState == State.PurchasedByConsumer,
            "Durian is not in the PurchasedByConsumer state."
        );
        _;
    }

    modifier ratingByConsumer(uint256 _durianCode) {
        require(
            durians[_durianCode].durianState == State.RatingByConsumer,
            "Durian is not in the RatingByConsumer state."
        );
        _;
    }

    modifier paidEnough(uint256 _price) {
        require(msg.value >= _price, "Insufficient funds sent");
        _;
    }

    modifier durianExists(uint256 _durianCode) {
        require(
            durians[_durianCode].durianCode == _durianCode,
            "Durian with the given code does not exist"
        );
        _;
    }

    modifier checkValue(uint256 _price, address payable addressToFund) {
        require(msg.value >= _price, "Insufficient funds sent");
        uint256 amountToReturn = msg.value - _price;
        addressToFund.transfer(amountToReturn);
        _;
    }

    function getAllDurianCodes() public view returns (uint256[] memory) {
        uint256[] memory codes = new uint256[](durianCodeArray.length);
        for (uint i = 0; i < durianCodeArray.length; i++) {
            codes[i] = durianCodeArray[i];
        }
        return codes;
    }

    constructor() payable {
        owner = msg.sender;
    }

    function _make_payable(address x) internal pure returns (address payable) {
        return payable(address(uint160(x)));
    }

    function produceDurianByHarvester(
        uint256 _durianCode,
        string memory _durianTree,
        string memory _durianFarm,
        uint256 _durianPrice
    ) public {
        durian memory newProduce;
        newProduce.ownerID = msg.sender;
        newProduce.durianCode = _durianCode;
        newProduce.durianTree = _durianTree;
        newProduce.durianFarm = _durianFarm;
        newProduce.harvestedTime = block.timestamp;
        newProduce.harvestedDurianPrice = _durianPrice;
        newProduce.durianState = defaultState;
        durians[_durianCode] = newProduce;

        durianCodeArray.push(_durianCode);

        stockUnit = stockUnit + 1;

        emit ProduceByHarvester(_durianCode);
    }

    function purchaseDurianByDistributor(
        uint256 _durianCode
    )
        public
        payable
        produceByHarvester(_durianCode)
        paidEnough(durians[_durianCode].harvestedDurianPrice)
        checkValue(
            durians[_durianCode].harvestedDurianPrice,
            payable(durians[_durianCode].ownerID)
        )
    {
        address payable ownerAddressPayable = _make_payable(durians[_durianCode].ownerID);
        ownerAddressPayable.transfer(durians[_durianCode].harvestedDurianPrice);
        durians[_durianCode].ownerID = msg.sender;
        durians[_durianCode].durianState = State.PurchasedByDistributor;
        emit PurchasedByDistributor(_durianCode);
    }

    function purchaseDurianByRetailer(
        uint256 _durianCode
    )
        public
        payable
        purchasedByDistributor(_durianCode)
        paidEnough(durians[_durianCode].harvestedDurianPrice)
        checkValue(_durianCode, payable(durians[_durianCode].ownerID))
    {
        address payable ownerAddressPayable = _make_payable(durians[_durianCode].ownerID);
        ownerAddressPayable.transfer(durians[_durianCode].harvestedDurianPrice);
        durians[_durianCode].ownerID = msg.sender;
        durians[_durianCode].durianState = State.PurchasedByRetailer;
        emit PurchasedByRetailer(_durianCode);
    }

    function purchaseDurianByConsumer(
        uint256 _durianCode
    )
        public
        payable
        purchasedByRetailer(_durianCode)
        paidEnough(durians[_durianCode].harvestedDurianPrice)
        checkValue(
            durians[_durianCode].harvestedDurianPrice,
            payable(durians[_durianCode].ownerID)
        )
    {
        address payable ownerAddressPayable = _make_payable(durians[_durianCode].ownerID);
        ownerAddressPayable.transfer(durians[_durianCode].harvestedDurianPrice);
        durians[_durianCode].ownerID = msg.sender;
        durians[_durianCode].durianState = State.PurchasedByConsumer;
        emit PurchasedByConsumer(_durianCode);
    }

    function rateDurianFromConsumer(
        uint256 _durianCode,
        uint8 _taste,
        uint8 _creaminess
    ) public purchasedByConsumer(_durianCode) verifyCaller(durians[_durianCode].ownerID) {
        durians[_durianCode].taste = _taste;
        durians[_durianCode].creaminess = _creaminess;
        durians[_durianCode].durianState = State.RatingByConsumer;
        emit PurchasedByConsumer(_durianCode);
    }

    function fetchDurianBufferOne(
        uint256 _durianCode
    )
        public
        view
        returns (
            uint256 durianToCode,
            address ownerID,
            string memory durianFarm,
            uint256 harvestedTime,
            State durianState,
            string memory durianTree
        )
    {
        durian memory Durian = durians[_durianCode];
        return (
            Durian.durianCode,
            Durian.ownerID,
            Durian.durianFarm,
            Durian.harvestedTime,
            Durian.durianState,
            Durian.durianTree
        );
    }

    function fetchDurianBufferTwo(uint256 _durianCode)
        public
        view
        returns (
            uint256 durianToCode,
            address ownerID,
            uint256 harvestedDurianPrice,
            uint256 harvestedTime,
            uint8 taste,
            uint8 creaminess,
            State durianState

        )
    {
        durian memory Durian = durians[_durianCode];
        return (
            Durian.durianCode,
            Durian.ownerID,
            Durian.harvestedDurianPrice, 
            Durian.harvestedTime,
            Durian.taste,
            Durian.creaminess,
                Durian.durianState
        );
    }
}
