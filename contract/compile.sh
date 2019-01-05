rm -f Restaurant.bin Restaurant.abi
solc --bin Restaurant.sol | tail -n +4 > Restaurant.bin
solc --abi Restaurant.sol | tail -n +4 > Restaurant.abi

