use crate::types::{ ContractState, SetInternalOwner };
use warp_contracts::handler_result::WriteResult;

pub fn set_internal_owner(mut state: ContractState, input: SetInternalOwner) -> WriteResult<ContractState, ()> {
    if !state.is_direct_owner() {
        return WriteResult::ContractError(())
    }

    state.internal_owner = Some(input.value);

    WriteResult::Success(state)
}