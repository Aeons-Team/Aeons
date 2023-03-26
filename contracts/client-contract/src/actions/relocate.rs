use crate::types::{ ContractState, Relocate };
use std::collections::HashSet;
use warp_contracts::handler_result::WriteResult;

pub fn relocate(mut state: ContractState, input: Relocate) -> WriteResult<ContractState, ()> {
    if !state.is_owner() {
        return WriteResult::ContractError(())
    }
    
    let old_parent_id = input.old_parent_id.unwrap_or("root".to_string());
    let new_parent_id = input.new_parent_id.clone().unwrap_or("root".to_string());

    let old_parent = state.hierarchy.get_file_mut(&old_parent_id);

    if old_parent.is_none() || !old_parent.as_ref().unwrap().content_type.eq("folder") {
        return WriteResult::ContractError(())
    }

    let to_remove: HashSet<&String> = HashSet::from_iter(input.ids.iter().clone());
    
    let old_parent = old_parent.unwrap();

    if old_parent.children.is_none() {
        return WriteResult::ContractError(())
    }

    old_parent.children = Some(old_parent.children.as_mut().unwrap().iter().cloned().filter(|id| !to_remove.contains(id)).collect());

    let new_parent = state.hierarchy.get_file_mut(&new_parent_id);

    if new_parent.is_none() || !new_parent.as_ref().unwrap().content_type.eq("folder") {
        return WriteResult::ContractError(())
    }

    let new_parent = new_parent.unwrap();

    input.ids.iter().for_each(|id| new_parent.add_child(id.clone()));

    for id in input.ids.iter() {
        let file = state.hierarchy.get_file_mut(id);

        if file.is_none() {
            return WriteResult::ContractError(())
        }

        file.unwrap().parent_id = input.new_parent_id.clone();
    }

    WriteResult::Success(state)
}