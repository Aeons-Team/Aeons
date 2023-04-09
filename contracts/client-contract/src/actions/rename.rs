use crate::types::{ ContractState, Rename };
use warp_contracts::handler_result::WriteResult;

pub fn rename(mut state: ContractState, input: Rename) -> WriteResult<ContractState, String> {
    if !state.is_owner() {
        return WriteResult::ContractError("invalid owner".to_string())
    }

    let file = state.hierarchy.get_file_mut(&input.id);

    if file.is_none() {
        return WriteResult::ContractError("file to rename does not exist".to_string())
    }

    file.unwrap().name = input.new_name;
    WriteResult::Success(state)
}