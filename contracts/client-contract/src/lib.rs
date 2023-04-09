pub mod actions;
pub mod types;

use actions::*;
use types::*;
use warp_contracts::{ warp_contract, handler_result::WriteResult };

#[warp_contract(write)]
pub fn handle(state: ContractState, action: ContractAction) -> WriteResult<ContractState, String> {
    match action {
        ContractAction::Insert(input) => insert(state, input),
        ContractAction::Relocate(input) => relocate(state, input),
        ContractAction::Rename(input) => rename(state, input),
        ContractAction::Evolve(input) => evolve(state, input),
        ContractAction::SetInternalOwner(input) => set_internal_owner(state, input)
    }   
}