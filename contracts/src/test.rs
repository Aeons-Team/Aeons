#[cfg(test)]
mod tests {
    use crate::types::*;
    use crate::handle;
    use crate::ToState;

    #[test]
    pub fn test_hierarchy() {
        let mut hierarchy = FileHierarchy::new();

        let file_id = "id1".to_string();

        let mut file = File {
            id: file_id.clone(),
            name: "file1".to_string(),
            parent_id: None,
            size: None,
            content_type: "folder".to_string(),
            children: Some(vec![])
        };

        let file2_id = "id2".to_string();

        let file2 = File {
            id: file2_id.clone(),
            name: "file2".to_string(),
            parent_id: None,
            size: None,
            content_type: "image/png".to_string(),
            children: Some(vec![])
        };

        file.add_child(file2_id.clone());

        hierarchy.insert_file(file);
        hierarchy.insert_file(file2);
    
        let file = hierarchy.get_file_mut(&file_id).unwrap();

        assert_eq!(&file2_id, &file.children.as_ref().unwrap()[0]);
    }

    #[test]
    pub fn test_contract() {
        let state = ContractState {
            hierarchy: FileHierarchy::new()
        };

        let state = handle(state, ContractAction {
            function: ContractFunction::Insert(
                Insert { id: "id1".to_string(), name: "file1".to_string(), parent_id: None, content_type: "folder".to_string(), size: None }
            )
        }).to_state();

        let file_1 = state.hierarchy.get_file(&"id1".to_string());
        assert_eq!(&file_1.unwrap().name, "file1");

        let state = handle(state, ContractAction {
            function: ContractFunction::Rename(
                Rename { id: "id1".to_string(), new_name: "file1_renamed".to_string() }
            )
        }).to_state();

        let file_1 = state.hierarchy.get_file(&"id1".to_string());
        assert_eq!(&file_1.unwrap().name, "file1_renamed");

        let state = handle(state, ContractAction {
            function: ContractFunction::Insert(
                Insert { id: "id2".to_string(), name: "file2".to_string(), parent_id: None, content_type: "folder".to_string(), size: None }
            )
        }).to_state();

        let state = handle(state, ContractAction {
            function: ContractFunction::Insert(
                Insert { id: "id3".to_string(), name: "file3".to_string(), parent_id: Some("id1".to_string()), content_type: "image/png".to_string(), size: None }
            )
        }).to_state();

        let state = handle(state, ContractAction {
            function: ContractFunction::Relocate(
                Relocate { ids: vec!["id3".to_string()], old_parent_id: Some("id1".to_string()), new_parent_id: Some("id2".to_string()) }
            )
        }).to_state();

        let file_1 = state.hierarchy.get_file(&"id1".to_string());
        let file_2 = state.hierarchy.get_file(&"id2".to_string());

        assert_eq!(file_1.unwrap().children.as_ref().unwrap().len(), 0);
        assert_eq!(file_2.unwrap().children.as_ref().unwrap()[0], "id3");
    }
}