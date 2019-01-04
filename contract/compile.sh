rm Restaurant.bin Restaurant.abi
solc --bin Restaurant.sol | tail -n 5 > Restaurant.bin
solc --abi Restaurant.sol | tail -n 5 > Restaurant.abi

