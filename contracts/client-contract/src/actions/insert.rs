use crate::types::{ ContractState, Insert, File };
use warp_contracts::{ js_imports::Transaction, handler_result::WriteResult };

pub fn insert(mut state: ContractState, input: Insert) -> WriteResult<ContractState, String> {
    if !state.is_owner() {
        return WriteResult::ContractError("invalid owner".to_string())
    }
    
    let id = input.id.unwrap_or(Transaction::id());

    if state.hierarchy.contains(&id) {
        return WriteResult::ContractError("file is already in the hierarchy".to_string())
    }

    state.hierarchy.insert_file(File {
        id: id.clone(),
        name: input.name,
        parent_id: input.parent_id.clone(),
        prev_parent_id: None,
        size: input.size,
        children: if input.content_type.eq("folder") { Some(Vec::new()) } else { None },
        created_at: input.created_at,
        content_type: input.content_type,
        encryption: input.encryption,
    });

    let parent_id = input.parent_id.unwrap_or("root".to_string());
    let parent = state.hierarchy.get_file_mut(&parent_id);

    if parent.is_none() || parent.as_ref().unwrap().children.is_none() {
        return WriteResult::ContractError("parent does not exist".to_string())
    }

    parent.unwrap().add_child(id);

    WriteResult::Success(state)
}