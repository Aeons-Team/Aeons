use crate::types::{ ContractState, Relocate };
use std::collections::HashSet;
use warp_contracts::handler_result::WriteResult;

pub fn relocate(mut state: ContractState, input: Relocate) -> WriteResult<ContractState, String> {
    if !state.is_owner() {
        return WriteResult::ContractError("invalid owner".to_string())
    }
    
    let old_parent_id = input.old_parent_id.unwrap_or("root".to_string());
    let new_parent_id = input.new_parent_id.clone().unwrap_or("root".to_string());

    let ancestors = state.hierarchy.get_ancestors(&new_parent_id);

    for id in input.ids.iter().as_ref() {
        if ancestors.contains(id) {
            return WriteResult::ContractError("invalid relocation".to_string())
        }
    }

    let old_parent = state.hierarchy.get_file_mut(&old_parent_id);

    if old_parent.is_none() || !old_parent.as_ref().unwrap().content_type.eq("folder") {
        return WriteResult::ContractError("old parent is null or not a folder".to_string())
    }

    let to_remove: HashSet<&String> = HashSet::from_iter(input.ids.iter().clone());
    
    let old_parent = old_parent.unwrap();
    let old_parent_initial_len = old_parent.children.as_ref().unwrap().len();

    old_parent.children = Some(old_parent.children.as_mut().unwrap().iter().cloned().filter(|id| !to_remove.contains(id)).collect());

    if old_parent_initial_len - input.ids.len() != old_parent.children.as_ref().unwrap().len() {
        return WriteResult::ContractError("invalid move".to_string())
    }

    let new_parent = state.hierarchy.get_file_mut(&new_parent_id);

    if new_parent.is_none() || !new_parent.as_ref().unwrap().content_type.eq("folder") {
        return WriteResult::ContractError("new parent is null or not a folder".to_string())
    }

    let new_parent = new_parent.unwrap();

    input.ids.iter().for_each(|id| new_parent.add_child(id.clone()));

    for id in input.ids.iter() {
        let file = state.hierarchy.get_file_mut(id);

        if file.is_none() {
            return WriteResult::ContractError("file to relocate does not exist".to_string())
        }

        let file = file.unwrap();
        
        file.prev_parent_id = file.parent_id.clone();
        file.parent_id = input.new_parent_id.clone();
    }

    WriteResult::Success(state)
}