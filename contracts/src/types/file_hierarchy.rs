use std::collections::HashMap;
use serde::{ Serialize, Deserialize };

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct File {
    pub id: String,
    pub name: String,
    pub parent_id: Option<String>,
    pub content_type: String,
    pub size: Option<u64>,
    pub children: Option<Vec<String>>
}

impl File {
    pub fn add_child(&mut self, child: String) {
        self.children.as_mut().unwrap().push(child);
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileHierarchy {
    pub files: HashMap<String, File>
}

impl FileHierarchy {
    pub fn new() -> FileHierarchy {
        let mut hierarchy = FileHierarchy {
            files: HashMap::new()
        };

        hierarchy.insert_file(File {
            id: "root".to_string(),
            name: "root".to_string(),
            parent_id: None,
            content_type: "folder".to_string(),
            size: None,
            children: Some(Vec::new())
        });

        hierarchy
    }

    pub fn get_file(&self, id: &String) -> Option<&File> {
        let file = self.files.get(id);
        file
    }

    pub fn get_file_mut(&mut self, id: &String) -> Option<&mut File> {
        let file = self.files.get_mut(id);
        file
    }

    pub fn insert_file(&mut self, file: File) {
        self.files.insert(file.id.clone(), file);
    }
}