use crate::types::{ ContractState, Evolve };
use warp_contracts::{ js_imports::Transaction, handler_result::WriteResult };

pub fn evolve(mut state: ContractState, input: Evolve) -> WriteResult<ContractState, ()> {
    if !state.can_evolve || state.owner != Transaction::owner() {
        return WriteResult::ContractError(())
    }
    
    state.evolve = Some(input.value);
    
    WriteResult::Success(state)
}