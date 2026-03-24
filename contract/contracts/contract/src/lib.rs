#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    StakingToken,
    RewardToken,
    UserStake(Address),
}

#[contract]
pub struct TokenFarmingContract;

#[contractimpl]
impl TokenFarmingContract {
    /// Initializes the farming contract with the admin and token addresses.
    pub fn initialize(
        env: Env,
        admin: Address,
        staking_token: Address,
        reward_token: Address,
    ) {
        assert!(!env.storage().instance().has(&DataKey::Admin), "Already initialized");
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::StakingToken, &staking_token);
        env.storage().instance().set(&DataKey::RewardToken, &reward_token);
    }

    /// Allows a user to stake a specified amount of the staking token.
    pub fn stake(env: Env, user: Address, amount: i128) {
        user.require_auth();
        assert!(amount > 0, "Amount must be greater than 0");

        let staking_token_addr: Address = env.storage().instance().get(&DataKey::StakingToken).unwrap();
        let staking_token = token::Client::new(&env, &staking_token_addr);

        // Transfer tokens from the user to the contract
        staking_token.transfer(&user, &env.current_contract_address(), &amount);

        // Update user's staked balance
        let key = DataKey::UserStake(user.clone());
        let mut current_stake: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        current_stake += amount;
        env.storage().persistent().set(&key, &current_stake);
    }

    /// Allows a user to withdraw their staked tokens.
    pub fn withdraw(env: Env, user: Address, amount: i128) {
        user.require_auth();
        
        let key = DataKey::UserStake(user.clone());
        let mut current_stake: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        assert!(current_stake >= amount, "Insufficient staked balance");

        // Update balance before transfer to prevent reentrancy-like logic bugs
        current_stake -= amount;
        env.storage().persistent().set(&key, &current_stake);

        let staking_token_addr: Address = env.storage().instance().get(&DataKey::StakingToken).unwrap();
        let staking_token = token::Client::new(&env, &staking_token_addr);

        // Transfer tokens back to the user
        staking_token.transfer(&env.current_contract_address(), &user, &amount);
    }

    /// A basic mock function for claiming rewards. 
    /// In production, rewards should be calculated mathematically based on time and staked amount.
    pub fn claim(env: Env, user: Address) {
        user.require_auth();
        
        let key = DataKey::UserStake(user.clone());
        let current_stake: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        assert!(current_stake > 0, "No tokens staked");

        // Mock reward calculation: 10% of staked amount per claim (for demonstration purposes only)
        let reward_amount = current_stake / 10; 

        let reward_token_addr: Address = env.storage().instance().get(&DataKey::RewardToken).unwrap();
        let reward_token = token::Client::new(&env, &reward_token_addr);

        // Transfer reward tokens from the contract to the user
        // (Note: The contract must be funded with reward tokens by the admin beforehand)
        reward_token.transfer(&env.current_contract_address(), &user, &reward_amount);
    }
}