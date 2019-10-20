# Team-15

Trojan DAO

## Motivation

## Contract Structure

`TrojanToken.sol` is an ERC20-compliant token contract with a built-in bonding curve. This token is used as the "approved token" for the Trojan DAO main contract. TROJ tokens can be minted through the contract, which uses a bonding curve as an automated market maker.

The minting process is subject to a 2% DAO tax, where the tax amount is deposited into the Trojan Pool, a follow-on funding contract that mirrors the investments of the Trojan DAO. Burning tokens similarly is taxed 3% to the DAO. Transfers of the token are subject to a 1% "redistribution" tax, whereby the tax is redistributed to all the token holders.

This project demonstrates that the bonding curve based token can be used to automatically grant the DAO with funding when it is minted and burned.

## TODOs
* The `TrojanDao.sol` contract depends on the `TrojanToken.sol` contract, which depends on the `TrojanPool.sol` contract, which depends on the `TrojanDao.sol` contract. To work around this circular dependency, we had to add a `setTrojanPool` function. This is horrible for security purposes.
* The `TrojanToken.sol` contract needed to bootstrap the creator with tokens, in order to make testing easier. This should also be fixed for production.
* The TrojanToken contract can deposit funds into the Pool, but it cannot exit them. One way to exit the shares is by making a proxy contract that can receive a grant from the Trojan DAO and then call a function in the TrojanToken contract that will exit the funds.
* The UI needs to integrate the TrojanToken methods.