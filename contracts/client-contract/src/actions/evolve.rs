use crate::types::{ ContractState, Evolve };
use warp_contracts::handler_result::WriteResult;

pub fn evolve(mut state: ContractState, input: Evolve) -> WriteResult<ContractState, String> {
    if !state.can_evolve || !state.is_direct_owner() {
        return WriteResult::ContractError("invalid owner".to_string())
    }
    
    state.evolve = Some(input.value);
    
    WriteResult::Success(state)
}