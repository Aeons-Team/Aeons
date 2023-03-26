use crate::types::{ ContractState, Evolve };
use warp_contracts::handler_result::WriteResult;

pub fn evolve(mut state: ContractState, input: Evolve) -> WriteResult<ContractState, ()> {
    if !state.can_evolve || !state.is_owner() {
        return WriteResult::ContractError(())
    }
    
    state.evolve = Some(input.value);
    
    WriteResult::Success(state)
}