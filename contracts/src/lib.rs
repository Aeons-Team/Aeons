pub mod actions;
pub mod types;
pub mod test;

use actions::*;
use types::*;
use warp_contracts::{ warp_contract, handler_result::WriteResult };

trait ToState<T, E> {
    fn to_state(self) -> T;
}

impl<T, E> ToState<T, E> for WriteResult<T, E> {
    fn to_state(self) -> T {
        match self {
            WriteResult::Success(state) => state,
            _ => panic!("interaction successful")
        }
    }
}

#[warp_contract(write)]
pub fn handle(state: ContractState, action: ContractAction) -> WriteResult<ContractState, ()> {
    match action.function {
        ContractFunction::Insert(input) => insert(state, input),
        ContractFunction::Relocate(input) => relocate(state, input),
        ContractFunction::Rename(input) => rename(state, input)
    }   
}