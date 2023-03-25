pub mod actions;
pub mod types;
pub mod test;

use actions::*;
use types::*;
use warp_contracts::{ warp_contract, handler_result::WriteResult };

#[warp_contract(write)]
pub fn handle(state: ContractState, action: ContractAction) -> WriteResult<ContractState, ()> {
    match action {
        ContractAction::Insert(input) => insert(state, input),
        ContractAction::Relocate(input) => relocate(state, input),
        ContractAction::Rename(input) => rename(state, input),
        ContractAction::Evolve(input) => evolve(state, input)
    }   
}