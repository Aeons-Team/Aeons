use std::collections::{ HashMap, HashSet };
use schemars::JsonSchema;
use serde::{ Serialize, Deserialize };

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct File {
    pub id: String,
    pub name: String,
    pub parent_id: Option<String>,
    pub prev_parent_id: Option<String>,
    pub content_type: String,
    pub size: Option<u64>,
    pub created_at: Option<u64>,
    pub children: Option<Vec<String>>,
    pub encryption: Option<String>
}

impl File {
    pub fn add_child(&mut self, child: String) {
        self.children.as_mut().unwrap().push(child);
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
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
            prev_parent_id: None,
            content_type: "folder".to_string(),
            created_at: None,
            size: None,
            children: Some(Vec::new()),
            encryption: None
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

    pub fn contains(&self, id: &String) -> bool {
        self.files.contains_key(id)
    }

    pub fn get_ancestors(&self, id: &String) -> HashSet<String> {
        let root = "root".to_string();
        let mut ancestor = self.get_file(id).unwrap().parent_id.as_ref().unwrap_or(&root);
        let mut ancestors = HashSet::new();

        while !ancestor.eq(&root) {
            ancestors.insert(ancestor.clone());
            ancestor = self.get_file(ancestor).unwrap().parent_id.as_ref().unwrap_or(&root)
        }

        ancestors.insert(root);
        ancestors
    }
}