use crate::types::{ ContractState, Insert, File };
use warp_contracts::handler_result::WriteResult;

pub fn insert(mut state: ContractState, input: Insert) -> WriteResult<ContractState, ()> {
    if state.hierarchy.contains(&input.id) {
        return WriteResult::ContractError(())
    }

    state.hierarchy.insert_file(File {
        id: input.id.clone(),
        name: input.name,
        parent_id: input.parent_id.clone(),
        size: input.size,
        children: if input.content_type.eq("folder") { Some(Vec::new()) } else { None },
        content_type: input.content_type,
    });

    let parent_id = input.parent_id.unwrap_or("root".to_string());
    let parent = state.hierarchy.get_file_mut(&parent_id);

    if parent.is_none() || parent.as_ref().unwrap().children.is_none() {
        return WriteResult::ContractError(())
    }

    parent.unwrap().add_child(input.id);

    WriteResult::Success(state)
}