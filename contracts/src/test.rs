#[cfg(test)]
mod tests {
    use crate::types::*;

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
}